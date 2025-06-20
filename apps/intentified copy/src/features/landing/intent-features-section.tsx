"use client";

import { Target, TrendingUp, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { Activity, Map as MapIcon, MessageCircle } from "lucide-react";
import DottedMap from "dotted-map";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Map visualization component
const map = new DottedMap({ height: 55, grid: "diagonal" });
const points = map.getPoints();

const svgOptions = {
  backgroundColor: "var(--color-background)",
  color: "currentColor",
  radius: 0.15,
};

const Map = () => {
  const viewBox = `0 0 120 60`;
  return (
    <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  );
};

// Chart configuration and data
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "May", desktop: 56, mobile: 224 },
  { month: "June", desktop: 56, mobile: 224 },
  { month: "January", desktop: 126, mobile: 252 },
  { month: "February", desktop: 205, mobile: 410 },
  { month: "March", desktop: 200, mobile: 126 },
  { month: "April", desktop: 400, mobile: 800 },
];

const MonitoringChart = () => {
  return (
    <ChartContainer className="aspect-auto h-120 md:h-96" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <Area
          strokeWidth={2}
          dataKey="mobile"
          type="stepBefore"
          fill="url(#fillMobile)"
          fillOpacity={0.1}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="desktop"
          type="stepBefore"
          fill="url(#fillDesktop)"
          fillOpacity={0.1}
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export const IntentFeaturesSection = () => {
  return (
    <section className="px-4 py-16 md:py-32">
      <div className="mx-auto grid max-w-5xl border md:grid-cols-2">
        <div>
          <div className="p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapIcon className="size-4" />
              Real time location tracking
            </span>

            <p className="text-md text-muted-foreground mt-8 font-medium">
              Intentified identifies your prospects' real-time interests so you
              can deliver exactly what they're searching for. Powered by
              billions of intent signals.
            </p>
            <ul className="text-muted-foreground mt-6 space-y-2 text-base">
              <li className="flex items-center gap-2">
                <Target className="size-4 text-blue-600" />
                Pinpoint prospect locations instantly
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="size-4 text-green-600" />
                Track engagement trends across regions
              </li>
              <li className="flex items-center gap-2">
                <Zap className="size-4 text-yellow-500" />
                React to live intent signals as they happen
              </li>
            </ul>
          </div>

          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="relative z-1 flex size-fit w-fit items-center gap-2 rounded-(--radius) border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
                <span className="text-lg">🇨🇩</span> Last connection from DR
                Congo
              </div>
              <div className="bg-background absolute inset-2 -bottom-2 mx-auto rounded-(--radius) border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-zinc-900"></div>
            </div>

            <div className="relative overflow-hidden">
              <div className="to-background absolute inset-0 z-1 bg-radial from-transparent to-75%"></div>
              <Map />
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l dark:bg-transparent">
          <div className="relative z-10">
            <span className="text-muted-foreground flex items-center gap-2">
              <MessageCircle className="size-4" />
              Email and web support
            </span>

            <p className="my-8 text-2xl font-semibold">
              Reach out via email or web for any assistance you need.
            </p>
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-5 rounded-full border">
                  <Logo className="m-auto size-3" />
                </span>
                <span className="text-muted-foreground text-xs">
                  Sat 22 Feb
                </span>
              </div>
              <div className="bg-background mt-1.5 w-3/5 rounded-(--radius) border p-3 text-xs">
                Hey, I'm having trouble with my account.
              </div>
            </div>

            <div>
              <div className="mb-1 ml-auto w-3/5 rounded-(--radius) bg-blue-600 p-3 text-xs text-white">
                Molestiae numquam debitis et ullam distinctio provident nobis
                repudiandae deleniti necessitatibus.
              </div>
              <span className="text-muted-foreground block text-right text-xs">
                Now
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-full border-y p-12">
          <p className="text-center text-4xl font-semibold lg:text-7xl">
            99.99% Uptime
          </p>
        </div>
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pt-6 pr-12 md:px-12 md:pt-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" />
              Activity feed
            </span>

            <p className="my-8 text-2xl font-semibold">
              Monitor your application's activity in real-time.{" "}
              <span className="text-muted-foreground">
                {" "}
                Instantly identify and resolve issues.
              </span>
            </p>
          </div>
          <MonitoringChart />
        </div>
      </div>
    </section>
  );
};
