import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Globe, 
  Palette, 
  Bell, 
  Database, 
  Info, 
  Download, 
  Upload, 
  Trash2,
  Save,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  Mic,
  MicOff
} from 'lucide-react';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useApp();
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    nickname: user?.nickname || '',
    language: i18n.language || 'en',
    theme: 'light',
    autoSpeak: true,
    soundEffects: true,
    notifications: true,
    studyReminders: true
  });
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [micPermission, setMicPermission] = useState('default'); // 'default', 'granted', 'denied'

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme = 'system';
    if (savedTheme) {
      initialTheme = savedTheme;
    }
    
    setSettings(prev => ({ ...prev, theme: initialTheme }));
    applyTheme(initialTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (initialTheme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Check microphone permission on component mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' });
        setMicPermission(result.state);
        
        result.onchange = () => {
          setMicPermission(result.state);
        };
      } catch (error) {
        console.log('Permission API not supported or microphone permission not available');
      }
    } else {
      // Fallback for browsers without Permission API
      setMicPermission('default');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.getUserMedia({ audio: true });
      setMicPermission('granted');
      // Stop the stream immediately as we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setMicPermission('denied');
    }
  };

  const sections = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'language', label: t('settings.language'), icon: Globe },
    { id: 'appearance', label: t('settings.appearance'), icon: Palette },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'data', label: t('settings.data'), icon: Database },
    { id: 'about', label: t('settings.about'), icon: Info }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply changes immediately for certain settings
    if (key === 'language') {
      i18n.changeLanguage(value);
    }
    
    if (key === 'theme') {
      applyTheme(value);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  };

  const handleSaveNickname = () => {
    if (settings.nickname.trim()) {
      updateUser({ nickname: settings.nickname.trim() });
      setIsEditingNickname(false);
    }
  };

  const handleExportData = () => {
    const data = {
      user: user,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `norwegian-vocab-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.settings) {
            setSettings(prev => ({ ...prev, ...data.settings }));
          }
          if (data.user) {
            updateUser(data.user);
          }
          alert(t('app.success'));
        } catch (error) {
          alert(t('app.error'));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (window.confirm(t('settings.clearAllData'))) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('settings.nickname')}</h3>
                  <p className="text-sm text-gray-600">
                    {isEditingNickname ? t('settings.changeNickname') : settings.nickname}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingNickname(!isEditingNickname)}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                {isEditingNickname ? t('app.cancel') : t('app.edit')}
              </button>
            </div>

            {isEditingNickname && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={settings.nickname}
                    onChange={(e) => handleSettingChange('nickname', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('settings.nickname')}
                  />
                  <button
                    onClick={handleSaveNickname}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t('app.save')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-4">{t('settings.selectLanguage')}</h3>
              <div className="space-y-3">
                {[
                  { value: 'en', label: t('settings.english'), flag: '🇺🇸' },
                  { value: 'uk', label: t('settings.ukrainian'), flag: '🇺🇦' }
                ].map((lang) => (
                  <label key={lang.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value={lang.value}
                      checked={settings.language === lang.value}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-gray-900">{lang.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-4">{t('settings.theme')}</h3>
              <div className="space-y-3">
                {[
                  { value: 'light', label: t('settings.light'), icon: Sun },
                  { value: 'dark', label: t('settings.dark'), icon: Moon },
                  { value: 'system', label: t('settings.system'), icon: Monitor }
                ].map((theme) => (
                  <label key={theme.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={settings.theme === theme.value}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <theme.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{theme.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('settings.notifications')}</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.autoSpeak')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.enableAutoSpeak')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSpeak}
                    onChange={(e) => handleSettingChange('autoSpeak', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.soundEffects')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.enableSoundEffects')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.enableNotifications')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.studyReminders')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.enableStudyReminders')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.studyReminders}
                    onChange={(e) => handleSettingChange('studyReminders', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>

                {/* Microphone Permission Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {micPermission === 'granted' ? (
                        <Mic className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <MicOff className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t('settings.microphoneAccess')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {micPermission === 'granted' 
                            ? t('settings.microphoneGranted')
                            : micPermission === 'denied'
                            ? t('settings.microphoneDenied')
                            : t('settings.microphoneDefault')
                          }
                        </p>
                      </div>
                    </div>
                    {micPermission !== 'granted' && (
                      <button
                        onClick={requestMicrophonePermission}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        {t('settings.requestMicrophone')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-4">{t('settings.exportData')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('settings.exportWords')}</p>
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{t('settings.exportData')}</span>
              </button>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-4">{t('settings.importData')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('settings.importWords')}</p>
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>{t('settings.importData')}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-4">{t('settings.clearData')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('settings.clearAllData')}</p>
              <button
                onClick={handleClearData}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('settings.clearData')}</span>
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('app.title')}</h3>
                  <p className="text-sm text-gray-600">v1.0.0</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('settings.version')}:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('settings.buildNumber')}:</span>
                  <span className="font-medium">100</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">{t('settings.contact')}</h4>
              <div className="space-y-2">
                <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  {t('settings.feedback')}
                </button>
                <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  {t('settings.privacy')}
                </button>
                <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  {t('settings.terms')}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('settings.title')}</h1>
        <p className="text-gray-600">Manage your app preferences and account settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeSection === id
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border min-h-[400px]">
            <div className="p-6">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
