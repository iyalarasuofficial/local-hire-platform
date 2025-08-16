import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";

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
    const { cancelReason } = req.body; 

    console.log("Cancel request received");
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        status: "cancelled",
        cancelReason: cancelReason || null 
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
    const { uid } = req.params; 

    const bookings = await Booking.find({ userId: uid })
      .populate("workerDetails", "name skills phone charge profilePic")
      .sort({ createdAt: -1 }); 

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const acceptedWork = async (req, res) => {
  try {
    const { bookingId } = req.params;


    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "accepted" },
      { new: true } 
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


    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    if (booking.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: `Cannot complete booking with status: ${booking.status}. Booking must be 'accepted' first.`,
      });
    }
    booking.status = "completed";
    booking.paymentStatus = "paid";
    await booking.save();
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


export const getWorkerBookings = async (req, res) => {
  try {
    const { uid } = req.params; 

    const bookings = await Booking.find({ workerId: uid })
      .populate("userDetails", "profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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







