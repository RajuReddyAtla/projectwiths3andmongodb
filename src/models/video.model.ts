import mongoose from "mongoose";
const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type Video ={
  VideoTitle:string;
    description:string;
    File_Location:String;
    YouTube_Url:String;
    BannerKey:String,
    Banner_Location:String,
    createdAt: Date;
    updatedAt: String;
  }

const videoSchema = new mongoose.Schema({
  VideoTitle: String,
  description: String,
  File_Location: String,
  YouTube_Url: String,
    // Banner:String,
    BannerKey:String,
    Banner_Location:String,
    
    createdAt: {
      type: Date,
     default: currentDate,
    },
      updatedAt: {
        type: String,
      },
    });
    videoSchema.pre("save", function (this: Video & mongoose.Document, next) {
      this.updatedAt = new Date() + curr_date;
      next();
    });


const video = mongoose.model("video",videoSchema);
export default video;