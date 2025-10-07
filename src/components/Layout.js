import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { BookOpen, Target, Plus, BarChart3, LogOut, Search, Newspaper, MessageCircle, GraduationCap, Type, Menu, X, ChevronDown, ChevronRight, Settings, Star, Bug } from 'lucide-react';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { user, currentScreen, setScreen, logout, words } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    learning: true,
    practice: true,
    vocabulary: true,
    immersion: true,
    settings: true
  });

  const learnedWords = words.filter(w => w.times_correct >= 3).length;
  const nextReview = words.filter(w => {
    if (!w.next_review) return true;
    return new Date(w.next_review) <= new Date();
  }).length;

  const navigationSections = [
    {
      id: 'overview',
      title: t('navigation.overview'),
      items: [
        { id: 'dashboard', label: t('navigation.dashboard'), icon: BarChart3 }
      ]
    },
    {
      id: 'learning',
      title: t('navigation.learning'),
      items: [
            { id: 'learning', label: t('navigation.lessons'), icon: GraduationCap },
        { id: 'alphabet', label: t('navigation.alphabet'), icon: Type },
        { id: 'grammar', label: t('navigation.grammar'), icon: BookOpen }
      ]
    },
    {
      id: 'practice',
      title: t('navigation.practice'),
      items: [
        { id: 'flashcards', label: t('navigation.flashcards'), icon: BookOpen },
        { id: 'practice', label: t('navigation.practice'), icon: Target },
        { id: 'search', label: t('navigation.search'), icon: Search }
      ]
    },
    {
      id: 'vocabulary',
      title: t('navigation.vocabulary'),
      items: [
        { id: 'words', label: t('navigation.myWords'), icon: Plus }
      ]
    },
    {
      id: 'immersion',
      title: t('navigation.immersion'),
      items: [
        { id: 'news', label: t('navigation.news'), icon: Newspaper },
        { id: 'chat', label: t('navigation.chat'), icon: MessageCircle }
      ]
    },
    {
      id: 'settings',
      title: t('navigation.settings'),
      items: [
        { id: 'settings', label: t('navigation.settings'), icon: Settings }
      ]
    }
  ];

  const handleNavigation = (screenId) => {
    setScreen(screenId);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar - Desktop & Mobile */}
      <aside className={`
        flex flex-col w-64 fixed inset-y-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        lg:relative lg:translate-x-0 lg:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-col flex-grow">
          {/* Logo and Welcome */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <img 
                  src={`${process.env.PUBLIC_URL}/Logo.png`}
                  alt="NorLearn Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {t('app.welcome', { name: user?.nickname })}
                </h2>
                <div className="flex space-x-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>{words.length} {t('dashboard.totalWords').toLowerCase()}</span>
                  <span>{learnedWords} {t('dashboard.learnedWords').toLowerCase()}</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
            {navigationSections.map((section) => (
              <div key={section.id} className="space-y-2">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                >
                  <span>{section.title}</span>
                  {expandedSections[section.id] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                
                {/* Section Items */}
                {expandedSections[section.id] && (
                  <div className="space-y-1">
                    {section.items.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => handleNavigation(id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                          currentScreen === id
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 border-l-4 border-purple-500'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <Icon size={18} className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Rate Us & Bug Report */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdn0C8KJ6Pmf__5OohwOKRvYEVmqq6DV0niCDSr2OZgnTmggA/viewform?usp=header', '_blank')}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg font-medium text-sm transition-all duration-200"
            >
              <Star size={20} className="w-5 h-5" />
              <span>{t('navigation.rateUs')}</span>
            </button>
            
            <button
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSf2dBqW9tWFh4v_FGhosL0E8oAJh_RRLaJBf-y8MAYbOL_owQ/viewform?usp=dialog', '_blank')}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg font-medium text-sm transition-all duration-200"
            >
              <Bug size={20} className="w-5 h-5" />
              <span>{t('navigation.bugReport')}</span>
            </button>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg font-medium text-sm transition-all duration-200"
            >
              <LogOut size={20} className="w-5 h-5" />
              <span>{t('navigation.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0">
        {/* Header - Mobile Only */}
        <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Menu size={20} />
                </button>
                
                <div className="w-8 h-8">
                  <img 
                    src={`${process.env.PUBLIC_URL}/Logo.png`}
                    alt="NorLearn Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('app.welcome', { name: user?.nickname })}
                  </h2>
                  <div className="flex space-x-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>{words.length} {t('dashboard.totalWords').toLowerCase()}</span>
                    <span>{learnedWords} {t('dashboard.learnedWords').toLowerCase()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors p-2"
              >
                <LogOut size={18} />
                <span className="text-sm">{t('navigation.logout')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
