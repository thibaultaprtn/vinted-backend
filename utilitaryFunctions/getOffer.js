const Offer = require("../models/Offer");
const mongoose = require("mongoose");

const getOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate({
      path: "owner",
      select: "account",
    });
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getOffer;
