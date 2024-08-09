const User = require("../models/User");
const Offer = require("../models/Offer");

//Cette fonction permet de créer un document correspondant à une nouvelle offre sans uploader de photos
//Elle prend en entrée un body contenant toutes les paires clefs/valeurs du modèle Offer et en files des photos avec la key "picture"

const createOffer = async (req, res, next) => {
  try {
    //destructuring
    const { title, description, price, condition, city, brand, size, color } =
      req.body;
    let item = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [
        { MARQUE: brand },
        { TAILLE: size },
        { ÉTAT: condition },
        { COULEUR: color },
        { EMPLACEMENT: city },
      ],
      owner: req.user._id,
    });
    await item.save();
    req.body._id = item._id;
    req.offer = item;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//La fonction rajoute l'id généré dans le body qui permettra d'être appelé dans les fonctions suivantes (addPic)

module.exports = createOffer;
