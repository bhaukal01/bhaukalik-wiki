import imagekit from "../config/imagekit.js";

export const uploadImage = async (req, res) => {
    try {
        const { file, fileName } = req.body;
        const result = await imagekit.upload({
            file, // base64 string
            fileName
        });
        res.json({ url: result.url });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
