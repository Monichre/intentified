import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const INVOICE_COUNT = 3;

export interface TrackInvoicesProps {
  title?: string;
  logo?: string;
  count?: number;
}

export const TrackInvoices = (props: TrackInvoicesProps) => {
  const { count = INVOICE_COUNT, logo, title = "Reporting summary" } = props;

  return (
    <div className="flex justify-center py-[60px]">
      <div
        className="relative w-full max-w-[400px]"
        style={{ perspective: 600, height: 500 }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Invoice
            key={index}
            index={index}
            title={title}
            count={count}
            logo={logo}
          />
        ))}
      </div>
    </div>
  );
};

export const Invoice = ({
  index,
  logo,
  count,
  title,
}: {
  index: number;
  logo?: string;
  count: number;
  title: string;
}) => {
  const controls = useAnimation();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const animate = async () => {
      while (isMounted.current) {
        for (let i = 0; i < count; i++) {
          if (!isMounted.current) break;

          const currentPosition = (index + i) % count;
          const nextPosition = (index + i + 1) % count;
          const currentY = 24 * currentPosition;
          const nextY = 24 * nextPosition;
          const currentZ = 20 * currentPosition;
          const nextZ = 20 * nextPosition;

          if (nextPosition === 0) {
            await controls.start({
              y: [currentY, 24 * count],
              z: [currentZ, 20 * count],
              opacity: [1, 0],
              zIndex: currentPosition + 1,
              transition: { duration: 2 / 3, ease: "easeInOut" },
            });
            controls.set({
              y: nextY,
              z: nextZ,
              opacity: 0,
              zIndex: nextPosition,
            });
            await controls.start({
              opacity: 1,
              transition: { duration: 1 / 3, ease: "easeOut" },
            });
          } else {
            await controls.start({
              y: [currentY, nextY],
              z: [currentZ, nextZ],
              zIndex: nextPosition,
              transition: { duration: 1, ease: "easeInOut" },
            });
          }

          // Add a delay between cycles
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    animate();

    return () => {
      isMounted.current = false;
      controls.stop();
    };
  }, [controls, index]);

  return (
    <motion.div
      key={index}
      animate={controls}
      transition={{ repeat: Infinity, repeatDelay: 1 }}
      className="absolute top-0 left-0 w-full"
      style={{
        transform: `translate3d(0, ${24 * index}px, ${20 * index}px)`,
      }}
    >
      <div className="relative w-full overflow-hidden rounded-[4px] border-t-[4px] border-[hsl(39,100%,57%)]">
        <div className="bg-[#232323] px-6 py-8">
          <div className="mb-5 flex justify-end">
            <img src={logo} className="w-[90px]" alt="logo" />
          </div>
          <div className="flex justify-between">
            <div className="h-2 w-1/4 rounded-full bg-[#5a5a5a]" />
            <div className="flex w-1/4 flex-col gap-[6px]">
              <div className="h-2 w-full rounded-full bg-[#5a5a5a]" />
              <div className="h-2 w-1/2 rounded-full bg-[#303030]" />
              <div className="h-2 w-[65%] rounded-full bg-[#303030]" />
              <div className="h-2 w-[90%] rounded-full bg-[#303030]" />
            </div>
          </div>
        </div>
        <div className="bg-[#1d1d1d] px-6 py-6">
          <div className="mb-[6px] text-[13px] font-medium text-[#ededed]">
            {title}
          </div>
          <div className="flex border-b border-b-[rgba(255,255,255,0.08)] py-3">
            <div className="w-1/2">
              <div className="h-2 w-[35%] rounded-full bg-[rgba(255,255,255,0.2)]" />
            </div>
            <div className="w-1/2">
              <div className="h-2 w-[35%] rounded-full bg-[rgba(255,255,255,0.2)]" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex border-b border-b-[rgba(255,255,255,0.08)] py-3"
            >
              <div className="w-1/2">
                <div className="h-2 w-[35%] rounded-full bg-[#303030]" />
              </div>
              <div className="w-1/2">
                <div className="h-2 w-[35%] rounded-full bg-[#303030]" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#1d1d1d] px-6 py-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className={`flex py-3 ${i === 1 ? "" : "border-b border-b-[rgba(255,255,255,0.08)]"}`}
            >
              <div className="w-1/4">
                <div className="h-2 w-[45%] rounded-full bg-[#303030]" />
              </div>
              <div className="w-1/4">
                <div className="h-2 w-[45%] rounded-full bg-[#303030]" />
              </div>
              <div className="w-1/4">
                <div className="h-2 w-[45%] rounded-full bg-[#303030]" />
              </div>
              <div className="w-1/4">
                <div className="h-2 w-[45%] rounded-full bg-[#303030]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
