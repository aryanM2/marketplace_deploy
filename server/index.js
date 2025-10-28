let express = require("express");
let app = express();
let cors = require("cors");
app.use(express.json());
const multer = require("multer");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
app.use(cors());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const suffix = Date.now();
    cb(null, suffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

let mongoose = require("mongoose");
const registerModel = require("./Models/register");
const postItemModel = require("./Models/postItem");

// simple auth middleware to extract user from Authorization
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return next();
  const token = parts[1];
  try {
    const payload = jwt.verify(token, "secret-123");
    req.userId = payload._id;
    req.userEmail = payload.email;
  } catch (err) {
    console.warn("Invalid token", err.message);
  }
  return next();
}

app.use(authMiddleware);

app.use("/uploads", express.static(uploadsDir));
app.post("/post-item-data", upload.array("images", 10), async (req, res) => {
  try {
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
    const files = req.files || [];
    // console.log("req.body:", req.body);
    // console.log("req.files:", files.length);`

    const images = files.map((file) => ({
      filename: file.filename,
      path: path.join("uploads", file.filename).replace(/\\/g, "/"),
      contentType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    let postingItem = new postItemModel({
      itemName: title,
      category: category,
      condition: condition,
      price: price,
      description: description,
      name: name,
      city: city,
      contactMethod: contactMethod,
      contactInfo: contactInfo,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      images,
      owner: req.userId || undefined,
    });
    await postingItem.save();
    res.send({
      status: 1,
      msg: "data saved",
    });
  } catch (err) {
    res.send({
      status: 0,
      mesg: "something went wrong",
      error: err,
    });
  }
});

//categary wise data sending to frontend
app.get("/filter/:type", async (req, res) => {
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

//random item view

app.get("/random-view", async (req, res) => {
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

// viewing user items api

app.get("/view-item/:id", async (req, res) => {
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
app.delete("/post-item/:id", async (req, res) => {
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

// post of the singned user
app.get("/my-posts", async (req, res) => {
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

app.get("/post/:id", async (req, res) => {
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

// Edit a post: only owner can update. Supports adding images (multipart) and updating text fields.
app.put("/post-item/:id", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ status: 0, msg: "Unauthorized" });
    const id = req.params.id;
    const post = await postItemModel.findById(id);
    if (!post)
      return res.status(404).json({ status: 0, msg: "Post not found" });
    if (!post.owner || post.owner.toString() !== req.userId)
      return res.status(403).json({ status: 0, msg: "Forbidden" });

    // update fields from body
    const updatable = [
      "itemName",
      "category",
      "condition",
      "price",
      "description",
      "college",
      "city",
      "contactMethod",
      "contactInfo",
      "tags",
    ];
    updatable.forEach((key) => {
      if (req.body[key] !== undefined) {
        post[key] =
          Array.isArray(post[key]) &&
          typeof req.body[key] === "string" &&
          req.body[key].includes(",")
            ? req.body[key].split(",").map((t) => t.trim())
            : req.body[key];
      }
    });

    // handle uploaded files to append
    const files = req.files || [];
    if (files.length) {
      const newImages = files.map((f) => ({
        filename: f.filename,
        path: path.join("uploads", f.filename).replace(/\\/g, "/"),
        contentType: f.mimetype,
        size: f.size,
        url: `/uploads/${f.filename}`,
      }));
      post.images = post.images.concat(newImages);
    }

    await post.save();
    return res.json({ status: 1, data: post });
  } catch (err) {
    console.error("edit post error", err);
    return res
      .status(500)
      .json({ status: 0, msg: "Server error", error: err.message });
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 0, msg: "email and password are required" });
    }

    const user = await registerModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ status: 0, msg: "Email not found" });
    }

    //password is in plaintext
    if (password !== user.password) {
      return res.status(401).json({ status: 0, msg: "Password is incorrect" });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      "secret-123",
      { expiresIn: "24h" }
    );

    return res.json({
      status: 1,
      message: "login successful",
      jwtToken,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ status: 0, msg: "something went wrong", error: err.message });
  }
});

//register user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let registerData = new registerModel({
      name,
      email,
      password,
    });
    await registerData.save();
    res.send({
      status: 1,
      msg: "data is stored",
    });
  } catch (err) {
    console.error(err);
    res.send({
      status: 0,
      msg: "An error occurred during registration.",
      error: err.message,
    });
  }
});

mongoose.connect("mongodb://127.0.0.1:27017/StudentMarketPlace").then(() => {
  console.log("db is connected...");
  app.listen("8002", () => {
    console.log("server is running on port 8002");
  });
});
