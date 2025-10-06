import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Play, 
  CheckCircle, 
  Lock, 
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Award,
  X
} from 'lucide-react';
import gamificationService from '../services/gamificationService';
import lessonData from '../data/lessons.json';

const LearningPathway = () => {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    // Load user statistics
    const stats = gamificationService.getUserStatistics();
    setUserStats(stats);

    // Check for daily bonus
    const dailyBonus = gamificationService.getDailyBonus();
    if (dailyBonus > 0) {
      setAchievement({
        type: 'daily_bonus',
        message: `Daily bonus available: +${dailyBonus} XP!`,
        xp: dailyBonus
      });
    }
  }, []);

  // Handle chapter selection
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };

  // Handle lesson start
  const handleLessonStart = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  // Handle lesson completion
  const handleLessonComplete = (lessonId, xpEarned, accuracy) => {
    const result = gamificationService.completeLesson(lessonId, xpEarned, accuracy);
    
    if (result && result.leveledUp) {
      setAchievement({
        type: 'level_up',
        message: `🎉 Level Up! You're now Level ${result.newLevel}!`,
        level: result.newLevel
      });
    }

    // Update user stats
    setUserStats(gamificationService.getUserStatistics());
    setShowLessonModal(false);
  };

  // Claim daily bonus
  const handleClaimDailyBonus = () => {
    const result = gamificationService.claimDailyBonus();
    if (result) {
      setAchievement({
        type: 'daily_bonus_claimed',
        message: `+${result.xpGained} XP claimed!`,
        xp: result.xpGained
      });
      setUserStats(gamificationService.getUserStatistics());
    }
  };

  // Check if chapter is unlocked
  const isChapterUnlocked = (chapter) => {
    if (chapter.level === 1) return true;
    
    // Check if previous chapter is completed
    const chapterIndex = lessonData.chapters.findIndex(c => c.id === chapter.id);
    if (chapterIndex === 0) return true;
    
    const previousChapter = lessonData.chapters[chapterIndex - 1];
    const previousProgress = gamificationService.getChapterProgress(previousChapter.id);
    
    return previousProgress && previousProgress.completed;
  };

  // Get chapter progress
  const getChapterProgress = (chapter) => {
    const completedLessons = chapter.lessons.filter(lesson => 
      gamificationService.getLessonProgress(lesson.id).completed
    ).length;
    
    return {
      completed: completedLessons,
      total: chapter.lessons.length,
      percentage: Math.round((completedLessons / chapter.lessons.length) * 100)
    };
  };

  // Get lesson progress
  const getLessonProgress = (lesson) => {
    return gamificationService.getLessonProgress(lesson.id);
  };

  if (!userStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header with User Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full p-2">
              <img 
                src="/Logo.png" 
                alt="NorLearn Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('lessons.title')}</h1>
              <p className="text-purple-100">{t('lessons.subtitle')}</p>
            </div>
          </div>
          
          {/* User Stats */}
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.level}</div>
                <div className="text-sm text-purple-100">{t('lessons.level')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.xp}</div>
                <div className="text-sm text-purple-100">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-sm text-purple-100">{t('lessons.dayStreak')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{t('lessons.level')} {userStats.level}</span>
            <span>{userStats.xp} / {userStats.xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((userStats.xp / userStats.xpForNextLevel) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Daily Bonus Banner */}
      {achievement?.type === 'daily_bonus' && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap size={24} />
              <div>
                <h3 className="font-semibold">{t('lessons.dailyBonusAvailable')}</h3>
                <p className="text-sm">{t('lessons.dailyBonusDesc')}</p>
              </div>
            </div>
            <button
              onClick={handleClaimDailyBonus}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
{t('lessons.claimBonus')} +{achievement.xp} XP
            </button>
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {achievement && achievement.type !== 'daily_bonus' && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white animate-bounce">
          <div className="flex items-center space-x-3">
            <Award size={24} />
            <div>
              <h3 className="font-semibold">{t('lessons.achievementUnlocked')}</h3>
              <p>{achievement.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Learning Chapters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonData.chapters.map((chapter) => {
          const progress = getChapterProgress(chapter);
          const isUnlocked = isChapterUnlocked(chapter);
          
          return (
            <div 
              key={chapter.id}
              className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                isUnlocked ? 'border-purple-200 hover:border-purple-300' : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Chapter Header */}
              <div className={`p-6 rounded-t-xl ${chapter.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{chapter.icon}</div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">{t('lessons.level')} {chapter.level}</div>
                    <div className="text-xs opacity-75">{chapter.theme}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-3">{chapter.title}</h3>
                <p className="text-sm opacity-90 mt-2">{chapter.description}</p>
              </div>

              {/* Chapter Content */}
              <div className="p-6">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{t('lessons.progress')}</span>
                    <span>{progress.completed}/{progress.total} {t('lessons.lessons')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress.percentage === 100 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-3">
                  {chapter.lessons.map((lesson) => {
                    const lessonProgress = getLessonProgress(lesson);
                    
                    return (
                      <div 
                        key={lesson.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          lessonProgress.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {lessonProgress.completed ? (
                            <CheckCircle size={20} className="text-green-600" />
                          ) : (
                            <Play size={20} className="text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{lesson.title}</div>
                            <div className="text-sm text-gray-600">{lesson.description}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-500">{lesson.xp_reward} XP</div>
                          {isUnlocked ? (
                            <button
                              onClick={() => handleLessonStart(lesson)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                lessonProgress.completed
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
{lessonProgress.completed ? t('lessons.review') : t('lessons.start')}
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Lock size={16} />
                              <span className="text-sm">{t('lessons.locked')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chapter Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {progress.completed === progress.total ? (
                        <span className="text-green-600 font-medium">✓ Chapter Complete!</span>
                      ) : (
                        <span>{progress.completed} of {progress.total} lessons completed</span>
                      )}
                    </div>
                    
                    {progress.completed > 0 && (
                      <div className="flex items-center space-x-2">
                        <Star size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(progress.percentage)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp size={24} className="text-purple-600" />
          <span>Your Learning Statistics</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{userStats.lessonsCompleted}</div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{userStats.exercisesCompleted}</div>
            <div className="text-sm text-gray-600">Exercises Done</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{userStats.accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{userStats.achievements}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onComplete={handleLessonComplete}
          onClose={() => setShowLessonModal(false)}
        />
      )}
    </div>
  );
};

// Interactive Lesson Modal Component
const LessonModal = ({ lesson, onComplete, onClose }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [currentSection, setCurrentSection] = useState('exercises'); // 'exercises' or 'vocabulary'
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const totalExercises = lesson.exercises.length;
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;

  // Handle exercise submission
  const handleExerciseSubmit = (exerciseId, answer, isCorrect) => {
    setUserAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    setExerciseResults(prev => ({ ...prev, [exerciseId]: isCorrect }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
      } else {
        // All exercises completed
        setCurrentSection('vocabulary');
        setShowVocabulary(true);
      }
    }, 1500);
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    const accuracy = Math.round((score / totalExercises) * 100);
    const xpEarned = Math.round((accuracy / 100) * lesson.xp_reward);
    onComplete(lesson.id, xpEarned, accuracy);
  };

  // Reset lesson
  const handleResetLesson = () => {
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setExerciseResults({});
    setShowVocabulary(false);
    setCurrentSection('exercises');
    setLessonCompleted(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
              <p className="text-gray-600">{lesson.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                {currentSection === 'exercises' 
                  ? `Exercise ${currentExerciseIndex + 1} of ${totalExercises}`
                  : 'Vocabulary Review'
                }
              </span>
              <span>{lesson.xp_reward} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: currentSection === 'exercises' 
                    ? `${progress}%` 
                    : '100%' 
                }}
              ></div>
            </div>
          </div>

          {/* Exercise Section */}
          {currentSection === 'exercises' && (
            <div className="mb-6">
              <ExerciseComponent
                exercise={currentExercise}
                onSubmit={handleExerciseSubmit}
                result={exerciseResults[currentExercise?.id]}
                userAnswer={userAnswers[currentExercise?.id]}
              />
            </div>
          )}

          {/* Vocabulary Section */}
          {currentSection === 'vocabulary' && (
            <div className="mb-6">
              <VocabularySection
                vocabulary={lesson.vocabulary}
                onComplete={handleLessonComplete}
                onReset={handleResetLesson}
                score={score}
                totalExercises={totalExercises}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Exit Lesson
            </button>
            
            {currentSection === 'exercises' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Score: {score}/{currentExerciseIndex + (exerciseResults[currentExercise?.id] !== undefined ? 1 : 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exercise Component - handles different exercise types
const ExerciseComponent = ({ exercise, onSubmit, result, userAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedAnswer('');
    setShowResult(false);
  }, [exercise.id]);

  // Update showResult when result prop changes
  useEffect(() => {
    if (result !== undefined) {
      setShowResult(true);
    }
  }, [result]);

  // Handle answer submission
  const handleSubmit = () => {
    if (!selectedAnswer && exercise.type !== 'translation') return;
    
    let isCorrect = false;
    
    switch (exercise.type) {
      case 'multiple_choice':
        isCorrect = selectedAnswer === exercise.correct;
        break;
      case 'fill_blanks':
        isCorrect = selectedAnswer.toLowerCase().trim() === exercise.answer.toLowerCase().trim();
        break;
      case 'translation':
        isCorrect = selectedAnswer.toLowerCase().trim() === exercise.english.toLowerCase().trim();
        break;
      case 'word_order':
        isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(exercise.correct_order);
        break;
      default:
        isCorrect = false;
    }
    
    onSubmit(exercise.id, selectedAnswer, isCorrect);
  };

  // Handle TTS for Norwegian text
  const handleSpeak = async (text) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'nb-NO';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  // Render different exercise types
  const renderExercise = () => {
    switch (exercise.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 mb-4">
              {exercise.question}
              {exercise.tts_text && (
                <button
                  onClick={() => handleSpeak(exercise.tts_text)}
                  className="ml-2 text-purple-600 hover:text-purple-700"
                >
                  🔊
                </button>
              )}
            </div>
            <div className="space-y-3">
              {exercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    showResult
                      ? option === exercise.correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : selectedAnswer === option
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                      : selectedAnswer === option
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showResult
                        ? option === exercise.correct
                          ? 'border-green-500 bg-green-500'
                          : selectedAnswer === option
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        : selectedAnswer === option
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {showResult ? (
                        option === exercise.correct ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : selectedAnswer === option ? (
                          <X size={16} className="text-white" />
                        ) : null
                      ) : selectedAnswer === option ? (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      ) : null}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'fill_blanks':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 mb-4">
              {exercise.question}
              {exercise.tts_text && (
                <button
                  onClick={() => handleSpeak(exercise.tts_text)}
                  className="ml-2 text-purple-600 hover:text-purple-700"
                >
                  🔊
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
                className={`flex-1 p-3 border-2 rounded-lg text-lg ${
                  showResult
                    ? result
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                }`}
                placeholder="Type your answer here..."
              />
            </div>
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 mb-4">
              {exercise.question}
              {exercise.tts_text && (
                <button
                  onClick={() => handleSpeak(exercise.tts_text)}
                  className="ml-2 text-purple-600 hover:text-purple-700"
                >
                  🔊
                </button>
              )}
            </div>
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="text-xl font-semibold text-purple-800 mb-2">
                {exercise.norwegian}
              </div>
              <div className="text-gray-600">
                Translate this to English
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
                className={`flex-1 p-3 border-2 rounded-lg text-lg ${
                  showResult
                    ? result
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                }`}
                placeholder="Type the English translation..."
              />
            </div>
          </div>
        );

      case 'word_order':
        return <WordOrderExercise 
          exercise={exercise} 
          onSubmit={onSubmit} 
          showResult={showResult}
          result={result}
        />;

      default:
        return <div>Exercise type not supported</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {renderExercise()}
      
      {/* Explanation */}
      {showResult && (
        <div className={`mt-6 p-4 rounded-lg ${
          result ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start space-x-2">
            {result ? (
              <CheckCircle size={20} className="text-green-600 mt-0.5" />
            ) : (
              <X size={20} className="text-red-600 mt-0.5" />
            )}
            <div>
              <div className={`font-semibold ${
                result ? 'text-green-800' : 'text-red-800'
              }`}>
                {result ? 'Correct!' : 'Not quite right.'}
              </div>
              <div className={`text-sm mt-1 ${
                result ? 'text-green-700' : 'text-red-700'
              }`}>
                {exercise.explanation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {!showResult && (exercise.type !== 'word_order') && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

// Word Order Exercise Component
const WordOrderExercise = ({ exercise, onSubmit, showResult, result }) => {
  const [words, setWords] = useState(exercise.words || []);
  const [selectedWords, setSelectedWords] = useState([]);

  // Reset state when exercise changes
  useEffect(() => {
    setWords(exercise.words || []);
    setSelectedWords([]);
  }, [exercise.id]);

  const handleWordClick = (word) => {
    if (showResult) return;
    setSelectedWords(prev => [...prev, word]);
    setWords(prev => prev.filter(w => w !== word));
  };

  const handleSelectedWordClick = (word) => {
    if (showResult) return;
    setWords(prev => [...prev, word]);
    setSelectedWords(prev => prev.filter(w => w !== word));
  };

  const handleSubmitOrder = () => {
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(exercise.correct_order);
    onSubmit(exercise.id, selectedWords, isCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-900 mb-4">
        {exercise.question}
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Your sentence:</div>
        <div className="min-h-[60px] p-3 bg-white rounded-lg border-2 border-dashed border-purple-300">
          {selectedWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleSelectedWordClick(word)}
              disabled={showResult}
              className="inline-block bg-purple-600 text-white px-3 py-1 rounded-lg mr-2 mb-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Available words:</div>
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              disabled={showResult}
              className="bg-white border-2 border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors disabled:opacity-50"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Show correct answer if wrong */}
      {showResult && !result && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-semibold mb-2">Correct answer:</div>
          <div className="flex flex-wrap gap-2">
            {exercise.correct_order.map((word, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-lg"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedWords.length > 0 && !showResult && (
        <button
          onClick={handleSubmitOrder}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Check Answer
        </button>
      )}
    </div>
  );
};

// Vocabulary Section Component
const VocabularySection = ({ vocabulary, onComplete, onReset, score, totalExercises }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showPronunciation, setShowPronunciation] = useState({});

  const currentWord = vocabulary[currentWordIndex];
  const accuracy = Math.round((score / totalExercises) * 100);

  const handleSpeak = async (text) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'nb-NO';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const togglePronunciation = (word) => {
    setShowPronunciation(prev => ({
      ...prev,
      [word]: !prev[word]
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Results Summary */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h3>
        <div className="flex justify-center space-x-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{vocabulary.length}</div>
            <div className="text-sm text-gray-600">New Words</div>
          </div>
        </div>
      </div>

      {/* Vocabulary Review */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Vocabulary Review</h4>
        
        <div className="space-y-4">
          {vocabulary.map((word, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xl font-semibold text-gray-900">
                  {word.norwegian}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePronunciation(word.norwegian)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {showPronunciation[word.norwegian] ? '🔊' : '🔇'}
                  </button>
                  <button
                    onClick={() => handleSpeak(word.norwegian)}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                  >
                    Listen
                  </button>
                </div>
              </div>
              
              <div className="text-gray-700 mb-2">{word.english}</div>
              
              {showPronunciation[word.norwegian] && (
                <div className="text-sm text-gray-600 mb-2">
                  Pronunciation: {word.pronunciation}
                </div>
              )}
              
              <div className="text-sm text-gray-600 italic">
                Example: {word.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Complete Lesson
        </button>
      </div>
    </div>
  );
};

export default LearningPathway;
