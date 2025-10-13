import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
    publicId: {
      type: String,
      required: true,
    },
    imageUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
export default Image;
