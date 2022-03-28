const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require("cookie-parser")
const errormiddleware = require("./middleware/error")
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')


app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }))
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())


const product = require('./routes/productRouter')
const user = require('./routes/userRouter')
const order = require('./routes/orderRouter')

app.get("/hi",(req,res)=>{
    res.send('hello')
})

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)

app.use(errormiddleware)

module.exports = app