const validate = require('./validator');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel')


//create cart localhost:3000/users/:userId/cart
const getCartDetails = async function (req, res) {

    try {

        let reqBody = req.body
        let reqParams = req.params.userId
        const varifyUser = req.userId

        if (!validate.isValidObjectId(reqParams)) {
            res.staus(400).send({ staus: false, message: "please enter valid details" })
            return
        }

        if (!validate.isValidRequestBody(reqBody)) {
            res.staus(400).send({ staus: false, message: "please enter valid details" })
            return
        }

        if (varifyUser !== reqParams) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
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

            if (!validate.isValid(proQuantity)) {
                res.status(400).send({ status: false, message: "enter valide quantity" })
                return
            }

            const checkPrice = await productModel.findOne({ _id: productID })
            const ifCartAlreadyCreated = await cartModel.findOne({ userId })

            if (!checkPrice) {
                res.status(404).send({ status: false, message: `${productID} id dose not exist` })
                return
            }

            if (ifCartAlreadyCreated) {

                const proP = checkPrice.price * proQuantity
                for (let i = 0; i < ifCartAlreadyCreated.items.length; i++) {
                    let convertStr = ifCartAlreadyCreated.items[i].productId.toString()
                    if (convertStr === productID) {

                        let find = ifCartAlreadyCreated.items.find(function (post, index) {
                            let consStr = post.productId.toString()
                            if (consStr === productID) {
                                return true;
                            }
                        })
                        const updateExistingProduct = await cartModel.findOneAndUpdate({ userId: userId, 'items.productId': productID }, { 'items.$.quantity': find.quantity + proQuantity, totalPrice: proP + ifCartAlreadyCreated.totalPrice }, { new: true })
                        res.status(200).send({ status: true, message: "thanks for purchesing product have a great day", data: updateExistingProduct })
                        return
                    }
                }
                // totalItems: ifCartAlreadyCreated + items.length
                console.log(proP)
                const updateItems = await cartModel.updateOne({ userId }, { $push: { items: items } })
                const updateTPriceItems = await cartModel.findOneAndUpdate({ userId }, { totalPrice: proP + ifCartAlreadyCreated.totalPrice, totalItems: ifCartAlreadyCreated.totalItems + items.length }, { new: true })
                res.status(200).send({ status: true, message: "product added successfully", data: updateTPriceItems })
                return
            }

            let saveCart = {
                userId,
                items,
                totalPrice: checkPrice.price * proQuantity,
                totalItems: items.length
            };
            // console.log(saveCart)

            const createCart = await cartModel.create(saveCart)
            res.status(201).send({ status: true, message: "cart successfully created", data: createCart })
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
        const varifyUser = req.userId

        if (!validate.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: "please enter valid userId details" })
            return
        }
        if (!validate.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "please enter valid details" })
            return
        }

        //compair token and user id
        if (!(varifyUser === userId)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
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
        const findCart = await cartModel.findOne({userId:userId,_id:cartId })
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
        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
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

       // let findItems = findUserCart.items
       // console.log(findItems.length)
        const findQuant = findUserCart.items.find(c => c['productId'] == productId)
        if(!findQuant){
            res.status(400).send({status:false,message:"product does not  exist in this cart"})
            return

        }
       console.log(findQuant)
       console.log(findQuant.productId)
        let totalItems = findQuant.quantity
        // quantity of product        
        //console.log(itemArray)
        let quantPrice = proPrice * totalItems
        //product + quantitity price        
        console.log(quantPrice)
        let totalP = findUserCart.totalPrice
        // total price in cart        
        console.log(totalP)
        //  console.log(itemArray)        
        let quantProPrice = quantPrice / totalItems
        //single product price        
        let findProductInCart = await cartModel.findOne({ _id: cartId, 'items.productId': productId })
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
            await cartModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { items: { productId: productId } } },
                { new: true },
            );
            // console.log(findItems.length)
            await cartModel.findOneAndUpdate({ _id: cartId }, { $inc: { totalItems: Number(-1) } })
            let removePrdt = await cartModel.findOneAndUpdate({ _id: cartId }, { totalPrice: totalP - quantPrice }, { new: true })
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
        let varifyUser = req.userId;

        if (!validate.isValidObjectId(userId)) {
            res.status(404).send({ status: false, message: `${userId} is not valid user id ` });
            return;
        }

        if (!(varifyUser === userId)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
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


const deleteCart = async function (req, res) {

    try {

        const reqParams = req.params.userId
        const varifyUser = req.userId

        if (!validate.isValidObjectId(reqParams)) {
            return res.status(400).send({ status: false, message: `${reqParams} is not a valid userId` })
        }

        if (!(varifyUser === reqParams)) {
            res.status(400).send({ status: false, message: "user Authorization failed" })
            return
        }

        const isUserExist = await userModel.findOne({ _id: reqParams })
        if (!isUserExist) {
            return res.status(400).send({ status: false, message: `${reqParams} user not available` })
        }

        const isCartExist = await cartModel.findOne({ userId: reqParams })
        if (!isCartExist) {
            return res.status(400).send({ status: false, message: `user don't have cart` })
        }

        // console.log(isCartExist.items.length)
        if (isCartExist.items.length === 0) {
            return res.status(400).send({ status: false, message: `product not available in existing cart` })
        }


        const deleteProducts = await cartModel.findOneAndUpdate({ userId: reqParams }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })
        return res.status(200).send({ status: false, message: `product successfully deleted`, data: deleteProducts})

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    };
};

module.exports = { getCartDetails, updateCart, getCart, deleteCart }