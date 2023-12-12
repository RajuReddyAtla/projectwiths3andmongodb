import { AWS_BUCKET_NAME, AWS_REGION, BASE_URL } from "@/config";
 import VideoMainFolder from "@/models/SubFolderVideo/MainFolder.model";

import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { s3client } from "@/utils/s3service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

 
export const createMainFolder = async (req, res) => {
  const { MainmostFolderName } = req.body;
  const MainFolderBanner = req.file;

  if (!MainmostFolderName) {
    return res.status(400).json({ error: "MainmostFolderName required field" });
  }

  if (!MainFolderBanner) {
    return res.status(400).json({ error: "MainFolderBanner required file" });
  }

   
  const file2Name = MainFolderBanner.originalname;
  
  const BannerName = sanitizeFileName(file2Name);
   
  const Bannerkey = `${uuidv4()}-${BannerName}`
  
  try {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `uploads/${Bannerkey}`,
    Body: MainFolderBanner.buffer,
    ContentType: MainFolderBanner.mimetype,
  };
  
  const command1 = new PutObjectCommand(params);
  const uploaded1 = await s3client.send(command1);

  const existingAlbum = await VideoMainFolder.findOne({
    MainmostFolderName
  });

    if (existingAlbum) {
      return res.status(400).json({ message:"this folder name already exists please change folder name"});
    }
 
    const MainFolderDetails = await VideoMainFolder.create({
      MainmostFolderName,
      SubfolderinMainfolder:`${BASE_URL}/v1/subfolder/main/${MainmostFolderName}`,
      MainmostFolderNamekey: Bannerkey,
      MainmostFolderName_banner: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
    });
   
    res.status(201).json(MainFolderDetails);
  } catch (error) {
    
    res.status(500).json(error);
  }
};



  export const getAllMainFolders = async (req, res) => {
    try {
      // Retrieve all main folders from the database
      const allMainFolders = await VideoMainFolder.find();
  
      // If there are no main folders, return an empty array
      if (!allMainFolders || allMainFolders.length === 0) {
        return res.status(404).json({ message: 'No main folders found' });
      }
  
      // Modify the main folders to include links or other necessary details
      const modifiedMainFolders = allMainFolders.map((folder) => ({
        MainmostFolderName: folder.MainmostFolderName,
        SubfolderinMainfolder: `${BASE_URL}/v1/subfolder/${folder.MainmostFolderName}`,
        MainmostFolderName_banner: folder.MainmostFolderName_banner,
      }));
  
      // Respond with the modified main folders
      res.status(200).json(allMainFolders);
    } catch (error) {
      // Handle errors during retrieval
      res.status(500).json(error);
    }
  };

  
export const getMainFolderByName = async (req, res) => {
  try {
    // Extract the MainmostFolderName parameter from the request
    const { MainmostFolderName } = req.params;

    // Retrieve the Main Folder from the database by name
    const mainFolder = await VideoMainFolder.findOne({
      MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });

    // If the Main Folder is not found, return a 404 response
    if (!mainFolder) {
      return res.status(404).json({ message: 'Main Folder not found' });
    }

    // Respond with the details of the Main Folder
    res.status(200).json({
      MainmostFolderName: mainFolder.MainmostFolderName,
      SubfolderinMainfolder: `${BASE_URL}/v1/subfolder/${mainFolder.MainmostFolderName}`,
      MainmostFolderName_banner: mainFolder.MainmostFolderName_banner,
    });
  } catch (error) {
    // Handle errors during retrieval
    res.status(500).json(error);
  }
};

  

export const deleteMainFolder = async (req, res) => {
  const { MainmostFolderName } = req.params;

  try {
    // Find the MainFolder by MainmostFolderName
    const existingFolder = await VideoMainFolder.findOne({
      MainmostFolderName: {
        $regex: new RegExp(`^${MainmostFolderName}$`, 'i'),
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ message: "MainFolder not found" });
    }

    // Delete the MainFolder from the database
    await VideoMainFolder.deleteOne({ MainmostFolderName });

    // Delete the MainFolder's banner from S3
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${existingFolder.MainmostFolderNamekey}`,
    };

    const deleteCommand = new DeleteObjectCommand(params);
    await s3client.send(deleteCommand);

    res.status(200).json({ message: "MainFolder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  
  