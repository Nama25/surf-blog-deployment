const { Schema, model, default: mongoose } = require("mongoose");

const commentsSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: true,
  },
  //   double check how to post date
  // createdAt / timestamp: true?
  created: {
    type: Date,
    default: Date.now,
  },
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  surfSpot: [
    {
      type: Schema.Types.ObjectId,
      ref: "SurfSpot",
    },
  ],
});

const Comments = model("Comments", commentsSchema);
module.exports = Comments;
