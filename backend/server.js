const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const port = process.env.PORT || 1337;
const morgan = require("morgan");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
// app.use(helmet())
// app.use(cors())

app.listen(port, () => console.log(`API listening\nport: ${port}`));
