'use client'
import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationProps {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = ({ 
  threshold = 0.1, 
  rootMargin = "0px" 
}: UseScrollAnimationProps = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const current = elementRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(current);

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold, rootMargin, hasAnimated]);

  return { elementRef, isInView, hasAnimated };
};

export const useScrollAnimationMultiple = ({ 
  threshold = 0.1, 
  rootMargin = "0px" 
}: UseScrollAnimationProps = {}) => {
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const elementRefs = useRef<(HTMLElement | null)[]>([]);

  const createRef = (index: number) => (el: HTMLElement | null) => {
    elementRefs.current[index] = el;
  };

  useEffect(() => {
    const elements = elementRefs.current.filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = elements.indexOf(entry.target as HTMLElement);
          if (entry.isIntersecting && index !== -1) {
            setVisibleElements(prev => new Set(prev).add(index));
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    elements.forEach(element => observer.observe(element));

    return () => {
      elements.forEach(element => observer.unobserve(element));
    };
  }, [threshold, rootMargin]);

  return { createRef, visibleElements };
}; 