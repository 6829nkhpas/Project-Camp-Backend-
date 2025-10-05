import {User} from '../models/User.js';
import {Apierror} from '../utils/Apirespose.js';
import {asynchandler} from './asyncHandler.js';
import jwt from 'jsonwebtoken';

const verifyToken = asynchandler(async (req,res,next)=>{

    const token = req.cookies?.acessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
        throw new Apierror(401,"Not authorized to access this route, please login");
    }
    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
        if(!req.user){
            throw new Apierror(401,"No user found with this id, please login again");
        }
        next();
    } catch (error) {
        throw new Apierror(401,"Not authorized to access this route, please login");
    }
});
export {verifyToken};