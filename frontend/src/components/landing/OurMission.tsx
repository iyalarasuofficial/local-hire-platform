// components/OurMission.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaUsers, FaBolt } from 'react-icons/fa';

const OurMission = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Our{' '}
                        <span className="relative">
                            <span className="text-green-500">Mission</span>
                            <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-1 bg-green-500/30 rounded-full"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            />
                        </span>
                    </motion.h1>
                    <motion.div
                        className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1, duration: 0.8 }}
                    />
                </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6 text-center"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <FaTools className="text-green-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Empowering Workers</h3>
            <p className="text-gray-600">
              Provide skilled workers in rural areas with digital visibility and consistent job opportunities.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6 text-center"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <FaUsers className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connecting Communities</h3>
            <p className="text-gray-600">
              Bridge the gap between local service providers and people in need of reliable assistance.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6 text-center"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <FaBolt className="text-yellow-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Seamless Access</h3>
            <p className="text-gray-600">
              Create a fast, easy-to-use platform for posting work, finding help, and tracking progress.
            </p>
          </motion.div>
        </div>

        {/* Paragraph section with underline effects */}
        <motion.div
          className="space-y-4 mt-12 text-center px-4 md:px-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {/* First paragraph */}
          <motion.div
            className="text-gray-600 mb-4 text-lg leading-relaxed relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.span
              className="text-green-600 font-semibold relative"
              whileHover={{ scale: 1.05 }}
            >
              quality service
              <motion.div
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-green-500/40 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4, duration: 0.5 }}
              />
            </motion.span>
            , timely delivery, and safe bookings.
          </motion.div>

          {/* Second paragraph */}
          <motion.div
            className="text-gray-600 text-lg leading-relaxed"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Whether you're a homeowner in need or a skilled worker looking for daily jobs, we are building
            <motion.span
              className="text-blue-600 font-semibold relative ml-1"
              whileHover={{ scale: 1.05 }}
            >
              bridges between opportunity and service
              <motion.div
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500/40 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6, duration: 0.5 }}
              />
            </motion.span>
            .
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurMission;
