import { AWS_BUCKET_NAME, AWS_REGION } from "@/config";
// import Video from "@/models/video.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { deleteS3File, s3client } from "@/utils/s3service";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Video from "@/models/video.model";

 
export const createVideo = async (req: Request, res: Response) => {
  // Destructure data from the request body
    const { VideoTitle, description,YouTube_Url} = req.body;
    const Banner = req.file;

    if (!YouTube_Url) {
      return res.status(400).json({ error: "YouTube_Url required field" });
    }

    if (!VideoTitle) {
      return res.status(400).json({ error: "VideoTitle required field" });
    }

    if (!description) {
      return res.status(400).json({ error: "description required field" });
    }

    if (!Banner) {
      return res.status(400).json({ error: "Banner required file" });
    }
  
    // console.log(Banner)
    const file2Name = Banner.originalname;//// Extract original file name and sanitize it
    // console.log(file2Name)
    const BannerName = sanitizeFileName(file2Name);
    
    const Bannerkey = `${uuidv4()}-${BannerName}`
    // console.log(Bannerkey)
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
      const VideoDetails = await Video.create({
        VideoTitle,
        BannerKey: Bannerkey,
        description,
        YouTube_Url,
        Banner_Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`
      });
       // Respond with the created message details
      res.status(201).json(VideoDetails);
    } catch (error) {
       // Handle errors during the S3 upload or message creation
      res.status(500).json({ error: "Failed to create the video" });
    }
  };


// Get all messages

export const getall = async(req,res) =>{
    try{
      // Retrieve all messages from the database
        const Videos=  await Video.find();
        // Respond with the retrieved messages
        res.status(200).json(Videos)
    }catch(error){
      // Handle errors during message retrieval
        res.status(500).json("error")
    }

}
// Update a message by its ID
export const UpdateVideo = async(req,res) => {
    try{
        const {id} = req.params;
        const {title,description,url } = req.body;
        // Find and update the message in the database
        const Videos = await Video.findByIdAndUpdate({_id: id},{$set:{title,description,url}}, {new:true})
        await Videos.save();//Save the updated message
        res.status(200).json(Videos);//// Respond with the updated message details
    }catch(error){
// Handle errors during message update
        res.status(500).json("error")
    }
}


// // Delete a message by its ID
export const deleteVideoById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the details of the song before deletion
    const deletedVideo= await Video.findById(id);
    // console.log(deletedMessage);
    if (!deletedVideo) {
      return res.status(404).json({ error: "video not found" });
    }

    // Delete the associated files from S3
    // await deleteS3File(deletedSong.MusicKey);
    await deleteS3File(deletedVideo.BannerKey);

    // Delete the song from the database
    const deleteVideo = await Video.deleteOne({ _id: id });
// Check if the deletion was successful (deletedCount === 1)
    if (deleteVideo.deletedCount === 1) {
       // If successful, respond with a success message
      return res.status(200).json({
        success: `Video '${deletedVideo.VideoTitle}' and associated files deleted successfully`,
      });
    } else {
      // If deletion was not successful, respond with a 500 error
      return res.status(500).json({ error: "Error deleting Video" });
    }
  } catch (error) {
    // Handle any errors that occurred during the deletion process
    return res.status(500).json({ error: "Error deleting Video details" });
  }
};




export const getVideoByName = async (req, res) => {
    // Extract the name parameter from the request
    const { name } = req.params;
    // Convert the name to lowercase for a case-insensitive search
    const lowercaseTitle = name.toLowerCase();
  
    try {
      const VideoDetails = await Video.find({ VideoTitle: lowercaseTitle });
  
      const VideoDetailsbyWord = await Video.find({
        VideoTitle: { $regex: new RegExp(lowercaseTitle, "i") },
      });
  
      // Check if there are no exact matches
      if (VideoDetails.length === 0 && VideoDetailsbyWord.length === 0) {
        return res.status(404).send({message: "No videos found"});
      } else if (VideoDetails.length === 0) {
        return res.status(200).json(VideoDetailsbyWord);
      } else if (VideoDetailsbyWord.length === 0) {
        // Check if there are no partial matches
        return res.status(200).json(VideoDetailsbyWord);
      } else {
        // Both exact and partial matches found
        const results = {
          VideoDetails,
            VideoDetailsbyWord,
        };
        res.status(200).json({
          success: "successfully",
          results,
        }); 
      }
    } catch (error) {
      // Respond with a 500 error and an error message
      res.status(500).json({ error: "Error retrieving video details" });
    }
  };
  
  export const getVideoById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      // Find a video by ID
      const video = await Video.findById(id);
  
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
  
      // Do not include sensitive information like the password in the response
      const { VideoTitle, description, YouTube_Url, Banner_Location } = video.toObject();
  
      res.status(200).json({
        id,
        VideoTitle,
        description,
        YouTube_Url,
        Banner_Location,
      });
    } catch (error) {
      // Handle any errors that occurred during the retrieval process
      console.error(error);
      res.status(500).json({ error: "Error retrieving video details" });
    }
  };