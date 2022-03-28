const ErrorHander = require('../utils/errorheandler')
const catchAsyncError = require("../middleware/catchAsyncError")
const User = require('../Models/userModel')
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require('crypto')
const cloudinary = require('cloudinary')

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder:'avatars',
        width:150,
        crop:"scale"    
    });
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url:myCloud.secure_url,
        },
    })

    sendToken(user, 201, res)
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHander("Please Enter email & password", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHander("Invalid email & password"))
    }

    const ismatched = await user.comparePassword(password)

    if (!ismatched) {
        return next(new ErrorHander("Invalid email & password"))
    }
    sendToken(user, 200, res)
})


exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "loged out"
    })
})

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHander("user not found", 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
     const resetPasswordUrl = `${process.env.FRONTEND_URL}://${req.get("host")}/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Ecommerce Passsword Recovery',
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHander(error.message, 500));
    }
})

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpair: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHander(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpair = undefined;

    await user.save();

    sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});


exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const newUserdata = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.body.avatar !== "")
    {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId)
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder:'avatars',
            width:150,
            crop:"scale"    
        });

        newUserdata.avatar ={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }

    } 
    const user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        user
    });
})

exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });

  // Get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


exports.deleteUser = catchAsyncError(async (req, res, next) => {
   
   const user = await User.findById(req.params.id)

   if(!user){
    return next(
        new ErrorHander(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    await user.remove()

    res.status(200).json({
      success: true,
      message:"delete user"
    });
  });