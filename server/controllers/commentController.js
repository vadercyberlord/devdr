import ApiError from "../errors/customApiError.js";
import Comment from "../models/commentModel.js";
import Image from "../models/imageModel.js";
import mongoose from "mongoose";
export const createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const {imageId} = req.params;
    const user = req.user;
    if(!comment){
        throw new ApiError(400,'Please provide the comment')
    }

    if (!imageId) {
      throw new ApiError(400, 'Image ID is required');
    }

    // Validate imageId format (MongoDB ObjectId is 24 hex characters)
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      throw new ApiError(400, 'Invalid image ID format');
    }

    const image = await Image.findById(imageId);
    
    if(!image){
        throw new ApiError(404,'Image does not exist')
    }

    const userComment = await Comment.create({
    user: user._id,
    username: user.username,
    image: imageId,   
    comment: comment.trim(),

    });
    res.status(201).json({
      success: true,
      message: "Comment created",
      data: userComment,
    });
  } catch (error) {
    // Handle custom errors
    if (error instanceof ApiError) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }

    // Handle other errors
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
