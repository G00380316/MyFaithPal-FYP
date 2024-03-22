import mongoose from "mongoose";

const { Schema, models } = mongoose;

const AImessagesSchema = new Schema({
    aichatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
        required: false,
    },
    prompt: {
        type: String,
        required: false,
    }
},
    { timestamps: true }
);

const AImessages = models.AImessages || mongoose.model("AImessages", AImessagesSchema);

export default AImessages;