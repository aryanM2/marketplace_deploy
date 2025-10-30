import mongoose from "mongoose";

const imageMetaSchema = new mongoose.Schema(
  {
    filename: String,
    path: String,
    contentType: String,
    size: Number,
    url: String,
  },
  { _id: false }
);

const postItemSchema = new mongoose.Schema(
  {
    itemName: String,
    category: String,
    condition: String,
    price: String,
    description: String,
    name: String,
    city: String,
    contactMethod: String,
    contactInfo: String,
    tags: { type: [String], default: [] },
    images: { type: [imageMetaSchema], default: [] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register", // ✅ matches model name
      required: false,
    },
  },
  { timestamps: true }
);

const postItemModel = mongoose.model("PostItem", postItemSchema);
export default postItemModel;
