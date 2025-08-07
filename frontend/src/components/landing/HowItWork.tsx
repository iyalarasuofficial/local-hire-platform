import React from 'react';
import { motion } from "framer-motion";
import { FaClipboardList, FaUserCheck, FaMoneyCheckAlt } from "react-icons/fa";
import { FaTools, FaRegSmile, FaHandshake } from "react-icons/fa";

// How It Works Section
function HowItWork() {
  const steps = [
    {
      icon: <FaClipboardList className="text-green-600 text-4xl" />,
      title: "Post a Request",
      desc: "Tell us what you need — plumber, electrician, and more.",
    },
    {
      icon: <FaUserCheck className="text-green-600 text-4xl" />,
      title: "Connect with Workers",
      desc: "We match you with verified local professionals nearby.",
    },
    {
      icon: <FaMoneyCheckAlt className="text-green-600 text-4xl" />,
      title: "Book & Pay",
      desc: "Confirm your booking and pay securely online.",
    },
  ];

  return (
    <section className="py-2 bg-whiterelative overflow-hidden" id="how-it-works">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 bg-green-100/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(34,197,94,0.03)_1px,transparent_0)] bg-[length:50px_50px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16"
        >
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
                        How It{' '}
                        <span className="relative">
                            <span className="text-green-500"> Works</span>
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
          
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Three simple steps to connect with trusted professionals in your area
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.2 + 0.7, 
                duration: 0.8,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-green-300 to-green-200 z-0"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: index * 0.2 + 1.4, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full absolute -right-1 -top-0.5"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 1.8, duration: 0.4 }}
                    viewport={{ once: true }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  />
                </motion.div>
              )}
              
              {/* Step Number */}
              <motion.div
                className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-lg z-20"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.2 + 0.9, duration: 0.6, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: 360,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
                  transition: { duration: 0.6 }
                }}
              >
                {index + 1}
              </motion.div>

              {/* Main Card */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100/50 relative overflow-hidden group-hover:border-green-200"
                whileHover={{
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
              >
                {/* Hover Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-transparent to-green-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                
                {/* Icon Container */}
                <motion.div 
                  className="flex justify-center mb-8 relative z-10"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -8, 8, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  <motion.div
                    className="p-6 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    whileHover={{
                      background: "linear-gradient(135deg, rgb(220, 252, 231), rgb(240, 253, 244))",
                      scale: 1.05
                    }}
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2 + 1.1, duration: 0.6, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                {/* Content */}
                <motion.h3 
                  className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 1.3, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {step.title}
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-gray-600 leading-relaxed relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 1.5, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {step.desc}
                </motion.p>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-3 h-3 bg-green-300 rounded-full opacity-60"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
                <motion.div
                  className="absolute bottom-6 left-6 w-2 h-2 bg-green-400 rounded-full opacity-40"
                  animate={{
                    y: [0, 6, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          viewport={{ once: true }}
        >
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWork;
