// Translation and AI service for Norwegian Vocabulary App
class TranslationService {
  constructor() {
    this.geminiApiKey = 'AIzaSyBTuAG_3kHt3gLy4eK0b9y-gaoXNXd03xU';
    this.translationApiKey = 'AIzaSyDV4AhwF5mAfs2F4Zi0jZAS3lebGew2N8o'; // Cloud Translation API key
  }

  // Translate Norwegian word to English using Google Cloud Translation API
  async translateNorwegianToEnglish(norwegianWord) {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.translationApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: norwegianWord,
            source: 'no', // Norwegian
            target: 'en', // English
            format: 'text'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations.length > 0) {
        return data.data.translations[0].translatedText;
      }
      
      throw new Error('No translation found');
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Generate Norwegian example sentence using Gemini API
  async generateNorwegianExample(norwegianWord) {
    try {
      const prompt = `Generate a simple, natural Norwegian sentence using the word "${norwegianWord}". The sentence should be:
1. Short and easy to understand
2. Use common Norwegian vocabulary
3. Be grammatically correct
4. Show the word in a natural context
5. Only return the Norwegian sentence, no English translation or explanations

Word: ${norwegianWord}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 100,
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        // Clean up the response - remove any extra text or formatting
        const cleanSentence = generatedText.trim().replace(/^["']|["']$/g, '');
        return cleanSentence;
      }
      
      throw new Error('No example sentence generated');
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  // Combined function to get both translation and example
  async getWordInfo(norwegianWord) {
    try {
      // Try to get translation first
      let translation = '';
      let example = '';
      let translationSuccess = false;
      let exampleSuccess = false;

      try {
        translation = await this.translateNorwegianToEnglish(norwegianWord);
        translationSuccess = true;
      } catch (translationError) {
        console.error('Translation failed:', translationError);
        // Fallback to a simple dictionary
        translation = this.getFallbackTranslation(norwegianWord);
      }

      try {
        example = await this.generateNorwegianExample(norwegianWord);
        exampleSuccess = true;
      } catch (exampleError) {
        console.error('Example generation failed:', exampleError);
        // Fallback to a simple example
        example = this.getFallbackExample(norwegianWord);
      }

      return {
        translation,
        example,
        success: translationSuccess || exampleSuccess,
        translationSuccess,
        exampleSuccess
      };
    } catch (error) {
      console.error('Error getting word info:', error);
      return {
        translation: this.getFallbackTranslation(norwegianWord),
        example: this.getFallbackExample(norwegianWord),
        success: false,
        error: error.message
      };
    }
  }

  // Fallback translation dictionary for common Norwegian words
  getFallbackTranslation(norwegianWord) {
    const fallbackDict = {
      'hei': 'hello',
      'takk': 'thank you',
      'ja': 'yes',
      'nei': 'no',
      'vann': 'water',
      'mat': 'food',
      'hus': 'house',
      'bok': 'book',
      'katt': 'cat',
      'hund': 'dog',
      'bil': 'car',
      'tre': 'tree',
      'sol': 'sun',
      'måne': 'moon',
      'stjerne': 'star',
      'familie': 'family',
      'venn': 'friend',
      'skole': 'school',
      'arbeid': 'work',
      'hjem': 'home'
    };
    
    return fallbackDict[norwegianWord.toLowerCase()] || '';
  }

  // Fallback example generator
  getFallbackExample(norwegianWord) {
    const fallbackExamples = {
      'hei': 'Hei, hvordan har du det?',
      'takk': 'Takk for hjelpen!',
      'ja': 'Ja, det er riktig.',
      'nei': 'Nei, det er feil.',
      'vann': 'Jeg vil ha vann.',
      'mat': 'Maten smaker godt.',
      'hus': 'Dette er mitt hus.',
      'bok': 'Jeg leser en bok.',
      'katt': 'Katten sover.',
      'hund': 'Hunden leker.',
      'bil': 'Bilen er rød.',
      'tre': 'Treet er høyt.',
      'sol': 'Solen skinner.',
      'måne': 'Månen er rund.',
      'stjerne': 'Stjernen lyser.',
      'familie': 'Min familie er stor.',
      'venn': 'Han er min venn.',
      'skole': 'Jeg går på skole.',
      'arbeid': 'Jeg liker mitt arbeid.',
      'hjem': 'Jeg er hjemme.'
    };
    
    return fallbackExamples[norwegianWord.toLowerCase()] || `Dette er et eksempel med ordet "${norwegianWord}".`;
  }

  // Check if a word is likely Norwegian (basic heuristic)
  isLikelyNorwegian(word) {
    if (!word || word.length < 2) return false;
    
    // Norwegian-specific characters
    const norwegianChars = /[æøåÆØÅ]/;
    
    // Common Norwegian word patterns
    const norwegianPatterns = [
      /^[a-zæøå]+$/i, // Only Norwegian letters
      /ing$/, // Common Norwegian ending
      /het$/, // Common Norwegian ending
      /else$/, // Common Norwegian ending
    ];

    return norwegianChars.test(word) || norwegianPatterns.some(pattern => pattern.test(word));
  }
}

export default new TranslationService();
