const router = require("express").Router();
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");
const User = require("../models/User.model");

// USER PROFILE ROUTES
// GET route
router.get("/profile/:usernameId", isLoggedIn, (req, res) => {
  console.log("req.params?", req.params.usernameId);
  User.findById(req.params.usernameId)
    //   User.findOne({username: req.params.usernameId}) -> username for URL
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
router.get("/create-profile", isLoggedIn, (req, res) => {
  res.render("user/create-user-profile", {
    surfingLevel,
    surfingType,
    userInSession: req.session.currentUser,
  });
});

//POST route
router.post("/create-profile", (req, res) => {
  console.log(req.body);

  const { profileImage, surfLevel, typeOfSurfing, favoriteSpots } = req.body;
  // Add Profile image field
  if (!surfLevel || !typeOfSurfing) {
    res.render("user/create-user-profile", {
      surfingLevel,
      surfingType,
      userInSession: req.session.currentUser,
      errorMessage: "Fields with * are mandatory.",
    });
  }

  User.create({
    profileImage: profileImage,
    surfLevel: surfLevel,
    typeOfSurfing: typeOfSurfing,
    favoriteSpots: favoriteSpots,
    // username: req.session.currentUser._id  -> username in URL
  })
    .then((result) => {
      console.log(result);
      res.redirect(`/user/profile/${result._id}`);
      //   res.redirect(`/user-profile/${result.username}`); -> username in URL
    })
    .catch((err) => console.log(err));
});

// EDIT USER PROFILE route
// GET route
router.get("/profile/edit/:usernameId", isLoggedIn, (req, res) => {
  const { usernameId } = req.params;

  User.findById(usernameId)
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
      res.redirect(`/user/profile/${result._id}`);
    })
    .catch((error) => console.log("Error updating user profile", error));
});

// POST route
router.post("/profile/edit/:usernameId", (req, res) => {
  const { usernameId } = req.params;
  const { profileImage, surfLevel, typeOfSurfing, favoriteSpots } = req.body;

  User.findByIdAndUpdate(
    usernameId,
    {
      profileImage,
      surfLevel,
      typeOfSurfing,
      favoriteSpots,
    },
    { new: true }
  )
    .then((updatedResult) => res.redirect(`/user/profile/${updatedResult.id}`))
    .catch((error) => console.log("Error updating your profile:", error));
});

module.exports = router;
