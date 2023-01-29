const router = require("express").Router();
const UserProfile = require("../models/UserProfile.model");
// const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");

// USER PROFILE ROUTES
// GET route
router.get("/user-profile/:usernameId", isLoggedIn, (req, res) => {
  console.log("req.params?", req.params.usernameId);
  UserProfile.findById(req.params.usernameId)
    .then((result) => {
      res.render("user/user-profile", {
        result,
        user: req.session.currentUser,
      });
    })
    .catch((error) => console.log("User Profile Error:", error));
});

// CREATE USER PROFILE route
// GET route
const surfingLevel = ["Beginner", "Intermediate", "Advanced"];
const surfingType = ["Surfing", "Body Surfing", "Body Boarding"];
// Do we have to add Middleware??????
router.get("/create-user-profile", isLoggedIn, (req, res) => {
  res.render("user/create-user-profile", {
    surfingLevel,
    surfingType,
    userInSession: req.session.currentUser,
  });
});

//POST route
router.post("/create-user-profile", (req, res) => {
  console.log(req.body);

  const { profileImage, surfLevel, typeOfSurfing, favoriteSpots } = req.body;

  UserProfile.create({
    profileImage: profileImage,
    surfLevel: surfLevel,
    typeOfSurfing: typeOfSurfing,
    favoriteSpots: favoriteSpots,
  })
    .then((result) => {
      console.log(result);
      res.redirect(`/user-profile/${result._id}`);
    })
    .catch((err) => console.log(err));
});

// EDIT USER PROFILE route
// GET route
router.get("/user-profile/edit/:usernameId", isLoggedIn, (req, res) => {
  const { usernameId } = req.params;

  UserProfile.findById(usernameId)
    .then((result) => {
      console.log(result);
      res.render("user/edit-user-profile", {
        surfingLevel,
        surfingType,
        userInSession: req.session.currentUser,
        result,
      });
    })
    .then(() => {
      res.redirect(`/user-profile/${result._id}`);
    })
    .catch((error) => console.log("Error updating user profile", error));
});

// POST route
router.post("/user-profile/edit/:usernameId", (req, res) => {
  const { usernameId } = req.params;
  const { profileImage, surfLevel, typeOfSurfing, favoriteSpots } = req.body;

  UserProfile.findByIdAndUpdate(
    usernameId,
    {
      profileImage,
      surfLevel,
      typeOfSurfing,
      favoriteSpots,
    },
    { new: true }
  )
    .then((updatedResult) => res.redirect(`/user-profile/${updatedResult.id}`))
    .catch((error) => console.log("Error updating your profile:", error));
});

module.exports = router;
