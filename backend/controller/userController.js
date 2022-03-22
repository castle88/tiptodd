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

module.exports = { postRegister };
