import { search } from "@/controllers/search.controller";
import { Router } from "express";
const router = Router();

router.get("/:name", search)

export default router;