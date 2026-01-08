// Sample questions data for the MCQ test application
// Supports both multiple choice questions (MCQ) and typing questions
export type QuestionType = 'mcq' | 'typing'

export interface MCQQuestion {
  type: 'mcq'
  question: string
  options: string[]
  correctAnswer: number
}

export interface TypingQuestion {
  type: 'typing'
  question: string
  correctAnswer: string
  // Optional: case-sensitive matching (default: false)
  caseSensitive?: boolean
}

export type Question = MCQQuestion | TypingQuestion

export const sampleQuestions: Question[] = [
  {
    type: 'mcq',
    question: "What is the capital city of France?",
    options: [
      "London",
      "Berlin",
      "Paris",
      "Madrid"
    ],
    correctAnswer: 2
  },
  {
    type: 'mcq',
    question: "Which planet is known as the Red Planet?",
    options: [
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn"
    ],
    correctAnswer: 1
  },
  {
    type: 'typing',
    question: "What is the chemical formula for water? (Type your answer)",
    correctAnswer: "H2O",
    caseSensitive: false
  },
  {
    type: 'mcq',
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    correctAnswer: 3
  },
  {
    type: 'mcq',
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo"
    ],
    correctAnswer: 2
  },
  {
    type: 'typing',
    question: "In which year did the first man land on the moon? (Type the year)",
    correctAnswer: "1969",
    caseSensitive: false
  },
  {
    type: 'mcq',
    question: "What is the chemical symbol for gold?",
    options: [
      "Go",
      "Gd",
      "Au",
      "Ag"
    ],
    correctAnswer: 2
  },
  {
    type: 'mcq',
    question: "Which programming language is known as the 'language of the web'?",
    options: [
      "Python",
      "Java",
      "JavaScript",
      "C++"
    ],
    correctAnswer: 2
  },
  {
    type: 'mcq',
    question: "What is the smallest prime number?",
    options: [
      "0",
      "1",
      "2",
      "3"
    ],
    correctAnswer: 2
  },
  {
    type: 'typing',
    question: "What is the name of the longest river in the world? (Type your answer)",
    correctAnswer: "Nile",
    caseSensitive: false
  },
  {
    type: 'mcq',
    question: "Which continent is the largest by land area?",
    options: [
      "Africa",
      "North America",
      "Asia",
      "Europe"
    ],
    correctAnswer: 2
  },
  {
    type: 'mcq',
    question: "What is the speed of light in a vacuum (approximately)?",
    options: [
      "300,000 km/s",
      "150,000 km/s",
      "450,000 km/s",
      "600,000 km/s"
    ],
    correctAnswer: 0
  },
  {
    type: 'mcq',
    question: "Which year did World War II end?",
    options: [
      "1943",
      "1944",
      "1945",
      "1946"
    ],
    correctAnswer: 2
  }
]

