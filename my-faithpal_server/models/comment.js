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
    sendername: {
        type: String,
        required: true,
    },
    senderimage: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User",
        }],
        validate: {
            validator: function (likes) {
                // Convert the likes array to a Set to remove duplicates
                const uniqueLikes = new Set(likes);

                return uniqueLikes.size === likes.length;
            },
            message: props => `Duplicate ObjectId found in 'likes' array.`,
        },
    },
},
    { timestamps: true }
);

const Comment = models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;