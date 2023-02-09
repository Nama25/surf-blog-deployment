const SurfSpot = require("../models/SurfSpot.model");

const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

const canEdit = (req, res, next) => {
  SurfSpot.findOne(req.params._id)
    .then((model) => {
      const isOwner = model.user.toString() === req.session.currentUser._id;
      if (!isOwner) {
        return res.redirect("/");
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/surf-spot/all");
    });
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  canEdit,
};
