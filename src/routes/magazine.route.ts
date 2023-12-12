import express from 'express';
import * as Magazine from '@/controllers/magazine.controller';
import { upload } from '@/utils/s3service';

const router = express.Router();

 
router.post('/magazineupload',upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'Bannerpdf', maxCount: 1 }]), Magazine.uploadMagazine);

router.get('/getall', Magazine.allmagazine);
router.put('/updatemagazine/:id', Magazine.updateMagazineDetails);
router.get('/:name', Magazine.getMagazineByName);
router.delete('/delete/:id', Magazine.deleteMagazineByID);
router.get('/magazine/:id',Magazine. getMagazineById);


export default router;
