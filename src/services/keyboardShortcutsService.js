class KeyboardShortcutsService {
  constructor() {
    this.shortcuts = new Map();
    this.isEnabled = true;
    this.setupShortcuts();
    this.setupEventListeners();
  }

  setupShortcuts() {
    // Navigation shortcuts
    this.registerShortcut('1', 'Go to Dashboard', () => this.navigateTo('dashboard'));
    this.registerShortcut('2', 'Go to Flashcards', () => this.navigateTo('flashcards'));
    this.registerShortcut('3', 'Go to Practice', () => this.navigateTo('practice'));
    this.registerShortcut('4', 'Go to My Words', () => this.navigateTo('words'));

    // Flashcard shortcuts
    this.registerShortcut('Space', 'Flip card / Show answer', () => this.triggerFlashcardAction());
    this.registerShortcut('ArrowRight', 'Next card', () => this.triggerNextCard());
    this.registerShortcut('ArrowLeft', 'Previous card', () => this.triggerPreviousCard());
    this.registerShortcut('1', 'Rate as Hard', () => this.rateDifficulty('hard'));
    this.registerShortcut('2', 'Rate as Medium', () => this.rateDifficulty('medium'));
    this.registerShortcut('3', 'Rate as Easy', () => this.rateDifficulty('easy'));

    // Practice shortcuts
    this.registerShortcut('A', 'Select answer A', () => this.selectAnswer(0));
    this.registerShortcut('B', 'Select answer B', () => this.selectAnswer(1));
    this.registerShortcut('C', 'Select answer C', () => this.selectAnswer(2));
    this.registerShortcut('D', 'Select answer D', () => this.selectAnswer(3));

    // General shortcuts
    this.registerShortcut('Escape', 'Close modal / Go back', () => this.handleEscape());
    this.registerShortcut('Enter', 'Confirm / Submit', () => this.handleEnter());
    this.registerShortcut('Ctrl+S', 'Save / Export', () => this.handleSave());
    this.registerShortcut('Ctrl+O', 'Open / Import', () => this.handleOpen());
    this.registerShortcut('Ctrl+Z', 'Undo', () => this.handleUndo());
    this.registerShortcut('Ctrl+Y', 'Redo', () => this.handleRedo());

    // TTS shortcuts
    this.registerShortcut('P', 'Play pronunciation', () => this.playPronunciation());
    this.registerShortcut('M', 'Mute / Unmute', () => this.toggleMute());

    // Help shortcuts
    this.registerShortcut('F1', 'Show help', () => this.showHelp());
    this.registerShortcut('Ctrl+/', 'Show shortcuts', () => this.showShortcuts());
  }

  registerShortcut(key, description, action) {
    this.shortcuts.set(key, { description, action });
  }

  setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (!this.isEnabled) return;
      
      // Don't trigger shortcuts when typing in input fields
      if (this.isInputField(event.target)) return;
      
      const key = this.getKeyFromEvent(event);
      const shortcut = this.shortcuts.get(key);
      
      if (shortcut) {
        event.preventDefault();
        try {
          shortcut.action();
        } catch (error) {
          console.error('Error executing shortcut:', error);
        }
      }
    });

    // Listen for navigation events
    window.addEventListener('popstate', () => {
      this.updateShortcutContext();
    });
  }

  getKeyFromEvent(event) {
    let key = '';
    
    // Handle modifier keys
    if (event.ctrlKey) key += 'Ctrl+';
    if (event.altKey) key += 'Alt+';
    if (event.shiftKey) key += 'Shift+';
    if (event.metaKey) key += 'Cmd+';
    
    // Handle special keys
    switch (event.key) {
      case ' ':
        key += 'Space';
        break;
      case 'ArrowRight':
        key += 'ArrowRight';
        break;
      case 'ArrowLeft':
        key += 'ArrowLeft';
        break;
      case 'Escape':
        key += 'Escape';
        break;
      case 'Enter':
        key += 'Enter';
        break;
      default:
        key += event.key.toUpperCase();
    }
    
    return key;
  }

  isInputField(element) {
    const inputTypes = ['input', 'textarea', 'select'];
    return inputTypes.includes(element.tagName.toLowerCase()) || 
           element.contentEditable === 'true' ||
           element.getAttribute('role') === 'textbox';
  }

  // Navigation actions
  navigateTo(screen) {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('navigateTo', { 
      detail: { screen } 
    }));
  }

  // Flashcard actions
  triggerFlashcardAction() {
    window.dispatchEvent(new CustomEvent('flashcardAction', { 
      detail: { action: 'flip' } 
    }));
  }

  triggerNextCard() {
    window.dispatchEvent(new CustomEvent('flashcardAction', { 
      detail: { action: 'next' } 
    }));
  }

  triggerPreviousCard() {
    window.dispatchEvent(new CustomEvent('flashcardAction', { 
      detail: { action: 'previous' } 
    }));
  }

  rateDifficulty(difficulty) {
    window.dispatchEvent(new CustomEvent('rateDifficulty', { 
      detail: { difficulty } 
    }));
  }

  // Practice actions
  selectAnswer(index) {
    window.dispatchEvent(new CustomEvent('selectAnswer', { 
      detail: { index } 
    }));
  }

  // General actions
  handleEscape() {
    window.dispatchEvent(new CustomEvent('keyboardAction', { 
      detail: { action: 'escape' } 
    }));
  }

  handleEnter() {
    window.dispatchEvent(new CustomEvent('keyboardAction', { 
      detail: { action: 'enter' } 
    }));
  }

  handleSave() {
    window.dispatchEvent(new CustomEvent('keyboardAction', { 
      detail: { action: 'save' } 
    }));
  }

  handleOpen() {
    window.dispatchEvent(new CustomEvent('keyboardAction', { 
      detail: { action: 'open' } 
    }));
  }

  handleUndo() {
    window.dispatchEvent(new CustomEvent('keyboardAction', { 
      detail: { action: 'undo' } 
    }));
  }

  handleRedo() {
    window.dispatchEvent(new CustomEvent('keyboardAction', { 
      detail: { action: 'redo' } 
    }));
  }

  // TTS actions
  playPronunciation() {
    window.dispatchEvent(new CustomEvent('ttsAction', { 
      detail: { action: 'play' } 
    }));
  }

  toggleMute() {
    window.dispatchEvent(new CustomEvent('ttsAction', { 
      detail: { action: 'toggleMute' } 
    }));
  }

  // Help actions
  showHelp() {
    window.dispatchEvent(new CustomEvent('helpAction', { 
      detail: { action: 'showHelp' } 
    }));
  }

  showShortcuts() {
    this.displayShortcutsModal();
  }

  displayShortcutsModal() {
    // Remove existing modal
    const existing = document.getElementById('shortcuts-modal');
    if (existing) {
      existing.remove();
    }

    // Create shortcuts modal
    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const shortcutsList = Array.from(this.shortcuts.entries())
      .map(([key, { description }]) => `<tr><td class="px-4 py-2 font-mono bg-gray-100">${key}</td><td class="px-4 py-2">${description}</td></tr>`)
      .join('');

    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold text-gray-900">Keyboard Shortcuts</h2>
          <button 
            id="close-shortcuts"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left px-4 py-2 font-semibold">Shortcut</th>
                <th class="text-left px-4 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              ${shortcutsList}
            </tbody>
          </table>
        </div>
        <div class="p-6 border-t bg-gray-50">
          <p class="text-sm text-gray-600">
            💡 Tip: Press <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+/</kbd> anytime to see this list
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add close functionality
    document.getElementById('close-shortcuts').addEventListener('click', () => {
      modal.remove();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Enable/disable shortcuts
  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Update shortcut context based on current screen
  updateShortcutContext() {
    // This can be used to show different shortcuts for different screens
    const currentScreen = window.location.pathname;
    // Update shortcuts based on context if needed
  }

  // Get all shortcuts for display
  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([key, { description }]) => ({
      key,
      description
    }));
  }
}

export default new KeyboardShortcutsService();
