import { TrendingUpTwoTone } from "@mui/icons-material";
import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
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