// Database service for Norwegian Vocabulary App
// Using localStorage for simplicity and browser compatibility

class DatabaseService {
  constructor() {
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  // User management
  async getUserByNickname(nickname) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.nickname === nickname);
  }

  async createUser(nickname) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      id: Date.now(),
      nickname: nickname,
      created_at: new Date().toISOString(),
      practice_streak: 0
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  }

  // Word management
  async getUserWords(userId) {
    const words = JSON.parse(localStorage.getItem(`words_${userId}`) || '[]');
    return words.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async addWord(userId, norwegian, english, example = '') {
    const words = JSON.parse(localStorage.getItem(`words_${userId}`) || '[]');
    const newWord = {
      id: Date.now(),
      user_id: userId,
      norwegian: norwegian,
      english: english,
      example: example,
      difficulty_level: 0,
      times_reviewed: 0,
      times_correct: 0,
      created_at: new Date().toISOString()
    };
    words.push(newWord);
    localStorage.setItem(`words_${userId}`, JSON.stringify(words));
    return newWord;
  }

  async updateWordProgress(wordId, difficulty, userId) {
    const difficultyMultipliers = { easy: 2.5, medium: 1.5, hard: 1.0 };
    const multiplier = difficultyMultipliers[difficulty];
    
    const words = await this.getUserWords(userId);
    const word = words.find(w => w.id === wordId);
    
    if (!word) return;

    // Update word statistics
    word.times_reviewed = (word.times_reviewed || 0) + 1;
    if (difficulty === 'easy') {
      word.times_correct = (word.times_correct || 0) + 1;
    }
    
    // Calculate next review date (spaced repetition)
    const daysUntilNext = Math.max(1, Math.round((word.times_reviewed || 1) * multiplier));
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilNext);
    word.next_review = nextReview.toISOString();
    word.last_reviewed = new Date().toISOString();

    // Update localStorage
    const wordIndex = words.findIndex(w => w.id === wordId);
    if (wordIndex !== -1) {
      words[wordIndex] = word;
      localStorage.setItem(`words_${userId}`, JSON.stringify(words));
    }
    
    // Update user's practice streak
    await this.updateUserPracticeStreak(userId);
  }

  async updateUserPracticeStreak(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    const today = new Date().toDateString();
    const lastPracticeDate = user.last_practice_date ? new Date(user.last_practice_date).toDateString() : null;
    
    if (lastPracticeDate === today) {
      // Already practiced today, no streak update needed
      return;
    }
    
    if (lastPracticeDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      // Practiced yesterday, increment streak
      user.practice_streak = (user.practice_streak || 0) + 1;
    } else if (lastPracticeDate && lastPracticeDate !== today) {
      // Missed a day, reset streak
      user.practice_streak = 1;
    } else {
      // First time practicing, start streak
      user.practice_streak = 1;
    }
    
    user.last_practice_date = new Date().toISOString();
    
    // Update localStorage
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  async deleteWord(wordId, userId) {
    const words = await this.getUserWords(userId);
    const filteredWords = words.filter(w => w.id !== wordId);
    localStorage.setItem(`words_${userId}`, JSON.stringify(filteredWords));
  }

  // Sample words for new users
  async addSampleWords(userId) {
    const sampleWords = [
      { norwegian: 'hei', english: 'hello', example: 'Hei, hvordan har du det?' },
      { norwegian: 'takk', english: 'thank you', example: 'Takk for hjelpen!' },
      { norwegian: 'ja', english: 'yes', example: 'Ja, det er riktig.' },
      { norwegian: 'nei', english: 'no', example: 'Nei, det er feil.' },
      { norwegian: 'vann', english: 'water', example: 'Jeg vil ha vann.' },
      { norwegian: 'mat', english: 'food', example: 'Maten smaker godt.' },
      { norwegian: 'hus', english: 'house', example: 'Dette er mitt hus.' },
      { norwegian: 'bok', english: 'book', example: 'Jeg leser en bok.' }
    ];

    for (const word of sampleWords) {
      await this.addWord(userId, word.norwegian, word.english, word.example);
    }
  }
}

export default new DatabaseService();