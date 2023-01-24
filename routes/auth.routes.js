const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Comments = require("../models/Comments.model");
const SurfSpot = require("../models/SurfSpot.model");
const User = require("../models/User.model");
const UserProfile = require("../models/UserProfile.model");
const saltRounds = 10;
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");

// HOMEPAGE ROUTES
// GET route
router.get("/", (req, res) => {
  res.render("index");
});

// LOGIN ROUTES
// GET route
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// SIGNUP ROUTES
// GET route
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// POST route
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  bcrypt
    .genSalt(saltRounds)
    // .then((salt) => bcrypt.hash(password, salt))
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    //   return statement? return bcrypt.hash(password, salt)
    .then((hashedPassword) => {
      return User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword,
      })
        .then((result) => {
          console.log("New user created:", result);
          res.redirect("/user-profile");
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

// USER PROFILE ROUTES
// GET route
router.get("/user-profile", (req, res) => {
  res.render("user/user-profile");
});

// CREATE USER PROFILE route
// GET route
router.get("/create-user-profile", (req, res) => {
  res.render("user/create-user-profile");
});

// ALL SURF SPOTS ROUTES
// GET ROUTE
router.get("/all-surf-spots", (req, res) => {
  res.render("surf-spots/all-surf-spots");
});

// CREATE SURF SPOTS ROUTES
// GET route
router.get("/create-surf-spot", (req, res) => {
  res.render("surf-spots/create-surf-spot");
});

// SURF SPOT PROFILE ROUTES
// GET route
router.get("/surf-spot-profile/:id", (req, res) => {
  res.render("surf-spots/surf-spot-profile");
});

module.exports = router;
