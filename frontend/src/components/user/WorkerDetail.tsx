import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle,
  User,
  Briefcase,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Booking from './Booking';

interface Worker {
  _id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  bio: string;
  role: string;
  experience: number;
  charge: number;
  isAvailable: boolean;
  isBlocked: boolean;
  maxDistance: number;
  profilePic: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkerData {
  id: string;
  name: string;
  image: string;
  category: string;
  rate: string;
  phone: string;
  email: string;
}

const WorkerDetail: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null);

  const { workerId } = useParams<{ workerId: string }>();

  useEffect(() => {
    if (workerId) {
      fetchWorkerProfile();
    } else {
      setError('Worker ID is required');
      setLoading(false);
    }
  }, [workerId]);

  const fetchWorkerProfile = async () => {
    if (!workerId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/workers/${workerId}`);
      
      if (!response.data) {
        throw new Error('Worker not found');
      }
      
      setWorker(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading the worker profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!worker) return;
    
    const workerData: WorkerData = {
      id: worker.uid,
      name: worker.name,
      image: worker.profilePic || '',
      category: worker.role,
      rate: `₹${worker.charge}/hr`,
      phone: worker.phone,
      email: worker.email
    };
    
    setSelectedWorker(workerData);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedWorker(null);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  // Utility functions
  const formatExperience = (years: number): string => {
    if (years === 0) return 'Less than 1 year';
    return years === 1 ? '1 year' : `${years} years`;
  };

  const formatJoinDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return 'N/A';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current opacity-50"
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-gray-300"
          />
        );
      }
    }
    
    return stars;
  };

  const isWorkerAvailable = worker && worker.isAvailable && !worker.isBlocked;
  const getAvailabilityStatus = () => {
    if (!worker) return { text: 'Unknown', color: 'gray' };
    if (worker.isBlocked) return { text: 'Blocked', color: 'red' };
    if (!worker.isAvailable) return { text: 'Unavailable', color: 'red' };
    return { text: 'Available', color: 'green' };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && !worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWorkerProfile}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Worker not found</p>
      </div>
    );
  }

  const availabilityStatus = getAvailabilityStatus();

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-gray-50"
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="px-8 py-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Picture */}
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                  className="flex-shrink-0"
                >
                  <div className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg overflow-hidden bg-gray-100">
                    {worker.profilePic && !imageError ? (
                      <img
                        src={worker.profilePic}
                        alt={`${worker.name}'s profile`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Worker Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="min-w-0">
                      <motion.h1
                        variants={itemVariants}
                        className="text-3xl font-bold text-gray-800 mb-2 truncate"
                      >
                        {worker.name}
                      </motion.h1>
                      
                      <motion.p
                        variants={itemVariants}
                        className="text-lg text-blue-600 font-medium mb-3 capitalize"
                      >
                        {worker.role}
                      </motion.p>
                      
                      {/* Rating */}
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center mb-3 flex-wrap"
                      >
                        <div className="flex items-center mr-4">
                          {renderStars(worker.averageRating)}
                          <span className="ml-2 text-gray-600 whitespace-nowrap">
                            {worker.averageRating.toFixed(1)} ({worker.totalRatings} {worker.totalRatings === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                      </motion.div>

                      {/* Address */}
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center text-gray-600 mb-2"
                      >
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate" title={worker.address}>{worker.address}</span>
                      </motion.div>

                      {/* Availability Status */}
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center"
                      >
                        {availabilityStatus.color === 'green' ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        <span className={`font-medium ${
                          availabilityStatus.color === 'green' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {availabilityStatus.text}
                        </span>
                      </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col sm:flex-row gap-3 flex-shrink-0"
                    >
                      <motion.button
                        whileHover={isWorkerAvailable ? { scale: 1.05 } : {}}
                        whileTap={isWorkerAvailable ? { scale: 0.95 } : {}}
                        onClick={handleBookNow}
                        disabled={!isWorkerAvailable}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isWorkerAvailable
                            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer focus:ring-green-500'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {isWorkerAvailable ? 'Book Now' : 'Unavailable'}
                      </motion.button>
                      
                      {worker.phone && (
                        <a
                          href={`https://wa.me/91${worker.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(worker.name)},%20I%20found%20you%20on%20Local%20Hiring%20Platform.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-6 py-3 border-2 border-green-500 text-green-500 rounded-xl font-semibold hover:bg-green-50 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Message
                          </motion.button>
                        </a>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About Section */}
              {worker.bio && worker.bio.trim() && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">About</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {worker.bio}
                  </p>
                </motion.div>
              )}

              {/* Skills Section */}
              {worker.skills && worker.skills.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {worker.skills.map((skill, index) => (
                      <motion.span
                        key={`${skill}-${index}`}
                        variants={skillVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: index * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium capitalize shadow-md"
                      >
                        {skill.trim()}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              {(worker.phone || worker.email) && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    {worker.phone && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{worker.phone}</span>
                      </div>
                    )}
                    {worker.email && (
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 break-all">{worker.email}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Professional Info */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Professional Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-600">Hourly Rate</span>
                    </div>
                    <span className="font-semibold text-green-600">₹{worker.charge}/hr</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-gray-600">Experience</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatExperience(worker.experience)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-purple-500 mr-3" />
                      <span className="text-gray-600">Service Range</span>
                    </div>
                    <span className="font-semibold text-gray-800">{worker.maxDistance} km</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-indigo-500 mr-3" />
                      <span className="text-gray-600">Member Since</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatJoinDate(worker.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      {selectedWorker && (
        <Booking 
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
          workerData={selectedWorker}
        />
      )}
    </>
  );
};

export default WorkerDetail;