import express from 'express';
import * as SubFolder from '@controllers/SubFolderPanchayithe/SubFolder.controller'
import { upload } from '@/utils/s3service';

const router = express.Router();

 
router.post('/create',upload.single('SubFolderBanner'), SubFolder.createSubFolder); 
router.get('/main/:MainFolderName',SubFolder.getMainFolderinsubFolderByName); 
router.get('/sub/:SubFolderName',SubFolder.getsubFolderByName); 
router.get('/getall',SubFolder.getallsubfolders);  
router.delete('/delete/:id', SubFolder.deleteSubFolder);//deleteById
 router.get('/sub-folder/:id',SubFolder.getSubFolderById);



export default router;
