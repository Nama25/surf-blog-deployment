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

// const canEdit = (req, res, next) => {
//   if (req.session.currentUser._id != user) {
//     return res.redirect("/");
//   }
//   next();
// };

module.exports = {
  isLoggedIn,
  isLoggedOut,
  // canEdit,
};
