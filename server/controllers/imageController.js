import Image from "../models/imageModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../errors/customApiError.js";
import cloudinary from "cloudinary"
export const uploadImage = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      throw new ApiError(400, "Please upload the image");
    }

    const imagePath = image.path;

    const avatar = await uploadOnCloudinary(imagePath);

    if (!avatar) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    const uploadedImage = await Image.create({
      imageUrl: avatar.secure_url,
      publicId: avatar.public_id,
      user: req.user._id 
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

export const updateImage = async (req, res) => {
  try {
    const { id: imageId } = req.params;
    const newImage = req.file;

    const oldImage = await Image.findById(imageId);
    if (!oldImage) {
      throw new ApiError(404, "Image not found");
    }

    if (!newImage) {
      throw new ApiError(400, "Please upload an image");
    }

    const avatar = await uploadOnCloudinary(newImage.path);
    
    if (!avatar || !avatar.secure_url) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    if (oldImage.publicId) {
      await cloudinary.uploader.destroy(oldImage.publicId).catch((err) =>
        console.error("Failed to delete old image from Cloudinary:", err)
      );
    }

    const uploadedImage = await Image.findByIdAndUpdate(
      imageId,
     {
        imageUrl: avatar.secure_url,
        publicId: avatar.public_id,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: uploadedImage
    });

  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
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

export const getSingleImage = async (req ,res) => {
  try {
    const {id} = req.params

    const image = await Image.findById(id).populate(
      "imageUser",
      "username email"
    )
      res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
        if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}