const router = require("express").Router();
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");
const User = require("../models/User.model");
const Comments = require("../models/Comments.model");
const SurfSpot = require("../models/SurfSpot.model.js");

router.post("/profile/comment/:commentId", (req, res, next) => {
  const { commentId } = req.params;
  const { user, commentText } = req.body;
  console.log("REq.Body", req.params);
  let author;

  User.findOne({ username: user })
    .then((result) => {
      console.log("User result:", result);
      author = result;
    })
    .then((newUser) => {
      SurfSpot.findById(commentId).then((dbSurfSpot) => {
        let newComment;
        if (newUser) {
          newComment = new Comments({ user: newUser._id, commentText });
        } else {
          newComment = new Comments({ user: author._id, commentText });
        }
        newComment.save().then((dbComment) => {
          dbSurfSpot.comments.push(dbComment._id);
          dbSurfSpot.save().then((updatedComment) => {
            console.log("updated comment:", updatedComment);
            res.redirect(`/surf-spot/profile/${updatedComment.id}`);
          });
        });
      });
    })
    .catch((error) => {
      console.log("Error when posting comment:", error);
      next(error);
    });
});

module.exports = router;
