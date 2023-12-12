import { Router } from 'express';
import * as Shorts from '@/controllers/shorts.controller';
import { upload } from '@/utils/s3service';

const router = Router();


router.post("/upload",upload.single('Banner'),Shorts.createShort);

router.get("/getall",Shorts.getall)

router.put("/update/:id",Shorts.UpdateShort)

router.delete('/delete/:id',Shorts.deleteShortById);

router.get("/:name", Shorts.getShortByName)

export default router;