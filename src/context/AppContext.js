import React, { createContext, useContext, useReducer, useEffect } from 'react';
import databaseService from '../services/database';
import ttsService from '../services/tts';
import offlineService from '../services/offlineService';
import backupReminderService from '../services/backupReminderService';
import errorHandlerService from '../services/errorHandlerService';
import keyboardShortcutsService from '../services/keyboardShortcutsService';

const AppContext = createContext();

const initialState = {
  user: null,
  words: [],
  currentScreen: 'login',
  isLoading: false,
  error: null,
  wordDetailsData: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_USER':
      return { ...state, user: action.payload, currentScreen: 'dashboard' };
    
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    
    case 'SET_WORDS':
      return { ...state, words: action.payload };
    
    case 'ADD_WORD':
      return { ...state, words: [...state.words, action.payload] };
    
    case 'UPDATE_WORD':
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload.id ? { ...word, ...action.payload } : word
        )
      };
    
    case 'DELETE_WORD':
      return {
        ...state,
        words: state.words.filter(word => word.id !== action.payload)
      };
    
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    
    case 'SET_WORD_DETAILS':
      return { 
        ...state, 
        currentScreen: 'wordDetails',
        wordDetailsData: action.payload 
      };
    
    case 'LOGOUT':
      return { ...initialState };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Initialize database
    databaseService.init();
    
    // Log available voices for debugging
    setTimeout(() => {
      ttsService.logAvailableVoices();
      ttsService.checkGoogleTTSStatus();
    }, 1000);
    
    // Check for existing user
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_USER', payload: user });
      loadUserWords(user.id);
    }
  }, []);

  const loadUserWords = async (userId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const words = await databaseService.getUserWords(userId);
      dispatch({ type: 'SET_WORDS', payload: words });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (nickname) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let user = await databaseService.getUserByNickname(nickname);
      
      if (!user) {
        user = await databaseService.createUser(nickname);
        // Add sample words for new users
        await databaseService.addSampleWords(user.id);
      }
      
      localStorage.setItem('current_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      await loadUserWords(user.id);
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addWord = async (norwegian, english, example = '') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newWord = await databaseService.addWord(state.user.id, norwegian, english, example);
      dispatch({ type: 'ADD_WORD', payload: newWord });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateWordProgress = async (wordId, difficulty) => {
    try {
      await databaseService.updateWordProgress(wordId, difficulty, state.user.id);
      // Reload words to get updated progress
      await loadUserWords(state.user.id);
      // Refresh user data to get updated practice streak
      await refreshUserData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateWordProgressForFlashcards = async (wordId, difficulty) => {
    try {
      console.log(`Flashcards: Updating word ${wordId} as ${difficulty}`);
      await databaseService.updateWordProgress(wordId, difficulty, state.user.id);
      // For flashcards, we don't need to refresh user data (no practice streak)
      // Just reload words to get updated progress
      await loadUserWords(state.user.id);
      console.log('Flashcards: Word progress updated successfully');
    } catch (error) {
      console.error('Flashcards: Error updating word progress:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const refreshUserData = async () => {
    try {
      const updatedUser = await databaseService.getUserByNickname(state.user.nickname);
      if (updatedUser) {
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const deleteWord = async (wordId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await databaseService.deleteWord(wordId, state.user.id);
      dispatch({ type: 'DELETE_WORD', payload: wordId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setScreen = (screen) => {
    dispatch({ type: 'SET_SCREEN', payload: screen });
  };

  const navigateToWordDetails = (wordData) => {
    dispatch({ type: 'SET_WORD_DETAILS', payload: wordData });
  };

  const logout = () => {
    localStorage.removeItem('current_user');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    addWord,
    updateWordProgress,
    updateWordProgressForFlashcards,
    deleteWord,
    setScreen,
    navigateToWordDetails,
    logout,
    loadUserWords: () => loadUserWords(state.user?.id),
    refreshUserData,
    // New UX services
    offlineService,
    backupReminderService,
    errorHandlerService,
    keyboardShortcutsService
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
