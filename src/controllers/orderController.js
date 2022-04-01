const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const validate = require("./validator");
const invoiceModel=require('../models/invoiceModel')
const productModel=require('../models/productModel')

//createOrder  localhost:3000/users/:userId/orders
const createOrder = async function (req, res) {
  try {
    let userId = req.params.userId;
    let cartId = req.body.cartId;
    const varifyUser = req.userId;
    let reqbody = req.body;

    if (!validate.isValidObjectId(userId)) {
      res
        .status(400)
        .send({ status: false, message: "please enter valid userId details" });
      return;
    }

    if (!(varifyUser === userId)) {
      res
        .status(400)
        .send({ status: false, message: "user Authorization failed" });
      return;
    }

    const findUser = await userModel.findOne({ _id: userId });

    if (!findUser) {
      res.status(400).send({ status: false, message: "user dose not exist" });
      return;
    }

    const findCart = await cartModel.findOne({ _id: cartId, userId: userId });
    if (!findCart) {
      res.status(400).send({ status: false, message: "cart dose not exist" });
      return;
    }

    const findOrder = await orderModel.findOne({ userId: userId });

    if (findOrder) {
      res
        .status(400)
        .send({ status: false, message: "order already created " });
      return;
    }
    if (!validate.isValid(cartId)) {
      res.status(400).send({ status: false, message: "enter cart id" });
      return;
    }
    if (!validate.isValidObjectId(cartId)) {
      res.status(400).send({ status: false, message: "cart id  is not valid" });
      return;
    }

    let cartItems = findCart.items;
    let cartPrice = findCart.totalPrice;
    let cartTotalItems = findCart.totalItems;
    let cartTotalQuantity = cartItems
      .map((item) => item.quantity)
      .reduce((prev, next) => prev + next);
    let orderDetails = {
      userId: userId,
      items: cartItems,
      totalPrice: cartPrice,
      totalItems: cartTotalItems,
      totalQuantity: cartTotalQuantity,
      cancellable: reqbody.cancellable,
      status: reqbody.status,
    };
    const orderCreated = await orderModel.create(orderDetails);

    //---------------------//
    let product = await orderModel.findOne({ userId: userId });
    let productItems = product.items;

    let products1 = productItems.map((a) => {
      return a.productId;
    });

    let productId = products1.toString();

    let findUserName = await userModel.findOne({ _id: userId });
    let products = await productModel.findOne({ _id: productId });
    let productName = products.title;
    let productPrice = products.price;
    let GstPrice = (18 / 100) * productPrice;
    let gst = GstPrice;

    let invoiceData = {
      userId: userId,
      userName: findUserName.fname,
      items: product.items,
      productName: productName,
      productPrice: productPrice,
      GST: GstPrice,
      totalPrice: productPrice + gst,
      address: findUserName.address,
    };

    let invoice = await invoiceModel.create(invoiceData);

    res
      .status(201)
      .send({
        status: false,
        message: "order created successfully",
        data: orderCreated,
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//updateOrder localhost:3000/users/:userId/orders
const updateOrder = async function (req, res) {
  try {
    let userId = req.params.userId;
    let orderId = req.body.orderId;
    const varifyUser = req.userId;

    // let cancelOrd=req.body.cancelOrder
    if (!validate.isValidObjectId(userId)) {
      res
        .status(400)
        .send({ status: false, message: "please enter valid userId details" });
      return;
    }

    if (!(varifyUser === userId)) {
      res
        .status(400)
        .send({ status: false, message: "user Authorization failed" });
      return;
    }

    const findUser = await userModel.findOne({ _id: userId });
    if (!findUser) {
      res.status(400).send({ status: false, message: "user dose not exist" });
      return;
    }
    if (!validate.isValidObjectId(orderId)) {
      res
        .status(400)
        .send({ status: false, message: "please enter valid orderId details" });
      return;
    }
    const findOrder = await orderModel.findOne({
      _id: orderId,
      userId: userId,
      isDeleted: false,
    });
    if (!findOrder) {
      res
        .status(400)
        .send({ status: false, message: "order Id does not exist" });
      return;
    }
    let isOrderCancellable = findOrder.cancellable;
    let status = findOrder.status;
    if (isOrderCancellable === true) {
      if (status !== "cancelled") {
        const orderCancelled = await orderModel.findOneAndUpdate(
          { _id: orderId },
          {
            $set: {
              status: "cancelled",
              totalPrice: 0,
              totalItems: 0,
              totalQuantity: 0,
              items: [],
              isDeleted: true,
              deletedAt: new Date(),
            },
          },
          { new: true }
        );
        res
          .status(200)
          .send({
            status: true,
            message: "order successfully   cancelled",
            data: orderCancelled,
          });
        return;
      } else {
        res
          .status(400)
          .send({ status: false, message: "order already cancelled" });
      }
    } else {
      res
        .status(400)
        .send({ status: false, message: "order cannot be cancelled" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createOrder, updateOrder };
