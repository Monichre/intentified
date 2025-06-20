"use client";

import { FC } from "react";
import {
  Share2,
  Users,
  FileText,
  Network,
  Brain,
  Calendar,
  MessageSquare,
  BookOpen,
  Building2,
  Search,
  MonitorDot,
  Mail,
  Database,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const IntegrationCard = ({
  children,
  className,
  borderClassName,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        borderClassName,
        "border-border/70 rounded-full border backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "bg-background relative z-20 flex size-12 rounded-full",
          className,
          isCenter && "size-16",
        )}
      >
        <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Data sources with icon and color config, grouped for rows and data providers
export const dataSources = [
  {
    name: "Data Co-ops",
    icon: Share2,
    color: "text-blue-600",
  },
  {
    name: "Social Networks",
    icon: Users,
    color: "text-green-600",
  },
  {
    name: "Publishers",
    icon: FileText,
    color: "text-purple-600",
  },
  {
    name: "Technology Platforms",
    icon: Network,
    color: "text-orange-600",
  },

  {
    name: "Research Firms",
    icon: Brain,
    color: "text-pink-600",
  },
  {
    name: "Event Companies",
    icon: Calendar,
    color: "text-cyan-600",
  },
  {
    name: "Review Sites",
    icon: MessageSquare,
    color: "text-red-600",
  },
  {
    name: "Publishing Networks",
    icon: BookOpen,
    color: "text-yellow-600",
  },

  {
    name: "Job Postings",
    icon: Building2,
    color: "text-amber-600",
  },
  {
    name: "Search Results",
    icon: Search,
    color: "text-indigo-600",
  },
  {
    name: "Your Website",
    icon: MonitorDot,
    color: "text-teal-600",
  },
  {
    name: "Email Engagement",
    icon: Mail,
    color: "text-fuchsia-600",
  },
];

// For data providers section (flat array)
export const dataProviders = dataSources.flat();

export const IntentDataSources: FC = () => {
  return (
    <div className="relative w-full">
      <div className="">
        <div className="mx-auto max-w-5xl px-6">
          <div className="group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 bg-black/25 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
            <div
              role="presentation"
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"
            />

            {/* First row: Data Co-ops • Social Networks • Publishers • Technology Platforms */}
            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Data Co-ops</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Social Networks</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Publishers</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Network className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">
                    Technology Platforms
                  </span>
                </div>
              </InfiniteSlider>
            </div>

            {/* Second row: Research Firms • Event Companies • Review Sites • Publishing Networks */}
            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10} reverse>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Brain className="h-5 w-5 text-pink-600" />
                  <span className="text-sm font-medium">Research Firms</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Calendar className="h-5 w-5 text-cyan-600" />
                  <span className="text-sm font-medium">Event Companies</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <MessageSquare className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">Review Sites</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">
                    Publishing Networks
                  </span>
                </div>
              </InfiniteSlider>
            </div>

            {/* Third row: Job Postings • Search Results • Your Website • Email Engagement */}
            <div>
              <InfiniteSlider gap={24} speed={20} speedOnHover={10}>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Building2 className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium">Job Postings</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Search className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">Search Results</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <MonitorDot className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-medium">Your Website</span>
                </div>
                <div className="border-border/70 bg-background flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                  <Mail className="h-5 w-5 text-teal-600" />
                  <span className="text-sm font-medium">Email Engagement</span>
                </div>
              </InfiniteSlider>
            </div>

            {/* Centered database icon */}
            <div className="absolute inset-0 m-auto flex size-fit justify-center gap-2">
              <IntegrationCard
                borderClassName="shadow-black-950/10 shadow-xl border-white/25"
                className="size-16 bg-white/25 shadow-xl shadow-white/15 backdrop-blur-md backdrop-grayscale"
                isCenter={true}
              >
                <Image
                  src="/logo-icon.png"
                  alt="Intentified"
                  width={64}
                  height={64}
                />
              </IntegrationCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentDataSources;
