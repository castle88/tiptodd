const express = require("express");
const router = express.Router();
const { postRegister } = require("../controller/userController");

router.post("/register", postRegister);

module.exports = router;
