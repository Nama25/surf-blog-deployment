const router = require("express").Router();
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");
const User = require("../models/User.model");
const Comments = require("../models/Comments.model");
const SurfSpot = require("../models/SurfSpot.model.js");

router.post("/profile/:commentId", (req, res, next) => {
  const { commentId } = req.params;
  const { user, commentText } = req.body;
  console.log("Req.Body", req.params);
  let author;
  let comment;
  let mainUser
  User.findById(req.session.currentUser._id)
    .then((result) => {
      console.log("User result:", result);
      author = result;
    })
    SurfSpot.findById(commentId)
    .then(() =>{
      return Comments.create({commentText,surfSpot:commentId})
     })
     .then((userObj) => {
      comment = userObj;
    })
    .then(()=>{

    SurfSpot.findById(commentId)
    .then(surfObj=>{
      console.log(surfObj)
      surfObj.comments.push(comment._id)
     SurfSpot.create(surfObj)
    })

    })

    // version 1 of pushing comment to surf spot
 /*    .then((commentCreated) => {
      const {_id} = commentCreated
      SurfSpot.findByIdAndUpdate(commentId, {$push:{comments:_id}} )
      console.log("Comment created", commentCreated )
    }) */

    // version 2 of pushing comment to surf spot
    
 /*    .then((newComment) => {
      res.redirect(`/surf-spot/profile/${newComment._id}`);
    }) */
 /*    .then((result) => {
      res.render("surf-spots/surf-spot-profile", {result})
    }) */
    .catch((error) => {
      console.log("Error when posting comment:", error);
      next(error);
    });
});

module.exports = router;
