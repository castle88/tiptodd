const User = require("../model/UserModel");
const crypto = require("crypto");

const postRegister = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please fill out all fields");
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error("That email has already been registered");
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const token = newUser.getSignedToken();

    res.status(200).json({
      success: true,
      message:
        "Your account has been successfully registered, Welcome to TipTODD",
      token,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("Please enter all fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("No user found with that email");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const token = await user.getSignedToken();
    if (!token) {
      res.status(500);
      throw new Error("Something went wrong please try again");
    }

    res.status(200).json({
      success: true,
      message: "successfully logged in, welcome",
      token,
    });
  } catch (err) {
    res.status(500);
    next(err);
  }
};

const postForgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400);
      throw new Error("Must provide registered valid email");
    }

    const accnt = await User.findOne({ email }).select("-password");

    if (!accnt) {
      res.status(404);
      throw new Error("could not send reset email");
    }

    const resetToken = accnt.getResetToken();

    await accnt.save();

    try {
      // send reset email here

      res.status(200).json({
        success: true,
        message: "reset password email sent",
        resetToken: `http://localhost:1337/api/user/reset/${resetToken}`,
      });
    } catch (err) {
      accnt.resetPasswordToken = undefined;
      accnt.resetPasswordExpire = undefined;
      await accnt.save();
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

const patchResetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  console.log(token);
  console.log(newPassword);
  try {
    if (!newPassword) {
      res.status(400);
      throw new Error("could not reset");
    }

    const resetToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(404);
      throw new Error("Could not reset");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "password successfully reset",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postRegister,
  postLogin,
  postForgotPassword,
  patchResetPassword,
};
