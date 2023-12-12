 
import { Request, Response } from 'express';
import Article  from '@/models/article.model';
import { sanitizeFileName } from '@/utils/SanitizeFileName';
import { AWS_BUCKET_NAME, AWS_REGION } from '@/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { deleteS3File, s3client } from '@/utils/s3service';
import { v4 as uuidv4 } from 'uuid';
 
interface UpdateFields {
  ArticleTitle?: string;
  content?: string;
}

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { ArticleTitle, content } = req.body;
    const Banner = req.files['Banner'][0];
    const pdfFile = req.files['pdfFile'][0];

    if (!ArticleTitle) {
      return res.status(400).json({ error: 'ArticleTitle required field' });
    }

    if (!content) {
      return res.status(400).json({ error: 'content required field' });
    }

    if (!Banner) {
      return res.status(400).json({ error: 'Banner required file' });
    }

    if (!pdfFile) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const file2Name = Banner.originalname;
    const BannerName = sanitizeFileName(file2Name);
    const Bannerkey = `${uuidv4()}-${BannerName}`;

    const pdfData = pdfFile.buffer;
    const pdfContentType = pdfFile.mimetype;
    const pdfOriginalName = pdfFile.originalname;

    const pdfKey = `${uuidv4()}-${pdfOriginalName}`;

    try {
      const bannerParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: `uploads/${Bannerkey}`,
        Body: Banner.buffer,
        ContentType: Banner.mimetype,
      };

      const pdfParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: `uploads/${pdfKey}`,
        Body: pdfData,
        ContentType: pdfContentType,
      };

      const uploadBannerCommand = new PutObjectCommand(bannerParams);
      await s3client.send(uploadBannerCommand);

      const uploadPdfCommand = new PutObjectCommand(pdfParams);
      await s3client.send(uploadPdfCommand);

      const articleData: Article = {
        ArticleTitle,
        content,
        BannerKey: Bannerkey,
        Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${bannerParams.Key}`,
        pdf: {
          data: pdfData,
          contentType: pdfContentType,
          originalname: pdfOriginalName,
        },
        pdfLocation: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${pdfParams.Key}`, // New field for storing the PDF location
      };

      const ArticleDetails = await Article.create(articleData);

      res.status(201).json({
        ...ArticleDetails.toObject(),
        pdfLocation: articleData.pdfLocation,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create the article' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the article' });
  }
};

// get all articles

export const getArticles = async (req: Request, res: Response) => {
  try {
// Fetch all articles from the database and sort them by creation date in descending order    
    const articles = await Article.find().sort({ createdAt: -1 });
// Respond with the fetched articles
    res.status(200).json(articles);
  } catch (error) {
  // Handle errors during article retrieval   
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

 

export const getArticleByWord = async (req, res) => {
    // Extract the name parameter from the request
    const { name } = req.params;
    // Convert the name to lowercase for a case-insensitive search
    const lowercaseTitle = name.toLowerCase();

    try {
        const ArticleDetailsbyWord = await Article.find({
            ArticleTitle: { $regex: new RegExp(lowercaseTitle, "i") },
        });

        // Check if there are no partial matches
        if (ArticleDetailsbyWord.length === 0) {
            return res.status(404).send("No articles found");
        } else {
            // Respond with partial matches
            return res.status(200).json(ArticleDetailsbyWord);
        }
    } catch (error) {
        // Respond with a 500 error and an error message
        res.status(500).json({ error: "Error retrieving article details" });
    }
};




 

export const updateArticle = async (req, res) => {
  // Destructure relevant fields from the request body
  const { ArticleTitle,content } = req.body;

   
  const ArticleId = req.params.id; // Assuming you pass the audio ID in the route URL

  try {
    // Create an object to store fields to be updated
    const updateFields: UpdateFields = {};

    // Check if each field is provided in the request body and add it to updateFields
    if (ArticleTitle) updateFields.ArticleTitle = ArticleTitle;
    if (content) updateFields.content = content;

    // Find and update the audio details in the database
    const article = await Article.findByIdAndUpdate(
      { _id: ArticleId },
      { $set: updateFields },
      { new: true } // Set the 'new' option to true to get the updated document
    );

     
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Create a comma-separated string of updated fields for the success message
    const updatedDetails = Object.keys(updateFields).join(", "); // Create a comma-separated string of updated fields

    // Respond with the success message and the updated audio details
    return res.status(200).json({
      success:' Details (${updatedDetails}) updated successfully',
      article,
    });
  } catch (error) {
    return res.status(400).json({ error: "Details not updated." });
  }
};

export const deleteArticleById = async (req, res) => {
  const { id } = req.params;

  try {
     
    const deletedArticle = await Article.findById(id);
    console.log(deletedArticle);
    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

     
    await deleteS3File(deletedArticle.BannerKey);

    // Delete the song from the database
    const deleteArticle = await Article.deleteOne({ _id: id });
// Check if the deletion was successful (deletedCount === 1)
    if (deleteArticle.deletedCount === 1) {
       // If successful, respond with a success message
      return res.status(200).json({
        success: `Article '${deletedArticle.ArticleTitle}' and associated files deleted successfully`,
      });
    } else {
      // If deletion was not successful, respond with a 500 error
      return res.status(500).json({ error: "Error deleting Article" });
    }
  } catch (error) {
    // Handle any errors that occurred during the deletion process
    return res.status(500).json({ error: "Error deleting Article details" });
  }
};



export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
 
    const article = await Article.findById(id);

    // Check if the article with the given ID exists
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the article' });
  }
};



