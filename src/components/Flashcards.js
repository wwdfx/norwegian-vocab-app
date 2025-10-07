import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import ttsService from '../services/tts';
import { Volume2, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import WordTooltip from './WordTooltip';

const Flashcards = () => {
  const { t } = useTranslation();
  const { words, updateWordProgressForFlashcards } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (sessionStarted && currentIndex >= words.length) {
      setSessionComplete(true);
    }
  }, [currentIndex, words.length, sessionStarted]);

  const startSession = () => {
    setSessionStarted(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
    setIsFlipped(false);
  };

  const rateDifficulty = async (difficulty) => {
    if (currentWord) {
      console.log(`Rating word "${currentWord.norwegian}" as ${difficulty}`);
      await updateWordProgressForFlashcards(currentWord.id, difficulty);
      console.log('Moving to next card...');
      nextCard();
    }
  };

  const speakWord = async () => {
    if (currentWord) {
      try {
        await ttsService.speak(currentWord.norwegian, 'nb-NO');
      } catch (error) {
        console.error('TTS Error:', error);
      }
    }
  };

  const resetSession = () => {
    setSessionStarted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };

  if (!sessionStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16">
              <img 
                src={`${process.env.PUBLIC_URL}/Logo.png`}
                alt="NorLearn Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('flashcards.title')}</h2>
          <p className="text-gray-600 mb-6">
            {t('flashcards.description')}
          </p>
          {words.length === 0 ? (
            <div className="text-gray-500">
              <p>{t('flashcards.noWords')}</p>
            </div>
          ) : (
            <button
              onClick={startSession}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200"
            >
{t('flashcards.startSession')} ({words.length} {t('flashcards.words')})
            </button>
          )}
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16">
              <img 
                src={`${process.env.PUBLIC_URL}/Logo.png`}
                alt="NorLearn Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('flashcards.sessionComplete')}</h2>
          <p className="text-gray-600 mb-6">
            {t('flashcards.sessionCompleteDesc')}
          </p>
          <button
            onClick={resetSession}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200"
          >
{t('flashcards.startNewSession')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('flashcards.cardProgress', { current: currentIndex + 1, total: words.length })}</span>
          <span>{Math.round(((currentIndex + 1) / words.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <div 
          className={`bg-white rounded-xl shadow-lg p-8 min-h-[300px] cursor-pointer transform transition-transform duration-500 hover:-translate-y-2 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={(e) => {
            // Flip the card when clicking anywhere on it, except on interactive elements
            if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('select')) {
              flipCard();
            }
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center card-content">
              <WordTooltip 
                norwegianWord={currentWord?.norwegian}
                englishTranslation={currentWord?.english}
                example={currentWord?.example}
                position="top"
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-6 cursor-help hover:text-purple-600 transition-colors">
                  {currentWord?.norwegian}
                </h3>
              </WordTooltip>
              <p className="text-sm text-gray-400 mb-4">Click anywhere on the card to flip</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  speakWord();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    speakWord();
                  }
                }}
                className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 relative z-10"
                title="Listen to pronunciation (or press P)"
                aria-label="Listen to pronunciation"
                type="button"
              >
                <Volume2 size={24} />
              </button>
            </div>
          </div>
          
          <div className={`absolute inset-0 p-8 text-center transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
            <div className="card-content">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {currentWord?.english}
              </h3>
              {currentWord?.example && (
                <p className="text-gray-600 italic text-lg">
                  "{currentWord.example}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 space-y-4">
        {!isFlipped ? (
          <button
            onClick={flipCard}
            className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
{t('flashcards.showAnswer')}
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600 font-medium">
{t('flashcards.rateDifficulty')}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => rateDifficulty('hard')}
                className="flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                <XCircle size={20} />
                <span>{t('flashcards.hard')}</span>
              </button>
              <button
                onClick={() => rateDifficulty('medium')}
                className="flex items-center justify-center space-x-2 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
              >
                <Clock size={20} />
                <span>{t('flashcards.medium')}</span>
              </button>
              <button
                onClick={() => rateDifficulty('easy')}
                className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                <CheckCircle size={20} />
                <span>{t('flashcards.easy')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;

