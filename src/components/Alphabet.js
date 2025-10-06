import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Volume2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import ttsService from '../services/tts';

const Alphabet = () => {
  const { t } = useTranslation();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Norwegian alphabet with detailed information
  const norwegianAlphabet = [
    {
      letter: 'A',
      pronunciation: 'ah',
      ipa: '/ɑː/',
      examples: [
        { word: 'hus', translation: 'house', pronunciation: 'hooss' },
        { word: 'båt', translation: 'boat', pronunciation: 'boht' },
        { word: 'katt', translation: 'cat', pronunciation: 'kahtt' }
      ],
      description: 'Like "a" in "father" but shorter'
    },
    {
      letter: 'B',
      pronunciation: 'beh',
      ipa: '/beː/',
      examples: [
        { word: 'bil', translation: 'car', pronunciation: 'beel' },
        { word: 'bok', translation: 'book', pronunciation: 'book' },
        { word: 'barn', translation: 'child', pronunciation: 'bahrn' }
      ],
      description: 'Same as English "b"'
    },
    {
      letter: 'C',
      pronunciation: 'seh',
      ipa: '/seː/',
      examples: [
        { word: 'café', translation: 'café', pronunciation: 'kah-FAY' },
        { word: 'computer', translation: 'computer', pronunciation: 'kom-POO-ter' },
        { word: 'cykel', translation: 'bicycle', pronunciation: 'SYE-kel' }
      ],
      description: 'Usually pronounced like "s" or "k"'
    },
    {
      letter: 'D',
      pronunciation: 'deh',
      ipa: '/deː/',
      examples: [
        { word: 'dag', translation: 'day', pronunciation: 'dahg' },
        { word: 'dør', translation: 'door', pronunciation: 'durr' },
        { word: 'drikke', translation: 'drink', pronunciation: 'DRIK-ke' }
      ],
      description: 'Same as English "d"'
    },
    {
      letter: 'E',
      pronunciation: 'eh',
      ipa: '/eː/',
      examples: [
        { word: 'elv', translation: 'river', pronunciation: 'elv' },
        { word: 'en', translation: 'one', pronunciation: 'ehn' },
        { word: 'elefant', translation: 'elephant', pronunciation: 'e-le-FANT' }
      ],
      description: 'Like "e" in "bed"'
    },
    {
      letter: 'F',
      pronunciation: 'eff',
      ipa: '/ef/',
      examples: [
        { word: 'fisk', translation: 'fish', pronunciation: 'fisk' },
        { word: 'familie', translation: 'family', pronunciation: 'fah-MEE-lee-eh' },
        { word: 'fjord', translation: 'fjord', pronunciation: 'fyord' }
      ],
      description: 'Same as English "f"'
    },
    {
      letter: 'G',
      pronunciation: 'geh',
      ipa: '/geː/',
      examples: [
        { word: 'gul', translation: 'yellow', pronunciation: 'gool' },
        { word: 'gå', translation: 'walk', pronunciation: 'goh' },
        { word: 'god', translation: 'good', pronunciation: 'good' }
      ],
      description: 'Like "g" in "go" or "y" in "yes" before i/e'
    },
    {
      letter: 'H',
      pronunciation: 'hoh',
      ipa: '/hoː/',
      examples: [
        { word: 'hund', translation: 'dog', pronunciation: 'hoond' },
        { word: 'hus', translation: 'house', pronunciation: 'hooss' },
        { word: 'hele', translation: 'whole', pronunciation: 'HAY-leh' }
      ],
      description: 'Same as English "h"'
    },
    {
      letter: 'I',
      pronunciation: 'ee',
      ipa: '/iː/',
      examples: [
        { word: 'is', translation: 'ice', pronunciation: 'ees' },
        { word: 'ikke', translation: 'not', pronunciation: 'IK-ke' },
        { word: 'inn', translation: 'in', pronunciation: 'inn' }
      ],
      description: 'Like "i" in "machine"'
    },
    {
      letter: 'J',
      pronunciation: 'yee',
      ipa: '/jeː/',
      examples: [
        { word: 'ja', translation: 'yes', pronunciation: 'yah' },
        { word: 'jord', translation: 'earth', pronunciation: 'yord' },
        { word: 'juice', translation: 'juice', pronunciation: 'yooss' }
      ],
      description: 'Like "y" in "yes"'
    },
    {
      letter: 'K',
      pronunciation: 'kah',
      ipa: '/kɑː/',
      examples: [
        { word: 'katt', translation: 'cat', pronunciation: 'kahtt' },
        { word: 'kald', translation: 'cold', pronunciation: 'kahld' },
        { word: 'kjøpe', translation: 'buy', pronunciation: 'SHOE-peh' }
      ],
      description: 'Like "k" in "key" or "sh" before j'
    },
    {
      letter: 'L',
      pronunciation: 'ell',
      ipa: '/el/',
      examples: [
        { word: 'lys', translation: 'light', pronunciation: 'lees' },
        { word: 'løs', translation: 'loose', pronunciation: 'lurs' },
        { word: 'lære', translation: 'learn', pronunciation: 'LAE-reh' }
      ],
      description: 'Same as English "l"'
    },
    {
      letter: 'M',
      pronunciation: 'emm',
      ipa: '/em/',
      examples: [
        { word: 'måne', translation: 'moon', pronunciation: 'MOH-neh' },
        { word: 'mat', translation: 'food', pronunciation: 'maht' },
        { word: 'mor', translation: 'mother', pronunciation: 'moor' }
      ],
      description: 'Same as English "m"'
    },
    {
      letter: 'N',
      pronunciation: 'enn',
      ipa: '/en/',
      examples: [
        { word: 'natt', translation: 'night', pronunciation: 'nahtt' },
        { word: 'nord', translation: 'north', pronunciation: 'nord' },
        { word: 'nå', translation: 'now', pronunciation: 'noh' }
      ],
      description: 'Same as English "n"'
    },
    {
      letter: 'O',
      pronunciation: 'oh',
      ipa: '/uː/',
      examples: [
        { word: 'ost', translation: 'cheese', pronunciation: 'oost' },
        { word: 'opp', translation: 'up', pronunciation: 'opp' },
        { word: 'oktober', translation: 'October', pronunciation: 'ok-TOH-ber' }
      ],
      description: 'Like "oo" in "boot"'
    },
    {
      letter: 'P',
      pronunciation: 'peh',
      ipa: '/peː/',
      examples: [
        { word: 'pappa', translation: 'dad', pronunciation: 'PAHP-pah' },
        { word: 'penger', translation: 'money', pronunciation: 'PENG-er' },
        { word: 'på', translation: 'on', pronunciation: 'poh' }
      ],
      description: 'Same as English "p"'
    },
    {
      letter: 'Q',
      pronunciation: 'koo',
      ipa: '/kuː/',
      examples: [
        { word: 'quiz', translation: 'quiz', pronunciation: 'kvis' },
        { word: 'queen', translation: 'queen', pronunciation: 'kveen' },
        { word: 'quinoa', translation: 'quinoa', pronunciation: 'KEE-noh-ah' }
      ],
      description: 'Always followed by "u", pronounced "kv"'
    },
    {
      letter: 'R',
      pronunciation: 'err',
      ipa: '/ær/',
      examples: [
        { word: 'rød', translation: 'red', pronunciation: 'rurd' },
        { word: 'regn', translation: 'rain', pronunciation: 'rehgn' },
        { word: 'rygg', translation: 'back', pronunciation: 'rigg' }
      ],
      description: 'Rolled "r" or guttural "r"'
    },
    {
      letter: 'S',
      pronunciation: 'ess',
      ipa: '/es/',
      examples: [
        { word: 'sol', translation: 'sun', pronunciation: 'sool' },
        { word: 'snø', translation: 'snow', pronunciation: 'snur' },
        { word: 'søster', translation: 'sister', pronunciation: 'SURS-ter' }
      ],
      description: 'Same as English "s"'
    },
    {
      letter: 'T',
      pronunciation: 'teh',
      ipa: '/teː/',
      examples: [
        { word: 'tre', translation: 'tree', pronunciation: 'treh' },
        { word: 'takk', translation: 'thanks', pronunciation: 'tahkk' },
        { word: 'tid', translation: 'time', pronunciation: 'teed' }
      ],
      description: 'Same as English "t"'
    },
    {
      letter: 'U',
      pronunciation: 'oo',
      ipa: '/ʉː/',
      examples: [
        { word: 'ulv', translation: 'wolf', pronunciation: 'oolv' },
        { word: 'under', translation: 'under', pronunciation: 'OON-der' },
        { word: 'universitet', translation: 'university', pronunciation: 'oo-nee-ver-see-TET' }
      ],
      description: 'Like "oo" in "boot" but more rounded'
    },
    {
      letter: 'V',
      pronunciation: 'veh',
      ipa: '/veː/',
      examples: [
        { word: 'vann', translation: 'water', pronunciation: 'vahnn' },
        { word: 'venn', translation: 'friend', pronunciation: 'venn' },
        { word: 'vinter', translation: 'winter', pronunciation: 'VIN-ter' }
      ],
      description: 'Same as English "v"'
    },
    {
      letter: 'W',
      pronunciation: 'dobbelt-veh',
      ipa: '/ˈdɔbːɛltveː/',
      examples: [
        { word: 'watt', translation: 'watt', pronunciation: 'vahtt' },
        { word: 'weekend', translation: 'weekend', pronunciation: 'VEEK-end' },
        { word: 'whiskey', translation: 'whiskey', pronunciation: 'VIS-key' }
      ],
      description: 'Usually pronounced like "v"'
    },
    {
      letter: 'X',
      pronunciation: 'eks',
      ipa: '/eks/',
      examples: [
        { word: 'taxi', translation: 'taxi', pronunciation: 'TAHK-see' },
        { word: 'eksempel', translation: 'example', pronunciation: 'ek-SEMP-el' },
        { word: 'maxi', translation: 'maxi', pronunciation: 'MAHK-see' }
      ],
      description: 'Like "ks" in "box"'
    },
    {
      letter: 'Y',
      pronunciation: 'ypsilon',
      ipa: '/ˈʏpsɪlon/',
      examples: [
        { word: 'øy', translation: 'island', pronunciation: 'urr' },
        { word: 'sykkel', translation: 'bicycle', pronunciation: 'SIK-kel' },
        { word: 'tyve', translation: 'twenty', pronunciation: 'TEE-veh' }
      ],
      description: 'Like "ü" in German or French "u"'
    },
    {
      letter: 'Z',
      pronunciation: 'zett',
      ipa: '/set/',
      examples: [
        { word: 'zoo', translation: 'zoo', pronunciation: 'soo' },
        { word: 'zero', translation: 'zero', pronunciation: 'SEH-roh' },
        { word: 'zebra', translation: 'zebra', pronunciation: 'SEH-brah' }
      ],
      description: 'Usually pronounced like "s"'
    },
    {
      letter: 'Æ',
      pronunciation: 'æ',
      ipa: '/æː/',
      examples: [
        { word: 'ærlig', translation: 'honest', pronunciation: 'AER-lig' },
        { word: 'ærlighet', translation: 'honesty', pronunciation: 'AER-lig-het' },
        { word: 'ære', translation: 'honor', pronunciation: 'AER-eh' }
      ],
      description: 'Like "a" in "cat" but longer'
    },
    {
      letter: 'Ø',
      pronunciation: 'ø',
      ipa: '/øː/',
      examples: [
        { word: 'øl', translation: 'beer', pronunciation: 'url' },
        { word: 'øye', translation: 'eye', pronunciation: 'UR-eh' },
        { word: 'øre', translation: 'ear', pronunciation: 'UR-eh' }
      ],
      description: 'Like "ö" in German or "eu" in French'
    },
    {
      letter: 'Å',
      pronunciation: 'å',
      ipa: '/oː/',
      examples: [
        { word: 'år', translation: 'year', pronunciation: 'ohr' },
        { word: 'åpne', translation: 'open', pronunciation: 'OHP-neh' },
        { word: 'åtte', translation: 'eight', pronunciation: 'OHT-teh' }
      ],
      description: 'Like "aw" in "law" or "o" in "more"'
    }
  ];

  const handleLetterClick = (letter) => {
    const index = norwegianAlphabet.findIndex(item => item.letter === letter.letter);
    setSelectedLetter(letter);
    setCurrentCardIndex(index);
  };

  const handleSpeak = async (text, language = 'nb-NO') => {
    try {
      await ttsService.speak(text, language);
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const navigateCard = (direction) => {
    const totalCards = norwegianAlphabet.length;
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentCardIndex > 0 ? currentCardIndex - 1 : totalCards - 1;
    } else {
      newIndex = currentCardIndex < totalCards - 1 ? currentCardIndex + 1 : 0;
    }
    
    setCurrentCardIndex(newIndex);
    setSelectedLetter(norwegianAlphabet[newIndex]);
  };

  const closeModal = () => {
    setSelectedLetter(null);
  };

  if (selectedLetter) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={closeModal}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X size={20} />
{t('app.close')}
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateCard('prev')}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100"
                  title="Previous letter"
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="text-sm text-gray-500 px-3">
                  {currentCardIndex + 1} / {norwegianAlphabet.length}
                </span>
                <button
                  onClick={() => navigateCard('next')}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100"
                  title="Next letter"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Letter Card */}
            <div className="text-center mb-6">
              <div className="text-8xl font-bold text-purple-600 mb-4">
                {selectedLetter.letter}
              </div>
              <div className="text-2xl text-gray-700 mb-2">
                {selectedLetter.pronunciation}
              </div>
              <div className="text-lg text-gray-500 mb-4">
                IPA: {selectedLetter.ipa}
              </div>
              <div className="text-gray-600 italic">
                {selectedLetter.description}
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('alphabet.examples')}
              </h3>
              {selectedLetter.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium text-gray-900">
                        {example.word}
                      </div>
                      <div className="text-gray-600">
                        {example.translation}
                      </div>
                      <div className="text-sm text-gray-500 italic">
                        {example.pronunciation}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSpeak(example.word)}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Listen to pronunciation"
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Practice Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => handleSpeak(selectedLetter.letter)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Volume2 size={20} />
                <span>Listen to Letter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('alphabet.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('alphabet.subtitle')}
        </p>
      </div>

      {/* Alphabet Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-3 mb-8">
        {norwegianAlphabet.map((letter, index) => (
          <button
            key={index}
            onClick={() => handleLetterClick(letter)}
            className="aspect-square bg-white border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center justify-center p-2 group"
          >
            <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {letter.letter}
            </div>
            <div className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors">
              {letter.pronunciation}
            </div>
          </button>
        ))}
      </div>

      {/* Special Norwegian Letters */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          {t('alphabet.specialLetters')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">Æ</div>
            <div className="text-sm text-gray-700">
              Like "a" in "cat" but longer
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">Ø</div>
            <div className="text-sm text-gray-700">
              Like "ö" in German or "eu" in French
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">Å</div>
            <div className="text-sm text-gray-700">
              Like "aw" in "law" or "o" in "more"
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          💡 {t('alphabet.learningTips')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <ul className="space-y-2">
            <li>• <strong>Click any letter</strong> to hear its pronunciation</li>
            <li>• <strong>Practice regularly</strong> - repetition is key</li>
            <li>• <strong>Listen to examples</strong> to understand usage</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Focus on special letters</strong> (Æ, Ø, Å)</li>
            <li>• <strong>Use IPA symbols</strong> as pronunciation guides</li>
            <li>• <strong>Practice with words</strong> not just letters</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Alphabet;
