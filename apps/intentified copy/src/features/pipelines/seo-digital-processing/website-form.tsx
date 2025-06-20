"use client";

import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState, useRef, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { CultInput } from "@repo/design-system/components/ui/input";
import { Button, LoadingButton } from "@repo/design-system/components/ui/button";

const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
const formDataSchema = z.object({
  url: z.string().regex(urlPattern, { message: "Please enter a valid URL." }),
});

interface WebsiteFormSectionProps {
  formAction: (formData: FormData) => void | Promise<void>;
  state?: {
    rawWebVitals?: any;
    allSeoData?: any[];
    coreVitalsAssessment?: any;
  };
}

export default function WebsiteFormSection({ formAction, state }: WebsiteFormSectionProps) {
  const [stage, setStage] = useState<"idle" | "loading" | "error">("idle");
  const [urlInput, setUrlInput] = useState("https://");
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserHasInteracted(true);
    let inputVal = event.target.value.trim();

    // Ensure the input always starts with 'https://'
    if (!inputVal.startsWith("https://")) {
      inputVal = "https://";
    }

    // Disallow typing before 'https://'
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart!;
      if (cursorPosition < 8) {
        inputRef.current.setSelectionRange(8, 8);
      }
    }

    setUrlInput(inputVal);

    if (stage !== "idle" && result.success) {
      setStage("idle");
    }
  };

  const result = useMemo(() => {
    return userHasInteracted
      ? formDataSchema.safeParse({ url: urlInput })
      : { success: true };
  }, [urlInput, userHasInteracted]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(8, 8);
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center mx-auto  overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 900 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { type: "spring", bounce: 0 },
        }}
        className="w-full rounded-t-[50px] md:rounded-t-[102px] md:rounded-b-[102px] h-full my-24 flex flex-col items-center justify-center  dark"
      >
        <AnimatePresence>
          {!state?.rawWebVitals || stage === "idle" ? (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
              exit={{
                opacity: 0,
                y: 30,
                transition: { delay: 0.2, duration: 0.2 },
              }}
              action={formAction}
              className="px-2 flex flex-col items-center h-48"
            >
              <div className="pb-4 px-2 w-full h-full">
                <Label className="text-base-300" htmlFor="url">
                  Your website
                </Label>
                <CultInput
                  value={urlInput}
                  onChange={handleInputChange}
                  type="text"
                  id="url"
                  name="url"
                  required
                  hasIcon
                  placeholder="https://example.com"
                  ref={inputRef}
                />
                {result.success === false && urlInput.length > 9 && (
                  <p className="text-red-500 text-sm mt-1">
                    must use valid url
                  </p>
                )}

                <div className="flex flex-col items-center w-full mt-6">
                  <AnimatePresence>
                    {urlInput.length > 9 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="flex justify-center w-full"
                      >
                        <LoadingButton
                          type="submit"
                          disabled={!result.success}
                          status={result.success !== false ? stage : "error"}
                          onClick={() => {
                            if (result.success === false) {
                              console.log("hit");
                              router.push("/");
                              setStage("error");
                            }
                            if (
                              stage === "idle" &&
                              status !== "invalid_url" &&
                              result.success
                            ) {
                              setStage("loading");
                            }
                          }}
                        >
                          Get Started
                        </LoadingButton>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div
              layoutId="result-data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, y: 10 }}
              className="my-4 z-20"
            >
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setStage("idle")}
              >
                Start over
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function WebsiteFormSection2({ formAction, state }: WebsiteFormSectionProps) {
  const [stage, setStage] = useState<"idle" | "loading" | "error">("idle");
  const [urlInput, setUrlInput] = useState("https://");
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserHasInteracted(true);
    let inputVal = event.target.value.trim();

    // Ensure the input always starts with 'https://'
    if (!inputVal.startsWith("https://")) {
      inputVal = "https://";
    }

    // Disallow typing before 'https://'
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart!;
      if (cursorPosition < 8) {
        inputRef.current.setSelectionRange(8, 8);
      }
    }

    setUrlInput(inputVal);

    if (stage !== "idle" && result.success) {
      setStage("idle");
    }
  };

  const result = useMemo(() => {
    return userHasInteracted
      ? formDataSchema.safeParse({ url: urlInput })
      : { success: true };
  }, [urlInput, userHasInteracted]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(8, 8);
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center mx-auto dark overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 900 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { type: "spring", bounce: 0 },
        }}
        className="w-full rounded-t-[50px] mt-48 md:rounded-t-[196px] md:mt-24  h-full flex flex-col items-center justify-center bg-base-900 dark"
      >
        <AnimatePresence>
          {!state?.rawWebVitals || stage === "idle" ? (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
              exit={{
                opacity: 0,
                y: 30,
                transition: { delay: 0.2, duration: 0.2 },
              }}
              action={formAction}
              className="px-2 "
            >
              <div className="pb-4 px-2">
                <Label className="text-base-300" htmlFor="url">
                  Your website
                </Label>
                <CultInput
                  value={urlInput}
                  onChange={handleInputChange}
                  type="text"
                  id="url"
                  name="url"
                  required
                  hasIcon
                  placeholder="https://example.com"
                  ref={inputRef}
                />
                {result.success === false && urlInput.length > 9 && (
                  <p className="text-red-500 text-sm mt-1">
                    must use valid url
                  </p>
                )}
              </div>
              <AnimatePresence>
                {urlInput.length > 9 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className=" flex justify-center absolute bottom-48 sm:bottom-72 md:bottom-1/4 left-0 right-0"
                  >
                    <LoadingButton
                      type="submit"
                      disabled={!result.success}
                      status={result.success !== false ? stage : "error"}
                      onClick={() => {
                        if (result.success === false) {
                          console.log("hit");
                          router.push("/");
                          setStage("error");
                        }
                        if (
                          stage === "idle" &&
                          status !== "invalid_url" &&
                          result.success
                        ) {
                          setStage("loading");
                        }
                      }}
                    >
                      Get Started
                    </LoadingButton>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.form>
          ) : (
            <motion.div
              layoutId="result-data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, y: 10 }}
              className="my-4 z-20"
            >
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setStage("idle")}
              >
                Start over
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// // OLD FORM
// export function Scrape({ formAction, state }) {
//     const [stage, setStage] = useState("scrape"); // Added to manage different stages
//     //   const seoCard = new SEOScoreCard(scraperPayload, seoRules);

//     return (
//       // <div className="w-full h-full flex flex-col items-center justify-center mx-auto">
//       <div className="w-full h-[400px] flex flex-col items-center justify-center mx-auto">
//         <AnimatePresence>
//           {!state?.rawWebVitals ? (
//             <motion.form
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{
//                 opacity: 0,
//                 y: 30,
//                 transition: { delay: 0.2, duration: 0.2 },
//               }}
//               layout
//               action={formAction}
//             >
//               <Label htmlFor="url">URL</Label>
//               <Input
//                 type="text"
//                 id="url"
//                 name="url"
//                 required
//                 className="input-style"
//               />{" "}
//               {/* Ensure you define this className in your styles */}
//               <p aria-live="polite">
//                 {state?.allSeoData ? state?.allSeoData.title : "No data"}
//               </p>
//               <motion.div
//                 layoutId={stage === "scrape" ? "start-button" : "review-button"}
//                 transition={{ type: "spring", duration: 0.3 }}
//               >
//                 <Button
//                   variant="outline"
//                   className="mt-2"
//                   onClick={() => setStage("review-results")}
//                 >
//                   {stage === "scrape" ? "Scrape" : "Review Results"}
//                   Get started
//                 </Button>
//               </motion.div>
//             </motion.form>
//           ) : (
//             <motion.div
//               layoutId="result-data"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
//               exit={{ opacity: 0, y: 10 }}
//               className="my-4 z-20"
//             >
//               <WebVitalsData
//                 webVitalsData={{
//                   ...state.rawWebVitals,
//                   ...state.coreVitalsAssessment,
//                 }}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {state?.rawWebVitals && (
//             <motion.div
//               layoutId="start-button"
//               transition={{
//                 type: "spring",
//                 bounce: 0.4,
//                 delay: 0.5,
//                 duration: 0.2,
//               }}
//             >
//               {/* <Button onClick={() => setStage("scrape")}>Analyze SEO</Button> */}
//               {/* <AnalyzeWebVitalsButton rawWebVitals={state.rawWebVitals} /> */}
//               <AnalyzeSEOButton seoData={state.allSeoData} />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {state && state.allSeoData?.length >= 1 ? (
//             <motion.div
//             // transition={{
//             //   type: "spring",
//             //   bounce: 0.4,
//             //   delay: 0.5,
//             //   duration: 0.2,
//             // }}
//             >
//               {/* <Button onClick={() => setStage("scrape")}>Analyze SEO</Button> */}
//               {/* <AnalyzeWebVitalsButton rawWebVitals={state.rawWebVitals} /> */}
//               <OgCardReport
//                 ogData={state.allSeoData[0]?.openGraph}
//                 twitterData={state.allSeoData[0]?.twitterCard}
//               />
//             </motion.div>
//           ) : null}
//         </AnimatePresence>
//       </div>
//     );
//   }

// const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
// const formDataSchema = z.object({
//   url: z.string().regex(urlPattern, { message: "Invalid URL" }),
// });

// export function ScrapeForm({ formAction, state }: any) {
//   const [stage, setStage] = useState<"idle" | "loading" | "error">("idle"); // Added to manage different stages
//   const [urlInput, setUrlInput] = useState("https://");

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const status = searchParams.get("status");

//   const textVariants = {
//     initial: { opacity: 0, scale: 1, y: 180 },
//     animate: {
//       opacity: 1,
//       y: 101,
//       scale: 1,
//       transition: { delay: 1, duration: 1.5, ease: "easeOut" },
//     },
//   };

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const trimmed = convertToHttps(event.target.value).trim();
//     setUrlInput(convertToHttps(trimmed));
//     if (stage !== "idle" && result.success === true) {
//       setStage("idle");
//     }
//   };

//   const result = useMemo(
//     () => formDataSchema.safeParse({ url: urlInput }),
//     [urlInput]
//   );

//   console.log(result.success);

//   return (
//     // TODO: polish
//     <div className="w-full  h-screen flex flex-col items-center justify-center mx-auto  dark overflow-hidden">
//       {/* <motion.h1
//         variants={textVariants}
//         initial="initial"
//         animate="animate"
//         // className="mix-blend-color-dodge text-base-400 text-5xl" // Ensure your text color and size are set appropriately
//         // className="font-thin mix-blend-color-burn text-base-400 text-5xl" // Ensure your text color and size are set appropriately
//         className="mix-blend-multiply text-base-400 text-5xl" // Ensure your text color and size are set appropriately
//       >
//         <span className="   ">seoClean.com</span>
//       </motion.h1> */}
//       <motion.div
//         initial={{ opacity: 0, y: 900 }}
//         animate={{
//           opacity: 1,
//           y: 0,
//           transition: { type: "spring", bounce: 0 },
//         }}
//         className="w-full rounded-t-[50px] mt-48 md:rounded-t-[196px] md:mt-24  h-full flex flex-col items-center justify-center  bg-base-900 dark"
//       >
//         <AnimatePresence>
//           {!state?.rawWebVitals || stage === "idle" ? (
//             <motion.form
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
//               exit={{
//                 opacity: 0,
//                 y: 30,
//                 transition: { delay: 0.2, duration: 0.2 },
//               }}
//               layout
//               action={formAction}
//               className="px-2"
//             >
//               <Label className="text-base-300" htmlFor="url">
//                 Your website
//               </Label>

//               <CultInput
//                 value={urlInput}
//                 // onChange={(e) => {
//                 //   const input = convertToHttps(e.target.value);
//                 //   setUrlInput(input);
//                 // }}
//                 onChange={handleInputChange}
//                 type="text"
//                 id="url"
//                 name="url"
//                 required
//                 hasIcon
//               />

//               <motion.div
//                 layoutId={stage === "idle" ? "start-button" : "review-button"}
//                 transition={{ type: "spring", duration: 0.3 }}
//                 className="mt-8"
//               >
//                 <LoadingButton
//                   type="submit"
//                   disabled={!result.success}
//                   status={
//                     result.success === false && urlInput.length >= 8
//                       ? "error"
//                       : stage
//                   }
//                   onClick={() => {
//                     if (result.success === false) {
//                       console.log("hit");
//                       router.push("/");
//                       setStage("error");
//                     }
//                     if (
//                       stage === "idle" &&
//                       status !== "invalid_url" &&
//                       result.success
//                     ) {
//                       setStage("loading");
//                     }
//                   }}
//                 >
//                   Get Started
//                 </LoadingButton>
//               </motion.div>
//             </motion.form>
//           ) : (
//             <motion.div
//               layoutId="result-data"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
//               exit={{ opacity: 0, y: 10 }}
//               className="my-4 z-20"
//             >
//               <Button
//                 variant="outline"
//                 className="mt-2"
//                 onClick={() => setStage("idle")}
//               >
//                 Start over
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// }
