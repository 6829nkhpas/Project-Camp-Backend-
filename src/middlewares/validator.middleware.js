import {validationResult} from 'express-validator';
import {Apierror} from '../helpers/apiError.js';

export const validator = (req,res,next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
    return next();
    }
    const extractedErrors = [];
    errors.array().map(err=>extractedErrors.push({[err.param]: err.msg}));
    return next(new Apierror(422,"Validation Error","Invalid request data",extractedErrors));;

    };
    