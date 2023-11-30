const router=require("express").Router()
const { testRoute,createPizza,updatePizza,deletePizza,getAllPizza } =require("../controllers/pizzaController")
const upload=require("../utils/multer")
router.get("/test",testRoute)
router.post("/create",upload.single('image'),createPizza)//requires admin verification
router.delete("/delete/:id",deletePizza)//requires admin verification
router.put("/update/:id",upload.single('image'),updatePizza)//requires admin verification
router.get("/getallpizza",getAllPizza)


 
module.exports=router;