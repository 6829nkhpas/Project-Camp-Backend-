import user from '../models/user.js';
import jwt from 'jsonwebtoken';
import asynchandler from '../utils/asynchandler.js';
import Apiresponse from '../utils/Apirespose.js';
import { sendEmail, emailVerificationTemplate, forgotPasswordTemplate } from '../utils/mail.js';
import crypto from 'crypto';

// Register a new user
export const register = asynchandler(async (req, res) => {
    const { username, email, password } = req.body;