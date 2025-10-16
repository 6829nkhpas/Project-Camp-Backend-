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

const login= asynchandler(async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new Apierror(400, "Email and Password are required");
    }
    const user= await User.findOne({email});
    if(!user){
        throw new Apierror(404, "User not found please register");

    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new Apierror(401, "Invalid Credentials");
    }
    const {accessToken,refreshToken} = await generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
    const options = {
        httpOnly:true,
      secure:true
    };
    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new Apiresponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "User Logged In Successfully"
        ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});
const getCurrentUser = asynchandler(async (req, res) => {
    return res
      .status(200)
      .json(
        new Apiresponse(200, { user: req.user }, "Current user fetched successfully"),
      );
  
});
const verifyEmail = asyncHandler(async (req, res) => { 
    const {verifyToken} = req.params;
    if(!verifyToken){
        throw new Apierror(400, "Invalid Token");
    }
    const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {$gt: Date.now()},
    });
    if(!user){
        throw new Apierror(400, "Invalid or Expired Token");
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({validateBeforeSave:false});
    return res
    .status(200)
    .json(new Apiresponse(200, {isEmailVerified: true}, "Email Verified Successfully"));
 });
 const resendEmailVerification = asynchandler(async (req, res) => { 
    const user = await User.findById(req.user._id);
    if(!user){
        throw new Apierror(404, "User not found");
    }
    if(user.isEmailVerified){
        throw new Apierror(400, "Email is already verified");
    }
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
    return res
    .status(200)
    .json(new Apiresponse(200, {}, `Email has been Resent to ${user.email}`));
});
const refreshAccessToken = asynchandler(async (req, res) => { 
    const {refreshToken} = req.cookies.refreshToken || req.body.refreshToken;
    if(!refreshToken){
        throw new Apierror(400, "Refresh Token is missing Unauthorized");
    }
   try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if(!decoded){
        throw new Apierror(401, "Invalid Refresh Token");
    }
    const user = await User.findById(decoded._id);
    if(!user){
        throw new Apierror(404, "User not found");
    }
    if(user.refreshToken !== refreshToken){
        throw new Apierror(401, "Expired Refresh Token");
    }
    const {accessToken, refreshToken: newRefreshToken} = await generateTokens(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({validateBeforeSave:false});
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new Apiresponse(200, {user, accessToken, refreshToken: newRefreshToken}, "Access Token refreshed successfully"));
   } catch (error) {
    
    throw new Apierror(401, "Invalid Refresh Token");
   }
    });
const forgotPaswordRequest = asynchandler(async (req, res) => { 
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new Apierror(404, "User not found");
    }
    const {unHashedToken, hashedToken, tokenExpiry} =user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;
    await user.save({validateBeforeSave:false });
    await sendEmail({
        email:user?.email,
        subject: "Password Reset Request",
        mailgenContent: forgotPasswordTemplate(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${unHashedToken}`,
            10
        )
    });
    return res
    .status(200)
    .json(new Apiresponse(200, {}, `Password reset email has been sent to ${user.email}`));
});


export {registerUser, login, logoutUser, getCurrentUser, verifyEmail, resendEmailVerification, refreshAccessToken, forgotPaswordRequest};
