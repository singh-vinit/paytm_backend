const { Router } = require("express");
const userRouter = require("./user.js");
const router = Router();

router.use("/user", userRouter);

module.exports = router;
