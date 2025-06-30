import React, { useEffect, useState } from 'react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isProcessing,
  isPlaying,
}) => {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    if (isListening || isPlaying) {
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 100 + 20));
      }, 150);
      return () => clearInterval(interval);
    } else {
      setBars(Array(12).fill(20));
    }
  }, [isListening, isPlaying]);

  const getBarColor = () => {
    if (isListening) return 'bg-gradient-to-t from-red-500 to-pink-400';
    if (isProcessing) return 'bg-gradient-to-t from-yellow-500 to-orange-400';
    if (isPlaying) return 'bg-gradient-to-t from-green-500 to-emerald-400';
    return 'bg-gradient-to-t from-purple-500 to-blue-400';
  };

  return (
    <div className="flex items-end justify-center space-x-1 h-16 mb-4">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-2 rounded-full transition-all duration-150 ${getBarColor()}`}
          style={{
            height: `${height}%`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};