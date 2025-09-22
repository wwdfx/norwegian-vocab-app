import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ttsService from '../services/tts';
import translationService from '../services/translation';
import { 
  MessageCircle, 
  Send, 
  Volume2, 
  Plus, 
  Bot, 
  User, 
  Loader2,
  RefreshCw,
  Settings,
  Mic,
  MicOff
} from 'lucide-react';

const Chat = () => {
  const { addWord } = useApp();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [conversationContext, setConversationContext] = useState('');
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Gemini API configuration
  const GEMINI_API_KEY = 'AIzaSyBTuAG_3kHt3gLy4eK0b9y-gaoXNXd03xU';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  // Conversation starters for Norwegian practice
  const conversationStarters = [
    'Kan du hjelpe meg med å lære norsk?',
    'Hvordan går det?',
    'Hva heter du?',
    'Hvor kommer du fra?',
    'Kan du forklare dette ordet?',
    'Hvordan sier man "hello" på norsk?',
    'Kan du gi meg noen eksempler?',
    'Hva betyr dette?'
  ];

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: 'Hei! Jeg er din norske språkhjelper. Jeg kan hjelpe deg med å lære norsk gjennom samtaler. Hvordan kan jeg hjelpe deg i dag?',
      timestamp: new Date(),
      isNorwegian: true
    };
    
    setMessages([welcomeMessage]);
    setChatHistory([welcomeMessage]);
    
    // Auto-speak welcome message
    if (autoSpeak) {
      setTimeout(() => {
        speakMessage(welcomeMessage.content, 'nb-NO');
      }, 500);
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract individual Norwegian words from text (same logic as News component)
  const extractNorwegianWords = (text) => {
    // Split text into individual words, handling punctuation and spaces
    const words = text.split(/\s+/).map(word => {
      // Remove punctuation from the beginning and end of words
      return word.replace(/^[^\wæøåÆØÅ]+|[^\wæøåÆØÅ]+$/g, '');
    }).filter(word => word.length > 0);
    
    const commonEnglishWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
      'this', 'that', 'these', 'those', 'here', 'there', 'when', 'where', 'why', 'how',
      'what', 'who', 'which', 'whose', 'whom', 'it', 'its', 'they', 'them', 'their',
      'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'hers',
      'a', 'an', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
      'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she',
      'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
      'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
      'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
      'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'should', 'could',
      'may', 'might', 'must', 'can', 'shall'
    ]);
    
    const commonNorwegianWords = new Set([
      'er', 'har', 'kan', 'vil', 'skal', 'må', 'bør', 'får', 'går', 'kommer', 'ser',
      'hører', 'snakker', 'leser', 'skriver', 'jobber', 'bor', 'lever', 'tenker',
      'vet', 'tror', 'synes', 'liker', 'elsker', 'hater', 'trenger', 'ønsker',
      'god', 'bra', 'dårlig', 'stor', 'liten', 'ny', 'gammel', 'ung', 'gammel',
      'mange', 'få', 'alt', 'ingenting', 'noe', 'ingen', 'alle', 'hver', 'enhver'
    ]);
    
    return words.filter(word => {
      const lowerWord = word.toLowerCase();
      
      // Skip very short words
      if (word.length < 3) return false;
      
      // Skip common English words
      if (commonEnglishWords.has(lowerWord)) return false;
      
      // Skip only the most basic Norwegian words that don't need highlighting
      if (['jeg', 'du', 'han', 'hun', 'vi', 'dere', 'de', 'den', 'det', 'dette', 'disse',
           'som', 'hvor', 'når', 'hvorfor', 'hvordan', 'hva', 'hvem', 'hvilken', 'hvilke',
           'min', 'din', 'hans', 'hennes', 'vår', 'deres', 'sin', 'si', 'sitt', 'sine',
           'meg', 'deg', 'ham', 'henne', 'oss', 'dem', 'seg'].includes(lowerWord)) return false;
      
      // Include words with Norwegian letters (æ, ø, å) - these are always Norwegian
      if (/[æøåÆØÅ]/.test(word)) return true;
      
      // Include common Norwegian words
      if (commonNorwegianWords.has(lowerWord)) return true;
      
      // Include words with Norwegian suffixes
      const norwegianSuffixes = ['er', 'en', 'et', 'ar', 'ane', 'ene', 'ing', 'else', 'het', 'dom', 'lig', 'ig'];
      if (norwegianSuffixes.some(suffix => lowerWord.endsWith(suffix))) return true;
      
      // Include words that look Norwegian (more inclusive)
      if (word.length >= 4 && /^[a-zæøåA-ZÆØÅ]+$/.test(word)) return true;
      
      // Include specific Norwegian words that might be missed
      const additionalNorwegianWords = [
        'heter', 'noe', 'språkmodell', 'språklæreren', 'kalle', 'hvis', 'vil',
        'går', 'kommer', 'ser', 'hører', 'snakker', 'leser', 'skriver', 'jobber',
        'bor', 'lever', 'tenker', 'vet', 'tror', 'synes', 'liker', 'elsker',
        'hater', 'trenger', 'ønsker', 'god', 'bra', 'dårlig', 'stor', 'liten',
        'ny', 'gammel', 'ung', 'mange', 'få', 'alt', 'ingenting', 'ingen',
        'alle', 'hver', 'enhver', 'ut', 'på', 'med', 'da', 'har'
      ];
      
      if (additionalNorwegianWords.includes(lowerWord)) return true;
      
      return false;
    });
  };

  // Process text to make Norwegian words interactive
  const processTextWithTooltips = (text) => {
    const norwegianWords = extractNorwegianWords(text);
    

    
    // Create a clean text replacement approach
    let processedText = text;
    
    // Sort words by length (longest first) to avoid partial replacements
    const sortedWords = norwegianWords.sort((a, b) => b.length - a.length);
    
    // Use a more robust replacement method
    sortedWords.forEach(word => {
      // Escape special regex characters properly
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Create a unique placeholder to avoid conflicts
      const placeholder = `__NORWEGIAN_WORD_${word}__`;
      
      // First, replace with placeholder
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
      processedText = processedText.replace(regex, placeholder);
    });
    
    // Then replace placeholders with actual HTML
    sortedWords.forEach(word => {
      const placeholder = `__NORWEGIAN_WORD_${word}__`;
      const htmlSpan = `<span class="norwegian-word" data-word="${word}">${word}</span>`;
      processedText = processedText.replace(new RegExp(placeholder, 'g'), htmlSpan);
    });
    
    return processedText;
  };

  // Handle word click (add to vocabulary)
  const handleWordClick = async (word) => {
    try {
      const translation = await translationService.getWordInfo(word);
      if (translation.success) {
        await addWord(word, translation.translation, translation.example || '');
        alert(`"${word}" added to your vocabulary!`);
      } else {
        await addWord(word, `Norwegian word: ${word}`);
        alert(`"${word}" added to your vocabulary!`);
      }
    } catch (error) {
      console.error('Error adding word:', error);
      await addWord(word, `Norwegian word: ${word}`);
      alert(`"${word}" added to your vocabulary!`);
    }
  };

  // Play pronunciation
  const handlePlayPronunciation = async (word) => {
    try {
      await ttsService.speak(word, 'nb-NO');
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  // Speak AI message
  const speakMessage = async (text, language = 'nb-NO') => {
    try {
      await ttsService.speak(text, language);
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  // Generate AI response using Gemini
  const generateAIResponse = async (userMessage) => {
    try {
      const prompt = `Du er en norsk språklærer som hjelper elever med å lære norsk. 
      Svar på norsk og bruk enkelt språk som er passelig for norskelever. 
      Hold svaret til maksimalt 2-3 setninger. 
      Bruk norske ord og uttrykk som kan være nyttige for å lære.

      Brukerens melding: "${userMessage}"
      
      Svar på norsk:`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text?.trim();
      
      if (!aiResponse) {
        throw new Error('No response from Gemini API');
      }

      return aiResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'Beklager, jeg kunne ikke svare akkurat nå. Kan du prøve igjen?';
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      isNorwegian: false
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setChatHistory(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.content);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        isNorwegian: true
      };

      // Add AI response
      setMessages(prev => [...prev, aiMessage]);
      setChatHistory(prev => [...prev, aiMessage]);

      // Auto-speak AI response
      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(aiResponse, 'nb-NO');
        }, 500);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Beklager, det oppstod en feil. Kan du prøve igjen?',
        timestamp: new Date(),
        isNorwegian: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history
  const clearChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: 'Hei! Jeg er din norske språkhjelper. Jeg kan hjelpe deg med å lære norsk gjennom samtaler. Hvordan kan jeg hjelpe deg i dag?',
      timestamp: new Date(),
      isNorwegian: true
    };
    
    setMessages([welcomeMessage]);
    setChatHistory([welcomeMessage]);
    setConversationContext('');
  };

  // Add event listeners for Norwegian word interactions after render
  useEffect(() => {
    const tooltips = [];
    
    const addWordInteractions = () => {
      const norwegianWords = document.querySelectorAll('.norwegian-word');
      
      norwegianWords.forEach(wordSpan => {
        const word = wordSpan.dataset.word;
        
        // Create tooltip container with loading state
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs opacity-0 pointer-events-none transition-opacity duration-200 norwegian-word-tooltip';
        tooltip.innerHTML = `
          <div class="text-sm">
            <div class="font-semibold text-gray-900 mb-2">${word}</div>
            <div class="text-gray-600 text-xs mb-3 italic translation-text" id="translation-${word}">Loading translation...</div>
            <div class="space-y-2">
              <button class="w-full bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1" data-action="pronounce">
                <Volume2 size={12} />
                <span>Listen</span>
              </button>
              <button class="w-full bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center space-x-1" data-action="add">
                <Plus size={12} />
                <span>Add to Vocab</span>
              </button>
            </div>
          </div>
        `;
        
        // Add tooltip to body for better positioning
        document.body.appendChild(tooltip);
        tooltips.push(tooltip);
        
        // Load translation data
        const loadTranslationData = async () => {
          try {
            const translation = await translationService.getWordInfo(word);
            const translationElement = tooltip.querySelector(`#translation-${word}`);
            if (translationElement) {
              if (translation.success) {
                translationElement.textContent = translation.translation;
              } else {
                translationElement.textContent = `Norwegian word: ${word}`;
              }
            }
          } catch (error) {
            const translationElement = tooltip.querySelector(`#translation-${word}`);
            if (translationElement) {
              translationElement.textContent = `Norwegian word: ${word}`;
            }
          }
        };
        
        // Smart tooltip positioning function
        const positionTooltip = (event) => {
          const rect = wordSpan.getBoundingClientRect();
          const tooltipRect = tooltip.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
          let top = rect.top - tooltipRect.height - 8; // 8px gap above word
          
          // Adjust horizontal position if tooltip goes outside viewport
          if (left < 8) {
            left = 8; // Keep 8px from left edge
          } else if (left + tooltipRect.width > viewportWidth - 8) {
            left = viewportWidth - tooltipRect.width - 8; // Keep 8px from right edge
          }
          
          // If tooltip would go above viewport, position it below the word
          if (top < 8) {
            top = rect.bottom + 8; // 8px gap below word
          }
          
          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
        };
        
        // Show tooltip on hover/touch with delay
        let showTimeout;
        let hideTimeout;
        
        const showTooltip = (event) => {
          clearTimeout(hideTimeout);
          showTimeout = setTimeout(() => {
            positionTooltip(event);
            tooltip.style.opacity = '1';
            tooltip.style.pointerEvents = 'auto';
            loadTranslationData(); // Load translation when tooltip shows
          }, 300); // 300ms delay before showing
        };
        
        const hideTooltip = () => {
          clearTimeout(showTimeout);
          hideTimeout = setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.pointerEvents = 'none';
          }, 500); // 500ms delay before hiding
        };
        
        // Desktop hover events
        wordSpan.addEventListener('mouseenter', showTooltip);
        wordSpan.addEventListener('mouseleave', hideTooltip);
        
        // Mobile touch events
        wordSpan.addEventListener('touchstart', showTooltip);
        wordSpan.addEventListener('touchend', hideTooltip);
        
        // Handle tooltip button clicks
        tooltip.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = e.target.closest('button')?.dataset.action;
          
          if (action === 'pronounce') {
            handlePlayPronunciation(word);
          } else if (action === 'add') {
            handleWordClick(word);
          }
        });
        
        // Make word clickable
        wordSpan.style.cursor = 'pointer';
        wordSpan.style.color = '#7c3aed';
        wordSpan.style.textDecoration = 'underline';
        wordSpan.style.textDecorationStyle = 'dotted';
      });
    };

    // Add interactions after messages are rendered
    if (messages.length > 0) {
      setTimeout(addWordInteractions, 100);
    }
    
    // Cleanup function to remove all tooltips
    return () => {
      tooltips.forEach(tooltip => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      });
    };
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <img 
                src="/Logo.png" 
                alt="NorLearn Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Norwegian AI Chat</h1>
              <p className="text-sm text-gray-600">Practice Norwegian with AI assistance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-2 rounded-lg transition-colors ${
                autoSpeak 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
            >
              {autoSpeak ? <Volume2 size={16} /> : <MicOff size={16} />}
            </button>
            
            <button
              onClick={clearChat}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear chat"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[400px] max-h-[600px]"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {message.type === 'user' ? (
                    <User size={14} className="text-purple-200" />
                  ) : (
                    <Bot size={14} className="text-gray-500" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.type === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                </div>
                <span className="text-xs opacity-75">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {/* Message Content */}
              <div 
                className={`text-sm leading-relaxed ${
                  message.type === 'ai' && message.isNorwegian
                    ? 'norwegian-content'
                    : ''
                }`}
                dangerouslySetInnerHTML={{
                  __html: message.type === 'ai' && message.isNorwegian
                    ? processTextWithTooltips(message.content)
                    : message.content
                }}
              />

              {/* AI Message Actions */}
              {message.type === 'ai' && (
                <div className="flex items-center justify-end mt-2 space-x-2">
                  <button
                    onClick={() => speakMessage(message.content, 'nb-NO')}
                    className="p-1 text-gray-500 hover:text-purple-600 transition-colors rounded"
                    title="Listen to message"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <Bot size={14} className="text-gray-500" />
                <span className="text-xs text-gray-500">AI is typing</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Skriv din melding på norsk her... (Write your message in Norwegian here...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Trykk Enter for å sende, Shift+Enter for ny linje
            </p>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Conversation Starters */}
      {messages.length === 1 && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="text-sm text-gray-700 mb-3">
            <p className="font-medium mb-2">💬 Conversation Starters</p>
            <p className="text-xs text-gray-600 mb-3">Click any of these to start practicing Norwegian:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {conversationStarters.map((starter, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(starter)}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Info */}
      <div className="bg-blue-50 border-t border-blue-200 p-4">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">💡 How to use Norwegian AI Chat</p>
          <ul className="text-xs space-y-1">
            <li>• <strong>Write in Norwegian</strong> to practice the language</li>
            <li>• <strong>Purple underlined words</strong> in AI responses are interactive</li>
            <li>• <strong>Hover over words</strong> to see pronunciation and add to vocabulary options</li>
            <li>• <strong>Toggle auto-speak</strong> to hear AI responses automatically</li>
            <li>• <strong>Use the speaker icon</strong> to hear any message again</li>
            <li>• <strong>Use conversation starters</strong> to begin practicing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;
