# 🇳🇴 NorLearn - Norwegian Vocabulary Learning App

A comprehensive Progressive Web App (PWA) for learning Norwegian vocabulary, featuring gamified lessons, spaced repetition, and offline capabilities. Built with React and designed for both web and mobile platforms.

![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge&logo=pwa)
![Capacitor](https://img.shields.io/badge/Capacitor-7.4.3-9cf?style=for-the-badge&logo=capacitor)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=for-the-badge&logo=tailwindcss)

## 🚀 Live Demo

- **Web App**: [Deploy your own instance](#deployment)
- **Mobile**: Install as PWA from supported browsers
- **Android APK**: Available via build script

## ✨ Key Features

### 🎮 Gamified Learning System
- **Structured Lessons**: 5 chapters with 7 interactive lessons
- **XP & Levels**: Earn experience points and level up
- **Achievement System**: Unlock badges for milestones
- **Daily Streaks**: Maintain learning momentum
- **Progress Tracking**: Visual progress indicators

### 📚 Comprehensive Vocabulary Management
- **Official Dictionary Integration**: Norwegian Dictionary API (ord.uib.no)
- **Smart Search**: Wildcard search with advanced filtering
- **Word Discovery**: Find new vocabulary with rich definitions
- **Spaced Repetition**: Intelligent review scheduling
- **Custom Vocabulary**: Add personal word collections

### 🎯 Interactive Learning Tools
- **Flashcards**: Traditional and adaptive flashcard system
- **Practice Mode**: Multiple exercise types (multiple choice, fill-in-blanks, translation)
- **Text-to-Speech**: Pronunciation support for Norwegian words
- **Word Details**: Comprehensive definitions and examples

### 📱 Progressive Web App Features
- **Installable**: Add to home screen like a native app
- **Offline Support**: Learn without internet connection
- **Mobile Optimized**: Touch-friendly responsive design
- **Service Worker**: Intelligent caching and updates
- **Cross-Platform**: Works on desktop, tablet, and mobile

### 🛠 Advanced Technical Features
- **Local Database**: IndexedDB for offline data storage
- **Context API**: Centralized state management
- **Error Handling**: Comprehensive error management system
- **Keyboard Shortcuts**: Power user navigation
- **Backup System**: Data export and recovery

## 🏗 Technical Architecture

### Frontend Stack
- **React 19.1.1** - Modern React with hooks and context
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Capacitor** - Native mobile app capabilities

### Backend & Data
- **IndexedDB** - Client-side database storage
- **Norwegian Dictionary API** - Official vocabulary source
- **Web Speech API** - Text-to-speech functionality
- **Service Worker** - Offline capabilities and caching

### Development Tools
- **Create React App** - Development environment
- **PostCSS** - CSS processing
- **Web Vitals** - Performance monitoring
- **Testing Library** - Component testing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/norwegian-vocab-app.git
cd norwegian-vocab-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

### Available Scripts

```bash
# Development
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production

# PWA Features
npm run pwa-icons  # Generate PWA icons
npm run build-pwa  # Build with PWA icons

# Mobile Development
npx cap add android  # Add Android platform
npm run build-apk    # Build Android APK
```

## 📱 Mobile Development

### Building for Android

1. **Build the web app**
```bash
npm run build
```

2. **Sync with Capacitor**
```bash
npx cap sync android
```

3. **Open in Android Studio**
```bash
npx cap open android
```

4. **Build APK** (Windows)
```bash
build-apk.bat
```

## 🌐 Deployment

### Web Deployment

1. **Build for production**
```bash
npm run build-pwa
```

2. **Deploy the `build/` folder** to any static hosting:
   - **Netlify**: Drag & drop deployment
   - **Vercel**: Git-based deployment
   - **GitHub Pages**: Free hosting
   - **Firebase Hosting**: Google's solution

### PWA Requirements
- HTTPS enabled (required for PWA)
- Service worker accessible at `/sw.js`
- Manifest accessible at `/manifest.json`

## 🎯 Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Flashcards.js    # Flashcard system
│   ├── SearchVocabulary.js # Dictionary search
│   ├── LearningPathway.js  # Gamified lessons
│   └── ...
├── services/            # Business logic
│   ├── database.js      # IndexedDB operations
│   ├── gamificationService.js # XP & achievements
│   ├── norwegianDictionaryService.js # API integration
│   └── ...
├── context/             # State management
│   └── AppContext.js    # React Context provider
├── data/               # Static content
│   └── lessons.json    # Learning content
└── ...
```

## 🔧 Key Technical Implementations

### State Management
- **React Context + useReducer** for centralized state
- **Local storage** for user persistence
- **IndexedDB** for vocabulary data

### Gamification System
- **XP calculation** with exponential leveling
- **Achievement tracking** with localStorage
- **Progress persistence** across sessions
- **Streak maintenance** with date calculations

### PWA Implementation
- **Service Worker** for offline caching
- **Web App Manifest** for installation
- **Responsive design** for all devices
- **Update notifications** for new versions

### API Integration
- **Norwegian Dictionary API** for vocabulary discovery
- **Error handling** with fallback mechanisms
- **Caching strategy** for improved performance
- **Rate limiting** considerations

## 🎨 Design Philosophy

### User Experience
- **Mobile-first** responsive design
- **Intuitive navigation** with bottom navigation
- **Visual feedback** for all interactions
- **Accessibility** considerations

### Learning Methodology
- **Spaced repetition** for long-term retention
- **Progressive difficulty** in lessons
- **Multiple learning modes** for different preferences
- **Gamification** to maintain engagement

### Technical Excellence
- **Clean architecture** with separation of concerns
- **Performance optimization** with lazy loading
- **Error resilience** with comprehensive error handling
- **Scalable structure** for easy feature additions

## 📊 Performance Metrics

- **Lighthouse PWA Score**: 90+
- **Bundle Size**: Optimized with code splitting
- **Load Time**: < 3 seconds on 3G
- **Offline Functionality**: Full core features available

## 🔮 Future Enhancements

### Planned Features
- **Push Notifications** for learning reminders
- **Social Features** with leaderboards
- **Advanced Analytics** for learning insights
- **Voice Recognition** for pronunciation practice
- **Spaced Repetition Algorithm** improvements

### Technical Roadmap
- **Backend Integration** for cloud sync
- **Advanced Caching** strategies
- **Performance Monitoring** integration
- **A/B Testing** framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Portfolio Highlights

### Technical Achievements
- **Full-stack PWA** with offline capabilities
- **Complex state management** with React Context
- **API integration** with external services
- **Mobile app development** with Capacitor
- **Gamification system** with progress tracking

### User Experience Focus
- **Responsive design** for all devices
- **Intuitive navigation** and user flows
- **Performance optimization** for smooth experience
- **Accessibility considerations** throughout

### Learning & Growth
- **Modern React patterns** and best practices
- **PWA development** and deployment
- **Mobile app development** experience
- **API design** and integration
- **User engagement** through gamification

---

**Built with ❤️ for Norwegian language learners**

*This project demonstrates modern web development practices, PWA implementation, and user-centered design principles in a practical, real-world application.*