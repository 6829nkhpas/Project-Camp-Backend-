import { registerUser } from "../controllers/auth_controler";
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