class ErrorHandlerService {
  constructor() {
    this.errorMessages = {
      // Network errors
      'NETWORK_ERROR': 'Connection failed. Please check your internet connection and try again.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.',
      'OFFLINE_ERROR': 'You\'re offline. This feature requires an internet connection.',
      
      // API errors
      'API_403': 'Access denied. Please check your API key or try again later.',
      'API_404': 'Service not found. Please try again later.',
      'API_429': 'Too many requests. Please wait a moment and try again.',
      'API_500': 'Server error. Please try again later.',
      'API_UNKNOWN': 'Service temporarily unavailable. Please try again later.',
      
      // TTS errors
      'TTS_UNAVAILABLE': 'Text-to-speech is currently unavailable. Please try again later.',
      'TTS_VOICE_NOT_FOUND': 'Norwegian voice not available. Using default voice instead.',
      'TTS_NETWORK_ERROR': 'Cannot play audio. Please check your internet connection.',
      
      // Translation errors
      'TRANSLATION_FAILED': 'Translation service unavailable. Using fallback examples.',
      'TRANSLATION_QUOTA_EXCEEDED': 'Translation limit reached. Please try again tomorrow.',
      
      // Database errors
      'STORAGE_FULL': 'Storage is full. Please export some data or clear unused words.',
      'STORAGE_ERROR': 'Unable to save data. Please try refreshing the page.',
      'IMPORT_ERROR': 'Failed to import data. Please check your file format.',
      'EXPORT_ERROR': 'Failed to export data. Please try again.',
      
      // General errors
      'UNKNOWN_ERROR': 'Something went wrong. Please try refreshing the page.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'PERMISSION_ERROR': 'Permission denied. Please check your settings.',
      
      // User-specific errors
      'USER_NOT_FOUND': 'User not found. Please log in again.',
      'LOGIN_FAILED': 'Login failed. Please check your nickname and try again.',
      'SESSION_EXPIRED': 'Session expired. Please log in again.'
    };

    this.setupGlobalErrorHandling();
  }

  setupGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason, 'UNKNOWN_ERROR');
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error, 'UNKNOWN_ERROR');
    });
  }

  handleError(error, errorType = null) {
    console.error('Error handled:', error);

    // Determine error type if not provided
    if (!errorType) {
      errorType = this.determineErrorType(error);
    }

    // Get user-friendly message
    const message = this.getErrorMessage(errorType, error);
    
    // Show error notification
    this.showErrorNotification(message, errorType);
    
    // Log error for debugging
    this.logError(error, errorType);
    
    return message;
  }

  determineErrorType(error) {
    if (!error) return 'UNKNOWN_ERROR';
    
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'NETWORK_ERROR';
    }
    
    if (error.message && error.message.includes('timeout')) {
      return 'TIMEOUT_ERROR';
    }
    
    // API errors
    if (error.status) {
      switch (error.status) {
        case 403: return 'API_403';
        case 404: return 'API_404';
        case 429: return 'API_429';
        case 500: return 'API_500';
        default: return 'API_UNKNOWN';
      }
    }
    
    // TTS errors
    if (error.message && error.message.includes('TTS')) {
      return 'TTS_UNAVAILABLE';
    }
    
    // Translation errors
    if (error.message && error.message.includes('Translation')) {
      return 'TRANSLATION_FAILED';
    }
    
    // Storage errors
    if (error.name === 'QuotaExceededError') {
      return 'STORAGE_FULL';
    }
    
    return 'UNKNOWN_ERROR';
  }

  getErrorMessage(errorType, originalError) {
    let message = this.errorMessages[errorType] || this.errorMessages['UNKNOWN_ERROR'];
    
    // Add specific details if available
    if (originalError && originalError.message) {
      const detail = this.extractErrorDetail(originalError.message);
      if (detail) {
        message += ` (${detail})`;
      }
    }
    
    return message;
  }

  extractErrorDetail(errorMessage) {
    // Extract meaningful details from error messages
    if (errorMessage.includes('API key')) return 'Check API configuration';
    if (errorMessage.includes('quota')) return 'Daily limit reached';
    if (errorMessage.includes('network')) return 'Check connection';
    if (errorMessage.includes('timeout')) return 'Request took too long';
    
    return null;
  }

  showErrorNotification(message, errorType) {
    // Remove existing error notification
    const existing = document.getElementById('error-notification');
    if (existing) {
      existing.remove();
    }

    // Create error notification
    const notification = document.createElement('div');
    notification.id = 'error-notification';
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md transform transition-all duration-300';
    
    // Add icon based on error type
    const icon = this.getErrorIcon(errorType);
    
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          ${icon}
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <button 
          id="close-error-btn"
          class="text-red-100 hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Add close button functionality
    document.getElementById('close-error-btn').addEventListener('click', () => {
      this.hideErrorNotification();
    });

    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.hideErrorNotification();
    }, 8000);
  }

  hideErrorNotification() {
    const notification = document.getElementById('error-notification');
    if (notification) {
      notification.style.transform = 'translate(-50%, -100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }

  getErrorIcon(errorType) {
    const icons = {
      'NETWORK_ERROR': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>',
      'API_ERROR': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      'TTS_ERROR': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>',
      'STORAGE_ERROR': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>',
      'DEFAULT': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>'
    };

    if (errorType.startsWith('NETWORK')) return icons.NETWORK_ERROR;
    if (errorType.startsWith('API')) return icons.API_ERROR;
    if (errorType.startsWith('TTS')) return icons.TTS_ERROR;
    if (errorType.startsWith('STORAGE')) return icons.STORAGE_ERROR;
    
    return icons.DEFAULT;
  }

  logError(error, errorType) {
    // Log error with timestamp and context
    const errorLog = {
      timestamp: new Date().toISOString(),
      type: errorType,
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store in localStorage for debugging
    try {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 50 errors
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  // Get error logs for debugging
  getErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    } catch (e) {
      return [];
    }
  }

  // Clear error logs
  clearErrorLogs() {
    localStorage.removeItem('errorLogs');
  }
}

export default new ErrorHandlerService();
