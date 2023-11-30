const mongoose=require("mongoose")

const connect=(uri)=>{mongoose.connect(uri).then((e)=>{
    console.log("Successfully connected to MONGO DB")
}).catch((e)=>{
    console.log("Error in connecting to MONGO DB")
    console.log(e);
})} 
module.exports=connect;