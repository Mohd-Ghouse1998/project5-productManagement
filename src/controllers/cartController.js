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

            if (!validate.isValid(proQuantity)) {
                res.status(400).send({ status: false, message: "enter valide quantity" })
                return
            }

            const checkPrice = await productModel.findOne({ _id: productID })
            const ifCartAlreadyCreated = await cartModel.findOne({ userId })
            // console.log(checkPrice.price)
            // console.log(checkPrice)
            // console.log((ifCartAlreadyCreated.items[0].productId).toString())
            // console.log(ifCartAlreadyCreated.items[0].productId)
            if (!checkPrice) {
                res.status(404).send({ status: false, message: `${productID} id dose not exist` })
                return
            }

            if (ifCartAlreadyCreated) {

                const proP = checkPrice.price * proQuantity
                //todo =-=-=-=-=-=-=-==-=-=-=-========================================================>
                // for(let i = 0; i < ifCartAlreadyCreated.items.length; i++ ){
                //     // console.log(ifCartAlreadyCreated.items[i].productId)
                //     let convertStr = ifCartAlreadyCreated.items[i].productId.toString()
                //     // console.log(convertStr)
                //     if(convertStr === productID){
                //         // console.log(quant)
                //         // console.log(proQuantity)
                //         // let objIndex = ifCartAlreadyCreated.items.findIndex((obj => obj.productId == productID));
                //         // // console.log(objIndex)
                //         const quant = ifCartAlreadyCreated.items[i].quantity
                //         console.log(quant)
                //         const blankArr = []
                //         let takeOldQuant = {defVar: productID, quant: proQuantity + quant}
                //         blankArr.push(takeOldQuant)
                //         console.log(blankArr)
                //         console.log(takeOldQuant)
                //         const updateExistingProduct = await cartModel.findOneAndUpdate({userId: userId}, {items: blankArr, totalPrice: proP + ifCartAlreadyCreated.totalPrice })
                //         res.status(200).send({status: true, message: "thanks for purchesing product have a great day", data: updateExistingProduct})
                //         return
                //     }
                // }
                //     totalItems: ifCartAlreadyCreated + items.length
                // }
                // console.log(proP)
                //todo =-=-=-=-=-=-=-==-=-=-=-========================================================>
                const updateTPriceItems = await cartModel.findOneAndUpdate({ userId }, { totalPrice: proP + ifCartAlreadyCreated.totalPrice, totalItems: ifCartAlreadyCreated.totalItems + items.length }, { new: true })
                const updateItems = await cartModel.updateOne({ userId }, { $push: { items: items } })
                res.status(200).send({ status: true, message: "product added successfully", data: updateTPriceItems })
                return
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

//put api delete product in cart localhost:3000/ /users/:userId/cart

const updateCart = async function (req, res) {
    try {
        let reqBody = req.body        
        let userId = req.params.userId        
        if (!validate.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: "please enter valid userId details" })
            return
        }
        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "please enter valid details" })
            return
        }
        let { cartId, productId, removeProduct } = reqBody        
        const findUser = await userModel.findOne({ userId })
        if (!findUser) {
            res.status(400).send({ status: false, message: "user dose not exist" })
            return
        }
        if (!validate.isValid(cartId)) {
            res.status(400).send({ status: false, message: "enter cart id" })
            return
        }
        if (!validate.isValidObjectId(cartId)) {
            res.status(400).send({ status: false, message: "cart id  is not valid" })
            return
        }
        const findCart = await cartModel.findOne({ cartId })
        if (!findCart) {
            res.status(400).send({ status: false, message: "cart dose not exist" })
            return
        }
        if (!validate.isValid(productId)) {
            res.status(400).send({ status: false, message: "enter product id" })
            return
        }
        if (!validate.isValidObjectId(productId)) {
            res.status(400).send({ status: false, message: "productId is not valid" })
            return
        }
        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false, deletedAt: null })
        let proPrice = findProduct.price        
        console.log(proPrice)
        if (!findProduct) {
            res.status(400).send({ status: false, message: "product dose not exist" })
            return
        }
        if (!validate.isValid(removeProduct)) {
            res.status(400).send({ status: false, message: "remove product is required" })
            return
        }
        let findUserCart = await cartModel.findOne({ _id: cartId })
        let findItems = findUserCart.items        
        console.log(findItems.length)
        let itemArray = findUserCart.items[0].quantity  
        // quantity of product        
        console.log(itemArray)
        let quantPrice = proPrice * itemArray    
        //product + quantitity price        
        console.log(quantPrice)
        let totalP = findUserCart.totalPrice     
        // total price in cart        
        console.log(totalP)
        //  console.log(itemArray)        
        let quantProPrice = quantPrice / itemArray    
        //single product price        
        let findProductInCart = await cartModel.findOne({ _id: cartId ,'items.productId':productId })
        if (!findProductInCart) {
            res.status(400).send({ status: false, message: "product dose not exist in cart " })
            return
        }
        if (removeProduct === 1) {
            await cartModel.findOneAndUpdate({ _id: cartId, 'items.productId': productId }, { $inc: { 'items.$.quantity': Number(-1) } })
            console.log(totalP - quantProPrice)
            let dec = await cartModel.findOneAndUpdate({ _id: cartId }, { totalPrice: totalP - quantProPrice }, { new: true })
            return res.status(200).send({ status: true, message: "product quantity decreased Successfully", data: dec });
        }
        if (removeProduct === 0) {
            const removeProduct = await cartModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { items: { productId: productId } } },
                { new: true },
            );
            console.log(findItems.length)
            await cartModel.findOneAndUpdate({ _id: cartId }, { $inc: { totalItems: Number(-1) } })
            let removePrdt = await cartModel.findOneAndUpdate({ _id: cartId }, { totalPrice: totalP - quantPrice })
            return res.status(200).send({ status: true, message: "cart  Deleted Successfully", data: removePrdt });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    };
};

//get cart details localhost:3000/users/:userId/cart
const getCart = async function (req, res) {
    try {
        let userId = req.params.userId;
        let userToken = req.userId;
        // if (userToken !== userId) {
        //     res.status(400).send({ status: false, message: "authorization failed!" });
        //     return;
        // }
        if (!validate.isValidObjectId(userId)) {
            res.status(404).send({ status: false, message: `${userId} is not valid user id ` });
            return;
        }
        let getUser = await userModel.findOne({ _id: userId });
        if (!getUser) {
            return res.status(404).send({ status: false, msg: "user does not exist" });
        }
        let getCart = await cartModel.findOne({ userId: userId });
        if (!getCart) {
            return res.status(404).send({ status: false, msg: "cart does not exist" });
        }
        res.status(200).send({ status: true, message: "User cart details", data: getCart });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};

module.exports = { getCartDetails, updateCart, getCart }


// const deleteProductInCart = async function (req, res) {

//     try {

//         let reqBody = req.body
//         let reqParams = req.params.userId

//         if (!validate.isValidRequestBody(reqBody)) {
//             return res.status(400).send({ status: false, message: "reqsted fileds required" })
//         }

//         if (validate.isValidObjectId(reqParams)) {
//             return res.status(400).send({ status: false, message: "enter valid object Id" })
//         }

//         let { userId, items, totalPrice, totalItems } = req.body

//         if (!validate.isValid(userId)) {
//             return res.status(400).send({ status: false, message: "user Id is required" })
//         }

//         if (!validate.isValidObjectId(userId)) {
//             return res.status(400).send({ status: false, message: `${userId} is not valid user Id ` })
//         }

//         if (!validate.isValid(items)) {
//             return res.status(400).send({ status: false, message: "items filed is required for delete the cart" })
//         }

//         const productID = items[0].productId
//         const proQuantity = items[0].quantity

//         if(!validate.isValid(productID)){
//             return res.status(400).send({status: false, message: "enter valid product Id"})
//         }

//         if(!validate.isValidObjectId(productID)){
//             return res.status(400).send({status: false, message: `${productID} is not a valid Object Id`})
//         }

//         const isProductAvailable = await productModel.findOne({_id: productID})

//         if(!isProductAvailable){
//             return res.status(400).send({status: false, message: `${productID} is not available`})
//         }

//         if(!validate.isValid(proQuantity)){
//             return res.status(400).send({status: false, message: "set quantity!"})
//         }



//     } catch (error) {

//     }
// }