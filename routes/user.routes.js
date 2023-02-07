const router = require("express").Router();
const mongoose = require("mongoose");
const {
  isLoggedIn,
  canEdit,
  isLoggedOut,
} = require("../middleware/middleware.js");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

// Arrays
const surfingLevel = ["Beginner", "Intermediate", "Advanced"];
const surfingType = ["Surfing", "Body Surfing", "Body Boarding"];

// USER PROFILE ROUTES
// GET route
router.get("/profile/:usernameId", isLoggedIn, (req, res) => {
  // console.log("req.params?", req.params.usernameId);
  User.findById(req.params.usernameId)
    //   User.findOne({username: req.params.usernameId}) -> username for URL
    .populate("surfSpot")
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

// Do we have to add Middleware??????
router.get("/create-profile", isLoggedIn, (req, res) => {
  res.render("user/create-user-profile", {
    surfingLevel,
    surfingType,
    userInSession: req.session.currentUser,
  });
});

//POST route
router.post("/create-profile", fileUploader.single("userImage"), (req, res) => {
  console.log(req.body);

  const { surfLevel, typeOfSurfing, favoriteSpots } = req.body;
  console.log("REQ FILE", req.file);

  // Add Profile image field
  if (!surfLevel || !typeOfSurfing) {
    res.render("user/create-user-profile", {
      surfingLevel,
      surfingType,
      userInSession: req.session.currentUser,
      errorMessage: "Fields with * are mandatory.",
    });
  }

  User.findByIdAndUpdate(req.session.currentUser._id, {
    // profileImage: profileImage,
    surfLevel: surfLevel,
    typeOfSurfing: typeOfSurfing,
    favoriteSpots: favoriteSpots,
    imageUrl: req.file.path,
    // username: req.session.currentUser._id  -> username in URL
  })
    .then((result) => {
      // console.log(result);
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
      console.log("Result not defined:", result);
      const levelSelected = surfingLevel.map((level) => {
        const chosenLevel = level === result.surfLevel[0];
        const levelObj = {
          surfLevel: level,
          chosenLevel,
        };
        return levelObj;
      });

      const typeArray = [];
      for (let i = 0; i < surfingType.length; i++) {
        if (result.typeOfSurfing.includes(surfingType[i])) {
          typeArray.push({ isChecked: true, surfType: surfingType[i] });
        } else {
          typeArray.push({ isChecked: false, surfType: surfingType[i] });
        }
      }
      // console.log(typeArray);

      // console.log("Selected Level", levelSelected);
      // console.log(result);
      res.render("user/edit-user-profile", {
        // surfingLevel,
        surfingType,
        levelSelected,
        userInSession: req.session.currentUser,
        result,
        typeArray,
      });
      return result;
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
