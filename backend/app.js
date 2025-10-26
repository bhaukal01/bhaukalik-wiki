import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import imagekitRoutes from "./routes/imagekitRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/imagekit", imagekitRoutes);

app.get("/", (req, res) => res.send("Personal Wiki API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));