import Article from "../models/Article.js";
import slugify from "slugify";

export const getArticles = async (req, res) => {
    try {
        const { search, category, tag } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (tag) filter.tags = { $in: [tag] };
        if (search)
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } }
            ];

        const articles = await Article.find(filter).sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ message: "Not found" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createArticle = async (req, res) => {
    try {
        const { title, category, tags, content, images } = req.body;
        const slug = slugify(title, { lower: true, strict: true });

        const newArticle = await Article.create({
            title,
            slug,
            category,
            tags,
            content,
            images
        });
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const updated = await Article.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: "Article deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
