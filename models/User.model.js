const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      // required: [true, "Username is required"],
      unique: [true, "already user-profile created"],
    },
    email: {
      type: String,
      // required: [true, " is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      // required: [true, "Password is required"],
    },
    // profileImage: {
    // type: String,
    // imageUrl: String,
    // required: true,
    // },
    surfLevel: {
      type: [String],
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    typeOfSurfing: {
      type: [String],
      required: true,
      enum: ["Surfing", "Body Surfing", "Body Boarding"],
    },
    surfSpot: [{ type: Schema.Types.ObjectId, ref: "SurfSpot"}],

    
    favoriteSpots: String,
    imageUrl: String,
    // userProfile: {
    //   type: Schema.Types.ObjectId,
    //   ref: "UserProfile",
    //   unique: true,
    // },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
