import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  skills: [{ 
    type: String,
    lowercase: true, // Automatically converts to lowercase
    trim: true // Removes whitespaceQ
  }],
  bio: { type: String },
  role: { type: String, enum: ["worker"], default: "worker"},
  experience: { type: Number },
  charge: { type: Number },
  isAvailable: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  maxDistance: { type: Number, default: 20 }, // in km
  profilePic: { type: String }, // 🔗 URL or path to image
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
 address: { 
  type: String, 
  lowercase: true,  // <- this will automatically convert to lowercase
  trim: true        // optional: removes extra spaces
},
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

workerSchema.index({ location: '2dsphere' });
workerSchema.index({ skills: 1 }); // Index for efficient skill-based queries
workerSchema.index({ uid: 1 });

export default mongoose.model("Worker", workerSchema);