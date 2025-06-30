import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { VoiceVisualizer } from './VoiceVisualizer';
import { StatusCard } from './StatusCard';
import { Message } from '../types';
import { useScrollAnimation, useStaggeredScrollAnimation } from '../hooks/useScrollAnimation';

interface ConversationHistoryProps {
  messages: Message[];
  onPlayAudio?: (messageId: string) => void;
  onStopAudio?: (messageId: string) => void;
  isListening?: boolean;
  isProcessing?: boolean;
  isPlaying?: boolean;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  messages,
  onPlayAudio,
  onStopAudio,
  isListening = false,
  isProcessing = false,
  isPlaying = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { elementRef: emptyStateRef, isVisible: emptyStateVisible } = useScrollAnimation({ threshold: 0.2 });
  const { containerRef: featuresRef, visibleItems } = useStaggeredScrollAnimation(3, 150);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Status Card */}
      <div className="p-4 pb-2">
        <StatusCard
          isListening={isListening}
          isProcessing={isProcessing}
          isPlaying={isPlaying}
          messageCount={messages.length}
        />
      </div>

      {/* Messages Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div 
              ref={emptyStateRef}
              className={`text-center space-y-6 ${emptyStateVisible ? 'animate-fade-in-up' : 'scroll-hidden'}`}
            >
              {/* Voice Visualizer */}
              <VoiceVisualizer
                isListening={isListening}
                isProcessing={isProcessing}
                isPlaying={isPlaying}
              />
              
              <div className="space-y-3">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">🎤</span>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Start Your Conversation
                </h3>
                <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                  Tap the microphone below to begin speaking with your advanced AI assistant. 
                  Experience natural conversation with premium voice synthesis.
                </p>
                
                {/* Feature highlights with staggered animation */}
                <div 
                  ref={featuresRef}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-md mx-auto"
                >
                  {[
                    { icon: "🧠", title: "Smart", desc: "Context-aware AI" },
                    { icon: "⚡", title: "Fast", desc: "Real-time response" },
                    { icon: "🎵", title: "Natural", desc: "Premium voice" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className={`
                        text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 transition-all duration-500
                        ${visibleItems[index] ? 'animate-scale-in' : 'scroll-hidden-scale'}
                      `}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-purple-400 text-sm font-medium">{feature.icon} {feature.title}</div>
                      <div className="text-xs text-gray-500">{feature.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MessageBubble
                  message={message}
                  onPlayAudio={onPlayAudio}
                  onStopAudio={onStopAudio}
                />
              </div>
            ))}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex justify-center animate-fade-in-up">
                <div className="bg-gray-800/50 rounded-2xl px-4 py-3 flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-yellow-400 font-medium">AI is thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};