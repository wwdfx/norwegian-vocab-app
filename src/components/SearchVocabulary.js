import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import norwegianDictionaryService from '../services/norwegianDictionaryService';
import ttsService from '../services/tts';
import { 
  Search, 
  Plus, 
  Volume2, 
  BookOpen,
  Filter, 
  Sparkles, 
  Loader2,
  Info
} from 'lucide-react';

const SearchVocabulary = () => {
  const { t } = useTranslation();
  const { addWord, navigateToWordDetails } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [translations, setTranslations] = useState({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);
  const [filters, setFilters] = useState({
    wordClass: '',
    maxResults: 10,
    dictionaries: ['bm', 'nn']
  });
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('norlearn_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((query) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('norlearn_recent_searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Search for words
  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError('');
         setSearchResults(null);
     setTranslations({});

    try {
      const results = await norwegianDictionaryService.searchWords(query, {
        maxResults: filters.maxResults,
        dictionaries: filters.dictionaries,
        wordClass: filters.wordClass || null
      });

      setSearchResults(results);
      saveRecentSearch(query);
      
      // Get translations for the first few results
      await getTranslationsForResults(results);
    } catch (error) {
      setSearchError(error.message);
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Get English translations for search results
  const getTranslationsForResults = async (results) => {
    setIsLoadingTranslations(true);
    const allResults = [
      ...results.exactMatches,
      ...results.inflectedForms,
      ...results.freetextMatches,
      ...results.similarWords
    ].slice(0, 10); // Limit to first 10 for performance

    const newTranslations = {};
    
    for (const result of allResults) {
      try {
        const translation = await getEnglishTranslation(result.word);
        newTranslations[result.word] = translation;
      } catch (error) {
        console.error(`Translation error for ${result.word}:`, error);
        newTranslations[result.word] = 'Translation unavailable';
      }
    }
    
    setTranslations(newTranslations);
    setIsLoadingTranslations(false);
  };

  // Get English translation for a Norwegian word
  const getEnglishTranslation = async (norwegianWord) => {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyDV4AhwF5mAfs2F4Zi0jZAS3lebGew2N8o`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: norwegianWord,
            source: 'no',
            target: 'en',
            format: 'text'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback: try to provide a basic translation based on common words
      const commonTranslations = {
        'katt': 'cat',
        'hund': 'dog',
        'bok': 'book',
        'hus': 'house',
        'bil': 'car',
        'vann': 'water',
        'mat': 'food',
        'drikke': 'drink',
        'gå': 'go',
        'komme': 'come',
        'se': 'see',
        'høre': 'hear',
        'snakke': 'speak',
        'lese': 'read',
        'skrive': 'write'
      };
      
      return commonTranslations[norwegianWord.toLowerCase()] || 'Translation unavailable';
    }
  };

  // Test API connectivity
  const handleTestAPI = async () => {
    try {
      const result = await norwegianDictionaryService.testAPI();
      if (result.success) {
        alert(`✅ API Test Successful!\n\n${result.message}`);
      } else {
        alert(`❌ API Test Failed!\n\n${result.message}`);
      }
    } catch (error) {
      alert(`❌ API Test Error!\n\n${error.message}`);
    }
  };

    // Navigate to word details page
  const handleWordSelect = (word, dictionaries, wordType = 'exact') => {
    navigateToWordDetails({ word, dictionaries, wordType });
  };

  // Add word to learning list
  const handleAddWord = async (word, definition = '') => {
    try {
      await addWord(word, definition || `Norwegian word: ${word}`);
      // Show success feedback
      alert(`"${word}" added to your vocabulary!`);
    } catch (error) {
      console.error('Error adding word:', error);
      alert('Failed to add word. Please try again.');
    }
  };

  // Play pronunciation
  const handlePlayPronunciation = async (word) => {
    try {
      await ttsService.speak(word, 'nb-NO');
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchResults) {
        setSearchResults(null);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchResults]);

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };



  // Get dictionary display names
  const getDictionaryDisplay = (dicts) => {
    const dictNames = {
      'bm': 'Bokmål',
      'nn': 'Nynorsk'
    };
    return dicts.map(d => dictNames[d] || d).join(', ');
  };

  // Render search results
  const renderSearchResults = () => {
    if (!searchResults) return null;

    const allResults = [
      ...searchResults.exactMatches,
      ...searchResults.inflectedForms,
      ...searchResults.freetextMatches,
      ...searchResults.similarWords
    ];

    if (allResults.length === 0) {
      return (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t('search.noResults')} "{searchResults.query}"</p>
          <p className="text-sm text-gray-500 mt-2">{t('search.tryDifferent')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
{t('search.searchResults')} {searchResults.totalCount} {t('search.results')} "{searchResults.query}"
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Word Class
                </label>
                <select
                  value={filters.wordClass}
                  onChange={(e) => setFilters(prev => ({ ...prev, wordClass: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All word classes</option>
                  {Object.entries(norwegianDictionaryService.getWordClasses()).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Results
                </label>
                <select
                  value={filters.maxResults}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={5}>5 results</option>
                  <option value={10}>10 results</option>
                  <option value={20}>20 results</option>
                  <option value={50}>50 results</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dictionaries
                </label>
                <div className="space-y-2">
                  {['bm', 'nn'].map(dict => (
                    <label key={dict} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.dictionaries.includes(dict)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ 
                              ...prev, 
                              dictionaries: [...prev.dictionaries, dict] 
                            }));
                          } else {
                            setFilters(prev => ({ 
                              ...prev, 
                              dictionaries: prev.dictionaries.filter(d => d !== dict) 
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{dict === 'bm' ? 'Bokmål' : 'Nynorsk'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleSearch()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        )}

                 {/* Results */}
         <div className="grid gap-3">
           {allResults.map((result, index) => (
             <div
               key={`${result.word}-${index}`}
                               className="bg-white rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all hover:shadow-md"
                               onClick={() => handleWordSelect(result.word, result.dictionaries, result.type)}
             >
               <div className="flex items-center justify-between">
                 <div className="flex-1">
                   <div className="flex items-center space-x-3 mb-2">
                     <h4 className="text-lg font-semibold text-gray-900">{result.word}</h4>
                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                       {result.type}
                     </span>
                     <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                       {getDictionaryDisplay(result.dictionaries)}
                     </span>
                   </div>
                   
                   {/* English Translation */}
                   <div className="mb-2">
                     {isLoadingTranslations ? (
                       <div className="flex items-center space-x-2">
                         <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                         <span className="text-sm text-gray-500">Loading translation...</span>
                       </div>
                     ) : translations[result.word] ? (
                       <p className="text-sm text-gray-600 italic">
                         <span className="font-medium">English:</span> {translations[result.word]}
                       </p>
                     ) : (
                       <span className="text-sm text-gray-400">Translation loading...</span>
                     )}
                   </div>
                   
                   <div className="flex items-center space-x-2">
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         handlePlayPronunciation(result.word);
                       }}
                       className="text-purple-600 hover:text-purple-700 p-1"
                       title="Listen to pronunciation"
                     >
                       <Volume2 size={16} />
                     </button>
                     
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         handleAddWord(result.word);
                       }}
                       className="text-green-600 hover:text-green-700 p-1"
                       title="Add to vocabulary"
                     >
                       <Plus size={16} />
                     </button>
                   </div>
                 </div>
                 
                 <div className="text-right">
                   <div className="text-sm text-gray-500">
                     {result.word.length} letters
                   </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>
    );
  };




  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16">
            <img 
              src="/Logo.png" 
              alt="NorLearn Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('search.title')}</h1>
        <p className="text-gray-600">
          {t('search.subtitle')}
        </p>
        <button
          onClick={handleTestAPI}
          className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          🔧 Test API Connection
        </button>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.searchPlaceholder')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Search size={20} />
                  <span>Search</span>
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('search.recentSearches')}:</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(search);
                    handleSearch(search);
                  }}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-800 font-medium">{searchError}</p>
              <p className="text-red-700 text-sm mt-1">
                If this error persists, try the "Test API Connection" button above to verify the API is accessible.
              </p>
            </div>
          </div>
        </div>
      )}

             {/* Search Results */}
       {renderSearchResults()}

       {/* Tips */}
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <div className="flex items-start space-x-2">
           <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
           <div className="text-sm text-blue-800">
             <p className="font-medium mb-1">💡 {t('search.searchTips')}</p>
             <ul className="space-y-1 text-xs">
               <li>• {t('search.tip1')}</li>
               <li>• {t('search.tip2')}</li>
               <li>• {t('search.tip3')}</li>
               <li>• {t('search.tip4')}</li>
               <li>• {t('search.tip5')}</li>
             </ul>
           </div>
         </div>
       </div>
    </div>
  );
};

export default SearchVocabulary;
