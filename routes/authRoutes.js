const { registerUser, loginUser, test } = require('../controllers/authController');
const upload=require("../utils/multer")
const router=require('express').Router();

router.get("/test",test);
router.post("/register",upload.single('image'),registerUser)
router.post("/login",loginUser)


module.exports=router;