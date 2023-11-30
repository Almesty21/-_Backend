
const pizzaDb=require("../Model/pizzaModel")
const cloudinary=require("../utils/cloudinary")

const testRoute=(req,res)=>{
    res.status(200).json({message:"Pizza Route is working fine"})
}
const createPizza=async(req,res)=>{

     console.log(JSON.stringify(req.body))
     const{name,varients,prices,category,description}=req.body;
     console.log(req.body)
     //,!category,!description
     if(!name,!varients,!prices){
          res.status(400).json({message:"Please fill in all the details"})
     }
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
     console.log(typeof(prices))
     const pricesData=JSON.parse(prices)
     console.log(pricesData)
     
//     console.log(JSON.parse({Small:200,Medium:350,Large:400}))
     const varientData=varients.split(",")
     console.log(pricesData)
     console.log(varientData)
     const newPizza=new pizzaDb({
          name:name,
          varients:varientData,
          prices:pricesData ,
          category:category,
          image:fileData,
          description:description
     })
     console.log(newPizza)
     try {
          const savedPizza=await newPizza.save();
          console.log("Created pizza successfully")
          console.log(savedPizza)
          res.status(200).json({message:"Successfully saved the pizza",savedPizza})
     } catch (error) {
          console.log("Error in saving pizza")
          console.log(error)
          res.status(400).json({message:"Error in saving the pizza"})
     }
     

}

const getAllPizza=async(req,res)=>{
       try {
            const pizza=await pizzaDb.find();
            res.status(200).json({success:true,pizza})
          //   console.log(pizza[0].prices[0])
          //   console.log(pizza[0].varients)
          //   console.log(pizza[0].image)
       } catch (error) {
            res.status(404).json({status:false,message:"Error in fetching pizzas"})
            console.log(error)
       }

}

const updatePizza=async(req,res)=>{
     const findPizza=await pizzaDb.findById({_id:req.params.id});
     if(findPizza)
     {
   
  const{name,varients,prices,category,description}=req.body;
  console.log(req.body)

     try {
          const updatedData=await pizzaDb.findByIdAndUpdate({_id:req.params.id},{
               name,
               varients,
               prices, 
               category,
               description
          },{new:true});
          res.status(200).json({status:true,message:"Successfully updated the pizza",updatedData});
     } catch (error) {
          console.log(error)
     }}
     else
     {
          res.status(404).json({message:"Pizza not found"})
     }
}

const deletePizza=async(req,res)=>{
     const findPizza=await pizzaDb.findById({_id:req.params.id});
     if(findPizza)
     {
     try {
          const deletedPizza=await pizzaDb.findByIdAndDelete({_id:req.params.id})
          res.status(200).json({status:true,message:"Successfully deleted the data",deletePizza})


     } catch (error) {
          console.log("Error in deleting Pizza")
          console.log(error)
          res.status(500).json({message:"Error in deleting pizza"})
     }}
     else
     {
          res.status(404).json({message:"Pizza not found"})
     }
}




module.exports={testRoute,createPizza,getAllPizza,updatePizza,deletePizza}