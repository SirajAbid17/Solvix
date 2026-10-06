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
      enum: ["free", "starter", "pro", "enterprise"],
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;