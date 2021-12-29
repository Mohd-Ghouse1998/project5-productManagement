const validate = require('./validator');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel')

//create cart localhost:3000/users/:userId/cart
const getCartDetails = async function (req, res) {

    try {
        let reqBody = req.body
        let reqParams = req.params.userId

        if (!validate.isValidObjectId(reqParams)) {
            res.staus(400).send({ staus: false, message: "please enter valid details" })
            return
        }

        if (!validate.isValidRequestBody(reqBody)) {
            res.staus(400).send({ staus: false, message: "please enter valid details" })
            return
        }

        let { userId, items, totalPrice, totalItems } = reqBody

        if (reqParams === userId) {
            if (!validate.isValid(userId)) {
                res.status(400).send({ status: false, message: "enter valide user id" })
                return
            }

            if (!validate.isValidObjectId(userId)) {
                res.status(400).send({ status: false, message: `${userId} is not a valid userId` })
                return
            }

            const findUser = await userModel.findOne({ userId })
            if (!findUser) {
                res.status(400).send({ status: false, message: "user dose not exist" })
                return
            }

            let productID = items[0].productId
            let proQuantity = items[0].quantity
            //todo validate items------------------------------------------------------------------------------>
            if (!validate.isValid(items)) {
                res.status(400).send({ status: false, message: "enter valide items" })
                return
            }

            if (!validate.isValid(productID)) {
                res.status(400).send({ status: false, message: "enter valide productId" })
                return
            }

            if (!validate.isValidObjectId(productID)) {
                res.status(400).send({ status: false, message: "productId not valid" })
                return
            }
            // console.log(items[0])
            // console.log(items[0].productId)
            // console.log(productID)

            // const findProduct = await productModel.findOne(items[0])
            // if (!findProduct) {
            //     res.status(400).send({status: false, message: "product dose not exist"})
            // }

            if (!validate.isValid(proQuantity)) {
                res.status(400).send({ status: false, message: "enter valide quantity" })
                return
            }

            //todo if cart already exist------------------------------->
            const checkPrice = await productModel.findOne({ _id: productID })
            const ifCartAlreadyCreated = await cartModel.findOne({ userId })
            console.log(checkPrice.price)
            console.log(checkPrice)
            
            if (ifCartAlreadyCreated) {
                
                // let ifSave = {
                    //     userId,
                    //     items,
                    //     totalPrice: (checkPrice.price * proQuantity) + ifCartAlreadyCreated.totalPrice,
                    //     totalItems: ifCartAlreadyCreated + items.length
                    // }
                    let itms =  checkPrice.items
                    console.log(itms)
                const proP = checkPrice.price * proQuantity
                console.log(proP)
                const updateItems = await cartModel.updateOne({userId}, {$push: {items: items}})
                const updateTPriceItems = await cartModel.findOneAndUpdate({userId}, {totalPrice: proP + ifCartAlreadyCreated.totalPrice, totalItems: ifCartAlreadyCreated.totalItems + items.length}, {new: true})
                res.status(200).send({status: true, message: "product added successfully", data: updateTPriceItems})
                return

                // for(let i = 0; i < checkPrice.items.length; i++ )
                // if(items){
                //     const addItems = await cartModel.update({userId}, {$push: {items}})

                //     let len = items.length
                //     // let saveUpdateCart = {
                //     //     items: addItems,
                //     //     totalPrice,
                //     //     totalItems: +len
                //     // }
                //     const updateCart = await cartModel.updateOne({userId}, {$inc: {totalItems: +len,}}, {$push: {items: items.productId}})
                //     res.status(200).send({status: true, message: " cart successfully created ", data: updateCart})
                //     return
                // // }
            }
            // console.log(productID)
            // console.log(productID)
            // console.log(productID)
            // let checkPrice = await productModel.findOne({ productID })
            // console.log(checkPrice.price)
            //todo if cart already exist------------------------------>
            var saveCart = {
                userId,
                items,
                totalPrice: checkPrice.price * proQuantity,
                totalItems: items.length
            };
            // console.log(saveCart)

            const createCart = await cartModel.create(saveCart)
            res.status(200).send({ status: true, message: "cart successfully created", data: createCart })
            return
        } else {
            res.status(400).send({ status: false, message: "user dose not match" })
            return
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    };
};

module.exports = { getCartDetails }