import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Target, Plus, TrendingUp, Clock, RefreshCw, Wifi, WifiOff, Search, Newspaper, MessageCircle, Download, GraduationCap } from 'lucide-react';
import WordTooltip from './WordTooltip';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';

const Dashboard = () => {
  const { 
    words, 
    setScreen, 
    user, 
    refreshUserData, 
    loadUserWords,
    offlineService,
    backupReminderService
  } = useApp();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState(offlineService.getStatusInfo());

  // Calculate learned words (words with at least 2 correct answers)
  const learnedWords = words.filter(w => (w.times_correct || 0) >= 2).length;
  
  // Calculate words that need review (due for review or never reviewed)
  const nextReview = words.filter(w => {
    if (!w.next_review) return true; // Never reviewed
    return new Date(w.next_review) <= new Date(); // Due for review
  }).length;
  
  // Calculate practice streak from user data
  const practiceStreak = user?.practice_streak || 0;
  
  // Calculate total practice sessions
  const totalPracticeSessions = words.reduce((total, word) => total + (word.times_reviewed || 0), 0);
  
  // Calculate average accuracy
  const totalCorrect = words.reduce((total, word) => total + (word.times_correct || 0), 0);
  const averageAccuracy = totalPracticeSessions > 0 ? Math.round((totalCorrect / totalPracticeSessions) * 100) : 0;

  // Listen for connection changes and backup reminders
  useEffect(() => {
    const handleConnectionChange = () => {
      setOfflineStatus(offlineService.getStatusInfo());
    };

    const handleBackupReminder = (event) => {
      if (event.detail.action === 'export') {
        // Trigger export functionality
        console.log('Backup reminder triggered export');
      }
    };

    window.addEventListener('connectionChange', handleConnectionChange);
    window.addEventListener('backupReminder', handleBackupReminder);

    return () => {
      window.removeEventListener('connectionChange', handleConnectionChange);
      window.removeEventListener('backupReminder', handleBackupReminder);
    };
  }, []);

  // Refresh dashboard data
  const refreshDashboard = async () => {
    try {
      setIsRefreshing(true);
      await refreshUserData();
      await loadUserWords();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = [
    {
      title: 'Total Words',
      value: words.length,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Learned',
      value: learnedWords,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Practice Streak',
      value: `${practiceStreak} days`,
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Next Review',
      value: `${nextReview} words`,
      icon: Target,
      color: 'bg-purple-500'
    }
  ];

  const quickActions = [
    {
      title: 'Start Learning',
      description: 'Follow the structured Norwegian learning pathway',
      icon: GraduationCap,
      action: () => setScreen('learning'),
      color: 'border-purple-200 hover:border-purple-400'
    },
    {
      title: 'Search Dictionary',
      description: 'Discover new Norwegian words using the official API',
      icon: Search,
      action: () => setScreen('search'),
      color: 'border-indigo-200 hover:border-indigo-400'
    },
    {
      title: 'Study Flashcards',
      description: 'Review your vocabulary with interactive flashcards',
      icon: BookOpen,
      action: () => setScreen('flashcards'),
      color: 'border-blue-200 hover:border-blue-400'
    },
    {
      title: 'Practice Mode',
      description: 'Test your knowledge with spaced repetition',
      icon: Target,
      action: () => setScreen('practice'),
      color: 'border-green-200 hover:border-green-400'
    },
    {
      title: 'Add Words',
      description: 'Expand your vocabulary with new words',
      icon: Plus,
      action: () => setScreen('words'),
      color: 'border-purple-200 hover:border-purple-400'
    },
    {
      title: 'Read News',
      description: 'Learn Norwegian vocabulary in real news context',
      icon: Newspaper,
      action: () => setScreen('news'),
      color: 'border-orange-200 hover:border-orange-400'
    },
    {
      title: 'AI Chat',
      description: 'Practice Norwegian conversation with AI assistance',
      icon: MessageCircle,
      action: () => setScreen('chat'),
      color: 'border-pink-200 hover:border-pink-400'
    }
  ];

  // Show loading skeleton while initializing
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
        <SkeletonLoader type="text" lines={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with Logo */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-full p-2">
            <img 
              src="/Logo.png" 
              alt="NorLearn Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to NorLearn!</h1>
            <p className="text-purple-100">
              Ready to continue your Norwegian learning journey? Let's review your progress.
            </p>
          </div>
        </div>
      </div>

      {/* Offline Status Indicator */}
      {!offlineStatus.isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <WifiOff className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">You're offline</h3>
              <p className="text-sm text-yellow-700">
                Some features may be limited. Flashcards and practice mode are still available.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      {words.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
            <button
              onClick={refreshDashboard}
              disabled={isRefreshing}
              className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh progress data"
            >
              {isRefreshing ? (
                <LoadingSpinner size="sm" color="purple" />
              ) : (
                <RefreshCw size={16} />
              )}
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">{totalPracticeSessions}</div>
              <div className="text-sm text-gray-600">Total Practice Sessions</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">{averageAccuracy}%</div>
              <div className="text-sm text-gray-600">Average Accuracy</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{words.length - learnedWords}</div>
              <div className="text-sm text-gray-600">Still Learning</div>
            </div>
          </div>
          
          {/* Progress Explanation */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 How Progress Works</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Learned:</strong> Words you've answered correctly at least 2 times</p>
              <p><strong>Practice Streak:</strong> Consecutive days you've practiced</p>
              <p><strong>Next Review:</strong> Words due for practice based on spaced repetition</p>
              <p><strong>Average Accuracy:</strong> Your success rate across all practice sessions</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`bg-white rounded-xl shadow-sm p-6 text-left border-2 ${action.color} transition-all duration-200 hover:shadow-md hover:-translate-y-1`}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <action.icon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {action.description}
            </p>
          </button>
        ))}
      </div>

      {/* PWA Installation Guide */}
      {typeof window !== 'undefined' && !window.matchMedia('(display-mode: standalone)').matches && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 mb-6 border border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Download size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Install NorLearn as an App
              </h3>
              <p className="text-gray-600 mb-4">
                Get the full app experience with offline access, home screen icon, and native app feel.
              </p>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-medium text-gray-900 mb-2">How to Install:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                    <span><strong>Chrome/Edge:</strong> Click the install icon in the address bar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                    <span><strong>Safari:</strong> Tap Share → Add to Home Screen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                    <span><strong>Mobile:</strong> Look for the install prompt below</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {words.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Words</h3>
          <div className="space-y-3">
            {words.slice(0, 5).map((word) => (
              <div key={word.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <WordTooltip 
                    norwegianWord={word.norwegian}
                    englishTranslation={word.english}
                    example={word.example}
                    position="top"
                  >
                    <span className="font-medium text-gray-900 cursor-help hover:text-purple-600 transition-colors">{word.norwegian}</span>
                  </WordTooltip>
                  <span className="text-gray-600 ml-2">- {word.english}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {word.times_correct || 0}/{word.times_reviewed || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
