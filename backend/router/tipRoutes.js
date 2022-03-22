const express = require("express");
const router = express.Router();
const { getTip } = require("../controller/tipController");

router.get("/", getTip);

module.exports = router;
