import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import norwegianDictionaryService from '../services/norwegianDictionaryService';
import ttsService from '../services/tts';
import { 
  ArrowLeft, 
  Plus, 
  Volume2, 
  BookOpen, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const WordDetails = ({ word, dictionaries, wordType, onBack }) => {
  const { addWord } = useApp();
  const [wordDetails, setWordDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    const loadWordDetails = async () => {
      if (!word) return;
      
      setIsLoadingDetails(true);
      try {
        // Try to get details from the first available dictionary
        const primaryDict = dictionaries[0] || 'bm';
        const details = await norwegianDictionaryService.getWordArticle(word, primaryDict);
        
        // Set the word type from the search result
        details.wordType = wordType;
        
        // Generate AI usage examples
        setIsGeneratingAI(true);
        const usageExamples = await norwegianDictionaryService.generateUsageExamples(
          word, 
          details.definitions[0]
        );
        details.usageExamples = usageExamples;
        
        // Get connected words
        const connectedWords = await norwegianDictionaryService.getConnectedWords(word, dictionaries);
        details.connectedWords = connectedWords;
        
        setIsGeneratingAI(false);
        setWordDetails(details);
      } catch (error) {
        console.error('Error fetching word details:', error);
        // Create fallback details with basic information
        const fallbackDetails = {
          word,
          definitions: [`Norwegian word: ${word}`],
          examples: [],
          usageExamples: [
            `Jeg har en ${word}.`,
            `Kan du se ${word}?`,
            `${word} er interessant.`
          ],
          grammar: {},
          etymology: '',
          pronunciation: '',
          wordType: wordType,
          connectedWords: []
        };
        setWordDetails(fallbackDetails);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadWordDetails();
  }, [word, dictionaries, wordType]);

  // Add word to learning list
  const handleAddWord = async (wordToAdd, definition = '') => {
    try {
      await addWord(wordToAdd, definition || `Norwegian word: ${wordToAdd}`);
      alert(`"${wordToAdd}" added to your vocabulary!`);
    } catch (error) {
      console.error('Error adding word:', error);
      alert('Failed to add word. Please try again.');
    }
  };

  // Play pronunciation
  const handlePlayPronunciation = async (text) => {
    try {
      await ttsService.speak(text, 'nb-NO');
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  // Get dictionary display names
  const getDictionaryDisplay = (dicts) => {
    const dictNames = {
      'bm': 'Bokmål',
      'nn': 'Nynorsk'
    };
    return dicts.map(d => dictNames[d] || d).join(', ');
  };

  if (isLoadingDetails) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Search</span>
          </button>
        </div>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading word details..." />
        </div>
      </div>
    );
  }

  if (!wordDetails) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Search</span>
          </button>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Word details not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Word Details */}
      <div className="bg-white rounded-lg border-2 border-purple-500 p-6">
        {/* Header with word, type, and actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{wordDetails.word}</h1>
              <div className="flex items-center space-x-3">
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {wordDetails.wordType}
                </span>
                <span className="text-sm text-gray-600">
                  {getDictionaryDisplay(dictionaries)}
                </span>
              </div>
            </div>
            <button
              onClick={() => handlePlayPronunciation(wordDetails.word)}
              className="text-purple-600 hover:text-purple-700 p-3 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
              title="Listen to pronunciation"
            >
              <Volume2 size={24} />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleAddWord(wordDetails.word, wordDetails.definitions[0])}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-medium"
            >
              <Plus size={20} />
              <span>Add to Vocabulary</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Definitions Section */}
          {wordDetails.definitions.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📖 Definitions
              </h2>
              <div className="space-y-3">
                {wordDetails.definitions.map((def, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-blue-600 font-medium text-sm mt-1">{index + 1}.</span>
                    <p className="text-gray-700 text-lg leading-relaxed flex-1">{def}</p>
                    <button
                      onClick={() => handlePlayPronunciation(def)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
                      title="Listen to definition"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI-Generated Usage Examples */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              🤖 AI Usage Examples
            </h2>
            {isGeneratingAI ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  <span className="text-green-700">Generating AI examples...</span>
                </div>
              </div>
            ) : wordDetails.usageExamples && wordDetails.usageExamples.length > 0 ? (
              <div className="space-y-3">
                {wordDetails.usageExamples.map((example, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-green-600 font-medium text-sm mt-1">{index + 1}.</span>
                    <p className="text-gray-700 text-lg leading-relaxed flex-1 italic">"{example}"</p>
                    <button
                      onClick={() => handlePlayPronunciation(example)}
                      className="text-green-600 hover:text-green-700 p-2 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
                      title="Listen to example"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No AI examples available</p>
              </div>
            )}
          </div>

          {/* Connected Words */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              🔗 Connected Words
            </h2>
            {isGeneratingAI ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  <span className="text-purple-700">Finding related words...</span>
                </div>
              </div>
            ) : wordDetails.connectedWords && wordDetails.connectedWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wordDetails.connectedWords.map((connectedWord, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-purple-600 font-medium text-sm">{index + 1}.</span>
                      <div>
                        <span className="font-medium text-gray-900">{connectedWord.word}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {connectedWord.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getDictionaryDisplay(connectedWord.dictionaries)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePlayPronunciation(connectedWord.word)}
                        className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-100 rounded-full transition-colors"
                        title="Listen to word"
                      >
                        <Volume2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to this word's details page
                          window.location.href = `/word/${connectedWord.word}`;
                        }}
                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-100 rounded-full transition-colors"
                        title="View details"
                      >
                        <BookOpen size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No related words found</p>
              </div>
            )}
          </div>

          {/* Original Examples (if available) */}
          {wordDetails.examples && wordDetails.examples.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📚 Dictionary Examples
              </h2>
              <div className="space-y-3">
                {wordDetails.examples.map((ex, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-orange-600 font-medium text-sm mt-1">{index + 1}.</span>
                    <p className="text-gray-700 text-lg leading-relaxed italic flex-1">"{ex}"</p>
                    <button
                      onClick={() => handlePlayPronunciation(ex)}
                      className="text-orange-600 hover:text-orange-700 p-2 hover:bg-orange-100 rounded-full transition-colors flex-shrink-0"
                      title="Listen to example"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Info (if available) */}
          {wordDetails.grammar && Object.keys(wordDetails.grammar).length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📝 Grammar Information
              </h2>
              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(wordDetails.grammar, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* External Link */}
          <div className="pt-6 border-t border-gray-200">
            <a
              href={`https://ord.uib.no/bm/leid/${wordDetails.word}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors"
            >
              <ExternalLink size={18} />
              <span>View full entry on ord.uib.no</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetails;
