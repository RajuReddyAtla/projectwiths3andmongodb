import { Router } from "express";
import  * as admin from "@/controllers/admin.controller";
const router = Router();


router.post("/admin/login",  admin.Adminlogin);

router.post("/admin/logout",  admin.AdminlogOut);

 
router.put("/admin/update",  admin.updateAdminCredentials);

// Add this route to handle getting an admin by ID
router.get('/admin/:id',admin.getAdminById);


export default router;