const getUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "made it to user route",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getUser };
