const ErrorHander = require('../utils/errorheandler');
const catchAsyncError =require('./catchAsyncError')
const jwt = require("jsonwebtoken")
const User = require("../Models/userModel")

exports.isAuthentication = catchAsyncError(async(req,res,next)=>{
    const {token}= req.cookies
    if(!token)
    {
        return next(new ErrorHander('please login to access this resource',401))
    }

    const decodedata = jwt.verify(token,process.env.JWT_SECERT)
    req.user= await User.findById(decodedata.id)

    next()
})

exports.authorizeRoles = (...roles) =>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next( new ErrorHander(
                `Roles: ${req.user.role} is not allowed access this resource`,403
            ))
        }
        next();
    }
}

