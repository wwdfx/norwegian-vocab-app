// Main lessons file - imports all individual lesson files
import { lesson1 } from './lessons/lesson1.js';
import { lesson2 } from './lessons/lesson2.js';
import { lesson3 } from './lessons/lesson3.js';
import { lesson4 } from './lessons/lesson4.js';
import { lesson5 } from './lessons/lesson5.js';
import { lesson6 } from './lessons/lesson6.js';
import { lesson7 } from './lessons/lesson7.js';
import { lesson8 } from './lessons/lesson8.js';
import { lesson9 } from './lessons/lesson9.js';
import { lesson10 } from './lessons/lesson10.js';

// Import existing exercises to maintain compatibility
import exerciseData from './exercises.json';

export const lessonsData = {
  lessons: [
    lesson1,
    lesson2,
    lesson3,
    lesson4,
    lesson5,
    lesson6,
    lesson7,
    lesson8,
    lesson9,
    lesson10
  ],
  
  // Keep existing exercises for backward compatibility
  exercises: exerciseData.exercises,
  
  metadata: {
    version: "2.0.0",
    total_lessons: 10,
    total_exercises: exerciseData.exercises.length,
    last_updated: "2024-12-19"
  }
};

// Helper function to get lesson by ID
export const getLessonById = (lessonId) => {
  return lessonsData.lessons.find(lesson => lesson.id === lessonId);
};

// Helper function to get all lesson sections
export const getLessonSections = (lessonId) => {
  const lesson = getLessonById(lessonId);
  return lesson ? Object.values(lesson.sections) : [];
};

// Helper function to get exercises for a specific lesson section
export const getExercisesForLesson = (lessonId) => {
  const lesson = getLessonById(lessonId);
  if (!lesson || !lesson.sections.exercises) return [];
  
  // Get exercise IDs from the lesson section
  const exerciseIds = lesson.sections.exercises.exerciseIds;
  
  // Get exercises from lesson's exercise_content
  const exercises = [];
  if (lesson.exercise_content) {
    exerciseIds.forEach(exerciseId => {
      const exercise = lesson.exercise_content[exerciseId];
      if (exercise) {
        exercises.push(exercise);
      }
    });
  }
  
  return exercises;
};

export default lessonsData;
