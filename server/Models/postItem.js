import mongoose from "mongoose";

const imageMetaSchema = new mongoose.Schema(
  {
    filename: String,
    path: String,
    contentType: String,
    size: Number,
  },
  { _id: false }
);

const postItemSchema = new mongoose.Schema(
  {
    itemName: { type: String },
    category: { type: String },
    condition: { type: String },
    price: { type: String },
    description: { type: String },
    name: { type: String },
    city: { type: String },
    contactMethod: { type: String },
    contactInfo: { type: String },
    tags: { type: [String], default: [] },
    images: { type: [imageMetaSchema], default: [] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: false,
    },
  },
  { timestamps: true }
);

const postItemModel = mongoose.model("PostItem", postItemSchema);

export default postItemModel;
