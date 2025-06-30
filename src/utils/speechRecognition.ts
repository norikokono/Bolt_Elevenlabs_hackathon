export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private onResult: (transcript: string) => void = () => {};
  private onEnd: (finalTranscript: string) => void = () => {};
  private onError: (error: string) => void = () => {};
  private finalTranscript: string = '';
  private interimTranscript: string = '';
  private isListening: boolean = false;
  private hasReceivedSpeech: boolean = false;
  private confidenceThreshold: number = 0.5; // Lowered from 0.7 for ESL users
  private speechStartTime: number = 0;
  private silenceTimer: NodeJS.Timeout | null = null;
  private autoStopDelay: number = 7000; // Increased from 5000ms to 7000ms for ESL users
  private eslOptimizations: boolean = true;
  private languageCode: string = 'en-US';
  private alternativeLanguages: string[] = [];
  private isMobile: boolean = false;
  private hasUserGesture: boolean = false;

  constructor() {
    this.isMobile = this.detectMobile();
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.setupRecognition();
    }

    // Set up user gesture detection for mobile
    if (this.isMobile) {
      this.setupUserGestureDetection();
    }
  }

  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
  }

  private setupUserGestureDetection(): void {
    // Track user gestures to ensure microphone access is allowed
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    
    const handleUserGesture = () => {
      this.hasUserGesture = true;
      console.log('📱 User gesture detected - microphone access should be allowed');
      
      // Remove listeners after first gesture
      events.forEach(event => {
        document.removeEventListener(event, handleUserGesture, true);
      });
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserGesture, true);
    });
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    // Enhanced settings optimized for mobile and ESL users
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.languageCode;
    this.recognition.maxAlternatives = this.isMobile ? 3 : 5; // Fewer alternatives on mobile for performance
    
    // Mobile-specific optimizations
    if (this.isMobile) {
      // Shorter timeout for mobile to prevent battery drain
      this.autoStopDelay = 5000;
      
      // Try to set mobile-friendly properties
      try {
        (this.recognition as any).serviceURI = undefined; // Use default service on mobile
        (this.recognition as any).grammars = null;
      } catch (e) {
        // Silently fail if not supported
      }
    }
    
    // ESL-specific optimizations
    if (this.eslOptimizations) {
      try {
        if (!this.isMobile) {
          (this.recognition as any).serviceURI = 'wss://www.google.com/speech-api/v2/recognize';
        }
        (this.recognition as any).grammars = null; // Allow more flexible grammar
      } catch (e) {
        // Silently fail if not supported
      }
    }
    
    this.recognition.onresult = (event) => {
      this.handleResults(event);
    };
    
    this.recognition.onend = () => {
      this.handleEnd();
    };
    
    this.recognition.onerror = (event) => {
      this.handleError(event);
    };
    
    this.recognition.onstart = () => {
      this.handleStart();
    };

    this.recognition.onspeechstart = () => {
      this.handleSpeechStart();
    };

    this.recognition.onspeechend = () => {
      this.handleSpeechEnd();
    };

    this.recognition.onaudiostart = () => {
      console.log('🎤 Audio capture started (mobile-optimized)');
    };

    this.recognition.onsoundstart = () => {
      console.log('🔊 Sound detected (mobile-friendly processing)');
    };

    this.recognition.onaudioend = () => {
      console.log('🎤 Audio capture ended');
    };

    this.recognition.onnomatch = () => {
      console.log('🤷 No speech match found');
    };
  }

  private handleResults(event: SpeechRecognitionEvent): void {
    let interimTranscript = '';
    let finalTranscript = '';
    let bestConfidence = 0;
    let allAlternatives: string[] = [];
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      
      // Collect all alternatives for ESL processing
      for (let j = 0; j < result.length; j++) {
        const alternative = result[j];
        allAlternatives.push(alternative.transcript);
      }
      
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 1;
      
      if (result.isFinal) {
        // ESL-specific processing: Use lower confidence threshold and smart alternative selection
        const processedTranscript = this.processESLTranscript(transcript, allAlternatives, confidence);
        
        if (confidence >= this.confidenceThreshold || this.eslOptimizations) {
          finalTranscript += processedTranscript;
          bestConfidence = Math.max(bestConfidence, confidence);
        }
      } else {
        // For interim results, also apply ESL processing
        interimTranscript += this.processESLTranscript(transcript, [transcript], confidence);
      }
    }
    
    // Update stored transcripts
    if (finalTranscript) {
      this.finalTranscript += finalTranscript;
      this.hasReceivedSpeech = true;
      console.log(`✅ Mobile-optimized final transcript (confidence: ${bestConfidence.toFixed(2)}):`, finalTranscript);
    }
    
    this.interimTranscript = interimTranscript;
    
    // Show real-time transcript with mobile-friendly processing
    const displayTranscript = (this.finalTranscript + interimTranscript).trim();
    if (displayTranscript) {
      this.onResult(displayTranscript);
      this.hasReceivedSpeech = true;
      this.resetSilenceTimer();
    }
  }

  private processESLTranscript(transcript: string, alternatives: string[], confidence: number): string {
    if (!this.eslOptimizations) {
      return transcript;
    }

    let processedTranscript = transcript;

    // 1. Common ESL pronunciation corrections
    processedTranscript = this.applyESLPronunciationCorrections(processedTranscript);

    // 2. Grammar pattern improvements for ESL speakers
    processedTranscript = this.applyESLGrammarCorrections(processedTranscript);

    // 3. Smart alternative selection for low confidence
    if (confidence < 0.7 && alternatives.length > 1) {
      processedTranscript = this.selectBestESLAlternative(alternatives);
    }

    // 4. Remove excessive filler words that ESL speakers might use
    processedTranscript = this.cleanESLFillers(processedTranscript);

    return processedTranscript;
  }

  private applyESLPronunciationCorrections(transcript: string): string {
    // Common pronunciation issues for ESL speakers
    const pronunciationCorrections = {
      // TH sounds
      'dis ': 'this ',
      'dat ': 'that ',
      'dey ': 'they ',
      'tink ': 'think ',
      'tree ': 'three ',
      'trough ': 'through ',
      
      // V/W confusion
      'wery ': 'very ',
      'vork ': 'work ',
      'vorld ': 'world ',
      'vill ': 'will ',
      
      // L/R confusion
      'rearning ': 'learning ',
      'probrem ': 'problem ',
      'comprex ': 'complex ',
      
      // B/V confusion
      'bery ': 'very ',
      'bideo ': 'video ',
      
      // F/P confusion
      'fhone ': 'phone ',
      'foto ': 'photo ',
      
      // Common word substitutions
      'artificial intelligent ': 'artificial intelligence ',
      'machine learn ': 'machine learning ',
      'neural network ': 'neural networks ',
      'deep learn ': 'deep learning ',
      
      // Article corrections
      'a artificial ': 'an artificial ',
      'a algorithm ': 'an algorithm ',
      'a attention ': 'an attention ',
      
      // Plural corrections
      'informations ': 'information ',
      'datas ': 'data ',
      'softwares ': 'software ',
      'hardwares ': 'hardware ',
    };

    let corrected = transcript.toLowerCase();
    
    for (const [incorrect, correct] of Object.entries(pronunciationCorrections)) {
      const regex = new RegExp(incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      corrected = corrected.replace(regex, correct);
    }

    return corrected;
  }

  private applyESLGrammarCorrections(transcript: string): string {
    let corrected = transcript;

    // Common ESL grammar patterns
    const grammarCorrections = [
      // Missing articles
      { pattern: /\b(explain|tell me about|what is)\s+(neural network|algorithm|machine learning|artificial intelligence)\b/gi, 
        replacement: '$1 the $2' },
      
      // Verb tense corrections
      { pattern: /\bi am interest in\b/gi, replacement: 'i am interested in' },
      { pattern: /\bi want learn\b/gi, replacement: 'i want to learn' },
      { pattern: /\bcan you explain me\b/gi, replacement: 'can you explain to me' },
      { pattern: /\bhow i can\b/gi, replacement: 'how can i' },
      
      // Preposition corrections
      { pattern: /\blearn about of\b/gi, replacement: 'learn about' },
      { pattern: /\btell me for\b/gi, replacement: 'tell me about' },
      { pattern: /\binterested for\b/gi, replacement: 'interested in' },
      
      // Word order corrections
      { pattern: /\bwhat means\b/gi, replacement: 'what does it mean' },
      { pattern: /\bhow works\b/gi, replacement: 'how does it work' },
    ];

    for (const correction of grammarCorrections) {
      corrected = corrected.replace(correction.pattern, correction.replacement);
    }

    return corrected;
  }

  private selectBestESLAlternative(alternatives: string[]): string {
    // Score alternatives based on ESL-friendly criteria
    let bestAlternative = alternatives[0];
    let bestScore = 0;

    for (const alternative of alternatives) {
      let score = 0;
      const words = alternative.toLowerCase().split(' ');

      // Prefer alternatives with common AI/tech terms
      const techTerms = ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'neural', 'network', 'algorithm', 'data', 'computer'];
      score += words.filter(word => techTerms.includes(word)).length * 2;

      // Prefer alternatives with complete words (not fragments)
      score += words.filter(word => word.length > 2).length;

      // Prefer alternatives with proper sentence structure
      if (alternative.includes('?')) score += 1;
      if (alternative.includes('what') || alternative.includes('how') || alternative.includes('why')) score += 1;

      // Penalize alternatives with obvious speech recognition errors
      if (alternative.includes('uh') || alternative.includes('um') || alternative.includes('er')) score -= 1;

      if (score > bestScore) {
        bestScore = score;
        bestAlternative = alternative;
      }
    }

    return bestAlternative;
  }

  private cleanESLFillers(transcript: string): string {
    // Remove common filler words that ESL speakers might use more frequently
    const fillers = [
      /\b(uh|um|er|ah|eh|mm|hmm)\b/gi,
      /\b(you know|like|actually|basically|literally)\b/gi,
      /\b(how to say|what is the word|how do you call)\b/gi,
    ];

    let cleaned = transcript;
    for (const filler of fillers) {
      cleaned = cleaned.replace(filler, ' ');
    }

    // Clean up extra spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  private handleStart(): void {
    console.log('🚀 Mobile-optimized speech recognition started');
    this.isListening = true;
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.hasReceivedSpeech = false;
    this.speechStartTime = Date.now();
  }

  private handleSpeechStart(): void {
    console.log('🗣️ Speech detected - mobile-friendly processing active');
    this.hasReceivedSpeech = true;
    this.clearSilenceTimer();
  }

  private handleSpeechEnd(): void {
    console.log('🤐 Speech ended - mobile-optimized silence detection');
    this.startSilenceTimer();
  }

  private handleEnd(): void {
    console.log('🛑 Mobile-optimized speech recognition ended');
    const sessionDuration = Date.now() - this.speechStartTime;
    console.log(`📊 Session duration: ${sessionDuration}ms`);
    
    this.isListening = false;
    this.clearSilenceTimer();
    
    if (this.hasReceivedSpeech && this.finalTranscript.trim()) {
      const cleanTranscript = this.finalTranscript.trim();
      console.log(`🎯 Processing mobile-optimized final transcript: "${cleanTranscript}"`);
      this.onEnd(cleanTranscript);
    } else if (!this.hasReceivedSpeech) {
      console.log('❌ No speech detected during session');
      this.onError('no-speech');
    } else {
      console.log('⚠️ Empty transcript but speech was detected');
      this.onEnd('');
    }
  }

  private handleError(event: SpeechRecognitionErrorEvent): void {
    console.error('❌ Mobile speech recognition error:', event.error);
    this.isListening = false;
    this.clearSilenceTimer();
    
    // Enhanced error handling with mobile-specific guidance
    let errorMessage = event.error;
    switch (event.error) {
      case 'no-speech':
        errorMessage = 'no-speech-detected';
        break;
      case 'audio-capture':
        errorMessage = 'microphone-unavailable';
        break;
      case 'not-allowed':
        if (this.isMobile && !this.hasUserGesture) {
          errorMessage = 'mobile-permission-denied';
        } else {
          errorMessage = 'microphone-permission-denied';
        }
        break;
      case 'network':
        errorMessage = 'network-error';
        break;
      case 'service-not-allowed':
        errorMessage = 'mobile-service-not-allowed';
        break;
    }
    
    this.onError(errorMessage);
  }

  private startSilenceTimer(): void {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      if (this.isListening && this.finalTranscript.trim()) {
        console.log('🔇 Auto-stopping due to silence (mobile-optimized timeout)');
        this.stop();
      }
    }, this.autoStopDelay);
  }

  private resetSilenceTimer(): void {
    this.clearSilenceTimer();
    this.startSilenceTimer();
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  public isSupported(): boolean {
    const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
    const hasSpeechRecognition = 'SpeechRecognition' in window;
    
    if (this.isMobile) {
      // Additional mobile checks
      const isHttps = location.protocol === 'https:' || location.hostname === 'localhost';
      return (hasWebkitSpeechRecognition || hasSpeechRecognition) && isHttps;
    }
    
    return hasWebkitSpeechRecognition || hasSpeechRecognition;
  }

  public start(
    onResult: (transcript: string) => void,
    onEnd: (finalTranscript: string) => void,
    onError: (error: string) => void
  ): void {
    if (!this.isSupported()) {
      if (this.isMobile && location.protocol !== 'https:' && location.hostname !== 'localhost') {
        onError('mobile-https-required');
      } else {
        onError('not-supported');
      }
      return;
    }

    // Mobile-specific permission check
    if (this.isMobile && !this.hasUserGesture) {
      onError('mobile-user-gesture-required');
      return;
    }

    if (this.isListening) {
      console.log('🔄 Already listening, restarting with mobile optimizations...');
      this.stop();
      setTimeout(() => this.startRecognition(onResult, onEnd, onError), 200);
    } else {
      this.startRecognition(onResult, onEnd, onError);
    }
  }

  private startRecognition(
    onResult: (transcript: string) => void,
    onEnd: (finalTranscript: string) => void,
    onError: (error: string) => void
  ): void {
    this.onResult = onResult;
    this.onEnd = onEnd;
    this.onError = onError;
    
    if (this.recognition) {
      try {
        console.log('🎙️ Initializing mobile-optimized speech recognition...');
        this.recognition.start();
      } catch (error) {
        console.error('💥 Failed to start mobile speech recognition:', error);
        if (this.isMobile) {
          this.onError('mobile-initialization-failed');
        } else {
          this.onError('initialization-failed');
        }
      }
    }
  }

  public stop(): void {
    console.log('⏹️ Stopping mobile-optimized speech recognition...');
    this.isListening = false;
    this.clearSilenceTimer();
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  // Mobile-specific methods
  public isMobileDevice(): boolean {
    return this.isMobile;
  }

  public hasUserInteracted(): boolean {
    return this.hasUserGesture;
  }

  public requestMobilePermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isMobile) {
        resolve(true);
        return;
      }

      // Try to request microphone permission explicitly
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            // Stop the stream immediately, we just wanted permission
            stream.getTracks().forEach(track => track.stop());
            this.hasUserGesture = true;
            console.log('📱 Mobile microphone permission granted');
            resolve(true);
          })
          .catch((error) => {
            console.error('📱 Mobile microphone permission denied:', error);
            resolve(false);
          });
      } else {
        resolve(false);
      }
    });
  }

  // ESL-specific configuration methods
  public enableESLOptimizations(enabled: boolean = true): void {
    this.eslOptimizations = enabled;
    console.log(`🌍 ESL optimizations ${enabled ? 'enabled' : 'disabled'}`);
  }

  public setLanguageCode(languageCode: string): void {
    this.languageCode = languageCode;
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
    console.log(`🗣️ Language set to: ${languageCode}`);
  }

  public addAlternativeLanguages(languages: string[]): void {
    this.alternativeLanguages = languages;
    console.log(`🌐 Alternative languages added: ${languages.join(', ')}`);
  }

  public setConfidenceThreshold(threshold: number): void {
    // For ESL users, we recommend a lower threshold
    this.confidenceThreshold = Math.max(0.3, Math.min(1, threshold));
    console.log(`🎯 Mobile-friendly confidence threshold set to: ${this.confidenceThreshold}`);
  }

  public setAutoStopDelay(delay: number): void {
    // For mobile users, we recommend a shorter delay to save battery
    const minDelay = this.isMobile ? 3000 : 3000;
    this.autoStopDelay = Math.max(minDelay, delay);
    console.log(`⏱️ Mobile-optimized auto-stop delay set to: ${this.autoStopDelay}ms`);
  }

  public getFinalTranscript(): string {
    return this.finalTranscript;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public getSessionStats(): { 
    duration: number; 
    hasReceivedSpeech: boolean; 
    transcriptLength: number;
    eslOptimized: boolean;
    confidenceThreshold: number;
    autoStopDelay: number;
    isMobile: boolean;
    hasUserGesture: boolean;
  } {
    return {
      duration: this.speechStartTime ? Date.now() - this.speechStartTime : 0,
      hasReceivedSpeech: this.hasReceivedSpeech,
      transcriptLength: this.finalTranscript.length,
      eslOptimized: this.eslOptimizations,
      confidenceThreshold: this.confidenceThreshold,
      autoStopDelay: this.autoStopDelay,
      isMobile: this.isMobile,
      hasUserGesture: this.hasUserGesture
    };
  }

  // Method to get mobile-specific tips for users
  public getMobileTips(): string[] {
    return [
      "📱 Ensure you're using HTTPS (secure connection)",
      "🎤 Tap the microphone button directly to start",
      "🔊 Speak clearly and close to your device",
      "🔋 Voice recognition may stop sooner on mobile to save battery",
      "📶 Ensure you have a stable internet connection",
      "🔒 Grant microphone permission when prompted",
      "🌐 Use Chrome or Safari for best mobile support",
      "👆 Make sure to interact with the page before using voice"
    ];
  }

  // Method to get ESL-specific tips for users
  public getESLTips(): string[] {
    return [
      "🗣️ Speak clearly and at a moderate pace",
      "🎯 Use simple, direct sentences when possible",
      "⏱️ Take your time - the system waits longer for ESL speakers",
      "🔄 If not understood, try rephrasing with different words",
      "📝 Common tech terms like 'AI', 'machine learning' are well-recognized",
      "🎤 Speak closer to your microphone for better recognition",
      "🌍 The system is optimized for various English accents",
      "💡 Don't worry about perfect grammar - the AI understands context"
    ];
  }
}