// Helper to check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

/**
 * Performance monitoring utility
 *
 * This utility helps track and optimize performance metrics
 * without affecting the visual appearance or functionality.
 */

// Report long tasks to help identify CPU blocking operations
export function monitorLongTasks() {
  if (isBrowser && "PerformanceObserver" in window) {
    try {
      // Create observer for long tasks
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log long tasks that might be causing CPU blocking
          if (entry.duration > 50) {
            console.warn("Long task detected:", {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime),
              name: entry.name,
            })
          }
        })
      })

      // Start observing long tasks
      observer.observe({ entryTypes: ["longtask"] })

      return () => observer.disconnect()
    } catch (e) {
      console.error("Error setting up performance monitoring:", e)
      return () => {}
    }
  }
  return () => {}
}

// Report layout shifts that might indicate performance issues
export function monitorLayoutShifts() {
  if (isBrowser && "PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.value > 0.01) {
            console.warn("Layout shift detected:", {
              value: entry.value.toFixed(3),
              sources: entry.sources || [],
            })
          }
        })
      })

      observer.observe({ type: "layout-shift", buffered: true })

      return () => observer.disconnect()
    } catch (e) {
      return () => {}
    }
  }
  return () => {}
}

// Initialize monitoring in development only
export function initPerformanceMonitoring() {
  if (isBrowser && process.env.NODE_ENV === "development") {
    const cleanupLongTasks = monitorLongTasks()
    const cleanupLayoutShifts = monitorLayoutShifts()

    return () => {
      cleanupLongTasks()
      cleanupLayoutShifts()
    }
  }
  return () => {}
}
