const mongoose = require('mongoose')
const validator =  require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const crypto = require('crypto') 

const userSchma = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxlength:[30,"Name can not exceed 30 charcter"],
        minlength:[4,"Name should have more the 4 charcter"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validator:[validator.isEmail,"Please Enter valide Email"],
    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minlength:[8,"Password should be greater then 8 charcter"],
        select:false
    },
    avatar:{
        public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
},
role:{
    type:String,
    default:"user",
},
createdAt:{
    type:Date,
    default:Date.now
},
resetPasswordToken:String,
resetPasswordExpair:Date,
});



userSchma.pre('save',async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password =await bcrypt.hash(this.password,10)
})

userSchma.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECERT,{
        expiresIn:process.env.JWT_EXPAIR
    })
}

userSchma.methods.comparePassword = async function(enterpassword){
    return await bcrypt.compare(enterpassword,this.password)
}

userSchma.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpair= Date.now() + 15 *60 *1000

    return resetToken
}

module.exports = mongoose.model("User",userSchma)