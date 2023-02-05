const router = require("express").Router();
const SurfSpot = require("../models/SurfSpot.model");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const {
  isLoggedIn,
  isLoggedOut,
  canEdit,
} = require("../middleware/middleware.js");
// const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");
// Global variables
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

// ALL SURF SPOTS ROUTES
// GET ROUTE
router.get("/all", (req, res) => {
  SurfSpot.find({}, {}, { lean: true })
    // .populate("user")
    .then((surfSpots) => {
      const allResults = surfSpots.map((spot) => {
        const canEdit = spot.user.toString() === req.session.currentUser._id;
        return { ...spot, canEdit };
      });
      console.log(allResults);
      res.render("surf-spots/all-surf-spots", {
        allResults,
      });
    })
    .catch((error) => console.log("Error retrieving all surf spots:", error));
});

//SHOW BEGINNER SURF SPOTS
// GET route

router.get("/all-beginner", (req, res) => {
  SurfSpot.find({skillLevel:"Beginner"})
  .then(result => {
    console.log("Beginner result:", result)
    res.render("surf-spots/beginner-surf-spots", {result})
  })
  .catch((error) => console.log("Beginner result error:", error))
})

//SHOW INTERMEDIATE SURF SPOTS
// GET route

router.get("/all-intermediate", (req, res) => {
  SurfSpot.find({skillLevel:"Intermediate"})
  .then(result => {
    console.log("Intermediate result:", result)
    res.render("surf-spots/intermediate-surf-spots", {result}) 
  })
  .catch((error) => console.log("Inter result error:", error))
})


//SHOW ADVANCED SURF SPOTS
// GET route

router.get("/all-advanced", (req, res) => {
  SurfSpot.find({skillLevel:"Advanced"})
  .then(result => {
    console.log("Advanced result:", result)
    res.render("surf-spots/advanced-surf-spots", {result}) 
  })
  .catch((error) => console.log("Inter result error:", error))
})



// CREATE SURF SPOTS ROUTES
// GET route

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
//multiple images: req.files[0].path, loop through the array up to 5 pictures
// fileUpload.array for multiple pictures
router.post("/create", fileUploader.single("beachImage"), (req, res) => {
  let mainUser;
  User.findById(req.session.currentUser._id).then((userObj) => {
    mainUser = userObj;
  });
  const {
    // imageUrl,
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
  console.log("REQ FILE", req.file);

  if (
    // !imageUrl ||
    !beachName ||
    !country ||
    !mapLink ||
    !skillLevel ||
    !spotDescription ||
    !accessibility ||
    !amenities ||
    !foodSpots ||
    !typeOfSurfing
  ) {
    res.render("surf-spots/create-surf-spot", {
      chooseCountry,
      surfingLevel,
      facilities,
      foodOptions,
      ratingScore,
      surfingType,
      userInSession: req.session.currentUser,
      errorMessage: "Fields with * are mandatory.",
    });
    return;
  }

  return SurfSpot.create({
    // spotImage: spotImage,
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
    imageUrl: req.file.path,
    user: req.session.currentUser._id,
  })
    .then((result) => {
      req.session.currentUser.surfSpot.push(result._id);
      mainUser.surfSpot.push(result._id);
      // User.findByIdAndUpdate(req.session.currentUser._id, req.session.currentUser)
      User.create(mainUser);
      res.redirect(`/surf-spot/profile/${result._id}`);
    })
    .catch((err) => console.log(err));
});

// SURF SPOT PROFILE ROUTES
// GET route
router.get("/profile/:surfSpotId", isLoggedIn, canEdit, (req, res) => {
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
router.get("/profile/edit/:surfSpotId", isLoggedIn, canEdit, (req, res) => {
  const { surfSpotId } = req.params;
  SurfSpot.findById(surfSpotId)
    .then((result) => {
      const countrySelected = chooseCountry.map((countryA) => {
        const selected = countryA === result.country;
        const countryObj = {
          country: countryA,
          selected,
        };
        return countryObj;
      });

      const skillSelected = surfingLevel.map((skill) => {
        const chosenSkill = skill === result.skillLevel;
        const skillObj = {
          skillLevel: skill,
          chosenSkill,
        };
        return skillObj;
      });

      const ratingSelected = ratingScore.map((ratingA) => {
        const chosenRating = ratingA === result.rating;
        const ratingObj = {
          rating: ratingA,
          chosenRating,
        };
        return ratingObj;
      });

      // console.log(countrySelected);
      res.render("surf-spots/edit-surf-spot", {
        // spotImage,
        // chooseCountry,
        // surfingLevel,
        facilities,
        foodOptions,
        // ratingScore,
        surfingType,
        result,
        countrySelected,
        skillSelected,
        ratingSelected,
        userInSession: req.session.currentUser,
      });
    })
    .then(() => {
      res.redirect(`/surf-spot/profile/${result._id}`);
    })
    .catch((error) => {
      "Edit Surf Spot Error:", error;
    });
});

//POST route ->> do we have to use next here? why?
router.post(
  "/profile/edit/:surfSpotId",
  fileUploader.single("updatedImage"),
  (req, res) => {
    const { surfSpotId } = req.params;
    const {
      existingImage,
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

    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = existingImage;
    }

    SurfSpot.findByIdAndUpdate(
      surfSpotId,
      {
        imageUrl,
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
      .catch((error) => console.log("Error while updating Surf spot: ", error));
  }
);

// DELETE surf-spot profile
// POST route

router.post(
  "/profile/delete/:deleteSpotId",
  isLoggedIn,
  canEdit,
  (req, res) => {
    const { deleteSpotId } = req.params;

    SurfSpot.findByIdAndDelete(deleteSpotId)
      .then(() => res.redirect("/surf-spot/all"))
      .catch((err) =>
        console.log("Error in deleting a surf-spot profile:", err)
      );
  }
);

// DELETE from all-surf-spots
// POST route
router.post("/all/delete/:deleteSpotId", isLoggedIn, canEdit, (req, res) => {
  const { deleteSpotId } = req.params;

  SurfSpot.findByIdAndDelete(deleteSpotId)
    .then(() => res.redirect("/surf-spot/all"))
    .catch((err) => console.log("Error in deleting a surf-spot profile:", err));
});

module.exports = router;
