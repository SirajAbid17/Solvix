import cloudinary from "../config/cloudinary.js";

export const uploadPDFToCloudinary = (
  buffer,
  originalName
) => {
  return new Promise((resolve, reject) => {
    const safeName = originalName
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mock-interviews",
        resource_type: "raw",
        public_id: `${Date.now()}-${safeName}`,
        format: "pdf",
      },

      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};