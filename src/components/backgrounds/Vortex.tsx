
'use client';

import { useEffect, useRef } from 'react';

export default function Vortex(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    particleCount = 700,
    particleSize = 1,
    speed = 0.5,
    color = 'hsl(var(--foreground))',
  } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let particles: { x: number, y: number, angle: number, speed: number, radius: number }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          angle: Math.random() * 2 * Math.PI,
          speed: Math.random() * speed,
          radius: Math.random() * 200 + 50,
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const forceDirectionX = dx / dist;
        const forceDirectionY = dy / dist;
        const force = (dist - 200) * 0.001;

        p.x -= forceDirectionX * force;
        p.y -= forceDirectionY * force;

        p.angle += p.speed * 0.01;
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        
        if(p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [particleCount, particleSize, speed, color]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-50" />;
}

    