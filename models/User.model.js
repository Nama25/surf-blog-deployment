const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    profileImage: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
    },
    surfLevel: {
      type: String,
      required: true,
      enum: [Beginner, Intermediate, Advanced],
    },
    typeOfSurfing: {
      type: String,
      required: true,
      enum: [Surfing, Body - Surfing, Body - Boarding],
    },
    favoriteSpots: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
