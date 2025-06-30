export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey.trim();
  }

  public async getVoices(): Promise<{ voices?: any[]; error?: string; status?: number }> {
    try {
      // Validate API key format
      if (!this.apiKey || !this.apiKey.startsWith('sk_')) {
        return {
          error: 'Invalid API key format. ElevenLabs API keys should start with "sk_"',
          status: 400
        };
      }

      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch voices';
        
        switch (response.status) {
          case 401:
            errorMessage = '🔑 Your API key seems to be invalid or expired. Please check your ElevenLabs dashboard and get a fresh API key.';
            break;
          case 403:
            errorMessage = '🚫 Access denied. Your API key might not have the right permissions. Please check your ElevenLabs account settings.';
            break;
          case 429:
            errorMessage = '⏱️ You\'ve hit the rate limit! Please wait a moment and try again, or consider upgrading your ElevenLabs plan.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = '🌐 ElevenLabs servers are having a moment. Please try again in a few minutes!';
            break;
          default:
            errorMessage = `❌ Something went wrong (Error ${response.status}). Please try again or contact support if this persists.`;
        }
        
        return {
          error: errorMessage,
          status: response.status
        };
      }
      
      const data = await response.json();
      
      if (!data.voices || !Array.isArray(data.voices)) {
        return {
          error: '📡 Received unexpected data from ElevenLabs. Please try again in a moment.',
          status: response.status
        };
      }
      
      return { voices: data.voices };
    } catch (error) {
      console.error('Error fetching voices:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          error: '🌐 Can\'t connect to ElevenLabs right now. Please check your internet connection and try again.',
          status: 0
        };
      }
      
      return {
        error: error instanceof Error ? `❌ ${error.message}` : '❓ Something unexpected happened. Please try again.',
        status: 0
      };
    }
  }

  public async generateSpeech(
    text: string,
    voiceId: string,
    settings: { stability: number; similarity: number }
  ): Promise<ArrayBuffer | null> {
    try {
      if (!this.apiKey || !this.apiKey.startsWith('sk_')) {
        console.error('Invalid API key format');
        throw new Error('🔑 Your API key isn\'t quite right. Please check your ElevenLabs dashboard for the correct key format.');
      }

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: settings.stability,
            similarity_boost: settings.similarity,
          },
        }),
      });

      if (!response.ok) {
        let errorMessage = `Speech generation failed: ${response.status}`;
        
        switch (response.status) {
          case 401:
            errorMessage = '🔑 Your API key seems to have expired or been revoked. Please get a fresh one from your ElevenLabs dashboard!';
            break;
          case 403:
            errorMessage = '🚫 Your API key doesn\'t have permission for voice synthesis. You might need to upgrade your ElevenLabs plan.';
            break;
          case 429:
            errorMessage = '⏱️ You\'ve used up your voice generation quota! Time to upgrade your ElevenLabs plan or wait for the reset.';
            break;
          case 422:
            errorMessage = '⚙️ There\'s an issue with the voice settings. Try adjusting the stability and similarity values.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = '🌐 ElevenLabs servers are taking a breather. Please try again in a few minutes!';
            break;
          default:
            errorMessage = `❌ Voice generation hit a snag (Error ${response.status}). Please try again!`;
        }
        
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error; // Re-throw to be handled by the calling function
    }
  }
}