import mongoose from "mongoose";

const { Schema, models } = mongoose;

const AISKnowledgeSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true,
        ref:"Question",
    },
    answer: {
        type: String,
        required: true,
        unique: true,
        ref:"Answer"
    }
},
    { timestamps: true }
);

const AISKnowledge = models.AISKnowledge || mongoose.model("AISKnowledge", AISKnowledgeSchema);
export default AISKnowledge;