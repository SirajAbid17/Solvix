import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dcpxgn271",
  api_key: process.env.CLOUDINARY_API_KEY || "241277581771863",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mM_u55honk21r3vnDK9fO3sqqVY",
});

export default cloudinary;