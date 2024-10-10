const express = require("express");
const { register, login, logout, getAllUsers, getUser, updateProfile, verifyPassword } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authenticate");
const { validateRegister, validateLogin } = require("../middlewares/authErrorHandler");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/user", authenticate, getUser);
router.get("/users", authenticate, getAllUsers);
router.post("/verify", authenticate, verifyPassword);
router.put("/update", authenticate, updateProfile);
router.get("/logout", logout);

module.exports = router;