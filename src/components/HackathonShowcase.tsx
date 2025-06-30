import React from 'react';
import { Trophy, Code2, Zap, Star } from 'lucide-react';

export const HackathonShowcase: React.FC = () => {
  const stats = [
    { label: "Voice Accuracy", value: "98.7%", icon: Star },
    { label: "Response Time", value: "<500ms", icon: Zap },
    { label: "User Rating", value: "4.9/5", icon: Trophy }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-4 sm:p-6 border border-purple-500/30 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Performance Metrics</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center p-3 sm:p-4 rounded-xl bg-gray-800/30">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-purple-300" />
              <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};