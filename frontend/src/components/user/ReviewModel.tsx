// src/components/user/ReviewModal.tsx
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';


interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  userId: string;
  getWorkerInfo: (workerDetails: Booking['workerDetails']) => any;
  renderStars: (rating: number, interactive?: boolean, onRatingChange?: (rating: number) => void) => React.ReactNode;
  onSuccess: () => void; // ✅ callback to refresh bookings in parent
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  userId,
  getWorkerInfo,
  renderStars,
  onSuccess
}) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prefill on booking change
  useEffect(() => {
    if (booking) {
      setReviewRating(booking.review ? booking.review.rating : 5);
      setReviewComment(booking.review ? booking.review.comment : '');
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const workerInfo = getWorkerInfo(booking.workerDetails);

  const handleSubmit = async () => {
  if (!reviewComment.trim()) {
    alert('Please enter your review comment.');
    return;
  }
  setSubmitting(true);

  try {
    const reviewData = {
      bookingId: booking._id,
      workerId: booking.workerId,
      rating: reviewRating,
      feedback: reviewComment.trim(),
      userId
    };

    const response = await axiosInstance.post(
      ApiRoutes.WRITE_REVIEW.path,
      reviewData // ✅ send the data
    );

    alert(booking.review ? 'Review updated successfully!' : 'Review submitted successfully!');
    onClose();
    onSuccess(); // refresh bookings in parent
  } catch (error) {
    console.error('Error submitting review:', error);
    alert('Error submitting review. Please try again.');
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {booking.review ? 'Edit Review' : 'Write Review'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Worker Info */}
          <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
            <img src={workerInfo.profileImage} alt={workerInfo.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 className="font-semibold text-gray-800">{workerInfo.name}</h3>
              <p className="text-sm text-gray-600">{workerInfo.skills}</p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate your experience (1–5 stars)
            </label>
            <div className="flex items-center space-x-2">
              {renderStars(reviewRating, true, setReviewRating)}
              <span className="ml-2 text-sm text-gray-600">
                ({reviewRating} star{reviewRating !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Write your review
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{reviewComment.length}/500 characters</p>
          </div>

          {/* Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Review Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Be honest and constructive</li>
                  <li>Focus on service quality</li>
                  <li>Avoid inappropriate language</li>
                  <li>Your review helps other users decide</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !reviewComment.trim()}
            className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...
              </>
            ) : booking.review ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
