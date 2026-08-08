import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadPdf = (fileBuffer) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ai-portfolios",
        resource_type: "raw",
        format: "pdf",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};