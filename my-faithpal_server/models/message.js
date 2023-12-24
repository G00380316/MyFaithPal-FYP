import mongoose, { Types } from "mongoose";

const { Schema, models } = mongoose;

const messageSchema = new Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Chatroom",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    message: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

const Message = models.Message || mongoose.model("Message", messageSchema);
export default Message;