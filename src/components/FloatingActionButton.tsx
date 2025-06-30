import React, { useState } from 'react';
import { Settings, Palette, Volume2, VolumeX, Sun, Moon } from 'lucide-react';

interface FloatingActionButtonProps {
  onSettingsClick: () => void;
  onThemeClick?: () => void;
  onVolumeClick?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onSettingsClick,
  onThemeClick,
  onVolumeClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleVolumeClick = () => {
    setIsMuted(!isMuted);
    
    // Toggle global audio muting
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.muted = !isMuted;
    });
    
    // Show feedback
    const message = !isMuted ? 'Audio muted' : 'Audio unmuted';
    showToast(message);
    
    onVolumeClick?.();
    setIsOpen(false);
  };

  const handleThemeClick = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    // Get the root element and body
    const html = document.documentElement;
    const body = document.body;
    const appElement = document.getElementById('root');
    
    if (newTheme) {
      // Dark theme - restore original blueish gradient
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      body.style.backgroundColor = '#111827';
      body.style.color = '#f9fafb';
      
      // Restore original blueish dark theme background
      if (appElement) {
        const mainDiv = appElement.firstElementChild as HTMLElement;
        if (mainDiv) {
          // Original blueish gradient from the design
          mainDiv.style.background = 'linear-gradient(to bottom right, rgb(17, 24, 39), rgb(55, 65, 81), rgb(17, 24, 39))';
          mainDiv.className = mainDiv.className.replace(/bg-\S+/g, '') + ' bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';
        }
      }
    } else {
      // Light theme
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#111827';
      
      // Light theme background
      if (appElement) {
        const mainDiv = appElement.firstElementChild as HTMLElement;
        if (mainDiv) {
          mainDiv.style.background = 'linear-gradient(to bottom right, #f8fafc, #e2e8f0, #f1f5f9)';
          mainDiv.className = mainDiv.className.replace(/bg-\S+/g, '') + ' bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100';
        }
      }
    }
    
    // Show feedback
    const message = newTheme ? 'Dark theme enabled' : 'Light theme enabled';
    showToast(message);
    
    onThemeClick?.();
    setIsOpen(false);
  };

  const showToast = (message: string) => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `
      fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg
      transform transition-all duration-300 translate-x-full opacity-0
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  };

  const actions = [
    { 
      icon: Settings, 
      label: 'Voice Settings', 
      onClick: () => {
        onSettingsClick();
        setIsOpen(false);
      }, 
      color: 'from-purple-500 to-blue-500' 
    },
    { 
      icon: isDarkTheme ? Sun : Moon, 
      label: isDarkTheme ? 'Light Theme' : 'Dark Theme', 
      onClick: handleThemeClick, 
      color: 'from-yellow-500 to-orange-500' 
    },
    { 
      icon: isMuted ? VolumeX : Volume2, 
      label: isMuted ? 'Unmute Audio' : 'Mute Audio', 
      onClick: handleVolumeClick, 
      color: isMuted ? 'from-red-500 to-pink-500' : 'from-green-500 to-emerald-500' 
    },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {/* Action Buttons */}
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-10 h-10 rounded-full bg-gradient-to-r ${action.color} shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center group relative`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className="w-4 h-4 text-white" />
              
              {/* Enhanced Tooltip */}
              <div className="absolute right-12 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none border border-gray-700">
                {action.label}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900/90"></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main FAB with enhanced animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden group ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon with smooth transition */}
        <div className={`transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-45' : ''}`}>
          {isOpen ? (
            <div className="w-5 h-0.5 bg-white relative">
              <div className="w-5 h-0.5 bg-white absolute rotate-90" />
            </div>
          ) : (
            <Settings className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200"></div>
      </button>
    </div>
  );
};