import Rating from "../models/Rating.js";
import Worker from '../models/Worker.js';
import mongoose from 'mongoose';


const updateWorkerRatingStats = async (workerId) => {
  try {
    const stats = await Rating.aggregate([
      { $match: { workerId: workerId } }, // workerId is String, not ObjectId
      {
        $group: {
          _id: '$workerId',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {

      await Worker.findOneAndUpdate(
        { uid: workerId }, 
        {
          averageRating: Math.round(stats[0].averageRating * 100) / 100, // Round to 2 decimal places
          totalRatings: stats[0].totalRatings
        }
      );
    } else {
 
      await Worker.findOneAndUpdate(
        { uid: workerId },
        {
          averageRating: 0,
          totalRatings: 0
        }
      );
    }
  } catch (error) {
    console.error('Error updating worker rating stats:', error);
    throw error;
  }
};



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
        path: 'userId', 
        model: 'User', 
        localField: 'userId', 
        foreignField: 'uid',  
        justOne: true,
        select: 'name profilePic'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);

  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};




