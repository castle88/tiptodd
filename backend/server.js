const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const port = process.env.PORT || 1337;
const morgan = require("morgan");
const connectDB = require("./config/database");
const tipRoutes = require("./router/tipRoutes");
const userRoutes = require("./router/userRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
// app.use(helmet())
// app.use(cors())

app.use("/api/tip", tipRoutes);
app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`API listening\nport: ${port}`));
