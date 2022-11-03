const express = require("express")
const router = express.Router()

const { adminAuth, userAuth } = require('../middleware/auth')
const { registerUser, loginUser, updateUser, deleteUser, getUser } = require("../controllers/auth")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/update").post(updateUser);
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/user").post(getUser);



module.exports = router