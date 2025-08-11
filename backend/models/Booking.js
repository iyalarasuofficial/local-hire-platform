import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },   // Firebase UID of the user
    workerId: { type: String, required: true }, // Firebase UID of the worker

    bookingDate: { type: String, required: true }, // format: "dd-mm-yyyy"
    bookingTime: { type: String, required: true }, // format: "09:00 AM"

    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    serviceAddress: { type: String, required: true },
    specialRequirements: { type: String }, // optional

    status: {
      type: String,
      enum: ["pending", "approved", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for worker details
bookingSchema.virtual("workerDetails", {
  ref: "Worker",
  localField: "workerId", // field in Booking
  foreignField: "uid",    // field in User
  justOne: true,
});

// Virtual populate for user details
bookingSchema.virtual("userDetails", {
  ref: "User",
  localField: "userId", // field in Booking
  foreignField: "uid",  // field in User
  justOne: true,
});

export default mongoose.model("Booking", bookingSchema);
