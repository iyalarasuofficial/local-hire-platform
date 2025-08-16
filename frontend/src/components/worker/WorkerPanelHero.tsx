import React from 'react';
import { Wrench, Users, Star, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkerPanelHero = () => {
  return (
    <div className="relative w-full bg-gradient-to-br from-green-50 via-white to-gray-50 py-16 px-6 overflow-hidden">
      {/* Background floating bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-12 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-16 right-16 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-52 h-52 bg-green-100 rounded-full blur-2xl opacity-25 animate-bounce" style={{ animationDuration: '3s' }} />
      </div>

      {/* Floating and twinkling dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(10)].map((_, i) => (
          <div
            key={`float-${i}`}
            className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-30 animate-float"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`twinkle-${i}`}
            className="absolute w-2 h-2 bg-green-300 rounded-full opacity-25 animate-twinkle"
            style={{
              left: `${15 + i * 7}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`micro-${i}`}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-15 animate-pulse-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <span className="inline-block px-6 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200 shadow animate-fade-in-up">
          🔧 Professional Dashboard
        </span>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Grow Your Business with <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Verified Clients</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Join thousands of skilled professionals who trust our platform to connect with quality clients, manage their business, and increase their earnings.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/dashboard/worker/work-orders">
          <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
            Start Earning Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          </Link>
          <button className="px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-300">
            Learn More
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">50K+</div>
            <div className="text-gray-600 text-sm">Active Clients</div>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">4.9/5</div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">₹2.5L+</div>
            <div className="text-gray-600 text-sm">Avg Monthly Earnings</div>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">98%</div>
            <div className="text-gray-600 text-sm">Job Completion</div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
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
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-20px) scale(0.8); opacity: 0.4; }
          75% { transform: translateY(-40px) translateX(8px) scale(1.1); opacity: 0.5; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.25; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.6; transform: scale(1.5) rotate(90deg); }
          50% { opacity: 0.4; transform: scale(0.7) rotate(180deg); }
          75% { opacity: 0.7; transform: scale(1.4) rotate(270deg); }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }

        .animate-pulse-dot {
          animation: pulse-dot 3s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 3s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .animate-bounce {
          animation: bounce 5s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default WorkerPanelHero;