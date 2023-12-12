import { AWS_BUCKET_NAME, AWS_REGION, BASE_URL } from "@/config";
import MainFolder from "@/models/SubFolderPanchayithe/MainFolder.model";

import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { deleteS3File, s3client } from "@/utils/s3service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";




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
  // Execute S3 upload command  
    const command1 = new PutObjectCommand(params);
    const uploaded1 = await s3client.send(command1);
  
    const existingFolder = await MainFolder.findOne({
      MainmostFolderName
        : { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });
  
      if (existingFolder) {
        return res.status(400).json({ message:"this folder name already exists please change folder name"});
      }
    
      const MainFolderDetails = await MainFolder.create({
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


  export const getMainFolderByName = async (req, res) => {
    // Extract the name parameter from the request
    try {
     const { MainFolderName } = req.params;
     
      const lowercaseTitle = MainFolderName.toLowerCase();
  
  
      
      const MainFolders = await MainFolder.find({
        MainmostFolderName: { $regex: new RegExp(lowercaseTitle, "i") },
      });
      if (MainFolders.length === 0) {
             return res.status(200).json("not found");
          } else {
       
            const results = {
              MainFolders,
            };
            res.status(200).json({
              success: "successfully",
              results,
            }); 
          }
       
        }catch (error) {
       res.status(500).json(error);
    }
  };

  export const getallmainfolders = async (req, res) => {
    try {
      const getallmainfolders = await MainFolder.find();  
  
      return res.status(200).json({
        success: "Fetched all mainfolders",
        getallmainfolders,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  export const getMainFolderById = async (req,res) => {
    const { id } = req.params;
  
    try {
       const mainFolder = await MainFolder.findById(id);
  
      if (!mainFolder) {
        return res.status(404).json({ error: "Main Folder not found" });
      }
  
       const {
        MainmostFolderName,
        SubfolderinMainfolder,
        MainmostFolderName_banner,
      } = mainFolder.toObject();
  
      res.status(200).json({
        id,
        MainmostFolderName,
        SubfolderinMainfolder,
        MainmostFolderName_banner,
      });
    } catch (error) {
       console.error(error);
      res.status(500).json({ error: "Error retrieving Main Folder details" });
    }
  };


  export const deleteMainFolder = async (req, res) => {
    const { id } = req.params;
  
    try {
       const deletedMainFolder = await MainFolder.findById(id);
       if (!deletedMainFolder) {
        return res.status(404).json({ error: "Album not found" });
      }
       await deleteS3File(deletedMainFolder.MainmostFolderNamekey);
  
       const deleteFolder = await MainFolder.deleteOne({ _id: id });
       if (deleteFolder.deletedCount === 1) {
         return res.status(200).json({
          success: `folder '${deletedMainFolder.MainmostFolderName}' and associated files deleted successfully`,
        });
      } else {
         return res.status(500).json({ error: "Error deleting main folder" });
      }
    } catch (error) {
       return res.status(500).json(error);
    }
  };