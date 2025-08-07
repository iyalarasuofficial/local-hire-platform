import Complaint from "../models/Complaint.js";

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("workerId", "name skill");

    res.status(200).json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { actionTaken } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: "resolved", actionTaken },
      { new: true }
    );

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json({ message: "Complaint resolved", complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const raiseComplaint = async (req, res) => {
  try {
    const { uid, workerId, message } = req.body;

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const complaint = await Complaint.create({
      userId: user._id,
      workerId,
      message,
    });

    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};