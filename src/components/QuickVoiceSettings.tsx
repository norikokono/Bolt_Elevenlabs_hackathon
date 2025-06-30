import React, { useState } from 'react';
import { Volume2, Mic, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceSettings } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface QuickVoiceSettingsProps {
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
  voices: Array<{ voice_id: string; name: string }>;
  onOpenFullSettings: () => void;
  className?: string;
}

export const QuickVoiceSettings: React.FC<QuickVoiceSettingsProps> = ({
  settings,
  onSettingsChange,
  voices,
  onOpenFullSettings,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const handleSettingChange = (key: keyof VoiceSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const selectedVoice = voices.find(v => v.voice_id === settings.selectedVoice);

  return (
    <div 
      ref={elementRef}
      className={`
        bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 
        ${isVisible ? 'animate-fade-in-left' : 'scroll-hidden-left'}
        ${className}
      `}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Voice Settings</h3>
            <p className="text-xs text-gray-400">
              {selectedVoice?.name || 'No voice selected'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullSettings();
            }}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-700/50 pt-4 animate-fade-in-up">
          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Voice</label>
            <select
              value={settings.selectedVoice}
              onChange={(e) => handleSettingChange('selectedVoice', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {voices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Sliders */}
          <div className="grid grid-cols-1 gap-3">
            {/* Stability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300">Stability</label>
                <span className="text-xs text-purple-400 font-mono">{settings.stability.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.stability}
                onChange={(e) => handleSettingChange('stability', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-purple-small"
              />
            </div>

            {/* Similarity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300">Similarity</label>
                <span className="text-xs text-blue-400 font-mono">{settings.similarity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.similarity}
                onChange={(e) => handleSettingChange('similarity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-blue-small"
              />
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300">Speed</label>
                <span className="text-xs text-green-400 font-mono">{settings.speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speed}
                onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-green-small"
              />
            </div>
          </div>

          <button
            onClick={onOpenFullSettings}
            className="w-full py-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded-lg transition-all duration-200"
          >
            Open Advanced Settings
          </button>
        </div>
      )}
    </div>
  );
};