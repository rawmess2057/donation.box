"use client";

import { useEffect, useRef } from "react";

/**
 * Animates an SVG feTurbulence element's baseFrequency to create
 * a continuous liquid ripple effect on glass surfaces.
 * Pauses when the tab is hidden (Page Visibility API).
 */
export function useLiquidAnimation(
  turbulenceRef: React.RefObject<SVGFETurbulenceElement | null>,
) {
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const el = turbulenceRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = (time - startTimeRef.current) / 1000;
      const freq = 0.015 + Math.sin(elapsed * 1.5) * 0.008;
      el.setAttribute("baseFrequency", String(freq));
      frameRef.current = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current);
      } else {
        startTimeRef.current = 0;
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [turbulenceRef]);
}
