import mongoose from "mongoose";

const { Schema, models } = mongoose;

const promptSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

const Prompt = models.Prompt || mongoose.model("Prompt", promptSchema);

export default Prompt;