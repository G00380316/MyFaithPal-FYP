import mongoose from "mongoose";

const { Schema, models } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
        unique: false,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
},
    { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;