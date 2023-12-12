import express from 'express';
import * as MainFolder from '@controllers/SubFolderPanchayithe/MainFolder.controller'
import { upload } from '@/utils/s3service';

const router = express.Router();

 
router.post('/create',upload.single('MainFolderBanner'), MainFolder.createMainFolder);  
router.get('/getall', MainFolder.getallmainfolders);  
 router.get('/:MainFolderName',MainFolder.getMainFolderByName); 
 
router.get('/main-folder/:id',MainFolder.getMainFolderById);
router.delete('/delete/:id', MainFolder.deleteMainFolder);



export default router;
