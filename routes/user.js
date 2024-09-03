const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const User = require("../models/User");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const signUp = require("../utilitaryFunctions/signUp");
const addPic = require("../utilitaryFunctions/addPic");
const update = require("../utilitaryFunctions/update");
const deleteProfil = require("../utilitaryFunctions/deleteProfil");
const login = require("../utilitaryFunctions/login");

router.post("/signup", fileUpload(), signUp, addPic, async (req, res) => {
  console.log(req);
  res.status(201).json({
    _id: req.body._id,
    token: req.body.token,
    account: { username: req.body.username },
  });
});

router.post("/login", login);

router.put("/update/:id", fileUpload(), update, addPic, (req, res) => {
  res.status(200).json({ message: "Le profil a bien été mis à jour" });
});

router.delete("/delete/:id", deleteProfil);

module.exports = router;
