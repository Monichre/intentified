"use client";

import { useMemo, useState } from "react";
import useMeasure from "react-use-measure";
import { Globe, Star, TrendingUp } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TwitterOGCard,
  LinkedInOGCard,
  SMSOgCard,
  FacebookOGCard,
  IosOgShellCard,
} from "@/components/ui/og-social-cards";

import placeholderImg from "@/assets/placeholder.png";

let tabs = [
  { id: 0, label: "iMessage" },
  { id: 1, label: "Twitter" },
  { id: 2, label: "LinkedIn" },
  { id: 3, label: "Facebook" },
];

export function OgImageSection({ ogData }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { image = "", title = "", description = "", url = "" } = ogData ?? {};
  const [ref, bounds] = useMeasure();

  const imageFallback = image || placeholderImg;

  const content = useMemo(() => {
    switch (activeTab) {
      case 0:
        return (
          <IosOgShellCard>
            <SMSOgCard
              img={imageFallback}
              title={title}
              desc={description}
              url={url}
            />
          </IosOgShellCard>
        );
      case 1:
        return (
          <TwitterOGCard
            img={imageFallback}
            title={title}
            desc={description}
            url={url}
          />
        );
      case 2:
        return (
          <LinkedInOGCard
            img={imageFallback}
            title={title}
            desc={description}
            url={url}
          />
        );
      case 3:
        return (
          <FacebookOGCard
            img={imageFallback}
            title={title}
            desc={description}
            url={url}
          />
        );
      default:
        return null;
    }
  }, [activeTab, image, title, description, url]);

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1;
      setDirection(newDirection);
      setActiveTab(newTabId);
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <Card className="bg-base-900">
      <CardHeader>
        <CardTitle>Open Graph Images</CardTitle>
        <CardDescription>
          <a href="https://ogp.me/" className=" text-blue-light ">
            Learn more
          </a>
        </CardDescription>
      </CardHeader>
      <div className="flex flex-col items-center pt-4 ">
        {/* <div className="flex space-x-1 border border-none rounded-full cursor-pointer bg-base-950/50 px-px py-px shadow-inner-shadow"> */}
        <div className="flex space-x-1 border border-none rounded-[8px] cursor-pointer bg-base-975  px-[3px] py-[3.2px] ">
          {tabs.map((tab, i) => (
            <button
              key={`${tab.id}-i-${i}-${title}`}
              onClick={() => handleTabClick(tab.id)}
              className={`${
                activeTab === tab.id ? "text-white " : "hover:text-base-300/60"
              } relative rounded-[5px] px-3 py-1.5 text-xs sm:text-sm font-medium text-base-600  transition focus-visible:outline-1 focus-visible:ring-1 focus-visible:ring-blue-light focus-visible:outline-none`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-0 z-10 bg-base-800  mix-blend-difference shadow-inner-shadow"
                  style={{ borderRadius: 5 }}
                  transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
        <MotionConfig
          transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
        >
          <motion.div
            className="relative mx-auto my-[10px] w-[360px] md:w-[550px] overflow-hidden"
            initial={false}
            animate={{ height: bounds.height }}
          >
            <div className="p-6" ref={ref}>
              <AnimatePresence
                custom={direction}
                mode="popLayout"
                onExitComplete={() => setIsAnimating(false)}
              >
                <motion.div
                  key={activeTab}
                  variants={variants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  custom={direction}
                  onAnimationStart={() => setIsAnimating(true)}
                  onAnimationComplete={() => setIsAnimating(false)}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </MotionConfig>
      </div>
    </Card>
  );
}

const ogImageInfo = {
  title: "Open Graph Images",
  description: "Essential Facts",
  facts: [
    {
      fact: "Definition",
      details:
        "Open Graph images are crucial for social media marketing as they provide a visual preview of content, attracting clicks and driving traffic from platforms like Facebook, Twitter, and LinkedIn.",
      icon: <Globe className="h-4 w-4 text-base-500 mt-1" />,
    },
    {
      fact: "Best Practices",
      details:
        "Use visually appealing and relevant images. Ideal dimensions are typically 1200x630 pixels to ensure they look good on most platforms.",
      icon: <Star className="h-4 w-4 text-base-500 mt-1" />,
    },
    {
      fact: "SEO Impact",
      details:
        "Although OG images do not directly affect SEO rankings, they can increase engagement and shares on social media, indirectly boosting website traffic and relevance.",
      icon: <TrendingUp className="h-4 w-4 text-base-500 mt-1" />,
    },
  ],
};

export function OgInfoFacts() {
  return (
    <Card className="w-full md:max-w-[300px] bg-base-900">
      <CardHeader>
        <CardTitle>{ogImageInfo.title}</CardTitle>
        <CardDescription>{ogImageInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {ogImageInfo.facts.map((f, index) => (
          <div
            key={index}
            className="bg-base-950 p-4 rounded-md shadow-inner-shadow flex flex-col gap-1"
          >
            <div className="flex items-start justify-start gap-3">
              {f.icon}
              <p className="text-base-600 text-left rounded text-lg tracking-tight mb-1.5">
                {f.fact}
              </p>
            </div>

            <p className="text-sm tracking-tight leading-tight font-base text-base-200">
              {f.details}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
