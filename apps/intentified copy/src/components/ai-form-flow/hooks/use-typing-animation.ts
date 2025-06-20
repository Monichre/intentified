"use client"

import { useState, useEffect, useRef } from "react"

// Utility to check if we should use reduced animations
const shouldReduceMotion = () => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function useTypingAnimation(text: string, speed = 12) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const frameRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!text || speed === 0) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    // If user prefers reduced motion, show text immediately
    if (shouldReduceMotion()) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    setDisplayedText("")
    setIsComplete(false)

    let index = 0
    // Use a more efficient approach with fewer state updates
    const chunkSize = Math.max(1, Math.floor(text.length / 15))

    // Clear any existing animations
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Defer animation start to next idle period if possible
    const startAnimation = () => {
      // Use requestAnimationFrame for smoother animation
      const animate = () => {
        if (index < text.length) {
          const nextIndex = Math.min(index + chunkSize, text.length)

          // Use functional update to avoid closure issues
          setDisplayedText((prev) => prev + text.substring(index, nextIndex))
          index = nextIndex

          // Schedule next frame
          timeoutRef.current = setTimeout(() => {
            frameRef.current = requestAnimationFrame(animate)
          }, speed * chunkSize)
        } else {
          setIsComplete(true)
        }
      }

      // Start animation in next frame
      frameRef.current = requestAnimationFrame(animate)
    }

    // Use requestIdleCallback if available, otherwise start immediately
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleCallbackId = window.requestIdleCallback(
        () => {
          startAnimation()
        },
        { timeout: 200 },
      )

      // Store the ID for cleanup
      const originalCleanup = () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        if (idleCallbackId && window.cancelIdleCallback) {
          window.cancelIdleCallback(idleCallbackId)
        }
      }

      return originalCleanup
    } else {
      startAnimation()

      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [text, speed])

  return { displayedText, isComplete }
}
