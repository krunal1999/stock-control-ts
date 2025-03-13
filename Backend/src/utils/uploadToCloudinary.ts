import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  mimetype: string
) => {
  return new Promise((resolve, reject) => {
    const base64File = `data:${mimetype};base64,${fileBuffer.toString(
      "base64"
    )}`;

    cloudinary.uploader.upload(
      base64File,
      { folder: "inventory" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};
