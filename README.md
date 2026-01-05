# Sample Test App

A sample Multiple Choice Question (MCQ) test application built with Next.js 15.1.7 and React 19.0.0. This app is designed for testing proctoring applications.

## Features

- **10 Sample MCQ Questions** - Various topics including geography, science, history, and programming
- **Interactive Test Interface** - Navigate between questions, select answers, and review results
- **Progress Tracking** - Visual progress bar and question navigation dots
- **Results Page** - Detailed score breakdown with correct/incorrect answers
- **Modern UI** - Beautiful design using Tailwind CSS with smooth animations
- **Sample App Indicator** - Clear banner showing this is a sample app for proctoring testing

## Tech Stack

- **Next.js** 15.1.7
- **React** 19.0.0
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
  app/
    layout.tsx      # Root layout
    page.tsx        # Main test page component
    globals.css     # Global styles
  data/
    questions.ts    # Sample questions data
```

## Usage

This is a sample application designed for testing proctoring software. The test includes:
- 10 multiple choice questions
- No time limit (for testing purposes)
- Ability to navigate between questions
- Answer selection and review
- Final results page with score breakdown

**Note:** This is clearly marked as a sample app with a banner at the top of the page.
