const express = require('express')
const router = express.Router()
const {getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails,createProductReview,getProductReviews,deleteReview} = require('../controllers/productController');
const { isAuthentication,authorizeRoles } = require('../middleware/auth');


router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthentication,authorizeRoles("admin"),createProduct);

router.route("/product/:id").put(isAuthentication,authorizeRoles("admin"),updateProduct)
.delete(isAuthentication,authorizeRoles("admin"),deleteProduct)
.get(getProductDetails);

router.route("/reviews").put(isAuthentication,createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthentication, deleteReview);


module.exports = router