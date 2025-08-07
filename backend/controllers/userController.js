import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Rating from "../models/Rating.js";


export const registerUser = async (req, res) => {
  try {
    const { uid, name, email, phone, location } = req.body;

    let existingUser = await User.findOne({ uid });
    if (existingUser) return res.status(200).json(existingUser);

    const newUser = await User.create({
      uid,
      name,
      email,
      phone,
      location
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
export const getDefaultWorkers = async (req, res) => {
  try {
    // Fetch 10 random workers (you can customize the number or criteria)
    const workers = await Worker.aggregate([{ $sample: { size: 10 } }]);

    res.status(200).json({
      success: true,
      message: "Default workers fetched successfully",
      workers,
    });
  } catch (error) {
    console.error("Error fetching default workers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch default workers",
      error: error.message,
    });
  }
};
// Updated Backend API - getNearbyWorkers
export const getNearbyWorkers = async (req, res) => {
  try {
    const {
      search = '',
      categories = '',
      lat,
      lng,
      radius = 50 // Default 50km radius
    } = req.query;

    // Parse coordinates if provided
    let latitude, longitude, maxDistance;
    let hasLocationFilter = false;

    if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
      maxDistance = parseInt(radius) * 1000; // Convert km to meters

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid coordinates provided' 
        });
      }
      hasLocationFilter = true;
    }

    // Parse categories array and convert to lowercase for matching
    const categoryArray = categories ? 
      categories.split(',')
        .map(cat => cat.trim().toLowerCase())
        .filter(Boolean) : [];

    // Build the main query
    let query = {
      isAvailable: true,
      isBlocked: false,
    };

    // Build search conditions array
    const searchConditions = [];

    // 1. Category/Skill-based search (FIXED: using skillss array)
    if (categoryArray.length > 0) {
      searchConditions.push({
        skills: { 
          $in: categoryArray.map(cat => new RegExp(cat, 'i')) // Case-insensitive match for skills array
        }
      });
    }

    // 2. Text-based search (search in skills, bio, name)
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      searchConditions.push({
        $or: [
          { skills: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }, // Search in skills array
          { bio: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
        ],
      });
    }

    // Combine search conditions with AND logic
    if (searchConditions.length > 0) {
      query.$and = searchConditions;
    }

    console.log('Search Query:', JSON.stringify(query, null, 2));

    let workers;

    // Execute query with or without location filter
    if (hasLocationFilter) {
      // Use geospatial query when location is provided
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude], // MongoDB uses [lng, lat] format
          },
          $maxDistance: maxDistance, // Distance in meters
        },
      };

      workers = await Worker.find(query)
        .select('-__v -password -refreshToken')
        .limit(50)
        .lean();
    } else {
      // Regular query without location (just skills/category filtering)
      workers = await Worker.find(query)
        .select('-__v -password -refreshToken')
        .limit(50)
        .lean();
    }

    // Calculate distances and add distance information
    const workersWithDistance = workers.map(worker => {
      let workerData = { ...worker };

      // If user location is provided, calculate distance
      if (hasLocationFilter && worker.location && worker.location.coordinates) {
        const workerLat = worker.location.coordinates[1];
        const workerLng = worker.location.coordinates[0];
        
        // Calculate distance using Haversine formula
        const distanceKm = calculateDistance(latitude, longitude, workerLat, workerLng);
        const distanceMiles = distanceKm * 0.621371; // Convert km to miles
        
        workerData.distance = {
          km: Math.round(distanceKm * 100) / 100,
          miles: Math.round(distanceMiles * 100) / 100,
          meters: Math.round(distanceKm * 1000)
        };
      }

      return workerData;
    });

    // Sort by distance if location is provided, otherwise by other criteria
    if (hasLocationFilter) {
      workersWithDistance.sort((a, b) => {
        const distA = a.distance ? a.distance.km : Infinity;
        const distB = b.distance ? b.distance.km : Infinity;
        return distA - distB;
      });
    } else {
      // Sort by availability, rating, or other criteria when no location
      workersWithDistance.sort((a, b) => {
        // Sort by rating (highest first), then by name
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingA !== ratingB) {
          return ratingB - ratingA;
        }
        return (a.name || '').localeCompare(b.name || '');
      });
    }

    const response = {
      success: true,
      count: workersWithDistance.length,
      workers: workersWithDistance,
      searchParams: {
        search: search.trim(),
        categories: categoryArray,
        hasLocation: hasLocationFilter,
        ...(hasLocationFilter && {
          location: { lat: latitude, lng: longitude },
          radius: radius + 'km'
        })
      }
    };

    console.log('Response:', {
      ...response,
      workers: response.workers.slice(0, 2) // Log only first 2 workers for brevity
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('Error getting nearby workers:', error);
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch workers',
      ...(isDevelopment && { details: error.message, stack: error.stack })
    });
  }
};

// Helper function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

// Alternative endpoint for getting workers without mandatory location
export const getAllWorkers = async (req, res) => {
  try {
    const {
      search = '',
      categories = '',
      limit = 20,
      page = 1,
      sortBy = 'rating' // rating, distance, name, charge
    } = req.query;

    const categoryArray = categories ? 
      categories.split(',')
        .map(cat => cat.trim().toLowerCase())
        .filter(Boolean) : [];
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {
      isAvailable: true,
      isBlocked: false,
    };

    // Add search conditions
    const searchConditions = [];

    // Category filtering for skills array
    if (categoryArray.length > 0) {
      searchConditions.push({
        skills: { 
          $in: categoryArray.map(cat => new RegExp(cat, 'i'))
        }
      });
    }

    // Text search
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      searchConditions.push({
        $or: [
          { skills: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
          { bio: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
        ],
      });
    }

    if (searchConditions.length > 0) {
      query.$and = searchConditions;
    }

    // Build sort criteria
    let sortCriteria = {};
    switch (sortBy) {
      case 'rating':
        sortCriteria = { rating: -1, name: 1 };
        break;
      case 'charge':
        sortCriteria = { charge: 1, rating: -1 };
        break;
      case 'name':
        sortCriteria = { name: 1 };
        break;
      default:
        sortCriteria = { rating: -1, name: 1 };
    }

    const workers = await Worker.find(query)
      .select('-__v -password -refreshToken')
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const totalCount = await Worker.countDocuments(query);

    res.status(200).json({
      success: true,
      count: workers.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      workers,
      searchParams: {
        search: search.trim(),
        categories: categoryArray,
        sortBy
      }
    });

  } catch (error) {
    console.error('Error getting all workers:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch workers' 
    });
  }
};
export const rateWorker = async (req, res) => {
  try {
    const { uid, workerId, bookingId, rating, feedback } = req.body;

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await Rating.findOne({ bookingId });
    if (existing) return res.status(400).json({ message: "Already rated" });

    const newRating = await Rating.create({
      bookingId,
      userId: user._id,
      workerId,
      rating,
      feedback,
    });

    res.status(201).json({ message: "Rating submitted", newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, phone, coordinates, profilePic } = req.body;

    const user = await User.findOneAndUpdate(
      { uid },
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(coordinates && {
          location: {
            type: "Point",
            coordinates,
          },
        }),
        ...(profilePic && { profilePic }),
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
