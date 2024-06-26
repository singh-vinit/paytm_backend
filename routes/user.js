const { Router } = require("express");
const { z } = require("zod");
const { User, Account } = require("../db.js");
const { JWT_SECRET } = require("../config.js");
const { authMiddleware } = require("../middleware.js");
const jwt = require("jsonwebtoken");
const router = Router();

const signupSchema = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

const signinSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

const updateSchema = zod.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().optional,
});

router.post("/signup", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const userExist = await User.findOne({ username: req.body.username });
  if (userExist) {
    res.status(411).json({ message: "Email already taken / Incorrect inputs" });
  }
  const user = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });

  await Account.create({
    userId: user._id,
    balance: Math.random() * 10000 + 1,
  });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.status(201).json({
    message: "user created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({ message: "Incorrect inputs" });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (!user) {
    res.status(411).json({ message: "Error while logging in" });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.status(201).json({
    token,
  });
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating",
    });
  }
  await User.findOneAndUpdate({ _id: req.userId }, { $set: req.body });
  res.status(200).json({ message: "updated successfully" });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  const usersArr = users.map((user) => ({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  }));

  res.status(200).json({
    user: usersArr,
  });
});

module.exports = router;
