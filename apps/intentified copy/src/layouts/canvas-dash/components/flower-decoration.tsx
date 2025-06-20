"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Position {
  top: string;
  left?: string;
  right?: string;
  animationDelay: string;
}

interface FlowerDecorationProps {
  count?: number;
}

export const FlowerDecoration = ({ count = 10 }: FlowerDecorationProps) => {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    // Only generate positions on the client side
    const newPositions = Array.from({ length: count }, (_, i) => {
      const isLeft = Math.random() > 0.5;
      return {
        top: `${Math.floor(Math.random() * 90)}vh`,
        ...(isLeft
          ? { left: `${Math.floor(Math.random() * 90)}%` }
          : { right: `${Math.floor(Math.random() * 90)}%` }),
        animationDelay: `${Math.random() * 5}s`,
      };
    });

    setPositions(newPositions);
  }, [count]);

  if (positions.length === 0) return null;

  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          className="absolute z-[1] pointer-events-none floating"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            animationDelay: pos.animationDelay,
          }}
        >
          <Image
            src="/seasons/flower.png"
            alt=""
            width={20}
            height={20}
            className="opacity-80"
          />
        </div>
      ))}
    </>
  );
};

export default FlowerDecoration;
