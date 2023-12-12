import express from 'express';
import * as AudioMessage from '@controllers/SubFolderPanchayithe/AudioMessage.controller'
import { upload } from '@/utils/s3service';

const router = express.Router();

router.post("/audioupload", upload.fields([{ name: 'Music', maxCount: 1 }, { name: 'Banner', maxCount: 1 }]), AudioMessage.uploadAudioMessage);//upload
 router.get('/getall', AudioMessage.getallaudiomessage);
 router.get('/main/:MainFolderName',AudioMessage.getMainFolderByName); 
router.get('/sub/:SubFolderName',AudioMessage.getsubFolderByName); 
 
router.delete('/delete/:id', AudioMessage.deleteAudioMessage);//deleteById
 router.get('/audio-message/:id',AudioMessage.getAudioMessageById);



export default router;
