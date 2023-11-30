const userDB = require("../Model/userModel")
const bcrypt = require("bcryptjs")

const jwt=require("jsonwebtoken")
const cloudinary=require("../utils/cloudinary")
require('dotenv').config();
const test=(req,res)=>{
    res.status(200).json({message:"Auth working fine"})
}
const registerUser = async (req, res) => {
    const { name, password, email,isAdmin,phone } = req.body;
    console.log(req.body)
    if(!name||!email||!password||!phone)
    {
        res.status(204).json({message:"Fill in all the fields"})
    }
    const userExist = await userDB.findOne({ email: email })
    if (userExist) {
        res.status(400).json({ message: "User already exists" })
    }
    else{
        let uploadedFile;
     var fileData={}
     if(req.file)
     {
          try { 
               uploadedFile=await cloudinary.uploader.upload(req.file.path,{
                    folder:"Cheesy Pizza",
                    resource_type:"image"
               })
          } catch (error) {
               console.log("Error in uploading pizza")
               console.log(error)
               res.status(500).json({message:"Error in uploading Image"}); 
          }
          console.log(uploadedFile)
          fileData={
               fileName:req.file.originalname,
               filePath:uploadedFile.secure_url,
               fileType:req.file.mimetype,
          }
     }
     
    const salt = await bcrypt.genSalt(10)
    const newUser = new userDB(
        {
            name: name,
            password:await bcrypt.hash(password,salt),
            email:email,
            isAdmin:isAdmin!==undefined?isAdmin:false,
            image:fileData,
            phone:phone
 
        }
    
    )
    try {
        await newUser.save();
        
        res.status(200).json({message:"User Saved Successfully"})
    } catch (error) {
        res.status(500).json({message:"Error in saving User",error})
    } 
}
}

const loginUser=async (req,res)=>{
    const{email,password}=req.body;
    const findUser=await userDB.findOne({email:email})
    if(findUser){
        const checkPassword=await bcrypt.compare(password,findUser.password);
        if(checkPassword){
            const token=jwt.sign({
                
                id:findUser._id,
            },process.env.JWTSECRET,{
                expiresIn:'30d'
            })
            const { password,createdAt,updatedAt, ...docs } = findUser.toObject();
            res.status(200).json({message:"Successful Login",token,user:docs})
        }
        else{ 
            res.status(400).json({message:"Password incorrect"});
        }
    }
    else
    {
        res.status(404).json({message:"User doesnot exist"})
    }
}


module.exports={test,registerUser,loginUser}