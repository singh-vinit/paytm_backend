const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 10,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 10,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 10,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };