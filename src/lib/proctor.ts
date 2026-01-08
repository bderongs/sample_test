// ProctorJS integration utility for managing proctoring sessions
// Based on ProctorSafe documentation: https://proctorsafe.kieffer.me/docs

// Type definitions for ProctorJS
declare global {
  interface Window {
    Proctor: {
      checkRequirements: () => Promise<{
        success: boolean
        camera?: string
        microphone?: string
        lighting?: string
      }>
      start: (
        config: {
          tenantName: string
          applicationReference: string
          timestamp?: string
          signature?: string
          handshakeToken?: string
          apiEndpoint?: string
          settings?: {
            showPreview?: boolean
            monitorVisibility?: boolean
            detectionInterval?: number
            enableOfflineSync?: boolean
            audioSensitivity?: number
          }
        },
        eventCallback?: (event: ProctorEvent) => void
      ) => Promise<void>
      mark: (type: string, metadata?: Record<string, unknown>) => void
      startSection: (name: string, metadata?: Record<string, unknown>) => Promise<void>
      endSection: () => Promise<void>
      end: () => Promise<{
        sessionId: string
        startTime: string
        endTime: string
        totalEvents: number
        trustScore: number
        timeline: ProctorEvent[]
      }>
    }
  }
}

export interface ProctorEvent {
  type: string
  source?: string
  metadata?: Record<string, unknown>
  timestamp?: string
}

// Check if ProctorJS is loaded
export function isProctorLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.Proctor !== 'undefined'
}

// Check requirements before starting
export async function checkProctorRequirements() {
  if (!isProctorLoaded()) {
    throw new Error('ProctorJS SDK is not loaded. Please wait for the script to load.')
  }

  return await window.Proctor.checkRequirements()
}

// Start proctoring session
export async function startProctorSession(
  eventCallback?: (event: ProctorEvent) => void
): Promise<void> {
  if (!isProctorLoaded()) {
    throw new Error('ProctorJS SDK is not loaded')
  }

  // Check requirements first
  const requirements = await checkProctorRequirements()
  if (!requirements.success) {
    const errors: string[] = []
    if (requirements.camera !== 'available') {
      errors.push('Camera access is required')
    }
    if (requirements.microphone !== 'available') {
      errors.push('Microphone access is required')
    }
    throw new Error(`Requirements not met: ${errors.join(', ')}`)
  }

  // Start the session (matching the working example.html - no handshakeToken needed)
  await window.Proctor.start(
    {
      tenantName: 'demo',
      applicationReference: 'sample-test-app',
      // Note: handshakeToken is optional - not used in the working example
      settings: {
        showPreview: true,
        monitorVisibility: true,
        detectionInterval: 1000,
        enableOfflineSync: true,
        audioSensitivity: 0.5,
      },
    },
    eventCallback
  )
}

// Mark a custom event
export function markProctorEvent(type: string, metadata?: Record<string, unknown>): void {
  if (!isProctorLoaded()) {
    console.warn('ProctorJS SDK is not loaded, cannot mark event')
    return
  }

  window.Proctor.mark(type, metadata)
}

// End proctoring session
export async function endProctorSession() {
  if (!isProctorLoaded()) {
    throw new Error('ProctorJS SDK is not loaded')
  }

  return await window.Proctor.end()
}

