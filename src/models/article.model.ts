 
import mongoose, { Document, model, Schema } from 'mongoose';

const currentDate = new Date();

interface PdfFile {
  data: Buffer;
  contentType: string;
  originalname: string;
}

interface Article extends Document {
  ArticleTitle: string;
  content: string;
  BannerKey: string;
  Banner_location: string;
  pdf: PdfFile;
  pdfLocation: string; // New field for storing the PDF file location
  createdAt: Date;
}

// Create a Mongoose schema for the Article type
const articleSchema = new Schema<Article>(
  {
    ArticleTitle: String,
    content: String,
    BannerKey: String,
    Banner_location: String,
     
    pdfLocation: String, // New field for storing the PDF file location
    createdAt: {
      type: Date,
      default: currentDate,
    },
  },
  { versionKey: false }
);

// Create a Mongoose model for the Article type
const Article = model<Article>('Article', articleSchema);

export default Article;
