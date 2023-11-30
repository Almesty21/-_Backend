require("dotenv").config
const { v4: uuidv4 } = require('uuid')
const stripe = require("stripe")(process.env.STRIPESECRET)
const orderDb = require("../Model/orderModel")
const userDb = require("../Model/userModel")



const test = (req, res) => {
    res.status(200).json({ message: "Order Route Working fine" })
}

const placeOrder = async (req, res) => {
    const { subtotal, token, currentuser, cartItems } = req.body
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const payment = await stripe.paymentIntents.create({
            amount: subtotal * 100,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email,
        }, {
            idempotencyKey: uuidv4()
        })
        const address = {
            address: token.card.address_line1 + " " + (token.card.address_line2 !== null ? token.card.address_line2 !== null : ""),
            city: token.card.address_city,
            country: token.card.address_country,
            pincode: token.card.address_zip
        }

        // console.log(address)
        // console.log(cartItems)

        if (payment) {
            console.log(payment)
            const newOrder = new orderDb({
                address: address,
                orderStatus: true,
                details: cartItems,
                subtotal: parseInt(subtotal)
            })
            console.log(currentuser)
            // console.log(newOrder)
            try {
                const savedOrder = await newOrder.save();
                const findUser = await userDb.findById({ _id: currentuser._id })
                console.log(findUser)
                const updatedUser = await userDb.findByIdAndUpdate({ _id: currentuser._id }, {
                    $push: { order: savedOrder._id },
                }, { new: true })
                // if(findUser.address.length==0){
                //     const updatedUser2 = await userDb.findByIdAndUpdate({ _id: currentuser._id }, {
                //         $push: { address: address },
                //     }, { new: true }) 
                // }
                if (findUser.address.filter(e => e.pincode !== address.pincode).length === findUser.address.length) {
                    const updatedUser2 = await userDb.findByIdAndUpdate({ _id: currentuser._id }, {
                        $push: { address: address },
                    }, { new: true })

                }

                // console.log(updatedUser)
                res.status(200).json({ message: "Order placed successfully", savedOrder })
            } catch (error) {
                console.log("Error in saving order")
                console.log(error)
                res.status(500).json({ message: "Failed to place order successfully" })
            }
        }
        else {
            res.status(500).json({ message: "Error in processing payment" })
        }
    } catch (error) {
        console.log("error occured here")
        console.log(error)
        res.status(500).json({ message: "Error occured in processing payment ", error })
    }
}



module.exports = { test, placeOrder }