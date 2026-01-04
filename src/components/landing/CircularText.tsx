
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CircularTextProps {
  text: string;
  className?: string;
  spinDuration?: number;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  className,
  spinDuration = 20,
}) => {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const uniqueId = React.useId();

  return (
    <div className={cn('relative w-full h-full', className)}>
      <div className="animate-aurora-spin" style={{ animationDuration: `${spinDuration}s` }}>
        <svg
          viewBox="0 0 220 220"
          className="w-full h-full"
        >
          <defs>
            <path
              id={uniqueId}
              d={`
                M 110, 110
                m -${radius}, 0
                a ${radius},${radius} 0 1,1 ${radius * 2},0
                a ${radius},${radius} 0 1,1 -${radius * 2},0
              `}
            />
          </defs>
          <text textLength={circumference} className="text-lg font-medium fill-current">
            <textPath
              xlinkHref={`#${uniqueId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {text}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default CircularText;
