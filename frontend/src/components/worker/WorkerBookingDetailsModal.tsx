import React from 'react';
import {
  X, Calendar, Clock, User, Phone, Mail, MapPin, Star, Check, Ban, CheckCircle, Loader2, MessageCircle
} from 'lucide-react';

interface WorkerBookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  getUserInfo: (userDetails: Booking['userDetails'], booking: Booking) => any;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatDate: (date: string) => string;
  renderStars: (rating: number) => React.ReactNode;
  handleAcceptBooking: (bookingId: string) => void;
  handleRejectBooking: (bookingId: string) => void;
  actionLoading: string | null;
}

const WorkerBookingDetailsModal: React.FC<WorkerBookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  getUserInfo,
  getStatusColor,
  getStatusIcon,
  formatDate,
  renderStars,
  handleAcceptBooking,
  handleRejectBooking,
  actionLoading
}) => {
  if (!isOpen || !booking) return null;

  const userInfo = getUserInfo(booking.userDetails, booking);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img
                src={userInfo.profileImage}
                alt={userInfo.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{userInfo.name}</h3>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="text-sm text-gray-600">
                    <p>📞 {userInfo.phone}</p>
                    <p>✉️ {userInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Status */}
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-lg font-medium ${getStatusColor(booking.status)}`}
            >
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Customer Review */}
          {booking.review && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-blue-800">Customer Review</h4>
                {renderStars(booking.review.rating)}
              </div>
              <p className="text-blue-700 mb-2">{booking.review.comment}</p>
              {booking.review.createdAt && (
                <p className="text-xs text-blue-600">
                  Reviewed on {new Date(booking.review.createdAt).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          )}

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" /> Service Date
                </label>
                <p className="text-gray-800">{formatDate(booking.bookingDate)}</p>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 mr-2" /> Service Time
                </label>
                <p className="text-gray-800">{booking.bookingTime}</p>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 mr-2" /> Contact Person
                </label>
                <p className="text-gray-800">{booking.fullName}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 mr-2" /> Phone Number
                </label>
                <p className="text-gray-800">{booking.phoneNumber}</p>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 mr-2" /> Email Address
                </label>
                <p className="text-gray-800">{booking.emailAddress}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Payment Status
                </label>
                <div className="space-y-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.paymentStatus.charAt(0).toUpperCase() +
                      booking.paymentStatus.slice(1)}
                  </span>
                  <p className="text-xs text-gray-500">Method: {booking.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" /> Service Address
            </label>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
              {booking.serviceAddress}
            </p>
          </div>

          {/* Special Requirements */}
          {booking.specialRequirements && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Special Requirements
              </label>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                {booking.specialRequirements}
              </p>
            </div>
          )}

          {/* Service Details */}
          {(booking.serviceType || booking.estimatedPrice) && (
            <div className="bg-gray-50 rounded-lg p-3">
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
          )}

          {/* Meta Info */}
          <div className="text-xs text-gray-500 pt-4 border-t">
            <p>Booking ID: {booking._id}</p>
            <p>Customer ID: {booking.userId}</p>
            <p>Created: {new Date(booking.createdAt).toLocaleString('en-IN')}</p>
            {booking.updatedAt !== booking.createdAt && (
              <p>Last Updated: {new Date(booking.updatedAt).toLocaleString('en-IN')}</p>
            )}
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="px-6 pb-6">
          <div className="flex space-x-3">
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    handleAcceptBooking(booking._id);
                    onClose();
                  }}
                  disabled={actionLoading === booking._id}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading === booking._id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => {
                    handleRejectBooking(booking._id);
                    onClose();
                  }}
                  disabled={actionLoading === booking._id}
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </>
            )}
            
            {booking.status === 'accepted' && (
              <>
                <button className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Customer
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerBookingDetailsModal;