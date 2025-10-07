// Lesson Template - Copy this file to create new lessons
// INSTRUCTIONS:
// 1. Copy this file and rename it to lessonX.js (e.g., lesson3.js, lesson4.js, etc.)
// 2. Create a corresponding lessonX_vocabulary.js file
// 3. Update the import statement and lesson id
// 4. Fill in all the placeholder content marked with [ ]
// 5. Add the lesson to src/data/lessons.js

import lessonXVocabulary from './lessonX_vocabulary.js'; // UPDATE THIS

export const lessonX = { // UPDATE THIS
  id: "lessonX", // UPDATE THIS (e.g., "lesson3", "lesson4")
  title: "X. [Lesson Title]", // UPDATE THIS (e.g., "3. At the Store")
  subtitle: "[Lesson objectives and topics]", // UPDATE THIS
  level: X, // UPDATE THIS (lesson number)
  xp_reward: 100, // Can adjust based on difficulty
  audio: "/src/media/lessonX/audio_placeholder.mp3", // UPDATE THIS
  duration: "0:00",
  
  // Media paths
  media: {
    portrait: "/src/media/lessonX/pic1.jpg", // UPDATE THIS
    landscape: "/src/media/lessonX/pic2.jpg" // UPDATE THIS
  },

  // Introduction
  introduction: {
    norwegian: "[Norwegian introduction text - context for the lesson]",
    english: "[English translation]"
  },

  // Dialogues (4 dialogues typical)
  dialogues: {
    dialogue_1: {
      id: "dialogue_1",
      title: "[Character 1] & [Character 2]",
      audio: "/src/media/lessonX/dialogue1.mp3", // UPDATE THIS
      duration: "0:00",
      introduction: {
        norwegian: "[Norwegian context - what's happening in this dialogue]",
        english: "[English context]"
      },
      dialogue: [
        {
          speaker: "[Character 1]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        },
        {
          speaker: "[Character 2]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        }
        // Continue adding dialogue lines...
      ]
    },
    dialogue_2: {
      id: "dialogue_2",
      title: "[Character 3] & [Character 4]",
      audio: "/src/media/lessonX/dialogue2.mp3", // UPDATE THIS
      duration: "0:00",
      introduction: {
        norwegian: "[Norwegian context]",
        english: "[English context]"
      },
      dialogue: [
        {
          speaker: "[Character 3]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        }
        // Continue adding dialogue lines...
      ]
    },
    dialogue_3: {
      id: "dialogue_3",
      title: "[Character 5] & [Character 6]",
      audio: "/src/media/lessonX/dialogue3.mp3", // UPDATE THIS
      duration: "0:00",
      introduction: {
        norwegian: "[Norwegian context]",
        english: "[English context]"
      },
      dialogue: [
        {
          speaker: "[Character 5]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        }
        // Continue adding dialogue lines...
      ]
    },
    dialogue_4: {
      id: "dialogue_4",
      title: "[Character 7] & [Character 8]",
      audio: "/src/media/lessonX/dialogue4.mp3", // UPDATE THIS
      duration: "0:00",
      introduction: {
        norwegian: "[Norwegian context]",
        english: "[English context]"
      },
      dialogue: [
        {
          speaker: "[Character 7]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        }
        // Continue adding dialogue lines...
      ]
    }
  },

  // Vocabulary (imported from separate file)
  vocabulary: lessonXVocabulary, // Will reference the imported vocabulary

  // Numerals (optional - only if this lesson focuses on specific numbers)
  numerals: [
    // Example: { number: 0, norwegian: "null" }
  ],

  // Lesson sections - defines the navigation structure
  sections: {
    dialogue_1: {
      id: "dialogue_1",
      title: "[Character 1] & [Character 2]",
      type: "dialogue",
      content: "dialogue_1" // References dialogues.dialogue_1
    },
    dialogue_2: {
      id: "dialogue_2",
      title: "[Character 3] & [Character 4]",
      type: "dialogue",
      content: "dialogue_2"
    },
    dialogue_3: {
      id: "dialogue_3",
      title: "[Character 5] & [Character 6]",
      type: "dialogue",
      content: "dialogue_3"
    },
    dialogue_4: {
      id: "dialogue_4",
      title: "[Character 7] & [Character 8]",
      type: "dialogue",
      content: "dialogue_4"
    },
    grammar: {
      id: "grammar",
      title: "Grammar",
      type: "content",
      content: "grammar_content" // References grammar_content below
    },
    pronunciation: {
      id: "pronunciation",
      title: "Pronunciation",
      type: "content",
      content: "pronunciation_content" // References pronunciation_content below
    },
    listening: {
      id: "listening",
      title: "Listening exercises",
      type: "content",
      content: "listening_content" // References listening_content below
    },
    exercises: {
      id: "exercises",
      title: "Exercises",
      type: "exercises",
      exerciseIds: ["exercise_1", "exercise_2", "exercise_3", "exercise_4", "exercise_5"] // Update with actual exercise IDs
    },
    vocabulary: {
      id: "vocabulary", 
      title: "Vocabulary",
      type: "content",
      content: "vocabulary" // References the vocabulary array
    },
    extras: {
      id: "extras",
      title: "Extras",
      type: "content",
      content: "extras_content" // References extras_content below
    }
  },

  // Pronunciation content
  pronunciation_content: {
    // Example structure - adapt to lesson needs
    topic: {
      title: "[Pronunciation Topic Title]",
      description: "[Description of what pronunciation features are covered]",
      examples: [
        {
          letter: "[Letter or sound]",
          ipa: "[IPA notation]",
          description: "[How to pronounce it]",
          examples: ["[example word 1]", "[example word 2]"]
        }
        // Add more pronunciation examples...
      ]
    }
  },

  // Listening content - 4 exercises typical
  listening_content: {
    exercises: [
      // Exercise 1: Fill in the blanks (listening)
      {
        id: "listen_fill_1",
        title: "Exercise 1: [Character] - Listen and write",
        description: "[Description of what to do]",
        type: "fill_blanks_listening",
        audio_path: "/src/media/lessonX/listen_ex1.mp3", // UPDATE THIS
        text: "[Text with __ for each blank]",
        answers: [
          { blank: 0, correct: "[word]", position: "[Context sentence]" }
          // Add more blanks...
        ]
      },
      // Exercise 2: Multiple choice (listening)
      {
        id: "listen_quiz_1",
        title: "Exercise 2: [Character] - Listen quiz",
        description: "Listen to the text and choose the right answers.",
        type: "multiple_choice_listening",
        audio_path: "/src/media/lessonX/listen_ex2.mp3", // UPDATE THIS
        questions: [
          {
            question: "[Question in Norwegian]",
            options: [
              { text: "[Option 1]", correct: true },
              { text: "[Option 2]", correct: false }
            ]
          }
          // Add more questions...
        ]
      },
      // Exercise 3: Listen and repeat
      {
        id: "listen_repeat_1",
        title: "Exercise 3: [Character] - Listen and repeat",
        description: "Listen to each sentence and repeat it. Click the play button to hear each sentence.",
        type: "listen_repeat",
        sentences: [
          "[Norwegian sentence 1]",
          "[Norwegian sentence 2]"
          // Add more sentences...
        ]
      },
      // Exercise 4: Listen and repeat
      {
        id: "listen_repeat_2",
        title: "Exercise 4: [Character] - Listen and repeat",
        description: "Listen to each sentence and repeat it. Click the play button to hear each sentence.",
        type: "listen_repeat",
        sentences: [
          "[Norwegian sentence 1]",
          "[Norwegian sentence 2]"
          // Add more sentences...
        ]
      }
    ]
  },

  // Grammar content
  grammar_content: {
    // Add grammar topics relevant to this lesson
    // Example structure:
    topic_1: {
      title: "[Grammar Topic Title]",
      explanation: "[Explanation of the grammar rule]",
      examples: [
        { norwegian: "[Example sentence]", english: "[Translation]" }
      ],
      table: [ // Optional: for conjugation tables, etc.
        { form: "[Form name]", norwegian: "[Norwegian]", english: "[English]" }
      ],
      video_url: "[Optional: YouTube or other video URL]"
    }
    // Add more grammar topics as needed
  },

  // Exercise content - typically 5-8 exercises
  exercise_content: {
    // Exercise 1: Fill in the blanks (pronouns, verbs, etc.)
    exercise_1: {
      id: "exercise_1",
      title: "[Exercise number and topic] (e.g., X.1 Personal pronouns)",
      description: "[What to do] (e.g., Fill in jeg, du, han or hun in the gaps)",
      type: "fill_blanks_sentences", // or "fill_blanks_dialogue"
      example: "Example: [Example sentence with answer]",
      sentences: [
        { text: "[Sentence with __]", correct_answer: "[answer]" }
        // For multiple blanks in one sentence:
        // { text: "[Sentence with __ and __]", correct_answer: ["answer1", "answer2"] }
      ]
    },
    // Exercise 2: More fill in the blanks
    exercise_2: {
      id: "exercise_2",
      title: "[Exercise title]",
      description: "[Description]",
      type: "fill_blanks_sentences",
      example: "Example: [Example]",
      sentences: [
        // Add sentences
      ]
    },
    // Exercise 3: Numbers practice (optional)
    exercise_3: {
      id: "exercise_3",
      title: "[Exercise title with numbers]",
      description: "Fill in numbers.",
      type: "numbers_practice",
      sections: [
        {
          title: "Write using numbers.",
          description: "Write using numbers. Example: 2 = to",
          type: "numbers_to_digits",
          exercises: [
            { norwegian: "[number word]", correct_answer: "[digit]" }
          ]
        },
        {
          title: "Write in letters.",
          description: "Write in letters. Example: elleve = 11",
          type: "digits_to_numbers",
          exercises: [
            { digit: "[number]", correct_answer: "[word]" }
          ]
        }
      ]
    },
    // Exercise 4: Drag and drop matching
    exercise_4: {
      id: "exercise_4",
      title: "[Exercise title] (e.g., X.4 Words and expressions)",
      description: "Drag phrases into the correct boxes.",
      type: "drag_drop",
      pairs: [
        {
          prompt: "[Norwegian prompt/question]",
          prompt_translation: "[English translation]",
          correct_answer: "[Norwegian answer]",
          correct_answer_translation: "[English translation]"
        }
        // Add more pairs...
      ]
    },
    // Exercise 5: Word order
    exercise_5: {
      id: "exercise_5",
      title: "[Exercise title] (e.g., X.5 Word order exercises)",
      description: "Drag parts to correct position.",
      type: "word_order",
      exercises: [
        {
          id: "a",
          correct_order: ["Word1", "Word2", "Word3"],
          available_words: ["Word3", "Word1", "Word2"], // Shuffled
          punctuation: "." // or "?" or "!"
        }
        // Add more word order exercises...
      ]
    }
    // Add more exercises as needed (exercise_6, exercise_7, etc.)
  },

  // Extras content
  extras_content: {
    // Can include: additional vocabulary lists, cultural notes, grammar tables, etc.
    // Example:
    additional_vocab: {
      title: "[Topic Title]",
      items: [
        { norwegian: "[word]", english: "[translation]" }
      ]
    }
  }
};

export default lessonX; // UPDATE THIS

