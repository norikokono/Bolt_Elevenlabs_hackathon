import React from 'react';
import { Settings, Volume2, Sliders } from 'lucide-react';

interface VoiceSettingsButtonProps {
  onClick: () => void;
  hasVoice: boolean;
  className?: string;
}

export const VoiceSettingsButton: React.FC<VoiceSettingsButtonProps> = ({
  onClick,
  hasVoice,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center space-x-2 px-4 py-2 
        bg-gradient-to-r from-purple-600/20 to-blue-600/20 
        hover:from-purple-600/30 hover:to-blue-600/30
        border border-purple-500/30 hover:border-purple-500/50
        rounded-xl text-white text-sm font-medium 
        transition-all duration-200 hover:scale-105 
        backdrop-blur-sm
        ${className}
      `}
    >
      <div className="relative">
        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        {hasVoice && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>
      <span className="hidden sm:inline">Voice Settings</span>
      <span className="sm:hidden">Settings</span>
      <Sliders className="w-3 h-3 opacity-60" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Customize voice settings
      </div>
    </button>
  );
};