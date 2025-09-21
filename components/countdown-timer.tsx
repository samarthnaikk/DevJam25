"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({
  seconds,
  onComplete,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    // Reset timer when seconds change
    setTimeLeft(seconds);

    if (seconds <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return <span className={className}>{formatTime()}</span>;
}
