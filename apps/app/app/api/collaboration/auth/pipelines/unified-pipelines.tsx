"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  FileText, 
  Search, 
  Brain,
  ChevronRight,
  Menu,
  X,
  Layers3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Import pipeline components
import { AgentSandbox } from "./ai-agents-processing/agent"
import { PromptEditor } from "./ai-prompting-pipeline/prompt-editor"
import { UploadZoneWrapper } from "./document-processing/upload-zone"
import { DocumentsList } from "./document-processing/documents-list"
import SectionLayout from "./seo-digital-processing/sections/_layout"

// Pipeline configuration
const PIPELINES = [
  {
    id: "ai-agents",
    name: "AI Agents",
    description: "Test and explore different AI agent patterns",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    description: "Design and evaluate few-shot prompts",
    icon: Sparkles,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "document-processing",
    name: "Document Processing",
    description: "Extract, analyze, and vectorize documents",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "seo-analysis",
    name: "SEO Analysis",
    description: "Analyze SEO and web vitals performance",
    icon: Search,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
] as const

type PipelineId = typeof PIPELINES[number]["id"]

export function UnifiedPipelines() {
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineId>("ai-agents")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const currentPipeline = PIPELINES.find(p => p.id === selectedPipeline)!

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r">
        <PipelineSidebar 
          selectedPipeline={selectedPipeline}
          onSelectPipeline={setSelectedPipeline}
        />
      </div>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1">
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>AI Pipelines</SheetTitle>
                </SheetHeader>
                <PipelineSidebar 
                  selectedPipeline={selectedPipeline}
                  onSelectPipeline={(id) => {
                    setSelectedPipeline(id)
                    setIsMobileMenuOpen(false)
                  }}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">{currentPipeline.name}</h1>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPipeline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <PipelineContent pipelineId={selectedPipeline} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function PipelineSidebar({ 
  selectedPipeline, 
  onSelectPipeline 
}: { 
  selectedPipeline: PipelineId
  onSelectPipeline: (id: PipelineId) => void 
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Layers3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Pipelines</h2>
            <p className="text-xs text-muted-foreground">Unified Processing Hub</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {PIPELINES.map((pipeline) => {
            const Icon = pipeline.icon
            const isSelected = selectedPipeline === pipeline.id

            return (
              <motion.button
                key={pipeline.id}
                onClick={() => onSelectPipeline(pipeline.id)}
                className={cn(
                  "w-full p-4 rounded-lg text-left transition-all",
                  "hover:bg-muted/50",
                  isSelected && "bg-muted shadow-sm"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    pipeline.bgColor,
                    pipeline.borderColor,
                    "border"
                  )}>
                    <Icon className={cn("h-4 w-4", pipeline.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{pipeline.name}</h3>
                      {isSelected && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pipeline.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          <span className="flex items-center justify-center gap-1">
            <span>Powered by</span>
            <span className="font-medium">Vercel AI SDK</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function PipelineContent({ pipelineId }: { pipelineId: PipelineId }) {
  switch (pipelineId) {
    case "ai-agents":
      return (
        <div className="h-full">
          <AgentSandbox />
        </div>
      )
    
    case "prompt-engineering":
      return (
        <div className="h-full overflow-auto">
          <PromptEditor />
        </div>
      )
    
    case "document-processing":
      return (
        <div className="h-full overflow-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Document Processing</h1>
              <p className="text-muted-foreground">
                Upload documents to extract text, analyze content, and generate embeddings
              </p>
            </div>
            <UploadZoneWrapper />
            <DocumentsList />
          </div>
        </div>
      )
    
    case "seo-analysis":
      return (
        <div className="h-full overflow-auto">
          <SectionLayout />
        </div>
      )
    
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Pipeline not found</p>
        </div>
      )
  }
} 