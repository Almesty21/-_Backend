const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    address: {
        type: Object,
        required: true
    },
    orderStatus: {
        type: Boolean,
        default: false
    },
    details: [
        {
            type: Object

        }
    ],
    subtotal: {
        type: Number,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)