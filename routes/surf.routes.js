const router = require("express").Router();
const SurfSpot = require("../models/SurfSpot.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");
// const User = require("../models/User.model");


// ALL SURF SPOTS ROUTES
// GET ROUTE
router.get("/all-surf-spots", (req, res) => {
  res.render("surf-spots/all-surf-spots");
});

// CREATE SURF SPOTS ROUTES
// GET route
router.get("/create-surf-spot", isLoggedIn, (req, res) => {
  res.render("surf-spots/create-surf-spot", {
    userInSession: req.session.currentUser,
  });
});

// SURF SPOT PROFILE ROUTES
// GET route
router.get("/surf-spot-profile/:id", isLoggedIn, (req, res) => {
  res.render("surf-spots/surf-spot-profile", {
    userInSession: req.session.currentUser,
  });
});

// EDIT SURF SPOT PROFILE ROUTES
// GET route
router.get("/surf-spot-profile/:id/edit", isLoggedIn, (req, res) => {
  res.render("surf-spots/edit-surf-spot", {
    userInSession: req.session.currentUser,
  });
});

module.exports = router;