import { useState, useEffect, useCallback, useRef } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('info_pwa_prompt_dismissed') === 'true'
    }
    return false
  })
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false)
  const isRegisteredRef = useRef(false)

  // 1. Detect Standalone / Installed Mode and iOS platform
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://')

      setIsInstalled(Boolean(isStandaloneMode))
    }

    checkStandalone()

    // iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
    setIsIOS(isAppleDevice)

    // Listen for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 2. Register Service Worker cleanly (once)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (isRegisteredRef.current) return

    isRegisteredRef.current = true

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Check for service worker updates periodically
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // A new version is available
                  console.info('[PWA] New version installed. Ready for next visit.')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.warn('[PWA] Service worker registration failed:', error)
        })
    })
  }, [])

  // 3. Listen for beforeinstallprompt event (Chromium, Android, Edge, Desktop Chrome)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent automatic browser mini-infobar to give user an unobtrusive, elegant option
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      sessionStorage.removeItem('info_pwa_prompt_dismissed')
      console.info('[PWA] INFO Campus Navigator was successfully installed.')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // 4. Trigger Install Prompt upon explicit user action
  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual-ios' | 'unsupported'> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice.outcome === 'accepted') {
          setIsInstalled(true)
          setDeferredPrompt(null)
          return 'accepted'
        } else {
          // User chose not to install at this moment
          setDeferredPrompt(null)
          return 'dismissed'
        }
      } catch (err) {
        console.warn('[PWA] Error calling install prompt:', err)
        return 'unsupported'
      }
    }

    // On iOS Safari, beforeinstallprompt is not supported natively; show manual steps
    if (isIOS && !isInstalled) {
      setShowIOSInstructions(true)
      return 'manual-ios'
    }

    return 'unsupported'
  }, [deferredPrompt, isIOS, isInstalled])

  // 5. Dismiss notification banner for current session
  const dismissInstall = useCallback(() => {
    setIsDismissed(true)
    setShowIOSInstructions(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('info_pwa_prompt_dismissed', 'true')
    }
  }, [])

  const closeIOSInstructions = useCallback(() => {
    setShowIOSInstructions(false)
  }, [])

  return {
    isInstalled,
    isDismissed,
    canInstall: Boolean(deferredPrompt || (isIOS && !isInstalled)),
    isPromptAvailable: Boolean(deferredPrompt),
    isIOS,
    showIOSInstructions,
    promptInstall,
    dismissInstall,
    closeIOSInstructions,
  }
}
