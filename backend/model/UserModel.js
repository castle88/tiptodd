const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minLength: 4,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 6,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// UserSchema.methods.getResetToken = function () {};

const User = mongoose.model("User", UserSchema);

module.exports = User;
