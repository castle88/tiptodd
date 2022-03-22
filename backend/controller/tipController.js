const getTip = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "made it to tip route",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { getTip };
