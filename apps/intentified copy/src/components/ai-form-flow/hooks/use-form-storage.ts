"use client"

import { useState, useEffect } from "react"

export function useFormStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error)
    }
  }, [key])

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  // Clear storage
  const clearStorage = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  }

  return { value: storedValue, setValue, clearStorage }
}
