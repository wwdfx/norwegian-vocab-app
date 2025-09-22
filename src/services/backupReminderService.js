class BackupReminderService {
  constructor() {
    this.lastBackupKey = 'last_backup_date';
    this.reminderInterval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    this.checkBackupStatus();
  }

  checkBackupStatus() {
    const lastBackup = this.getLastBackupDate();
    const daysSinceBackup = this.getDaysSinceBackup(lastBackup);
    
    if (daysSinceBackup >= 7) {
      this.showBackupReminder();
    }
  }

  getLastBackupDate() {
    const saved = localStorage.getItem(this.lastBackupKey);
    return saved ? new Date(saved) : null;
  }

  getDaysSinceBackup(lastBackup) {
    if (!lastBackup) return Infinity;
    const now = new Date();
    const diffTime = Math.abs(now - lastBackup);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  markBackupCompleted() {
    localStorage.setItem(this.lastBackupKey, new Date().toISOString());
    this.hideBackupReminder();
  }

  showBackupReminder() {
    // Check if reminder is already shown
    if (document.getElementById('backup-reminder')) return;

    const reminder = document.createElement('div');
    reminder.id = 'backup-reminder';
    reminder.className = 'fixed bottom-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm transform transition-all duration-300';
    reminder.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-yellow-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-yellow-100">Backup Reminder</h4>
          <p class="text-sm text-yellow-100 mt-1">
            It's been a while since you exported your data. Consider backing up your vocabulary to avoid losing progress.
          </p>
          <div class="flex space-x-2 mt-3">
            <button 
              id="backup-now-btn"
              class="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded transition-colors"
            >
              Export Now
            </button>
            <button 
              id="dismiss-backup-btn"
              class="text-yellow-100 hover:text-white text-xs px-3 py-1 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button 
          id="close-backup-btn"
          class="text-yellow-100 hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(reminder);

    // Add event listeners
    document.getElementById('backup-now-btn').addEventListener('click', () => {
      this.markBackupCompleted();
      // Trigger export functionality
      this.triggerExport();
    });

    document.getElementById('dismiss-backup-btn').addEventListener('click', () => {
      this.markBackupCompleted();
    });

    document.getElementById('close-backup-btn').addEventListener('click', () => {
      this.hideBackupReminder();
    });

    // Auto-hide after 30 seconds
    setTimeout(() => {
      this.hideBackupReminder();
    }, 30000);
  }

  hideBackupReminder() {
    const reminder = document.getElementById('backup-reminder');
    if (reminder) {
      reminder.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (reminder.parentNode) {
          reminder.parentNode.removeChild(reminder);
        }
      }, 300);
    }
  }

  triggerExport() {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('backupReminder', { 
      detail: { action: 'export' } 
    }));
  }

  // Get backup status for display
  getBackupStatus() {
    const lastBackup = this.getLastBackupDate();
    const daysSinceBackup = this.getDaysSinceBackup(lastBackup);
    
    return {
      lastBackup,
      daysSinceBackup,
      needsBackup: daysSinceBackup >= 7,
      status: this.getStatusText(daysSinceBackup)
    };
  }

  getStatusText(daysSinceBackup) {
    if (daysSinceBackup === 0) return 'Backed up today';
    if (daysSinceBackup === 1) return 'Backed up yesterday';
    if (daysSinceBackup < 7) return `Backed up ${daysSinceBackup} days ago`;
    return `Backed up ${daysSinceBackup} days ago (recommended: weekly)`;
  }

  // Force show reminder (for testing)
  forceShowReminder() {
    this.showBackupReminder();
  }
}

export default new BackupReminderService();
