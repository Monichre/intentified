"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface ChatInputProps {
  onSubmit: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  disabled?: boolean
  validate?: (value: string) => { isValid: boolean; errorMessage?: string }
  inputType?: "text" | "email" | "url" | "tel" | "number"
}

export function ChatInput({
  onSubmit,
  placeholder = "Type your answer...",
  autoFocus = false,
  disabled = false,
  validate,
  inputType,
}: ChatInputProps) {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Delay focus to ensure the element is fully rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (disabled || !value.trim()) return

    if (validate) {
      const result = validate(value)
      if (!result.isValid) {
        setError(result.errorMessage)
        return
      }
    }

    setError(undefined)
    onSubmit(value)
    setValue("")
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative ${error ? "error" : ""}`}>
        <input
          ref={inputRef}
          type={inputType || "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="form-input pr-12"
          aria-label="Your answer"
          aria-invalid={!!error}
        />

        <motion.button
          type="submit"
          disabled={!value.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          whileHover={{ scale: !disabled && value.trim() ? 1.05 : 1 }}
          whileTap={{ scale: !disabled && value.trim() ? 0.95 : 1 }}
          transition={{ duration: 0.2 }}
          aria-label="Submit answer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.0791 12.519C21.0744 12.7044 21.0013 12.8884 20.8599 13.0299L14.8639 19.0301C14.5711 19.3231 14.0962 19.3233 13.8032 19.0305C13.5103 18.7377 13.5101 18.2629 13.8029 17.9699L18.5233 13.2461L4.32813 13.2461C3.91391 13.2461 3.57813 12.9103 3.57812 12.4961C3.57812 12.0819 3.91391 11.7461 4.32812 11.7461L18.5158 11.7461L13.8029 7.03016C13.5101 6.73718 13.5102 6.2623 13.8032 5.9695C14.0962 5.6767 14.5711 5.67685 14.8639 5.96984L20.813 11.9228C20.976 12.0603 21.0795 12.2661 21.0795 12.4961C21.0795 12.5038 21.0794 12.5114 21.0791 12.519Z"
              fill="currentColor"
            />
          </svg>
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 mt-1 ml-1"
        >
          {error}
        </motion.div>
      )}
    </form>
  )
}
