import React from 'react';
import { Activity, Clock, Zap, Users } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface StatusCardProps {
  isListening: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  messageCount: number;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  isListening,
  isProcessing,
  isPlaying,
  messageCount,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const getStatus = () => {
    if (isListening) return { text: 'Listening', color: 'text-red-400', icon: Activity };
    if (isProcessing) return { text: 'Processing', color: 'text-yellow-400', icon: Zap };
    if (isPlaying) return { text: 'Speaking', color: 'text-green-400', icon: Activity };
    return { text: 'Ready', color: 'text-purple-400', icon: Clock };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div 
      ref={elementRef}
      className={`
        bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50
        ${isVisible ? 'animate-fade-in-right' : 'scroll-hidden-right'}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">{messageCount}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-600'
          }`} />
          <span className="text-gray-500">Listen</span>
        </div>
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
            isProcessing ? 'bg-yellow-500 animate-bounce' : 'bg-gray-600'
          }`} />
          <span className="text-gray-500">Think</span>
        </div>
        <div className="text-center">
          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
            isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
          }`} />
          <span className="text-gray-500">Speak</span>
        </div>
      </div>
    </div>
  );
};