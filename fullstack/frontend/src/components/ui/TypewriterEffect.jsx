import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";

export function TypewriterEffectSmooth({ words = [], className = "", cursorClassName = "" }) {
  const [completedWords, setCompletedWords] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!words.length) return;

    if (wordIndex >= words.length) {
      setIsFinished(true);
      return;
    }

    const currentWord = words[wordIndex];
    const textToType = currentWord.text;

    const timeout = setTimeout(() => {
      if (charIndex < textToType.length) {
        setCurrentText((prev) => prev + textToType.charAt(charIndex));
        setCharIndex((c) => c + 1);
      } else {
        // Word completed! Add it to completed words with its styling
        setCompletedWords((prev) => [...prev, { ...currentWord, text: textToType }]);
        setCurrentText("");
        setWordIndex((w) => w + 1);
        setCharIndex(0);
      }
    }, 50); // Speed of typing individual characters

    return () => clearTimeout(timeout);
  }, [charIndex, wordIndex, words]);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-left", className)}>
      {completedWords.map((word, i) => (
        <span key={i} className={cn("text-4xl md:text-5xl lg:text-6xl font-black tracking-tight", word.className)}>
          {word.text}
        </span>
      ))}
      {/* Current word typing */}
      {!isFinished && words[wordIndex] && (
        <span className={cn("text-4xl md:text-5xl lg:text-6xl font-black tracking-tight", words[wordIndex].className)}>
          {currentText}
          <span className={cn("inline-block w-[3px] h-[1em] ml-0.5 rounded-full animate-pulse align-middle bg-teal-500", cursorClassName)} />
        </span>
      )}
      {/* Final blinking cursor at the very end */}
      {isFinished && (
        <span className={cn("inline-block w-[3px] h-[1.1em] ml-1 rounded-full animate-pulse align-middle bg-teal-500", cursorClassName)} />
      )}
    </div>
  );
}
