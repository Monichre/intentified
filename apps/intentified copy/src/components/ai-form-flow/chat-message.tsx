"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  content: string | React.ReactNode;
  type: "system" | "user" | "input";
  isTyping?: boolean;
  animate?: boolean;
  className?: string;
}

export function ChatMessage({
  content,
  type = "system",
  isTyping = false,
  animate = true,
  className = "",
}: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<string>("");

  // Store the original content
  useEffect(() => {
    if (typeof content === "string") {
      contentRef.current = content;
    }
  }, [content]);

  // Typing animation
  useEffect(() => {
    if (
      type === "system" &&
      typeof content === "string" &&
      !isTyping &&
      animate
    ) {
      // Reset state
      setDisplayedContent("");
      setIsComplete(false);

      // Ensure we use the full content string
      const fullContent = contentRef.current || content;
      let index = 0;

      // Clear any existing interval
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }

      // Typing animation
      const typingInterval = setInterval(() => {
        if (index < fullContent.length) {
          setDisplayedContent((prev) => prev + fullContent.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
        }
      }, 15);

      typingRef.current = typingInterval;

      return () => {
        clearInterval(typingInterval);
      };
    } else if (!animate && typeof content === "string") {
      // If not animating, show full content immediately
      setDisplayedContent(content);
      setIsComplete(true);
    }
  }, [content, type, isTyping, animate]);

  return (
    <div className="relative mb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`w-full ${type === "user" ? "flex justify-end" : ""} ${className}`}
      >
        <div
          className={` ${type === "system" && "message-system"} ${type === "user" && "message-user"} ${type === "input" && "w-full max-w-full"} `}
        >
          {typeof content === "string" && type === "system" ? (
            <div>
              {animate ? displayedContent : content}
              {animate && !isComplete && (
                <span className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-green-300" />
              )}
            </div>
          ) : (
            <div>{content}</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
