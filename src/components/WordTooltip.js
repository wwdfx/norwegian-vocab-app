import React, { useState, useEffect, useRef } from 'react';
import { Volume2, X } from 'lucide-react';
import ttsService from '../services/tts';
import translationService from '../services/translation';

const WordTooltip = ({ 
  norwegianWord, 
  englishTranslation, 
  example, 
  children, 
  className = "",
  position = "top" 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  // Enhanced hover effect with better delays
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (norwegianWord && norwegianWord.trim()) {
        setShowTooltip(true);
        loadTooltipData();
      }
    }, 300); // 300ms delay before showing tooltip
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Add delay before hiding for better UX
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
      setTooltipData(null);
      setError(null);
    }, 500); // 500ms delay before hiding tooltip
  };

  const loadTooltipData = async () => {
    if (!norwegianWord || tooltipData) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use existing translation if provided, otherwise fetch it
      let translation = englishTranslation;
      let wordInfo = null;
      
      if (!translation) {
        wordInfo = await translationService.getWordInfo(norwegianWord);
        translation = wordInfo.translation;
      }
      
      setTooltipData({
        norwegian: norwegianWord,
        english: translation || 'Translation not available',
        example: example || wordInfo?.example || 'No example available'
      });
    } catch (err) {
      console.error('Error loading tooltip data:', err);
      setError('Failed to load word information');
      setTooltipData({
        norwegian: norwegianWord,
        english: 'Translation unavailable',
        example: 'No example available'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (!norwegianWord) return;
    
    try {
      await ttsService.speak(norwegianWord, 'nb-NO');
    } catch (error) {
      console.error('TTS error:', error);
    }
  };



  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const getTooltipPosition = () => {
    const baseClasses = "absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4 transform transition-all duration-200";
    
    switch (position) {
      case "bottom":
        return `${baseClasses} top-full left-1/2 -translate-x-1/2 mt-2`;
      case "left":
        return `${baseClasses} right-full top-1/2 -translate-y-1/2 mr-2`;
      case "right":
        return `${baseClasses} left-full top-1/2 -translate-y-1/2 ml-2`;
      default: // top
        return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 mb-2`;
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
    >
      {children}
      
      {showTooltip && (
        <div className={getTooltipPosition()}>
          {/* Close button */}
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
          
          {/* Tooltip content */}
          <div className="space-y-3">
            {/* Norwegian word */}
            <div className="text-center">
              <h4 className="text-lg font-bold text-purple-600">
                {norwegianWord}
              </h4>
            </div>
            
            {/* Translation */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Translation</p>
              <p className="text-base font-medium text-gray-900">
                {isLoading ? 'Loading...' : tooltipData?.english}
              </p>
            </div>
            
            {/* Example sentence */}
            {tooltipData?.example && tooltipData.example !== 'No example available' && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Example</p>
                <p className="text-sm text-gray-700 italic">
                  "{tooltipData.example}"
                </p>
              </div>
            )}
            
            {/* Pronunciation button */}
            <div className="text-center pt-2">
              <button
                onClick={handleSpeak}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <Volume2 size={16} />
                <span className="text-sm font-medium">Listen</span>
              </button>
            </div>
            
            {/* Error message */}
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
          </div>
          
          {/* Arrow */}
          <div className={`absolute w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45 ${
            position === "top" ? "top-full left-1/2 -translate-x-1/2 -mt-1.5" :
            position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 -mb-1.5" :
            position === "left" ? "left-full top-1/2 -translate-y-1/2 -ml-1.5" :
            "right-full top-1/2 -translate-y-1/2 -mr-1.5"
          }`} />
        </div>
      )}
    </div>
  );
};

export default WordTooltip;
