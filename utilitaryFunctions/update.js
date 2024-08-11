const mongoose = require("mongoose");
const User = require("../models/User");

//La fonction update modifie les paramètres d'un utilisateur renseignés dans le body
const update = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    for (let keys in req.body) {
      if (user[keys]) {
        user[keys] = req.body[keys];
      }
    }
    await user.save();
    req.body._id = req.params.id;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = update;
