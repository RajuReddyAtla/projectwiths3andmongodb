import { Router } from "express";
 import { signUp,login, logOut, forgotPassword, resetPassword, getUserById} from "@/controllers/user.controllers";

const router = Router();


router.post("/user/register",  signUp);

router.post("/user/login",  login);

router.post("/user/logout",  logOut);

router.post("/user/forgotPassword",  forgotPassword);

router.post("/user/resetPassword",  resetPassword);

router.get('/user/:id', getUserById);






export default router;