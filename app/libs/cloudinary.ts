import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (base64: string) => {
  try {
    if (!base64) {
      throw new Error("Image data is missing");
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64, {
      folder: "feedback-user-photos", // Optional: specify a folder
    });

    // The URL of the uploaded image
    const imageUrl = uploadResponse.secure_url;

    return imageUrl;
  } catch (error) {
    console.log(error);
  }
};

export default uploadToCloudinary;
