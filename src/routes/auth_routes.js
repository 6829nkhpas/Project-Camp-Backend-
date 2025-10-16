import { registerUser, login, logoutUser,changePassword, getCurrentUser,resetForgotPassword, verifyEmail, resendEmailVerification, refreshAccessToken, forgotPaswordRequest} from "../controllers/auth_controler";
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

//unsecure routes

router.post("/register",userRegisterValidator(),validate,registerUser);
router.post("/login",userLoginValidator(),validate,login);
router.route("/verify-email/:verifyToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPaswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword);
//secure routes
router.route("/logout").post(VerifyToken,logoutUser);
router.route("/current-user").get(VerifyToken,getCurrentUser);
router.route("change-password").post(VerifyToken,userChangeCurrentPasswordValidator(),validate,changePassword);
router.route("/resend-verification-email").post(VerifyToken,resendEmailVerification);



export default router;