import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase_auth/firebase';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { motion } from 'framer-motion';
import Loader from '../common/Loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to send reset email');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
       {loading && <Loader />}
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

      {/* Forgot Password Card */}
      <div className="z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="absolute top-6 left-6 z-20 scale-90" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and we’ll send you a password reset link.
        </p>

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

          <button
            onClick={handlePasswordReset}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
