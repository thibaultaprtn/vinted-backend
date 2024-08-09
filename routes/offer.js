const express = require("express");
const router = express.Router();
router.use(express.json());

const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");
const createOffer = require("../utilitaryFunctions/createOffer");
const addPic = require("../utilitaryFunctions/addPic");

const User = require("../models/User"); //Obligatoire
const Offer = require("../models/Offer"); //Obligatoire

router.post(
  "/publish",
  fileUpload(),
  isAuthenticated,
  createOffer,
  addPic,
  async (req, res) => {
    try {
      // Solution plus couteuse mais qui permet de ne pas avoir à fait de nouvelle requête findById
      // const document = await Offer.findById(req.body._id, "-__v").populate(
      //   "owner",
      //   "+ account -_id"
      // );
      const a = await req.offer.populate("owner", "+ account -_id");
      res.status(200).json(a);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

//Correction
router.get("/", async (req, res) => {
  //console.log("Dans la routé /offer");

  //On crée un objet pour les filtres du find
  //Rmq : si on met un objet vide en argument de la méthode find() ca ne filtre pas
  const filters = {};
  if (req.query.title) {
    filters.product_name = new RegExp(req.query.title, "i");
  }

  if (req.query.priceMin) {
    filters.product_price = { $gte: Number(req.query.priceMin) };
  }

  if (req.query.priceMax) {
    if (filters.product_price) {
      filters.product_price.$lte = Number(req.query.priceMax);
    } else {
      filters.product_price = { $lte: Number(req.query.priceMax) };
    }
  }

  //On crée un objet pour le tri
  const sort = {};

  if (req.guery.sort === "price-asc") {
    sort.product_price = 1;
  } else if (req.query.sort === "price-desc") {
    sort.product_price = -1;
  }

  let page = 1;

  if (req.query.page) {
    page = req.query.page;
  }

  const limit = 5;
  const skip = (page - 1) * limit;

  const result = await Offer.find().sort().skip().limit(limit);
  res.status(200).json({ count: result.length, offers: result });
});

module.exports = router;
