import AWS, { Location, S3 } from "aws-sdk"; // Import S3 from 'aws-sdk' for AWS SDK version 2

import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "@/config/index";

import multer from "multer";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
export const s3client = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// AWS.config.update({
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   region: AWS_REGION,
// });



// Helper function to delete a file from S3
export const deleteS3File = async (key) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `uploads/${key}`,
  };
// console.log(params.Key)
  try {
    const command = new DeleteObjectCommand(params);
    const uploaded = await s3client.send(command);
    // console.log(`File '${key}' deleted from S3`);
  } catch (error) {
    // console.error(`Error deleting file '${key}' from S3:`, error);
    throw error;
  }
};

export const readstream = async (req, res) => {
  const file_key = req.params.key;

  const s3 = new AWS.S3();
  const bucketName = AWS_BUCKET_NAME; // Replace with your S3 bucket name
  const objectKey = `uploads/${file_key}`;

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };
  try {
    const fileStream = s3.getObject(params);
    // const fileStream = s3.getObject(params);
    // console.log(fileStream)
    res.json("downloaded");
    // res.send(fileStream)
  } catch (error) {
    res.json("key not found");
  }
};


export const listUploads = async () => {
  const s3 = new S3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    if (data.Contents && Array.isArray(data.Contents)) {
      const uploads = data.Contents.map((object) => object.Key);
      return uploads;
    } else {
      console.error("Error listing objects from S3: Invalid response");
      return [];
    }
  } catch (err) {
    console.error("Error listing objects from S3:", err);
    throw err;
  }
};
