import React from 'react';
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";
import Logo from '../common/Logo';

/*
  Usage:
    For User Panel:   <Footer panelType="user" />
    For Worker Panel: <Footer panelType="worker" />
    For Landing Page: <Footer panelType="landing" /> or <Footer />
*/

function Footer({ panelType }) {
  // Quick Links for Landing, User, and Worker panels
  const landingLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" }
  ];

  const userLinks = [
    { name: "Home", href: "/dashboard/user" },
    { name: "Find Worker", href: "/dashboard/user/find-worker" },
    { name: "My Bookings", href: "/dashboard/user/bookings" },
    { name: "Profile", href: "/user/profile" },
    { name: "Contact", href: "/dashboard/user/contact" }
  ];

  const workerLinks = [
    { name: "Home", href: "/dashboard/worker" },
    { name: "Work Orders", href: "/dashboard/worker/work-orders" },
    { name: "Profile", href: "/worker/profile" },
    { name: "Contact", href: "/dashboard/worker/contact" }
  ];

  // Select quickLinks based on context
  let quickLinks;
  if (panelType === "user") {
    quickLinks = userLinks;
  } else if (panelType === "worker") {
    quickLinks = workerLinks;
  } else {
    quickLinks = landingLinks;
  }

  const socialLinks = [
    { icon: FaFacebook, href: "#", color: "hover:text-blue-500" },
    { icon: FaInstagram, href: "#", color: "hover:text-pink-500" },
    { icon: FaTwitter, href: "#", color: "hover:text-sky-500" },
    { icon: FaLinkedin, href: "#", color: "hover:text-blue-400" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Logo/>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Connecting skilled workers to homes and businesses across rural areas with trust and convenience.
            </p>
          </motion.div>
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-green-400 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Get in Touch</h3>
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                <FaEnvelope className="text-green-400" />
                <span>support@localhire.com</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                <FaPhone className="text-green-400" />
                <span>+91 9876543210</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                <FaMapMarkerAlt className="text-green-400" />
                <span>Rural India</span>
              </motion.div>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 bg-gray-800 rounded-full text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700 hover:shadow-lg`}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Divider with animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6"
          style={{ transformOrigin: "center" }}
        ></motion.div>
        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
         <p className="text-gray-500 text-sm">
  © {new Date().getFullYear()} Iyalarasu C. All rights reserved. Made with ❤️ for rural communities.
</p>

        </motion.div>
      </div>
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    </footer>
  );
}

export default Footer;
