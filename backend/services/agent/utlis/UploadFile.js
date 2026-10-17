import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (buffer, folder = "ppt", fileName) => {
  try {
    const base64String = buffer.toString("base64");

    let mimeType =
      "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    let resourceType = "raw";
    let format = "pptx";

    if (folder === "pdf") {
      mimeType = "application/pdf";
      format = "pdf";
     
      resourceType = "image";
    } else if (folder === "images" || folder === "image") {
      mimeType = "image/png";
      resourceType = "image";
      format = "png";
    }

    const dataUri = `data:${mimeType};base64,${base64String}`;

  
    const cleanId = String(fileName || `${folder}_${Date.now()}`)
      .replace(/\.(pdf|pptx|png|jpg|jpeg)$/i, "")
      .replace(/[^a-z0-9_\-]/gi, "_");

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `solvix/${folder}`,
      resource_type: resourceType,
      public_id: cleanId,
      format: format,
      
      type: "upload",
      access_mode: "public",
    });

    console.log(` Uploaded ${folder} to Cloudinary:`, result.secure_url);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(` Cloudinary ${folder} upload failed:`, error);
    return {
      success: false,
      error: error.message,
    };
  }
};


export const uploadImageToCloudinary = async (buffer, fileName) => {
  try {
    const cloudinary = (await import("../config/cloudinary.js")).default;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `solvix/images`,
          resource_type: "image",
          public_id: fileName || `image_${Date.now()}`,
          format: "png",
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" },
            { width: 1024, height: 1024, crop: "limit" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error(" Image upload failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};