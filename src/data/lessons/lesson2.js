// Lesson 2: [Title to be added]
import lesson2Vocabulary from './lesson2_vocabulary.js';

export const lesson2 = {
  id: "lesson2",
  title: "2. [Under Construction]",
  subtitle: "This lesson is currently being developed",
  level: 2,
  xp_reward: 150,
  isUnderConstruction: true,
  audio: "/src/media/lesson2/audio_placeholder.mp3",
  duration: "0:00",
  
  // Media paths
  media: {
    portrait: "/src/media/lesson2/pic1.jpg",
    landscape: "/src/media/lesson2/pic2.jpg"
  },

  // Introduction
  introduction: {
    norwegian: "[Norwegian introduction text]",
    english: "[English translation]"
  },

  // Dialogues
  dialogues: {
    dialogue_1: {
      id: "dialogue_1",
      title: "[Character 1] & [Character 2]",
      audio: "/src/media/lesson2/dialogue1.mp3",
      duration: "0:00",
      introduction: {
        norwegian: "[Norwegian context]",
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
        // Add more dialogue lines as needed
      ]
    },
    dialogue_2: {
      id: "dialogue_2",
      title: "[Character 3] & [Character 4]",
      audio: "/src/media/lesson2/dialogue2.mp3",
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
        },
        {
          speaker: "[Character 4]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        }
        // Add more dialogue lines as needed
      ]
    },
    dialogue_3: {
      id: "dialogue_3",
      title: "[Character 5] & [Character 6]",
      audio: "/src/media/lesson2/dialogue3.mp3",
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
        },
        {
          speaker: "[Character 6]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        }
        // Add more dialogue lines as needed
      ]
    },
    dialogue_4: {
      id: "dialogue_4",
      title: "[Character 7] & [Character 8]",
      audio: "/src/media/lesson2/dialogue4.mp3",
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
        },
        {
          speaker: "[Character 8]",
          norwegian: "[Norwegian line]",
          english: "[English translation]"
        }
        // Add more dialogue lines as needed
      ]
    }
  },

  // Vocabulary (imported from separate file)
  vocabulary: lesson2Vocabulary,

  // Numerals (if applicable to this lesson)
  numerals: [
    // Add relevant numerals for this lesson
  ],

  // Extras content
  extras_content: {
    // Add extras content specific to this lesson
    // Can include: numerals, grammar tables, cultural notes, etc.
  },

  // Lesson sections (these will contain the existing exercises and new content)
  sections: {
    dialogue_1: {
      id: "dialogue_1",
      title: "[Character 1] & [Character 2]",
      type: "dialogue",
      content: "dialogue_1"
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
      content: "grammar_content"
    },
    pronunciation: {
      id: "pronunciation",
      title: "Pronunciation",
      type: "content",
      content: "pronunciation_content"
    },
    listening: {
      id: "listening",
      title: "Listening exercises",
      type: "content",
      content: "listening_content"
    },
    exercises: {
      id: "exercises",
      title: "Exercises",
      type: "exercises",
      exerciseIds: [] // Add exercise IDs as they are created
    },
    vocabulary: {
      id: "vocabulary", 
      title: "Vocabulary",
      type: "content",
      content: "vocabulary"
    },
    extras: {
      id: "extras",
      title: "Extras",
      type: "content",
      content: "extras_content"
    }
  },

  // Pronunciation content
  pronunciation_content: {
    // Add pronunciation rules and examples specific to this lesson
    topic: "[Pronunciation topic]",
    description: "[Description of pronunciation focus]",
    examples: [
      // Add pronunciation examples
    ]
  },

  // Listening content
  listening_content: {
    exercises: [
      // Exercise 1: Fill in the blanks (listening)
      {
        id: "listen_fill_1",
        title: "[Exercise Title]",
        description: "[Exercise description]",
        type: "fill_blanks_listening",
        audio_path: "/src/media/lesson2/exercise1.mp3",
        text: "[Text with __ for blanks]",
        answers: [
          // { blank: 0, correct: "word", position: "Context" }
        ]
      },
      // Exercise 2: Multiple choice (listening)
      {
        id: "listen_quiz_1",
        title: "[Exercise Title]",
        description: "[Exercise description]",
        type: "multiple_choice_listening",
        audio_path: "/src/media/lesson2/exercise2.mp3",
        questions: [
          // {
          //   question: "[Question in Norwegian]",
          //   options: [
          //     { text: "[Option 1]", correct: true },
          //     { text: "[Option 2]", correct: false }
          //   ]
          // }
        ]
      },
      // Exercise 3: Listen and repeat
      {
        id: "listen_repeat_1",
        title: "[Exercise Title]",
        description: "[Exercise description]",
        type: "listen_repeat",
        sentences: [
          // "[Norwegian sentence to repeat]"
        ]
      },
      // Exercise 4: Listen and repeat
      {
        id: "listen_repeat_2",
        title: "[Exercise Title]",
        description: "[Exercise description]",
        type: "listen_repeat",
        sentences: [
          // "[Norwegian sentence to repeat]"
        ]
      }
    ]
  },

  // Grammar content
  grammar_content: {
    // Add grammar topics specific to this lesson
    // Example structure:
    // topic_1: {
    //   title: "[Grammar Topic]",
    //   explanation: "[Explanation]",
    //   examples: [...]
    // }
  },

  // Exercise content
  exercise_content: {
    // Exercise 1: Fill in the blanks (dialogue or sentences)
    exercise_1: {
      id: "exercise_1",
      title: "[Exercise Title]",
      description: "[Exercise description]",
      type: "fill_blanks_sentences", // or "fill_blanks_dialogue"
      example: "Example: [Example sentence]",
      sentences: [
        // { text: "[Sentence with __ for blank]", correct_answer: "answer" }
        // OR for multiple blanks:
        // { text: "[Sentence with __ and __]", correct_answer: ["answer1", "answer2"] }
      ]
    },
    // Exercise 2: More fill in the blanks
    exercise_2: {
      id: "exercise_2",
      title: "[Exercise Title]",
      description: "[Exercise description]",
      type: "fill_blanks_sentences",
      example: "Example: [Example sentence]",
      sentences: [
        // Add sentences
      ]
    },
    // Exercise 3: Numbers practice (if applicable)
    exercise_3: {
      id: "exercise_3",
      title: "[Exercise Title]",
      description: "[Exercise description]",
      type: "numbers_practice",
      sections: [
        {
          title: "Write using numbers.",
          description: "Write using numbers. Example: 2 = to",
          type: "numbers_to_digits",
          exercises: [
            // { norwegian: "word", correct_answer: "number" }
          ]
        },
        {
          title: "Write in letters.",
          description: "Write in letters. Example: elleve = 11",
          type: "digits_to_numbers",
          exercises: [
            // { digit: "number", correct_answer: "word" }
          ]
        }
      ]
    },
    // Exercise 4: Drag and drop
    exercise_4: {
      id: "exercise_4",
      title: "[Exercise Title]",
      description: "[Exercise description]",
      type: "drag_drop",
      pairs: [
        // {
        //   prompt: "[Norwegian prompt]",
        //   prompt_translation: "[English translation]",
        //   correct_answer: "[Norwegian answer]",
        //   correct_answer_translation: "[English translation]"
        // }
      ]
    },
    // Exercise 5: Word order
    exercise_5: {
      id: "exercise_5",
      title: "[Exercise Title]",
      description: "[Exercise description]",
      type: "word_order",
      exercises: [
        // {
        //   id: "a",
        //   correct_order: ["Word1", "Word2", "Word3"],
        //   available_words: ["Word3", "Word1", "Word2"],
        //   punctuation: "."
        // }
      ]
    }
  }
};

export default lesson2;

