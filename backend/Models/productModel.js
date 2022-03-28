const mongoose = require('mongoose')


const producrSchama = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Price"],
        maxLength:[8,"Price can not exceed 8 charcter"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"please Enter Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"please Enter Product stock"],
        maxLength:[4,"stock can not exceed 4 charcter"],
        default:1
    },
    numOfReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
              },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            } 
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports= mongoose.model("Product",producrSchama)