import { AWS_BUCKET_NAME, AWS_REGION } from "@/config";
import Message from "@/models/message.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { deleteS3File, s3client } from "@/utils/s3service";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";


// Create a new message
export const createMessage = async (req: Request, res: Response) => {
  // Destructure data from the request body
    const { MessageTitle, description,YouTube_Url} = req.body;
    const Banner = req.file;

    if (!MessageTitle) {
      return res.status(400).json({ error: "MessageTitle required field" });
    }

    if (!description) {
      return res.status(400).json({ error: "description required field" });
    }

    if (!YouTube_Url) {
      return res.status(400).json({ error: "YouTube_Url required field" });
    }

    if (!Banner) {
      return res.status(400).json({ error: "Banner required file" });
    }
  
    console.log(Banner)
    const file2Name = Banner.originalname;//// Extract original file name and sanitize it
    console.log(file2Name)
    const BannerName = sanitizeFileName(file2Name);
    
    const Bannerkey = `${uuidv4()}-${BannerName}`
    console.log(Bannerkey)
    // Upload the image to S3 bucket
    try {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${Bannerkey}`,
      Body: Banner.buffer,
      ContentType: Banner.mimetype,
      
    };
    const command1 = new PutObjectCommand(params);
    const uploaded1 = await s3client.send(command1);
    // Create a new message in the database with the uploaded banner key
      const MessageDetails = await Message.create({
        MessageTitle,
        BannerKey: Bannerkey,
        description,
        YouTube_Url,
        Banner_Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`
      });
       // Respond with the created message details
      res.status(201).json(MessageDetails);
    } catch (error) {
       // Handle errors during the S3 upload or message creation
      res.status(500).json({ error: "Failed to create the message" });
    }
  };


// Get all messages

export const getall = async(req,res) =>{
    try{
      // Retrieve all messages from the database
        const messages=  await Message.find();
        // Respond with the retrieved messages
        res.status(200).json(messages)
    }catch(error){
      // Handle errors during message retrieval
        res.status(500).json("error")
    }

}
// Update a message by its ID
export const UpdateMessage = async(req,res) => {
    try{
        const {id} = req.params;
        const {title,description,url } = req.body;
        // Find and update the message in the database
        const message = await Message.findByIdAndUpdate({_id: id},{$set:{title,description,url}}, {new:true})
        await message.save();//Save the updated message
        res.status(200).json(message);//// Respond with the updated message details
    }catch(error){
// Handle errors during message update
        res.status(500).json("error")
    }
}


// Delete a message by its ID
export const deleteMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the details of the song before deletion
    const deletedMessage = await Message.findById(id);
    // console.log(deletedMessage);
    if (!deletedMessage) {
      return res.status(404).json({ error: " Message not found" });
    }

    // Delete the associated files from S3
     await deleteS3File(deletedMessage.BannerKey);

    // Delete the song from the database
    const deleteMessage = await Message.deleteOne({ _id: id });
// Check if the deletion was successful (deletedCount === 1)
    if (deleteMessage.deletedCount === 1) {
       // If successful, respond with a success message
      return res.status(200).json({
        success: `Message '${deletedMessage.MessageTitle}' and associated files deleted successfully`,
      });
    } else {
      // If deletion was not successful, respond with a 500 error
      return res.status(500).json({ error: "Error deleting Message" });
    }
  } catch (error) {
    // Handle any errors that occurred during the deletion process
    return res.status(500).json({ error: "Error deleting Message details" });
  }
};




export const getMessageByName = async (req, res) => {
    // Extract the name parameter from the request
    const { name } = req.params;
    // Convert the name to lowercase for a case-insensitive search
    const lowercaseTitle = name.toLowerCase();
  
    try {
      const MessageDetails = await Message.find({ MessageTitle: lowercaseTitle });
  
      const MessageDetailsbyWord = await Message.find({
        MessageTitle: { $regex: new RegExp(lowercaseTitle, "i") },
      });
  
      // Check if there are no exact matches
      if (MessageDetails.length === 0 && MessageDetailsbyWord.length === 0) {
        return res.status(404).send({message: "No messages found"});
      } else if (MessageDetails.length === 0) {
        return res.status(200).json(MessageDetailsbyWord);
      } else if (MessageDetailsbyWord.length === 0) {
        // Check if there are no partial matches
        return res.status(200).json(MessageDetailsbyWord);
      } else {
        // Both exact and partial matches found
        const results = {
            MessageDetails,
            MessageDetailsbyWord,
        };
        res.status(200).json({
          success: "successfully",
          results,
        }); 
      }
    } catch (error) {
      // Respond with a 500 error and an error message
      res.status(500).json({ error: "Error retrieving message details" });
    }
  };
  

  export const getMessageById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find a message by ID
      const message = await Message.findById(id);
  
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      res.status(200).json(message);
    } catch (error) {
      // Handle any errors that occurred during the retrieval process
      console.error(error);
      res.status(500).json({ error: "Error retrieving message details" });
    }
  };
  
