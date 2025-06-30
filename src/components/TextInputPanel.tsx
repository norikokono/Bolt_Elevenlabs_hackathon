import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Type, Sparkles, RotateCcw, X } from 'lucide-react';

interface TextInputPanelProps {
  onSendMessage: (message: string) => void;
  onStartVoice: () => void;
  isProcessing: boolean;
  isListening: boolean;
  isPlaying: boolean;
  lastUserMessage?: string;
  onFixLastMessage?: (newMessage: string) => void;
  onEraseLastMessage?: () => void;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  onSendMessage,
  onStartVoice,
  isProcessing,
  isListening,
  isPlaying,
  lastUserMessage,
  onFixLastMessage,
  onEraseLastMessage,
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFixMode, setIsFixMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      if (isFixMode && onFixLastMessage) {
        onFixLastMessage(message.trim());
        setIsFixMode(false);
      } else {
        onSendMessage(message.trim());
      }
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      handleCancelFix();
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!message.trim() && !isFixMode) {
      setIsExpanded(false);
    }
  };

  const handleFixLastMessage = () => {
    if (lastUserMessage) {
      setMessage(lastUserMessage);
      setIsFixMode(true);
      setIsExpanded(true);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(lastUserMessage.length, lastUserMessage.length);
        }
      }, 100);
    }
  };

  const handleCancelFix = () => {
    setIsFixMode(false);
    setMessage('');
    setIsExpanded(false);
  };

  const handleEraseLastMessage = () => {
    if (onEraseLastMessage) {
      onEraseLastMessage();
    }
  };

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const isDisabled = isProcessing || isListening || isPlaying;
  const showFixControls = lastUserMessage && !isListening && !isProcessing && !isPlaying;

  return (
    <div className="p-4 border-t border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Fix/Erase Controls */}
        {showFixControls && !isFixMode && (
          <div className="flex items-center justify-center space-x-3">
            <div className="text-xs text-gray-400 text-center">
              Last message: "{lastUserMessage.length > 50 ? lastUserMessage.substring(0, 50) + '...' : lastUserMessage}"
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFixLastMessage}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-300 hover:text-blue-200 text-xs font-medium transition-all duration-200 hover:scale-105"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Fix</span>
              </button>
              <button
                onClick={handleEraseLastMessage}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-300 hover:text-red-200 text-xs font-medium transition-all duration-200 hover:scale-105"
              >
                <X className="w-3 h-3" />
                <span>Erase</span>
              </button>
            </div>
          </div>
        )}

        {/* Fix Mode Banner */}
        {isFixMode && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Fix Mode: Edit your last message</span>
              </div>
              <button
                onClick={handleCancelFix}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className={`
            relative transition-all duration-300 ease-out
            ${isExpanded ? 'transform scale-105' : ''}
          `}>
            {/* Input Container */}
            <div className={`
              relative bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm
              border transition-all duration-300
              ${isFixMode 
                ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' 
                : isExpanded 
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' 
                  : 'border-gray-600/50 hover:border-gray-500/50'
              }
              rounded-2xl
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}>
              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={
                  isDisabled 
                    ? "AI is busy..." 
                    : isFixMode 
                      ? "Edit your message and press Enter to resend..."
                      : "Type your message here, or use voice..."
                }
                disabled={isDisabled}
                rows={isExpanded ? 3 : 1}
                className={`
                  w-full bg-transparent text-white placeholder-gray-400 
                  px-4 py-3 pr-24 resize-none outline-none
                  transition-all duration-300
                  ${isExpanded ? 'py-4' : ''}
                `}
                style={{ 
                  minHeight: isExpanded ? '80px' : '48px',
                  maxHeight: '120px'
                }}
              />

              {/* Action Buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {/* Voice Button - Hidden in fix mode */}
                {!isFixMode && (
                  <button
                    type="button"
                    onClick={onStartVoice}
                    disabled={isDisabled}
                    className={`
                      p-2 rounded-xl transition-all duration-200 hover:scale-110
                      ${isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                      }
                      ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                    title="Use voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!message.trim() || isDisabled}
                  className={`
                    p-2 rounded-xl transition-all duration-200 hover:scale-110
                    ${message.trim() && !isDisabled
                      ? isFixMode
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  title={isFixMode ? "Send corrected message" : "Send message"}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Input Mode Indicator */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Type className="w-3 h-3" />
                <span>
                  {isFixMode 
                    ? "Editing your last message - press Escape to cancel"
                    : "Type your message or use voice input"
                  }
                </span>
                {isExpanded && !isFixMode && (
                  <span className="text-purple-400">• Press Enter to send, Shift+Enter for new line</span>
                )}
              </div>
              
              {message.trim() && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Sparkles className={`w-3 h-3 ${isFixMode ? 'text-blue-400' : 'text-purple-400'}`} />
                  <span>{message.length} characters</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};