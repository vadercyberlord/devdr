import { Image } from "../models/imageModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../errors/customApiError.js";

export const uploadImage = async (req, res) => {
  try {
    const image = req.file;

    // console.log("File info:", image);
    if (!image) {
      throw new ApiError(400, "Please upload the image");
    }

    // Access the path property from the file object
    const imagePath = image.path;
    // console.log("Image path:", imagePath);

    const avatar = await uploadOnCloudinary(imagePath);

    if (!avatar) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    const uploadedImage = await Image.create({
      imageUrl: avatar.secure_url,
    });

    res.status(201).json({
      success: true,
      data: uploadedImage,
      user: req.user,
      message: "Image uploded successfully",
    });
  } catch (error) {
    // Handle custom errors
    if (error instanceof ApiError) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

