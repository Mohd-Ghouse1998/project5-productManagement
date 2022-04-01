const invoiceModel = require("../models/invoiceModel");
const orderModel=require('../models/orderModel');
const productModel = require("../models/productModel");
const userModel=require("../models/userModel")


//-----------------create invoice---------------------



const createInvoice = async function (req, res) {
  try {
    let reqBody = req.body;
    let userId=req.params.userId

let product=await orderModel.findOne({userId:userId})
let productItems=product.items

let products1=productItems.map((a)=>{
  return a.productId 
})

 let productId=products1.toString()

let findUserName=await userModel.findOne({_id:userId})
 let products=await productModel.findOne({_id:productId})
let productName=products.title
 let productPrice=products.price
 let GstPrice=(18/100)*productPrice
 let gst=GstPrice

let invoiceData={
  userId:userId,
  userName:findUserName.fname,
  items:product.items,
  productName:productName,
  productPrice:productPrice,
  GST:GstPrice,
  totalPrice:productPrice + gst,
  address:findUserName.address
}

let invoice=await invoiceModel.create(invoiceData)

res.status(201).send({status:true , message:"invoice created successfully",invoice})



  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
    
  }
};



//--------------------------------get all invoices-------------------------

const getInvoice=async function(req,res){
  try{

    let userId=req.params.userId

    let findInvoice=await invoiceModel.find()

    res.status(200).send({status:true, message:"users invoice details",findInvoice})

  }catch(error){
    res.status(500).send({status:false , message:error.message})
  }
}



//-------------------------------update invoice---------------------

const updateInvoice=async function(req,res){
  try{

    let invoiceId=req.params.invoiceId
    let requestBody=req.body

    let {userName,productName,productPrice,totalPrice,GST}=requestBody


    let findInvoice=await invoiceModel.findOne({_id:invoiceId})
    if (requestBody.address) {
      // requestBody.address = JSON.parse(requestBody.address)            if (requestBody.address.shipping) {
      if (requestBody.address.shipping.street) {
        findInvoice.address.shipping.street = requestBody.address.shipping.street
          await UserFound.save()
      }
      if (requestBody.address.shipping.city) {
        findInvoice.address.shipping.city = requestBody.address.shipping.city
          await findInvoice.save()
      }
      if (requestBody.address.shipping.pincode) {
        findInvoice.address.shipping.pincode = requestBody.address.shipping.pincode
          await findInvoice.save()
      }
      if (requestBody.address.billing) {
          if (requestBody.address.billing.street) {
            findInvoice.address.billing.street = requestBody.address.billing.street
              await findInvoice.save()
          }
          if (requestBody.address.billing.city) {
            findInvoice.address.billing.city = requestBody.address.billing.city
              await findInvoice.save()
          }
          if (requestBody.address.billing.pincode) {
            findInvoice.address.billing.pincode = requestBody.address.billing.pincode
              await findInvoice.save()
          }
      }
  }

  const UpdateData = {
    userName,
    productName,
    productPrice,
    totalPrice,
    GST
  }

let update=await invoiceModel.findOneAndUpdate({_id:invoiceId} , UpdateData,{new:true})

    res.status(200).send({status:true, message:"users invoice details",update})

  }catch(error){
    res.status(500).send({status:false , message:error.message})
  }
}


//------------------------delete invoice-----------------------

const deleteInvoice=async function(req,res){
  try{

    let invoiceId=req.params.invoiceId

    let findInvoice=await invoiceModel.findOneAndDelete({_id:invoiceId})

    res.status(200).send({status:true, message:"invoice deleted successfully"})

  }catch(error){
    res.status(500).send({status:false , message:error.message})
  }
}


module.exports={createInvoice , getInvoice, updateInvoice,deleteInvoice}