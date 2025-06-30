import React from 'react';
import { Mic, MicOff, Loader2, Volume2, Sparkles, Zap, Globe } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isPlaying?: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing,
  isPlaying = false,
  onStartListening,
  onStopListening,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    if (isPlaying) return 'playing';
    return 'idle';
  };

  const buttonState = getButtonState();

  const getButtonStyles = () => {
    switch (buttonState) {
      case 'listening':
        return 'bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 scale-110 shadow-2xl shadow-red-500/30';
      case 'processing':
        return 'bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-500 scale-105 shadow-xl shadow-yellow-500/30';
      case 'playing':
        return 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 scale-105 shadow-xl shadow-green-500/30';
      default:
        return 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 hover:scale-105 shadow-lg hover:shadow-purple-500/30';
    }
  };

  const getIcon = () => {
    if (isProcessing) return <Loader2 className="w-10 h-10 text-white animate-spin" />;
    if (isPlaying) return <Volume2 className="w-10 h-10 text-white animate-pulse" />;
    if (isListening) return <MicOff className="w-10 h-10 text-white animate-bounce" />;
    return <Mic className="w-10 h-10 text-white" />;
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing your message...';
    if (isPlaying) return 'AI is speaking...';
    if (isListening) return 'Listening... (tap to stop)';
    return 'Tap to speak with AI';
  };

  return (
    <div 
      ref={elementRef}
      className={`
        flex flex-col items-center space-y-6
        ${isVisible ? 'animate-slide-up-fade' : 'scroll-hidden'}
      `}
    >
      <div className="relative">
        {/* Main Button */}
        <button
          onClick={handleClick}
          disabled={isProcessing || isPlaying}
          className={`
            relative w-28 h-28 rounded-full transition-all duration-500 transform
            ${getButtonStyles()}
            ${isProcessing || isPlaying ? 'cursor-not-allowed' : 'hover:shadow-2xl cursor-pointer active:scale-95'}
            disabled:transform-none
            group overflow-hidden
          `}
        >
          {/* Glass Effect Overlay */}
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Icon Container */}
          <div className="relative flex items-center justify-center h-full z-10">
            {getIcon()}
          </div>
          
          {/* Sparkle Effects for Idle State */}
          {buttonState === 'idle' && (
            <>
              <Sparkles className="absolute -top-3 -right-3 w-5 h-5 text-purple-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Sparkles className="absolute -bottom-3 -left-3 w-4 h-4 text-blue-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.5s' }} />
              <Zap className="absolute top-2 -left-3 w-3 h-3 text-cyan-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '1s' }} />
            </>
          )}
          
          {/* Animated rings for different states */}
          {isListening && (
            <>
              <div className="absolute -inset-3 rounded-full border-2 border-red-400/60 animate-ping" />
              <div className="absolute -inset-6 rounded-full border border-red-300/40 animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -inset-9 rounded-full border border-red-200/20 animate-ping" style={{ animationDelay: '1s' }} />
            </>
          )}
          
          {isProcessing && (
            <>
              <div className="absolute -inset-4 rounded-full border-2 border-yellow-400/60 animate-spin" />
              <div className="absolute -inset-7 rounded-full border border-orange-300/40 animate-pulse" />
            </>
          )}
          
          {isPlaying && (
            <>
              <div className="absolute -inset-3 rounded-full border-2 border-green-400/60 animate-pulse" />
              <div className="absolute -inset-6 rounded-full border border-emerald-300/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
            </>
          )}

          {/* Hover Effect for Idle State */}
          {buttonState === 'idle' && (
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm animate-pulse"></div>
          )}
        </button>

        {/* Enhanced Status indicator */}
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center shadow-lg">
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
            buttonState === 'listening' ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' :
            buttonState === 'processing' ? 'bg-yellow-500 animate-bounce shadow-lg shadow-yellow-500/50' :
            buttonState === 'playing' ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' :
            'bg-purple-500 group-hover:bg-blue-500 shadow-lg shadow-purple-500/50'
          }`} />
        </div>

        {/* Audio Visualization for Playing State */}
        {isPlaying && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-green-400 rounded-full animate-pulse shadow-sm"
                style={{
                  height: `${12 + Math.random() * 16}px`,
                  left: `${i * 6}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="text-center space-y-3 max-w-xs">
        <p className={`text-base font-semibold transition-all duration-300 ${
          buttonState === 'listening' ? 'text-red-300' :
          buttonState === 'processing' ? 'text-yellow-300' :
          buttonState === 'playing' ? 'text-green-300' :
          'text-gray-300'
        }`}>
          {getStatusText()}
        </p>
        
        {/* Enhanced context based on state */}
        {buttonState === 'idle' && (
          <div className="flex items-center justify-center space-x-2 bg-gray-800/30 rounded-full px-4 py-2 border border-gray-700/50">
            <span className="text-xs text-gray-400">🎤 Advanced speech recognition ready</span>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
        )}
        
        {buttonState === 'listening' && (
          <div className="flex items-center justify-center space-x-2 bg-red-900/20 rounded-full px-4 py-2 border border-red-500/30">
            <span className="text-xs text-red-300 font-medium">🔴 Recording in progress...</span>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-red-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        
        {buttonState === 'processing' && (
          <div className="flex items-center justify-center space-x-2 bg-yellow-900/20 rounded-full px-4 py-2 border border-yellow-500/30">
            <span className="text-xs text-yellow-300 font-medium">🧠 AI is thinking...</span>
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {buttonState === 'playing' && (
          <div className="flex items-center justify-center space-x-2 bg-green-900/20 rounded-full px-4 py-2 border border-green-500/30">
            <span className="text-xs text-green-300 font-medium">🔊 Premium voice synthesis active</span>
            <Volume2 className="w-3 h-3 text-green-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};