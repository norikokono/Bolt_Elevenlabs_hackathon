import React, { useState, useEffect } from 'react';
import { Brain, Zap, Globe, Users, Code, Lightbulb, Target, Award } from 'lucide-react';

interface AdvancedFeaturesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({ isOpen, onClose }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: Brain,
      title: "Conversational AI Integration",
      description: "Natural conversation flow with context awareness and personality-driven responses",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Real-time Voice Processing",
      description: "Live speech recognition with ElevenLabs voice synthesis for natural interaction",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Web-based Voice Interface",
      description: "Browser-native speech recognition with cross-platform compatibility",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Interactive Voice Controls",
      description: "Intuitive voice button with visual feedback and conversation history",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Code,
      title: "Modern React Architecture",
      description: "TypeScript implementation with modular components and clean code structure",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Lightbulb,
      title: "Voice Settings Customization",
      description: "Adjustable voice parameters for stability, similarity, and speech speed",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, features.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Award className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Project Features
              </h2>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-gray-400 text-lg">
              Current capabilities and implementation highlights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;
              
              return (
                <div
                  key={index}
                  className={`
                    relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer
                    ${isActive 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-pink-900/30 scale-105' 
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }
                  `}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                  
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">What This Project Demonstrates</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Modern web development with React & TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>ElevenLabs API integration for voice synthesis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Browser speech recognition implementation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Responsive UI design with Tailwind CSS</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Real-time conversation interface</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Voice parameter customization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Error handling and user feedback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Clean, maintainable code architecture</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};