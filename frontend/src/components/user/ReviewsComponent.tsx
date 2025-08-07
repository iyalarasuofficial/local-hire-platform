import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  Star, 
  User, 
  Calendar,
  ThumbsUp,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import { useSearchParams } from 'react-router-dom';

interface Rating {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  workerId: string;
  rating: number;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsComponentProps {
  workerId: string;
  averageRating?: number;
  totalRatings?: number;
}

const ReviewsComponent: React.FC<ReviewsComponentProps> = ({ 
 
}) => {
     const { workerId } = useParams<{ workerId: string }>();
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchReviews();
    // console.log("Worker ID from URL:", workerId);
  }, [workerId]);

const fetchReviews = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await axiosInstance.get(`${ApiRoutes.GETALL_REVIEWS.path}/${workerId}`);
    setReviews(response.data.ratings || response.data || []);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    setError(err instanceof Error ? err.message : 'Failed to load reviews');
  } finally {
    setLoading(false);
  }
};

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      if (diffMonths === 1) return '1 month ago';
      if (diffMonths < 12) return `${diffMonths} months ago`;
      if (diffYears === 1) return '1 year ago';
      return `${diffYears} years ago`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  const formatJobDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting job date:', error);
      return 'Date not available';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
        <p className="text-gray-600">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} from verified customers
        </p>
      </motion.div>

      {/* Reviews List */}
      <motion.div variants={containerVariants} className="space-y-6">
        {displayedReviews.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500">Be the first to leave a review!</p>
          </motion.div>
        ) : (
          displayedReviews.map((review) => (
            <motion.div
              key={review._id}
              variants={itemVariants}
              className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-all duration-200"
            >
              {/* Review Header */}
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
                  {review.userId.profilePic ? (
                    <img
                      src={review.userId.profilePic}
                      alt={review.userId.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 ${review.userId.profilePic ? 'hidden' : ''}`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {review.userId.name || 'Anonymous User'}
                    </h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                      Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              {review.feedback && review.feedback.trim() && (
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {review.feedback}
                  </p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <motion.div variants={itemVariants} className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 border-2 border-green-500 text-green-500 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show All {reviews.length} Reviews <ChevronDown className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* {error && (
        <motion.div
          variants={itemVariants}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-blue-800 text-sm">
            <strong>Demo Mode:</strong> Currently showing sample reviews. Connect to your API endpoint to display real data.
            <br />
            <span className="text-blue-600">Error: {error}</span>
          </p>
        </motion.div>
      )} */}
    </motion.div>
  );
};

export default ReviewsComponent;