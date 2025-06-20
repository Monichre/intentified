"use client";

import { BrainCircuit, LightbulbIcon, Satellite } from "lucide-react";
import { motion } from "motion/react";

const easeCirc = (e: number) => (1 === e ? 1 : 1 - Math.pow(2, -10 * e));

export interface CloudSyncingProps {
  actionText?: string;
}

export const CloudSyncing = (props: CloudSyncingProps) => {
  return (
    <div className="px-15 py-20">
      <div className="flex items-center justify-between gap-6">
        {/* Step 1: Cloud */}
        <motion.div
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.25, ease: easeCirc, delay: 0.15 }}
          className="relative"
        >
          <div className="relative z-20 flex h-[46px] w-[46px] items-center justify-center rounded-lg bg-white shadow-[rgba(29,29,32,0.04)_0px_0px_0px_1px,rgba(99,102,241,0.1)_0px_0px_0px_5px,0_1px_3px_0_rgba(79,70,229,.25),0_1px_2px_-1px_rgba(79,70,229,.25)]">
            <Satellite className="text-indigo-500" />
          </div>
          <motion.div
            style={{ x: "-50%", y: "-50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              delay: 0.5,
              duration: 3,
              ease: easeCirc,
              times: [0, 0.3, 1],
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 aspect-square w-20 rounded-full border-2 border-indigo-100"
          />
        </motion.div>

        {/* Connection 1: Cloud to Server */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: easeCirc }}
          className="relative flex-1 py-4"
          style={{
            maskImage:
              "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)",
          }}
        >
          <div
            className="absolute top-1/2 right-0 left-0 h-0.5 rounded-full bg-neutral-200"
            style={{ transform: "translateY(-50%)" }}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              ease: "easeInOut",
              duration: 2,
              delay: 0.5,
            }}
            className="absolute inset-0"
          >
            <div
              className="flex h-full items-center"
              style={{
                maskImage: "linear-gradient(90deg,transparent,#000)",
                paddingRight: "12px",
                width: "33.3333%",
              }}
            >
              <div className="relative h-0.5 w-full rounded-full bg-indigo-500 shadow-[rgba(99,102,241,0.15)_0px_0px_8px_2px]" />
              <div className="ml-[-4px] h-1 w-1 rounded-full bg-indigo-500 shadow-[rgba(99,102,241,0.4)_0px_0px_8px_2px]" />
            </div>
          </motion.div>
        </motion.div>

        {/* Step 2: Server Processing */}
        <motion.div
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.25, ease: easeCirc, delay: 0.35 }}
          className="relative"
        >
          <div className="relative z-20 flex h-[46px] w-[46px] items-center justify-center rounded-lg bg-white shadow-[rgba(29,29,32,0.04)_0px_0px_0px_1px,rgba(34,197,94,0.1)_0px_0px_0px_5px,0_1px_3px_0_rgba(34,197,94,.25),0_1px_2px_-1px_rgba(34,197,94,.25)]">
            <BrainCircuit className="text-green-500" />
          </div>
          <motion.div
            style={{ x: "-50%", y: "-50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              delay: 1.5,
              duration: 3,
              ease: easeCirc,
              times: [0, 0.3, 1],
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 aspect-square w-20 rounded-full border-2 border-green-100"
          />
        </motion.div>

        {/* Connection 2: Server to Database */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease: easeCirc }}
          className="relative flex-1 py-4"
          style={{
            maskImage:
              "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)",
          }}
        >
          <div
            className="absolute top-1/2 right-0 left-0 h-0.5 rounded-full bg-neutral-200"
            style={{ transform: "translateY(-50%)" }}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              ease: "easeInOut",
              duration: 2,
              delay: 1.5,
            }}
            className="absolute inset-0"
          >
            <div
              className="flex h-full items-center"
              style={{
                maskImage: "linear-gradient(90deg,transparent,#000)",
                paddingRight: "12px",
                width: "33.3333%",
              }}
            >
              <div className="relative h-0.5 w-full rounded-full bg-green-500 shadow-[rgba(34,197,94,0.15)_0px_0px_8px_2px]" />
              <div className="ml-[-4px] h-1 w-1 rounded-full bg-green-500 shadow-[rgba(34,197,94,0.4)_0px_0px_8px_2px]" />
            </div>
          </motion.div>
        </motion.div>

        {/* Step 3: Database Storage */}
        <motion.div
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.25, ease: easeCirc, delay: 0.55 }}
          className="relative"
        >
          <div className="relative z-20 flex h-[46px] w-[46px] items-center justify-center rounded-lg bg-white shadow-[rgba(29,29,32,0.04)_0px_0px_0px_1px,rgba(168,85,247,0.1)_0px_0px_0px_5px,0_1px_3px_0_rgba(168,85,247,.25),0_1px_2px_-1px_rgba(168,85,247,.25)]">
            <LightbulbIcon className="text-purple-500" />
          </div>
          <motion.div
            style={{ x: "-50%", y: "-50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              delay: 2.5,
              duration: 3,
              ease: easeCirc,
              times: [0, 0.3, 1],
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 aspect-square w-20 rounded-full border-2 border-purple-100"
          />
        </motion.div>

        {/* Status Badge */}
        {/* <motion.div
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.25, ease: easeCirc, delay: 0.75 }}
        >
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-neutral-900 shadow-[rgba(29,29,32,0.08)_0px_0px_0px_1px,0_4px_6px_-1px_rgba(0,0,0,.1),0_2px_4px_-2px_rgba(0,0,0,.1)]">
            Automated Pipeline
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex rounded-full bg-neutral-900 p-[3px]"
            >
              <CircleIcon />
            </motion.div>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

const CircleIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="10" height="10"></rect>
    <circle
      cx="5"
      cy="5"
      r="4.25"
      stroke="white"
      strokeOpacity="0.2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></circle>
    <path
      d="M5 0.75C7.34721 0.75 9.25 2.65279 9.25 5C9.25 7.34721 7.34721 9.25 5 9.25C3.82904 9.25 2.76868 8.77644 2 8.0104"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

const CloudIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 12C0 14.7614 2.23858 17 5 17H15C17.7614 17 20 14.7614 20 12C20 9.23858 17.7614 7 15 7C15 4.23858 12.7614 2 10 2C7.23858 2 5 4.23858 5 7C2.23858 7 0 9.23858 0 12Z"
      fill="#716FFF"
    />
    <path
      d="M14.5 7V7.5H15C17.4853 7.5 19.5 9.51472 19.5 12C19.5 14.4853 17.4853 16.5 15 16.5H5C2.51472 16.5 0.5 14.4853 0.5 12C0.5 9.51472 2.51472 7.5 5 7.5H5.5V7C5.5 4.51472 7.51472 2.5 10 2.5C12.4853 2.5 14.5 4.51472 14.5 7Z"
      stroke="black"
      strokeOpacity="0.2"
    />
  </svg>
);

const ServerIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="3"
      width="16"
      height="4"
      rx="1"
      fill="#22C55E"
      stroke="black"
      strokeOpacity="0.2"
    />
    <rect
      x="2"
      y="8"
      width="16"
      height="4"
      rx="1"
      fill="#22C55E"
      stroke="black"
      strokeOpacity="0.2"
    />
    <rect
      x="2"
      y="13"
      width="16"
      height="4"
      rx="1"
      fill="#22C55E"
      stroke="black"
      strokeOpacity="0.2"
    />
    <circle cx="15" cy="5" r="1" fill="white" />
    <circle cx="15" cy="10" r="1" fill="white" />
    <circle cx="15" cy="15" r="1" fill="white" />
  </svg>
);

const DatabaseIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="10"
      cy="4"
      rx="7"
      ry="2"
      fill="#A855F7"
      stroke="black"
      strokeOpacity="0.2"
    />
    <path
      d="M3 4V16C3 17.1046 6.13401 18 10 18C13.866 18 17 17.1046 17 16V4"
      stroke="black"
      strokeOpacity="0.2"
      fill="#A855F7"
    />
    <ellipse
      cx="10"
      cy="10"
      rx="7"
      ry="2"
      fill="#A855F7"
      stroke="black"
      strokeOpacity="0.2"
    />
    <ellipse
      cx="10"
      cy="16"
      rx="7"
      ry="2"
      fill="#A855F7"
      stroke="black"
      strokeOpacity="0.2"
    />
  </svg>
);
