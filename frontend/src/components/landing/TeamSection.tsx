import React from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Alex Morgan",
      role: "CEO & Founder",
      description: "Visionary leader with 15+ years of experience in connecting communities and building local economies.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "alex@localhire.com"
      }
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Head of Operations",
      description: "Expert in streamlining processes and ensuring seamless connections between workers and clients.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@localhire.com"
      }
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Chief Technology Officer",
      description: "Tech innovator focused on creating user-friendly platforms that empower local communities.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "michael@localhire.com"
      }
    }
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-50 via-white to-green-50 py-20 px-6 overflow-hidden ">
      {/* Background floating dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-30 animate-float"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-6 py-3 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200 shadow-sm mb-6 animate-fade-in">
            Our Team
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.100000s' }}>
            Meet Our{' '}
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Talented Team
            </span>
          </h2>
          
          <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-green-500 mx-auto mb-6 rounded-full animate-scale-in" style={{ animationDelay: '0.4s' }} />
          
          <p className="text-gray-600 text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            We're a passionate group of individuals dedicated to strengthening local communities 
            by connecting skilled professionals with those who need their services.
          </p>
        </div>
        
        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              {/* Card Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-[4/5] object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out h-[380px]"
                  />
                  
                  {/* Social Links Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6">
                    <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <a
                        href={member.social.linkedin}
                        className="bg-white/90 text-green-600 p-3 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
                      >
                        <Linkedin size={18} />
                      </a>
                      <a
                        href={member.social.twitter}
                        className="bg-white/90 text-green-600 p-3 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
                      >
                        <Twitter size={18} />
                      </a>
                      <a
                        href={member.social.email}
                        className="bg-white/90 text-green-600 p-3 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
                      >
                        <Mail size={18} />
                      </a>
                    </div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-300">
                    {member.name}
                  </h3>
                  
                  <p className="text-green-600 font-semibold mb-3 text-sm uppercase tracking-wide">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {member.description}
                  </p>
                  
                  {/* Animated underline */}
                  <div className="mt-4 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
      
      </div>

      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.2);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-5px) translateX(-15px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-30px) translateX(5px) scale(1.1);
            opacity: 0.45;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TeamSection;