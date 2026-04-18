'use client';

import { useCallback, useRef, useEffect } from 'react';

interface SmoothAnimationOptions {
  duration?: number;
  easing?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear';
}

export function useSmoothAnimation(options: SmoothAnimationOptions = {}) {
  const { duration = 300, easing = 'easeInOut' } = options;
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(
    (
      element: HTMLElement,
      properties: Record<string, string | number>,
      callback?: () => void
    ) => {
      const startTime = performance.now();
      const startValues: Record<string, number> = {};
      const targetValues = properties;

      // Get start values
      for (const key in targetValues) {
        const value = element.style.getPropertyValue(key);
        startValues[key] = parseFloat(value) || 0;
      }

      const animateFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);

        // Apply easing
        if (easing === 'easeInOut') {
          progress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        } else if (easing === 'easeIn') {
          progress = progress * progress;
        } else if (easing === 'easeOut') {
          progress = 1 - Math.pow(1 - progress, 2);
        }

        // Apply interpolation
        for (const key in targetValues) {
          const start = startValues[key];
          const target = typeof targetValues[key] === 'number' 
            ? (targetValues[key] as number)
            : parseFloat(targetValues[key] as string);
          const value = start + (target - start) * progress;
          element.style.setProperty(key, `${value}${typeof targetValues[key] === 'number' ? 'px' : ''}`);
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateFrame);
        } else {
          callback?.();
        }
      };

      animationRef.current = requestAnimationFrame(animateFrame);
    },
    [duration, easing]
  );

  const cancel = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { animate, cancel };
}