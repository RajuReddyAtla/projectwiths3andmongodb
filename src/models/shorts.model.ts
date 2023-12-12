import mongoose from "mongoose";
const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type Short ={
  ShortTitle:string;
    description:string;
    YouTube_Url:String;
    createdAt: Date;
    updatedAt: String;
  }

const ShortsSchema = new mongoose.Schema({
  ShortTitle: String,
  description: String,
  YouTube_Url: String,
    createdAt: {
      type: Date,
     default: currentDate,
    },
      updatedAt: {
        type: String,
      },
    });
     
const Shorts = mongoose.model("short",ShortsSchema);
export default Shorts;