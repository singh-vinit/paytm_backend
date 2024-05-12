const { Router } = require("express");
const { Account } = require("../db.js");
const { authMiddleware } = require("../middleware.js");
const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const account = await Account.findOne({ userId });
  res.status(200).json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { to, amount } = req.body;
  const account = await Account.findOne({ userId: req.userId });
  if (account.balance < amount) {
    await session.abortTransaction();
    res.status(400).json({ message: "Insufficient balance" });
  }

  const toAccount = await User.findOne({ _id: to });
  if (!toAccount) {
    await session.abortTransaction();
    res.status(400).json({ message: "Invalid Account" });
  }

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  );
  await Account.updateOne(
    {
      userId: to,
    },
    { $inc: { balance: amount } }
  );

  await session.commitTransaction();
  res.status(200).json({ message: "Transfer Successful" });
});

module.exports = router;
