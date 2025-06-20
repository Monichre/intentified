import {
  Gemini,
  Replit,
  MagicUI,
  VSCodium,
  MediaWiki,
  GooglePaLM,
} from "@repo/components/logos";
import { cn } from "@repo/design-system/lib/utils";
import { LogoIcon } from "@repo/components/logo";
import { Button } from "@repo/components/ui/button";
import Link from "next/link";

export default function IntegrationsSection() {
  return (
    <section>
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative mx-auto flex max-w-sm items-center justify-between">
            <div className="space-y-6">
              <IntegrationCard position="left-top">
                <Gemini />
              </IntegrationCard>
              <IntegrationCard position="left-middle">
                <Replit />
              </IntegrationCard>
              <IntegrationCard position="left-bottom">
                w
                <MagicUI />
              </IntegrationCard>
            </div>
            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-2xl border p-1">
                <IntegrationCard
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/25 shadow-xl dark:border-white/25 dark:shadow-white/10"
                  isCenter={true}
                >
                  <LogoIcon />
                </IntegrationCard>
              </div>
            </div>
            <div
              role="presentation"
              className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] opacity-50 [--dots-color:black] dark:[--dots-color:white]"
            ></div>

            <div className="space-y-6">
              <IntegrationCard position="right-top">
                <VSCodium />
              </IntegrationCard>
              <IntegrationCard position="right-middle">
                <MediaWiki />
              </IntegrationCard>
              <IntegrationCard position="right-bottom">
                <GooglePaLM />
              </IntegrationCard>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            <h2 className="text-3xl font-semibold text-balance md:text-4xl">
              Integrate with your favorite tools
            </h2>
            <p className="text-muted-foreground">
              Connect seamlessly with popular platforms and services to enhance
              your workflow.
            </p>

            <Button variant="outline" size="sm" asChild>
              <Link href="#">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  position,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  position?:
    | "left-top"
    | "left-middle"
    | "left-bottom"
    | "right-top"
    | "right-middle"
    | "right-bottom";
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-background relative flex size-12 rounded-xl border dark:bg-transparent",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-20 m-auto size-fit *:size-6",
          isCenter && "*:size-8",
        )}
      >
        {children}
      </div>
      {position && !isCenter && (
        <div
          className={cn(
            "to-muted-foreground/25 absolute z-10 h-px bg-linear-to-r",
            position === "left-top" &&
              "top-1/2 left-full w-[130px] origin-left rotate-[25deg]",
            position === "left-middle" &&
              "top-1/2 left-full w-[120px] origin-left",
            position === "left-bottom" &&
              "top-1/2 left-full w-[130px] origin-left rotate-[-25deg]",
            position === "right-top" &&
              "top-1/2 right-full w-[130px] origin-right rotate-[-25deg] bg-linear-to-l",
            position === "right-middle" &&
              "top-1/2 right-full w-[120px] origin-right bg-linear-to-l",
            position === "right-bottom" &&
              "top-1/2 right-full w-[130px] origin-right rotate-[25deg] bg-linear-to-l",
          )}
        />
      )}
    </div>
  );
};
