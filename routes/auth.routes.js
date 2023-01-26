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

// POST route
router.post("/login", (req, res) => {
  console.log('SESSION =====> ', req.session);
  console.log(req.body)
  const {email, password} = req.body

  if (!email || !password) {
    res.render("auth/login", {
      errorMessage:"Please enter your email and password to surf."
    })
    return;
  }
  User.findOne({email})
  .then(user => {
    console.log(user)
    if(!user) {
      res.render("auth/login", {errorMessage: "E-Mail is not registered - please signup "})
    } else if (bcrypt.compareSync(password, user.passwordHash))  {
      req.session.currentUser = user
      res.redirect("/user-profile")
    } else {
      res.render("auth/login", {errorMessage: "Incorrect password"})
    }
    })
    .catch(error => next(error))

})

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
          req.session.currentUser = result
          res.redirect("/create-user-profile");
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

// USER PROFILE ROUTES
// GET route
router.get("/user-profile", isLoggedIn, (req, res) => {
  res.render("user/user-profile", { userInSession: req.session.currentUser });
});

// CREATE USER PROFILE route
// GET route  
  const surfingLevel = ["Beginner", "Intermediate", "Advanced"]
  const surfingType = ["Surfing", "Body Surfing", "Body Boarding"]
// Do we have to add Middleware??????
router.get("/create-user-profile", isLoggedIn, (req, res) => {
 res.render("user/create-user-profile", {surfingLevel, surfingType});
});

//POST route
router.post('/create-user-profile', (req, res) => {
  console.log(req.body)

  const {profileImage, surfLevel, typeOfSurfing, favoriteSpots} = req.body

  UserProfile.create({
    profileImage: profileImage, surfLevel: surfLevel, typeOfSurfing: typeOfSurfing, favoriteSpots: favoriteSpots
  })
  .then( ()=> {
    res.redirect("/user-profile");
  })
  .catch (err => console.log(err))
})


// EDIT USER PROFILE route
// GET route
router.get("/user-profile/edit", isLoggedIn, (req, res) => {
  res.render("user/edit-user-profile", { userInSession: req.session.currentUser });
});

// ALL SURF SPOTS ROUTES
// GET ROUTE
router.get("/all-surf-spots", (req, res) => {
  res.render("surf-spots/all-surf-spots");
});

// CREATE SURF SPOTS ROUTES
// GET route
router.get("/create-surf-spot", isLoggedIn, (req, res) => {
  res.render("surf-spots/create-surf-spot", { userInSession: req.session.currentUser });
});

// SURF SPOT PROFILE ROUTES
// GET route
router.get("/surf-spot-profile/:id", isLoggedIn, (req, res) => {
  res.render("surf-spots/surf-spot-profile", { userInSession: req.session.currentUser });
});

// EDIT SURF SPOT PROFILE ROUTES
// GET route
router.get("/surf-spot-profile/:id/edit", isLoggedIn, (req, res) => {
  res.render("surf-spots/edit-surf-spot", { userInSession: req.session.currentUser });
});

module.exports = router;
