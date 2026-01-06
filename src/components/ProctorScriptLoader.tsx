// Component to load ProctorJS SDK exactly as in the working example.html
// This injects the script directly into the DOM, matching the working HTML example
'use client'

import { useEffect } from 'react'

export default function ProctorScriptLoader() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    // Check if script is already loaded
    if (window.Proctor) {
      console.log('ProctorJS SDK already loaded')
      return
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src="https://proctorsafe.kieffer.me/sdk/proctor.iife.js"]')
    if (existingScript) {
      console.log('ProctorJS SDK script tag already exists')
      // Wait for it to load if it's still loading
      if (!window.Proctor) {
        existingScript.addEventListener('load', () => {
          console.log('ProctorJS SDK loaded from existing script')
        })
      }
      return
    }

    // Create script tag exactly as in the working example.html
    // This matches the exact approach: <script src="https://proctorsafe.kieffer.me/sdk/proctor.iife.js"></script>
    const script = document.createElement('script')
    script.src = 'https://proctorsafe.kieffer.me/sdk/proctor.iife.js'
    
    // Add load handler to confirm script loaded
    script.onload = () => {
      console.log('ProctorJS SDK script loaded successfully')
      // Give WASM modules time to initialize
      setTimeout(() => {
        if (window.Proctor) {
          console.log('ProctorJS SDK ready and available')
        }
      }, 1000)
    }
    
    script.onerror = (error) => {
      console.error('Failed to load ProctorJS SDK:', error)
    }
    
    // Append to body (matching the working example)
    document.body.appendChild(script)

    console.log('ProctorJS SDK script tag added to body')
  }, [])

  return null
}

