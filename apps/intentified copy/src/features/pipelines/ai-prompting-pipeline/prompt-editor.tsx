"use client";

import type { z } from "zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { readStreamableValue } from "ai/rsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form";
import {
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { CodePreview } from "./code-preview";
import { ProgressiveBlur } from "./progressive-blur";
import { AutosizeTextarea } from "./auto-resize-text-area";

import { evaluatePrompt, improveExamples } from "../app/actions";
import {
  type AnalysisResult,
  defaultExamples,
  promptFormSchema,
} from "../lib/schema";

import { cn } from "@/utils/utils";

type FormData = z.infer<typeof promptFormSchema>;

export function PromptEditor() {
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isImprovingExamples, setIsImprovingExamples] = useState(false);
  const [streamedResult, setStreamedResult] =
    useState<Partial<AnalysisResult> | null>(null);
  const [improvedExamples, setImprovedExamples] = useState<{
    examples: Array<{ input: string; output: string; explanation: string }>;
    reasoning: string;
  } | null>(null);
  const [activeExample, setActiveExample] = useState<
    keyof typeof defaultExamples | null
  >(null);

  const form = useForm<FormData>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      systemPrompt: "",
      examples: [{ input: "", output: "" }],
      testInput: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "examples",
  });

  async function runPrompt(data: FormData) {
    try {
      setIsPromptLoading(true);
      setPromptResult(null);
      setStreamedResult(null);
      setImprovedExamples(null);

      const result = await evaluatePrompt(data);

      for await (const chunk of readStreamableValue(result.output)) {
        if (typeof chunk === "string") {
          setPromptResult(chunk);
        } else {
          setPromptResult(JSON.stringify(chunk, null, 2));
        }
      }
    } catch (error) {
      console.error("[PromptEditor] Error running prompt:", error);
    } finally {
      setIsPromptLoading(false);
    }
  }

  async function evaluateOutput() {
    if (!promptResult) return;

    try {
      setIsEvaluating(true);
      const result = await evaluatePrompt({
        ...form.getValues(),
        evaluation: true,
        output: promptResult,
      });

      for await (const chunk of readStreamableValue(result.output)) {
        if (chunk && typeof chunk === "object" && "analysis" in chunk) {
          setStreamedResult((prev) => ({
            ...prev,
            analysis: {
              consistency:
                chunk.analysis.consistency ?? prev?.analysis?.consistency ?? 0,
              relevance:
                chunk.analysis.relevance ?? prev?.analysis?.relevance ?? 0,
              quality: chunk.analysis.quality ?? prev?.analysis?.quality ?? 0,
              feedback:
                chunk.analysis.feedback ?? prev?.analysis?.feedback ?? "",
            },
          }));
        }
      }
    } catch (error) {
      console.error("[PromptEditor] Error evaluating:", error);
      toast.error("Failed to evaluate output");
    } finally {
      setIsEvaluating(false);
    }
  }

  async function handleImproveExamples() {
    if (!promptResult) return;

    try {
      setIsImprovingExamples(true);
      const result = await improveExamples({
        ...form.getValues(),
        evaluation: true,
        output: promptResult,
      });

      for await (const chunk of readStreamableValue(result.output)) {
        if (chunk && typeof chunk === "object" && "examples" in chunk) {
          setImprovedExamples(chunk);
        }
      }
    } catch (error) {
      console.error("[PromptEditor] Error improving examples:", error);
      toast.error("Failed to improve examples");
    } finally {
      setIsImprovingExamples(false);
    }
  }

  return (
    <div className="mx-auto h-full w-full p-4">
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Header />
          {/* Editor Section */}
          <PromptEditorForm
            form={form}
            isPromptLoading={isPromptLoading}
            activeExample={activeExample}
            setActiveExample={setActiveExample}
            fields={fields}
            append={append}
            remove={remove}
            runPrompt={runPrompt}
          />
        </div>

        {/* Results Section */}
        <div className="border-muted-foreground/20 h-[calc(100vh-4rem)] overflow-y-auto border border-dashed pb-2">
          <div className="space-y-4 p-3">
            <div className="">
              <CodeSnippet
                {...form.getValues()}
                isGenerating={isPromptLoading}
              />
            </div>

            <AnimatePresence mode="wait">
              {promptResult && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.1,
                  }}
                  className="space-y-4"
                >
                  {/* Output */}
                  <Output
                    promptResult={promptResult}
                    evaluateOutput={evaluateOutput}
                    isEvaluating={isEvaluating}
                    streamedResult={streamedResult}
                  />

                  {/* Analysis Results */}
                  <AnalysisResults streamedResult={streamedResult} />

                  {/* After the Analysis Results section */}
                  {streamedResult && !isEvaluating && (
                    <ImprovedExamples
                      form={form}
                      improvedExamples={improvedExamples}
                      handleImproveExamples={handleImproveExamples}
                      isImprovingExamples={isImprovingExamples}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full p-1 lg:block">
        <VercelIcon className="size-4 stroke-black" />
      </div>
      <span className="hidden text-xs text-[#D4D4D8] lg:block">/</span>
      <h1 className="inline-flex items-center gap-1 text-xs font-bold tracking-tight">
        <span className="hidden lg:block">AI</span>
        <span className="hidden lg:block">SDK</span>
        <span className="hidden px-1 text-xs text-[#D4D4D8] lg:block">/</span>
        <div className="relative rounded-full bg-blue-600 px-1.5 py-0.5 font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.15),_inset_0_1px_0.5px_rgba(255,255,255,0.2),_0_-0.5px_1px_rgba(0,0,0,0.08)_inset,_0_0_0_1px_rgba(0,0,0,0.08)_inset]">
          <span className="relative z-10">Few Shot Prompt Evaluator</span>
        </div>
      </h1>
    </div>
  );
}

function PromptEditorForm({
  form,
  isPromptLoading,
  activeExample,
  setActiveExample,
  fields,
  append,
  remove,
  runPrompt,
}: {
  runPrompt: (data: FormData) => void;
  form: UseFormReturn<FormData>;
  isPromptLoading: boolean;
  activeExample: keyof typeof defaultExamples | null;
  setActiveExample: (example: keyof typeof defaultExamples | null) => void;
  fields: ReturnType<typeof useFieldArray>["fields"];
  append: ReturnType<typeof useFieldArray>["append"];
  remove: ReturnType<typeof useFieldArray>["remove"];
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(runPrompt)} className="space-y-4">
        <ScrollArea className="w-full bg-white px-4 py-2 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]">
          <Label className="text-[10px] font-medium">Quick Start</Label>
          <div className="flex gap-2 py-2 pl-[1px]">
            {Object.entries(defaultExamples).map(([key, example]) => (
              <Badge
                key={key}
                variant={activeExample === key ? "secondary" : "outline"}
                onClick={() => {
                  form.reset({
                    systemPrompt: example.systemPrompt,
                    examples: example.examples,
                    testInput: "",
                  });
                  setActiveExample(key as keyof typeof defaultExamples);
                }}
                className="cursor-pointer rounded-none border-none text-xs shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Badge>
            ))}
          </div>
        </ScrollArea>

        <ScrollArea className="h-[37rem] bg-white p-4 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]">
          <div className="space-y-4 pr-3 pb-2 pl-1">
            {/* System Prompt */}
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="text-[10px] font-medium">
                      System Prompt
                    </FormLabel>
                    <CompleteBadge
                      isComplete={isFieldComplete(form.watch("systemPrompt"))}
                    />
                  </div>
                  <FormControl>
                    <AutosizeTextarea
                      minHeight={30}
                      placeholder="You are a helpful assistant..."
                      className="rounded-none border-none font-sans text-sm shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)] md:text-xs"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Examples */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FormLabel className="text-[10px] font-medium">
                    Few Shot Examples{" "}
                    <span className="text-[8px] text-blue-400">
                      [{fields.length}]
                    </span>
                  </FormLabel>
                  <CompleteBadge
                    isComplete={isFieldComplete(form.watch("examples"))}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append({ input: "", output: "" })}
                  className="group h-7 rounded-none text-[11px] text-neutral-800 hover:text-black hover:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                >
                  <Plus className="mr-1 h-3 w-3 transition-all delay-75 duration-150 ease-out group-hover:scale-110 group-hover:rotate-90" />
                  Add Example
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border-border/70 group relative flex items-start justify-between gap-2 space-y-2 border border-dashed p-2"
                  >
                    <div className="flex-1">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`examples.${index}.input`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="text-muted-foreground/60 text-[9px] font-medium">
                                  Input
                                </FormLabel>
                                <CompleteBadge
                                  isComplete={isFieldComplete(field.value)}
                                />
                              </div>
                              <FormControl>
                                <AutosizeTextarea
                                  minHeight={30}
                                  className="h-20 resize-none rounded-none border-none font-sans text-xs shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                                  placeholder="Input..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`examples.${index}.output`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="text-muted-foreground/60 text-[9px] font-medium">
                                  Output
                                </FormLabel>
                                <CompleteBadge
                                  isComplete={isFieldComplete(field.value)}
                                />
                              </div>
                              <FormControl>
                                <AutosizeTextarea
                                  minHeight={30}
                                  className="h-20 resize-none rounded-none border-none font-sans text-xs shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                                  placeholder="Output..."
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="invisible absolute bottom-2 left-2 translate-y-1 opacity-0 transition-all duration-200 ease-in-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-muted-foreground/40 hover:text-destructive h-5 rounded-none bg-white py-3 text-xs shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Input */}
            <FormField
              control={form.control}
              name="testInput"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="text-[10px] font-medium">
                      Input
                    </FormLabel>
                    <CompleteBadge isComplete={isFieldComplete(field.value)} />
                  </div>
                  <FormControl>
                    <AutosizeTextarea
                      minHeight={30}
                      placeholder="Enter test input..."
                      className="resize-none rounded-none font-sans text-sm"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>

        <Button
          type="submit"
          disabled={isPromptLoading}
          className="w-full rounded-none"
        >
          {isPromptLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Run Prompt
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

function Output({
  promptResult,
  evaluateOutput,
  isEvaluating,
  streamedResult,
}: {
  promptResult: string;
  evaluateOutput: () => void;
  isEvaluating: boolean;
  streamedResult: AnalysisResult;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-medium">Output</Label>
        {!streamedResult?.analysis && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="group h-6 rounded-none text-xs"
              onClick={evaluateOutput}
              disabled={isEvaluating}
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-3 w-3 transition-all duration-150 ease-out group-hover:scale-110 group-hover:-rotate-12" />
                  Evaluate
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <motion.pre
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        className="group relative p-3 font-sans text-[11px] whitespace-pre-wrap shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
      >
        {promptResult}

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 hidden h-6 rounded-none text-xs group-hover:flex"
          onClick={() => {
            navigator.clipboard.writeText(promptResult);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="mr-1 h-3 w-3" />
        </Button>
      </motion.pre>
    </div>
  );
}

function AnalysisResults({
  streamedResult,
}: {
  streamedResult: AnalysisResult;
}) {
  return (
    <AnimatePresence>
      {streamedResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-6 space-y-1"
        >
          <Label className="text-[10px] font-medium">Evaluation</Label>
          <div className="space-y-4 p-2 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]">
            <div className="grid gap-3 lg:grid-cols-3">
              {[
                {
                  label: "Consistency",
                  value: streamedResult.analysis?.consistency ?? 0,
                },
                {
                  label: "Relevance",
                  value: streamedResult.analysis?.relevance ?? 0,
                },
                {
                  label: "Quality",
                  value: streamedResult.analysis?.quality ?? 0,
                },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-medium">{label}</span>
                    <span className="text-[8px] tabular-nums">{value}/100</span>
                  </div>
                  <Progress
                    value={value}
                    className={cn(
                      "h-1.5",
                      value < 30 && "[&>div]:bg-red-500",
                      value >= 30 && value < 70 && "[&>div]:bg-yellow-500",
                      value >= 70 && "[&>div]:bg-green-500",
                    )}
                  />
                </div>
              ))}
            </div>

            {streamedResult.analysis?.feedback && (
              <div
                className={cn(
                  "border p-3 text-[11px] leading-tight shadow-inner",
                  streamedResult.analysis.consistency < 30 &&
                    "bg-destructive/5 text-destructive border-destructive/10",
                  streamedResult.analysis.consistency >= 30 &&
                    streamedResult.analysis.consistency < 70 &&
                    "border-yellow-500/10 bg-yellow-500/5 text-yellow-500",
                  streamedResult.analysis.consistency >= 70 &&
                    "border-green-500/10 bg-green-500/5 text-green-700",
                )}
              >
                {streamedResult.analysis.feedback}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ImprovedExamplesData {
  examples: Array<{ input: string; output: string; explanation: string }>;
  reasoning: string;
}

function ImprovedExamples({
  form,
  improvedExamples,
  handleImproveExamples,
  isImprovingExamples,
}: {
  form: UseFormReturn<FormData>;
  improvedExamples: ImprovedExamplesData;
  handleImproveExamples: () => void;
  isImprovingExamples: boolean;
}) {
  return (
    <div className="mt-4 space-y-1">
      {!improvedExamples && (
        <div className="flex items-center justify-between px-2 py-3">
          <Label className="text-[10px] font-medium">
            Want better examples?
          </Label>
          <Button
            variant="outline"
            size="sm"
            className="group h-6 rounded-none text-xs"
            onClick={handleImproveExamples}
            disabled={isImprovingExamples}
          >
            {isImprovingExamples ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <Sparkles className="mr-1 h-3 w-3 transition-all duration-150 ease-out group-hover:scale-110 group-hover:-rotate-12" />
                Improve Examples
              </>
            )}
          </Button>
        </div>
      )}

      <AnimatePresence>
        {improvedExamples && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Label className="text-[10px] font-medium">Improve</Label>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-4 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]">
        {improvedExamples && (
          <ScrollArea className="relative h-[326px]">
            <>
              <ProgressiveBlur
                className="pointer-events-none absolute top-0 right-0 h-[30px] w-full"
                direction="top"
                blurIntensity={0.2}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 bottom-0 h-[30px] w-full"
                direction="bottom"
                blurIntensity={0.2}
              />
            </>

            <AnimatePresence>
              {improvedExamples && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="px-2 py-2">
                    <div className="mb-3 p-2 text-xs">
                      <p className="mb-2 text-[10px] font-medium">
                        Improvement Reasoning:
                      </p>
                      <p className="text-muted-foreground">
                        {improvedExamples.reasoning}
                      </p>
                    </div>

                    <div className="space-y-3 pr-4 pb-1 pl-1">
                      {improvedExamples.examples.map((example, index) => (
                        <Card
                          key={index}
                          className="space-y-2 rounded-none border-none p-3 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground/60 text-xs font-medium">
                              {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 rounded-none text-[10px]"
                              onClick={() => {
                                const newExamples = [
                                  ...form.getValues().examples,
                                ];
                                newExamples[index] = {
                                  input: example.input,
                                  output: example.output,
                                };
                                form.setValue("examples", newExamples);
                                toast.success("Example updated");
                              }}
                            >
                              <ArrowLeft className="mr-1 h-3 w-3" />
                              Use This Example
                            </Button>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="space-y-1">
                              <div className="text-muted-foreground/60 text-[8px]">
                                Input:
                              </div>
                              <pre className="bg-muted/50 p-2 font-sans text-xs whitespace-pre-wrap shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]">
                                {example.input}
                              </pre>
                            </div>
                            <div className="space-y-1">
                              <div className="text-muted-foreground/60 text-[8px]">
                                Output:
                              </div>
                              <pre className="bg-muted/50 p-2 font-sans text-xs whitespace-pre-wrap shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]">
                                {example.output}
                              </pre>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-col gap-[2px] text-xs">
                            <span className="text-muted-foreground/60 text-[8px] font-medium">
                              Why this example?{" "}
                            </span>
                            <span>{example.explanation}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        )}
        <AnimatePresence>
          {improvedExamples && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="-mt-3"
            >
              <Button
                variant="ghost"
                size="sm"
                className="-mt-3 w-full rounded-none shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                onClick={() => {
                  form.setValue(
                    "examples",
                    improvedExamples.examples.map(({ input, output }) => ({
                      input,
                      output,
                    })),
                  );
                  toast.success("All examples updated");
                }}
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Use All Examples
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function VercelIcon(props) {
  return (
    <svg
      viewBox="0 0 256 222"
      width="256"
      height="222"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <path fill="#000" d="m128 0 128 221.705H0z" />
    </svg>
  );
}

// Add this new component for displaying code snippets
function CodeSnippet({
  systemPrompt,
  examples,
  testInput,
  isGenerating,
}: FormData & { isGenerating: boolean }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse when generating
  useEffect(() => {
    if (isGenerating) {
      setIsExpanded(false);
    }
  }, [isGenerating]);

  const code = `import { openai } from "@ai-sdk/openai";
  import { generateText } from "ai";
  
  export async function generateResponse(input: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: ${JSON.stringify(systemPrompt)},
      messages: [
        ${examples
          .map(
            (ex) => `
        { role: "user", content: ${JSON.stringify(ex.input)} },
        { role: "assistant", content: ${JSON.stringify(ex.output)} },`,
          )
          .join("")}
        { role: "user", content: input },
      ],
    });
  
    return text;
  }`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
    >
      <motion.div
        className="flex items-center justify-between border-b p-1 pl-2"
        animate={{
          backgroundColor: isExpanded ? "transparent" : "hsl(var(--muted))",
          borderColor: isExpanded ? "hsl(var(--border))" : "transparent",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Label className="text-[10px] font-medium">AI SDK Code Snippet</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "h-6 px-2 transition-all duration-200",
              !isExpanded && "text-muted-foreground",
            )}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </Button>
        </div>
        <motion.button
          onClick={copyToClipboard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          layout
          className="group relative h-7 w-auto gap-1.5 rounded-none bg-white px-2 text-[10px] shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)] transition-shadow hover:bg-neutral-50 hover:shadow-[0px_2px_3px_-1px_rgba(0,_0,_0,_0.1),_0px_1px_0px_0px_rgba(25,_28,_33,_0.02),_0px_0px_0px_1px_rgba(25,_28,_33,_0.08)]"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,

                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                    delay: 0.1,
                  }}
                >
                  <Check className="h-3 w-3 text-green-500" />
                </motion.div>
                <span className="font-medium text-green-500">Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,

                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1.5 text-neutral-600"
              >
                <motion.div
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <Copy className="h-3 w-3 transition-all duration-150 ease-out group-hover:scale-110 group-hover:-rotate-12" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : "0px",
          opacity: isExpanded ? 1 : 0.7,
          scale: isExpanded ? 1 : 0.98,
        }}
        transition={{
          height: {
            duration: 0.3,
            ease: [0.32, 0.72, 0, 1],
          },
          opacity: {
            duration: 0.2,
          },
          scale: {
            duration: 0.2,
          },
        }}
        className="overflow-hidden"
      >
        <div className="overflow-x-auto rounded-b-lg px-3 py-3">
          <CodePreview
            code={code}
            className="text-xs leading-relaxed [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Add completion check function
function isFieldComplete(value: any): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) {
    return (
      value.length > 0 &&
      value.every((item) =>
        Object.values(item).every(
          (val) => typeof val === "string" && val.trim().length > 0,
        ),
      )
    );
  }
  return false;
}

// Add animated checkmark badge component
function CompleteBadge({ isComplete }: { isComplete: boolean }) {
  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="ml-2 inline-flex"
        >
          <Badge
            variant="secondary"
            className="flex h-3 w-3 items-center justify-center border-none bg-white p-0 text-blue-600 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
          >
            <Check className="h-2 w-2" />
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
