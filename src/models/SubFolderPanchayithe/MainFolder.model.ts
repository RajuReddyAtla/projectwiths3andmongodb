import mongoose from 'mongoose';
const currentDate = new Date();
const Mainmostchema = new mongoose.Schema({
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

const MainFolder = mongoose.model('Mainmost', Mainmostchema);

export default MainFolder;
