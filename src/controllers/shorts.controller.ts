import { Request, Response } from "express";
import Shorts from "@/models/shorts.model";


// Create a new message
export const createShort = async (req: Request, res: Response) => {
  try {
    // Destructure data from the request body
    const { ShortTitle, description, YouTube_Url } = req.body;

    if (!YouTube_Url) {
      return res.status(400).json({ error: "YouTube_Url required field" });
    }

    if (!ShortTitle) {
      return res.status(400).json({ error: "ShortTitle required field" });
    }

    if (!description) {
      return res.status(400).json({ error: "description required field" });
    }

    // Create a new message in the database
    const ShortDetails = await Shorts.create({
      ShortTitle,
      description,
      YouTube_Url,
    });

    // Respond with the created message details
    res.status(201).json(ShortDetails);
  } catch (error) {
    // Handle errors during the message creation
    res.status(500).json({ error: "Failed to create the Shorts" });
  }
};


// Get all messages

export const getall = async(req,res) =>{
    try{
      // Retrieve all messages from the database
        const Short=  await Shorts.find();
        // Respond with the retrieved messages
        res.status(200).json(Short)
    }catch(error){
      // Handle errors during message retrieval
        res.status(500).json("error")
    }

}
// Update a message by its ID

export const UpdateShort = async (req, res) => {
  try {
    const { id } = req.params;
    const { ShortTitle, description, YouTube_Url } = req.body;

    // Find and update the short in the database
    const updatedShort = await Shorts.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ShortTitle,
          description,
          YouTube_Url,
        },
      },
      { new: true }
    );

    // Check if the short was not found
    if (!updatedShort) {
      return res.status(404).json({ error: 'Short not found' });
    }

    // Save the updated short
    await updatedShort.save();

    // Respond with the updated short details
    res.status(200).json(updatedShort);
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    // Handle errors during short update
    res.status(500).json({ error: 'Failed to update the short' });
  }
};


// // Delete a message by its ID
export const deleteShortById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the details of the song before deletion
    const deletedShort= await Shorts.findById(id);
    // console.log(deletedMessage);
    if (!deletedShort) {
      return res.status(404).json({ error: "Short not found" });
    }
 
    const deleteShort = await Shorts.deleteOne({ _id: id });
// Check if the deletion was successful (deletedCount === 1)
    if (deleteShort.deletedCount === 1) {
       // If successful, respond with a success message
      return res.status(200).json({
        success: `Short '${deletedShort.ShortTitle}' and associated files deleted successfully`,
      });
    } else {
      // If deletion was not successful, respond with a 500 error
      return res.status(500).json({ error: "Error deleting short" });
    }
  } catch (error) {
    // Handle any errors that occurred during the deletion process
    return res.status(500).json({ error: "Error deleting short details" });
  }
};




export const getShortByName = async (req, res) => {
    // Extract the name parameter from the request
    const { name } = req.params;
    // Convert the name to lowercase for a case-insensitive search
    const lowercaseTitle = name.toLowerCase();
  
    try {
      const ShortDetails = await Shorts.find({ ShortTitle: lowercaseTitle });
  
      const ShortDetailsbyWord = await Shorts.find({
        ShortTitle: { $regex: new RegExp(lowercaseTitle, "i") },
      });
  
      // Check if there are no exact matches
      if (ShortDetails.length === 0 && ShortDetailsbyWord.length === 0) {
        return res.status(404).send({message: "No Shorts found"});
      } else if (ShortDetails.length === 0) {
        return res.status(200).json(ShortDetailsbyWord);
      } else if (ShortDetailsbyWord.length === 0) {
        // Check if there are no partial matches
        return res.status(200).json(ShortDetailsbyWord);
      } else {
        // Both exact and partial matches found
        const results = {
          ShortDetails,
          ShortDetailsbyWord,
        };
        res.status(200).json({
          success: "successfully",
          results,
        }); 
      }
    } catch (error) {
      // Respond with a 500 error and an error message
      res.status(500).json({ error: "Error retrieving shorts details" });
    }
  };
  
