import { AWS_BUCKET_NAME, AWS_REGION, BASE_URL } from "@/config";
import MainFolder from "@/models/SubFolderPanchayithe/MainFolder.model";
import SubFolder from "@/models/SubFolderPanchayithe/SubFolder.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { deleteS3File, s3client } from "@/utils/s3service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

 
export const createSubFolder = async (req, res) => {
  const { SubFolderName, MainmostFolderName } = req.body;
  const SubFolderBanner = req.file;

  if (!SubFolderName) {
    return res.status(400).json({ error: "SubFolderName required field" });
  }

  if (!MainmostFolderName) {
    return res.status(400).json({ error: "MainmostFolderName required field" });
  }

 

  const file2Name = SubFolderBanner.originalname;
  const BannerName = sanitizeFileName(file2Name);
  const Bannerkey = `${uuidv4()}-${BannerName}`;

  try {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${Bannerkey}`,
      Body: SubFolderBanner.buffer,
      ContentType: SubFolderBanner.mimetype,
    };

    const command1 = new PutObjectCommand(params);
    await s3client.send(command1);

    const existingMain = await MainFolder.findOne({
      MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });

    if (!existingMain) {
      return res.status(400).json({ message: `${MainmostFolderName} doesn't exist; please create a main folder` });
    }

     const existingSub = await SubFolder.findOne({
      MainmostFolder: existingMain._id,
      SubFolderName: { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
  });

    if (existingSub) {
      return res.status(400).json({ message: `${SubFolderName} already exists in ${MainmostFolderName}; please change the name` });
    }

    const SubFolderDetails = await SubFolder.create({
      SubFolderName,
      MainmostFolderName,
      MainmostFolder: existingMain._id,
      SubFolderkey: Bannerkey,
      audiomessagessubfolder:`${BASE_URL}/v1/audiomessage/sub/${SubFolderName}`,
      SubFolder_banner: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
    });

    res.status(201).json(SubFolderDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};
  

 

  export const getMainFolderinsubFolderByName = async (req, res) => {
     try {
     const { MainFolderName } = req.params;
       const lowercaseTitle = MainFolderName.toLowerCase();
  
  
   
      const Mainfolders = await SubFolder.find({
        MainmostFolderName: lowercaseTitle,
      });
  
    if (Mainfolders.length === 0) {
             return res.status(400).json(`no sub folders by ${MainFolderName} found`);
    }
        res.status(200).json({
          success: "successfully",
          Mainfolders,
        }); 
    } catch (error) {
       res.status(500).json(error);
    }
  };



  export const getallsubfolders = async (req, res) => {
    try {
      const allsubfolders = await SubFolder.find();  
  
      return res.status(200).json({
        success: "Fetched all sub folders",
        allsubfolders,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving sub folder details." });
    }
  };
  


  export const getsubFolderByName = async (req, res) => {
       try {
     const { SubFolderName } = req.params;
       const lowercaseTitle = SubFolderName.toLowerCase();
   
   
      const subfolders = await SubFolder.find({
        SubFolderName:lowercaseTitle,
      });
     if (subfolders.length === 0) {
             return res.status(400).json(`no sub folders by ${SubFolderName} found`);
    }
        res.status(200).json({
          success: "successfully",
          subfolders,
        }); 
    } catch (error) {
       res.status(500).json(error);
    }
  };

  export const getSubFolderById = async (req,res) => {
    const { id } = req.params;
  
    try {
       const subFolder = await SubFolder.findById(id);
  
      if (!subFolder) {
        return res.status(404).json({ error: "SubFolder not found" });
      }
  
       const {
        SubFolderName,
        MainmostFolderName,
        SubFolder_banner,
      } = subFolder.toObject();
  
      res.status(200).json({
        id,
        SubFolderName,
        MainmostFolderName,
        SubFolder_banner,
      });
    } catch (error) {
       console.error(error);
      res.status(500).json(error);
    }
  };


  export const deleteSubFolder = async (req, res) => {
    const { id } = req.params;
  
    try {
       const deletedSubFolder = await SubFolder.findById(id);
       if (!deletedSubFolder) {
        return res.status(404).json({ error: "sub folder not found" });
      }
        await deleteS3File(deletedSubFolder.SubFolderkey);
  
       const deleteFolder = await SubFolder.deleteOne({ _id: id });
       if (deleteFolder.deletedCount === 1) {
         return res.status(200).json({
          success: `folder '${deletedSubFolder.SubFolderName}' and associated files deleted successfully`,
        });
      } else {
         return res.status(500).json({ error: "Error deleting sub folder" });
      }
    } catch (error) {
       return res.status(500).json(error);
    }
  };