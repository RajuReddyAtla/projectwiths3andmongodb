import Video from "@/models/SubFolderVideo/Video.model";
import MainFolder from "@/models/SubFolderVideo/MainFolder.model";
import SubFolder from "@/models/SubFolderVideo/SubFolder.model";
import Videomessage from "@/models/SubFolderVideo/Video.model";

 
export const uploadVideoMessage = async (req, res) => {
  // Extract relevant data from the request body
  const { Videotitle, description, MainmostFolderName, SubFolderName,YoutubeUrl } = req.body;

  // Extract music and banner files from the request

  if (!Videotitle || !description || !MainmostFolderName || !SubFolderName || !YoutubeUrl ) {
      return res.status(400).json({ error: "Please provide all required fields and files" });
  }

  try {
     
      const existingMain = await MainFolder.findOne({
        MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });

    if (!existingMain) {
        return res.status(500).json({ message: "Main folder does not exist" });
    }

    // Check if the specified subfolder exists within the main folder
    const existingSub = await SubFolder.findOne({
        MainmostFolder: existingMain._id,
        SubFolderName: { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
    });

    if (!existingSub) {
        return res.status(500).json({ message: "Subfolder does not exist within the specified main folder" });
    }
       

      
      const videomesssage = await Videomessage.create({
          Videotitle,
          description,
          MainmostFolderName: existingMain.MainmostFolderName,
          SubFolderName,
          YoutubeUrl
      });

  
      return res.status(201).json({
          success: "Video Message added successfully",
          videomesssage,
      });
  } catch (error) {
      // Handle errors by responding with the error details
      return res.status(500).json(error);
  }
};



 export const getMainFolderByName = async (req, res) => {
   // Extract the name parameter from the request
   try {
    const { MainFolderName } = req.params;
      console.log(MainFolderName)
     // Convert the name to lowercase for a case-insensitive search
     const lowercaseTitle = MainFolderName.toLowerCase();
 
  
     const MainFolderDetailsbyWord = await Video.find({
       MainmostFolderName: { $regex: new RegExp(lowercaseTitle, "i") },
     });
     if (MainFolderDetailsbyWord.length === 0) {
           // Check if there are no partial matches
           return res.status(200).json("not found");
         } else {
           // Both exact and partial matches found
           const results = {
            MainFolderDetailsbyWord,
           };
           res.status(200).json({
             success: "successfully",
             results,
           }); 
         }
      
       }catch (error) {
     // Respond with a 500 error and an error message
     res.status(500).json(error);
   }
 };

 export const getsubFolderByName = async (req, res) => {
   // Extract the name parameter from the request
   try {
    const { SubFolderName } = req.params;
    
     // Convert the name to lowercase for a case-insensitive search
     const lowercaseTitle = SubFolderName.toLowerCase();
    
     const SubFolderDetailsbyWord = await Video.find({
       SubFolderName: { $regex: new RegExp(lowercaseTitle, "i") },
     });
 console.log(SubFolderDetailsbyWord)
   if (SubFolderDetailsbyWord.length === 0) {
           // Check if there are no partial matches
           return res.status(400).json(`no sub filders by ${SubFolderName} found`);
   }
       res.status(200).json({
         success: "successfully",
         SubFolderDetailsbyWord,
       }); 
   } catch (error) {
     // Respond with a 500 error and an error message
     res.status(500).json(error);
   }
 };


export const getAllVideoMessages = async (req, res) => {
 try {
   // Retrieve all videos from the database
   const allVideos = await Video.find();

   // Respond with the list of videos
   res.status(200).json({ videos: allVideos });
 } catch (error) {
   // Handle errors by responding with the error details
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
};


export const getVideoMessageByTitle = async (req, res) => {
 try {
   const { Videotitle } = req.params;

   if (!Videotitle) {
     return res.status(400).json({ error: "Video title parameter is missing" });
   }

   // Find the video by Videotitle
   const foundVideo = await Video.findOne({ Videotitle: { $regex: new RegExp(`^${Videotitle}$`, 'i') } });

   if (!foundVideo) {
     return res.status(404).json({ message: "Video not found" });
   }

   // Respond with the found video
   res.status(200).json({ video: foundVideo });
 } catch (error) {
   // Handle errors by responding with the error details
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
};


export const deleteVideoMesssageByTitle = async (req, res) => {
 try {
   const { Videotitle } = req.params;

   if (!Videotitle) {
     return res.status(400).json({ error: "Video title parameter is missing" });
   }

   // Find and delete the video by Videotitle
   const deletedVideo = await Video.findOneAndDelete({ Videotitle: { $regex: new RegExp(`^${Videotitle}$`, 'i') } });

   if (!deletedVideo) {
     return res.status(404).json({ message: "Video not found" });
   }

   // Respond with a success message
   res.status(200).json({ success: "Video deleted successfully", deletedVideo });
 } catch (error) {
   // Handle errors by responding with the error details
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
};








 
