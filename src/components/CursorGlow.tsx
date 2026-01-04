'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-0 transition-opacity',
        isVisible ? 'opacity-60' : 'opacity-0'
      )}
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, hsla(0, 0%, 100%, 0.08), transparent 80%)`,
      }}
    />
  );
}
