 import express, { RequestHandler } from "express";
import * as VideoMessage from "@controllers/SubFolderVideo/Video.controller";
 
const router = express.Router();
 
router.post("/upload",VideoMessage.uploadVideoMessage);  
 router.get("/main/:MainFolderName", VideoMessage.getMainFolderByName);  
router.get("/sub/:SubFolderName", VideoMessage.getsubFolderByName);  
router.get("/getAllVideos",VideoMessage.getAllVideoMessages);
router.get("/getVideoByTitle/:Videotitle", VideoMessage.getVideoMessageByTitle);
router.delete("/deleteVideoByTitle/:Videotitle", VideoMessage.deleteVideoMesssageByTitle);


export default router;

