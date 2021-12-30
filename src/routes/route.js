const express = require('express');
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
// let awsController = require('../controllers/awsController')
const router = express.Router();
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
router.post('/users/:userId/cart', cartController.getCartDetails)
router.put('/users/:userId/cart', cartController.updateCart)
router.get('/users/:userId/cart', cartController.getCart)

module.exports = router;