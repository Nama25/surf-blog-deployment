const express = require('express');
const SurfSpot = require('../models/SurfSpot.model');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
/*   function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  let random  */

  SurfSpot.find()
  .then((result) => {
    res.render("index", {result});
  })
  .catch((error) => console.log("Error on HP:" , error))
  
});

module.exports = router;
