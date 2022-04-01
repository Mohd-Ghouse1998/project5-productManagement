const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

let InvoiceSchema = new mongoose.Schema({

    userId:{
        type:objectId,
        ref:'USERS',
        required:true
    },
    userName:String,

    items: [{
        productId: {
            type: objectId,
            refs: "Product",
            required: true
        },
        productName:{
            type:String
        }
        
    
    }],

    productName:String,
    productPrice:Number,
    GST:Number,
    
    totalPrice:Number,
    address:{
    shipping: {
        street: {
            type: String,
            required: "enter your address"
        },
        city: {
            type: String,
            require: "enter your city"
        },
        pincode: {
            type: Number,
            required: "enter pinCode its mandatory"
        },
    },
        billing: {
            street: {
                type: String,
                required: "enter your address"
            },
            city: {
                type: String,
                require: "enter your city"
            },
            pincode: {
                type: Number,
                required: "enter pinCode its mandatory",
            },
        
        },
    }

}, { timestamps: true });

module.exports=mongoose.model('Invoice' , InvoiceSchema)
