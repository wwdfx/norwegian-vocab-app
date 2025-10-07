import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import ttsService from '../services/tts';
import translationService from '../services/translation';
import { Plus, Volume2, Trash2, X, Loader2, Sparkles, Download, Upload, FileText, BookOpen } from 'lucide-react';
import WordTooltip from './WordTooltip';
import WordSets from './WordSets';

const WordManagement = () => {
  const { t } = useTranslation();
  const { words, addWord, deleteWord, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState('my-words'); // 'my-words' or 'word-sets'
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    norwegian: '',
    english: '',
    example: ''
  });
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillError, setAutoFillError] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  // Mobile detection utility
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.norwegian.trim() || !formData.english.trim()) return;

    await addWord(formData.norwegian.trim(), formData.english.trim(), formData.example.trim());
    setFormData({ norwegian: '', english: '', example: '' });
    setShowAddForm(false);
  };

  const handleDelete = async (wordId) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      await deleteWord(wordId);
    }
  };

  const speakWord = async (word) => {
    try {
      await ttsService.speak(word, 'nb-NO');
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const handleNorwegianWordChange = async (e) => {
    const norwegianWord = e.target.value;
    setFormData({ ...formData, norwegian: norwegianWord });
    setAutoFillError('');

    console.log('Norwegian word entered:', norwegianWord);
    console.log('Word length:', norwegianWord.length);
    console.log('Is likely Norwegian:', translationService.isLikelyNorwegian(norwegianWord));

    // Auto-fill if the word looks like Norwegian and is at least 3 characters
    if (norwegianWord.length >= 3 && translationService.isLikelyNorwegian(norwegianWord)) {
      console.log('Triggering auto-fill for:', norwegianWord);
      setIsAutoFilling(true);
      try {
        const wordInfo = await translationService.getWordInfo(norwegianWord);
        console.log('Word info received:', wordInfo);
        if (wordInfo.success) {
          setFormData(prev => ({
            ...prev,
            english: wordInfo.translation,
            example: wordInfo.example
          }));
          console.log('Auto-fill successful:', wordInfo.translation, wordInfo.example);
        } else {
          setAutoFillError('Could not auto-translate this word');
          console.log('Auto-fill failed:', wordInfo.error);
        }
      } catch (error) {
        setAutoFillError('Translation service unavailable');
        console.error('Auto-fill error:', error);
      } finally {
        setIsAutoFilling(false);
      }
    }
  };

  const handleAutoFill = async () => {
    if (!formData.norwegian.trim()) return;
    
    setIsAutoFilling(true);
    setAutoFillError('');
    
    try {
      const wordInfo = await translationService.getWordInfo(formData.norwegian.trim());
      if (wordInfo.success) {
        setFormData(prev => ({
          ...prev,
          english: wordInfo.translation,
          example: wordInfo.example
        }));
      } else {
        setAutoFillError(wordInfo.error || 'Could not get word information');
      }
    } catch (error) {
      setAutoFillError('Translation service unavailable');
      console.error('Auto-fill error:', error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Export vocabulary to CSV
  const exportToCSV = () => {
    if (words.length === 0) {
      alert('No words to export');
      return;
    }

    const csvContent = [
      // CSV header
      ['Norwegian', 'English', 'Example', 'Difficulty Level', 'Times Reviewed', 'Times Correct', 'Created At', 'Last Reviewed', 'Next Review'],
      // CSV data
      ...words.map(word => [
        word.norwegian,
        word.english,
        word.example || '',
        word.difficulty_level || 0,
        word.times_reviewed || 0,
        word.times_correct || 0,
        word.created_at || '',
        word.last_reviewed || '',
        word.next_review || ''
      ])
    ].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');


    
    if (isMobile) {
      // Mobile-friendly approach: show data in a shareable format
      const filename = `norwegian-vocabulary-${new Date().toISOString().split('T')[0]}.csv`;
      
      // Try to use Web Share API if available
      if (navigator.share) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const file = new File([blob], filename, { type: 'text/csv' });
        
        navigator.share({
          title: 'Norwegian Vocabulary Export',
          text: `Export of ${words.length} Norwegian words`,
          files: [file]
        }).catch(error => {
          console.log('Web Share API failed, falling back to text display:', error);
          showMobileCSVData(csvContent, filename);
        });
      } else {
        // Fallback for devices without Web Share API
        showMobileCSVData(csvContent, filename);
      }
    } else {
      // Desktop approach: standard download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `norwegian-vocabulary-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Show CSV data for mobile users
  const showMobileCSVData = (csvContent, filename) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">CSV Export: ${filename}</h3>
          <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">&times;</button>
        </div>
        <div class="p-4 overflow-auto max-h-[60vh]">
          <p class="text-sm text-gray-600 mb-4">
            📱 <strong>Mobile Export:</strong> Copy the data below and save it as a .csv file, or use the share button to send it to other apps.
          </p>
          <div class="bg-gray-100 p-3 rounded border">
            <pre class="text-xs overflow-x-auto whitespace-pre-wrap">${csvContent}</pre>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button onclick="(async()=>{try{await navigator.clipboard.writeText('${csvContent.replace(/'/g, "\\'")}');alert('Copied to clipboard!')}catch(e){alert('Copy failed. Please select and copy manually.')}})()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm">
              📋 Copy to Clipboard
            </button>
            <button onclick="window.open('data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}', '_blank')" class="bg-green-600 text-white px-4 py-2 rounded text-sm">
              🌐 Open in Browser
            </button>
            <button onclick="navigator.share({title: '${filename}', text: 'CSV data for ${filename}', url: 'data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}'})" class="bg-purple-600 text-white px-4 py-2 rounded text-sm">
              📤 Share
            </button>
          </div>
          <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            💡 <strong>Pro tip:</strong> Copy the data and paste it into a text editor, then save with a .csv extension. Or use the share button to send to apps like Notes, Email, or Google Drive.
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  };

  // Download sample CSV template
  const downloadSampleCSV = () => {
    const sampleData = [
      ['Norwegian', 'English', 'Example', 'Difficulty Level', 'Times Reviewed', 'Times Correct', 'Created At', 'Last Reviewed', 'Next Review'],
      ['hei', 'hello', 'Hei, hvordan går det?', '0', '0', '0', '', '', ''],
      ['takk', 'thank you', 'Takk for hjelpen!', '0', '0', '0', '', '', ''],
      ['ja', 'yes', 'Ja, det er riktig.', '0', '0', '0', '', '', ''],
      ['nei', 'no', 'Nei, det er feil.', '0', '0', '0', '', '', '']
    ];

    const csvContent = sampleData.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');


    
    if (isMobile) {
      // Mobile-friendly approach: show template in a shareable format
      const filename = 'norwegian-vocabulary-template.csv';
      
      // Try to use Web Share API if available
      if (navigator.share) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const file = new File([blob], filename, { type: 'text/csv' });
        
        navigator.share({
          title: 'Norwegian Vocabulary Template',
          text: 'Sample CSV template for importing Norwegian words',
          files: [file]
        }).catch(error => {
          console.log('Web Share API failed, falling back to text display:', error);
          showMobileCSVData(csvContent, filename);
        });
      } else {
        // Fallback for devices without Web Share API
        showMobileCSVData(csvContent, filename);
      }
    } else {
      // Desktop approach: standard download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'norwegian-vocabulary-template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Import vocabulary from CSV
  const importFromCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setImportError('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setImportError('CSV file must have at least a header and one data row');
          return;
        }

        // Parse CSV (simple parsing, assumes no commas in the actual data)
        const rows = lines.map(line => {
          const fields = line.split(',').map(field => 
            field.trim().replace(/^"|"$/g, '').replace(/""/g, '"')
          );
          return fields;
        });

        const header = rows[0];
        const dataRows = rows.slice(1);

        // Validate header
        const expectedHeaders = ['Norwegian', 'English', 'Example', 'Difficulty Level', 'Times Reviewed', 'Times Correct', 'Created At', 'Last Reviewed', 'Next Review'];
        const isValidHeader = expectedHeaders.every((expected, index) => 
          header[index] && header[index].toLowerCase().includes(expected.toLowerCase())
        );

        if (!isValidHeader) {
          setImportError('CSV format is invalid. Please use the exported format.');
          return;
        }

        // Process imported words
        let importedCount = 0;
        let skippedCount = 0;

        for (const row of dataRows) {
          if (row.length >= 2 && row[0].trim() && row[1].trim()) {
            const norwegian = row[0].trim();
            const english = row[1].trim();
            const example = row[2] ? row[2].trim() : '';
            
            // Check if word already exists
            const exists = words.some(w => 
              w.norwegian.toLowerCase() === norwegian.toLowerCase() ||
              w.english.toLowerCase() === english.toLowerCase()
            );

            if (!exists) {
              await addWord(norwegian, english, example);
              importedCount++;
            } else {
              skippedCount++;
            }
          }
        }

        if (importedCount > 0) {
          setImportSuccess(`Successfully imported ${importedCount} words${skippedCount > 0 ? `, ${skippedCount} skipped (duplicates)` : ''}`);
          // Clear success message after 5 seconds
          setTimeout(() => setImportSuccess(''), 5000);
        } else if (skippedCount > 0) {
          setImportError(`No new words imported. ${skippedCount} words already exist.`);
          // Clear error message after 5 seconds
          setTimeout(() => setImportError(''), 5000);
        } else {
          setImportError('No valid words found in the CSV file');
          // Clear error message after 5 seconds
          setTimeout(() => setImportError(''), 5000);
        }

        // Clear the file input
        event.target.value = '';

      } catch (error) {
        console.error('CSV import error:', error);
        setImportError('Failed to import CSV file. Please check the format.');
      }
    };

    reader.onerror = () => {
      setImportError('Failed to read the file');
    };

    reader.readAsText(file);
  };

  // If word sets tab is active, render WordSets component
  if (activeTab === 'word-sets') {
    return <WordSets onBack={() => setActiveTab('my-words')} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10">
            <img 
              src={`${process.env.PUBLIC_URL}/Logo.png`}
              alt="NorLearn Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('wordManagement.title')}</h2>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Import/Export buttons */}
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              disabled={words.length === 0}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isMobile ? "Export vocabulary to CSV (Mobile: Will show data for copying/sharing)" : "Export vocabulary to CSV"}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
              {isMobile && <span className="text-xs opacity-75">📱</span>}
            </button>
            
            <label className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload size={16} />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                className="hidden"
              />
            </label>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 sm:py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>Add Word</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('my-words')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'my-words'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plus size={16} />
              <span>{t('navigation.myWords')} ({words.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('word-sets')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'word-sets'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookOpen size={16} />
              <span>{t('wordSets.title')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* CSV Help Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-2">
          <FileText size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">💡 CSV Import/Export</p>
            <p className="mb-2">
              <strong>Export:</strong> Download your vocabulary as a CSV file for backup or use in other applications.
              {isMobile && (
                <span className="block text-xs text-blue-600 mt-1">
                  📱 <strong>Mobile:</strong> Export will show data for copying or sharing with other apps.
                </span>
              )}
            </p>
            <p className="mb-2">
              <strong>Import:</strong> Add words from a CSV file. The file should have columns for Norwegian, English, and optionally Example.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={downloadSampleCSV}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                title={isMobile ? "Download CSV template (Mobile: Will show template for copying/sharing)" : "Download CSV template"}
              >
                📥 Download Template
                {isMobile && <span className="ml-1">📱</span>}
              </button>
              <span className="text-xs text-blue-600">
                Tip: Use the template to see the correct CSV format.
                {isMobile && (
                  <span className="block mt-1 text-blue-500">
                    💡 <strong>Mobile tip:</strong> Use the share button to send CSV data to other apps like Notes, Email, or Drive.
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Import/Export Status Messages */}
      {(importError || importSuccess) && (
        <div className={`rounded-lg p-4 mb-4 ${
          importError ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText size={16} className={importError ? 'text-red-500' : 'text-green-500'} />
              <p className={`text-sm font-medium ${
                importError ? 'text-red-800' : 'text-green-800'
              }`}>
                {importError || importSuccess}
              </p>
            </div>
            <button
              onClick={() => {
                setImportError('');
                setImportSuccess('');
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Word Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('wordManagement.addWord')}</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 p-1 -m-1"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('wordManagement.norwegian')}
                </label>
                <input
                  type="text"
                  value={formData.norwegian}
                  onChange={handleNorwegianWordChange}
                  placeholder={t('wordManagement.norwegian')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                {formData.norwegian.length >= 3 && (
                  <WordTooltip 
                    norwegianWord={formData.norwegian}
                    position="bottom"
                  >
                    <div className="mt-2 text-sm text-gray-500 cursor-help hover:text-purple-600 transition-colors">
                      💡 Hover to see translation and example
                    </div>
                  </WordTooltip>
                )}
                {formData.norwegian.length >= 3 && !isAutoFilling && (
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="mt-2 flex items-center space-x-2 text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Sparkles size={14} />
                    <span>Auto-fill translation</span>
                  </button>
                )}
                {isAutoFilling && (
                  <p className="text-purple-600 text-sm mt-2 flex items-center">
                    <Loader2 size={14} className="animate-spin mr-1" />
                    Translating...
                  </p>
                )}
                {autoFillError && (
                  <p className="text-red-500 text-sm mt-2">{autoFillError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('wordManagement.english')}
                </label>
                <input
                  type="text"
                  value={formData.english}
                  onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                  placeholder={t('wordManagement.english')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('wordManagement.example')} (Optional)
              </label>
              <input
                type="text"
                value={formData.example}
                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                placeholder="Enter example sentence"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {isAutoFilling && (
                <p className="text-purple-600 text-sm mt-1 flex items-center">
                  <Loader2 size={14} className="animate-spin mr-1" />
                  Generating example sentence...
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 sm:py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 w-full sm:w-auto"
              >
                {isLoading ? 'Adding...' : 'Add Word'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-3 sm:py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Words List */}
      {words.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
          <div className="text-4xl sm:text-6xl mb-4">📚</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{t('wordManagement.noWords')}</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {t('wordManagement.noWords')}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto"
          >
{t('wordManagement.addFirstWord')}
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {words.map((word) => (
            <div key={word.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    <WordTooltip 
                      norwegianWord={word.norwegian}
                      englishTranslation={word.english}
                      example={word.example}
                      position="top"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate cursor-help hover:text-purple-600 transition-colors">
                        {word.norwegian}
                      </h3>
                    </WordTooltip>
                    <button
                      onClick={() => speakWord(word.norwegian)}
                      className="text-purple-600 hover:text-purple-700 transition-colors p-1 -m-1 flex-shrink-0"
                      title="Listen to pronunciation"
                    >
                      <Volume2 size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg mb-1">
                    {word.english}
                  </p>
                  {word.example && (
                    <p className="text-gray-500 italic text-sm sm:text-base break-words">
                      "{word.example}"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                  <div className="text-left sm:text-right">
                    <div className="text-xs sm:text-sm text-gray-500">Progress</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      {word.times_correct || 0}/{word.times_reviewed || 0}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(word.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 -m-2"
                    title="Delete word"
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordManagement;
