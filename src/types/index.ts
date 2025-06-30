export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isPlaying?: boolean;
}

export interface VoiceSettings {
  selectedVoice: string;
  speed: number;
  stability: number;
  similarity: number;
}

export interface ConversationState {
  isListening: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  currentTranscript: string;
}

export interface PerformanceMetrics {
  responseTime: number;
  accuracy: number;
  uptime: number;
  satisfaction: number;
}

export interface AIPersonality {
  enthusiasm: number;
  helpfulness: number;
  creativity: number;
  technical_depth: number;
  humor: number;
}