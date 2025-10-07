import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SearchVocabulary from './components/SearchVocabulary';
import WordDetails from './components/WordDetails';
import Flashcards from './components/Flashcards';
import Practice from './components/Practice';
import WordManagement from './components/WordManagement';
import News from './components/News';
import Chat from './components/Chat';
import Exercises from './components/Exercises';
import Lesson from './components/Lesson';
import Alphabet from './components/Alphabet';
import Grammar from './components/Grammar';
import Settings from './components/Settings';
import ServiceInitializer from './components/ServiceInitializer';
import PWAServiceWorker from './components/PWAServiceWorker';

function AppContent() {
  const { user, currentScreen, wordDetailsData, setScreen } = useApp();

  if (!user) {
    return <Login />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <SearchVocabulary />;
      case 'wordDetails':
        return <WordDetails 
          word={wordDetailsData?.word}
          dictionaries={wordDetailsData?.dictionaries}
          wordType={wordDetailsData?.wordType}
          onBack={() => setScreen('search')}
        />;
      case 'flashcards':
        return <Flashcards />;
      case 'practice':
        return <Practice />;
      case 'wordmanagement':
      case 'words':
        return <WordManagement />;
      case 'learning':
        return <Lesson />;
      case 'alphabet':
        return <Alphabet />;
      case 'grammar':
        return <Grammar />;
      case 'news':
        return <News />;
      case 'chat':
        return <Chat />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <ServiceInitializer />
      <PWAServiceWorker />
      <Layout>
        {renderScreen()}
      </Layout>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
