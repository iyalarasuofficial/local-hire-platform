import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
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
import Booking from './Booking'; // Import the Booking component

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

const WorkerDetail: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const { workerId } = useParams();

  useEffect(() => {
    fetchWorkerProfile();
  }, []);

  const fetchWorkerProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/workers/${workerId}`);
      setWorker(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle Book Now button click
  const handleBookNow = () => {
    if (worker) {
      // Prepare worker data for booking component
      const workerData = {
        id: worker.uid,
        name: worker.name,
        image: worker.profilePic ,
        category: worker.role,
        rate: `₹${worker.charge}/hr`,
        phone: worker.phone,
        email: worker.email
      };
      
      setSelectedWorker(workerData);
      setIsBookingOpen(true);
    }
  };

  // Handle booking modal close
  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedWorker(null);
  };

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

  if (error && !worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWorkerProfile}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!worker) return null;

  const formatExperience = (years: number) => {
    return years === 1 ? '1 year' : `${years} years`;
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

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
            <div className="relative px-8 pb-8">
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                className="relative left-5 md:left-0"
              >
                <div className="w-32 h-32 rounded-full border-6 border-white shadow-lg overflow-hidden bg-gray-200">
                  {worker.profilePic ? (
                    <img
                      src={worker.profilePic}
                      alt={worker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <motion.h1
                      variants={itemVariants}
                      className="text-3xl font-bold text-gray-800 mb-2"
                    >
                      {worker.name}
                    </motion.h1>
                    
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center mb-3"
                    >
                      <div className="flex items-center mr-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(worker.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : i < worker.averageRating
                                ? 'text-yellow-400 fill-current opacity-50'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">
                          {worker.averageRating} ({worker.totalRatings} reviews)
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-center text-gray-600 mb-2"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{worker.address}</span>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-center"
                    >
                      {worker.isAvailable ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-green-600 font-medium">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-red-600 font-medium">Unavailable</span>
                        </>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBookNow}
                      disabled={!worker.isAvailable}
                      className={`px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg ${
                        worker.isAvailable
                          ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {worker.isAvailable ? 'Book Now' : 'Unavailable'}
                    </motion.button>
                    <a
                      href={`https://wa.me/91${worker.phone}?text=Hi%20${encodeURIComponent(worker.name)},%20I%20found%20you%20on%20Local%20Hiring%20Platform.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border-2 border-green-500 text-green-500 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                      >
                        Message
                      </motion.button>
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">About</h2>
                <p className="text-gray-600 leading-relaxed">{worker.bio}</p>
              </motion.div>

              {/* Skills Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {worker.skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      variants={skillVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium capitalize cursor-pointer shadow-md"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-600">{worker.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-600 break-all">{worker.email}</span>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6"
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
                      <span className="text-gray-600">Joined</span>
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
      <Booking 
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        workerData={selectedWorker}
      />
    </>
  );
};

export default WorkerDetail;