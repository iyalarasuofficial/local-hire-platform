import Rating from "../models/Rating.js";
import Worker from '../models/Worker.js';
import mongoose from 'mongoose';

// Helper to update worker's average rating and total ratings
const updateWorkerRatingStats = async (workerId) => {
  const stats = await Rating.aggregate([
    { $match: { workerId: new mongoose.Types.ObjectId(workerId) } },
    {
      $group: {
        _id: '$workerId',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Worker.findByIdAndUpdate(workerId, {
      averageRating: stats[0].averageRating,
      totalRatings: stats[0].totalRatings
    });
  } else {
    await Worker.findByIdAndUpdate(workerId, {
      averageRating: 0,
      totalRatings: 0
    });
  }
};

// Controller to add rating
export const addRating = async (req, res) => {
  try {
    const { bookingId, userId, workerId, rating, feedback } = req.body;
console.log("fasfasdf",feedback);
    const newRating = await Rating.create({
      bookingId,
      userId,
      workerId,
      rating,
      feedback
    });
    

    await updateWorkerRatingStats(workerId); // ⬅️ Important step

    res.status(201).json({ success: true, message: 'Rating submitted' });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ success: false, error: 'Failed to submit rating' });
  }
};
export const getUserReviews = async (req, res) => {
  try {
    console.log("backend get review received");
    const { workerId } = req.params;
    console.log("Worker ID:", workerId);

    const reviews = await Rating.find({ workerId })
      .populate({
        path: 'userId', // The field in Rating schema
        model: 'User', // The model to populate from
        localField: 'userId', // Rating.userId (String uid)
        foreignField: 'uid',  // User.uid (String)
        justOne: true,
        select: 'name profilePic'
      })
      .sort({ createdAt: -1 }); // Moved `.sort()` before `;`

    res.status(200).json(reviews);

  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};




