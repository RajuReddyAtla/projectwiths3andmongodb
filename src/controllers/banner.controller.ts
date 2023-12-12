import { deleteS3File, s3client } from "@/utils/s3service";
import { AWS_BUCKET_NAME, AWS_REGION} from "@/config";
import Banner from "@/models/banner.model";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { v4 as uuidv4 } from "uuid";



export const bannerupload = async (req, res) => {
   const file = req.file;

   if (!file) {
    return res.status(400).json({ error: "file required" });
  }

   const file2Name = file.originalname;
     
  const BannerName = sanitizeFileName(file2Name);
  
  const Bannerkey = `${uuidv4()}-${BannerName}`
   

  try {
   // Prepare S3 upload parameters for the banner file 

    const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `uploads/${Bannerkey}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    };

// Create a new command to upload the banner file to S3
    const command = new PutObjectCommand(params);
  // Execute the S3 upload command   
    const uploaded = await s3client.send(command);
    
// Create a new banner entry in the database with the uploaded banner file location
    const banner = await Banner.create({
      bannerKey:Bannerkey,
      Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
    });
// Respond with a success status and the created banner details
    return res.status(200).json({
    message:"banner uploaded sucessfully",
    banner
  });
  } catch (error) {
    // Handle errors during banner upload
    return res.status(400).json({ error: "Details not uploaded." });
  }
};

export const OfflineAndOnline = async (req, res) => {
  try {
    // Retrieve all banner entries from the database
    const banners = await Banner.find();
// Respond with a success status and the retrieved banners
    res.status(200).json(banners);
  } catch (error) {
    // Handle errors during banner retrieval
    res.status(400).json("not found");
  }
};

export const allbanners = async (req, res) => {
  try {
    // Retrieve all banner entries from the database
    const banners = await Banner.find({ status: 'Online' });
// Respond with a success status and the retrieved banners
    res.status(200).json(banners);
  } catch (error) {
    // Handle errors during banner retrieval
    res.status(400).json("not found");
  }
};

export const Offlinebanners =async (req, res) => {
  try {
    const offlineBanners = await Banner.find({ status: 'Offline' });
    res.status(200).json({ banners: offlineBanners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
 

export const deletebanner = async (req, res) => {
  const { id } = req.params;

  try {
    
    const deletedBanner = await Banner.findById(id);
    console.log(deletedBanner);
    if (!deletedBanner) {
      return res.status(404).json({ error: " Banner not found" });
    }

    // Delete the associated files from S3
     await deleteS3File(deletedBanner.bannerKey);

     const deleteBanner = await Banner.deleteOne({ _id: id });
 
       // If successful, respond with a success message
      return res.status(200).json({
        success: `Banner deleted successfully`,
      });

  } catch (error) {
    // Handle any errors that occurred during the deletion process
    return res.status(500).json({ error: "Error deleting banner details" });
  }
};


export const UpdateBannerStatus =async(req,res)=>{

  const {bannerId}=req.params;
  const { status } = req.body;
  try {
  const banner = await Banner.findById(bannerId);

    // Check if the banner exists
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Update the status
    banner.status = status;

    // Save the updated banner to the database
    await banner.save();

    res.status(200).json({ message: 'Banner status updated successfully', banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

}


export const getBannerById = async (req,res) => {
  const { id } = req.params;

  try {
    // Find a banner by ID
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Do not include sensitive information like the banner key in the response
    const {
      bannerKey,
      Banner_location,
      status,
    } = banner.toObject();

    res.status(200).json({
      id,
      bannerKey,
      Banner_location,
      status,
    });
  } catch (error) {
    // Handle any errors that occurred during the retrieval process
    console.error(error);
    res.status(500).json({ error: "Error retrieving banner details" });
  }
};