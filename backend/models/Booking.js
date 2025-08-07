import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String,  required: true },
  workerId: { type:String,  required: true },

  bookingDate: { type: String, required: true }, // store as string: "dd-mm-yyyy"
  bookingTime: { type: String, required: true }, // store as string: "09:00 AM"

  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  serviceAddress: { type: String, required: true },
  specialRequirements: { type: String }, // optional

  status: { 
    type: String, 
    enum: ['pending', 'approved', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentMethod: { type: String, enum: ['online', 'offline'], default: 'offline' },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
