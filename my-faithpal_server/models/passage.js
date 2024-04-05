import mongoose from "mongoose";

const { Schema, models } = mongoose;

const passageSchema = new Schema({
    key: {
        type: String,
    },
    props: {
        type: mongoose.Schema.Types.Mixed, // Store props as a single nested object
        required: true,
    },
    type: {
        type: String,
    },
    
    reference: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
},
    {timestamps: true}
);

passageSchema.index({ reference: 1, user: 1 }, { unique: true });

const Passage = models.Passage || mongoose.model('Passage', passageSchema);
export default Passage;