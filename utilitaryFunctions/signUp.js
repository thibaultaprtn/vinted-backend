const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

//La fonction signUp permet de créer un profil utilisateur sans uploader la photo d'avatar
//Elle prend en entrée un body avec toutes les propriétés du modèle User ainsi qu'une photo facultative en file avec la key.

const signUp = async (req, res, next) => {
  try {
    //destructuring
    const { username, email, password, newsletter } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Il manque un paramètre dans les champs d'entrée" });
    }

    if (newsletter !== true && newsletter !== false) {
      return res
        .status(400)
        .json({ message: "La newsletter n'est ni false ni true" });
    }

    let tab = await User.findOne({ email: email });
    if (tab) {
      return res
        .status(409) //statut pour le conflit
        .json({ message: "L'email est déjà associé à un compte" });
    }

    let tab2 = await User.findOne({ account: { username: username } });
    if (tab2) {
      return res
        .status(409) //statut pour le conflit
        .json({ message: "L'username a déjà été attribué" });
    }

    const salt = uid2(64);
    const token = uid2(64);
    const hash = SHA256(password + salt).toString(encBase64);

    //remarque : quand on crée un document, on peut avoir une variable dont le nom est le nom de la clef, auquel cas on peut se contenter d'écrire la variable sans les : ;

    let newProfil = new User({
      email: email,
      account: { username: username },
      newsletter: newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });

    await newProfil.save();
    req.body._id = newProfil._id;
    req.body.token = newProfil.token;
    return next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

//On rajoute l'id et le token dans le body afin de pouvoir les appeler dans les fonctions suivantes (notamment addPic)

module.exports = signUp;
