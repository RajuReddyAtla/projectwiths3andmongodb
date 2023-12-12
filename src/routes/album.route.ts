import express from 'express';
import * as Album from '@controllers/album.controller'; // Import your controller functions
import { upload } from '@/utils/s3service';

const router = express.Router();

 router.post('/createalbum',upload.single('AblumBanner'), Album.createAlbum);  
router.get('/getall', Album.getallAlbums);  
 router.get('/:name',Album.getAlbumByName);
router.put('/Update/:id', Album.UpdateAlbumTitle);  
router.delete('/delete/:id', Album.deleteAlbumById);  

 router.get('/album/:id',Album.getAlbumById);

 

export default router;
