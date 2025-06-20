import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  activeIndices?: number[] | null;
  full?: boolean;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CustomCSSProperties extends CSSProperties {
  "--border-color"?: string;
  "--glow-color"?: string;
}

function TrueFocus({
  sentence,
  manualMode = false,
  blurAmount = 0,
  borderColor = "turquoise",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  activeIndices = null,
  full = false,
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sentenceRef = useRef<HTMLDivElement>(null);
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Determine the actual word index to focus on
  const getCurrentWordIndex = () => {
    if (full) return -1; // No individual word focus in full mode

    if (activeIndices && activeIndices.length > 0) {
      // Cycle through the activeIndices
      return activeIndices[currentSequenceIndex % activeIndices.length];
    }
    // Cycle through all words
    return currentSequenceIndex % words.length;
  };

  useEffect(() => {
    // Always set up the interval for animation
    let interval: NodeJS.Timeout | null = null;

    if (!manualMode && !full) {
      interval = setInterval(
        () => {
          setCurrentSequenceIndex((prev) => prev + 1);
        },
        (animationDuration + pauseBetweenAnimations) * 1000,
      );
    }

    // Calculate focus rectangle
    if (containerRef.current) {
      const parentRect = containerRef.current.getBoundingClientRect();

      if (full && sentenceRef.current) {
        // In full mode, wrap the entire sentence
        const sentenceRect = sentenceRef.current.getBoundingClientRect();
        setFocusRect({
          x: sentenceRect.left - parentRect.left,
          y: sentenceRect.top - parentRect.top,
          width: sentenceRect.width,
          height: sentenceRect.height,
        });
      } else {
        // Normal mode: focus on individual words
        const currentWordIndex = getCurrentWordIndex();

        if (
          currentWordIndex !== null &&
          currentWordIndex !== -1 &&
          currentWordIndex < words.length &&
          wordRefs.current[currentWordIndex]
        ) {
          const activeRect =
            wordRefs.current[currentWordIndex]!.getBoundingClientRect();

          setFocusRect({
            x: activeRect.left - parentRect.left,
            y: activeRect.top - parentRect.top,
            width: activeRect.width,
            height: activeRect.height,
          });
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // Dependencies: re-run when these change
  }, [
    manualMode,
    animationDuration,
    pauseBetweenAnimations,
    words.length,
    activeIndices,
    currentSequenceIndex,
    full,
  ]);

  // const handleMouseEnter = (index) => {
  //   if (manualMode && !activeIndices) {
  //     setLastActiveIndex(index);
  //     setCurrentIndex(index);
  //   }
  // };

  // const handleMouseLeave = () => {
  //   if (manualMode && !activeIndices) {
  //     setCurrentIndex(lastActiveIndex);
  //   }
  // };

  return (
    <div
      className="relative flex flex-wrap items-center justify-center gap-4"
      ref={containerRef}
    >
      <div
        ref={sentenceRef}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {words.map((word, index) => {
          const currentWordIndex = getCurrentWordIndex();
          const isActive = full || index === currentWordIndex;

          return (
            <span
              key={index}
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              className="relative cursor-pointer text-[3rem]"
              style={
                {
                  filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
                  "--border-color": borderColor,
                  "--glow-color": glowColor,
                  transition: `filter ${animationDuration}s ease`,
                } as CustomCSSProperties
              }
              // onMouseEnter={() => handleMouseEnter(index)}
              // onMouseLeave={handleMouseLeave}
            >
              {word}
            </span>
          );
        })}
      </div>

      <motion.div
        className="pointer-events-none absolute top-0 left-0 box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: 1,
        }}
        transition={{
          duration: animationDuration,
        }}
        style={
          {
            "--border-color": borderColor,
            "--glow-color": glowColor,
          } as CustomCSSProperties
        }
      >
        <span
          className="absolute top-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-r-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
        <span
          className="absolute top-[-10px] right-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-b-0 border-l-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
        <span
          className="absolute bottom-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-r-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
        <span
          className="absolute right-[-10px] bottom-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-l-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        ></span>
      </motion.div>
    </div>
  );
}

export { TrueFocus };
