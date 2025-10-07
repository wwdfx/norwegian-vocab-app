import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Play, 
  CheckCircle, 
  X,
  Volume2,
  ArrowLeft,
  ArrowRight,
  User,
  Image as ImageIcon,
  Headphones,
  FileText,
  Calculator,
  Book,
  Mic,
  Plus
} from 'lucide-react';
import { lessonsData, getLessonById, getLessonSections, getExercisesForLesson } from '../data/lessons';
import gamificationService from '../services/gamificationService';
import ttsService from '../services/tts';
import i18n from '../i18n';

const Lesson = () => {
  const { t } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [dragDropAnswers, setDragDropAnswers] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [wordOrderAnswers, setWordOrderAnswers] = useState({});
  const [wordOrderDraggedItem, setWordOrderDraggedItem] = useState(null);

  useEffect(() => {
    // Load user statistics
    const stats = gamificationService.getUserStatistics();
    setUserStats(stats);
    
    // Load completed lessons from localStorage
    const savedCompleted = localStorage.getItem('completedLessons');
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        setCompletedLessons(new Set(parsed));
      } catch (error) {
        console.error('Error loading completed lessons:', error);
      }
    }
  }, []);

  // Handle lesson start
  const handleLessonStart = (lesson) => {
    setSelectedLesson(lesson);
    setSelectedSection(Object.values(lesson.sections)[0]); // Start with first section
    setShowLessonModal(true);
  };

  // Handle section change
  const handleSectionChange = (sectionId) => {
    if (selectedLesson && selectedLesson.sections[sectionId]) {
      setSelectedSection(selectedLesson.sections[sectionId]);
    }
  };

  // Handle audio play/pause
  const handleAudioToggle = () => {
    if (!selectedLesson?.audio) return;
    
    if (audioPlaying) {
      // Pause audio
      setAudioPlaying(false);
    } else {
      // Play audio
      setAudioPlaying(true);
      // TODO: Implement actual audio playback
      setTimeout(() => setAudioPlaying(false), 42000); // 42 seconds
    }
  };

  // Handle dialogue text-to-speech
  const handleSpeakText = (text) => {
    ttsService.speak(text);
  };

  // Handle quiz answer selection
  const handleQuizAnswerSelect = (exerciseId, questionIndex, optionIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [`${exerciseId}-${questionIndex}`]: optionIndex
    }));
  };

  const isQuizAnswerSelected = (exerciseId, questionIndex, optionIndex) => {
    return quizAnswers[`${exerciseId}-${questionIndex}`] === optionIndex;
  };

  const isQuizAnswerCorrect = (exerciseId, questionIndex, optionIndex) => {
    const answerKey = `${exerciseId}-${questionIndex}`;
    const selectedAnswer = quizAnswers[answerKey];
    if (selectedAnswer === undefined) return null; // No answer selected yet
    
    const exercise = selectedLesson?.listening_content?.exercises?.find(ex => ex.id === exerciseId);
    if (!exercise) return null;
    
    const question = exercise.questions[questionIndex];
    if (!question) return null;
    
    const selectedOption = question.options[selectedAnswer];
    return selectedOption?.correct || false;
  };

  // Handle exercise answer input
  const handleExerciseAnswerChange = (dialogueIndex, blankIndex, value) => {
    const key = `${dialogueIndex}-${blankIndex}`;
    setExerciseAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Check if exercise is complete
  const isExerciseComplete = (exercise) => {
    let totalBlanks = 0;
    
    if (exercise.dialogue) {
      exercise.dialogue.forEach((dialogue, index) => {
        if (Array.isArray(dialogue.correct_answer)) {
          totalBlanks += dialogue.correct_answer.length;
        } else {
          totalBlanks += 1;
        }
      });
    } else if (exercise.sentences) {
      exercise.sentences.forEach((sentence, index) => {
        if (Array.isArray(sentence.correct_answer)) {
          totalBlanks += sentence.correct_answer.length;
        } else {
          totalBlanks += 1; // Each sentence has one blank
        }
      });
    } else if (exercise.sections) {
      exercise.sections.forEach((section, sectionIndex) => {
        section.exercises.forEach((exercise, exerciseIndex) => {
          totalBlanks += 1; // Each exercise has one blank
        });
      });
    }
    
    return Object.keys(exerciseAnswers).length === totalBlanks;
  };

  // Check if exercise is correct
  const isExerciseCorrect = (exercise) => {
    let correctCount = 0;
    let totalBlanks = 0;
    
    if (exercise.dialogue) {
      exercise.dialogue.forEach((dialogue, index) => {
        if (Array.isArray(dialogue.correct_answer)) {
          dialogue.correct_answer.forEach((answer, blankIndex) => {
            const key = `${index}-${blankIndex}`;
            const userAnswer = exerciseAnswers[key];
            if (userAnswer && userAnswer.toLowerCase().trim() === answer.toLowerCase().trim()) {
              correctCount++;
            }
            totalBlanks++;
          });
        } else {
          const key = `${index}-0`;
          const userAnswer = exerciseAnswers[key];
          if (userAnswer && userAnswer.toLowerCase().trim() === dialogue.correct_answer.toLowerCase().trim()) {
            correctCount++;
          }
          totalBlanks++;
        }
      });
    } else if (exercise.sentences) {
      exercise.sentences.forEach((sentence, index) => {
        if (Array.isArray(sentence.correct_answer)) {
          sentence.correct_answer.forEach((answer, blankIndex) => {
            const key = `${index}-${blankIndex}`;
            const userAnswer = exerciseAnswers[key];
            if (userAnswer && userAnswer.toLowerCase().trim() === answer.toLowerCase().trim()) {
              correctCount++;
            }
            totalBlanks++;
          });
        } else {
          const key = `${index}-0`;
          const userAnswer = exerciseAnswers[key];
          if (userAnswer && userAnswer.toLowerCase().trim() === sentence.correct_answer.toLowerCase().trim()) {
            correctCount++;
          }
          totalBlanks++;
        }
      });
    } else if (exercise.sections) {
      exercise.sections.forEach((section, sectionIndex) => {
        section.exercises.forEach((exercise, exerciseIndex) => {
          const key = `${sectionIndex}-${exerciseIndex}`;
          const userAnswer = exerciseAnswers[key];
          if (userAnswer && userAnswer.toLowerCase().trim() === exercise.correct_answer.toLowerCase().trim()) {
            correctCount++;
          }
          totalBlanks++;
        });
      });
    }
    
    return correctCount === totalBlanks;
  };

  // Close modal
  const handleClose = () => {
    setShowLessonModal(false);
    setSelectedLesson(null);
    setSelectedSection(null);
    setAudioPlaying(false);
  };

  // Handle drag and drop
  const handleDragStart = (e, answer) => {
    setDraggedItem(answer);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, pairIndex) => {
    e.preventDefault();
    if (draggedItem) {
      setDragDropAnswers(prev => ({
        ...prev,
        [pairIndex]: draggedItem
      }));
      setDraggedItem(null);
    }
  };

  const handleRemoveAnswer = (pairIndex) => {
    setDragDropAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[pairIndex];
      return newAnswers;
    });
  };

  // Check if drag and drop exercise is complete
  const isDragDropComplete = (exercise) => {
    return Object.keys(dragDropAnswers).length === exercise.pairs.length;
  };

  // Check if drag and drop exercise is correct
  const isDragDropCorrect = (exercise) => {
    let correctCount = 0;
    exercise.pairs.forEach((pair, index) => {
      const userAnswer = dragDropAnswers[index];
      if (userAnswer && userAnswer === pair.correct_answer) {
        correctCount++;
      }
    });
    return correctCount === exercise.pairs.length;
  };

  // Handle word order drag and drop
  const handleWordOrderDragStart = (e, word, exerciseId) => {
    setWordOrderDraggedItem({ word, exerciseId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleWordOrderDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleWordOrderDrop = (e, exerciseId, positionIndex) => {
    e.preventDefault();
    if (wordOrderDraggedItem && wordOrderDraggedItem.exerciseId === exerciseId) {
      const currentAnswers = wordOrderAnswers[exerciseId] || [];
      const newAnswers = [...currentAnswers];
      newAnswers[positionIndex] = wordOrderDraggedItem.word;
      setWordOrderAnswers(prev => ({
        ...prev,
        [exerciseId]: newAnswers
      }));
      setWordOrderDraggedItem(null);
    }
  };

  const handleWordOrderRemove = (exerciseId, positionIndex) => {
    const currentAnswers = wordOrderAnswers[exerciseId] || [];
    const newAnswers = [...currentAnswers];
    newAnswers[positionIndex] = null;
    setWordOrderAnswers(prev => ({
      ...prev,
      [exerciseId]: newAnswers
    }));
  };

  // Check if word order exercise is complete
  const isWordOrderComplete = (exercise) => {
    return exercise.exercises.every(ex => {
      const answers = wordOrderAnswers[ex.id] || [];
      const expectedLength = ex.correct_order.length;
      return answers.filter(answer => answer !== null).length === expectedLength;
    });
  };

  // Check if word order exercise is correct
  const isWordOrderCorrect = (exercise) => {
    return exercise.exercises.every(ex => {
      const answers = wordOrderAnswers[ex.id] || [];
      return ex.correct_order.every((expectedWord, index) => answers[index] === expectedWord);
    });
  };

  // Close exercise modal
  const handleCloseExercise = () => {
    setShowExerciseModal(false);
    setSelectedExercise(null);
    setExerciseAnswers({});
    setDragDropAnswers({});
    setDraggedItem(null);
    setWordOrderAnswers({});
    setWordOrderDraggedItem(null);
  };

  // Render section content based on type
  const renderSectionContent = () => {
    if (!selectedLesson || !selectedSection) return null;

    switch (selectedSection.type) {
      case 'content':
      case 'dialogue':
        return renderContentSection();
      case 'exercises':
        return renderExercisesSection();
      default:
        return <div>Section type not implemented yet</div>;
    }
  };

  // Render content sections (dialogue, vocabulary, etc.)
  const renderContentSection = () => {
    const contentKey = selectedSection.content;
    let content;
    
    // Handle different content types
    if (selectedSection.type === 'dialogue') {
      content = selectedLesson.dialogues[contentKey];
    } else {
      content = selectedLesson[contentKey];
    }

    if (!content) return <div>Content not found</div>;

    switch (contentKey) {
      case 'ken_monika':
      case 'anna_lars':
      case 'maria_lisa':
      case 'peter_frank':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {content.title}
              </h3>
              {content.audio && (
                <button
                  onClick={handleAudioToggle}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    audioPlaying 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>{audioPlaying ? t('lessons.pause') : t('lessons.play')}</span>
                </button>
              )}
            </div>
            
            {/* Introduction */}
            {content.introduction && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <p className="text-gray-800 dark:text-gray-200 mb-2">
                  {content.introduction.norwegian}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {i18n.language === 'uk' && content.introduction.ukrainian ? content.introduction.ukrainian : content.introduction.english}
                </p>
              </div>
            )}

            {/* Media */}
            {contentKey === 'ken_monika' && (
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {selectedLesson.media.portrait && (
                  <div className="text-center">
                    <img 
                      src={selectedLesson.media.portrait} 
                      alt="Ken" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Ken</p>
                  </div>
                )}
                {contentKey === 'anna_lars' && selectedLesson.media.anna_portrait && (
                  <div className="text-center">
                    <img 
                      src={selectedLesson.media.anna_portrait} 
                      alt="Anna" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Anna</p>
                  </div>
                )}
                {selectedLesson.media.landscape && (
                  <div className="text-center">
                    <img 
                      src={selectedLesson.media.landscape} 
                      alt="Norwegian nature" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {t('lessons.norwegianNature')}
                    </p>
                  </div>
                )}
                {contentKey === 'anna_lars' && (
                  <div className="text-center">
                    <img 
                      src="/src/media/lesson1/pic4.jpg" 
                      alt="Norwegian Air" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Norwegian Air</p>
                  </div>
                )}
                {contentKey === 'maria_lisa' && (
                  <div className="text-center">
                    <img 
                      src="/src/media/lesson1/pic5.jpg" 
                      alt="Maria" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Maria</p>
                  </div>
                )}
                {contentKey === 'maria_lisa' && (
                  <div className="text-center">
                    <img 
                      src="/src/media/lesson1/pic6.jpg" 
                      alt="Polarlys ship" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Polarlys</p>
                  </div>
                )}
                {contentKey === 'peter_frank' && (
                  <div className="text-center">
                    <img 
                      src="/src/media/lesson1/pic7.jpg" 
                      alt="Peter" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Peter</p>
                  </div>
                )}
                {contentKey === 'peter_frank' && (
                  <div className="text-center">
                    <img 
                      src="/src/media/lesson1/pic8.jpg" 
                      alt="Gas station" 
                      className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Gas station</p>
                  </div>
                )}
              </div>
            )}

            {/* Dialogue */}
            <div className="space-y-4">
              {content.dialogue && content.dialogue.map((line, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                        {line.speaker}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {line.norwegian}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {i18n.language === 'uk' && line.ukrainian ? line.ukrainian : line.english}
                      </p>
                      <button
                        onClick={() => handleSpeakText(line.norwegian)}
                        className="mt-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'grammar_content':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('lessons.grammar')}
            </h3>
            
            {/* Pronouns */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.pronouns.title}
              </h4>
              {content.pronouns.video_url && (
                <div className="mb-4">
                  <a 
                    href={content.pronouns.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </a>
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {content.pronouns.subtitle}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {content.pronouns.table.map((pronoun, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {pronoun.norwegian}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {pronoun.english}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verbs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.verbs.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {content.verbs.subtitle}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.verbs.rule}
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Infinitive</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">English</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Present tense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.verbs.examples.map((verb, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{verb.infinitive}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{verb.english}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white font-semibold">{verb.present}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {content.verbs.explanation}
              </p>
              <div className="space-y-2 mb-4">
                {content.verbs.sample_sentences.map((sentence, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{sentence.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{sentence.english}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {content.verbs.irregular}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Infinitive</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">English</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Present tense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.verbs.irregular_verbs.map((verb, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{verb.infinitive}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{verb.english}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white font-semibold">{verb.present}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nouns */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.nouns.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.nouns.rule}
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Gender</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Norwegian</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">English</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.nouns.examples.map((noun, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{noun.gender}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white font-semibold">{noun.norwegian}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{noun.english}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{content.nouns.note}</span> {content.nouns.feminine_note}
                </p>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">{content.nouns.omitting}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{content.nouns.omitting_rule}</p>
                  <div className="space-y-2">
                    {content.nouns.omitting_examples.map((example, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Conjunctions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.conjunctions.title}
              </h4>
              {content.conjunctions.video_url && (
                <div className="mb-4">
                  <a 
                    href={content.conjunctions.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </a>
                </div>
              )}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.conjunctions.rule}
              </p>
              <div className="space-y-3">
                {content.conjunctions.examples.map((example, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Words */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.questions.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.questions.subtitle}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {content.questions.words.map((word, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {word.norwegian}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {word.english}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {content.questions.examples.map((example, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Word Order */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.word_order.title}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{content.word_order.main_clauses}</h5>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.verb_second}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.main_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.main_example.english}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{content.word_order.negation}</h5>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.negation_rule}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.negation_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.negation_example.english}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 mb-2">{content.word_order.adverbs_note}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.adverbs_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.adverbs_example.english}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{content.word_order.questions}</h5>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.question_rules}</p>
                  <div className="space-y-2 mb-3">
                    {content.word_order.question_examples.map((example, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.question_without_word}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.question_without_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.question_without_example.english}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nationalities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.nationalities.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.nationalities.subtitle}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Countries</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Nationalities (adjectives)</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Languages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.nationalities.table.map((row, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{row.country}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{row.nationality}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{row.language}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'listening_content':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('lessons.listening')}
            </h3>
            
            {content.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {exercise.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {exercise.description}
                </p>
                
                {/* Audio Player for exercises with audio */}
                {exercise.audio_path && (
                  <div className="mb-4">
                    <audio controls className="w-full">
                      <source src={exercise.audio_path} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                
                {/* Fill in the blanks listening exercise */}
                {exercise.type === 'fill_blanks_listening' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                        {exercise.text.split('__').map((part, index, array) => (
                          <span key={index}>
                            {part}
                            {index < array.length - 1 && (
                              <span className="inline-block mx-2 w-24 h-8 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded bg-white dark:bg-gray-600"></span>
                            )}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Instructions:</strong> Listen to the audio and fill in the missing words. The complete text should be: "Ken Robbins kommer fra England. Han bor i London. Ken er 23 år gammel. Han reiser med tog til Oslo og Trondheim. Ken møter en ei dame. Hyggelig å hilse på deg."
                    </div>
                  </div>
                )}
                
                {/* Multiple choice listening exercise */}
                {exercise.type === 'multiple_choice_listening' && (
                  <div className="space-y-4">
                    {exercise.questions.map((question, qIndex) => (
                      <div key={qIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {question.question}
                        </h5>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => {
                            const isSelected = isQuizAnswerSelected(exercise.id, qIndex, oIndex);
                            const isCorrect = isQuizAnswerCorrect(exercise.id, qIndex, oIndex);
                            const showResult = quizAnswers[`${exercise.id}-${qIndex}`] !== undefined;
                            
                            return (
                              <button
                                key={oIndex}
                                onClick={() => handleQuizAnswerSelect(exercise.id, qIndex, oIndex)}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                  isSelected
                                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <span className={`text-sm text-left ${
                                  isSelected
                                    ? 'text-blue-700 dark:text-blue-300 font-medium'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {option.text}
                                </span>
                                {showResult && (
                                  <div className="ml-auto">
                                    {isCorrect ? (
                                      <span className="text-green-600 dark:text-green-400">✓</span>
                                    ) : (
                                      <span className="text-red-600 dark:text-red-400">✗</span>
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Listen and repeat exercise */}
                {exercise.type === 'listen_repeat' && (
                  <div className="space-y-3">
                    {exercise.sentences.map((sentence, sIndex) => (
                      <div key={sIndex} className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <button
                          onClick={() => handleSpeakText(sentence)}
                          className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <div className="flex-grow">
                          <p className="text-gray-800 dark:text-gray-200 text-lg">
                            {sentence}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        <strong>Instructions:</strong> Click the play button to hear each sentence, then repeat it out loud. Practice your pronunciation by mimicking the speaker.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'pronunciation_content':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('lessons.pronunciation')}
            </h3>
            
            {/* Norwegian Alphabet */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.alphabet.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.alphabet.description}
              </p>
              
              {/* Basic Letters */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Basic Letters (A-Z)</h5>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {content.alphabet.letters.basic.map((letter, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {letter.upper}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {letter.lower}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                        {letter.ipa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Letters */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Special Norwegian Letters</h5>
                <div className="grid grid-cols-3 gap-4">
                  {content.alphabet.letters.special.map((letter, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {letter.upper}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-400">
                        {letter.lower}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                        {letter.ipa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                {content.alphabet.explanation}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {content.alphabet.symbols_note}
              </p>
            </div>

            {/* Special Letters Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.alphabet.special_letters.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.alphabet.special_letters.description}
              </p>
              
              <div className="space-y-4">
                {content.alphabet.special_letters.replacements.map((replacement, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        &lt; {replacement.letter} &gt;
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">→</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        &lt; {replacement.replacement} &gt;
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        «{replacement.example}» → «{replacement.example_replacement}»
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 italic">
                        {replacement.translation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm">
                {content.alphabet.special_letters.loanwords_note}
              </p>
            </div>

            {/* Norwegian and English Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.comparison.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
                {content.comparison.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.comparison.letters.map((letter, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white w-8">
                        {letter.letter.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {letter.pronunciation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference to Alphabet Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Interactive Alphabet Practice
              </h4>
              <p className="text-blue-700 dark:text-blue-200 mb-4">
                For hands-on practice with the Norwegian alphabet, visit the Alphabet section in the main navigation. 
                You can click on each letter to hear its pronunciation and see example words.
              </p>
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <span className="text-sm font-medium">Go to:</span>
                <span className="text-sm">Navigation → Alphabet</span>
              </div>
            </div>
          </div>
        );

      case 'vocabulary':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('lessons.vocabulary')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map((word, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                          {word.norwegian}
                        </span>
                        {word.gender && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                            {word.gender}
                          </span>
                        )}
                        {word.category && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                            {word.category}
                          </span>
                        )}
                      </div>
                      
                      {word.transcription && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-1">
                          {word.transcription}
                        </p>
                      )}
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {word.english}
                      </p>
                      
                      {word.inflection && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span className="font-medium">Inflection:</span> {word.inflection}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleSpeakText(word.norwegian)}
                      className="ml-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 flex-shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'numerals':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('lessons.numerals')}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {content.map((numeral, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {numeral.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {numeral.norwegian}
                  </div>
                  <button
                    onClick={() => handleSpeakText(numeral.norwegian)}
                    className="mt-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Volume2 className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'grammar_content':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('lessons.grammar')}
            </h3>
            
            {/* Pronouns */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.pronouns.title}
              </h4>
              {content.pronouns.video_url && (
                <div className="mb-4">
                  <a 
                    href={content.pronouns.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </a>
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {content.pronouns.subtitle}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {content.pronouns.table.map((pronoun, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {pronoun.norwegian}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {pronoun.english}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verbs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.verbs.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {content.verbs.subtitle}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.verbs.rule}
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Infinitive</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">English</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Present tense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.verbs.examples.map((verb, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{verb.infinitive}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{verb.english}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white font-semibold">{verb.present}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {content.verbs.explanation}
              </p>
              <div className="space-y-2 mb-4">
                {content.verbs.sample_sentences.map((sentence, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{sentence.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{sentence.english}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {content.verbs.irregular}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Infinitive</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">English</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Present tense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.verbs.irregular_verbs.map((verb, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{verb.infinitive}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{verb.english}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white font-semibold">{verb.present}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nouns */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.nouns.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.nouns.rule}
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Gender</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Norwegian</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">English</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.nouns.examples.map((noun, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{noun.gender}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white font-semibold">{noun.norwegian}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{noun.english}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{content.nouns.note}</span> {content.nouns.feminine_note}
                </p>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">{content.nouns.omitting}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{content.nouns.omitting_rule}</p>
                  <div className="space-y-2">
                    {content.nouns.omitting_examples.map((example, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Conjunctions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.conjunctions.title}
              </h4>
              {content.conjunctions.video_url && (
                <div className="mb-4">
                  <a 
                    href={content.conjunctions.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </a>
                </div>
              )}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.conjunctions.rule}
              </p>
              <div className="space-y-3">
                {content.conjunctions.examples.map((example, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Words */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.questions.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.questions.subtitle}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {content.questions.words.map((word, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {word.norwegian}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {word.english}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {content.questions.examples.map((example, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Word Order */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.word_order.title}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{content.word_order.main_clauses}</h5>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.verb_second}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.main_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.main_example.english}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{content.word_order.negation}</h5>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.negation_rule}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.negation_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.negation_example.english}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 mb-2">{content.word_order.adverbs_note}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.adverbs_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.adverbs_example.english}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{content.word_order.questions}</h5>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.question_rules}</p>
                  <div className="space-y-2 mb-3">
                    {content.word_order.question_examples.map((example, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <span className="text-gray-900 dark:text-white font-medium">{example.norwegian}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{example.english}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{content.word_order.question_without_word}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-gray-900 dark:text-white font-medium">{content.word_order.question_without_example.norwegian}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{content.word_order.question_without_example.english}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nationalities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {content.nationalities.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {content.nationalities.subtitle}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Countries</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Nationalities (adjectives)</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">Languages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.nationalities.table.map((row, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{row.country}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">{row.nationality}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-600 dark:text-gray-400">{row.language}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'extras_content':
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Extras
            </h3>

            {/* 1.1 Numerals Basic */}
            {content.numerals_basic && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {content.numerals_basic.title}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {content.numerals_basic.numbers.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[40px]">
                        {item.number}
                      </span>
                      <span className="text-gray-900 dark:text-white">-</span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.norwegian}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1.2 Numerals 40+ */}
            {content.numerals_40plus && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {content.numerals_40plus.title}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {content.numerals_40plus.numbers.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[80px]">
                        {item.number}
                      </span>
                      <span className="text-gray-900 dark:text-white">-</span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.norwegian}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1.3 Articles */}
            {content.articles && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {content.articles.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {content.articles.subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.articles.examples.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-semibold text-gray-900 dark:text-white min-w-[100px]">
                        {item.norwegian}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.english}
                      </span>
                      <span className={`ml-auto px-3 py-1 rounded-full text-xs ${
                        item.type === 'indefinite' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1.4 Nationalities Basic */}
            {content.nationalities_basic && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {content.nationalities_basic.title}
                </h4>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Country
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Nationality
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.nationalities_basic.countries.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                          {item.country}
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                          {item.nationality}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 1.5 Nationalities Extended */}
            {content.nationalities_extended && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {content.nationalities_extended.title}
                </h4>
                
                {/* Countries */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Countries</h5>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Country
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Person
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Adjective
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.nationalities_extended.countries.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                            {item.country}
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                            {item.person}
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                            {item.adjective}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Continents */}
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Continents</h5>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Continent
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Person
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Adjective
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.nationalities_extended.continents.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                            {item.continent}
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                            {item.person}
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                            {item.adjective}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Content type not implemented yet</div>;
    }
  };

  // Render exercises section
  const renderExercisesSection = () => {
    const exercises = getExercisesForLesson(selectedLesson.id);
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {t('lessons.exercises')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedExercise(exercise);
                setShowExerciseModal(true);
                setExerciseAnswers({});
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {exercise.title}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">50 XP</span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {exercise.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Level {exercise.level}
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  {exercise.type.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('lessons.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('lessons.subtitle')}
            </p>
          </div>
        </div>
        
        {userStats && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
              <Star className="w-4 h-4" />
              <span>{userStats.level}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
              <Trophy className="w-4 h-4" />
              <span>{userStats.xp} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessonsData.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-shadow ${
                  lesson.isUnderConstruction 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg cursor-pointer'
                }`}
                onClick={() => !lesson.isUnderConstruction && handleLessonStart(lesson)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {lesson.isUnderConstruction ? (
                      <div className="w-5 h-5 rounded-full bg-yellow-500 dark:bg-yellow-400 flex items-center justify-center">
                        <span className="text-white text-xs">🚧</span>
                      </div>
                    ) : completedLessons.has(lesson.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                    <span className={`font-semibold ${
                      lesson.isUnderConstruction 
                        ? 'text-gray-500 dark:text-gray-500' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {lesson.isUnderConstruction ? (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded font-medium">
                        Coming Soon
                      </span>
                    ) : completedLessons.has(lesson.id) ? (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {t('lessons.completed')}
                      </span>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{lesson.xp_reward} XP</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className={`text-sm mb-4 ${
                  lesson.isUnderConstruction 
                    ? 'text-gray-500 dark:text-gray-500 italic' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {lesson.subtitle}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Level {lesson.level}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {lesson.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedLesson.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Navigation Panel */}
              <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t('lessons.lessonSections')}
                </h3>
                <nav className="space-y-2">
                  {Object.values(selectedLesson.sections).map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedSection?.id === section.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderSectionContent()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Modal */}
      {showExerciseModal && selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedExercise.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedExercise.description}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseExercise}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedExercise.type === 'drag_drop' && (
                <div className="space-y-4">
                  {/* Two-column layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column - Drop zones */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                        Drag answers to the prompts:
                      </h4>
                      {selectedExercise.pairs.map((pair, pairIndex) => (
                        <div key={pairIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="mb-2">
                            <p className="text-gray-900 dark:text-white font-medium text-sm">
                              {pair.prompt}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs italic">
                              {pair.prompt_translation}
                            </p>
                          </div>
                          
                          <div
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, pairIndex)}
                            className={`min-h-10 border-2 border-dashed rounded p-2 flex items-center transition-colors ${
                              dragDropAnswers[pairIndex]
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                            }`}
                          >
                            {dragDropAnswers[pairIndex] ? (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex-1">
                                  <p className="text-gray-900 dark:text-white font-medium text-sm">
                                    {dragDropAnswers[pairIndex]}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-400 text-xs italic">
                                    {selectedExercise.pairs.find(p => p.correct_answer === dragDropAnswers[pairIndex])?.correct_answer_translation}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveAnswer(pairIndex)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Drop answer here
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right column - Answer options */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                        Available answers:
                      </h4>
                      <div className="space-y-2">
                        {selectedExercise.pairs.map((pair, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, pair.correct_answer)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 cursor-move hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <p className="text-gray-900 dark:text-white font-medium text-sm">
                              {pair.correct_answer}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs italic">
                              {pair.correct_answer_translation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress and Submit - Fixed at bottom */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 -mx-6 px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(dragDropAnswers).length} of {selectedExercise.pairs.length} answers placed
                    </div>
                    <div className="flex items-center space-x-4">
                      {isDragDropComplete(selectedExercise) && isDragDropCorrect(selectedExercise) && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">All correct!</span>
                        </div>
                      )}
                      <button
                        onClick={handleCloseExercise}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Close Exercise
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedExercise.type === 'word_order' && (
                <div className="space-y-6">
                  {/* Exercise Content */}
                  <div className="space-y-6">
                    {selectedExercise.exercises.map((exercise, exerciseIndex) => {
                      const answers = wordOrderAnswers[exercise.id] || [];
                      
                      return (
                        <div key={exercise.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center mb-4">
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium px-2 py-1 rounded">
                              {exercise.id})
                            </span>
                          </div>
                          
                          {/* Sentence Structure with Drop Zones */}
                          <div className="flex items-center flex-wrap gap-2 mb-4">
                            {exercise.correct_order.map((word, positionIndex) => (
                              <div key={positionIndex} className="flex items-center">
                                <div
                                  onDragOver={handleWordOrderDragOver}
                                  onDrop={(e) => handleWordOrderDrop(e, exercise.id, positionIndex)}
                                  className={`min-w-20 min-h-10 border-2 border-dashed rounded-lg p-2 flex items-center justify-center transition-colors ${
                                    answers[positionIndex]
                                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                                  }`}
                                >
                                  {answers[positionIndex] ? (
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-gray-900 dark:text-white text-sm font-medium">
                                        {answers[positionIndex]}
                                      </span>
                                      <button
                                        onClick={() => handleWordOrderRemove(exercise.id, positionIndex)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-1"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                                      _
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                            <span className="text-gray-900 dark:text-white text-lg font-medium">
                              {exercise.punctuation}
                            </span>
                          </div>

                          {/* Available Words */}
                          <div className="flex flex-wrap gap-2">
                            {exercise.available_words.map((word, wordIndex) => {
                              const isUsed = answers.includes(word);
                              return (
                                <div
                                  key={wordIndex}
                                  draggable={!isUsed}
                                  onDragStart={(e) => handleWordOrderDragStart(e, word, exercise.id)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isUsed
                                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-move hover:bg-gray-50 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {word}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress and Submit */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 -mx-6 px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedExercise.exercises.filter(ex => {
                        const answers = wordOrderAnswers[ex.id] || [];
                        return answers.filter(answer => answer !== null).length === ex.correct_order.length;
                      }).length} of {selectedExercise.exercises.length} sentences completed
                    </div>
                    <div className="flex items-center space-x-4">
                      {isWordOrderComplete(selectedExercise) && isWordOrderCorrect(selectedExercise) && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">All correct!</span>
                        </div>
                      )}
                      <button
                        onClick={handleCloseExercise}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Close Exercise
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedExercise.type === 'fill_blanks_sentences' && (
                <div className="space-y-6">
                  {/* Example */}
                  {selectedExercise.example && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Example:</h4>
                      <p className="text-blue-800 dark:text-blue-200">{selectedExercise.example}</p>
                    </div>
                  )}

                  {/* Exercise Content */}
                  <div className="space-y-4">
                    {selectedExercise.sentences.map((sentence, sentenceIndex) => (
                      <div key={sentenceIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {sentence.text.split('__').map((part, partIndex, array) => (
                            <span key={partIndex}>
                              <span className="text-gray-800 dark:text-gray-200 text-lg">{part}</span>
                              {partIndex < array.length - 1 && (
                                <input
                                  type="text"
                                  value={exerciseAnswers[`${sentenceIndex}-${partIndex}`] || ''}
                                  onChange={(e) => handleExerciseAnswerChange(sentenceIndex, partIndex, e.target.value)}
                                  className="inline-block w-24 h-10 px-3 mx-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="___"
                                />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress and Submit */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(exerciseAnswers).length} answers filled
                    </div>
                    <div className="flex items-center space-x-4">
                      {isExerciseComplete(selectedExercise) && isExerciseCorrect(selectedExercise) && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">All correct!</span>
                        </div>
                      )}
                      <button
                        onClick={handleCloseExercise}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Close Exercise
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedExercise.type === 'numbers_practice' && (
                <div className="space-y-6">
                  {/* Exercise Content */}
                  <div className="space-y-6">
                    {selectedExercise.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {section.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                          {section.description}
                        </p>
                        
                        <div className="space-y-3">
                          {section.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-lg p-4">
                              <input
                                type="text"
                                value={exerciseAnswers[`${sectionIndex}-${exerciseIndex}`] || ''}
                                onChange={(e) => handleExerciseAnswerChange(`${sectionIndex}-${exerciseIndex}`, 0, e.target.value)}
                                className="w-20 h-10 px-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="___"
                              />
                              <span className="text-gray-600 dark:text-gray-400">=</span>
                              <span className="text-gray-900 dark:text-white text-lg font-medium">
                                {section.type === 'numbers_to_digits' ? exercise.norwegian : exercise.digit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress and Submit */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(exerciseAnswers).length} answers filled
                    </div>
                    <div className="flex items-center space-x-4">
                      {isExerciseComplete(selectedExercise) && isExerciseCorrect(selectedExercise) && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">All correct!</span>
                        </div>
                      )}
                      <button
                        onClick={handleCloseExercise}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Close Exercise
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedExercise.type === 'fill_blanks_dialogue' && (
                <div className="space-y-6">
                  {/* Example */}
                  {selectedExercise.example && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Example:</h4>
                      <p className="text-blue-800 dark:text-blue-200">{selectedExercise.example}</p>
                    </div>
                  )}

                  {/* Exercise Content */}
                  <div className="space-y-4">
                    {selectedExercise.dialogue.map((dialogue, dialogueIndex) => (
                      <div key={dialogueIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        {/* Context */}
                        {dialogue.context && (
                          <p className="text-gray-700 dark:text-gray-300 mb-3 italic">
                            {dialogue.context}
                          </p>
                        )}
                        
                        {/* Dialogue Line */}
                        <div className="space-y-2">
                          {dialogue.speaker && (
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {dialogue.speaker}:
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {dialogue.line.split('__').map((part, partIndex, array) => (
                              <span key={partIndex}>
                                <span className="text-gray-800 dark:text-gray-200">{part}</span>
                                {partIndex < array.length - 1 && (
                                  <input
                                    type="text"
                                    value={exerciseAnswers[`${dialogueIndex}-${partIndex}`] || ''}
                                    onChange={(e) => handleExerciseAnswerChange(dialogueIndex, partIndex, e.target.value)}
                                    className="inline-block w-20 h-8 px-2 mx-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="___"
                                  />
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress and Submit */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(exerciseAnswers).length} answers filled
                    </div>
                    <div className="flex items-center space-x-4">
                      {isExerciseComplete(selectedExercise) && isExerciseCorrect(selectedExercise) && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">All correct!</span>
                        </div>
                      )}
                      <button
                        onClick={handleCloseExercise}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Close Exercise
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lesson;
