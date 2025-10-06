import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

const ServiceInitializer = () => {
  const { 
    offlineService, 
    backupReminderService, 
    errorHandlerService, 
    keyboardShortcutsService 
  } = useApp();

  const requestMicrophonePermission = async () => {
    // Check if microphone permission is already granted
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' });
        if (result.state === 'granted') {
          console.log('Microphone permission already granted');
          return;
        }
      } catch (error) {
        console.log('Permission API not supported');
      }
    }

    // Request microphone permission with user-friendly message
    try {
      const stream = await navigator.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      // Stop the stream immediately as we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.log('Microphone permission not granted or not requested');
      // Don't show error - user can grant permission later in settings
    }
  };

  useEffect(() => {
    // Initialize offline service
    offlineService.loadOfflineQueue();
    
    // Initialize backup reminder service
    backupReminderService.checkBackupStatus();
    
    // Initialize keyboard shortcuts
    keyboardShortcutsService.enable();
    
    // Request microphone permission for voice input
    requestMicrophonePermission();
    
    // Show welcome message with shortcuts hint
    const showWelcomeHint = () => {
      const hint = document.createElement('div');
      hint.className = 'fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-40 max-w-sm transform transition-all duration-300';
      hint.innerHTML = `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-blue-100">Welcome to NorLearn!</h4>
            <p class="text-sm text-blue-100 mt-1">
              Press <kbd class="px-2 py-1 bg-blue-500 rounded text-xs">Ctrl+/</kbd> to see keyboard shortcuts
            </p>
          </div>
          <button 
            id="close-welcome-hint"
            class="text-blue-100 hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;

      document.body.appendChild(hint);

      // Auto-hide after 8 seconds
      setTimeout(() => {
        hint.style.transform = 'translateY(100%)';
        setTimeout(() => {
          if (hint.parentNode) {
            hint.parentNode.removeChild(hint);
          }
        }, 300);
      }, 8000);

      // Add close button functionality
      document.getElementById('close-welcome-hint').addEventListener('click', () => {
        hint.style.transform = 'translateY(100%)';
        setTimeout(() => {
          if (hint.parentNode) {
            hint.parentNode.removeChild(hint);
          }
        }, 300);
      });
    };

    // Show welcome hint after a short delay
    setTimeout(showWelcomeHint, 2000);

  }, [offlineService, backupReminderService, keyboardShortcutsService]);

  // This component doesn't render anything
  return null;
};

export default ServiceInitializer;
