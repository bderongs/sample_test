// Sample questions data for the MCQ test application
export interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

export const sampleQuestions: Question[] = [
  {
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

