import { useEffect, useRef, useState } from 'react';

const CHARACTER_SET =
  '0123456789qwertyuiopasdfghjklzxcvbnm!?></\\a~+*=@#$%'.split('');
const getRandomIndex = () => Math.floor(Math.random() * CHARACTER_SET.length);
const generateRandomString = (length: number) => {
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += CHARACTER_SET[getRandomIndex()];
  }
  return randomString;
};

export interface TextScrambleEffectProps {
  text?: string;
}

const TextScrambleEffect = (props: TextScrambleEffectProps) => {
  const { text = '' } = props;

  const [displayText, setDisplayText] = useState([text, '']);
  const [isAnimationDisabled, setIsAnimationDisabled] = useState(false);

  const animationFrameRef = useRef<number>();
  const progressRef = useRef(0);

  // Disable animation for small screens
  // useEffect(() => {
  //     setIsAnimationDisabled(windowWidth <= 1100);
  // }, [windowWidth]);

  useEffect(() => {
    if (isAnimationDisabled) return;

    progressRef.current = 0;
    const textLength = text.length;

    const animateTextReveal = () => {
      if (progressRef.current < 36) {
        setDisplayText(['', generateRandomString(textLength)]);
      } else if (progressRef.current / 2 - 18 < textLength) {
        const revealedPart = text.slice(0, progressRef.current / 2 - 18 - 1);
        const remainingRandomPart = generateRandomString(
          textLength - revealedPart.length
        );
        setDisplayText([revealedPart, remainingRandomPart]);
      } else {
        setDisplayText([text, '']);
        return;
      }

      progressRef.current += 2;
      animationFrameRef.current = requestAnimationFrame(animateTextReveal);
    };

    animationFrameRef.current = requestAnimationFrame(animateTextReveal);

    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, [text, isAnimationDisabled]);

  useEffect(() => {
    if (isAnimationDisabled) {
      setDisplayText(() => ['', generateRandomString(text.length)]);
    }
  }, [text, isAnimationDisabled]);

  useEffect(() => {
    if (isAnimationDisabled) {
      setDisplayText(() => [text, '']);
    }
  }, [isAnimationDisabled, text]);

  return (
    <div>
      <span>{displayText[0]}</span>
      <span>{displayText[1]}</span>
    </div>
  );
};

export default TextScrambleEffect;
