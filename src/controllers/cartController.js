let validate = require('./validator');
let userModel = require('../models/userModel');
let productModel = require('../models/productModel'); 

let getCartDetails = async function(req, res){

    let reqBody = req.body
    
    if(!validate.isValidRequestBody( reqBody )) {
        res.staus(400).send({staus: false, message: "please enter valid details"})
    }

    let { userId, items, totalPrice, totalItems } = reqBody
}