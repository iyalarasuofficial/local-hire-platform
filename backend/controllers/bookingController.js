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



// 📌 Get bookings made by a user
export const getUserBookings = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookings = await Booking.find({ userId: user._id })
      .populate("workerId", "name skill charge")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get bookings assigned to a worker
export const getWorkerBookings = async (req, res) => {
  try {
    const { uid } = req.params;

    const worker = await Worker.findOne({ uid });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const bookings = await Booking.find({ workerId: worker._id })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

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
