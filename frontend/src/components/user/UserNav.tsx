import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import Logo from '../common/Logo';

const UserNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    role: 'User',
    notifications: 3,
  };

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
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'Contact', href: '/contact' }
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Navbar with same structure as LandNav */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg h-16' 
            : 'bg-white shadow-md h-20'
        }`} 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full ">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Logo />
            </motion.div>

            {/* Desktop Nav - Centered */}
            <motion.div 
              className="hidden md:flex absolute left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <ul className="flex gap-8 text-gray-700 font-medium">
                {navItems.map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="relative group" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300 relative ${
                        location.pathname === item.href 
                          ? 'text-green-600' 
                          : 'hover:text-green-600'
                      }`}
                    >
                      <motion.span
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                      </motion.span>
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full" 
                        initial={{ scaleX: 0 }} 
                        whileHover={{ scaleX: 1 }} 
                        animate={{ scaleX: location.pathname === item.href ? 1 : 0 }}
                        transition={{ duration: 0.3 }} 
                      />
                    </Link>
                    <motion.div 
                      className="absolute inset-0 bg-green-50 rounded-lg -z-10" 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      whileHover={{ opacity: 1, scale: 1 }} 
                      transition={{ duration: 0.3 }} 
                    />
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right Section - User Controls */}
            <motion.div 
              className="hidden md:flex items-center gap-4 flex-shrink-0" 
              ref={dropdownRef}
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Notification Bell */}
              <motion.div 
                className="relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors" />
                {userData.notifications > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {userData.notifications > 9 ? '9+' : userData.notifications}
                  </motion.span>
                )}
              </motion.div>

              {/* Profile Section */}
              <motion.div
                className="cursor-pointer flex items-center gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={userData.avatar} 
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
                    className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
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
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div 
              className="md:hidden flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Mobile Avatar */}
              <motion.img
                src={userData.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full border-2 border-gray-200"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
            </motion.div>
          </div>
        </div>
      </motion.nav>

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
              className={`absolute ${isScrolled ? 'top-16' : 'top-20'} left-4 right-4 bg-white rounded-2xl shadow-2xl overflow-hidden`}
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }} 
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                {/* Navigation Items */}
                <ul className="space-y-4 mb-6">
                  {navItems.map((item, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          location.pathname === item.href
                            ? 'bg-green-50 text-green-600'
                            : 'hover:bg-green-50 hover:text-green-600'
                        }`}
                      >
                        <motion.span
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.name}
                        </motion.span>
                      </Link>
                    </motion.li>
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
                      src={userData.avatar} 
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
                          to="/profile" 
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

      {/* Spacer to push content below navbar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`} />
    </>
  );
};

export default UserNav;