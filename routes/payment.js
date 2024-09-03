const express = require("express");
const router = express.Router();
router.use(express.json());

const stripe = require("stripe")(process.env.STRIPESECRETKEY);

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const paymentIntent = await stripe.paymentIntents.create({
      // montant (envoyé par le body !)
      amount: Number((req.body.price * 100).toFixed(0)),
      // la devise
      currency: "eur",
      // description
      description: req.body.title,
    });
    // on renvoie cette intention de paiement à notre front !
    res.json(paymentIntent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
