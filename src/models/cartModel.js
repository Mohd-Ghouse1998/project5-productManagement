let mongoose = require('mongoose')
let objectId = mongoose.Schema.Types.ObjectId

let cartSchema = new mongoose.Schema({

        userId: {
            type: objectId,
            ref: "USERS",
            required: "user id is required",
            unique: "user id must be unique"
        },
        items: [{
            productId: {
                type: objectId,
                ref: "Product",
                required: "product id is mandatory"
            },
            quantity: { 
                type: Number, 
                required: "quantity is mandatory", 
                min: 1
            }
        }],
        totalPrice: { 
            type: Number, 
            required: "price is mandatory"
        },
        totalItems: { 
            type: Number, 
            required: "totel items is mandatory"
        },
}, {timestamps: true});

module.exports = mongoose.model("Cart", cartSchema) 