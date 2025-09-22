import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Target, Plus, BarChart3, LogOut, Search, Newspaper, MessageCircle, GraduationCap } from 'lucide-react';
import BottomNavigation from './BottomNavigation';

const Layout = ({ children }) => {
  const { user, currentScreen, setScreen, logout, words } = useApp();

  const learnedWords = words.filter(w => w.times_correct >= 3).length;
  const nextReview = words.filter(w => {
    if (!w.next_review) return true;
    return new Date(w.next_review) <= new Date();
  }).length;

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'words', label: 'My Words', icon: Plus },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'chat', label: 'Chat', icon: MessageCircle }
  ];

  // Force refresh - Learning tab should be visible
  console.log('Layout render - navigation:', navigation);
  console.log('Layout render - navigation count:', navigation.length);
  console.log('Layout render - Learning tab:', navigation.find(item => item.id === 'learning'));



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo and Welcome */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12">
                <img 
                  src="/Logo.png" 
                  alt="NorLearn Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  Welcome, {user?.nickname}!
                </h2>
                <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600 mt-1">
                  <span>{words.length} words</span>
                  <span>{learnedWords} learned</span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -m-2"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation - Hidden on mobile, shown on desktop */}
      <nav className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-start space-x-4 overflow-x-auto pb-2 min-w-full" style={{ minWidth: 'max-content' }}>
            {/* Debug: Show navigation count */}
            <div className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded flex-shrink-0">
              {navigation.length} tabs - Learning: {navigation.find(item => item.id === 'learning')?.label || 'MISSING'}
            </div>
            
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setScreen(id)}
                className={`flex flex-row items-center space-x-2 py-3 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  currentScreen === id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ display: 'flex', visibility: 'visible', opacity: 1 }}
              >
                <Icon size={16} className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
            
            {/* Force Learning tab to be visible */}
            <button
              onClick={() => setScreen('learning')}
              className="flex flex-row items-center space-x-2 py-3 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 border-transparent text-red-600 hover:text-red-700 hover:border-red-300"
              style={{ display: 'flex', visibility: 'visible', opacity: 1 }}
            >
              <span>🎓</span>
              <span>Learning (FORCED)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden">
        <BottomNavigation 
          currentScreen={currentScreen} 
          onNavigate={setScreen} 
        />
      </div>
    </div>
  );
};

export default Layout;
