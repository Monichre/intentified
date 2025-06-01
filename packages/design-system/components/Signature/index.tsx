import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_SVG_WIDTH = 200;
const DEFAULT_SVG_HEIGHT = 100;

export interface SignatureProps {
  text: string;
  color?: string;
}

const Signature = (props: SignatureProps) => {
  const { text, color = '#000' } = props;
  const [paths, setPaths] = useState<string[]>([]);
  const [svgWidth, setSvgWidth] = useState(DEFAULT_SVG_WIDTH);

  useEffect(() => {
    setPaths([]);

    const fetchPaths = async () => {
      const res = await fetch(
        'https://reverseui.com/api/helpers/signature-paths',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            height: DEFAULT_SVG_HEIGHT,
            fontSize: 14,
          }),
        }
      );
      const data = await res.json();
      setPaths(data.paths);
      setSvgWidth(data.width);
    };

    fetchPaths();
  }, [text, color]);

  const pathVariants = {
    hidden: {
      pathLength: 0,
    },
    visible: (i: number) => ({
      pathLength: 1,
      transition: {
        pathLength: {
          delay: 0.2 * i,
          type: 'spring',
          duration: 2.5,
          bounce: 0.2,
          ease: 'easeInOut',
        },
      },
    }),
  };

  return (
    <svg
      width={svgWidth}
      height={DEFAULT_SVG_HEIGHT}
      viewBox={`0 0 ${svgWidth} ${DEFAULT_SVG_HEIGHT}`}
      fill="none"
    >
      {paths?.map((path, index) => (
        <motion.path
          key={index}
          d={path}
          stroke={color}
          strokeWidth="2"
          fill="none"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        />
      ))}
    </svg>
  );
};

export default Signature;
