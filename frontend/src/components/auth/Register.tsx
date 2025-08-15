import React, { useState } from 'react';
import { Mail, Lock, Phone, User, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase_auth/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Logo from '../common/Logo';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import { Link } from 'react-router-dom';
import { setUser } from '../../store/authSlice'; // adjust the path
import { useDispatch } from 'react-redux';
import Loader from '../common/Loader';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const handleRegister = async () => {
    if (!email || !password || !name || !phone) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const userInfo = {
        uid: user.uid,
        email: user.email,
        name,
        phone,
      };
      localStorage.setItem('tempUser', JSON.stringify(userInfo));

      toast.success('Account created! Select your role');
      navigate('/role');
    } catch (err) {
      let message = 'Registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Email is already in use. Try logging in.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Use at least 6 characters.';
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

const handleGoogleSignup = async () => {
  setLoading(true);
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) {
      toast.error('No authenticated user after login');
      setLoading(false);
      return;
    }

    // Check if user exists and get role from backend
    const res = await axiosInstance.get(`${ApiRoutes.LOGIN.path}/${user.uid}`);
    console.log(res.data);
    if (res.data.exists) {
      const role = res.data.role;

      let name = user.displayName || '';
      let profilePic = user.photoURL || '';

      // For 'user' role, fetch extra profile info
      if (role === 'user') {
        try {
          const redData = await axiosInstance.get(`${ApiRoutes.GET_USER_PROFILE.path}/${user.uid}`);
          name = redData.data.name || name;
          profilePic = redData.data.profilePic || profilePic;
        } catch {
          // Fail silently or toast if you want
          toast.error('Failed to fetch user profile details');
        }
      }

      // Dispatch to redux store
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email || '',
          name,
          profilePic,
          role,
        })
      );

      toast.success(`Logged in as ${role}`);
      navigate(
        role === 'admin'
          ? '/dashboard/admin'
          : role === 'worker'
          ? '/dashboard/worker'
          : '/dashboard/user'
      );
    } else {
      

      // Save user info to localStorage for role selection step
      localStorage.setItem(
        'tempUser',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          phone: user.phoneNumber || '',
        })
      );

      toast('Welcome! Choose your role to complete signup.', { icon: '🌟' });
      navigate('/role');
    }
  } catch (error) {
    toast.error('Google signup failed');
    setLoading(false);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
       {loading && <Loader />}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition mb-6 disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          <span className="font-medium text-gray-700">Sign Up with Google</span>
        </button>

        <div className="text-center text-gray-500 text-sm mb-4">OR</div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-200 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-200 focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-200 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-200 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
