import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle } from 'lucide-react';
import WordTooltip from './WordTooltip';

const Practice = () => {
  const { t } = useTranslation();
  const { words, updateWordProgress } = useApp();
  const [practiceWords, setPracticeWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);

  const currentWord = practiceWords[currentIndex];
  
  // Update options when current word changes (for next question)
  useEffect(() => {
    if (currentWord && words.length > 0 && sessionStarted) {
      const correctAnswer = currentWord.english;
      const wrongAnswers = words
        .filter(w => w.id !== currentWord.id)
        .map(w => w.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      setCurrentOptions(options);
    }
  }, [currentIndex, sessionStarted]); // Only depend on currentIndex and sessionStarted
  
  useEffect(() => {
    // Get words that need review - only run when words array changes length
    if (words.length > 0) {
      const wordsToReview = words.filter(w => {
        if (!w.next_review) return true;
        return new Date(w.next_review) <= new Date();
      });

      setPracticeWords(wordsToReview);
      
      // Initialize options for the first word if we have words to review
      if (wordsToReview.length > 0) {
        const firstWord = wordsToReview[0];
        const correctAnswer = firstWord.english;
        const wrongAnswers = words
          .filter(w => w.id !== firstWord.id)
          .map(w => w.english)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        setCurrentOptions(options);
      }
    }
  }, [words.length]); // Only depend on words.length, not the entire words array

  const startPractice = () => {
    setSessionStarted(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionComplete(false);
    setScore({ correct: 0, total: 0 });
    setIsProcessing(false);
    setCurrentAnswerCorrect(false);
    
    // Initialize options for the first word
    if (practiceWords.length > 0) {
      const firstWord = practiceWords[0];
      const correctAnswer = firstWord.english;
      const wrongAnswers = words
        .filter(w => w.id !== firstWord.id)
        .map(w => w.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      setCurrentOptions(options);
    }
  };

  const selectAnswer = async (answer) => {
    if (showResult || isProcessing || !currentWord) return;
    
    setIsProcessing(true);
    setSelectedAnswer(answer);
    
    const isCorrect = answer === currentWord.english;
    setCurrentAnswerCorrect(isCorrect);
    setShowResult(true);
    
    // Update score
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    // Update word progress
    await updateWordProgress(currentWord.id, isCorrect ? 'easy' : 'hard');

    // If incorrect, add the word back to the end of the practice sequence
    if (!isCorrect) {
      setPracticeWords(prev => [...prev, { ...currentWord }]);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= practiceWords.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsProcessing(false);
      setCurrentAnswerCorrect(false);
      setCurrentOptions([]);
    }
  };

  const resetSession = () => {
    setSessionStarted(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionComplete(false);
    setScore({ correct: 0, total: 0 });
    setIsProcessing(false);
    setCurrentAnswerCorrect(false);
    setCurrentOptions([]);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('practice.title')}</h2>
          <p className="text-gray-600 mb-6">
            {t('practice.description')}
          </p>
          {practiceWords.length === 0 ? (
            <div className="text-gray-500">
              <p>{t('practice.noWordsToReview')}</p>
            </div>
          ) : (
            <button
              onClick={startPractice}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200"
            >
{t('practice.startPractice')} ({practiceWords.length} {t('practice.words')})
            </button>
          )}
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
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
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('practice.practiceComplete')}</h2>
          <div className="mb-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">{percentage}%</div>
            <p className="text-gray-600">
{t('practice.scoreMessage', { correct: score.correct, total: score.total })}
            </p>
          </div>
          <button
            onClick={resetSession}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200"
          >
{t('practice.practiceAgain')}
          </button>
        </div>
      </div>
    );
  }

  const options = currentOptions;

  // Don't render if options aren't ready yet
  if (!currentWord || options.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('practice.loading')}</h3>
          <p className="text-gray-600">{t('practice.preparingSession')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('practice.questionProgress', { current: currentIndex + 1, total: practiceWords.length })}</span>
          <span>{t('practice.score')}: {score.correct}/{score.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(((currentIndex + 1) / practiceWords.length) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
{t('practice.questionPrefix')} "
          <WordTooltip 
            norwegianWord={currentWord?.norwegian}
            englishTranslation={currentWord?.english}
            example={currentWord?.example}
            position="top"
          >
            <span className="text-purple-600 font-bold cursor-help hover:text-purple-700 transition-colors">{currentWord?.norwegian}</span>
          </WordTooltip>
          " {t('practice.questionSuffix')}?
        </h3>
        
        <div className="space-y-3">
          {options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left border-2 rounded-xl font-medium transition-all duration-200 ";
            
            if (showResult) {
              if (option === currentWord?.english) {
                buttonClass += "border-green-500 bg-green-50 text-green-700";
              } else if (option === selectedAnswer && !currentAnswerCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
              }
            } else {
              if (option === selectedAnswer) {
                buttonClass += "border-purple-500 bg-purple-50 text-purple-700";
              } else if (isProcessing) {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed";
              } else {
                buttonClass += "border-gray-200 hover:border-purple-300 hover:bg-purple-50";
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => selectAnswer(option)}
                className={buttonClass}
                disabled={showResult || isProcessing}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Display */}
      {showResult && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            {currentAnswerCorrect ? (
              <>
                <CheckCircle className="text-green-500" size={24} />
                <span className="text-green-600 font-semibold">{t('practice.correct')}</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" size={24} />
                <span className="text-red-600 font-semibold">{t('practice.incorrect')}</span>
              </>
            )}
          </div>
          
          {currentWord?.example && (
            <p className="text-gray-600 italic">
              "{currentWord.example}"
            </p>
          )}
          
          <p className="text-sm text-gray-500">
{currentAnswerCorrect ? t('practice.greatJob') : t('practice.wordAddedBack')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Practice;
