import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Send,
  RotateCcw
} from 'lucide-react';

const Grammar = () => {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('pronouns');
  const [grammarSentence, setGrammarSentence] = useState('');
  const [grammarResult, setGrammarResult] = useState(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);

  const grammarSections = {
    pronouns: {
      title: t('grammar.pronouns.title'),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.pronouns.personalPronouns')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">Norwegian</div>
                <div className="font-medium text-gray-900 dark:text-white">English</div>
                <div>jeg</div>
                <div>I</div>
                <div>du</div>
                <div>you (singular)</div>
                <div>han</div>
                <div>he</div>
                <div>hun</div>
                <div>she</div>
                <div>det/den</div>
                <div>it</div>
                <div>vi</div>
                <div>we</div>
                <div>dere</div>
                <div>you (plural)</div>
                <div>de</div>
                <div>they</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    verbs: {
      title: t('grammar.verbs.title'),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.verbs.presentTense')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('grammar.verbs.presentTenseRule')}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">Infinitive</div>
                <div className="font-medium text-gray-900 dark:text-white">English</div>
                <div className="font-medium text-gray-900 dark:text-white">Present tense</div>
                <div>å komme</div>
                <div>to come</div>
                <div>kommer</div>
                <div>å reise</div>
                <div>to travel</div>
                <div>reiser</div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                {t('grammar.verbs.examples')}
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Jeg kommer fra England.</strong> - I come from England</div>
                <div><strong>Anna kommer fra Italia.</strong> - Anna comes from Italy</div>
                <div><strong>Vi kommer fra Norge.</strong> - We come from Norway</div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                {t('grammar.verbs.irregular')}
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium">Infinitive</div>
                <div className="font-medium">English</div>
                <div className="font-medium">Present tense</div>
                <div>å være</div>
                <div>to be</div>
                <div>er</div>
                <div>å gjøre</div>
                <div>to do</div>
                <div>gjør</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    nouns: {
      title: t('grammar.nouns.title'),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.nouns.genders')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('grammar.nouns.gendersRule')}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">Gender</div>
                <div className="font-medium text-gray-900 dark:text-white">Article</div>
                <div className="font-medium text-gray-900 dark:text-white">Example</div>
                <div>Masculine</div>
                <div>en</div>
                <div>en brus - a soda</div>
                <div>Feminine</div>
                <div>ei</div>
                <div>ei jente - a girl</div>
                <div>Neuter</div>
                <div>et</div>
                <div>et kart - a map</div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <p className="text-blue-900 dark:text-blue-300 text-sm">
                <strong>{t('grammar.nouns.note')}</strong> {t('grammar.nouns.feminineNote')}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                {t('grammar.nouns.omitting')}
              </h4>
              <p className="text-green-900 dark:text-green-300 text-sm mb-2">
                {t('grammar.nouns.omittingRule')}
              </p>
              <div className="space-y-1 text-sm">
                <div><strong>Ken reiser med tog.</strong> - Ken travels by train</div>
                <div><strong>Jeg er student.</strong> - I am a student</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    conjunctions: {
      title: t('grammar.conjunctions.title'),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.conjunctions.basic')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('grammar.conjunctions.rule')}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">Conjunction</div>
                <div className="font-medium text-gray-900 dark:text-white">English</div>
                <div className="font-medium text-gray-900 dark:text-white">Example</div>
                <div>og</div>
                <div>and</div>
                <div>Jeg heter Anna, og jeg kommer fra Italia.</div>
                <div>men</div>
                <div>but</div>
                <div>Jeg snakker italiensk, men jeg snakker ikke tysk.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    questions: {
      title: t('grammar.questions.title'),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.questions.questionWords')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">Norwegian</div>
                <div className="font-medium text-gray-900 dark:text-white">English</div>
                <div className="font-medium text-gray-900 dark:text-white">Example</div>
                <div>hva</div>
                <div>what</div>
                <div>Hva heter du?</div>
                <div>hvem</div>
                <div>who</div>
                <div>Hvem er det?</div>
                <div>hvor</div>
                <div>where/how</div>
                <div>Hvor bor du?</div>
                <div>hvordan</div>
                <div>how</div>
                <div>Hvordan går det?</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    wordOrder: {
      title: t('grammar.wordOrder.title'),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.wordOrder.mainClauses')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('grammar.wordOrder.verbSecond')}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div><strong>Jeg snakker norsk.</strong> - I speak Norwegian</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.wordOrder.negation')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('grammar.wordOrder.negationRule')}
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div><strong>Jeg snakker ikke spansk.</strong> - I do not speak Spanish</div>
                <div><strong>Jeg snakker også spansk.</strong> - I also speak Spanish</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.wordOrder.questions')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('grammar.wordOrder.questionRules')}
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div><strong>Hva heter du?</strong> - What is your name?</div>
                <div><strong>Hvor kommer du fra?</strong> - Where do you come from?</div>
                <div><strong>Snakker du norsk?</strong> - Do you speak Norwegian?</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    nationalities: {
      title: t('grammar.nationalities.title'),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              {t('grammar.nationalities.table')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Country</th>
                    <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Nationality</th>
                    <th className="text-left py-2 font-medium text-gray-900 dark:text-white">Language</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">Norge</td>
                    <td className="py-2">norsk</td>
                    <td className="py-2">norsk</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">England</td>
                    <td className="py-2">engelsk</td>
                    <td className="py-2">engelsk</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">Italia</td>
                    <td className="py-2">italiensk</td>
                    <td className="py-2">italiensk</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">Spania</td>
                    <td className="py-2">spansk</td>
                    <td className="py-2">spansk</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">USA</td>
                    <td className="py-2">amerikansk</td>
                    <td className="py-2">(amerikansk) engelsk</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">Tyskland</td>
                    <td className="py-2">tysk</td>
                    <td className="py-2">tysk</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  };

  const checkGrammar = async () => {
    if (!grammarSentence.trim()) return;

    setIsCheckingGrammar(true);
    setGrammarResult(null);

    const currentLanguage = i18n.language;

    try {
      const systemInstruction = currentLanguage === 'uk' 
        ? `Du er en norsk grammatikkekspert. Brukeren har sendt deg en norsk setning. Analyser setningen og sjekk for grammatiske feil. 

VIKTIGE REGLER:
- Bruk KUN ren tekst - ingen markdown, asterisker, eller formatering
- Hvis det er feil, start svaret med "Incorrect" og forklar hva som er galt
- Hvis setningen er korrekt, start svaret med "Correct"
- Gi konkrete eksempler og forklaringer
- Svar på ukrainsk

Eksempel på god respons: "Correct. Denne setningen er grammatisk korrekt."`
        : `You are a Norwegian grammar expert. The user has sent you a Norwegian sentence. Analyze the sentence and check for grammatical errors.

IMPORTANT RULES:
- Use ONLY plain text - no markdown, asterisks, or formatting
- If there are errors, start your response with "Incorrect" and explain what is wrong
- If the sentence is correct, start your response with "Correct"
- Provide concrete examples and explanations
- Answer in English

Example of good response: "Correct. This sentence is grammatically correct."`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyCiJ-bByf2slG63k6-l8eUD37A4xLGppgY', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: `Analyser denne norske setningen for grammatiske feil: "${grammarSentence}"` }]
          }],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from AI');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;

      // Determine if the sentence is correct based on the response
      const isCorrect = aiResponse.toLowerCase().startsWith('correct');
      const hasIncorrect = aiResponse.toLowerCase().startsWith('incorrect');

      setGrammarResult({
        sentence: grammarSentence,
        analysis: aiResponse,
        isCorrect: isCorrect,
        hasIncorrect: hasIncorrect
      });

    } catch (error) {
      console.error('Error checking grammar:', error);
      setGrammarResult({
        sentence: grammarSentence,
        analysis: currentLanguage === 'uk' 
          ? 'Вибачте, виникла помилка при перевірці граматики. Спробуйте ще раз.'
          : 'Sorry, there was an error checking the grammar. Please try again.',
        isCorrect: false,
        isError: true
      });
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const clearGrammarCheck = () => {
    setGrammarSentence('');
    setGrammarResult(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('grammar.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('grammar.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {t('grammar.sections')}
            </h2>
            <nav className="space-y-1">
              {Object.entries(grammarSections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === key
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Grammar Content */}
            <div className="mb-8">
              {grammarSections[activeSection].content}
            </div>

            {/* Grammar Checker */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('grammar.checker.title')}
                </h3>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('grammar.checker.description')}
              </p>

              <div className="space-y-4">
                <div>
                  <textarea
                    value={grammarSentence}
                    onChange={(e) => setGrammarSentence(e.target.value)}
                    placeholder={t('grammar.checker.placeholder')}
                    className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                    disabled={isCheckingGrammar}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={checkGrammar}
                    disabled={!grammarSentence.trim() || isCheckingGrammar}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                    <span>{isCheckingGrammar ? t('grammar.checker.checking') : t('grammar.checker.check')}</span>
                  </button>

                  {grammarSentence && (
                    <button
                      onClick={clearGrammarCheck}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw size={16} />
                      <span>{t('grammar.checker.clear')}</span>
                    </button>
                  )}
                </div>

                {/* Grammar Result */}
                {grammarResult && (
                  <div className={`p-4 rounded-lg border ${
                    grammarResult.isError
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      : grammarResult.isCorrect
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : grammarResult.hasIncorrect
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {grammarResult.isError ? (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                      ) : grammarResult.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      ) : grammarResult.hasIncorrect ? (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                      ) : (
                        <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">
                          "{grammarResult.sentence}"
                        </div>
                        <div className={`text-sm ${
                          grammarResult.isError
                            ? 'text-red-700 dark:text-red-300'
                            : grammarResult.isCorrect
                            ? 'text-green-700 dark:text-green-300'
                            : grammarResult.hasIncorrect
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {grammarResult.analysis}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grammar;
