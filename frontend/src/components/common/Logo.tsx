import { motion } from "framer-motion";

const Logo = () => (
  <motion.div
    className="flex items-center gap-3 cursor-pointer"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    {/* Logo icon with animation */}
    <motion.div
      className="relative"
      whileHover={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300"
        whileHover={{ boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)" }}
      >
        <motion.div
          className="text-white text-xl relative z-10"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🏠
        </motion.div>
        <motion.div
          className="absolute bottom-0.5 right-0.5 text-white text-xs"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🔧
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{ x: [-100, 100] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>

    {/* Text */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-2xl font-bold leading-tight transition-all duration-300"
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          Local
        </motion.span>
        <span className="text-gray-800 ml-1">Hire</span>
      </motion.h1>
      <motion.p
        className="text-sm text-gray-500 -mt-1 transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Trusted Services
      </motion.p>
    </motion.div>
  </motion.div>
);

export default Logo;
