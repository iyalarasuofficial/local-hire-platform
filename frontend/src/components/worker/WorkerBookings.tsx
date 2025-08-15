import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Phone, Star, Eye, MessageCircle,
  CheckCircle, AlertCircle, XCircle, Loader2, Check, Ban
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import WorkerBookingDetailsModal from './WorkerBookingDetailsModal';
import Loader from '../common/Loader';
import WorkerApiRoutes from '../../api/workerApiRoutes';
import toast from 'react-hot-toast';

interface RootState {
  auth: {
    uid?: string;
  };
}

interface UserDetails {
  _id: string;
  uid: string;
  name: string;
  phone: string;
  email?: string;
  profilePic?: string;
}

interface Review {
  _id?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface Booking {
  _id: string;
  userId: string;
  userDetails: UserDetails;
  bookingDate: string;
  bookingTime: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  serviceAddress: string;
  specialRequirements?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'rejected';
  paymentStatus: 'pending' | 'paid';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  workerId: string;
  review?: Review;
  serviceType?: string;
  estimatedPrice?: number;
  cancelReason?: 'worker_rejected' | 'user_cancelled' | 'other';
}

export default function WorkerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const auth = useSelector((state: RootState) => state.auth);
  const workerId = auth?.uid;

  useEffect(() => {
    fetchBookings();
  }, [workerId]);

  const fetchBookings = async () => {
    if (!workerId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${WorkerApiRoutes.WORKER_BOOKINGS.path}/${workerId}`);
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Failed to load your bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to accept this booking?')) return;
    setActionLoading(bookingId);
    const toastId = toast.loading('Accepting booking...');
    try {
      await axiosInstance.patch(`${WorkerApiRoutes.ACCEPT_BOOKING.path}/${bookingId}`);
      toast.success('Booking accepted successfully', { id: toastId });
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error accepting booking', { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to reject this booking?')) return;
    setActionLoading(bookingId);
    const toastId = toast.loading('Rejecting booking...');
    try {
      await axiosInstance.patch(`${WorkerApiRoutes.CANCEL_BOOKING.path}/${bookingId}`, {
        status: 'rejected',
        cancelReason: 'worker_rejected'
      });
      toast.success('Booking rejected successfully', { id: toastId });
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error rejecting booking', { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'accepted':
        return <Check className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new-requests') return booking.status === 'pending';
    if (activeTab === 'accepted') return booking.status === 'accepted';
    return booking.status === activeTab;
  });

  const formatDate = (dateString: string) => {
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

  const getUserInfo = (userDetails: UserDetails, booking: Booking) => ({
    name: userDetails?.name || booking.fullName || 'Customer',
    profileImage: userDetails?.profilePic || "https://images.unsplash.com/photo-1494790108755-2616b612b077?w=60&h=60&fit=crop&crop=face",
    phone: userDetails?.phone || booking.phoneNumber,
    email: userDetails?.email || booking.emailAddress
  });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const renderStars = (rating: number) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your service requests and bookings</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {[
                { key: 'all', label: 'All Orders', count: bookings.length },
                { key: 'new-requests', label: 'New Requests', count: bookings.filter(b => b.status === 'pending').length },
                { key: 'accepted', label: 'Accepted', count: bookings.filter(b => b.status === 'accepted').length },
                { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
              ].map(tab => (
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
                  ? "You don't have any bookings yet. Keep your profile updated to receive more requests!"
                  : `No ${activeTab.replace('-', ' ')} bookings found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const userInfo = getUserInfo(booking.userDetails, booking);
                return (
                  <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {/* Top Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img src={userInfo.profileImage} alt={userInfo.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h3 className="font-semibold text-gray-800">{userInfo.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{userInfo.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status.replace('-', ' ')}</span>
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600"><Calendar className="h-4 w-4 mr-2" />{formatDate(booking.bookingDate)}</div>
                      <div className="flex items-center text-sm text-gray-600"><Clock className="h-4 w-4 mr-2" />{booking.bookingTime}</div>
                      <div className="flex items-center text-sm text-gray-600"><MapPin className="h-4 w-4 mr-2" />{booking.serviceAddress}</div>
                    </div>

                    {/* Cancel / Reject Reason */}
                    {(booking.status === 'cancelled' || booking.status === 'rejected') && booking.cancelReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-2">
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                          <h4 className="text-sm font-medium text-red-800">
                            {booking.cancelReason === 'worker_rejected' ? 'Rejected by You' :
                             booking.cancelReason === 'user_cancelled' ? 'Cancelled by Customer' : 'Booking Cancelled'}
                          </h4>
                        </div>
                      </div>
                    )}

                    {/* Service Details */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      {booking.serviceType && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Service Type:</span>
                          <span className="text-sm text-gray-600">{booking.serviceType}</span>
                        </div>
                      )}
                      {booking.estimatedPrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Estimated Price:</span>
                          <span className="text-sm text-green-600 font-semibold">₹{booking.estimatedPrice}</span>
                        </div>
                      )}
                    </div>

                    {/* Customer Review */}
                    {booking.review && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-blue-800">Customer Review</h4>
                          {renderStars(booking.review.rating)}
                        </div>
                        <p className="text-sm text-blue-700">{booking.review.comment}</p>
                      </div>
                    )}

                    {booking.specialRequirements && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-amber-800"><strong>Special Requirements:</strong> {booking.specialRequirements}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">Requested on {new Date(booking.createdAt).toLocaleDateString('en-IN')}</div>
                      <div className="flex space-x-3">
                        <button onClick={() => handleViewDetails(booking)} className="flex items-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg">
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </button>

                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptBooking(booking._id)}
                              disabled={actionLoading === booking._id}
                              className="flex items-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                            >
                              {actionLoading === booking._id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking._id)}
                              disabled={actionLoading === booking._id}
                              className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              <Ban className="h-4 w-4 mr-1" /> Reject
                            </button>
                          </>
                        )}

                        {booking.status === 'accepted' && (
                          <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                            <MessageCircle className="h-4 w-4 mr-1" /> Contact Customer
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

      {/* Details Modal */}
      {selectedBooking && (
        <WorkerBookingDetailsModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          booking={selectedBooking}
          getUserInfo={getUserInfo}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          formatDate={formatDate}
          renderStars={renderStars}
          handleAcceptBooking={handleAcceptBooking}
          handleRejectBooking={handleRejectBooking}
          actionLoading={actionLoading}
        />
      )}
    </>
  );
}
