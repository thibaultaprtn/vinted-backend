const mongoose = require("mongoose");
const Offer = require("../models/Offer");

const filterAndSort = async (req, res) => {
  try {
    const { title, priceMin, priceMax, sort, page } = req.query;
    // console.log("Price Min", priceMin, "type", typeof priceMin);
    // console.log("Price Max", priceMax, "type", typeof priceMax);
    const a = /.*/;
    let filters = {
      product_name: title ? new RegExp(title, "i") : a,
      product_price: {
        $gte: priceMin ? priceMin : 0,
        $lte: priceMax ? priceMax : 100000,
      },
    };
    // console.log("title", title);
    const sorting = sort ? { product_price: sort.substring(6) } : null;
    const limit = 5;
    const skip = page ? limit * (page - 1) : 0;
    // const limit = page ? 5 * page : 5;
    //Remarque : il faudrait tester si on doit définir le limite différement si jamais on le met avant ou après
    const tabtemp = await Offer.find(filters);
    const len = tabtemp.length;
    const tab = await Offer.find(filters)
      .sort(sorting)
      .skip(skip)
      .limit(limit)
      .populate({ path: "owner", select: "account" });
    // console.log("tab", tab);
    res.status(200).json([len, tab]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = filterAndSort;
