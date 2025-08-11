import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, Star, Eye, X, MessageCircle, CheckCircle, AlertCircle, XCircle, Loader2, Edit3 } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import ReviewModal from '../user/ReviewModel';
import BookingDetailsModal from './BookingDetailsModal';

// Define types if using TypeScript
interface RootState {
  auth: {
    uid?: string;
  };
}

interface WorkerDetails {
  _id: string;
  uid: string;
  name: string;
  phone: string;
  skills: string[];
  profilePic?: string;
  rating?: number;
  charge?: string;
  email?: string;
}

interface Review {
  _id?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface Booking {
  _id: string;
  workerId: string; // Just the ID string
  workerDetails: WorkerDetails; // Populated worker information
  bookingDate: string;
  bookingTime: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  serviceAddress: string;
  specialRequirements?: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  review?: Review; // Add review field
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitingReview, setSubmitingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const auth = useSelector((state: RootState) => state.auth);
  const userId = auth?.uid;

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${ApiRoutes.USER_BOOKING.path}/${userId}`);
      const bookingsData = response.data || response;
      
      console.log('Fetched bookings:', bookingsData); // Debug log
      
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = (booking: Booking) => {
    setSelectedBooking(booking);
    // Pre-fill if review already exists
    if (booking.review) {
      setReviewRating(booking.review.rating);
      setReviewComment(booking.review.comment);
    } else {
      setReviewRating(5);
      setReviewComment('');
    }
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!selectedBooking || !reviewComment.trim()) {
      alert('Please write a comment for your review');
      return;
    }

    setSubmitingReview(true);
    try {
      const reviewData = {
        bookingId: selectedBooking._id,
        workerId: selectedBooking.workerId,
        rating: reviewRating,
        comment: reviewComment.trim(),
        userId: userId
      };

      // Adjust the API endpoint based on your backend
      const endpoint = selectedBooking.review 
        ? `${ApiRoutes.UPDATE_REVIEW?.path || '/api/reviews'}/${selectedBooking.review._id}`
        : `${ApiRoutes.CREATE_REVIEW?.path || '/api/reviews'}`;

      const method = selectedBooking.review ? 'patch' : 'post';
      
      await axiosInstance[method](endpoint, reviewData);
      
      alert(selectedBooking.review ? 'Review updated successfully!' : 'Review submitted successfully!');
      setIsReviewModalOpen(false);
      fetchBookings(); // Refresh bookings to show updated review
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const formatDate = (dateString: string) => {
    // Handle dd-mm-yyyy format from backend
    let date;
    if (dateString.includes('-') && dateString.split('-')[0].length === 2) {
      const [day, month, year] = dateString.split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      date = new Date(dateString);
    }
    
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWorkerInfo = (workerDetails: WorkerDetails) => {
    return {
      name: workerDetails.name || 'Professional',
      skills: workerDetails.skills && workerDetails.skills.length > 0 ? workerDetails.skills[0] : 'Service',
      profileImage: workerDetails.profilePic|| "https://images.unsplash.com/photo-1494790108755-2616b612b077?w=60&h=60&fit=crop&crop=face",
      rating: workerDetails.rating || null,
      charge: workerDetails.charge ? `₹${workerDetails.charge}/hr` : '₹280/hr',
      phone: workerDetails.phone,
      email: workerDetails.email
    };
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
   if (!confirm(`Are you sure you want to cancel this booking? (ID: ${bookingId})`)) return;
    
    try {
      await axiosInstance.patch(`${ApiRoutes.CANCEL_BOOKING.path}/${bookingId}`, {

      });
      
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-500 mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {[
                { key: 'all', label: 'All Bookings', count: bookings.length },
                { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: bookings.filter(b => b.status === 'approved').length },
                { key: 'in-progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in-progress').length },
                { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet. Start by finding a service professional!" 
                  : `No ${activeTab} bookings found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const workerInfo = getWorkerInfo(booking.workerDetails);
                return (
                  <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={workerInfo.profileImage}
                          alt={workerInfo.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{workerInfo.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {workerInfo.skills}
                            </span>
                            {workerInfo.rating && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                <span>{workerInfo.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(booking.bookingDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{booking.bookingTime}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">{booking.serviceAddress}</span>
                      </div>
                    </div>

                    {/* Show existing review */}
                    {booking.review && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-blue-800">Your Review</h4>
                          {renderStars(booking.review.rating)}
                        </div>
                        <p className="text-sm text-blue-700">{booking.review.comment}</p>
                        {booking.review.createdAt && (
                          <p className="text-xs text-blue-600 mt-2">
                            Reviewed on {new Date(booking.review.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                    )}

                    {booking.specialRequirements && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Special Requirements:</strong> {booking.specialRequirements}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleViewDetails(booking)}
                          className="flex items-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        {booking.status === 'pending' && (
                          <button 
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        )}
                        {(booking.status === 'approved' || booking.status === 'in-progress') && (
                          <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <button 
                            onClick={() => handleWriteReview(booking)}
                            className="flex items-center px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            {booking.review ? 'Edit Review' : 'Write Review'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
  isOpen={isDetailModalOpen}
  onClose={() => setIsDetailModalOpen(false)}
  booking={selectedBooking}
  getWorkerInfo={getWorkerInfo}
  getStatusColor={getStatusColor}
  getStatusIcon={getStatusIcon}
  formatDate={formatDate}
  renderStars={renderStars}
  handleCancelBooking={handleCancelBooking}
  handleWriteReview={handleWriteReview}
/>


      {/* Review Modal */}
<ReviewModal
  isOpen={isReviewModalOpen}
  onClose={() => setIsReviewModalOpen(false)}
  booking={selectedBooking}
  userId={userId || ''} // pass from redux
  onSuccess={fetchBookings} // refresh list after submit
  getWorkerInfo={getWorkerInfo}
  renderStars={renderStars}
/>


    </>
  );
}