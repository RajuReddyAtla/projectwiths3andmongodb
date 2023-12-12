import express from 'express';

import * as Banner from '@/controllers/banner.controller';
import { upload } from '@/utils/s3service';

const router = express.Router();

/**
 * @route POST /api/banners/bannerupload
 * @description Upload a new banner
 * @access Public
 */
router.post('/bannerupload', upload.single('file'),Banner.bannerupload);

/**
 * @route GET /getall
 * @description get all banners
 * @access Public
 */
router.get('/getall',Banner.allbanners)
router.get('/offline',Banner.Offlinebanners)
router.get('/allbanners',Banner.OfflineAndOnline)
router.delete('/delete/:id',Banner.deletebanner)
router.put('/updatestatus/:bannerId',Banner.UpdateBannerStatus)

// Add this route to handle getting a banner by ID
router.get('/banner/:id',Banner.getBannerById);


export default router;
