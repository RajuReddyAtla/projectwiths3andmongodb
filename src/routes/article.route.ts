import express from 'express';
import * as ArticleController from '@controllers/article.controller'; // Import your controller functions
import { upload } from '@/utils/s3service';
import Article from '@/models/article.model';

const router = express.Router();


router.post('/uploadarticles', upload.fields([{ name: 'Banner', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), ArticleController.createArticle); // Create a new article
router.get('/getall', ArticleController.getArticles);
router.get('/article/:name',ArticleController.getArticleByWord);
router.put('/updateArticle/:id', ArticleController.updateArticle);
router.delete('/delete/:id', ArticleController.deleteArticleById);
router.get('/byid/:id',ArticleController.getArticleById);

 export default router;
