const router = require("express").Router();
const SurfSpot = require("../models/SurfSpot.model");
const mongoose = require("mongoose");
const {
  isLoggedIn,
  isLoggedOut,
  canEdit,
} = require("../middleware/middleware.js");
// const User = require("../models/User.model");

// ALL SURF SPOTS ROUTES
// GET ROUTE
router.get("/all", (req, res) => {
  SurfSpot.find()
    .then((allResults) => {
      res.render("surf-spots/all-surf-spots", { allResults });
    })
    .catch((error) => console.log("Error retrieving all surf spots:", error));
});

// CREATE SURF SPOTS ROUTES
// GET route
const chooseCountry = [
  "Denmark",
  "France",
  "Great Britain",
  "Greece",
  "Ireland",
  "Italy",
  "Netherlands",
  "Norway",
  "Portugal",
  "Spain",
];
const surfingLevel = ["Beginner", "Intermediate", "Advanced"];
const facilities = ["Showers", "Toilets", "None"];
const foodOptions = ["Cafe", "Restaurant", "Supermarket", "Bar"];
const ratingScore = [1, 2, 3, 4, 5];
const surfingType = ["Surfing", "Body Surfing", "Body Boarding"];

router.get("/create", isLoggedIn, (req, res) => {
  res.render("surf-spots/create-surf-spot", {
    chooseCountry,
    surfingLevel,
    facilities,
    foodOptions,
    ratingScore,
    surfingType,
    userInSession: req.session.currentUser,
  });
});

//POST route
router.post("/create", (req, res) => {
  const {
    spotImage,
    beachName,
    country,
    mapLink,
    skillLevel,
    spotDescription,
    accessibility,
    amenities,
    foodSpots,
    rating,
    typeOfSurfing,
  } = req.body;

  if (!spotImage || !beachName || !country || !mapLink ||!skillLevel || !spotDescription ||!accessibility || !amenities || !foodSpots || !typeOfSurfing) {
    res.render("surf-spots/create-surf-spot", { chooseCountry,
        surfingLevel,
        facilities,
        foodOptions,
        ratingScore,
        surfingType,
        userInSession: req.session.currentUser,
        errorMessage: "Fields with * are mandatory."
    })
    return 
  }

  SurfSpot.create({
    spotImage: spotImage,
    beachName: beachName,
    country: country,
    mapLink: mapLink,
    skillLevel: skillLevel,
    spotDescription: spotDescription,
    accessibility: accessibility,
    amenities: amenities,
    foodSpots: foodSpots,
    rating: rating,
    typeOfSurfing: typeOfSurfing,
  })
    .then((result) => {
      console.log(result);
      res.redirect(`/surf-spot/profile/${result._id}`);
    })
    .catch((err) => console.log(err));
});

// SURF SPOT PROFILE ROUTES
// GET route
router.get("/profile/:surfSpotId", isLoggedIn, (req, res) => {
  SurfSpot.findById(req.params.surfSpotId)
    .then((result) => {
      res.render("surf-spots/surf-spot-profile", {
        result,
        userInSession: req.session.currentUser,
      });
    })
    .catch((error) => console.log("Surf Spot Error:", error));
});

// EDIT SURF SPOT PROFILE ROUTES
// GET route
router.get(
  "/profile/edit/:surfSpotId",
  isLoggedIn,
  // canEdit,
  (req, res) => {
    const { surfSpotId } = req.params;
    SurfSpot.findById(surfSpotId)
      .then((result) => {
        console.log(result);
        res.render("surf-spots/edit-surf-spot", {
          chooseCountry,
          surfingLevel,
          facilities,
          foodOptions,
          ratingScore,
          surfingType,
          result,
          userInSession: req.session.currentUser,
        });
      })
      .then(() => {
        res.redirect(`/surf-spot/profile/${result._id}`);
      })
      .catch((error) => {
        "Edit Surf Spot Error:", error;
      });
  }
);

//POST route ->> do we have to use next here? why?
router.post("/profile/edit/:surfSpotId", (req, res) => {
  const { surfSpotId } = req.params;
  const {
    spotImage,
    beachName,
    country,
    mapLink,
    skillLevel,
    spotDescription,
    accessibility,
    amenities,
    foodSpots,
    rating,
    typeOfSurfing,
  } = req.body;

  SurfSpot.findByIdAndUpdate(
    surfSpotId,
    {
      spotImage,
      beachName,
      country,
      mapLink,
      skillLevel,
      spotDescription,
      accessibility,
      amenities,
      foodSpots,
      rating,
      typeOfSurfing,
    },
    { new: true }
  )
    .then((updatedResult) =>
      res.redirect(`/surf-spot/profile/${updatedResult.id}`)
    )
    .catch((err) => console.log(err));
});

// DELETE surf-spot profile
// POST route

router.post("/profile/delete/:deleteSpotId", (req, res) => {
  const { deleteSpotId } = req.params;

  SurfSpot.findByIdAndDelete(deleteSpotId)
    .then(() => res.redirect("/surf-spot/all"))
    .catch((err) => console.log("Error in deleting a surf-spot profile:", err));
});

// DELETE from all-surf-spots
// POST route
router.post("/all/delete/:deleteSpotId", (req, res) => {
  const { deleteSpotId } = req.params;

  SurfSpot.findByIdAndDelete(deleteSpotId)
    .then(() => res.redirect("/surf-spot/all"))
    .catch((err) => console.log("Error in deleting a surf-spot profile:", err));
});

module.exports = router;
