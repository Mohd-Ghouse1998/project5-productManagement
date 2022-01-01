const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
//middeleware
const midvarify = require('../middleware/verify')

// router.post('/write-file-aws', awsController.createProfilePicture)
router.post('/register', userController.registerUser)
router.post('/login', userController.login)
router.get('/user/:userId/profile', midvarify.varifyUser, userController.getUser)
router.put('/user/:userId/profile',midvarify.varifyUser, userController.updateUserDetailes)

//product routes-------->
router.post('/products',productController.releaseProduct )
router.get('/products',productController.getProduct )
router.get('/products/:productId',productController.getProductById )
router.put('/products/:productId',productController.updateProduct )
router.delete('/products/:productId',productController.deleteproductByID )

//cart routes---------->
router.post('/users/:userId/cart',midvarify.varifyUser, cartController.getCartDetails)
router.put('/users/:userId/cart',midvarify.varifyUser,  cartController.updateCart)
router.get('/users/:userId/cart', midvarify.varifyUser, cartController.getCart)
router.delete('/users/:userId/cart',midvarify.varifyUser, cartController.deleteCart)

//order Routes------------->
router.post('/users/:userId/orders', midvarify.varifyUser, orderController.createOrder)
router.put('/users/:userId/orders', midvarify.varifyUser, orderController.updateOrder)

module.exports = router;