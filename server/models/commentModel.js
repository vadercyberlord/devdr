import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"        
    },
    username:{
        type: String,
        required: true
    },
    comment: {
        type: String,
    }
},{timestamps: true})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment