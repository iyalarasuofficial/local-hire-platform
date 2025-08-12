import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Ravi Kumar",
    role: "Homeowner, Tamil Nadu",
    text: "I booked an electrician through this app and the service was excellent. The worker arrived on time and completed the work professionally!",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Anita Sharma",
    role: "Plumber, Uttar Pradesh",
    text: "This platform helped me find consistent work nearby. It's easy to use and payments are safe and timely!",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Suresh Nair",
    role: "Carpenter, Kerala",
    text: "Earlier, I had to wait days for work. Now I get jobs daily and connect with clients directly. It's a blessing!",
    image: "https://randomuser.me/api/portraits/men/85.jpg"
  },
  {
    name: "Lakshmi Devi",
    role: "Housemaid, Hyderabad",
    text: "I found more homes to work for and got paid on time. Thank you for this app!",
    image: "https://randomuser.me/api/portraits/women/75.jpg"
  },
  {
    name: "Rakesh Patel",
    role: "Electrician, Gujarat",
    text: "I get regular bookings from this platform. It’s very useful and convenient.",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  }
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
   <section className="bg-gray-50 py-5 px-6 overflow-hidden" id="testimonials">

                        <motion.div
                                        className="text-center mb-8"
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
                                            Hear From Our{' '}
                                            <span className="relative">
                                                <span className="text-green-500"> Community</span>
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

      <Slider {...settings} className="mb-10">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            className="px-4 "
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 * index }}
          >
            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 h-[180px] ">
              <div className="flex items-center gap-4 mb-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">“{t.text}”</p>
            </div>
          </motion.div>
        ))}
      </Slider>
    </section>
  );
};

export default Testimonials;
