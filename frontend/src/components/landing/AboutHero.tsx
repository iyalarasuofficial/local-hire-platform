import { Users, Handshake, Trophy, Heart } from 'lucide-react';

const AboutHero = () => {
  const stats = [
    { icon: Users, number: "10,000+", label: "Happy Customers" },
    { icon: Handshake, number: "5,000+", label: "Skilled Workers" },
    { icon: Trophy, number: "50+", label: "Cities Covered" },
    { icon: Heart, number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-50 via-white to-green-50 py-16 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-green-100 rounded-full blur-2xl opacity-25 animate-bounce" style={{ animationDuration: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Hero Content */}
        <div className="text-center mb-16 relative">
          {/* Hero Section Floating Dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Hero specific floating dots */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`hero-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-30"
                style={{
                  left: `${10 + (i * 7)}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animation: `float-hero ${4 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
            
            {/* Additional smaller dots for texture in hero */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`hero-small-${i}`}
                className="absolute w-2 h-2 bg-gradient-to-r from-green-300 to-green-400 rounded-full opacity-25"
                style={{
                  left: `${15 + (i * 10)}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animation: `twinkle-hero ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
            
            {/* Micro dots around the text */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`hero-micro-${i}`}
                className="absolute w-1 h-1 bg-green-400 rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `pulse-hero ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 4}s`
                }}
              />
            ))}
          </div>

          <div className="space-y-6 relative z-10">
            <span className="inline-block px-6 py-3 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
              About LocalHire
            </span>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              <span className="block animate-fade-in-up">
                Connecting Communities
              </span>
              <span className="block bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                One Job at a Time
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              We believe that every community deserves access to skilled, trusted professionals. 
              LocalHire bridges the gap between talented workers and those who need their services, 
              creating opportunities and building stronger local economies.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                  <IconComponent className="text-white text-xl" />
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mission Statement */}
      

        {/* Values Grid */}
       
      </div>

      {/* Enhanced Floating elements - Multiple layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large floating dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-30 animate-float-slow"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Medium floating dots */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`medium-${i}`}
            className="absolute w-3 h-3 bg-gradient-to-r from-green-300 to-green-400 rounded-full opacity-25 animate-float"
            style={{
              left: `${5 + (i * 8)}%`,
              top: `${15 + Math.random() * 70}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Small floating dots */}
        {[...Array(16)].map((_, i) => (
          <div
            key={`small-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-200 to-green-300 rounded-full opacity-20 animate-float-fast"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Micro dots for texture */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`micro-${i}`}
            className="absolute w-1 h-1 bg-green-300 rounded-full opacity-15 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <style >{`
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.25;
          }
          33% {
            transform: translateY(-15px) translateX(10px) scale(1.1);
            opacity: 0.4;
          }
          66% {
            transform: translateY(-5px) translateX(-8px) scale(0.9);
            opacity: 0.3;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-25px) translateX(15px) scale(1.2) rotate(90deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px) translateX(-20px) scale(0.8) rotate(180deg);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-35px) translateX(5px) scale(1.1) rotate(270deg);
            opacity: 0.35;
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-12px) scale(1.3);
            opacity: 0.4;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.5);
          }
        }

        /* Hero-specific animations */
        @keyframes float-hero {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30px) translateX(15px) scale(1.3);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) translateX(-20px) scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-40px) translateX(8px) scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes twinkle-hero {
          0%, 100% {
            opacity: 0.25;
            transform: scale(1) rotate(0deg);
          }
          25% {
            opacity: 0.6;
            transform: scale(1.5) rotate(90deg);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.7) rotate(180deg);
          }
          75% {
            opacity: 0.7;
            transform: scale(1.4) rotate(270deg);
          }
        }

        @keyframes pulse-hero {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          25% {
            opacity: 0.5;
            transform: scale(1.8);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
          75% {
            opacity: 0.4;
            transform: scale(1.6);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutHero;