import User from "../models/User.js";
import Worker from "../models/Worker.js";

// 🔹 Get all workers
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.status(200).json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); 
    res.status(200).json(users);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Approve / Reject a worker manually (optional if automated)
export const updateWorkerApproval = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { isBlocked } = req.body;

    const updated = await Worker.findByIdAndUpdate(
      workerId,
      { isBlocked },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Worker not found" });

    res.status(200).json({ message: `Worker ${isBlocked ? 'blocked' : 'unblocked'}`, worker: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Suspend / Unsuspend a user
export const updateUserSuspension = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isSuspended } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { isSuspended },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: `User ${isSuspended ? 'suspended' : 'unsuspended'}`, user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
