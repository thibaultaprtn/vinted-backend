const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", ""),
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Token provided is not valid" });
      } else {
        req.user = user;
        console.log("Valid Token - User has been authentified");
      }
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token Provided" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
