import React, { useState } from 'react';
import { Settings, X, Volume2, Mic, Sliders, Play, Pause, RotateCcw } from 'lucide-react';
import { VoiceSettings } from '../types';

interface VoiceSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
  voices: Array<{ voice_id: string; name: string }>;
  onTestVoice?: (text: string) => void;
  isPlaying?: boolean;
}

export const VoiceSettingsPanel: React.FC<VoiceSettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  voices,
  onTestVoice,
  isPlaying = false,
}) => {
  const [testText, setTestText] = useState("Hello! This is a test of the voice synthesis.");

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof VoiceSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const handleTestVoice = () => {
    if (onTestVoice && testText.trim()) {
      onTestVoice(testText.trim());
    }
  };

  const resetToDefaults = () => {
    onSettingsChange({
      selectedVoice: voices.length > 0 ? voices[0].voice_id : '',
      speed: 1,
      stability: 0.5,
      similarity: 0.75,
    });
  };

  const presets = [
    { name: 'Natural', stability: 0.5, similarity: 0.75, speed: 1 },
    { name: 'Expressive', stability: 0.3, similarity: 0.8, speed: 1.1 },
    { name: 'Stable', stability: 0.8, similarity: 0.6, speed: 0.9 },
    { name: 'Dynamic', stability: 0.2, similarity: 0.9, speed: 1.2 },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Voice Settings</h2>
              <p className="text-sm text-gray-400">Customize your AI voice experience</p>
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
          {/* Voice Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Voice Selection</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {voices.map((voice) => (
                <button
                  key={voice.voice_id}
                  onClick={() => handleSettingChange('selectedVoice', voice.voice_id)}
                  className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                    settings.selectedVoice === voice.voice_id
                      ? 'border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-500/10'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-white">{voice.name}</div>
                  <div className="text-xs text-gray-400 mt-1">Voice ID: {voice.voice_id.slice(0, 8)}...</div>
                  {settings.selectedVoice === voice.voice_id && (
                    <div className="mt-2 flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-purple-400">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Test */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Voice Test</h3>
            </div>
            <div className="space-y-3">
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter text to test the voice..."
                className="w-full h-20 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleTestVoice}
                disabled={!testText.trim() || isPlaying}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Playing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Test Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Voice Parameters */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Voice Parameters</h3>
            </div>

            {/* Presets */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Quick Presets</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      handleSettingChange('stability', preset.stability);
                      handleSettingChange('similarity', preset.similarity);
                      handleSettingChange('speed', preset.speed);
                    }}
                    className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:scale-105"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Stability
                </label>
                <span className="text-sm text-purple-400 font-mono bg-purple-900/20 px-2 py-1 rounded">
                  {settings.stability.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.stability}
                  onChange={(e) => handleSettingChange('stability', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>More Variable</span>
                  <span>More Stable</span>
                </div>
              </div>
            </div>
            
            {/* Similarity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Similarity Boost
                </label>
                <span className="text-sm text-blue-400 font-mono bg-blue-900/20 px-2 py-1 rounded">
                  {settings.similarity.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.similarity}
                  onChange={(e) => handleSettingChange('similarity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>More Creative</span>
                  <span>More Similar</span>
                </div>
              </div>
            </div>

            {/* Speed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Speech Speed
                </label>
                <span className="text-sm text-green-400 font-mono bg-green-900/20 px-2 py-1 rounded">
                  {settings.speed.toFixed(2)}x
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.speed}
                  onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-green"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};