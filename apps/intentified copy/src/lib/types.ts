import type { LucideIcon } from "lucide-react"

export interface Conversation {
  id: string
  title: string
  icon?: LucideIcon
  branch?: string
  branchIcon?: LucideIcon
  isActive?: boolean
}

export interface MessageOption {
  id: string
  label: string
  checked: boolean
}

export interface Message {
  id: string
  type: "bot_message" | "user_prompt"
  senderIcon?: LucideIcon // Icon for the sender (e.g. bot icon)
  content: string
  options?: MessageOption[]
  timestamp?: string // e.g., "10:30 AM" or relative time
  isQuestion?: boolean
  questionHeader?: string
  questionIcon?: LucideIcon
}
