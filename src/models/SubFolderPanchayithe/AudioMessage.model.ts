
import mongoose from "mongoose";

const currentDate = new Date();

const AudioMesssageSchema = new mongoose.Schema({
  AudioMesssagetitle:String,
  artist:String,
  description:String,
  MainmostFolderName:String,
  SubFolderName:String,
  AudioMesssageKey:String,
  AudioMesssageBannerKey:String,
  AudioMesssage_location:String,
  AudioMesssageBanner_location:String,
  createdAt: {
    type: Date,
   default: currentDate,
  },
});

const AudioMesssage = mongoose.model('AudioMesssage', AudioMesssageSchema);  
export default AudioMesssage;