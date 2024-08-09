const express = require("express");
const router = express.Router();
const filterAndSort = require("../utilitaryFunctions/filterAndSort");
const getOffer = require("../utilitaryFunctions/getOffer");

router.get("/", filterAndSort);

router.get("/:id", getOffer);

module.exports = router;
