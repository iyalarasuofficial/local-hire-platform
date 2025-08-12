import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Logo from '../common/Logo';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import { setUser } from '../../store/authSlice'; 
import { useDispatch } from 'react-redux';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  

  // Get temp user data from localStorage
  const userData = JSON.parse(localStorage.getItem('tempUser') || 'null');

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coords);
    
        toast.success('Location captured');

        // ✅ Send to backend immediately after capturing location
        await submitWithLocation(role, coords);
      },
      () => {
        toast.error('Failed to get your location');
      }
    );
  };

  const submitWithLocation = async (role: string, coords: { lat: number; lng: number }) => {
    if (!userData) return toast.error('Session expired. Please sign up again.');

    setLoading(true);
    try {
      const apiPath =
        role === 'user' ? ApiRoutes.USER_SIGNUP.path : ApiRoutes.WORKER_SIGNUP.path;
   

      await axiosInstance.post(apiPath, {
        ...userData,
        role,
        location: {
          type: 'Point',
          coordinates: [coords.lng, coords.lat], // GeoJSON format: [longitude, latitude]
        },
      });

      dispatch(
        setUser({
          uid: userData.uid,
          email: userData.email || '',
          name: userData.name || '',
          phone: userData.phone || '',
          profilePic: '', 
          role,
        })
      );

      toast.success('Registration completed!');
      localStorage.removeItem('tempUser');

      navigate(role === 'worker' ? '/dashboard/worker' : '/dashboard/user');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedRole) return toast.error('Please select a role');
    toast('Fetching location...');
    handleRoleSelect(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl p-8 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">Choose your role</h2>
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRole('user')}
            className={`w-full py-3 rounded-xl border transition ${
              selectedRole === 'user'
                ? 'bg-green-500 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            I'm looking to hire (User)
          </button>
          <button
            onClick={() => setSelectedRole('worker')}
            className={`w-full py-3 rounded-xl border transition ${
              selectedRole === 'worker'
                ? 'bg-green-500 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            I'm offering services (Worker)
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Continue'}
        </button>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
