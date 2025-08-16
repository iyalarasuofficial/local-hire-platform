import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import defaultprofile from "../../assets/image.png"
import { useDispatch } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';
import { logoutUser } from '../../store/authSlice';

const UserNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', href: '/dashboard/user' },
    { name: 'Find Workers', href: '/dashboard/user/find-worker' },
    { name: 'My Bookings', href: '/dashboard/user/bookings' },
    { name: 'Contact', href: '/dashboard/user/contact' }
  ];

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(logoutUser());
      setIsDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Navbar without initial animation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-white shadow-md py-2'
        }`}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Nav - Centered */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <ul className="flex gap-8 text-gray-700 font-medium">
                {navItems.map((item, index) => (
                  <li key={index} className="relative group">
                    <Link
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300 ${
                        location.pathname === item.href 
                          ? 'text-green-600' 
                          : 'hover:text-green-600'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section - User Controls */}
            <div 
              className="hidden md:flex items-center gap-4 flex-shrink-0" 
              ref={dropdownRef}
            >
              {/* Profile Section */}
              <motion.div
                className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-all duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={userData?.profilePic || defaultprofile}
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                  alt="avatar"
                />
                <span className="hidden lg:inline-block font-medium text-gray-700">
                  {userData.name}
                </span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-gray-500"
                >
                  ▼
                </motion.div>
              </motion.div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/user/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile Avatar */}
              <img
                src={userData?.profilePic || defaultprofile}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
                alt="avatar"
              />

              {/* Mobile Menu Toggle */}
              <motion.button 
                className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex-shrink-0" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-6 h-0.5 bg-gray-600 rounded-full" 
                  animate={{ 
                    rotate: isMobileMenuOpen ? 45 : 0, 
                    y: isMobileMenuOpen ? 4 : 0 
                  }} 
                  transition={{ duration: 0.3 }} 
                />
                <motion.div 
                  className="w-6 h-0.5 bg-gray-600 rounded-full" 
                  animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} 
                  transition={{ duration: 0.3 }} 
                />
                <motion.div 
                  className="w-6 h-0.5 bg-gray-600 rounded-full" 
                  animate={{ 
                    rotate: isMobileMenuOpen ? -45 : 0, 
                    y: isMobileMenuOpen ? -4 : 0 
                  }} 
                  transition={{ duration: 0.3 }} 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 md:hidden" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                {/* Navigation Items */}
                <ul className="space-y-4 mb-6">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          location.pathname === item.href
                            ? 'bg-green-50 text-green-600'
                            : 'hover:bg-green-50 hover:text-green-600'
                        }`}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Mobile Profile Section */}
                <div className="border-t border-gray-100 pt-4">
                  <motion.div 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={userData?.profilePic || defaultprofile} 
                      className="w-10 h-10 rounded-full border-2 border-gray-200" 
                      alt="avatar" 
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{userData.name}</p>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 text-gray-500"
                    >
                      ▼
                    </motion.div>
                  </motion.div>

                  {/* Mobile Dropdown */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        className="mt-2 space-y-2 border-t border-gray-100 pt-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link 
                          to="/user/profile" 
                          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => { 
                            setIsDropdownOpen(false); 
                            setIsMobileMenuOpen(false); 
                          }}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link 
                          to="/settings" 
                          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => { 
                            setIsDropdownOpen(false); 
                            setIsMobileMenuOpen(false); 
                          }}
                        >
                          Settings
                        </Link>
                        <button 
                          className="flex items-center gap-2 w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => { 
                            handleLogout();
                            setIsMobileMenuOpen(false); 
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 md:h-16"></div>
    </>
  );
};

export default UserNav;