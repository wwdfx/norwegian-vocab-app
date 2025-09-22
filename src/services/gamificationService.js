class GamificationService {
  constructor() {
    this.storageKey = 'norlearn_gamification';
    this.initializeUserProgress();
  }

  // Initialize user progress if it doesn't exist
  initializeUserProgress() {
    if (!this.getUserProgress()) {
      const initialProgress = {
        level: 1,
        xp: 0,
        totalXp: 0,
        streak: 0,
        longestStreak: 0,
        lastPracticeDate: null,
        completedLessons: [],
        completedChapters: [],
        achievements: [],
        lessonProgress: {},
        chapterProgress: {},
        statistics: {
          lessonsCompleted: 0,
          exercisesCompleted: 0,
          correctAnswers: 0,
          totalAnswers: 0,
          timeSpent: 0
        }
      };
      this.saveUserProgress(initialProgress);
    }
  }

  // Get user progress from localStorage
  getUserProgress() {
    try {
      const progress = localStorage.getItem(this.storageKey);
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('Error reading gamification progress:', error);
      return null;
    }
  }

  // Save user progress to localStorage
  saveUserProgress(progress) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving gamification progress:', error);
    }
  }

  // Calculate XP needed for next level
  getXpForNextLevel(currentLevel) {
    // Exponential XP growth: Level 1->2: 100 XP, Level 2->3: 200 XP, etc.
    return currentLevel * 100;
  }

  // Calculate current level based on XP
  calculateLevel(xp) {
    let level = 1;
    let xpNeeded = 0;
    
    while (xp >= xpNeeded) {
      xpNeeded += level * 100;
      level++;
    }
    
    return level - 1;
  }

  // Award XP for completing exercises
  awardXp(amount, reason = 'Exercise completed') {
    const progress = this.getUserProgress();
    if (!progress) return;

    progress.xp += amount;
    progress.totalXp += amount;
    
    // Check for level up
    const newLevel = this.calculateLevel(progress.xp);
    const leveledUp = newLevel > progress.level;
    
    if (leveledUp) {
      progress.level = newLevel;
      this.unlockAchievement(`level_${newLevel}`, `Reached Level ${newLevel}!`);
    }

    // Update streak
    this.updateStreak();

    this.saveUserProgress(progress);

    return {
      newXp: progress.xp,
      newLevel: progress.level,
      leveledUp,
      xpGained: amount
    };
  }

  // Update daily streak
  updateStreak() {
    const progress = this.getUserProgress();
    if (!progress) return;

    const today = new Date().toDateString();
    const lastDate = progress.lastPracticeDate ? new Date(progress.lastPracticeDate).toDateString() : null;

    if (lastDate === today) {
      // Already practiced today
      return;
    }

    if (lastDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      // Consecutive day
      progress.streak++;
    } else if (lastDate !== today) {
      // Missed a day, reset streak
      progress.streak = 1;
    } else {
      // First time practicing
      progress.streak = 1;
    }

    // Update longest streak
    if (progress.streak > progress.longestStreak) {
      progress.longestStreak = progress.streak;
      this.unlockAchievement('streak_master', `New longest streak: ${progress.longestStreak} days!`);
    }

    progress.lastPracticeDate = new Date().toISOString();
    this.saveUserProgress(progress);
  }

  // Mark lesson as completed
  completeLesson(lessonId, xpEarned, accuracy) {
    const progress = this.getUserProgress();
    if (!progress) return;

    // Check if lesson already completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.statistics.lessonsCompleted++;
      
      // Award XP
      const xpResult = this.awardXp(xpEarned, `Lesson completed: ${lessonId}`);
      
      // Update lesson progress
      progress.lessonProgress[lessonId] = {
        completed: true,
        completedAt: new Date().toISOString(),
        xpEarned,
        accuracy,
        attempts: 1
      };

      // Check for chapter completion
      this.checkChapterCompletion(lessonId);
      
      this.saveUserProgress(progress);
      return xpResult;
    } else {
      // Lesson already completed, just update progress
      progress.lessonProgress[lessonId].attempts++;
      progress.lessonProgress[lessonId].lastAttempt = new Date().toISOString();
      this.saveUserProgress(progress);
      return { alreadyCompleted: true };
    }
  }

  // Check if chapter is completed
  checkChapterCompletion(lessonId) {
    // This would need to be implemented based on your lesson structure
    // For now, we'll just track individual lesson completion
  }

  // Record exercise completion
  recordExercise(exerciseId, correct, timeSpent) {
    const progress = this.getUserProgress();
    if (!progress) return;

    progress.statistics.exercisesCompleted++;
    progress.statistics.totalAnswers++;
    
    if (correct) {
      progress.statistics.correctAnswers++;
    }
    
    progress.statistics.timeSpent += timeSpent || 0;
    
    this.saveUserProgress(progress);
  }

  // Unlock achievements
  unlockAchievement(achievementId, message) {
    const progress = this.getUserProgress();
    if (!progress) return;

    if (!progress.achievements.includes(achievementId)) {
      progress.achievements.push(achievementId);
      this.saveUserProgress(progress);
      
      // Return achievement info for UI display
      return {
        id: achievementId,
        message,
        unlocked: true
      };
    }
    
    return null;
  }

  // Get user statistics
  getUserStatistics() {
    const progress = this.getUserProgress();
    if (!progress) return null;

    const accuracy = progress.statistics.totalAnswers > 0 
      ? Math.round((progress.statistics.correctAnswers / progress.statistics.totalAnswers) * 100)
      : 0;

    return {
      level: progress.level,
      xp: progress.xp,
      totalXp: progress.totalXp,
      xpForNextLevel: this.getXpForNextLevel(progress.level),
      streak: progress.streak,
      longestStreak: progress.longestStreak,
      lessonsCompleted: progress.statistics.lessonsCompleted,
      exercisesCompleted: progress.statistics.exercisesCompleted,
      accuracy,
      timeSpent: progress.statistics.timeSpent,
      achievements: progress.achievements.length
    };
  }

  // Get progress for specific lesson
  getLessonProgress(lessonId) {
    const progress = this.getUserProgress();
    if (!progress) return null;

    return progress.lessonProgress[lessonId] || {
      completed: false,
      attempts: 0,
      xpEarned: 0,
      accuracy: 0
    };
  }

  // Get progress for specific chapter
  getChapterProgress(chapterId) {
    const progress = this.getUserProgress();
    if (!progress) return null;

    // This would need to be calculated based on lessons in the chapter
    return {
      completed: false,
      lessonsCompleted: 0,
      totalLessons: 0,
      progress: 0
    };
  }

  // Reset user progress (for testing or fresh start)
  resetProgress() {
    localStorage.removeItem(this.storageKey);
    this.initializeUserProgress();
  }

  // Export progress data
  exportProgress() {
    const progress = this.getUserProgress();
    if (!progress) return null;

    const exportData = {
      ...progress,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    return exportData;
  }

  // Import progress data
  importProgress(data) {
    try {
      // Validate imported data
      if (data && typeof data === 'object' && data.level && data.xp !== undefined) {
        this.saveUserProgress(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing progress:', error);
      return false;
    }
  }

  // Get daily bonus (bonus XP for daily practice)
  getDailyBonus() {
    const progress = this.getUserProgress();
    if (!progress) return 0;

    const today = new Date().toDateString();
    const lastDate = progress.lastPracticeDate ? new Date(progress.lastPracticeDate).toDateString() : null;

    if (lastDate === today) {
      // Already received bonus today
      return 0;
    }

    // Calculate bonus based on streak
    const bonus = Math.min(progress.streak * 5, 50); // Max 50 XP bonus
    return bonus;
  }

  // Claim daily bonus
  claimDailyBonus() {
    const bonus = this.getDailyBonus();
    if (bonus > 0) {
      const result = this.awardXp(bonus, 'Daily bonus claimed!');
      this.unlockAchievement('daily_practitioner', 'Completed daily practice!');
      return result;
    }
    return null;
  }
}

// Create singleton instance
const gamificationService = new GamificationService();

export default gamificationService;
