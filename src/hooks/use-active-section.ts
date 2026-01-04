
"use client";

import { useState, useEffect, useRef } from 'react';

export function useActiveSection(sectionIds: string[], options?: IntersectionObserverInit): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeSectionRef = useRef<string>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      let bestEntry: IntersectionObserverEntry | null = null;

      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }
      }

      if (bestEntry && activeSectionRef.current !== bestEntry.target.id) {
          setActiveSection(bestEntry.target.id);
      }
    };

    const observerOptions = {
      rootMargin: "-50% 0px -50% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...options,
    };
    
    observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

    const currentObserver = observerRef.current;
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        currentObserver.observe(element);
      }
    });

    return () => {
      currentObserver.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sectionIds), options]);

  return activeSection;
}
