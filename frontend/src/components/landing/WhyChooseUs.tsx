
import { motion } from "framer-motion";
import { FaTools, FaRegSmile, FaHandshake } from "react-icons/fa";


function WhyChooseUs() {
    
const features = [
  {
    icon: <FaTools className="text-4xl text-green-600" />,
    title: "Verified & Skilled Workers",
    description: "Every worker goes through a verification and rating process.",
  },
  {
    icon: <FaRegSmile className="text-4xl text-green-600" />,
    title: "Easy Booking & Support",
    description: "Book workers with one click and get 24/7 customer support.",
  },
  {
    icon: <FaHandshake className="text-4xl text-green-600" />,
    title: "Affordable Local Help",
    description: "Get connected to nearby workers without breaking your budget.",
  },
];
  return (
    
 <section className="bg-white py-5 px-6  relative overflow-hidden" id="why-us">
  {/* Background decorative elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute top-20 right-10 w-72 h-72 bg-green-100/20 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute bottom-20 left-10 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl"
      animate={{
        scale: [1.1, 1, 1.1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </div>

  <div className="max-w-6xl mx-auto text-center relative z-10">
    {/* Header Section */}
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
                        Why Choose{' '}
                        <span className="relative">
                            <span className="text-green-500">Local Hire?</span>
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

    {/* Features Grid */}
    <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="group relative"
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            delay: index * 0.15 + 0.6, 
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          {/* Card Container */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-gray-100/50"
            whileHover={{ 
              y: -12,
              transition: { duration: 0.4, ease: "easeOut" }
            }}
          >
            {/* Hover Gradient Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />
            
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-all duration-500"
              initial={false}
            />

            {/* Number Badge */}
            <motion.div
              className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.15 + 1, 
                duration: 0.6, 
                type: "spring", 
                stiffness: 200 
              }}
              whileHover={{ 
                scale: 1.15,
                rotate: 360,
                transition: { duration: 0.5 }
              }}
            >
              {index + 1}
            </motion.div>

            {/* Icon Container */}
            <motion.div 
              className="mb-6 flex justify-center relative z-10"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.6 }
              }}
            >
              <motion.div
                className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-full relative"
                whileHover={{
                  background: "linear-gradient(135deg, rgb(240, 253, 244), rgb(220, 252, 231))",
                  scale: 1.05
                }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.15 + 0.8, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 150
                }}
              >
                <motion.div
                  whileHover={{
                    rotate: 360,
                    transition: { duration: 0.8 }
                  }}
                >
                  {feature.icon}
                </motion.div>
              </motion.div>

              {/* Floating Particles */}
              <motion.div
                className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-green-300 rounded-full"
                animate={{
                  y: [0, 8, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.4
                }}
              />
            </motion.div>
            
            {/* Content */}
            <motion.h3 
              className="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300 relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + 1.2, duration: 0.6 }}
            >
              {feature.title}
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 leading-relaxed relative z-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + 1.4, duration: 0.6 }}
            >
              {feature.description}
            </motion.p>

            {/* Hover Arrow */}
            <motion.div
              className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={false}
            >
              <motion.div
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                animate={{
                  x: [0, 3, 0],
                }}
                transition={{
                  x: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                →
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Card Shadow Animation */}
          <motion.div
            className="absolute inset-0 bg-green-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            initial={false}
          />
        </motion.div>
      ))}
    </div>

    {/* Bottom CTA Section */}
    
  </div>
</section>
  )
}

export default WhyChooseUs