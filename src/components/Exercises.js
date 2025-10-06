import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Play, 
  CheckCircle, 
  X,
  Volume2,
  RotateCcw
} from 'lucide-react';
import gamificationService from '../services/gamificationService';
import ttsService from '../services/tts';
import exerciseData from '../data/exercises.json';

const Exercises = () => {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());

  useEffect(() => {
    // Load user statistics
    const stats = gamificationService.getUserStatistics();
    setUserStats(stats);
    
    // Load completed exercises from localStorage
    const savedCompleted = localStorage.getItem('completedExercises');
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        setCompletedExercises(new Set(parsed));
      } catch (error) {
        console.error('Error loading completed exercises:', error);
      }
    }
  }, []);

  // Handle exercise start
  const handleExerciseStart = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentDialogueIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setExerciseScore(0);
    setShowExerciseModal(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (dialogueIndex, blankIndex, answer) => {
    let key;
    
    // Handle different exercise types
    if (typeof dialogueIndex === 'string') {
      // For numbers exercise, dialogueIndex is actually the key
      key = dialogueIndex;
    } else {
      // For dialogue and sentence exercises
      key = `${dialogueIndex}-${blankIndex}`;
    }
    
    setUserAnswers(prev => ({
      ...prev,
      [key]: answer
    }));
  };

  // Check if all blanks are filled AND correct
  const areAllBlanksCorrect = () => {
    if (!selectedExercise) return false;
    
    let totalBlanks = 0;
    let correctBlanks = 0;
    
    if (selectedExercise.type === 'fill_blanks_dialogue') {
      selectedExercise.content.dialogue.forEach((dialogue, dialogueIndex) => {
        dialogue.blanks.forEach((blank, blankIndex) => {
          totalBlanks++;
          const key = `${dialogueIndex}-${blankIndex}`;
          const userAnswer = userAnswers[key]?.toLowerCase().trim();
          const correctAnswer = blank.correct_answer.toLowerCase().trim();
          if (userAnswer && userAnswer === correctAnswer) {
            correctBlanks++;
          }
        });
      });
    } else if (selectedExercise.type === 'fill_blanks_sentences') {
      selectedExercise.content.sentences.forEach((sentence, sentenceIndex) => {
        totalBlanks++;
        const key = `${sentenceIndex}-0`;
        const userAnswer = userAnswers[key]?.toLowerCase().trim();
        const correctAnswer = sentence.correct_answer.toLowerCase().trim();
        if (userAnswer && userAnswer === correctAnswer) {
          correctBlanks++;
        }
      });
    } else if (selectedExercise.type === 'numbers_practice') {
      // Check fill_numbers section
      selectedExercise.content.fill_numbers.forEach((item, index) => {
        totalBlanks++;
        const key = `fill_num_${index}`;
        const userAnswer = userAnswers[key]?.toLowerCase().trim();
        const correctAnswer = item.correct_answer.toLowerCase().trim();
        if (userAnswer && userAnswer === correctAnswer) {
          correctBlanks++;
        }
      });
      
      // Check write_letters section
      selectedExercise.content.write_letters.forEach((item, index) => {
        totalBlanks++;
        const key = `write_word_${index}`;
        const userAnswer = userAnswers[key]?.toLowerCase().trim();
        const correctAnswer = item.correct_answer.toLowerCase().trim();
        if (userAnswer && userAnswer === correctAnswer) {
          correctBlanks++;
        }
      });
    }
    
    return totalBlanks > 0 && totalBlanks === correctBlanks;
  };

  // Check if all blanks are filled (regardless of correctness)
  const areAllBlanksFilled = () => {
    if (!selectedExercise) return false;
    
    let totalBlanks = 0;
    let filledBlanks = 0;
    
    if (selectedExercise.type === 'fill_blanks_dialogue') {
      selectedExercise.content.dialogue.forEach((dialogue, dialogueIndex) => {
        dialogue.blanks.forEach((blank, blankIndex) => {
          totalBlanks++;
          const key = `${dialogueIndex}-${blankIndex}`;
          if (userAnswers[key] && userAnswers[key].trim().length > 0) {
            filledBlanks++;
          }
        });
      });
    } else if (selectedExercise.type === 'fill_blanks_sentences') {
      selectedExercise.content.sentences.forEach((sentence, sentenceIndex) => {
        totalBlanks++;
        const key = `${sentenceIndex}-0`;
        if (userAnswers[key] && userAnswers[key].trim().length > 0) {
          filledBlanks++;
        }
      });
    } else if (selectedExercise.type === 'numbers_practice') {
      // Check fill_numbers section
      selectedExercise.content.fill_numbers.forEach((item, index) => {
        totalBlanks++;
        const key = `fill_num_${index}`;
        if (userAnswers[key] && userAnswers[key].trim().length > 0) {
          filledBlanks++;
        }
      });
      
      // Check write_letters section
      selectedExercise.content.write_letters.forEach((item, index) => {
        totalBlanks++;
        const key = `write_word_${index}`;
        if (userAnswers[key] && userAnswers[key].trim().length > 0) {
          filledBlanks++;
        }
      });
    }
    
    return totalBlanks === filledBlanks;
  };

  // Check if an individual answer is correct
  const isAnswerCorrect = (dialogueIndex, blankIndex, sentenceIndex = null, numbersType = null, numbersIndex = null) => {
    if (!selectedExercise) return null;
    
    let userAnswer, correctAnswer;
    
    if (selectedExercise.type === 'fill_blanks_dialogue') {
      const key = `${dialogueIndex}-${blankIndex}`;
      userAnswer = userAnswers[key]?.toLowerCase().trim();
      correctAnswer = selectedExercise.content.dialogue[dialogueIndex].blanks[blankIndex].correct_answer.toLowerCase().trim();
    } else if (selectedExercise.type === 'fill_blanks_sentences') {
      const key = `${sentenceIndex}-0`;
      userAnswer = userAnswers[key]?.toLowerCase().trim();
      correctAnswer = selectedExercise.content.sentences[sentenceIndex].correct_answer.toLowerCase().trim();
    } else if (selectedExercise.type === 'numbers_practice') {
      if (numbersType === 'fill_num') {
        const key = `fill_num_${numbersIndex}`;
        userAnswer = userAnswers[key]?.toLowerCase().trim();
        correctAnswer = selectedExercise.content.fill_numbers[numbersIndex].correct_answer.toLowerCase().trim();
      } else if (numbersType === 'write_word') {
        const key = `write_word_${numbersIndex}`;
        userAnswer = userAnswers[key]?.toLowerCase().trim();
        correctAnswer = selectedExercise.content.write_letters[numbersIndex].correct_answer.toLowerCase().trim();
      }
    }
    
    if (!userAnswer) return null; // Not answered yet
    return userAnswer === correctAnswer;
  };

  // Calculate score
  const calculateScore = () => {
    if (!selectedExercise) return 0;
    
    let correct = 0;
    let total = 0;
    
    if (selectedExercise.type === 'fill_blanks_dialogue') {
      selectedExercise.content.dialogue.forEach((dialogue, dialogueIndex) => {
        dialogue.blanks.forEach((blank, blankIndex) => {
          total++;
          const key = `${dialogueIndex}-${blankIndex}`;
          const userAnswer = userAnswers[key]?.toLowerCase().trim();
          const correctAnswer = blank.correct_answer.toLowerCase().trim();
          if (userAnswer === correctAnswer) {
            correct++;
          }
        });
      });
    } else if (selectedExercise.type === 'fill_blanks_sentences') {
      selectedExercise.content.sentences.forEach((sentence, sentenceIndex) => {
        total++;
        const key = `${sentenceIndex}-0`;
        const userAnswer = userAnswers[key]?.toLowerCase().trim();
        const correctAnswer = sentence.correct_answer.toLowerCase().trim();
        if (userAnswer === correctAnswer) {
          correct++;
        }
      });
    }
    
    return Math.round((correct / total) * 100);
  };

  // Submit exercise
  const handleSubmit = () => {
    // Since users can only submit when all answers are correct, always give 100% score
    setExerciseScore(100);
    setShowResults(true);
    
    // Check if this is the first time completing this exercise
    const isFirstCompletion = !completedExercises.has(selectedExercise.id);
    
    if (isFirstCompletion) {
      // Award full XP only on first completion
      gamificationService.awardXp(selectedExercise.xp_reward, 'exercise_completed');
      
      // Mark exercise as completed
      const newCompleted = new Set(completedExercises);
      newCompleted.add(selectedExercise.id);
      setCompletedExercises(newCompleted);
      
      // Save to localStorage
      localStorage.setItem('completedExercises', JSON.stringify([...newCompleted]));
      
      // Update user stats
      const stats = gamificationService.getUserStatistics();
      setUserStats(stats);
    }
  };

  // Reset exercise
  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
    setExerciseScore(0);
    setCurrentDialogueIndex(0);
    // Note: We don't remove from completedExercises to allow retaking without XP
  };

  // Close modal
  const handleClose = () => {
    setShowExerciseModal(false);
    setSelectedExercise(null);
    setUserAnswers({});
    setShowResults(false);
    setExerciseScore(0);
    setCurrentDialogueIndex(0);
  };

  // Speak text
  const speakText = (text) => {
    ttsService.speak(text);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('exercises.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('exercises.subtitle')}
            </p>
          </div>
        </div>
        
        {/* User Stats */}
        {userStats && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
              <Star className="w-4 h-4" />
              <span>{userStats.level}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
              <Trophy className="w-4 h-4" />
              <span>{userStats.xp} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Exercises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exerciseData.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleExerciseStart(exercise)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {completedExercises.has(exercise.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {exercise.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {completedExercises.has(exercise.id) ? (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {t('exercises.completed')}
                      </span>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{exercise.xp_reward} XP</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {exercise.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Level {exercise.level}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {exercise.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Modal */}
      {showExerciseModal && selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedExercise.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedExercise.instructions}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {!showResults ? (
                <div className="space-y-6">
                  {/* Example */}
                  {selectedExercise.example && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        {t('exercises.example')}
                      </h3>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        {selectedExercise.type === 'fill_blanks_dialogue' ? (
                          <>
                            Ken kommer fra England.{' '}
                            <strong>Han</strong>{' '}
                            er 23 år gammel. (Ken comes from England. He is 23 years old.)
                          </>
                        ) : (
                          <>
                            Jeg <strong>bor</strong> i Norge. (I live in Norway.)
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Exercise Content */}
                  <div className="space-y-4">
                    {selectedExercise.type === 'fill_blanks_dialogue' ? (
                      /* Dialogue Exercise */
                      selectedExercise.content.dialogue.map((dialogue, dialogueIndex) => (
                      <div key={dialogueIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {dialogue.speaker}:
                          </span>
                          <button
                            onClick={() => speakText(dialogue.text)}
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-gray-700 dark:text-gray-300">
                          {dialogue.blanks.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {dialogue.text.split('[BLANK]').map((part, partIndex) => (
                                <React.Fragment key={partIndex}>
                                  {part}
                                  {partIndex < dialogue.blanks.length && (
                                    <input
                                      type="text"
                                      value={userAnswers[`${dialogueIndex}-${partIndex}`] || ''}
                                      onChange={(e) => handleAnswerSelect(dialogueIndex, partIndex, e.target.value)}
                                      placeholder="Type answer..."
                                      className={`border rounded px-2 py-1 text-sm focus:ring-2 focus:border-transparent min-w-[80px] max-w-[100px] ${
                                        isAnswerCorrect(dialogueIndex, partIndex) === true
                                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 focus:ring-green-500'
                                          : isAnswerCorrect(dialogueIndex, partIndex) === false
                                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 focus:ring-red-500'
                                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500'
                                      }`}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          ) : (
                            dialogue.text
                          )}
                        </div>
                      </div>
                      ))
                    ) : selectedExercise.type === 'fill_blanks_sentences' ? (
                      /* Sentence Exercise */
                      selectedExercise.content.sentences.map((sentence, sentenceIndex) => (
                        <div key={sentenceIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="text-gray-700 dark:text-gray-300">
                            <div className="flex flex-wrap items-center gap-2">
                              {sentence.text.split('[BLANK]').map((part, partIndex) => (
                                <React.Fragment key={partIndex}>
                                  {part}
                                  {partIndex < 1 && (
                                    <input
                                      type="text"
                                      value={userAnswers[`${sentenceIndex}-0`] || ''}
                                      onChange={(e) => handleAnswerSelect(sentenceIndex, 0, e.target.value)}
                                      placeholder="Type answer..."
                                      className={`border rounded px-2 py-1 text-sm focus:ring-2 focus:border-transparent min-w-[80px] max-w-[100px] ${
                                        isAnswerCorrect(null, null, sentenceIndex) === true
                                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 focus:ring-green-500'
                                          : isAnswerCorrect(null, null, sentenceIndex) === false
                                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 focus:ring-red-500'
                                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500'
                                      }`}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : selectedExercise.type === 'numbers_practice' && (
                      /* Numbers Practice Exercise */
                      <div className="space-y-6">
                        {/* Fill in Numbers Section */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
                            {t('exercises.fillNumbers')}
                          </h3>
                          <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                            {t('exercises.writeUsingNumbers')} <strong>2</strong> = to
                          </p>
                          
                          <div className="space-y-3">
                            {selectedExercise.content.fill_numbers.map((item, index) => (
                              <div key={item.id} className="flex items-center space-x-3">
                                <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded font-medium min-w-[60px] text-center">
                                  {item.norwegian_word}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">=</span>
                                <input
                                  type="text"
                                  value={userAnswers[`fill_num_${index}`] || ''}
                                  onChange={(e) => handleAnswerSelect(`fill_num_${index}`, 0, e.target.value)}
                                  placeholder="Type number..."
                                  className={`border rounded px-3 py-1 text-sm focus:ring-2 focus:border-transparent min-w-[60px] text-center ${
                                    isAnswerCorrect(null, null, null, 'fill_num', index) === true
                                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 focus:ring-green-500'
                                      : isAnswerCorrect(null, null, null, 'fill_num', index) === false
                                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 focus:ring-red-500'
                                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Write in Letters Section */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4">
                            {t('exercises.writeInLetters')}
                          </h3>
                          <p className="text-sm text-purple-700 dark:text-purple-200 mb-4">
                            {t('exercises.example')}: <strong>elleve</strong> = 11
                          </p>
                          
                          <div className="space-y-3">
                            {selectedExercise.content.write_letters.map((item, index) => (
                              <div key={item.id} className="flex items-center space-x-3">
                                <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded font-medium min-w-[60px] text-center">
                                  {item.number}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">=</span>
                                <input
                                  type="text"
                                  value={userAnswers[`write_word_${index}`] || ''}
                                  onChange={(e) => handleAnswerSelect(`write_word_${index}`, 0, e.target.value)}
                                  placeholder="Type word..."
                                  className={`border rounded px-3 py-1 text-sm focus:ring-2 focus:border-transparent min-w-[80px] ${
                                    isAnswerCorrect(null, null, null, 'write_word', index) === true
                                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 focus:ring-green-500'
                                      : isAnswerCorrect(null, null, null, 'write_word', index) === false
                                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 focus:ring-red-500'
                                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Results */
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      exerciseScore >= 70 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      <Trophy className={`w-8 h-8 ${
                        exerciseScore >= 70 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {exerciseScore}% {t('exercises.completed')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {exerciseScore >= 90 ? t('exercises.excellent') :
                       exerciseScore >= 70 ? t('exercises.good') :
                       exerciseScore >= 50 ? t('exercises.needsWork') : t('exercises.tryAgain')}
                    </p>
                  </div>

                  {/* Detailed Results */}
                  <div className="space-y-4">
                    {selectedExercise.type === 'fill_blanks_dialogue' && selectedExercise.content.dialogue && (
                      /* Dialogue Results */
                      selectedExercise.content.dialogue.map((dialogue, dialogueIndex) => (
                      <div key={dialogueIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {dialogue.speaker}:
                          </span>
                        </div>
                        
                        <div className="text-gray-700 dark:text-gray-300">
                          {dialogue.blanks.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {dialogue.text.split('[BLANK]').map((part, partIndex) => (
                                <React.Fragment key={partIndex}>
                                  {part}
                                  {partIndex < dialogue.blanks.length && (
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                                      userAnswers[`${dialogueIndex}-${partIndex}`]?.toLowerCase().trim() === dialogue.blanks[partIndex].correct_answer.toLowerCase().trim()
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    }`}>
                                      {userAnswers[`${dialogueIndex}-${partIndex}`] || '?'}
                                      {userAnswers[`${dialogueIndex}-${partIndex}`]?.toLowerCase().trim() !== dialogue.blanks[partIndex].correct_answer.toLowerCase().trim() && (
                                        <span className="ml-1 text-xs opacity-75">
                                          ({dialogue.blanks[partIndex].correct_answer})
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          ) : (
                            dialogue.text
                          )}
                        </div>
                      </div>
                      ))
                    )}
                    
                    {selectedExercise.type === 'fill_blanks_sentences' && selectedExercise.content.sentences && (
                      /* Sentence Results */
                      selectedExercise.content.sentences.map((sentence, sentenceIndex) => (
                        <div key={sentenceIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="text-gray-700 dark:text-gray-300">
                            <div className="flex flex-wrap items-center gap-2">
                              {sentence.text.split('[BLANK]').map((part, partIndex) => (
                                <React.Fragment key={partIndex}>
                                  {part}
                                  {partIndex < 1 && (
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                                      userAnswers[`${sentenceIndex}-0`]?.toLowerCase().trim() === sentence.correct_answer.toLowerCase().trim()
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    }`}>
                                      {userAnswers[`${sentenceIndex}-0`] || '?'}
                                      {userAnswers[`${sentenceIndex}-0`]?.toLowerCase().trim() !== sentence.correct_answer.toLowerCase().trim() && (
                                        <span className="ml-1 text-xs opacity-75">
                                          ({sentence.correct_answer})
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {selectedExercise.type === 'numbers_practice' && selectedExercise.content.fill_numbers && selectedExercise.content.write_letters && (
                      /* Numbers Practice Results */
                      <div className="space-y-6">
                        {/* Fill Numbers Results */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
                            {t('exercises.fillNumbers')} - {t('exercises.results')}
                          </h3>
                          <div className="space-y-3">
                            {selectedExercise.content.fill_numbers.map((item, index) => (
                              <div key={item.id} className="flex items-center space-x-3">
                                <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded font-medium min-w-[60px] text-center">
                                  {item.norwegian_word}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">=</span>
                                <span className={`px-3 py-1 rounded font-medium min-w-[60px] text-center ${
                                  userAnswers[`fill_num_${index}`]?.toLowerCase().trim() === item.correct_answer.toLowerCase().trim()
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }`}>
                                  {userAnswers[`fill_num_${index}`] || '?'}
                                  {userAnswers[`fill_num_${index}`]?.toLowerCase().trim() !== item.correct_answer.toLowerCase().trim() && (
                                    <span className="ml-1 text-xs opacity-75">
                                      ({item.correct_answer})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Write Letters Results */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4">
                            {t('exercises.writeInLetters')} - {t('exercises.results')}
                          </h3>
                          <div className="space-y-3">
                            {selectedExercise.content.write_letters.map((item, index) => (
                              <div key={item.id} className="flex items-center space-x-3">
                                <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded font-medium min-w-[60px] text-center">
                                  {item.number}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">=</span>
                                <span className={`px-3 py-1 rounded font-medium min-w-[80px] text-center ${
                                  userAnswers[`write_word_${index}`]?.toLowerCase().trim() === item.correct_answer.toLowerCase().trim()
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }`}>
                                  {userAnswers[`write_word_${index}`] || '?'}
                                  {userAnswers[`write_word_${index}`]?.toLowerCase().trim() !== item.correct_answer.toLowerCase().trim() && (
                                    <span className="ml-1 text-xs opacity-75">
                                      ({item.correct_answer})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              {/* XP Information */}
              {selectedExercise && (
                <div className="mb-4 text-center">
                  {completedExercises.has(selectedExercise.id) ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t('exercises.alreadyCompleted')} - {t('exercises.noXpOnRetake')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t('exercises.firstCompletion')} - {selectedExercise.xp_reward} XP {t('exercises.available')}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('exercises.reset')}</span>
                </button>
              
                {!showResults ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!areAllBlanksCorrect()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {areAllBlanksCorrect() ? t('exercises.submit') : t('exercises.fixErrors')}
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('exercises.close')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
