const router = require("express").Router();
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware.js");
const User = require("../models/User.model");
const Comments = require("../models/Comments.model")









module.exports = router;