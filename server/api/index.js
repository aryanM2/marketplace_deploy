// api/index.js
import express from "express";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

import registerModel from "../Models/register.js";
import postItemModel from "../Models/postItem.js";

import dotenv from "dotenv";
dotenv.config(); // Load .env variables
const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join("/tmp", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return next();
  try {
    const payload = jwt.verify(
      parts[1],
      process.env.JWT_SECRET || "secret-123"
    );
    req.userId = payload._id;
    req.userEmail = payload.email;
  } catch (err) {
    console.warn("Invalid token:", err.message);
  }
  next();
}
app.use(authMiddleware);

let isConnected = false;
async function connectDB() {
  if (isConnected) return;

  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

  isConnected = true;
  console.log("✅ MongoDB connected");
}

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

//categary wise data sending to frontend
app.get("/api/filter/:type", async (req, res) => {
  const type = req.params.type;

  let filteredData = await postItemModel
    .find({ category: type })
    .sort({ createdAt: -1 });
  try {
    if (filteredData) {
      res.send({
        status: 1,
        message: "filtered data",
        filteredData,
      });
    } else if (filteredData.length == 0) {
      res.send({
        status: 1,
        message: "no data found",
      });
    }
  } catch (err) {
    res.send({
      status: 1,
      message: "something went wrong",
      err,
    });
  }
});

app.get("/api/view-item/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ status: 0, msg: "id required" });
    const viewData = await postItemModel
      .findById(id)
      .populate("owner", "name email");
    if (!viewData) return res.status(404).json({ status: 0, msg: "Not found" });
    return res.json({ status: 1, data: viewData });
  } catch (err) {
    console.error("view-item error", err);
    return res
      .status(500)
      .json({ status: 0, msg: "something wrong", error: err.message });
  }
});

// Delete a post (only owner can delete)
app.delete("/api/post-item/:id", async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ status: 0, msg: "Unauthorized" });
    const id = req.params.id;
    const post = await postItemModel.findById(id);
    if (!post)
      return res.status(404).json({ status: 0, msg: "Post not found" });
    if (!post.owner || post.owner.toString() !== req.userId)
      return res.status(403).json({ status: 0, msg: "Forbidden" });

    if (post.images && post.images.length) {
      for (const img of post.images) {
        try {
          const filePath = path.join(
            __dirname,
            img.path || "uploads/" + img.filename
          );
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("Failed to delete file", e.message);
        }
      }
    }

    await postItemModel.findByIdAndDelete(id);
    return res.json({ status: 1, msg: "Deleted" });
  } catch (err) {
    console.error("delete error", err);
    return res
      .status(500)
      .json({ status: 0, msg: "Server error", error: err.message });
  }
});

app.get("/api/my-posts", async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ status: 0, msg: "Unauthorized" });
    const posts = await postItemModel
      .find({ owner: req.userId })
      .sort({ createdAt: -1 });
    return res.json({ status: 1, data: posts });
  } catch (err) {
    console.error("my-posts error", err);
    return res
      .status(500)
      .json({ status: 0, msg: "Server error", error: err.message });
  }
});

app.get("/api/post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postItemModel
      .find({ _id: id })
      .populate("owner", "name email");
    if (!post)
      return res.status(404).json({ status: 0, msg: "Post not found" });
    const isOwner =
      req.userId && post.owner && post.owner._id.toString() === req.userId;
    return res.json({ status: 1, data: post, isOwner });
  } catch (err) {
    console.error("get post error", err);
    return res
      .status(500)
      .json({ status: 0, msg: "Server error", error: err.message });
  }
});

app.get("/api/random-view", async (req, res) => {
  try {
    let allItems = await postItemModel.find().sort({ createdAt: -1 }).limit(10);
    res.send({
      status: 1,
      message: "all items are fetched",
      allItems,
    });
  } catch (err) {
    status: 0, err;
  }
});

app.post("api/register", async (req, res) => {
  try {
    await connectDB();
    const { name, email, password } = req.body;
    const user = new registerModel({ name, email, password });
    await user.save();
    res.json({ status: 1, msg: "User registered" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: 0, msg: "Error registering", error: err.message });
  }
});

app.post("api/login", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await registerModel.findOne({ email });
    if (!user)
      return res.status(404).json({ status: 0, msg: "Email not found" });
    if (password !== user.password)
      return res.status(401).json({ status: 0, msg: "Invalid password" });

    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET || "secret-123",
      { expiresIn: "24h" }
    );
    res.json({
      status: 1,
      msg: "Login successful",
      jwtToken: token,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: 0, msg: "Login failed", error: err.message });
  }
});

app.post("api/post-item-data", upload.array("images", 10), async (req, res) => {
  try {
    await connectDB();
    if (!req.userId)
      return res.status(401).json({ status: 0, msg: "Unauthorized" });

    const {
      title,
      category,
      condition,
      price,
      description,
      name,
      city,
      contactMethod,
      contactInfo,
      tags,
    } = req.body;

    const files = (req.files || []).map((file) => ({
      filename: file.filename,
      path: file.path,
      contentType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    const newPost = new postItemModel({
      itemName: title,
      category,
      condition,
      price,
      description,
      name,
      city,
      contactMethod,
      contactInfo,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      images: files,
      owner: req.userId,
    });

    await newPost.save();
    res.json({ status: 1, msg: "Post saved" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: 0, msg: "Error saving post", error: err.message });
  }
});

app.listen("3000", () => {
  console.log(`🚀 Server running on port 3000`);
});
