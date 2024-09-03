const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
//on fait appel à un middleware, express.json() est une fonction qui permet de lire ce qu'il y a dans les bodys
app.use(express.json());

require("dotenv").config();

//Import du middleware fileUpload qui permet de réceptionner les fichiers des requêtes. On vient le placer dans les requêtes entre la route et le (req,res).
const fileUpload = require("express-fileupload");

//Import de cloudinary
const cloudinary = require("cloudinary").v2;

//Paramétrage de cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

//import de mongoose
const mongoose = require("mongoose");
//connection à la BDD
mongoose.connect(process.env.MONGODB_URI);

//import de mes routeurs
const userRouter = require("./routes/user");
const offerRouter = require("./routes/offer");
const paymentRouter = require("./routes/payment");

//utilisation des mes routeurs
app.use("/user", userRouter); // => Permet d'indiquer que toutes les routes qui viennent du routeur userRouteur doivent débuter par /user, il n'est donc plus nécessaire de l'indiquer dans les routes de user.js
app.use("/offer", offerRouter);
app.use("/payment", paymentRouter);

//Import des packages permettant de gérer les chaines de caractères, le cryptage, les buffers pour cloudinary
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started Successfully");
});
