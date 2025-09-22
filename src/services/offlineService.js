class OfflineService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.offlineQueue = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
      this.showOnlineNotification();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineNotification();
    });
  }

  get isOffline() {
    return !this.isOnline;
  }

  get isOnline() {
    return this._isOnline;
  }

  set isOnline(value) {
    this._isOnline = value;
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('connectionChange', { 
      detail: { isOnline: value } 
    }));
  }

  addToOfflineQueue(action) {
    this.offlineQueue.push(action);
    this.saveOfflineQueue();
  }

  processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    console.log(`Processing ${this.offlineQueue.length} offline actions...`);
    
    // Process queue in order
    this.offlineQueue.forEach((action, index) => {
      try {
        // Execute the action
        if (typeof action.execute === 'function') {
          action.execute();
        }
      } catch (error) {
        console.error(`Error processing offline action ${index}:`, error);
      }
    });

    // Clear queue after processing
    this.offlineQueue = [];
    this.saveOfflineQueue();
  }

  saveOfflineQueue() {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  loadOfflineQueue() {
    try {
      const saved = localStorage.getItem('offlineQueue');
      if (saved) {
        this.offlineQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  showOfflineNotification() {
    // Create or update offline banner
    let banner = document.getElementById('offline-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.className = 'fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 px-4 z-50 transform transition-transform duration-300';
      banner.innerHTML = `
        <div class="flex items-center justify-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <span>You're offline. Some features may be limited.</span>
        </div>
      `;
      document.body.appendChild(banner);
    }
    banner.style.transform = 'translateY(0)';
  }

  showOnlineNotification() {
    const banner = document.getElementById('offline-banner');
    if (banner) {
      banner.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 300);
    }

    // Show brief online notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Back online!</span>
      </div>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Check if a specific feature is available offline
  isFeatureAvailableOffline(feature) {
    const offlineFeatures = {
      'flashcards': true,
      'practice': true,
      'word-management': true,
      'tts': false, // TTS requires internet
      'translation': false, // Translation requires internet
      'export': true,
      'import': true
    };

    return offlineFeatures[feature] || false;
  }

  // Get offline status for display
  getStatusInfo() {
    return {
      isOnline: this.isOnline,
      offlineActions: this.offlineQueue.length,
      canUseTTS: this.isOnline,
      canUseTranslation: this.isOnline
    };
  }
}

export default new OfflineService();
