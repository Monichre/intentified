"use client";

import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormState } from "react";



import {
  CollectionPeriod,
  CoreVitalsAssessment,
  SEOData,
  WebVitals,
} from "../lib/types";
import { combinedUrlActions } from "@/features/pipelines/seo-digital-processing/lib/actions"
import { evaluateAll } from "@/features/pipelines/seo-digital-processing/lib/seo"
import { AnalyzeWithAISection } from "@/features/pipelines/seo-digital-processing/sections/analyze-with-ai"
import { OgImageSection, OgInfoFacts } from "@/features/pipelines/seo-digital-processing/sections/og-images"
import { SEOScoreSection } from "@/features/pipelines/seo-digital-processing/sections/seo-score"
import { WebVitalsSection } from "@/features/pipelines/seo-digital-processing/sections/web-vitals"
import WebsiteFormSection from "@/features/pipelines/seo-digital-processing/sections/website-form"

interface ScrapeFormState {
  allSeoData: SEOData[];
  rawWebVitals: {
    record: {
      key: {
        url: string;
      };
      metrics: WebVitals;
      collectionPeriod: CollectionPeriod;
    };
  } | null;
  coreVitalsAssessment: CoreVitalsAssessment | null;
}

// Define the initial state with types
const initialState: ScrapeFormState = {
  allSeoData: [],
  rawWebVitals: null,
  coreVitalsAssessment: null,
};

export default function SectionLayout() {
  const [state, formAction] = useFormState(combinedUrlActions, initialState);
  const [showBadge, setShowBadge] = useState(false);

  const seoFeedback =
    state?.allSeoData.length > 0 ? evaluateAll(state?.allSeoData) : null;
  const ogData =
    state?.allSeoData.length > 0 ? state?.allSeoData[0].openGraph : null;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBadge(true);
      } else {
        setShowBadge(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className=" flex flex-col w-full h-full items-center justify-center overflow-hidden">
      <header className="top-1 absolute">
        <div className="flex items-start justify-start w-full pt-3 text-base-200">
          
          <h1 className="text-xl">Intentified Data Platform SEO Audit</h1>
        </div>
      </header>

      {/* Landing Page View */}
      {state?.allSeoData < 1 ? (
        <Suspense>
          <WebsiteFormSection state={state} formAction={formAction} />
        </Suspense>
      ) : null}

      {/* Results View */}
      {state?.allSeoData.length >= 1 && (
        <div className="pt-12 md:pt-12 dark">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, type: "spring" },
            }}
            className="max-w-5xl"
          >
            <SEOScoreSection seoFeedback={seoFeedback} />

            {state?.rawWebVitals && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, type: "spring" },
                }}
                className="flex flex-row p-2 gap-2"
              >
                <WebVitalsSection vitals={state.rawWebVitals} />
              </motion.div>
            )}

            <div className="mx-auto p-2 gap-4 grid grid-cols-6">
              <div className="col-span-6 md:col-span-4">
                <OgImageSection ogData={ogData} />
              </div>
              <div className="col-span-6 md:col-span-2">
                <OgInfoFacts />
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col items-center mx-auto pb-3">
            <AnalyzeWithAISection seoData={state} />
          </div>

          <AnimatePresence>
            {showBadge && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed top-1 left-16 md:top-auto md:bottom-2 md:left-12"
              >
                <NewCultBadge />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="absolute inset-0 -z-10 overflow-hidden w-full h-full ">
        <AnimatePresence>
          {state?.allSeoData < 1 ? (
            <motion.div
              initial={{ opacity: 0, scale: 1.9, y: 50 }}
              exit={{ opacity: 0, scale: 1, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 3.3, type: "spring", bounce: 0 }}
              className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_20%,#0A0A0A_35%,#2979FF_50%,#FF80AB_60%,#FF6D00_70%,#FFD600_80%,#00E676_90%,#3D5AFE_100%)] "
            ></motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
