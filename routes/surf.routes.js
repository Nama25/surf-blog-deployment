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
const surfingType = ["Surfing", "Body Surfing", "Body Boarding"]

router.get("/create-surf-spot", isLoggedIn, (req, res) => {
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
router.post("/create-surf-spot" , ( req, res) => {
    console.log(req.body)

    const {spotImage, beachName, country, mapLink, skillLevel, spotDescription, accessibility,amenities, foodSpots, rating, typeOfSurfing} = req.body

    SurfSpot.create({
        spotImage:spotImage,
        beachName:beachName,
        country:country,
        mapLink:mapLink,
        skillLevel:skillLevel,
        spotDescription:spotDescription,
        accessibility: accessibility,
        amenities:amenities,
        foodSpots:foodSpots,
        rating:rating, 
        typeOfSurfing:typeOfSurfing
    })
    .then((result) => {
        console.log(result);
        res.redirect(`/surf-spot-profile/${result_id}`);
    })
    .catch((err) => console.log(err));
})

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