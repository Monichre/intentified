"use client"

import { getHighlighter } from "shiki"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface CodePreviewProps {
  code: string
  className?: string
}

let highlighterPromise: Promise<any>

async function getShikiHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["typescript"],
    })
  }
  return highlighterPromise
}

export function CodePreview({ code, className }: CodePreviewProps) {
  const [html, setHtml] = useState("")
  const { theme } = useTheme()

  useEffect(() => {
    getShikiHighlighter().then((highlighter) => {
      const highlighted = highlighter.codeToHtml(code, {
        lang: "typescript",
        theme: theme === "dark" ? "github-dark" : "github-light",
      })

      // Replace background color and add padding styles
      const processedHtml = highlighted
        .replace(/style="[^"]*?background-color:[^"]*?"/, "")
        .replace('<pre class="', '<pre style="background: transparent;" class="')

      setHtml(processedHtml)
    })
  }, [code, theme])

  return <div className={cn("overflow-x-auto", className)} dangerouslySetInnerHTML={{ __html: html }} />
}
