import User from "../models/User.js";
import Worker from "../models/Worker.js";
import admin from "../config/firebase.js";


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

export const getUser = async (req, res) => {
  try {
    const { uid } = req.params; // Get uid from route params

    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }

    const user = await User.findOne({ uid }).select("-__v");
  

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getDefaultWorkers = async (req, res) => {
  try {
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

export const getNearbyWorkers = async (req, res) => {
  try {
    const {
      search = '',
      categories = '',
      lat,
      lng,
      locationString = '', 
      radius = 50 
    } = req.query;

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

    // 1. Category/Skill-based search (using skills array)
    if (categoryArray.length > 0) {
      searchConditions.push({
        skills: { 
          $in: categoryArray.map(cat => new RegExp(cat, 'i')) // Case-insensitive match for skills array
        }
      });
    }

    // 2. Text-based search (search in skills, bio, name, address - ADDED address)
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      searchConditions.push({
        $or: [
          { skills: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }, // Search in skills array
          { bio: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
          { address: { $regex: searchTerm, $options: 'i' } }, // Added: search in address
        ],
      });
    }

    // Combine search conditions with AND logic
    if (searchConditions.length > 0) {
      query.$and = searchConditions;
    }

    console.log('Search Query:', JSON.stringify(query, null, 2));

    let workers = [];

    // Execute query with or without location filter
    if (hasLocationFilter) {
      // Geospatial query for workers with valid location (coordinates != [0,0])
      const geoQuery = {
        ...query,
        'location.coordinates': { $ne: [0, 0] },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude], // MongoDB uses [lng, lat] format
            },
            $maxDistance: maxDistance, // Distance in meters
          },
        },
      };

      const geoWorkers = await Worker.find(geoQuery)
        .select('-__v -password -refreshToken')
        .limit(50)
        .lean();

      workers = geoWorkers;

      // Fallback: If locationString provided, search workers without valid location but matching address
      if (locationString.trim() && workers.length < 50) {
        const fallbackQuery = {
          ...query,
          'location.coordinates': [0, 0],
          address: { $regex: locationString.trim(), $options: 'i' },
        };

        const fallbackWorkers = await Worker.find(fallbackQuery)
          .select('-__v -password -refreshToken')
          .limit(50 - workers.length)
          .lean();

        workers = [...workers, ...fallbackWorkers];
      }
    } else {
      // Regular query without location (just skills/category filtering)
      // If locationString provided (but no coordinates), add address filter
      if (locationString.trim()) {
        query.address = { $regex: locationString.trim(), $options: 'i' };
      }

      workers = await Worker.find(query)
        .select('-__v -password -refreshToken')
        .limit(50)
        .lean();
    }

    // Calculate distances and add distance information (only for valid locations)
    const workersWithDistance = workers.map(worker => {
      let workerData = { ...worker };

      // If user location is provided and worker has valid location, calculate distance
      if (hasLocationFilter && worker.location && worker.location.coordinates && (worker.location.coordinates[0] !== 0 || worker.location.coordinates[1] !== 0)) {
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
        }),
        ...(locationString.trim() && { locationString: locationString.trim() })
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
      locationString = '', // Added for consistency
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

    // Text search (added address)
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      searchConditions.push({
        $or: [
          { skills: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
          { bio: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
          { address: { $regex: searchTerm, $options: 'i' } }, // Added
        ],
      });
    }

    // If locationString provided, add address filter
    if (locationString.trim()) {
      searchConditions.push({
        address: { $regex: locationString.trim(), $options: 'i' }
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
        sortBy,
        ...(locationString.trim() && { locationString: locationString.trim() })
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


export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email, phone, address, profilePic } = req.body;


    if (email) {
      try {
        await admin.auth().updateUser(uid, { email });
      } catch (firebaseErr) {
        console.error("Firebase email update failed:", firebaseErr);
        return res.status(400).json({
          message: "Failed to update Firebase email",
          error: firebaseErr.message,
        });
      }
    }


    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (address !== undefined) updateData.address = address;
    if (email !== undefined) updateData.email = email;

    // Step 3: Update MongoDB
    const user = await User.findOneAndUpdate({ uid }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

