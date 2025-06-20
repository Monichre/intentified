"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Check, Plus, X } from "lucide-react"
import type { OnboardingStep, BusinessFormData } from "./types"

interface BusinessChatStepProps {
  step: OnboardingStep
  formData: BusinessFormData
  onSubmit: (answer: any) => void
  isProcessing?: boolean
}

export function BusinessChatStep({
  step,
  formData,
  onSubmit,
  isProcessing = false
}: BusinessChatStepProps) {
  const [tempValue, setTempValue] = useState<any>("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [socialLinks, setSocialLinks] = useState(formData.socialLinks)
  const [arrayItems, setArrayItems] = useState<Array<{ name: string; url: string }>>([{ name: "", url: "" }])
  const [keywords, setKeywords] = useState<string[]>([""])
  const [error, setError] = useState<string>("")

  const handleSimpleSubmit = useCallback((value: string) => {
    if (step.validate) {
      const result = step.validate(value)
      if (!result.isValid) {
        setError(result.errorMessage || "Invalid input")
        return
      }
    }
    setError("")
    onSubmit(value)
  }, [step, onSubmit])

  const handleInputSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (tempValue.trim()) {
      handleSimpleSubmit(tempValue.trim())
    }
  }, [tempValue, handleSimpleSubmit])

  const handleSelectSubmit = useCallback((value: string) => {
    if (step.validate) {
      const result = step.validate(value)
      if (!result.isValid) {
        setError(result.errorMessage || "Please select an option")
        return
      }
    }
    setError("")
    onSubmit(value)
  }, [step, onSubmit])

  const handleMultiSelectSubmit = useCallback(() => {
    if (step.validate) {
      const result = step.validate(selectedOptions)
      if (!result.isValid) {
        setError(result.errorMessage || "Please select at least one option")
        return
      }
    }
    setError("")
    onSubmit(selectedOptions)
  }, [step, selectedOptions, onSubmit])

  const handleSocialLinksSubmit = useCallback(() => {
    setError("")
    onSubmit(socialLinks)
  }, [socialLinks, onSubmit])

  const handleArraySubmit = useCallback(() => {
    const validItems = arrayItems.filter(item => item.name.trim())
    if (validItems.length === 0) {
      setError("Please add at least one competitor")
      return
    }
    setError("")
    onSubmit(validItems)
  }, [arrayItems, onSubmit])

  const handleKeywordsSubmit = useCallback(() => {
    const validKeywords = keywords.filter(kw => kw.trim())
    if (step.validate) {
      const result = step.validate(validKeywords)
      if (!result.isValid) {
        setError(result.errorMessage || "Please add at least one keyword")
        return
      }
    }
    setError("")
    onSubmit(validKeywords)
  }, [keywords, step, onSubmit])

  const toggleOption = (value: string) => {
    setSelectedOptions(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const addArrayItem = () => {
    setArrayItems(prev => [...prev, { name: "", url: "" }])
  }

  const removeArrayItem = (index: number) => {
    setArrayItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateArrayItem = (index: number, field: 'name' | 'url', value: string) => {
    setArrayItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const addKeyword = () => {
    setKeywords(prev => [...prev, ""])
  }

  const removeKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index))
  }

  const updateKeyword = (index: number, value: string) => {
    setKeywords(prev => prev.map((kw, i) => i === index ? value : kw))
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center space-x-2 text-white/70">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
          <span>Let me analyze your website... This might take a moment.</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(step.type === 'simple' || step.type === 'url') && (
        <form onSubmit={handleInputSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={step.inputType || 'text'}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={step.placeholder}
              className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white text-lg placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
              autoFocus
            />
          </div>
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
          <motion.button
            type="submit"
            disabled={!tempValue.trim()}
            className="w-full p-4 bg-white/20 hover:bg-white/30 disabled:bg-white/5 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 font-medium"
            whileHover={{ scale: tempValue.trim() ? 1.02 : 1 }}
            whileTap={{ scale: tempValue.trim() ? 0.98 : 1 }}
          >
            Continue
          </motion.button>
        </form>
      )}

      {step.type === 'select' && step.options && (
        <div className="space-y-3">
          {step.options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleSelectSubmit(option.value)}
              className="w-full p-4 text-left bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium text-white">{option.label}</div>
              {option.description && (
                <div className="text-sm text-white/60 mt-1">{option.description}</div>
              )}
            </motion.button>
          ))}
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
        </div>
      )}

      {step.type === 'multi-select' && step.options && (
        <div className="space-y-3">
          {step.options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className={`w-full p-4 text-left backdrop-blur-xl border rounded-2xl transition-all duration-200 ${
                selectedOptions.includes(option.value)
                  ? 'bg-white/25 border-white/40'
                  : 'bg-white/10 hover:bg-white/20 border-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-white/60 mt-1">{option.description}</div>
                  )}
                </div>
                {selectedOptions.includes(option.value) && (
                  <Check className="w-5 h-5 text-green-400" />
                )}
              </div>
            </motion.button>
          ))}
          
          {selectedOptions.length > 0 && (
            <motion.button
              onClick={handleMultiSelectSubmit}
              className="w-full p-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all duration-200 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue with {selectedOptions.length} goal{selectedOptions.length !== 1 ? 's' : ''} selected
            </motion.button>
          )}
          
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
        </div>
      )}

      {step.type === 'social-links' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {Object.entries(socialLinks).map(([platform, url]) => (
              <div key={platform} className="space-y-2">
                <label className="text-sm text-white/70 capitalize font-medium">{platform}</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, [platform]: e.target.value }))}
                  placeholder={`https://${platform}.com/yourcompany`}
                  className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                />
              </div>
            ))}
          </div>
          <motion.button
            onClick={handleSocialLinksSubmit}
            className="w-full p-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        </div>
      )}

      {step.type === 'array' && step.field === 'competitors' && (
        <div className="space-y-4">
          {arrayItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateArrayItem(index, 'name', e.target.value)}
                placeholder="Competitor name"
                className="flex-1 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
              />
              <input
                type="url"
                value={item.url}
                onChange={(e) => updateArrayItem(index, 'url', e.target.value)}
                placeholder="Website (optional)"
                className="flex-1 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
              />
              {arrayItems.length > 1 && (
                <button
                  onClick={() => removeArrayItem(index)}
                  className="p-3 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            <button
              onClick={addArrayItem}
              className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add another competitor
            </button>
          </div>
          
          <motion.button
            onClick={handleArraySubmit}
            className="w-full p-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
          
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
        </div>
      )}

      {step.type === 'array' && step.field === 'keywords' && (
        <div className="space-y-4">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => updateKeyword(index, e.target.value)}
                placeholder={step.placeholder}
                className="flex-1 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
              />
              {keywords.length > 1 && (
                <button
                  onClick={() => removeKeyword(index)}
                  className="p-3 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            <button
              onClick={addKeyword}
              className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add another keyword
            </button>
          </div>
          
          <motion.button
            onClick={handleKeywordsSubmit}
            className="w-full p-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl transition-all duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
          
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
        </div>
      )}
    </motion.div>
  )
}