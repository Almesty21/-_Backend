const { test, placeOrder } = require("../controllers/orderController")

const router=require("express").Router()



router.get("/test",test)
router.post("/payment",placeOrder)



module.exports=router