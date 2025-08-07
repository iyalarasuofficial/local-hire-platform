import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // ✅ Added for routing
import Logo  from "../common/Logo"

const LandNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const scrollToSection = (href:string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };


  return (
    <>
      <motion.nav className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white shadow-md py-2'}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Nav */}
            <motion.div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <ul className="flex gap-8 text-gray-700 font-medium">
                {navItems.map((item, index) => (
                  <motion.li key={index} className="relative group" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}>
                    {item.href.startsWith('#') ? (
                      <motion.a
                        href={item.href}
                        onClick={() => scrollToSection(item.href)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-green-600 transition-colors duration-300 relative"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                        <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
                      </motion.a>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-green-600 transition-colors duration-300 relative"
                      >
                        {item.name}
                        <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />
                      </Link>
                    )}
                    <motion.div className="absolute inset-0 bg-green-50 rounded-lg -z-10" initial={{ opacity: 0, scale: 0.8 }} whileHover={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right Buttons - unchanged */}
            <motion.div className="hidden md:flex items-center gap-4 flex-shrink-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
              <motion.button className="text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-300 relative overflow-hidden" whileHover={{ scale: 1.05, color: "#16a34a" }} whileTap={{ scale: 0.95 }}>
                <motion.span className="relative z-10"> <Link to="/login">Login</Link></motion.span>
              </motion.button>
              <motion.button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden" whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)" }} whileTap={{ scale: 0.95 }}>
                <motion.span className="relative z-10 flex items-center gap-2">
                  <Link to="/register">Get Started</Link>
                  <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </motion.span>
                <motion.div className="absolute inset-0 bg-white/20 rounded-lg" initial={{ scale: 0, opacity: 1 }} whileHover={{ scale: 1, opacity: 0, transition: { duration: 0.6 } }} />
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex-shrink-0" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.div className="w-6 h-0.5 bg-gray-600 rounded-full" animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 4 : 0 }} transition={{ duration: 0.3 }} />
              <motion.div className="w-6 h-0.5 bg-gray-600 rounded-full" animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} transition={{ duration: 0.3 }} />
              <motion.div className="w-6 h-0.5 bg-gray-600 rounded-full" animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -4 : 0 }} transition={{ duration: 0.3 }} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div className="fixed inset-0 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl overflow-hidden" initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="p-6">
                <ul className="space-y-4 mb-6">
                  {navItems.map((item, index) => (
                    <motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}>
                      {item.href.startsWith('#') ? (
                        <motion.a
                          href={item.href}
                          onClick={() => scrollToSection(item.href)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.name}
                        </motion.a>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandNav;
