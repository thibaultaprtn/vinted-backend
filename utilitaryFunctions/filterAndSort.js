const mongoose = require("mongoose");
const Offer = require("../models/Offer");

const filterAndSort = async (req, res) => {
  try {
    const { title, priceMin, priceMax, sort, page } = req.query;
    const a = /.*/;
    let filters = {
      product_name: title ? new RegExp(title, "i") : a,
      product_price: {
        $gte: priceMin ? priceMin : 0,
        $lte: priceMax ? priceMax : 100000,
      },
    };
    const sorting = sort ? { product_price: sort.substring(6) } : "";
    const limit = 5;
    const skip = page ? limit * (page - 1) : 0;
    //const limit = page ? 5 * page : 5;
    //Remarque : il faudrait tester si on doit définir le limite différement si jamais on le met avant ou après
    const tab = await Offer.find(filters)
      .sort(sorting)
      .skip(skip)
      .limit(limit)
      .populate({ path: "owner", select: "account" });
    res.status(200).json(tab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = filterAndSort;
