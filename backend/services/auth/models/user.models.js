import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firebaseId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    plan: {
      type: String,
      enum: ["free", "starter", "pro"],
      default: "free",
    },

    credits: {
      type: Number,
      default: 10,
      min: 0,
    },

    totalcredits: {
      type: Number,
      default: 10,
      min: 0,
    },

    isAdmin: { // ✅ Admin flag added
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;