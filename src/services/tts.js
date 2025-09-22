// Text-to-Speech service for Norwegian pronunciation
class TTSService {
  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    this.googleApiKey = 'AIzaSyDV4AhwF5mAfs2F4Zi0jZAS3lebGew2N8o'; // Cloud Translation/TTS API key
  }

  async speak(text, languageCode = 'nb-NO') {
    // Try Google Cloud TTS first, fallback to browser TTS
    try {
      await this.speakWithGoogleTTS(text);
    } catch (error) {
      console.warn('Google TTS failed, falling back to browser TTS:', error);
      await this.speakWithBrowserTTS(text, languageCode);
    }
  }

  async speakWithGoogleTTS(text) {
    const requestBody = {
      "audioConfig": {
        "audioEncoding": "LINEAR16",
        "effectsProfileId": [
          "small-bluetooth-speaker-class-device"
        ],
        "pitch": 0,
        "speakingRate": 0.8 // Slightly slower for better pronunciation
      },
      "input": {
        "text": text
      },
      "voice": {
        "languageCode": "nb-NO",
        "name": "nb-NO-Chirp3-HD-Achernar"
      }
    };

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${this.googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`Google TTS API error: 403 Forbidden - API key may not have Text-to-Speech permissions or billing may not be enabled`);
      }
      throw new Error(`Google TTS API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.audioContent) {
      // Convert base64 audio to blob and play
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/wav' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = reject;
        audio.play();
      });
    } else {
      throw new Error('No audio content received from Google TTS');
    }
  }

  async speakWithBrowserTTS(text, languageCode = 'nb-NO') {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set multiple Norwegian language codes to try
      utterance.lang = 'nb-NO'; // Norwegian Bokmål
      utterance.rate = 0.6; // Even slower for better pronunciation
      utterance.pitch = 0.9; // Slightly lower pitch for more natural sound
      utterance.volume = 1.0;
      
      utterance.onend = resolve;
      utterance.onerror = reject;

      // Wait for voices to load if they haven't loaded yet
      const speakWithVoice = () => {
        const voices = speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        
        // Try to find the best Norwegian voice
        let norwegianVoice = voices.find(voice => 
          voice.lang === 'nb-NO' || 
          voice.lang === 'no-NO' ||
          voice.lang.startsWith('nb-') ||
          voice.lang.startsWith('no-')
        );
        
        // If no exact match, try by name
        if (!norwegianVoice) {
          norwegianVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('norwegian') ||
            voice.name.toLowerCase().includes('norsk') ||
            voice.name.toLowerCase().includes('norway')
          );
        }
        
        // If still no Norwegian voice, try other Nordic languages as fallback
        if (!norwegianVoice) {
          norwegianVoice = voices.find(voice => 
            voice.lang.startsWith('sv-') || // Swedish
            voice.lang.startsWith('da-') || // Danish
            voice.lang.startsWith('fi-')    // Finnish
          );
        }
        
        // If still no Nordic voice, try German (closer to Norwegian than Russian)
        if (!norwegianVoice) {
          norwegianVoice = voices.find(voice => 
            voice.lang.startsWith('de-') // German
          );
        }
        
        // If still no suitable voice, try English (better than Russian)
        if (!norwegianVoice) {
          norwegianVoice = voices.find(voice => 
            voice.lang.startsWith('en-') && 
            !voice.name.toLowerCase().includes('russian')
          );
        }
        
        if (norwegianVoice) {
          utterance.voice = norwegianVoice;
          utterance.lang = norwegianVoice.lang;
          console.log('Using voice:', norwegianVoice.name, 'with language:', norwegianVoice.lang);
        } else {
          // Use English as last resort instead of Russian
          utterance.lang = 'en-US';
          console.log('No suitable voice found, using English as fallback');
        }
        
        speechSynthesis.speak(utterance);
      };
      
      // If voices are already loaded, speak immediately
      if (speechSynthesis.getVoices().length > 0) {
        speakWithVoice();
      } else {
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = speakWithVoice;
      }
    });
  }

  getAvailableVoices() {
    if (!this.isSupported) return [];
    return speechSynthesis.getVoices();
  }

  getNorwegianVoices() {
    const voices = this.getAvailableVoices();
    return voices.filter(voice => 
      voice.lang === 'nb-NO' || 
      voice.lang === 'no-NO' ||
      voice.lang.startsWith('nb-') ||
      voice.lang.startsWith('no-') ||
      voice.name.toLowerCase().includes('norwegian') ||
      voice.name.toLowerCase().includes('norsk') ||
      voice.name.toLowerCase().includes('norway')
    );
  }

  // Method to get all available voices for debugging
  logAvailableVoices() {
    const voices = this.getAvailableVoices();
    console.log('=== Available Voices ===');
    voices.forEach(voice => {
      console.log(`${voice.name} (${voice.lang}) - ${voice.default ? 'DEFAULT' : ''}`);
    });
    
    const norwegianVoices = this.getNorwegianVoices();
    console.log('=== Norwegian Voices ===');
    if (norwegianVoices.length > 0) {
      norwegianVoices.forEach(voice => {
        console.log(`${voice.name} (${voice.lang})`);
      });
    } else {
      console.log('No Norwegian voices found');
    }
  }

  // Check if Google TTS API is properly configured
  async checkGoogleTTSStatus() {
    try {
      const testResponse = await fetch(
        `https://texttospeech.googleapis.com/v1beta1/voices?key=${this.googleApiKey}&languageCode=nb-NO`
      );
      
      if (testResponse.ok) {
        console.log('✅ Google TTS API is properly configured');
        return true;
      } else {
        console.log('❌ Google TTS API error:', testResponse.status, testResponse.statusText);
        return false;
      }
    } catch (error) {
      console.log('❌ Google TTS API not accessible:', error.message);
      return false;
    }
  }
}

export default new TTSService();
