require('dotenv').config()
require('./dbconnect')
const cloudinary  = require('cloudinary')
const app = require('./app')
const port = process.env.PORT||6000


// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server =app.listen(port,()=>{
    console.log("server starting in port no:",port);
})

//unhendle promise rejection
process.on('unhandledRejection',(err) =>{
    console.log(`Error ${err.message}`);
    console.log('shutting down the server due to unhandler promise rejection');

    server.close(()=>
    process.exit(1))
})
