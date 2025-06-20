"use client"

import { motion } from "framer-motion"

interface CompletionScreenProps {
  formData: {
    name: string
    email: string
    company: string
    details: string
  }
}

export function CompletionScreen({ formData }: CompletionScreenProps) {
  return (
    <motion.div
      key="completion"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="text-center space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-light text-white text-center mx-auto">Thank you, {formData.name}!</h2>
      <p className="text-white/80 font-light">Your submission has been received.</p>
      <div className="mt-6">
        <h3 className="text-lg md:text-xl font-light mb-3">Your information:</h3>
        <div className="text-left bg-black/40 p-3 md:p-4 rounded-xl border border-white/5 max-w-sm mx-auto w-fit min-w-[280px]">
          <p className="mb-1.5">
            <span className="text-white/60">Name:</span> {formData.name}
          </p>
          <p className="mb-1.5">
            <span className="text-white/60">Email:</span> {formData.email}
          </p>
          <p className="mb-1.5">
            <span className="text-white/60">Company:</span> {formData.company}
          </p>
          <p>
            <span className="text-white/60">Project Details:</span> {formData.details}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
