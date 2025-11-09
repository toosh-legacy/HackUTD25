import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/api/happiness", (req, res) => {
  const filePath = path.join(process.cwd(), "happiness.json");

  if (!fs.existsSync(filePath)) {
    console.log("⚠️ happiness.json not found, returning null");
    return res.json({ happiness: null });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log("✅ Serving Reddit happiness:", data.happiness);
    res.json(data);
  } catch (error) {
    console.error("❌ Error reading happiness.json:", error);
    res.status(500).json({ happiness: null, error: error.message });
  }
});

app.get("/api/reddit-posts", (req, res) => {
  const filePath = path.join(process.cwd(), "reddit-posts.json");

  if (!fs.existsSync(filePath)) {
    console.log("⚠️ reddit-posts.json not found, returning empty array");
    return res.json({ posts: [], timestamp: null });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log("✅ Serving", data.posts?.length || 0, "Reddit posts");
    res.json(data);
  } catch (error) {
    console.error("❌ Error reading reddit-posts.json:", error);
    res.status(500).json({ posts: [], error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Reddit Happiness Backend running at http://localhost:${PORT}`);
});
