import {User} from '../models/user.js';
import {Apiresponse} from '../utils/Apirespose.js';
import {Apierror} from '../utils/ErrorRespose.js';
import {asynchandler} from '../middlewares/asyncHandler.js';
import jwt from 'jsonwebtoken';
import {sendEmail, emailVerificationTemplate, forgotPasswordTemplate, emailVerificationMailgenContent} from '../utils/mail.js';
const generateTokens = async (userId) =>{
    try {
         const user = await User.findById(userId);
         if(!user){
            throw new Apierror(404, "User not found");
         }
         const accessToken =  user.generateaccessToken();
         const refreshToken = user.generateRefreshToken();
         await user.save({validateBeforeSave:false});
         return {accessToken, refreshToken};
         //
         user.refreshToken = user.generateRefreshToken();
        
    } catch (error) {
        throw new Apierror(500, "Internal Server Error");
    }
}

const registerUser = asynchandler(async (req,res)=>{
    const {email,username,password,role} = req.body;
    const userdata=await User.findOne({
        $or:[{email},{username}]
    });
    if(userdata){
        throw new Apierror(409,"username or email already have an account");
    }
    const user =await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
    })
    const {unHashedToken, hashedToken, tokenExpiry} =user.generateTemporaryToken();
    user.emailverificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({validateBeforeSave:false });
    await sendEmail({
        email:user?.email,
        subject: "Please Verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,

        )
    });
    const createdUser =await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    if(!createdUser){
        throw new Apierror(500, "something went Wrong while regestering the user please try again");
    }
     return res
     .status(201)
     .json(
        new Apiresponse(
            200,
            {
                user:createdUser
            },
            `User Registered Successfully and Verification Email has been sent you ${email}`,
        )
     )
});
export {registerUser};
