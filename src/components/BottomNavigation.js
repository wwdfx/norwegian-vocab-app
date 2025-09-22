import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown,
  Search,
  BookOpen,
  Target,
  Newspaper,
  Plus,
  MessageCircle,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';

const BottomNavigation = ({ currentScreen, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'words', label: 'Add Word', icon: Plus },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];



  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (screenId) => {
    onNavigate(screenId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Launchpad Menu */}
        <div 
          className={`absolute bottom-16 left-4 right-4 mb-2 transition-all duration-700 ease-out transform ${
            isOpen 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-16 opacity-0 scale-90 pointer-events-none'
          }`}
          style={{
            transform: isOpen 
              ? 'translateY(0) scale(1) rotateX(0deg)' 
              : 'translateY(16px) scale(0.9) rotateX(5deg)',
            transformOrigin: 'bottom center'
          }}
        >
          <div className={`bg-gray-100 rounded-2xl shadow-2xl border border-gray-200 p-6 transition-all duration-500 ${
            isOpen ? 'shadow-2xl' : 'shadow-none'
          }`}>
            {/* Grid of Navigation Items */}
            <div className="grid grid-cols-3 gap-4">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = currentScreen === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-500 ease-out transform hover:shadow-lg ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300 scale-105 shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-110 border border-gray-200'
                    }`}
                    style={{
                      animationDelay: isOpen ? `${index * 80}ms` : '0ms',
                      transform: isOpen ? 'translateY(0) scale(1) rotateY(0deg)' : 'translateY(30px) scale(0.7) rotateY(10deg)',
                      opacity: isOpen ? 1 : 0,
                      transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 80}ms`
                    }}
                  >
                    <IconComponent 
                      size={24} 
                      className={`mb-2 transition-all duration-500 ${
                        isActive ? 'text-purple-600 scale-110' : 'text-gray-600'
                      }`}
                    />
                    <span className="text-xs font-medium text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Central Toggle Button */}
        <div className="flex justify-center pb-4">
          <button
            onClick={toggleMenu}
            className={`w-16 h-16 bg-purple-600 rounded-full shadow-lg transition-all duration-500 ease-out transform flex items-center justify-center ${
              isOpen 
                ? 'bg-purple-700 scale-110 shadow-2xl ring-4 ring-purple-200' 
                : 'hover:bg-purple-700 hover:scale-110 hover:shadow-2xl hover:ring-2 hover:ring-purple-200'
            }`}
            style={{
              transform: isOpen ? 'scale(1.1) translateY(-2px)' : 'scale(1) translateY(0)',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div 
              className={`transition-all duration-500 ease-out transform ${
                isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
              }`}
              style={{
                transform: isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <ChevronUp size={28} className="text-white" />
            </div>
          </button>
        </div>

        {/* Bottom Bar Background */}
        <div className="bg-white border-t border-gray-200 h-16 flex items-center justify-center">
          <div className="w-16 h-16"></div> {/* Spacer for button */}
        </div>
      </div>

      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black transition-all duration-700 ease-out z-40 ${
          isOpen 
            ? 'bg-opacity-20 pointer-events-auto backdrop-blur-sm' 
            : 'bg-opacity-0 pointer-events-none backdrop-blur-none'
        }`}
        style={{
          backdropFilter: isOpen ? 'blur(2px)' : 'blur(0px)',
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
};

export default BottomNavigation;
