import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Users, 
  Star,
  ArrowLeft,
  Eye,
  Plus,
  Volume2,
  Search
} from 'lucide-react';
import ttsService from '../services/tts';
import { getAllWordSets } from '../data/wordSets';

const WordSets = ({ onBack }) => {
  const { t } = useTranslation();
  const { words, addWord } = useApp();
  
  // Function to get localized word set info
  const getLocalizedWordSet = (wordSet) => {
    return {
      ...wordSet,
      name: t(`wordSets.categories.${wordSet.id}.name`, wordSet.name),
      description: t(`wordSets.categories.${wordSet.id}.description`, wordSet.description)
    };
  };
  const [selectedSet, setSelectedSet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importingWords, setImportingWords] = useState(new Set());

  const wordSets = getAllWordSets();

  // Filter word sets based on search term
  const filteredWordSets = wordSets.filter(set => {
    const localizedSet = getLocalizedWordSet(set);
    return localizedSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           localizedSet.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Check if a word is already in user's vocabulary
  const isWordInVocabulary = (norwegianWord) => {
    return words.some(word => 
      word.norwegian.toLowerCase() === norwegianWord.toLowerCase()
    );
  };

  // Get progress for a word set
  const getSetProgress = (wordSet) => {
    const totalWords = wordSet.words.length;
    const learnedWords = wordSet.words.filter(word => 
      isWordInVocabulary(word.norwegian)
    ).length;
    return { learnedWords, totalWords, percentage: (learnedWords / totalWords) * 100 };
  };

  // Import a single word
  const importWord = async (word) => {
    if (importingWords.has(word.norwegian)) return;
    
    setImportingWords(prev => new Set(prev).add(word.norwegian));
    
    try {
      await addWord(word.norwegian, word.english, word.example || '');
    } catch (error) {
      console.error('Error importing word:', error);
    } finally {
      setImportingWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(word.norwegian);
        return newSet;
      });
    }
  };

  // Import entire word set
  const importWordSet = async (wordSet) => {
    const wordsToImport = wordSet.words.filter(word => !isWordInVocabulary(word.norwegian));
    
    for (const word of wordsToImport) {
      await importWord(word);
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  // Handle TTS
  const handleSpeak = async (text) => {
    try {
      await ttsService.speak(text, 'nb-NO');
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  if (selectedSet) {
    const progress = getSetProgress(selectedSet);
    const wordsToImport = selectedSet.words.filter(word => !isWordInVocabulary(word.norwegian));
    const alreadyImported = selectedSet.words.filter(word => isWordInVocabulary(word.norwegian));

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedSet(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>{t('app.back')} {t('wordSets.title')}</span>
              </button>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">{selectedSet.name}</h1>
              <p className="text-gray-600">{selectedSet.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.progressOverview')}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={20} />
                  <span>{progress.learnedWords} learned</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <BookOpen size={20} />
                  <span>{progress.totalWords} {t('wordSets.words')}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(progress.percentage)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {wordsToImport.length > 0 && (
                <button
                  onClick={() => importWordSet(selectedSet)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>{t('wordSets.importAll')} ({wordsToImport.length} {t('wordSets.words')})</span>
                </button>
              )}
              {progress.percentage === 100 && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle size={20} />
                  <span className="font-medium">Complete!</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {alreadyImported.length} already in your vocabulary
            </div>
          </div>
        </div>

        {/* Words Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedSet.words.map((word, index) => {
              const isImported = isWordInVocabulary(word.norwegian);
              const isImporting = importingWords.has(word.norwegian);
              
              return (
                <div
                  key={index}
                  className={`bg-white border rounded-lg p-4 transition-all duration-200 ${
                    isImported 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {word.norwegian}
                        </h3>
                        <button
                          onClick={() => handleSpeak(word.norwegian)}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Listen to pronunciation"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">{word.english}</p>
                      {word.example && (
                        <p className="text-gray-500 text-xs italic mt-2">
                          "{word.example}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {isImported ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-xs font-medium">Added</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => importWord(word)}
                          disabled={isImporting}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                          title="Add to vocabulary"
                        >
                          {isImporting ? (
                            <Clock size={16} className="animate-spin" />
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900">{t('wordSets.title')}</h1>
            <p className="text-gray-600">{t('wordSets.selectSet')}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('search.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Word Sets Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWordSets.map((wordSet) => {
            const localizedSet = getLocalizedWordSet(wordSet);
            const progress = getSetProgress(wordSet);
            const wordsToImport = wordSet.words.filter(word => !isWordInVocabulary(word.norwegian));
            
            return (
              <div
                key={wordSet.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedSet(wordSet)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{wordSet.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {localizedSet.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {wordSet.words.length} {t('wordSets.words')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSet(wordSet);
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    title="View details"
                  >
                    <Eye size={20} />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {localizedSet.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-purple-600">
                      {progress.learnedWords}/{progress.totalWords}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>{progress.learnedWords} learned</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-orange-500" />
                    <span>{wordsToImport.length} {t('wordSets.available')}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    {wordsToImport.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          importWordSet(wordSet);
                        }}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
{t('wordSets.importAll')}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSet(wordSet);
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
{t('wordSets.viewDetails')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWordSets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No word sets found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSets;
