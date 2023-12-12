import { Router } from 'express';
import * as video from '@/controllers/video.controller';
import { upload } from '@/utils/s3service';

const router = Router();

router.post("/upload",upload.single('Banner'),video.createVideo);

router.get("/getall",video.getall)

router.put("/update/:id",video.UpdateVideo)

router.delete('/delete/:id',video.deleteVideoById);

router.get("/:name", video.getVideoByName)
 
router.get('/video/:id',video.getVideoById);



export default router;