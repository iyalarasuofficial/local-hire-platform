import Worker from "../models/Worker.js";
import Booking from "../models/Booking.js";
import Rating from "../models/Rating.js";

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
      phone,
      email,
      bio,
      charge,
      skill,
      experience,
      coordinates,
      profilePic,
      maxDistance,
    } = req.body;

    const worker = await Worker.findOneAndUpdate(
      { uid },
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(bio && { bio }),
        ...(charge && { charge }),
        ...(skill && { skill }),
        ...(experience && { experience }),
        ...(maxDistance && { maxDistance }),
        ...(coordinates && {
          location: {
            type: "Point",
            coordinates,
          },
        }),
        ...(profilePic && { profilePic }),
      },
      { new: true }
    );

    if (!worker) return res.status(404).json({ message: "Worker not found" });

    res.status(200).json({ message: "Worker profile updated", worker });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
