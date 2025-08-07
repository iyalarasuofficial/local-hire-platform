import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  name: { type: String},
  email: { type: String, required: true },
  phone: { type: String},
  role: { type: String, enum: ["user"], default: "user" },
  profilePic: { type: String }, // 🖼️ URL or file path to profile image
  isSuspended: { type: Boolean, default: false },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  address: { type: String }
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
