import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

export const uploadToCloudinary = (filePath, folder = "profile_images") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder, resource_type: "image",

       },
       (error, result) => { 
        fs.unlinkSync(filePath); // Delete the file after upload

        if(error) return reject(error);
        resolve(result);
      }
    );
  });
}