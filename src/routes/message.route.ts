import { Router } from 'express';
import * as message from '@/controllers/message.controller';
import { upload } from '@/utils/s3service';

const router = Router();


router.post("/upload",upload.single('Banner'),message.createMessage)

router.get("/getall",message.getall)

router.put("/update/:id",message.UpdateMessage)

router.delete('/delete/:id',message.deleteMessageById);

router.get("/:name", message.getMessageByName);

 
router.get('/message/:id',message. getMessageById);



export default router;