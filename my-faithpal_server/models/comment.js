import mongoose from "mongoose";

const { Schema, models } = mongoose;

const commentSchema = new Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

const Comment = models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;