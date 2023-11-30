const { test, findUser } = require("../controllers/userController");

const router=require("express").Router();


router.get("/test",test)
router.get("/finduser/:id",findUser)




module.exports=router