const User = require("../model/UserModel");

const postRegister = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      res.status(400);
      return next(new Error("Please fill out all fields"));
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400);
      return next(new Error("That email has already been registered"));
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
      return next(new Error("Please enter all fields"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      return next(new Error("No user found with that email"));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(400);
      return next(new Error("Invalid credentials"));
    }

    const token = await user.getSignedToken();
    if (!token) {
      res.status(500);
      return next(new Error("Something went wrong please try again"));
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

module.exports = { postRegister, postLogin };
