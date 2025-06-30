import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Settings, AlertCircle, ExternalLink, Trophy, Sparkles, Zap, Award, Info, Globe, Star, Menu, X } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { ConversationHistory } from './components/ConversationHistory';
import { VoiceButton } from './components/VoiceButton';
import { VoiceSettingsPanel } from './components/VoiceSettingsPanel';
import { QuickVoiceSettings } from './components/QuickVoiceSettings';
import { VoiceSettingsButton } from './components/VoiceSettingsButton';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AdvancedFeatures } from './components/AdvancedFeatures';
import { ElevenLabsShowcase } from './components/ElevenLabsShowcase';
import { FloatingActionButton } from './components/FloatingActionButton';
import { ESLTipsModal } from './components/ESLTipsModal';
import { TextInputPanel } from './components/TextInputPanel';
import { SpeechRecognitionService } from './utils/speechRecognition';
import { ElevenLabsService } from './utils/elevenLabsService';
import { AIService } from './utils/aiService';
import { Message, VoiceSettings, ConversationState } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>({
    isListening: false,
    isProcessing: false,
    isPlaying: false,
    currentTranscript: '',
  });
  const [settings, setSettings] = useState<VoiceSettings>({
    selectedVoice: '',
    speed: 1,
    stability: 0.5,
    similarity: 0.75,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showApiModal, setShowApiModal] = useState(true);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [showESLTips, setShowESLTips] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string>('');
  const [speechError, setSpeechError] = useState<string>('');
  const [speechInfo, setSpeechInfo] = useState<string>('');
  const [audioError, setAudioError] = useState<string>('');
  const [voices, setVoices] = useState<Array<{ voice_id: string; name: string }>>([]);
  const [speechService] = useState(() => new SpeechRecognitionService());
  const [elevenLabsService, setElevenLabsService] = useState<ElevenLabsService | null>(null);
  const [aiService] = useState(() => new AIService());
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Ref for the conversation area
  const conversationRef = useRef<HTMLDivElement>(null);

  // Check for API keys on component mount
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (envApiKey && envApiKey.trim() && envApiKey !== 'your_api_key_here') {
      console.log('🔑 Found ElevenLabs API key in environment, auto-connecting...');
      setupElevenLabs(envApiKey.trim());
    }

    // Initialize ESL optimizations
    speechService.enableESLOptimizations(true);
    speechService.setConfidenceThreshold(0.5); // Lower threshold for ESL users
    speechService.setAutoStopDelay(7000); // Longer delay for ESL users

    // Mobile-specific initialization
    if (speechService.isMobileDevice()) {
      console.log('📱 Mobile device detected - optimizing for mobile use');
      speechService.setAutoStopDelay(5000); // Shorter delay on mobile to save battery
    }
  }, []);

  // Function to scroll to conversation area
  const scrollToConversation = useCallback(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const setupElevenLabs = useCallback(async (apiKey: string) => {
    setApiKeyError('');
    
    try {
      console.log('🚀 Initializing ElevenLabs service...');
      const service = new ElevenLabsService(apiKey);
      setElevenLabsService(service);
      
      const result = await service.getVoices();
      
      if (result.error) {
        if (result.status === 401) {
          setApiKeyError('🔐 Invalid API key. Please check your ElevenLabs API key and try again.');
        } else if (result.status === 429) {
          setApiKeyError('⏱️ Rate limit exceeded. Please try again later.');
        } else if (result.status >= 500) {
          setApiKeyError('🌐 ElevenLabs service is temporarily unavailable. Please try again later.');
        } else {
          setApiKeyError(`❌ Failed to connect to ElevenLabs: ${result.error}`);
        }
        return;
      }
      
      const availableVoices = result.voices || [];
      setVoices(availableVoices);
      
      if (availableVoices.length === 0) {
        setApiKeyError('🎤 No voices available. Please check your ElevenLabs account or try a different API key.');
        return;
      }
      
      if (availableVoices.length > 0) {
        setSettings(prev => ({
          ...prev,
          selectedVoice: availableVoices[0].voice_id,
        }));
      }
      
      console.log('✅ ElevenLabs service connected successfully!');
      setShowApiModal(false);
    } catch (error) {
      console.error('💥 Error setting up ElevenLabs:', error);
      setApiKeyError('🌐 Failed to connect to ElevenLabs. Please check your internet connection and try again.');
    }
  }, []);

  const addMessage = useCallback((text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      isUser,
      timestamp: new Date(),
      isPlaying: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const playAudio = useCallback(async (messageId: string, text: string) => {
    if (!elevenLabsService || !settings.selectedVoice) {
      console.log('🔇 No ElevenLabs service or voice selected, skipping audio playback');
      return;
    }

    try {
      console.log('🎵 Starting audio playback...');
      
      // Clear any previous audio errors
      setAudioError('');
      
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setMessages(prev => prev.map(msg => ({
        ...msg,
        isPlaying: msg.id === messageId
      })));

      setConversationState(prev => ({ ...prev, isPlaying: true }));

      // Get speech-friendly version of the text (without emojis)
      const speechText = aiService.getSpeechFriendlyResponse(text);
      console.log('🎤 Converting to speech:', speechText);

      const audioBuffer = await elevenLabsService.generateSpeech(
        speechText,
        settings.selectedVoice,
        { stability: settings.stability, similarity: settings.similarity }
      );

      if (audioBuffer) {
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        setCurrentAudio(audio);
        
        audio.onended = () => {
          console.log('🎵 Audio playback completed');
          setMessages(prev => prev.map(msg => ({
            ...msg,
            isPlaying: false
          })));
          setConversationState(prev => ({ ...prev, isPlaying: false }));
          URL.revokeObjectURL(audioUrl);
          setCurrentAudio(null);
        };
        
        audio.onerror = () => {
          console.error('🔊 Audio playback error');
          setConversationState(prev => ({ ...prev, isPlaying: false }));
          setAudioError('Failed to play audio. Please try again.');
        };
        
        await audio.play();
        console.log('🎤 Audio playing successfully');
      }
    } catch (error) {
      console.error('💥 Error playing audio:', error);
      setMessages(prev => prev.map(msg => ({
        ...msg,
        isPlaying: false
      })));
      setConversationState(prev => ({ ...prev, isPlaying: false }));
      
      // Set user-friendly error message
      if (error instanceof Error) {
        setAudioError(error.message);
      } else {
        setAudioError('Failed to generate speech. Please check your API key and try again.');
      }
    }
  }, [elevenLabsService, settings, currentAudio, aiService]);

  const stopAudio = useCallback((messageId: string) => {
    console.log('⏹️ Stopping audio playback');
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setMessages(prev => prev.map(msg => ({
      ...msg,
      isPlaying: false
    })));
    setConversationState(prev => ({ ...prev, isPlaying: false }));
  }, [currentAudio]);

  const handleTestVoice = useCallback(async (text: string) => {
    if (!elevenLabsService || !settings.selectedVoice) return;
    
    const testMessageId = 'test-voice-' + Date.now();
    await playAudio(testMessageId, text);
  }, [elevenLabsService, settings.selectedVoice, playAudio]);

  const handleProcessMessage = useCallback(async (text: string) => {
    console.log('🧠 Processing message:', text);
    
    if (!text.trim()) {
      console.log('⚠️ Empty message, skipping');
      return;
    }

    setConversationState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      console.log('👤 Adding user message');
      addMessage(text, true);
      
      console.log('🤖 Generating AI response');
      const response = await aiService.generateResponse(text);
      console.log('✅ AI response generated:', response.substring(0, 100) + '...');
      
      const messageId = addMessage(response, false);
      console.log('📝 Added AI message with ID:', messageId);
      
      // Auto-play AI response if ElevenLabs is available
      if (elevenLabsService && settings.selectedVoice) {
        console.log('🎵 Initiating audio response');
        setTimeout(() => {
          playAudio(messageId, response);
        }, 300);
      } else {
        console.log('🔇 No ElevenLabs service available, skipping audio');
      }
      
    } catch (error) {
      console.error('💥 Error processing message:', error);
      addMessage('I apologize, but I encountered an error processing your message. Please try again.', false);
    }
    
    setConversationState(prev => ({ ...prev, isProcessing: false }));
  }, [addMessage, aiService, playAudio, elevenLabsService, settings.selectedVoice]);

  const handleFixLastMessage = useCallback(async (newMessage: string) => {
    console.log('🔧 Fixing last message:', newMessage);
    
    // Remove the last user message and AI response
    setMessages(prev => {
      const newMessages = [...prev];
      // Remove last AI response if it exists
      if (newMessages.length > 0 && !newMessages[newMessages.length - 1].isUser) {
        newMessages.pop();
      }
      // Remove last user message
      if (newMessages.length > 0 && newMessages[newMessages.length - 1].isUser) {
        newMessages.pop();
      }
      return newMessages;
    });
    
    // Process the corrected message
    await handleProcessMessage(newMessage);
  }, [handleProcessMessage]);

  const handleEraseLastMessage = useCallback(() => {
    console.log('🗑️ Erasing last message');
    
    setMessages(prev => {
      const newMessages = [...prev];
      // Remove last AI response if it exists
      if (newMessages.length > 0 && !newMessages[newMessages.length - 1].isUser) {
        newMessages.pop();
      }
      // Remove last user message
      if (newMessages.length > 0 && newMessages[newMessages.length - 1].isUser) {
        newMessages.pop();
      }
      return newMessages;
    });
  }, []);

  const getLastUserMessage = useCallback(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].isUser) {
        return messages[i].text;
      }
    }
    return undefined;
  }, [messages]);

  const handleStartListening = useCallback(async () => {
    if (!speechService.isSupported()) {
      setSpeechError('🎤 Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for the best experience.');
      return;
    }

    // Mobile-specific permission handling
    if (speechService.isMobileDevice()) {
      if (!speechService.hasUserInteracted()) {
        setSpeechError('📱 Please tap the microphone button to enable voice recognition on mobile devices.');
        return;
      }

      // Try to request microphone permissions explicitly on mobile
      try {
        const hasPermission = await speechService.requestMobilePermissions();
        if (!hasPermission) {
          setSpeechError('🔒 Microphone permission is required. Please allow microphone access and try again.');
          return;
        }
      } catch (error) {
        console.error('Mobile permission error:', error);
      }
    }

    console.log('🎙️ Initiating mobile-optimized speech recognition...');
    setSpeechError('');
    setSpeechInfo('');
    setConversationState(prev => ({ ...prev, isListening: true, currentTranscript: '' }));
    
    speechService.start(
      (transcript) => {
        console.log('📝 Interim transcript:', transcript);
        setConversationState(prev => ({ ...prev, currentTranscript: transcript }));
      },
      (finalTranscript) => {
        console.log('✅ Mobile-optimized speech recognition completed with final transcript:', finalTranscript);
        
        setConversationState(prev => ({ 
          ...prev, 
          isListening: false, 
          currentTranscript: '' 
        }));
        
        if (finalTranscript && finalTranscript.trim()) {
          console.log('🚀 Processing final transcript:', finalTranscript);
          handleProcessMessage(finalTranscript.trim());
        } else {
          console.log('⚠️ No final transcript to process');
        }
      },
      (error) => {
        console.error('❌ Mobile speech recognition error:', error);
        
        // Clear both error and info states first
        setSpeechError('');
        setSpeechInfo('');
        
        // Mobile-specific error handling
        switch (error) {
          case 'no-speech':
          case 'no-speech-detected':
            setSpeechInfo('🤫 No speech was detected. Please try speaking again, and make sure your microphone is working. The system is optimized for all accents!');
            break;
          case 'not-allowed':
          case 'microphone-permission-denied':
            setSpeechError('🔐 Microphone access was denied. Please allow microphone access in your browser settings and try again.');
            break;
          case 'mobile-permission-denied':
            setSpeechError('📱 Microphone permission denied. Please tap "Allow" when prompted and try again.');
            break;
          case 'mobile-user-gesture-required':
            setSpeechError('📱 Please tap the microphone button directly to start voice recognition on mobile.');
            break;
          case 'mobile-https-required':
            setSpeechError('🔒 Voice recognition requires a secure connection (HTTPS) on mobile devices.');
            break;
          case 'mobile-service-not-allowed':
            setSpeechError('📱 Voice recognition service is not available. Please check your browser settings and try again.');
            break;
          case 'audio-capture':
          case 'microphone-unavailable':
            setSpeechError('🎤 No microphone was found. Please check your microphone connection and try again.');
            break;
          case 'network':
          case 'network-error':
            setSpeechError('🌐 Network error occurred. Please check your internet connection and try again.');
            break;
          case 'not-supported':
            setSpeechError('🚫 Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
            break;
          case 'mobile-initialization-failed':
            setSpeechError('📱 Failed to start voice recognition on mobile. Please try again or refresh the page.');
            break;
          default:
            setSpeechError('⚠️ Speech recognition encountered an issue. Please try again.');
        }
        
        setConversationState(prev => ({ 
          ...prev, 
          isListening: false, 
          currentTranscript: '' 
        }));
      }
    );
  }, [speechService, handleProcessMessage]);

  const handleStopListening = useCallback(() => {
    console.log('⏹️ Stopping mobile-optimized speech recognition...');
    speechService.stop();
    setConversationState(prev => ({ ...prev, isListening: false }));
  }, [speechService]);

  // Check if we have valid API keys
  const envApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const hasValidApiKey = envApiKey && envApiKey.trim() && envApiKey !== 'your_api_key_here';

  if (showApiModal && !hasValidApiKey) {
    return <ApiKeyModal isOpen={true} onSubmit={setupElevenLabs} error={apiKeyError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* White Bolt Logo - Top Right Corner - Fully Responsive with Enhanced Animations */}
      <div className="fixed top-1 right-1 xs:top-2 xs:right-2 sm:top-4 sm:right-4 z-50">
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="block group relative"
        >
          {/* Animated background glow - Responsive */}
          <div className="absolute -inset-1 xs:-inset-2 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg animate-pulse"></div>
          
          {/* Sparkle effects - Responsive positioning */}
          <div className="absolute -top-0.5 -right-0.5 xs:-top-1 xs:-right-1 w-1.5 h-1.5 xs:w-2 xs:h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
          <div className="absolute -bottom-0.5 -left-0.5 xs:-bottom-1 xs:-left-1 w-1 h-1 xs:w-1.5 xs:h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Main logo with enhanced animations - Fully responsive */}
          <img
            src="/images/white_circle_360x360.png"
            alt="Powered by Bolt.new"
            className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full shadow-lg relative z-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-2xl group-hover:shadow-purple-500/30 animate-float-gentle"
          />
          
          {/* Rotating ring - Responsive */}
          <div className="absolute inset-0 border border-purple-400/30 xs:border-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin-slow"></div>
          
          {/* Pulsing outer ring - Responsive */}
          <div className="absolute -inset-0.5 xs:-inset-1 border border-blue-300/20 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
        </a>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Responsive Navigation Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/40 via-gray-800/60 to-gray-900/40 backdrop-blur-xl">
        {/* Subtle top border with gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Side - Brand Identity */}
            <div className="flex items-center space-x-3">
              {/* Animated Brand Icon */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <button
                  onClick={scrollToConversation}
                  className="relative w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <Zap className="w-5 h-5 text-white" />
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </button>
              </div>
              
              {/* Brand Text - Responsive */}
              <div className="space-y-0.5">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Voice AI Assistant
                </h1>
                <p className="text-xs text-gray-300 font-medium hidden sm:block">Advanced speech recognition with AI responses</p>
              </div>
            </div>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Voice Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 group-hover:scale-105">
                  <div className="relative w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md flex items-center justify-center">
                    <Settings className="w-3 h-3 text-white group-hover:rotate-90 transition-transform duration-300" />
                    {settings.selectedVoice && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white leading-tight">
                      Voice Settings
                    </div>
                    <div className="text-xs text-gray-400">
                      {settings.selectedVoice ? 'Connected' : 'Configure'}
                    </div>
                  </div>
                </div>
              </button>

              {/* Features Button */}
              <button
                onClick={() => setShowAdvancedFeatures(true)}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 group-hover:scale-105">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">Features</div>
                    <div className="text-xs text-gray-400">Highlights</div>
                  </div>
                </div>
              </button>

              {/* ESL Tips Button */}
              <button
                onClick={() => setShowESLTips(true)}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 group-hover:scale-105">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md flex items-center justify-center">
                    <Globe className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">
                      ESL Tips
                    </div>
                    <div className="text-xs text-gray-400">
                      All accents
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile Menu Button - Visible on mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="relative p-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Collapsible */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700/50 pt-4 animate-fade-in-down">
              <div className="space-y-3">
                {/* Voice Settings */}
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300"
                >
                  <div className="relative w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                    {settings.selectedVoice && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">Voice Settings</div>
                    <div className="text-xs text-gray-400">
                      {settings.selectedVoice ? 'Connected' : 'Configure voice options'}
                    </div>
                  </div>
                </button>

                {/* Features */}
                <button
                  onClick={() => {
                    setShowAdvancedFeatures(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">Features</div>
                    <div className="text-xs text-gray-400">Project highlights</div>
                  </div>
                </button>

                {/* ESL Tips */}
                <button
                  onClick={() => {
                    setShowESLTips(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">ESL Tips</div>
                    <div className="text-xs text-gray-400">Optimized for all accents</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Subtle bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col relative z-10">
        {/* ElevenLabs Showcase */}
        <div className="p-4">
          <ElevenLabsShowcase />
        </div>

        {/* Quick Voice Settings */}
        <div className="px-4 pb-2">
          <QuickVoiceSettings
            settings={settings}
            onSettingsChange={setSettings}
            voices={voices}
            onOpenFullSettings={() => setShowSettings(true)}
          />
        </div>

        {/* Conversation History with ref */}
        <div ref={conversationRef}>
          <ConversationHistory
            messages={messages}
            onPlayAudio={(messageId) => {
              const message = messages.find(m => m.id === messageId);
              if (message) playAudio(messageId, message.text);
            }}
            onStopAudio={stopAudio}
            isListening={conversationState.isListening}
            isProcessing={conversationState.isProcessing}
            isPlaying={conversationState.isPlaying}
          />
        </div>
        
        {/* Enhanced Voice Controls */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
          <div className="flex justify-center">
            <VoiceButton
              isListening={conversationState.isListening}
              isProcessing={conversationState.isProcessing}
              isPlaying={conversationState.isPlaying}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
            />
          </div>
          
          {/* Enhanced Status Display */}
          {conversationState.currentTranscript && (
            <div className="mt-6 text-center">
              <div className="inline-block bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/40 rounded-2xl px-6 py-3 backdrop-blur-sm">
                <p className="text-sm text-purple-200 font-medium">
                  🎤 "{conversationState.currentTranscript}"
                </p>
              </div>
            </div>
          )}
          
          {/* Enhanced Error Display */}
          {speechError && (
            <div className="mt-6 flex items-center justify-center space-x-3 text-red-300 bg-red-900/20 border border-red-800/30 rounded-2xl p-4 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-center font-medium">{speechError}</p>
            </div>
          )}

          {/* Enhanced Info Display */}
          {speechInfo && (
            <div className="mt-6 flex items-center justify-center space-x-3 text-blue-300 bg-blue-900/20 border border-blue-800/30 rounded-2xl p-4 backdrop-blur-sm">
              <Info className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-center font-medium">{speechInfo}</p>
            </div>
          )}

          {/* Audio Error Display */}
          {audioError && (
            <div className="mt-6 flex items-center justify-center space-x-3 text-orange-300 bg-orange-900/20 border border-orange-800/30 rounded-2xl p-4 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-center font-medium">{audioError}</p>
            </div>
          )}

          {/* Mobile-specific tips */}
          {speechService.isMobileDevice() && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-500/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                <p className="text-xs text-blue-200">
                  📱 Mobile optimized • Tap microphone directly • Allow permissions when prompted
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Text Input Panel with Fix/Erase Feature */}
        <TextInputPanel
          onSendMessage={handleProcessMessage}
          onStartVoice={handleStartListening}
          isProcessing={conversationState.isProcessing}
          isListening={conversationState.isListening}
          isPlaying={conversationState.isPlaying}
          lastUserMessage={getLastUserMessage()}
          onFixLastMessage={handleFixLastMessage}
          onEraseLastMessage={handleEraseLastMessage}
        />

        {/* Footer with Proper Layout - Fixed */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50 bg-gray-900/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Built with Bolt.new - Left Side */}
            <a
              href="https://bolt.new/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-200 group"
            >
              <img
                src="/images/black_circle_360x360.png"
                alt="Built with Bolt.new"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="text-xs sm:text-sm text-gray-300 font-medium group-hover:text-white transition-colors duration-200">Built with Bolt.new</span>
            </a>

            {/* ElevenLabs Logo - Right Side - Now Clickable */}
            <a
              href="https://elevenlabs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img
                src="/images/elevenlabs-logo-white.png"
                alt="Powered by ElevenLabs"
                className="w-32 sm:w-40 md:w-48 h-auto opacity-90 hover:opacity-100 transition-all duration-200 hover:scale-105 group-hover:brightness-110"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onSettingsClick={() => setShowSettings(true)}
        onThemeClick={() => {/* Theme functionality can be added later */}}
        onVolumeClick={() => {/* Volume controls can be added later */}}
      />

      {/* Enhanced Voice Settings Panel */}
      <VoiceSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
        voices={voices}
        onTestVoice={handleTestVoice}
        isPlaying={conversationState.isPlaying}
      />

      {/* Advanced Features Modal */}
      <AdvancedFeatures
        isOpen={showAdvancedFeatures}
        onClose={() => setShowAdvancedFeatures(false)}
      />

      {/* ESL Tips Modal */}
      <ESLTipsModal
        isOpen={showESLTips}
        onClose={() => setShowESLTips(false)}
      />
    </div>
  );
}

export default App;