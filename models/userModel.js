const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
});

module.exports = mongoose.model("User", userSchema);
