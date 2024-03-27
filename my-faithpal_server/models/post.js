import mongoose from "mongoose";

const { Schema, models } = mongoose;

const postSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: false,
    },
    media: {
        type: String,
        required: false,
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
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
}, { timestamps: true });

const Post = models.Post || mongoose.model("Post", postSchema);
export default Post;
