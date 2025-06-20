"use client";

import { useEffect, useState } from "react";

export const Clock = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return <div className="mr-2 z-10 opacity-0">Loading...</div>;
  }

  // Format time as HH:MM:SS AM/PM
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Calculate hand angles
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const secondAngle = time.getSeconds() * 6;

  return (
    <div className="flex items-center relative group cursor-pointer text-nowrap">
      <p className="mr-2 z-10">{formattedTime}</p>
      <div
        className="relative rounded-full bg-transparent border border-neutral-700 shadow-lg z-10"
        style={{ width: "18px", height: "18px" }}
      >
        {/* Hour hand */}
        <div
          className="absolute top-1/2 left-1/2 w-[2px] rounded-full bg-neutral-700 origin-bottom transform -translate-x-1/2"
          style={{
            height: "5.4px",
            transform: `translateY(-100%) rotate(${hourAngle}deg)`,
          }}
        ></div>
        {/* Minute hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 rounded-full bg-neutral-700 origin-bottom transform -translate-x-1/2"
          style={{
            height: "7.2px",
            transform: `translateY(-100%) rotate(${minuteAngle}deg)`,
          }}
        ></div>
        {/* Second hand */}
        <div
          className="absolute top-1/2 left-1/2 w-[1px] rounded-full bg-neutral-500 origin-bottom transform -translate-x-1/2"
          style={{
            height: "6.66px",
            transform: `translateY(-100%) rotate(${secondAngle}deg)`,
          }}
        ></div>
        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full bg-black"
          style={{
            width: "0.72px",
            height: "0.63px",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      </div>
      <div className="absolute -inset-1 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 min-w-full min-h-full rounded-xl bg-neutral-700/20 transition-all cursor-pointer"></div>
    </div>
  );
};

export default Clock;
