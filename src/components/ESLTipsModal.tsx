import React from 'react';
import { Globe, Mic, Clock, Volume2, MessageCircle, CheckCircle, X } from 'lucide-react';

interface ESLTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ESLTipsModal: React.FC<ESLTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tips = [
    {
      icon: Mic,
      title: "Clear Speech",
      description: "Speak clearly and at a moderate pace. The system is designed to understand various accents.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Take Your Time",
      description: "Extended silence detection gives you more time to think and speak naturally.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "Simple Sentences",
      description: "Use direct, simple sentences when possible. Don't worry about perfect grammar.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Volume2,
      title: "Microphone Position",
      description: "Speak closer to your microphone for better recognition quality.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const commonPhrases = [
    "What is artificial intelligence?",
    "How does machine learning work?",
    "Explain neural networks",
    "Tell me about deep learning",
    "Can you help me understand AI?",
    "I want to learn about algorithms"
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">ESL Voice Assistant Tips</h2>
              <p className="text-sm text-gray-400">Optimized for English as a Second Language speakers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* ESL Optimizations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>ESL Optimizations Active</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-gray-700 bg-gray-800/30 hover:bg-gray-700/30 transition-all duration-200"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${tip.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-2">{tip.title}</h4>
                    <p className="text-xs text-gray-400">{tip.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Improvements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Technical Enhancements</h3>
            <div className="bg-gray-800/30 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Lower confidence threshold (50% vs 70%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Extended silence detection (7 seconds)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Pronunciation corrections</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Grammar pattern improvements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Smart alternative selection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Filler word cleanup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Phrases */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Try These Phrases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonPhrases.map((phrase, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                >
                  <p className="text-sm text-gray-300 font-mono">"{phrase}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pronunciation Help */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Pronunciation Support</h3>
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/30">
              <p className="text-sm text-gray-300 mb-3">
                The system automatically corrects common pronunciation variations:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="text-gray-400">TH sounds: "dis" → "this"</div>
                  <div className="text-gray-400">V/W: "wery" → "very"</div>
                  <div className="text-gray-400">L/R: "rearning" → "learning"</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400">Articles: "a artificial" → "an artificial"</div>
                  <div className="text-gray-400">Plurals: "informations" → "information"</div>
                  <div className="text-gray-400">Grammar: "how i can" → "how can i"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              Start Speaking with Confidence!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};