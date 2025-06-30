import React, { useState, useEffect } from 'react';
import { Sparkles, Award, Zap } from 'lucide-react';

export const InnovationBadge: React.FC = () => {
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`
      relative inline-flex items-center space-x-2 px-4 py-2 rounded-full
      bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30
      transition-all duration-1000
      ${isGlowing ? 'shadow-lg shadow-yellow-500/25 scale-105' : ''}
    `}>
      <Award className="w-4 h-4 text-yellow-400" />
      <span className="text-sm font-medium text-yellow-300">Innovation Award Candidate</span>
      <Sparkles className="w-4 h-4 text-yellow-400" />
      
      {isGlowing && (
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-pulse" />
      )}
    </div>
  );
};