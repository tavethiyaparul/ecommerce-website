const Order = require("../Models/orderModel")
// const ErrorHander = require('../utils/errorheandler')
const catchAsyncError =require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apifeatures");
const ErrorHander = require("../utils/errorheandler");

//create order
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const{
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})

exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );
    
      if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
      }
    
      res.status(200).json({
        success: true,
        order,
      });
})

//get logged in user order
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
  });

// get all order
  exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount =0

    orders.foreach((order)=>{
        totalAmount += order.totalPrice;
    })
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  });

  // update order status --admin 
  exports.updateOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }

    
    if(order.status === "Delivered")
    {
        return next(new ErrorHander("you have already delivered this order",400))
    }

    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity)
    })

    order.orderStatus = req.body.status

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    
    await order.save({validateBeforeSave :false})
  
    res.status(200).json({
      success: true,
      order
    });
  });

  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }

  //delete order --admin
  exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
      }

    await order.remove()

    res.status(200).json({
      success: true,
     
    });
  });


  
