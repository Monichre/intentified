"use client";

import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef } from "react";

const paths = [
  "M0 100H55.022C61.8914 100 68.6451 101.769 74.6324 105.137L120.368 130.863C126.355 134.231 133.109 136 139.978 136H201.5",
  "M0 60H48.2171C59.2463 60 69.7861 64.5539 77.3451 72.5854L117.655 115.415C125.214 123.446 135.754 128 146.783 128H201.5",
  "M0 188H55.022C61.8914 188 68.6451 186.231 74.6324 182.863L120.368 157.137C126.355 153.769 133.109 152 139.978 152H201.5",
  "M0 228H48.2171C59.2463 228 69.7861 223.446 77.3451 215.415L117.655 172.585C125.214 164.554 135.754 160 146.783 160H201.5",
  "M0 287H41.7852C56.4929 287 70.0142 278.929 76.994 265.983L118.49 189.017C125.47 176.071 138.991 168 153.699 168H202",
  "M0 144L201 145",
  "M0 1H41.5946C56.3171 1 69.8495 9.08744 76.823 22.0537L118.177 98.9463C125.15 111.913 138.683 120 153.405 120H201.5",
];

export const DataFeedingIn = () => {
  const svgRef = useRef<any>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const pulseGradients = Array.from(
      svgRef.current.querySelectorAll("[id*=pulse]"),
    );

    const animate = async () => {
      pulseGradients.forEach((gradient, i) => {
        controls.start({
          x1: ["-50%", "100%"],
          x2: ["50%", "150%"],
          transition: {
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
            delay: 0.25,
          },
        });
      });
    };

    animate();
  }, [controls]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="translate-x-10 rotate-90"
        style={{ height: 80, transformOrigin: "right" }}
      >
        <svg
          width="202"
          className="ml-auto"
          viewBox="0 0 202 288"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
        >
          {paths.map((d, index) => (
            <React.Fragment key={index}>
              <path
                d={d}
                stroke="white"
                mask="url(#mask)"
                strokeLinecap="round"
                strokeOpacity="0.2"
                strokeWidth="2"
                strokeDasharray="0.1 3"
              />
              <path
                d={d}
                stroke={`url(#pulse-${index})`}
                strokeLinecap="round"
                strokeOpacity="1"
                strokeWidth="2"
                strokeDasharray="0.1 3"
                mask="url(#mask)"
              />
            </React.Fragment>
          ))}

          <defs>
            <linearGradient
              id="maskGrad"
              x1="202"
              y1="227"
              x2="32"
              y2="227"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <mask id="mask" maskUnits="userSpaceOnUse">
              <rect width="202" height="288" fill="url(#maskGrad)" />
            </mask>

            {Array.from({ length: 7 }).map((_, index) => (
              <motion.linearGradient
                key={index}
                id={`pulse-${index}`}
                x1="-100%"
                y1="0"
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
                animate={controls}
              >
                <stop offset="0.35" stopColor="#716FFF" stopOpacity="0" />
                <stop offset="0.45" stopColor="#716FFF" />
                <stop offset="0.55" stopColor="#716FFF" />
                <stop offset="0.65" stopColor="#716FFF" stopOpacity="0" />
              </motion.linearGradient>
            ))}
          </defs>
        </svg>
      </div>

      <div
        className="h-[260px] w-[400px] overflow-hidden rounded-[14px]"
        style={{
          background:
            "linear-gradient(rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        <div className="flex gap-2 border-b border-white/10 p-[10px]">
          <div className="h-2 w-2 rounded-full bg-white/10" />
          <div className="h-2 w-2 rounded-full bg-white/10" />
          <div className="h-2 w-2 rounded-full bg-white/10" />
        </div>
        <div className="p-0">
          <div className="flex w-full overflow-hidden">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="flex h-10 w-[180px] flex-shrink-0 items-center gap-2 border-t border-r border-b border-white/10 px-2"
              >
                <div className="h-4 w-4 rounded border-2 border-white/10 bg-white/15" />
                <div className="h-2 w-22 rounded bg-white/10" />
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="flex w-full overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                ease: "easeIn",
                delay: 1.25 + i * 1.5,
                duration: 0.3,
              }}
            >
              {Array.from({ length: 3 }, (_, j) => (
                <div
                  key={i + j}
                  className="flex h-9 w-[180px] flex-shrink-0 items-center gap-2 border-r border-b border-white/10 px-2"
                >
                  <div className="h-2 w-22 rounded bg-white/10" />
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
