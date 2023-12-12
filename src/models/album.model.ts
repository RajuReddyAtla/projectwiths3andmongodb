 
import mongoose from 'mongoose';
const currentDate = new Date();
const albumSchema = new mongoose.Schema({
  AlbumName: {
    type: String,
    required: true,
  },
  albumkey: {
    type: String,
    required: true,
  },
  album_banner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
   default: currentDate,
  },
});

const Album = mongoose.model('Album', albumSchema);

export default Album;
