class NorwegianDictionaryService {
  constructor() {
    this.baseUrl = 'https://ord.uib.no';
    this.apiUrl = 'https://ord.uib.no/api';
  }

  // Search for Norwegian words with autocomplete
  async searchWords(query, options = {}) {
    const {
      maxResults = 10,
      dictionaries = ['bm', 'nn'], // bokmål and nynorsk
      include = 'efis', // exact, freetext, inflect, similar
      wordClass = null
    } = options;

    try {
      const params = new URLSearchParams({
        q: query,
        n: maxResults,
        dict: dictionaries.join(','),
        include: include
      });

      if (wordClass) {
        params.append('wc', wordClass);
      }

      const url = `${this.apiUrl}/suggest?${params}`;
      console.log('Searching API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('API Response Status:', response.status);
        console.error('API Response Headers:', response.headers);
        
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check the API configuration.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. The API may have rate limiting or access restrictions.');
        } else if (response.status >= 500) {
          throw new Error('Server error. The Norwegian Dictionary API may be temporarily unavailable.');
        } else {
          throw new Error(`API request failed: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('API Response Data:', data);
      return this.parseSearchResults(data);
    } catch (error) {
      console.error('Norwegian Dictionary API search error:', error);
      throw error;
    }
  }

  // Parse search results into a more usable format
  parseSearchResults(data) {
    const results = {
      query: data.q,
      totalCount: data.cnt,
      exactMatches: [],
      inflectedForms: [],
      freetextMatches: [],
      similarWords: []
    };

    if (data.a?.exact) {
      results.exactMatches = data.a.exact.map(([word, dicts]) => ({
        word,
        dictionaries: dicts,
        type: 'exact'
      }));
    }

    if (data.a?.inflect) {
      results.inflectedForms = data.a.inflect.map(([word, dicts]) => ({
        word,
        dictionaries: dicts,
        type: 'inflected'
      }));
    }

    if (data.a?.freetext) {
      results.freetextMatches = data.a.freetext.map(([word, dicts]) => ({
        word,
        dictionaries: dicts,
        type: 'freetext'
      }));
    }

    if (data.a?.similar) {
      results.similarWords = data.a.similar.map(([word, dicts]) => ({
        word,
        dictionaries: dicts,
        type: 'similar'
      }));
    }

    return results;
  }

  // Get detailed article information for a specific word
  async getWordArticle(word, dictionary = 'bm') {
    try {
      // First get the article IDs
      const articleUrl = `${this.apiUrl}/articles?w=${encodeURIComponent(word)}&dict=${dictionary}&scope=e`;
      console.log('Article lookup URL:', articleUrl);
      
      const articleResponse = await fetch(articleUrl);

      if (!articleResponse.ok) {
        console.error('Article lookup response status:', articleResponse.status);
        throw new Error(`Article lookup failed: ${articleResponse.status}`);
      }

      const articleData = await articleResponse.json();
      console.log('Article lookup response:', articleData);
      
      if (!articleData.articles?.[dictionary] || articleData.articles[dictionary].length === 0) {
        throw new Error('No articles found for this word');
      }

      // Get the first article
      const articleId = articleData.articles[dictionary][0];
      const articleUrl2 = `${this.baseUrl}/${dictionary}/article/${articleId}.json`;
      console.log('Article content URL:', articleUrl2);
      
      const articleResponse2 = await fetch(articleUrl2);
      
      if (!articleResponse2.ok) {
        console.error('Article content response status:', articleResponse2.status);
        throw new Error(`Article fetch failed: ${articleResponse2.status}`);
      }

      const article = await articleResponse2.json();
      console.log('Article content response:', article);
      return this.parseArticle(article, word);
    } catch (error) {
      console.error('Error fetching word article:', error);
      throw error;
    }
  }

  // Parse article data into a usable format
  parseArticle(article, word) {
    try {
      const parsed = {
        word: word,
        definitions: [],
        examples: [],
        grammar: {},
        etymology: '',
        pronunciation: '',
        wordType: 'exact', // Default type
        connectedWords: []
      };

      // Extract definitions and examples from the article
      if (article.article && article.article.content) {
        const content = article.article.content;
        
        // Look for definitions (usually in <def> tags or similar)
        if (content.definitions) {
          parsed.definitions = content.definitions.map(def => def.text || def);
        }
        
        // Look for examples (usually in <ex> tags or similar)
        if (content.examples) {
          parsed.examples = content.examples.map(ex => ex.text || ex);
        }
        
        // Look for grammar information
        if (content.grammar) {
          parsed.grammar = content.grammar;
        }
      }

      // Fallback: try to extract from the raw content
      if (parsed.definitions.length === 0 && article.article?.content?.text) {
        const text = article.article.content.text;
        // Simple parsing - look for common patterns
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10);
        parsed.definitions = sentences.slice(0, 3); // Take first 3 sentences as definitions
      }

      return parsed;
    } catch (error) {
      console.error('Error parsing article:', error);
      return {
        word: word,
        definitions: ['Definition not available'],
        examples: [],
        grammar: {},
        etymology: '',
        pronunciation: '',
        wordType: 'exact',
        connectedWords: []
      };
    }
  }

  // Generate AI usage examples for a word
  async generateUsageExamples(word, definition = '') {
    try {
      // Use Gemini API to generate contextual examples
      const prompt = `Generate 3 natural, everyday Norwegian usage examples for the word "${word}". 
      ${definition ? `Definition: ${definition}` : ''}
      
      Requirements:
      - Use simple, conversational Norwegian
      - Include different contexts (home, work, social situations)
      - Make examples practical and easy to understand
      - Keep each example under 15 words
      
      Format: Return only the examples, one per line, in Norwegian.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyDV4AhwF5mAfs2F4Zi0jZAS3lebGew2N8o'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const examples = data.candidates[0].content.parts[0].text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 3);

      return examples;
    } catch (error) {
      console.error('Error generating usage examples:', error);
      // Fallback examples
      return [
        `Jeg bruker "${word}" ofte.`,
        `Kan du forklare "${word}"?`,
        `"${word}" er et nyttig ord.`
      ];
    }
  }

  // Get connected/related words
  async getConnectedWords(word, dictionaries = ['bm', 'nn']) {
    try {
      // Search for words that might be related
      const relatedResults = await this.searchWords(word, {
        maxResults: 15,
        dictionaries: dictionaries,
        include: 'efs' // exact, freetext, similar
      });

      // Filter out the exact word and get related ones
      const connectedWords = [
        ...relatedResults.exactMatches,
        ...relatedResults.similarWords
      ]
      .filter(result => result.word !== word)
      .slice(0, 8) // Limit to 8 connected words
      .map(result => ({
        word: result.word,
        type: result.type,
        dictionaries: result.dictionaries
      }));

      return connectedWords;
    } catch (error) {
      console.error('Error getting connected words:', error);
      return [];
    }
  }

  // Get word class information
  getWordClasses() {
    return {
      'NOUN': 'Substantiv (Noun)',
      'ADJ': 'Adjektiv (Adjective)',
      'VERB': 'Verb',
      'ADV': 'Adverb',
      'ADP': 'Preposisjon (Preposition)',
      'CCONJ': 'Konjunksjon (Conjunction)',
      'INTJ': 'Interjeksjon (Interjection)',
      'DET': 'Determinativ (Determiner)',
      'PRON': 'Pronomen (Pronoun)',
      'NUM': 'Tallord (Numeral)',
      'PROPN': 'Egennavn (Proper Noun)',
      'AUX': 'Hjelpeverb (Auxiliary Verb)',
      'PART': 'Partikkel (Particle)',
      'SCONJ': 'Subjunksjon (Subordinating Conjunction)',
      'PUNCT': 'Tegnsetting (Punctuation)',
      'SYM': 'Symbol (Symbol)',
      'X': 'Andre (Other)'
    };
  }

  // Search with wildcards for more flexible matching
  async searchWithWildcards(pattern, options = {}) {
    const {
      maxResults = 20,
      dictionaries = ['bm', 'nn'],
      include = 'ef'
    } = options;

    try {
      const params = new URLSearchParams({
        q: pattern,
        n: maxResults,
        dict: dictionaries.join(','),
        include: include
      });

      const response = await fetch(`${this.apiUrl}/suggest?${params}`);
      
      if (!response.ok) {
        throw new Error(`Wildcard search failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSearchResults(data);
    } catch (error) {
      console.error('Wildcard search error:', error);
      throw error;
    }
  }

  // Get random words for discovery
  async getRandomWords(count = 5, wordClass = null) {
    try {
      const params = new URLSearchParams({
        n: count,
        dict: 'bm,nn',
        include: 'e'
      });

      if (wordClass) {
        params.append('wc', wordClass);
      }

      const response = await fetch(`${this.apiUrl}/suggest?${params}`);
      
      if (!response.ok) {
        throw new Error(`Random words fetch failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSearchResults(data);
    } catch (error) {
      console.error('Error fetching random words:', error);
      throw error;
    }
  }

  // Test API connectivity
  async testAPI() {
    try {
      console.log('Testing Norwegian Dictionary API connectivity...');
      console.log('Base URL:', this.baseUrl);
      console.log('API URL:', this.apiUrl);
      
      // Test with a simple search
      const testParams = new URLSearchParams({
        q: 'hei',
        n: 1,
        dict: 'bm',
        include: 'e'
      });
      
      const testUrl = `${this.apiUrl}/suggest?${testParams}`;
      console.log('Test URL:', testUrl);
      
      const response = await fetch(testUrl);
      console.log('Test response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Test response data:', data);
        return { success: true, message: 'API is working correctly' };
      } else {
        return { success: false, message: `API test failed with status: ${response.status}` };
      }
    } catch (error) {
      console.error('API test error:', error);
      return { success: false, message: `API test error: ${error.message}` };
    }
  }
}

export default new NorwegianDictionaryService();
