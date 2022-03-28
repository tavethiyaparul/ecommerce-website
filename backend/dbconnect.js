const mongoose = require('mongoose')

const conn = mongoose.connect(process.env.MONGOURL,{})
.then(()=>{
    console.log("Connect database");
})

// promise unheandle server closed 
// .catch((error)=>{
//     console.log("Not connect database",error);
// })

module.exports = conn