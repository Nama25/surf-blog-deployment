const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userProfileSchema = new Schema(
  {
    username: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    profileImage: {
      type: String,
      // required: true,
    },
    surfLevel: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    typeOfSurfing: {
      type: [String],
      required: true,
      enum: ["Surfing", "Body Surfing", "Body Boarding"],
    },
    favoriteSpots: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const UserProfile = model("UserProfile", userProfileSchema);

module.exports = UserProfile;
