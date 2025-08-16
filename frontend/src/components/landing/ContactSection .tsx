import React, { useState } from 'react';
import {
  MapPin, Phone, Clock, Mail,
  Facebook, Instagram, Linkedin, Youtube
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import ApiRoutes from '../../api/apiRoutes';
import Loader from '../common/Loader';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone || !formData.email) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(ApiRoutes.CONTACT_ADMIN.path, formData);

      if (res.data.success) {
        toast.success("Thank you! We’ll get back to you.");
        setFormData({ fullName: "", phone: "", email: "", message: "" });
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: 'Address', content: '9/5, Suresh Nagar, Selaiyur, Chennai-600073' },
    { icon: Phone, title: 'Phone', content: '+91 987654321' },
    { icon: Clock, title: 'Hours', content: 'Mon–Sat: 10 AM – 8 PM' },
    { icon: Mail, title: 'Email', content: 'localhire@gmail.com' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <section className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Contact <span className="text-green-600">Information</span>
          </h2>
          <p className="text-gray-600 max-w-md">
            We're here to help you connect with skilled professionals in your community.
          </p>

          <div className="space-y-5">
            {contactInfo.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-gray-600">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex space-x-4">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 transition"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 p-6 rounded-2xl shadow-lg space-y-6"
        >
          <h3 className="text-2xl font-semibold text-gray-800">
            Send us a <span className="text-green-600">Message</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                disabled={loading}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none"
              />
            </div>

            <motion.button
  onClick={handleSubmit}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  disabled={loading}
  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
>
  {loading && (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  )}
  <span>{loading ? "Sending..." : "Send Message"}</span>
</motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
