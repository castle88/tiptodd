const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: [true, "That username is already in use"],
    minLength: 4,
  },
  email: {
    type: String,
    unique: [true, "That email address is not valid"],
  },
  password: {
    type: String,
    minLength: 6,
    required: [true, "You need a password to login"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
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

UserSchema.methods.getResetToken = function () {
  const reset = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(reset)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return reset;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
