
'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
  splitType?: 'chars' | 'words' | 'lines';
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className,
  splitType = 'chars',
  delay = 0,
  duration = 0.8,
  stagger = 0.05,
  ease = 'power3.out',
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '0px',
  textAlign = 'left',
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, {
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const parts = React.useMemo(() => {
    if (splitType === 'words') {
      return text.split(' ').map((word, i) => (
        <span key={i} className="inline-block" style={{ whiteSpace: 'pre' }}>
          {word}{i < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      ));
    } else if (splitType === 'lines') {
      // This is a simplistic line split, real line splitting requires measuring
      return text.split('\n').map((line, i) => (
        <span key={i} className="block">{line}</span>
      ));
    }
    // Default to 'chars'
    return text.split('').map((char, i) => (
      <span key={i} className="inline-block" style={{ whiteSpace: 'pre' }}>
        {char}
      </span>
    ));
  }, [text, splitType]);

  useGSAP(() => {
    if (inView && containerRef.current) {
      const elements = containerRef.current.children;
      gsap.fromTo(elements, 
        { ...from },
        {
          ...to,
          duration,
          ease,
          delay,
          stagger: {
            each: stagger,
            from: 'start',
          },
          onComplete: onLetterAnimationComplete,
        }
      );
    }
  }, { scope: containerRef, dependencies: [inView] });

  const getTextAlignClass = () => {
    switch(textAlign) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  }

  return (
    <div ref={inViewRef}>
        <div ref={containerRef} className={cn(className, getTextAlignClass())}>
            {parts}
        </div>
    </div>
  );
};

export default SplitText;
