"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactLottiePlayer = dynamic(() => import("react-lottie-player"), { ssr: false });

interface LottieProps {
  path: string;
  width?: number;
  height?: number;
  loop?: boolean;
  className?: string;
}

export const Lottie = ({ path, width = 200, height = 200, loop = true, className = "" }: LottieProps) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(path);
      const data = (await response.json()) as object;
      setAnimationData(data);
    };
    void fetchData();
  }, []);

  return (
    <ReactLottiePlayer className={className} loop={loop} animationData={animationData} play style={{ width, height }} />
  );
};
