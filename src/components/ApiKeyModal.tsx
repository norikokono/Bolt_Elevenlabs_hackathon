import React, { useState } from 'react';
import { Key, AlertCircle, ExternalLink, Lightbulb, CheckCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSubmit: (apiKey: string) => void;
  error?: string;
}

export function ApiKeyModal({ isOpen, onSubmit, error }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsSubmitting(true);
    await onSubmit(apiKey.trim());
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Connect ElevenLabs</h2>
            <p className="text-sm text-gray-400">Let's get your voice AI up and running!</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-300 font-medium">Quick Setup Tip</p>
              <p className="text-xs text-blue-200 mt-1">
                You can also add your API key to the <code className="bg-gray-800 px-1 rounded text-xs">.env</code> file as <code className="bg-gray-800 px-1 rounded text-xs">VITE_ELEVENLABS_API_KEY</code> for automatic connection.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              ElevenLabs API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your API key starts with "sk-" and is completely secure
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-300 font-medium">How to get your API key:</p>
            </div>
            <div className="text-xs text-gray-400 space-y-1 ml-6">
              <p>1. Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">elevenlabs.io <ExternalLink className="w-3 h-3" /></a> and sign up</p>
              <p>2. Go to your Profile → API Keys</p>
              <p>3. Create a new API key or copy your existing one</p>
              <p>4. Paste it here and start talking to AI!</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!apiKey.trim() || isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              'Connect & Start Talking! 🎤'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Don't have an account? ElevenLabs offers a generous free tier to get started!
          </p>
        </div>
      </div>
    </div>
  );
}