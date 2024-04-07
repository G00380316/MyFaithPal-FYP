import mongoose from "mongoose";

const { Schema, models } = mongoose;

const AISKnowledgeSchema = new Schema({
    text: {
        type: String,
        required: true,
        unique: true,
        ref:"QA",
    },
},
    { timestamps: true }
);

const AISKnowledge = models.AISKnowledge || mongoose.model("AISKnowledge", AISKnowledgeSchema);
export default AISKnowledge;