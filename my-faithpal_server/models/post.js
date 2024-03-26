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
        type: Array,
        required: false,
    },
},
    { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", postSchema);
export default Post;