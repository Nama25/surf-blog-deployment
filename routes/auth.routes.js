const router = require("express").Router();
const bcrypt = require("bcryptjs");
/* const Comments = require("../models/Comments.model");
const SurfSpot = require("../models/SurfSpot.model");
const UserProfile = require("../models/UserProfile.model"); */
const saltRounds = 10;
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");
const User = require("../models/User.model");

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

// POST route
router.post("/login", (req, res) => {
  console.log("YOu have been Logged in!!");
  console.log("SESSION =====> ", req.session);
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter your email and password to surf.",
    });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.render("auth/login", {
          errorMessage: "E-Mail is not registered - please signup ",
        });
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((error) => console.log(error));
});

// SIGNUP ROUTES
// GET route
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST route
router.post("/signup", isLoggedOut, (req, res, next) => {
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
          req.session.currentUser = result;
          res.redirect("/create-user-profile");
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

// LOGOUT ROUTES
// post
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    console.log("Logged Out");
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
