import Worker from "../models/Worker.js";
import Booking from "../models/Booking.js";
import Rating from "../models/Rating.js";
import admin from "../config/firebase.js";

export const registerWorker = async (req, res) => {
  try {
    const {
      uid,name,email,phone,skill,bio,experience,charge,coordinates,profilePic,maxDistance,
    } = req.body;

    const existing = await Worker.findOne({ uid });
    if (existing) return res.status(200).json(existing);

    const newWorker = await Worker.create({uid,name,email,phone,skill,bio,experience,charge,profilePic,maxDistance,
        location: {  type: "Point",  coordinates,},
    });

    res.status(201).json(newWorker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update availability (online/offline)
export const updateAvailability = async (req, res) => {
  try {
    const { uid } = req.params;
    const { isAvailable } = req.body;

    const updated = await Worker.findOneAndUpdate(
      { uid },
      { isAvailable },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// Get worker profile by UID
export const getWorkerProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log("inside the get worker procile controler")
    const worker = await Worker.findOne({ uid });
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    

    res.status(200).json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get average rating for the worker
export const getWorkerRating = async (req, res) => {
  try {
    const { uid } = req.params;
    const worker = await Worker.findOne({ uid });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const ratings = await Rating.find({ workerId: worker._id });

    if (ratings.length === 0) {
      return res.status(200).json({ average: 0, totalRatings: 0 });
    }

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = total / ratings.length;

    res.status(200).json({ average: average.toFixed(1), totalRatings: ratings.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update worker profile
export const updateWorkerProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const {
      name,
      email,
      phone,
      address,
      profilePic,
      skills,
      bio,
      experience,
      charge,
      isAvailable,
      maxDistance,
      location
    } = req.body;

    // Step 1: Update Firebase email (only if changed)
    if (email) {
      try {
        await admin.auth().updateUser(uid, { email });
      } catch (firebaseErr) {
        console.error("Firebase email update failed:", firebaseErr);
        return res.status(400).json({
          message: "Failed to update Firebase email",
          error: firebaseErr.message,
        });
      }
    }

    // Step 2: Prepare update object for MongoDB
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (address !== undefined) updateData.address = address;
    if (email !== undefined) updateData.email = email;
    if (skills !== undefined) updateData.skills = skills;
    if (bio !== undefined) updateData.bio = bio;
    if (experience !== undefined) updateData.experience = experience;
    if (charge !== undefined) updateData.charge = charge;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (maxDistance !== undefined) updateData.maxDistance = maxDistance;
    if (location !== undefined) updateData.location = location;

    // Step 3: Update MongoDB
    const worker = await Worker.findOneAndUpdate({ uid }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Step 4: Send updated profile
    return res.status(200).json({
      message: "Worker profile updated successfully",
      worker,
    });

  } catch (err) {
    console.error("Update worker profile error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

