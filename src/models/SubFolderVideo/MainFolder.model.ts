// models/Album.js
import mongoose from 'mongoose';
const currentDate = new Date();
const VideoMainmostchema = new mongoose.Schema({
    MainmostFolderName: {
    type: String,
    required: true,
  },
  SubfolderinMainfolder: {
    type: String,
    required: true,
  },
  MainmostFolderNamekey: {
    type: String,
    required: true,
  },
  MainmostFolderName_banner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
   default: currentDate,
  },
});

const VideoMainFolder = mongoose.model('VideoMainmost', VideoMainmostchema);

export default VideoMainFolder;
