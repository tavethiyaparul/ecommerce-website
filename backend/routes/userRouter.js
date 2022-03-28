const express = require('express')
const router = express.Router()
const { isAuthentication,authorizeRoles } = require('../middleware/auth');
const { registerUser,loginUser, logout,forgotPassword,resetPassword,getUserDetails,updatePassword,updateProfile,getAllUser,getSingleUser,updateUserRole,deleteUser } = require('../controllers/userController')

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthentication, getUserDetails);
router.route("/password/update").put(isAuthentication, updatePassword);
router.route("/me/update").put(isAuthentication, updateProfile);

router
  .route("/admin/users")
  .get(isAuthentication, authorizeRoles("admin"), getAllUser);

  router
  .route("/admin/user/:id")
  .get(isAuthentication, authorizeRoles("admin"), getSingleUser)
  .put(isAuthentication, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthentication, authorizeRoles("admin"), deleteUser);

router.route("/logout").get(logout)
module.exports= router 