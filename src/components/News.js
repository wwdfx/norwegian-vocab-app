import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ttsService from '../services/tts';
import translationService from '../services/translation';
import { 
  Newspaper, 
  Volume2, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  Loader2,
  Globe,
  Calendar,
  User
} from 'lucide-react';
import WordTooltip from './WordTooltip';

const News = () => {
  const { addWord } = useApp();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('toppsaker');

  // RSS feed URLs for different categories
  const rssFeeds = {
    toppsaker: 'https://www.nrk.no/toppsaker.rss',
    nyheter: 'https://www.nrk.no/nyheter.rss',
    kultur: 'https://www.nrk.no/kultur.rss',
    sport: 'https://www.nrk.no/sport.rss'
  };

  // Fallback RSS feeds if main ones fail
  const fallbackRssFeeds = {
    toppsaker: 'https://feeds.nrk.no/nrk_toppsaker.rss',
    nyheter: 'https://feeds.nrk.no/nrk_nyheter.rss',
    kultur: 'https://feeds.nrk.no/nrk_kultur.rss',
    sport: 'https://feeds.nrk.no/nrk_sport.rss'
  };

  // Fetch and parse RSS feed
  const fetchRSSFeed = async (feedUrl, isFallback = false) => {
    try {
      // Use a CORS proxy to avoid CORS issues
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Failed to fetch RSS feed');
      }

      // Parse the XML content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
      
      const items = xmlDoc.querySelectorAll('item');
      const parsedArticles = [];

      items.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const author = item.querySelector('dc\\:creator')?.textContent || 
                     item.querySelector('author')?.textContent || 'NRK';
        
        // Extract text content from description (remove HTML tags)
        const textContent = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        
        parsedArticles.push({
          id: index,
          title,
          description: textContent,
          link,
          pubDate: new Date(pubDate),
          author,
          fullText: `${title}. ${textContent}`
        });
      });

      return parsedArticles;
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      
      // Try fallback feed if this is the main feed
      if (!isFallback) {
        const category = Object.keys(rssFeeds).find(key => rssFeeds[key] === feedUrl);
        if (category && fallbackRssFeeds[category]) {
          console.log(`Trying fallback feed for ${category}...`);
          return await fetchRSSFeed(fallbackRssFeeds[category], true);
        }
      }
      
      throw new Error('Failed to fetch news articles');
    }
  };

  // Load articles
  const loadArticles = async (category = selectedCategory) => {
    setIsLoading(true);
    setError('');
    
    try {
      const feedUrl = rssFeeds[category];
      const articlesData = await fetchRSSFeed(feedUrl);
      setArticles(articlesData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh articles
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadArticles();
    setIsRefreshing(false);
  };

  // Handle category change
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    await loadArticles(category);
  };

  // Load articles on component mount
  useEffect(() => {
    loadArticles();
  }, []);

  // Extract individual Norwegian words from text
  const extractNorwegianWords = (text) => {
    // Split text into individual words, handling punctuation and spaces
    const words = text.split(/\s+/).map(word => {
      // Remove punctuation from the beginning and end of words
      return word.replace(/^[^\wæøåÆØÅ]+|[^\wæøåÆØÅ]+$/g, '');
    }).filter(word => word.length > 0);
    
    // Filter out common English words and short words
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
    
    // Common Norwegian words to prioritize
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
      // Get English translation
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

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render article with interactive Norwegian words
  const renderArticle = (article) => {
    const processedTitle = processTextWithTooltips(article.title);
    const processedDescription = processTextWithTooltips(article.description);
    
    return (
      <div key={article.id} className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h3 
            className="text-xl font-bold text-gray-900 mb-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedTitle }}
          />
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(article.pubDate)}</span>
            </div>
          </div>
        </div>
        
        <div 
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: processedDescription }}
        />
        
        <div className="flex items-center justify-between">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
            <span>Read Full Article</span>
          </a>
        </div>
      </div>
    );
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
        wordSpan.style.color = '#7c3aed'; // Purple color
        wordSpan.style.textDecoration = 'underline';
        wordSpan.style.textDecorationStyle = 'dotted';
      });
    };

    // Add interactions after articles are rendered
    if (articles.length > 0) {
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
  }, [articles]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Norwegian news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16">
            <img 
              src="/Logo.png" 
              alt="NorLearn Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Norwegian News</h1>
        <p className="text-gray-600">
          Read real Norwegian news and learn vocabulary in context
        </p>
      </div>

      {/* Category Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(rssFeeds).map(([key, url]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {key === 'toppsaker' ? 'Top Stories' : 
                 key === 'nyheter' ? 'News' :
                 key === 'kultur' ? 'Culture' : 'Sports'}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-800 font-medium">Error loading news</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="space-y-6">
          {articles.map(renderArticle)}
        </div>
      ) : !isLoading && !error ? (
        <div className="text-center py-12">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No articles found</p>
        </div>
      ) : null}

      {/* Help Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
        <div className="flex items-start space-x-2">
          <Globe className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">💡 How to use Norwegian News</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Purple underlined words</strong> are Norwegian words you can interact with</li>
              <li>• <strong>Hover over words</strong> to see pronunciation and add to vocabulary options</li>
              <li>• <strong>Click the speaker icon</strong> to hear Norwegian pronunciation</li>
              <li>• <strong>Click "Add to Vocab"</strong> to save words to your learning list</li>
              <li>• <strong>Switch categories</strong> to explore different types of news</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
