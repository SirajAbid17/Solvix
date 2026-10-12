import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadPDFToCloudinary = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "resume-analyzer",
        resource_type: "raw",
        public_id: `${Date.now()}-${fileName}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


export const uploadProfileImage = (buffer, fileName, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `cv-profiles/${userId}`,
        resource_type: "image",
        public_id: `${Date.now()}-${fileName}`,
        transformation: [
          { width: 400, height: 400, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
        
        placeholder: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


export const deleteImage = (publicId) => {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      return resolve({ result: "No public ID provided" });
    }
    
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary delete error:", error);
        return reject(error);
      }
      resolve(result);
    });
  });
};


export const uploadImage = (buffer, fileName, folder = "images") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        public_id: `${Date.now()}-${fileName}`,
        transformation: [
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


export const deleteMultipleImages = (publicIds) => {
  return new Promise((resolve, reject) => {
    if (!publicIds || publicIds.length === 0) {
      return resolve({ result: "No public IDs provided" });
    }
    
    cloudinary.api.delete_resources(publicIds, (error, result) => {
      if (error) {
        console.error("Cloudinary delete multiple error:", error);
        return reject(error);
      }
      resolve(result);
    });
  });
};


export const getOptimizedImageUrl = (publicId, options = {}) => {
  const { width, height, crop = "limit", quality = "auto" } = options;
  
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop },
      { quality },
      { fetch_format: "auto" },
    ],
  });
};