const mongoose=require("mongoose")

const pizzaSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    varients:[String],
    prices:[
        Object
    ],
    category:{
        type:String,
        required:true
    },
    image:{
        type:Object, 
        required:true
    },
    description:{
        type:String,
        required:true
    }

})
const pizzaModel=mongoose.model("Pizza",pizzaSchema)
module.exports=pizzaModel;