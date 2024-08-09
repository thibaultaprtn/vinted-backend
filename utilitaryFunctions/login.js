const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let profil = await User.findOne({ email: email });
    if (!profil) {
      return res
        .status(400)
        .json({ message: "L'email renseigné ne correspond à aucun profil" });
    }
    let passwordToTest = SHA256(password + profil.salt).toString(encBase64);
    if (passwordToTest === profil.hash) {
      console.log("Identification réussie");
      return res.status(200).json({
        _id: profil._id,
        token: profil.token,
        account: { username: profil.account.username },
      });
    } else {
      return res.status(400).json({ message: "Le mot de passe est incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = login;
