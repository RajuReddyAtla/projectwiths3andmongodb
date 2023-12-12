import { Router } from "express";
import { home } from "@controllers/index.controller";
import { readstream } from "@/utils/s3service";

const router = Router();
router.get("/", home);
router.get('/readstream/:key',readstream)

export default router;
