import mongoose from "mongoose";

const { Schema, models } = mongoose;

const chatroomSchema = new Schema({
    participants: {
        type: Array,
        required: true,
    },
},
    { timestamps: true }
);

const Chatroom = models.Chatroom || mongoose.model("Chatroom", chatroomSchema);
export default Chatroom;