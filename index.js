const express=require('express')
const app=express();
const port=process.env.PORT||5000
const bodyParser=require("body-parser");
const cors=require("cors")
const connect =require("./db/db");
require("dotenv").config()


//Routes import
const pizzaRoutes=require("./routes/pizzaRoutes")
const authRoutes=require("./routes/authRoutes")
const orderRoutes=require("./routes/orderRoutes")
const userRoutes=require("./routes/userRoutes")


//Middlewares
app.use(cors({
    origin:["http://localhost:3000","http://192.168.0.193:3000/","https://pizzacheez.netlify.app"]
}))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//route middleware
app.use("/api/pizza",pizzaRoutes);
app.use("/api/auth",authRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/user",userRoutes)

//Server test route
app.get("/",(req,res)=>{
    res.status(200).json({status:true,message:"Server is online and working!"})
})


//Connection to mongo db
connect(process.env.MONGO_URI)


//Server listening
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
