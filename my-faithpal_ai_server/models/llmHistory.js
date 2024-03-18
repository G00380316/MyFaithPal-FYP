import mongoose from "mongoose";

const { Schema, models } = mongoose;

const ChatHistorySchema = new Schema({
    messages: {
        type: Array,
        required: true,
    },
    aichatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "AIChatroom",
    }
},
    { timestamps: true }
);

const ChatHistory = models.ChatHistory || mongoose.model("ChatHistory", ChatHistorySchema);
export default ChatHistory;