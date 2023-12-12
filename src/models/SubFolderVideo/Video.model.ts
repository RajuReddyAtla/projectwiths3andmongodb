
import mongoose from "mongoose";

const currentDate = new Date();

const VideoSchema = new mongoose.Schema({
  Videotitle:String,
  description:String,
  MainmostFolderName:String,
  SubFolderName:String,
  YoutubeUrl:String,
  createdAt: {
    type: Date,
   default: currentDate,
  },
});


const  Videomessage = mongoose.model('Videomessage', VideoSchema); // 'Song' is the model name
export default  Videomessage;