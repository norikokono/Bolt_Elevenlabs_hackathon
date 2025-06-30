import React, { useState, useEffect } from 'react';
import { User, Bot, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onPlayAudio?: (messageId: string) => void;
  onStopAudio?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onPlayAudio,
  onStopAudio,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAudioToggle = () => {
    if (message.isPlaying) {
      onStopAudio?.(message.id);
    } else {
      onPlayAudio?.(message.id);
    }
  };

  // Simple text rendering for voice-friendly content
  const renderVoiceFriendlyText = (text: string) => {
    // Just render the text naturally without complex formatting
    // Split by paragraphs for better readability
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    if (paragraphs.length <= 1) {
      return <span className="leading-relaxed">{text}</span>;
    }
    
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph.trim()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`flex items-start space-x-3 transition-all duration-500 ${
        message.isUser ? 'flex-row-reverse space-x-reverse' : ''
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden
        transition-all duration-300 hover:scale-110
        ${message.isUser 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30' 
          : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30'
        }
      `}>
        {message.isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
        
        {/* Animated ring for AI messages */}
        {!message.isUser && (
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-0 animate-pulse group-hover:opacity-30 transition-opacity duration-300"></div>
        )}
        
        {/* Sparkle effect on hover */}
        {isHovered && (
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        )}
      </div>
      
      {/* Enhanced Message Bubble */}
      <div className={`
        max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative group transition-all duration-300
        ${message.isUser 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30' 
          : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 shadow-lg shadow-gray-800/20 hover:shadow-gray-700/30'
        }
        hover:scale-[1.02] transform
      `}>
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm"></div>
        
        {/* Message content - Voice-friendly rendering */}
        <div className="text-sm relative z-10">
          {renderVoiceFriendlyText(message.text)}
        </div>
        
        {/* Enhanced Audio Control for AI messages */}
        {!message.isUser && (
          <button
            onClick={handleAudioToggle}
            className={`
              absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center
              transition-all duration-300 transform hover:scale-110
              ${message.isPlaying 
                ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30' 
                : 'bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-600/30'
              }
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
            `}
          >
            {message.isPlaying ? (
              <VolumeX className="w-3 h-3 text-white animate-pulse" />
            ) : (
              <Volume2 className="w-3 h-3 text-gray-300 group-hover:text-white transition-colors duration-200" />
            )}
            
            {/* Audio visualization when playing */}
            {message.isPlaying && (
              <div className="absolute -inset-1 bg-green-500/30 rounded-full animate-pulse"></div>
            )}
          </button>
        )}
        
        {/* Typing indicator for AI messages (when first appearing) */}
        {!message.isUser && !isVisible && (
          <div className="flex space-x-1 mt-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        
        {/* Shimmer effect on hover */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${message.isUser 
            ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' 
            : 'bg-gradient-to-r from-transparent via-gray-300/10 to-transparent'
          }
          animate-shimmer
        `}></div>
      </div>
    </div>
  );
};