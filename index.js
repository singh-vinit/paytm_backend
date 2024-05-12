const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const rootRouter = require("./routes/index.js");

//initialize express app
const app = express();

//global middlewares
app.use(cors());
app.use(express.json());

//routes middleware
app.use("/api/v1", rootRouter);

//listen to server
app.listen(3000, () => console.log("server is running..."));
