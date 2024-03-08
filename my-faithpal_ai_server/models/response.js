import mongoose from "mongoose";

const { Schema, models } = mongoose;

const responseSchema = new Schema({
    aichatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "AIChatroom",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    prompt: {
        type: String,
        required: false,
    }
},
    { timestamps: true }
);

const Response = models.Response || mongoose.model("Response", responseSchema);

export default Response;