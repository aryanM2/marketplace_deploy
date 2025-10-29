import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // password may be absent for OAuth/Gmail sign-ins
    required: false,
  },
  googleId: { type: String },
});
const registerModel = mongoose.model("Register", registerSchema);
export default registerModel;
