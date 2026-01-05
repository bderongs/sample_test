// Root layout component for the Next.js app
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sample Test App',
  description: 'A sample MCQ test application for proctoring testing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

