const User = require("../models/User");
const Offer = require("../models/Offer");
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

//La fonction addPic permet de d'ajouter/rajouter des photos sur une annonce ou d'ajouter/modifier la photo d'avatar d'un utilisateur
//Elle prend en entrée un body qui contient l'id de l'annonce ou de l'utilisateur ainsi qu'une ou plusieurs photos en files qui doivent avoir la key "picture"
//Elle suppose qu'on ne puisse pas mettre plusieurs photos dans le file dans le cas d'une requête pour ajouter/modifier la photo d'avatar d'un utilisateur

const addPic = async (req, res, next) => {
  //Remarque : il faudrait sécuriser le fait que l'on puisse
  try {
    if (req.files) {
      //On n'execute le code que si des photos sont présentes dans le req.files
      const userflag = await User.findById(req.body._id); //Rmq : Je n'ai pas trouvé d'autre moyen que de faire deux requêtes pour couvrir les deux possibilités (requête user / requête offer)
      const offerflag = await Offer.findById(req.body._id);

      if (Array.isArray(req.files.picture)) {
        //En fonction du nombres de fichiers, req.files.picture est un tableau ou un objet. Le cas tableau ne peut correspondre qu'à une requête en lien avec les photos d'une offre

        if (!offerflag.product_image) {
          offerflag.product_image = [];
        }
        for (let i = 0; i <= req.files.picture.length - 1; i++) {
          const pictureConverted = convertToBase64(req.files.picture[i]);
          const result = await cloudinary.uploader.upload(pictureConverted, {
            folder: `/vinted/offers/${req.body._id}`,
          });
          offerflag.product_image.push(result);
        }
      } else {
        //Si req.files.picture n'est pas un tableau, c'est un objet qui peut correspondre à une requête user ou offer
        const pictureConverted = convertToBase64(req.files.picture);
        if (offerflag) {
          //Cas requête offer
          if (!offerflag.product_image) {
            offerflag.product_image = [];
          }
          const result = await cloudinary.uploader.upload(pictureConverted, {
            folder: `/vinted/offers/${req.body._id}`,
          });
          offerflag.product_image.push(result);
        } else if (userflag) {
          //Cas requête user
          const result = await cloudinary.uploader.upload(pictureConverted, {
            folder: `/vinted/users/${req.body._id}`,
          });
          userflag.account.avatar = { secure_url: result.secure_url };
        }
      }

      //On enregistre les modifications faites au document

      if (userflag) {
        await userflag.save();
      } else if (offerflag) {
        await offerflag.save();
      }
    }
    return next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = addPic;
