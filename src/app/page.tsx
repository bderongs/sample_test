// Main test page component displaying the MCQ test interface
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Clock, FileText, Play, BookOpen, Target, Award } from 'lucide-react'
import { sampleQuestions } from '@/data/questions'
import {
  startProctorSession,
  markProctorEvent,
  endProctorSession,
  isProctorLoaded,
  type ProctorEvent,
} from '@/lib/proctor'

export default function TestPage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [proctorError, setProctorError] = useState<string | null>(null)
  const [isStartingProctor, setIsStartingProctor] = useState(false)

  const question = sampleQuestions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const totalQuestions = sampleQuestions.length
  const answeredCount = Object.keys(answers).length

  // Monitor ProctorJS SDK loading
  useEffect(() => {
    const checkProctor = setInterval(() => {
      if (isProctorLoaded()) {
        console.log('ProctorJS SDK is now available')
        clearInterval(checkProctor)
      }
    }, 1000)

    // Cleanup after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkProctor)
    }, 30000)

    return () => {
      clearInterval(checkProctor)
      clearTimeout(timeout)
    }
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }))
    
    // Mark proctor event when question is answered
    markProctorEvent('QUESTION_ANSWERED', {
      questionId: currentQuestion + 1,
      answerIndex: answerIndex,
      timestamp: new Date().toISOString(),
    })
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
      // Mark navigation event
      markProctorEvent('QUESTION_NAVIGATED', {
        from: currentQuestion + 1,
        to: currentQuestion + 2,
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      // Mark navigation event
      markProctorEvent('QUESTION_NAVIGATED', {
        from: currentQuestion + 1,
        to: currentQuestion,
      })
    }
  }

  const handleSubmit = async () => {
    // Mark test completion event
    markProctorEvent('TEST_SUBMITTED', {
      totalQuestions: totalQuestions,
      answeredQuestions: Object.keys(answers).length,
      timestamp: new Date().toISOString(),
    })

    // End proctoring session
    try {
      const summary = await endProctorSession()
      console.log('Proctoring session ended:', summary)
      // You can store the summary or send it to your backend
    } catch (error) {
      console.error('Error ending proctoring session:', error)
    }

    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    sampleQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++
      }
    })
    return { correct, total: totalQuestions }
  }

  if (showResults) {
    const { correct, total } = calculateScore()
    const percentage = Math.round((correct / total) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
              {percentage >= 70 ? (
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              ) : (
                <AlertCircle className="w-10 h-10 text-orange-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed</h1>
            <p className="text-gray-600">This is a sample test for proctoring purposes</p>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-6">
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2">{percentage}%</div>
              <div className="text-lg opacity-90">
                {correct} out of {total} questions correct
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sampleQuestions.map((q, index) => {
              const userAnswer = answers[index]
              const isCorrect = userAnswer === q.correctAnswer
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        Question {index + 1}: {q.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: {q.options[userAnswer] || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700 font-medium mt-1">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => {
              setShowResults(false)
              setCurrentQuestion(0)
              setAnswers({})
              setHasStarted(false)
              setProctorError(null)
            }}
            className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Retake Test
          </button>
        </div>
      </div>
    )
  }

  // Landing page
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header Banner - Clearly showing it's a sample app */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">SAMPLE TEST APP - For Proctoring Testing Purposes Only</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in-up">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
                <BookOpen className="w-10 h-10 text-indigo-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome to the Sample Test
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                This is a sample multiple choice question test designed for proctoring application testing.
              </p>
            </div>

            {/* Test Information Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {sampleQuestions.length} Questions
                </h3>
                <p className="text-sm text-gray-600">
                  Multiple choice questions covering various topics
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Time Limit
                </h3>
                <p className="text-sm text-gray-600">
                  Take your time to answer each question carefully
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Instant Results
                </h3>
                <p className="text-sm text-gray-600">
                  Get your score and review answers immediately
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                Instructions
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Read each question carefully before selecting your answer</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You can navigate between questions using the Previous/Next buttons</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use the question navigation dots to jump to any question</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You can change your answers before submitting the test</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Click "Submit Test" when you're ready to see your results</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Proctoring:</strong> This test uses ProctorSafe for monitoring. 
                    You'll need to allow camera and microphone access when starting the test.
                  </span>
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="text-center">
              {proctorError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-red-900 mb-1">Proctoring Setup Error</p>
                      <p className="text-sm text-red-700">{proctorError}</p>
                      <p className="text-xs text-red-600 mt-2">
                        Please ensure your camera and microphone permissions are enabled.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={async () => {
                  setIsStartingProctor(true)
                  setProctorError(null)

                  // Wait for ProctorJS to load if needed
                  // The SDK auto-loads dependencies (TensorFlow.js, modern-face-api) which may take time
                  let retries = 0
                  const maxRetries = 30 // Wait up to 15 seconds (30 * 500ms)
                  while (!isProctorLoaded() && retries < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    retries++
                  }

                  if (!isProctorLoaded()) {
                    setProctorError(
                      'ProctorJS SDK failed to load. The script may still be loading dependencies. ' +
                      'Please wait a moment and try again, or refresh the page.'
                    )
                    setIsStartingProctor(false)
                    return
                  }

                  try {
                    // Start proctoring session with event handler
                    await startProctorSession((event: ProctorEvent) => {
                      console.log('Proctor event:', event)
                      
                      // Handle specific events
                      switch (event.type) {
                        case 'FACE_MISSING':
                          console.warn('Face not detected - please ensure your face is visible')
                          break
                        case 'MULTIPLE_FACES':
                          console.warn('Multiple faces detected')
                          break
                        case 'TAB_BLUR':
                          console.warn('Tab switched - warning issued')
                          break
                        case 'MIC_PEAK':
                          // Audio detected - normal
                          break
                        default:
                          // Custom events or other system events
                          break
                      }
                    })

                    // Mark test start event
                    markProctorEvent('TEST_STARTED', {
                      totalQuestions: totalQuestions,
                      timestamp: new Date().toISOString(),
                    })

                    // Start the test
                    setHasStarted(true)
                  } catch (error) {
                    console.error('Error starting proctoring:', error)
                    setProctorError(
                      error instanceof Error
                        ? error.message
                        : 'Failed to start proctoring session. Please check your camera and microphone permissions.'
                    )
                  } finally {
                    setIsStartingProctor(false)
                  }
                }}
                disabled={isStartingProctor}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isStartingProctor ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Starting Proctoring...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    Let's Start
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                {isStartingProctor
                  ? 'Initializing proctoring session...'
                  : 'Click the button above to begin the test'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Test interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Banner - Clearly showing it's a sample app */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold">SAMPLE TEST APP - For Proctoring Testing Purposes Only</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-8 h-8 text-indigo-600" />
                Sample MCQ Test
              </h1>
              <p className="text-gray-600">Multiple Choice Questions - Sample Application</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">No time limit</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{answeredCount} answered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-fade-in-up">
          <div className="mb-6">
            <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Question {currentQuestion + 1}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between gap-4 animate-fade-in-up">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestion < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Submit Test
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {sampleQuestions.map((_, index) => {
            const isAnswered = answers[index] !== undefined
            const isCurrent = index === currentQuestion
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white scale-110'
                    : isAnswered
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

