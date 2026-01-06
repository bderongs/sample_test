// Root layout component for the Next.js app
import type { Metadata } from 'next'
import './globals.css'
import ProctorScriptLoader from '@/components/ProctorScriptLoader'

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
      <body>
        {/* ProctorJS SDK - loaded exactly as in the working example.html */}
        <ProctorScriptLoader />
        {children}
      </body>
    </html>
  )
}

