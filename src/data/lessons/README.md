# Norwegian Vocabulary App - Lesson Structure

This directory contains all lesson data for the Norwegian Vocabulary App. Each lesson is structured with comprehensive content including dialogues, exercises, grammar, pronunciation, vocabulary, and extras.

## 📁 File Structure

```
lessons/
├── README.md                          # This file
├── lesson_template.js                 # Template for creating new lessons
├── lessonX_vocabulary_template.js     # Template for vocabulary files
├── lesson1.js                         # Lesson 1: Going to Trondheim
├── lesson1_vocabulary.js              # Lesson 1 vocabulary (120 words)
├── lesson2.js                         # Lesson 2: [To be filled]
├── lesson2_vocabulary.js              # Lesson 2 vocabulary
└── ... (lessons 3-10)
```

## 🎯 Lesson Structure

Each lesson contains the following sections:

### 1. **Basic Information**
- `id`: Unique identifier (e.g., "lesson1")
- `title`: Lesson title with number (e.g., "1. Going to Trondheim")
- `subtitle`: Learning objectives and topics
- `level`: Lesson number
- `xp_reward`: Experience points for completing the lesson
- `audio`: Path to main audio file
- `duration`: Audio duration
- `media`: Portrait and landscape images

### 2. **Dialogues** (4 dialogues per lesson)
Each dialogue includes:
- Character names
- Audio file path
- Introduction (context)
- Dialogue lines with Norwegian and English translations

### 3. **Vocabulary**
- Imported from separate `lessonX_vocabulary.js` file
- Includes IPA transcriptions, inflections, gender, and categories
- Typically 80-120 words per lesson

### 4. **Grammar**
- Grammar topics relevant to the lesson
- Explanations with examples
- Tables for conjugations, declensions, etc.
- Optional video links

### 5. **Pronunciation**
- Pronunciation rules and tips
- IPA notation
- Sound comparisons
- Example words

### 6. **Listening Exercises** (4 exercises per lesson)
- Fill in the blanks (listening)
- Multiple choice quiz (listening)
- Listen and repeat (2 exercises)

### 7. **Exercises** (5-8 interactive exercises)
- Fill in the blanks (dialogue or sentences)
- Numbers practice
- Drag and drop matching
- Word order exercises
- Custom exercise types

### 8. **Extras**
- Additional vocabulary
- Cultural notes
- Supplementary grammar tables
- Numerals and expressions

## 🆕 Creating a New Lesson

### Step 1: Copy Template Files
```bash
# Copy the lesson template
cp lesson_template.js lesson3.js

# Copy the vocabulary template
cp lessonX_vocabulary_template.js lesson3_vocabulary.js
```

### Step 2: Update File Names and Identifiers
In `lesson3.js`:
- Replace `lessonX` with `lesson3` throughout
- Replace `X` with `3` in all paths and IDs
- Update the `id`, `title`, `subtitle`, and `level`

In `lesson3_vocabulary.js`:
- Replace `lessonXVocabulary` with `lesson3Vocabulary`

### Step 3: Fill in Content
1. **Dialogues**: Add 4 dialogues with character interactions
2. **Vocabulary**: Add vocabulary words with full linguistic data
3. **Grammar**: Define grammar topics covered in this lesson
4. **Pronunciation**: Add pronunciation guidance
5. **Listening Exercises**: Create 4 listening exercises
6. **Interactive Exercises**: Create 5-8 exercises
7. **Extras**: Add supplementary materials

### Step 4: Add Media Files
Place all media files in `/public/src/media/lesson3/`:
- Audio files for dialogues
- Audio files for listening exercises
- Portrait and landscape images
- Any additional media

### Step 5: Register the Lesson
In `src/data/lessons.js`:
```javascript
import { lesson3 } from './lessons/lesson3.js';

export const lessonsData = {
  lessons: [
    lesson1,
    lesson2,
    lesson3, // Add new lesson here
    // ...
  ],
  metadata: {
    total_lessons: 3, // Update count
    // ...
  }
};
```

## 📝 Exercise Types

### 1. Fill in the Blanks (Dialogue)
```javascript
{
  type: "fill_blanks_dialogue",
  dialogue: [
    {
      speaker: "Character",
      line: "__ heter Ken.", // __ marks the blank
      correct_answer: "Jeg"
    }
  ]
}
```

### 2. Fill in the Blanks (Sentences)
```javascript
{
  type: "fill_blanks_sentences",
  sentences: [
    { text: "Jeg __ (å hete) Ken.", correct_answer: "heter" },
    { text: "Hun er __ og har ei __.", correct_answer: ["gift", "jente"] }
  ]
}
```

### 3. Numbers Practice
```javascript
{
  type: "numbers_practice",
  sections: [
    {
      type: "numbers_to_digits",
      exercises: [{ norwegian: "tre", correct_answer: "3" }]
    },
    {
      type: "digits_to_numbers",
      exercises: [{ digit: "4", correct_answer: "fire" }]
    }
  ]
}
```

### 4. Drag and Drop
```javascript
{
  type: "drag_drop",
  pairs: [
    {
      prompt: "Hva heter du?",
      prompt_translation: "What is your name?",
      correct_answer: "Jeg heter Lars.",
      correct_answer_translation: "My name is Lars."
    }
  ]
}
```

### 5. Word Order
```javascript
{
  type: "word_order",
  exercises: [
    {
      id: "a",
      correct_order: ["Maria", "kommer", "fra", "Spania"],
      available_words: ["Spania", "fra", "kommer", "Maria"],
      punctuation: "."
    }
  ]
}
```

## 🎨 Vocabulary Entry Format

```javascript
{
  norwegian: "word",           // The Norwegian word
  english: "translation",      // English translation
  transcription: "/IPA/",      // IPA phonetic transcription
  inflection: "forms",         // All inflected forms
  gender: "en/ei/et/å",       // Grammatical gender or verb marker
  category: "n/v/a/p/d"       // Word category
}
```

### Categories:
- `n`: Noun
- `v`: Verb
- `a`: Adjective
- `p`: Preposition
- `d`: Adverb

### Gender:
- `en`: Masculine noun
- `ei`: Feminine noun
- `et`: Neuter noun
- `å`: Verb (infinitive marker)

## 📊 Current Lesson Status

| Lesson | Title | Status | Dialogues | Vocabulary | Exercises |
|--------|-------|--------|-----------|------------|-----------|
| 1 | Going to Trondheim | ✅ Complete | 4/4 | 120 words | 8/8 |
| 2 | [TBD] | 🔄 Template | 0/4 | 0 words | 0/8 |
| 3 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |
| 4 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |
| 5 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |
| 6 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |
| 7 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |
| 8 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |
| 9 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |
| 10 | [TBD] | ⏳ Pending | 0/4 | 0 words | 0/8 |

## 🎯 Best Practices

1. **Consistency**: Follow the same structure for all lessons
2. **Audio Files**: Ensure all audio paths are correct and files exist
3. **Vocabulary**: Keep vocabulary separate in dedicated files
4. **Translations**: Always provide English translations for all Norwegian text
5. **IPA**: Use accurate IPA transcriptions for pronunciation
6. **Testing**: Test all exercises before marking a lesson as complete
7. **Media**: Use appropriate file formats (MP3 for audio, JPG/PNG for images)
8. **XP Rewards**: Balance XP rewards based on lesson complexity

## 🔗 Related Files

- `src/components/Lesson.js`: Main lesson component that renders all sections
- `src/data/lessons.js`: Main lessons registry
- `src/data/exercises.json`: Legacy exercises (being phased out)

## 📞 Support

For questions or issues with the lesson structure, refer to the main project documentation or contact the development team.

---

**Version**: 2.0.0  
**Last Updated**: December 2024

