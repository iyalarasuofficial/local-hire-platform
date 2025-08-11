import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: String,  required: true },
  workerId : { type: String,  required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String },
}, { timestamps: true });

export default mongoose.model("Rating", ratingSchema);
