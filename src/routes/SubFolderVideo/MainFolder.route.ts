import express from 'express';
import * as MainFolder from '@controllers/SubFolderVideo/MainFolder.controller'
import { upload } from '@/utils/s3service';

const router = express.Router();
 
router.post('/create',upload.single('MainFolderBanner'), MainFolder.createMainFolder);  
router.get('/getall', MainFolder.getAllMainFolders); 
router.get('/mainfolders/:MainmostFolderName',MainFolder.getMainFolderByName);
router.delete('/deletebyname/:MainmostFolderName', MainFolder.deleteMainFolder)
 

export default router;
