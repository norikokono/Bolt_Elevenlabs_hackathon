import React, { useState, useEffect } from 'react';
import { Volume2, Zap, Star, Sparkles, Waves } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const ElevenLabsShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const features = [
    {
      icon: Volume2,
      title: "Natural Speech",
      description: "Human-like voice synthesis",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-800/20 to-cyan-800/20",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Zap,
      title: "Real-time",
      description: "Instant voice generation",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-800/20 to-pink-800/20",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Star,
      title: "Premium",
      description: "Studio-quality audio",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-800/20 to-emerald-800/20",
      borderColor: "border-green-500/20"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div 
      ref={elementRef}
      className={`
        relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-4 sm:p-6 border border-blue-500/30 mb-6 overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10
        ${isVisible ? 'animate-fade-in-up' : 'scroll-hidden'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Audio Waves */}
      <div className="absolute top-4 right-4 opacity-20">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              height: `${10 + Math.random() * 20}px`,
              left: `${i * 6}px`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Volume2 className={`w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`} />
              <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text">
              Voice Technology
            </h3>
            <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
          </div>
          
          {/* ElevenLabs Logo - Now Clickable */}
          <div className="relative">
            <a
              href="https://elevenlabs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group/logo"
            >
              <img
                src="/images/elevenlabs-logo-white.png"
                alt="Powered by ElevenLabs"
                className="w-24 sm:w-32 h-auto opacity-90 hover:opacity-100 transition-all duration-300 filter hover:brightness-110 group-hover/logo:scale-105"
              />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === activeFeature;
            
            return (
              <div
                key={index}
                className={`relative text-center p-3 sm:p-4 rounded-xl border transition-all duration-700 cursor-pointer group/card overflow-hidden ${
                  isActive 
                    ? `bg-gradient-to-br ${feature.bgGradient} ${feature.borderColor} scale-105 shadow-lg` 
                    : 'bg-gray-800/20 border-gray-500/20 hover:border-gray-400/30'
                }`}
                style={{ 
                  transform: isActive ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                  boxShadow: isActive ? `0 10px 25px ${feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : feature.gradient.includes('purple') ? 'rgba(147, 51, 234, 0.3)' : 'rgba(34, 197, 94, 0.3)'}` : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Animated Background */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-10 animate-pulse rounded-xl`}></div>
                )}
                
                <div className="relative z-10">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 transition-all duration-500 ${
                    isActive ? `bg-gradient-to-r ${feature.gradient} text-white p-1.5 rounded-lg shadow-lg animate-bounce` : ''
                  }`}>
                    <Icon className={`w-full h-full transition-all duration-300 ${
                      isActive ? 'text-white' : `bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`
                    } group-hover/card:scale-110`} />
                  </div>
                  
                  <h4 className={`text-sm sm:text-base font-semibold mb-1 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover/card:text-white'
                  }`}>
                    {feature.title}
                  </h4>
                  
                  <p className={`text-xs transition-all duration-300 ${
                    isActive ? 'text-gray-200' : 'text-gray-400 group-hover/card:text-gray-300'
                  }`}>
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeFeature ? 'bg-blue-400 scale-125' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};