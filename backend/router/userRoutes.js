const express = require("express");
const router = express.Router();
const {
  postRegister,
  postLogin,
  postForgotPassword,
  patchResetPassword,
} = require("../controller/userController");

router.post("/register", postRegister);

router.post("/login", postLogin);

router.post("/request-reset", postForgotPassword);

router.patch("/reset/:token", patchResetPassword);

module.exports = router;
