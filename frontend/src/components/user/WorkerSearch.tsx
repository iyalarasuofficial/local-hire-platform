import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Search, Star, MapPin, Clock, Filter, X, Navigation, AlertCircle
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Booking from './Booking';

// interfaces/Worker.ts
export interface WorkerLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Worker {
  _id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  bio?: string;
  profilePic?: string;
  skills: string[];
  role: 'worker';
  experience?: number;
  charge: number;
  isAvailable: boolean;
  isBlocked: boolean;
  maxDistance: number;
  location: WorkerLocation;
  address?: string;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  
  // Virtual fields (computed on backend)
  verified?: boolean;
  formattedCharge?: string;
  
  // Populated when doing nearby search
  distance?: number;
  distanceMiles?: number;
  distanceUnit?: string;
}

export interface WorkerSearchParams {
  search?: string;
  categories?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  minRating?: number;
  maxCharge?: number;
  page?: number;
  limit?: number;
}

export interface WorkerSearchResponse {
  success: boolean;
  workers: Worker[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// For booking modal - simplified interface
export interface BookingWorkerData {
  id: string;
  name: string;
  image: string;
  category: string;
  rate: string;
  phone: string;
  email: string;
}

const WorkerSearch: React.FC = () => {
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  
  // Loading and error states
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  
  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null);

  const categories = ['plumbing', 'electrical', 'cleaning', 'handyman', 'painting'];

  const fetchDefaultWorkers = async () => {
    try {
      setIsSearching(true);
      const res = await axiosInstance.get(ApiRoutes.RANDOM_WORKERS.path);
      if (res.data && Array.isArray(res.data.workers)) {
        setWorkers(res.data.workers);
      } else {
        console.error("Unexpected response from RANDOM_WORKERS:", res.data);
        setWorkers([]);
      }
    } catch (err) {
      console.error("Error fetching default workers:", err);
      setWorkers([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-detect user location on component mount
  useEffect(() => {
    detectUserLocation();
    fetchDefaultWorkers();
  }, []);

  // Fetch workers when search parameters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWorkers();
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategories, coordinates]);

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      toast.error("Please enable location");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([longitude, latitude]);
        
        try {
          setLocationQuery(`Locating... ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          
          const address = await reverseGeocode(latitude, longitude);
          setLocationQuery(address);
          setHasRequestedLocation(true);
          
          console.log('Location detected:', {
            coordinates: [longitude, latitude],
            address: address
          });
          
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          setLocationQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setHasRequestedLocation(true);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        setHasRequestedLocation(true);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. You can still search by skill categories.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable. You can still search by skill categories.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. You can still search by skill categories.');
            break;
          default:
            setLocationError('Location detection failed. You can still search by skill categories.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using Nominatim (Free alternative) - no API key required
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: lat,
          lon: lng,
          format: 'json',
          addressdetails: 1,
          zoom: 14,
        },
        headers: {
          'User-Agent': 'WorkerSearchApp/1.0'
        }
      });
      
      if (res.data && res.data.address) {
        const addr = res.data.address;
        let address = '';
        
        if (addr.suburb || addr.neighbourhood || addr.residential) {
          address += (addr.suburb || addr.neighbourhood || addr.residential) + ', ';
        }
        if (addr.city || addr.town || addr.village) {
          address += (addr.city || addr.town || addr.village) + ', ';
        }
        if (addr.state) {
          address += addr.state + ', ';
        }
        if (addr.country) {
          address += addr.country;
        }
        
        return address || res.data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }

      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const fetchWorkers = async () => {
    try {
      setIsSearching(true);
      
      // Build search parameters
      const params: any = {};
      
      // Add skill-based search
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      // Add category filters (convert to lowercase to match backend)
      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.map(cat => cat.toLowerCase()).join(',');
      }
      
      // Add location coordinates for nearby search (if available)
      if (coordinates) {
        params.lat = coordinates[1]; // latitude
        params.lng = coordinates[0]; // longitude
        params.radius = 50; // Search within 50km radius
      }

      // Use the appropriate endpoint
      const endpoint = ApiRoutes.NEARBY_WORKERS.path;
      const res = await axiosInstance.get(endpoint, { params });
      const data = res.data;

      // Handle different response formats
      if (Array.isArray(data)) {
        setWorkers(data);
      } else if (Array.isArray(data.workers)) {
        setWorkers(data.workers);
      } else if (data.success && Array.isArray(data.data)) {
        setWorkers(data.data);
      } else {
        console.error("Unexpected response format:", data);
        setWorkers([]);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      setWorkers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const geocodeLocation = async () => {
    if (!locationQuery.trim()) return;
    
    try {
      setIsLoadingLocation(true);
      setLocationError('');
      
      let coordinates = null;

      // Using Nominatim for geocoding
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: locationQuery.trim(),
          format: 'json',
          limit: 1,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'WorkerSearchApp/1.0'
        }
      });
      
      if (res.data && res.data.length > 0) {
        const result = res.data[0];
        coordinates = [parseFloat(result.lon), parseFloat(result.lat)];
      }

      if (coordinates) {
        setCoordinates(coordinates);
        setLocationError('');
        
        try {
          const formattedAddress = await reverseGeocode(coordinates[1], coordinates[0]);
          setLocationQuery(formattedAddress);
        } catch (error) {
          // Keep the original query if reverse geocoding fails
        }
        
      } else {
        setLocationError('Location not found. Please try a different location or be more specific.');
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      setLocationError('Failed to find location. Please check your internet connection and try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value);
    setLocationError('');
  };

  const handleLocationKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      geocodeLocation();
    }
  };

  const retryLocationDetection = () => {
    detectUserLocation();
  };

  const clearLocationAndSearch = () => {
    setLocationQuery('');
    setCoordinates(null);
    setLocationError('');
    fetchWorkers(); // This will now search without location
  };

  const getFilteredWorkersCount = () => {
    return workers.length;
  };

  const getSearchSummary = () => {
    let summary = '';
    if (searchQuery.trim()) {
      summary += `"${searchQuery}" `;
    }
    if (selectedCategories.length > 0) {
      summary += `in ${selectedCategories.join(', ')} `;
    }
    if (locationQuery.trim() && coordinates) {
      summary += `near ${locationQuery}`;
    } else if (selectedCategories.length > 0 || searchQuery.trim()) {
      summary += '(all locations)';
    }
    return summary.trim() || 'all professionals';
  };

  const formatDistance = (worker: Worker) => {
    if (!worker.distance) return null;
    
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <MapPin className="w-4 h-4" />
        <span>{worker.distance.toFixed(1)} km {worker.distanceMiles ? `(${worker.distanceMiles.toFixed(1)} miles)` : ''} away</span>
      </div>
    );
  };

  const handleBookNow = (worker: Worker) => {
    if (!worker) return;
    
    // Prepare worker data for booking component
    const workerData: WorkerData = {
      id: worker.uid,
      name: worker.name,
      image: worker.profilePic || '',
      category: worker.role || 'Professional',
      rate: `₹${worker.charge}/hr`,
      phone: worker.phone || '',
      email: worker.email || ''
    };
    
    setSelectedWorker(workerData);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedWorker(null);
  };

  const handleViewProfile = (worker: Worker) => {
    console.log("Viewing profile for worker:", worker);
    navigate(`/dashboard/user/find-worker/workers/detail/${worker.uid}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Search Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Main Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Skills Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for skills (e.g. plumber, electrician)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Location Search */}
              <div className="relative w-full lg:w-[350px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={isLoadingLocation ? "Detecting location..." : "Enter city or location (optional)"}
                  value={locationQuery}
                  onChange={handleLocationChange}
                  onKeyPress={handleLocationKeyPress}
                  disabled={isLoadingLocation}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  title={coordinates ? `Coordinates: ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}` : 'Location is optional for searching'}
                />
                {isLoadingLocation && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                  </div>
                )}
                {!isLoadingLocation && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    {locationQuery && (
                      <button
                        onClick={clearLocationAndSearch}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Clear location"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={retryLocationDetection}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Detect my location automatically"
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={() => {
                  if (locationQuery.trim() && !coordinates) {
                    geocodeLocation();
                  } else {
                    fetchWorkers();
                  }
                }}
                disabled={isLoadingLocation || isSearching}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Filter size={18} /> 
                {isLoadingLocation || isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Location Error/Info Message */}
            {locationError && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800">{locationError}</p>
                  <p className="text-blue-600 mt-1">Don't worry! You can still search by skills and categories without location.</p>
                </div>
              </div>
            )}

            {/* Category Filters */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category:</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      selectedCategories.includes(category)
                        ? 'bg-green-100 text-green-700 border-2 border-green-300 focus:ring-green-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 focus:ring-gray-500'
                    }`}
                  >
                    {category}
                    {selectedCategories.includes(category) && (
                      <X className="inline-block ml-2 w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {coordinates ? 'Nearby Professionals' : 'Available Professionals'}
              </h2>
              <p className="text-gray-600">
                Found {getFilteredWorkersCount()} professionals for {getSearchSummary()}
                {!coordinates && (searchQuery || selectedCategories.length > 0) && (
                  <span className="text-green-600 ml-2">• Showing results from all locations</span>
                )}
              </p>
            </div>
          </div>

          {/* Workers List */}
          <div className="space-y-6">
            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for professionals...</p>
              </div>
            ) : workers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or selecting different categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategories([]);
                    fetchDefaultWorkers();
                  }}
                  className="px-4 py-2 text-green-600 hover:text-green-700 font-medium focus:outline-none focus:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              workers.map((worker) => (
                <motion.div
                  key={worker.uid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-200 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={worker.profilePic || '/api/placeholder/96/96'}
                        alt={`${worker.name}'s profile`}
                        className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/96/96';
                        }}
                      />
                      {worker.verified && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Worker Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">{worker.name}</h3>
                          <p className="text-gray-600 mb-2 line-clamp-2">{worker.bio || 'Experienced professional'}</p>
                          
                          {/* Skills/Categories */}
                          {worker.skills && worker.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {worker.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={`${worker.uid}-skill-${index}`}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full capitalize"
                                >
                                  {skill}
                                </span>
                              ))}
                              {worker.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{worker.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mb-3">
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-gray-900 font-medium">{worker.averageRating?.toFixed(1) || '4.5'}</span>
                              <span className="text-gray-500"> • {worker.totalRatings || 0} reviews</span>
                            </div>
                            
                            {/* Distance Display */}
                            {worker.distance && formatDistance(worker)}
                            
                            {/* Address (only show if no distance available) */}
                            {!worker.distance && worker.address && (
                              <div className="flex items-center gap-1 text-gray-500 min-w-0">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{worker.address}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-lg font-semibold text-green-600">₹{worker.charge}/hr</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBookNow(worker)}
                            disabled={worker.isAvailable === false}
                            className={`px-6 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              worker.isAvailable !== false
                                ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                          >
                            {worker.isAvailable !== false ? 'Book Now' : 'Unavailable'}
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            onClick={() => handleViewProfile(worker)}
                          >
                            View Profile
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

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

export default WorkerSearch;