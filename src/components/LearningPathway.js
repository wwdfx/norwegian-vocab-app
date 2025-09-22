import React, { useState, useEffect } from 'react';
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
  Award
} from 'lucide-react';
import gamificationService from '../services/gamificationService';
import lessonData from '../data/lessons.json';

const LearningPathway = () => {
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
              <h1 className="text-2xl font-bold">Norwegian Learning Pathway</h1>
              <p className="text-purple-100">Master Norwegian through interactive lessons</p>
            </div>
          </div>
          
          {/* User Stats */}
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.level}</div>
                <div className="text-sm text-purple-100">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.xp}</div>
                <div className="text-sm text-purple-100">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-sm text-purple-100">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {userStats.level}</span>
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
                <h3 className="font-semibold">Daily Bonus Available!</h3>
                <p className="text-sm">Keep your streak going and earn bonus XP</p>
              </div>
            </div>
            <button
              onClick={handleClaimDailyBonus}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Claim +{achievement.xp} XP
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
              <h3 className="font-semibold">Achievement Unlocked!</h3>
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
                    <div className="text-sm opacity-90">Level {chapter.level}</div>
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
                    <span>Progress</span>
                    <span>{progress.completed}/{progress.total} lessons</span>
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
                              {lessonProgress.completed ? 'Review' : 'Start'}
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Lock size={16} />
                              <span className="text-sm">Locked</span>
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

// Lesson Modal Component (placeholder - will be implemented next)
const LessonModal = ({ lesson, onComplete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">{lesson.description}</p>
          
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Lesson exercises will be implemented next!</p>
            <p className="text-sm text-gray-400 mt-2">This lesson is worth {lesson.xp_reward} XP</p>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onComplete(lesson.id, lesson.xp_reward, 100)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Complete Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathway;
