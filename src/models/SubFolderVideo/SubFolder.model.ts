// models/Album.js
import mongoose from 'mongoose';
const currentDate = new Date();
const Videosubchema = new mongoose.Schema({
  SubFolderName: {
    type: String,
    required: true,
  },
  MainmostFolderName: {
    type: String,
    required: true,
  },
  MainmostFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoMainFolder',
    required: true,
},
  SubFolderkey: {
    type: String,
    required: true,
  },
  SubFolder_banner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
   default: currentDate,
  },
});

const VideoSubFolder = mongoose.model('VideoSubFolder', Videosubchema);

export default VideoSubFolder;
