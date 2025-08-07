import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, X, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type{ RootState } from '../../store/store';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import toast from 'react-hot-toast';

export default function Booking({ isOpen, onClose, workerData }) {
const auth = useSelector((state: RootState) => state.auth);
const userId = auth?.uid;
  const workerId = workerData?.id
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    serviceAddress: '',
    specialRequirements: ''
  });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Format date to dd-mm-yyyy format for backend
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


const handleBooking = async () => {
  if (
    !selectedDate ||
    !selectedTime ||
    !formData.fullName ||
    !formData.phoneNumber ||
    !formData.emailAddress ||
    !formData.serviceAddress
  ) {
    toast.error('Please fill in all required fields');
    return;
  }

  setIsLoading(true);

  const bookingData = {
    userId,
    workerId,
    bookingDate: formatDateForBackend(selectedDate),
    bookingTime: selectedTime,
    fullName: formData.fullName,
    phoneNumber: formData.phoneNumber,
    emailAddress: formData.emailAddress,
    serviceAddress: formData.serviceAddress,
    specialRequirements: formData.specialRequirements || undefined,
    paymentMethod: 'offline',
  };

  try {
    const response = await axiosInstance.post(ApiRoutes.WORKER_BOOK.path, bookingData);

    if (response.status === 200 || response.status === 201) {
      toast.success('Booking request submitted successfully!');
      handleClose();
    } else {
      toast.error(response.data?.message || 'Failed to create booking. Please try again.');
    }
  } catch (error: any) {
    console.error('Booking error:', error);
    toast.error('Network error. Please check your connection and try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleClose = () => {

    setFormData({
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      serviceAddress: '',
      specialRequirements: ''
    });
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Book Service</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Professional Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <img 
                src={workerData?.image || "https://images.unsplash.com/photo-1494790108755-2616b612b077?w=60&h=60&fit=crop&crop=face"}
                alt={workerData?.name || "Professional"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-800">{workerData?.name || "Professional"}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {workerData?.category || "Service"}
                  </span>
                  <span>{workerData?.rate || "₹280/hr"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Calendar className="h-4 w-4 mr-2" />
              Select Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Clock className="h-4 w-4 mr-2" />
              Select Time *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    selectedTime === time
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Service Address *
            </label>
            <textarea
              name="serviceAddress"
              value={formData.serviceAddress}
              onChange={handleInputChange}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter complete address where service is required"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Special Requirements (Optional)
            </label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Any specific instructions..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6">
          <div className="flex space-x-3">
            <button
              onClick={handleBooking}
              disabled={isLoading || !selectedDate || !selectedTime || !formData.fullName || !formData.phoneNumber || !formData.emailAddress || !formData.serviceAddress}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
            <button 
              onClick={handleClose}
              className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            By booking, you agree to our Terms of Service. Payment after service completion.
          </p>
        </div>
      </div>
    </div>
  );
}