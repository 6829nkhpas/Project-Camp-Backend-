import { registerUser,login,logoutUser,getCurrentUser,verifyEmail } from "../controllers/auth_controler";
import express from "express";
const router = express.Router();
import {validate} from '../middlewares/validateRequest.js';
import {
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";
import { VerifyToken } from "../middlewares/auth_middleware.js";



router.post("/register",userRegisterValidator(),validate,registerUser);
router.post("/login",userLoginValidator(),validate,login);
router.post("/logout",VerifyToken,logoutUser);
router.get("/me",VerifyToken,getCurrentUser);
router.get("/verify-email/:verifyToken",verifyEmail);

export default router;