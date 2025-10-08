import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    imageUrl:{
        type: String,
    },
    imageUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Image = mongoose.model("Image", imageSchema)