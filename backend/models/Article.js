import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    category: String,
    tags: [String],
    content: String,
    images: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Article", articleSchema);
