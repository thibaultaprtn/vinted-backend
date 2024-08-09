const mongoose = require("mongoose");
const User = require("../models/User");

const deleteProfil = async (req, res) => {
  try {
    const profil = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `Le profil de l'utilisateur ${profil.username} a bien été supprimé`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteProfil;
