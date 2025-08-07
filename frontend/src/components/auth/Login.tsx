import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase_auth/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Logo from '../common/Logo';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import { Link } from 'react-router-dom';
import { setUser } from '../../store/authSlice'; // adjust the path
import { useDispatch } from 'react-redux';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

const redirectBasedOnMongoRole = async (uid: string) => {
  try {
    const res = await axiosInstance.get(`${ApiRoutes.LOGIN.path}/${uid}`);

    if (res.data.exists) {
      const role = res.data.role;
      const user = auth.currentUser;

      if (!user) {
        toast.error('No authenticated user');
        return;
      }

      // ✅ Dispatch to Redux
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
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
      // For new users (not yet registered in MongoDB)
      const user = auth.currentUser;

      if (!user) {
        toast.error('No authenticated user found');
        return;
      }

      // Block admin from registering again
      const adminEmails = ['admin@example.com'];
      if (adminEmails.includes(user.email || '')) {
        toast.error('Admin account not registered in DB. Contact support.');
        return;
      }

      localStorage.setItem(
        'tempUser',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          phone: user.phoneNumber || '',
        })
      );

      navigate('/role');
    }
  } catch (err) {
    toast.error('Failed to check user role');
  }
};

  const handleLogin = async () => {
    if (!email || !password) return toast.error('Please enter both email and password');
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await redirectBasedOnMongoRole(res.user.uid);
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await redirectBasedOnMongoRole(result.user.uid);
    } catch {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Bubble animation */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-green-200 rounded-full blur-3xl opacity-25"
            style={{
              width: `${60 + Math.random() * 80}px`,
              height: `${60 + Math.random() * 80}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -30, 0], x: [0, 10, 0], opacity: [0.2, 0.3, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Login Card */}
      <div className="z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="absolute top-6 left-6 z-20 scale-90" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition mb-6 disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>

        <div className="text-center text-gray-500 text-sm mb-4">OR</div>

        <div className="space-y-4">
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

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
