import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";

// 📌 Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      workerId,
      bookingDate,
      bookingTime,
      fullName,
      phoneNumber,
      emailAddress,
      serviceAddress,
      specialRequirements,
      paymentMethod
    } = req.body;

    if (!userId || !workerId || !bookingDate || !bookingTime || !fullName || !phoneNumber || !emailAddress || !serviceAddress) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

   const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const worker = await Worker.findOne({ uid: workerId });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const newBooking = await Booking.create({
      userId,
      workerId,
      bookingDate,
      bookingTime,
      fullName,
      phoneNumber,
      emailAddress,
      serviceAddress,
      specialRequirements,
      paymentMethod,
      status: "pending"
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });
  } catch (err) {
    console.error("Booking creation failed:", err);
    res.status(500).json({ error: err.message });
  }
};
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancelReason } = req.body; // e.g. "worker_rejected" or "user_cancelled"

    console.log("Cancel request received");

    // Update booking with both status and cancel reason
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: "cancelled",
        cancelReason: cancelReason || null // store null if no reason provided
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ 
      message: "Booking cancelled successfully", 
      booking 
    });
    
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { uid } = req.params; // Firebase UID of the user

    const bookings = await Booking.find({ userId: uid })
      .populate("workerDetails", "name skills phone charge profilePic")
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const acceptedWork = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ID and update the status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "accepted" },
      { new: true } // return updated document
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking marked as accepted successfully",
      booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completedWork = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only allow completion if accepted (can add 'in-progress' if needed)
    if (booking.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: `Cannot complete booking with status: ${booking.status}. Booking must be 'accepted' first.`,
      });
    }

    // Update in one go
    booking.status = "completed";
    booking.paymentStatus = "paid";

   
    // if (req.body.paymentMethod) {
    //   booking.paymentMethod = req.body.paymentMethod;
    // }

    await booking.save();

    // Populate worker details before sending response
    await booking.populate("workerDetails");

    res.status(200).json({
      success: true,
      message: "Booking marked as completed and payment recorded as paid.",
      data: booking,
    });
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// 📌 Get bookings assigned to a worker
export const getWorkerBookings = async (req, res) => {
  try {
    const { uid } = req.params; // Firebase UID of the worker

    const bookings = await Booking.find({ workerId: uid })
      .populate("userDetails", "profilePic")
      .sort({ createdAt: -1 });
       // only profilePic from user

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// 📌 Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("userId", "name")
      .populate("workerId", "name skill");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "paid", paymentMethod },
      { new: true }
    );

    res.status(200).json({ message: "Payment marked as done", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get all bookings (for Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name")
      .populate("workerId", "name skill")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const deleted = await Booking.findByIdAndDelete(bookingId);
    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
