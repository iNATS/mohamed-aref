
'use client';

import { useEffect, useRef, useMemo } from 'react';

export default function Grid(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    squareSize = 40,
    lineWidth = 1,
    glowWidth = 40,
    glowIntensity = 0.4,
    speed = 0.05,
  } = props;

  const color = 'rgba(100, 100, 100, 1)';
  const glowColor = useMemo(() => {
    const tempColor = color.substring(5, color.length-2);
    const [r, g, b] = tempColor.split(',').map(Number);
    return `rgba(${r}, ${g}, ${b}, ${glowIntensity})`;
  }, [glowIntensity, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const offsetX = time % squareSize;
      const offsetY = time % squareSize;

      // Draw grid lines
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (let x = -offsetX; x < canvas.width; x += squareSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = -offsetY; y < canvas.height; y += squareSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Draw mouse glow
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        glowWidth
      );
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += speed;
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [squareSize, lineWidth, glowWidth, speed, color, glowColor]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}

    