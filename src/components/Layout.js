import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Target, Plus, BarChart3, LogOut, Search, Newspaper, MessageCircle, GraduationCap, Type, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, currentScreen, setScreen, logout, words } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const learnedWords = words.filter(w => w.times_correct >= 3).length;
  const nextReview = words.filter(w => {
    if (!w.next_review) return true;
    return new Date(w.next_review) <= new Date();
  }).length;

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
    { id: 'alphabet', label: 'Alphabet', icon: Type },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'words', label: 'My Words', icon: Plus },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'chat', label: 'Chat', icon: MessageCircle }
  ];

  const handleNavigation = (screenId) => {
    setScreen(screenId);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);




  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar - Desktop & Mobile */}
      <aside className={`
        flex flex-col w-64 fixed inset-y-0 z-50 bg-white border-r border-gray-200
        lg:relative lg:translate-x-0 lg:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-col flex-grow">
          {/* Logo and Welcome */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <img 
                  src="/Logo.png" 
                  alt="NorLearn Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  Welcome, {user?.nickname}!
                </h2>
                <div className="flex space-x-3 text-xs text-gray-600 mt-1">
                  <span>{words.length} words</span>
                  <span>{learnedWords} learned</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavigation(id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentScreen === id
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
            
            {/* Force Learning tab */}
            <button
              onClick={() => handleNavigation('learning')}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentScreen === 'learning'
                  ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">🎓</span>
              <span>Learning</span>
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg font-medium text-sm transition-all duration-200"
            >
              <LogOut size={20} className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0">
        {/* Header - Mobile Only */}
        <header className="lg:hidden bg-white shadow-sm border-b">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu size={20} />
                </button>
                
                <div className="w-8 h-8">
                  <img 
                    src="/Logo.png" 
                    alt="NorLearn Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Welcome, {user?.nickname}!
                  </h2>
                  <div className="flex space-x-3 text-xs text-gray-600">
                    <span>{words.length} words</span>
                    <span>{learnedWords} learned</span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
