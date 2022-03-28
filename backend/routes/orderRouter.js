const express = require('express')
const router = express.Router()
const { isAuthentication,authorizeRoles } = require('../middleware/auth');
const {newOrder,getSingleOrder,myOrders,getAllOrders,updateOrders,deleteOrder} =require("../controllers/orderController")

router.route("/order/new").post(isAuthentication,newOrder);

router.route("/order/:id").get(isAuthentication, getSingleOrder);

router.route("/order/me").get(isAuthentication,myOrders);

router.route("/order").get(isAuthentication,getAllOrders);

router.route("/order/:id").put(isAuthentication,updateOrders).delete(isAuthentication,deleteOrder)

module.exports = router
