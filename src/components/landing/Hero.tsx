
'use client';

import { useState, useEffect, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Orb from './Orb';
import { Noise } from '../backgrounds/Noise';
import { Starfield } from '../backgrounds/Starfield';
import { Gradient } from '../backgrounds/Gradient';
import FloatingLines from '../backgrounds/FloatingLines';
import SplitText from '../SplitText';

const backgroundComponents = {
    orb: Orb,
    noise: Noise,
    starfield: Starfield,
    gradient: Gradient,
    floatingLines: FloatingLines,
};

export function Hero({ content }: { content: any }) {
  if (!content) {
    return <section id="home" className="relative w-full h-screen flex items-center justify-center text-center px-4 overflow-hidden" />;
  }

  const { title, subtitle, description, avatar, background = 'orb' } = content;

  const BackgroundComponent = backgroundComponents[background as keyof typeof backgroundComponents] || Orb;


  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center text-center px-4 overflow-hidden"
    >
        <div className="absolute inset-0 z-0 h-full w-full">
            <BackgroundComponent />
        </div>
        {avatar && (
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `url(${avatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
        )}
      
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2, delayChildren: 0.1 }}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center"
      >
        <motion.div
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          
          <p className="text-lg md:text-xl font-medium text-muted-foreground">
            {subtitle}
          </p>
          <SplitText
            text={title}
            className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline mt-2 bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-primary/40 dark:from-white dark:via-white/80 dark:to-white/40"
            splitType="chars"
            from={{ opacity: 0, y: 40, scale: 0.8 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            stagger={0.05}
            duration={0.6}
            ease="power3.out"
          />
        </motion.div>

        <motion.p
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          className="mt-6 max-w-[600px] text-muted-foreground text-base sm:text-lg"
        >
          {description}
        </motion.p>
        
        <motion.div
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col gap-4 min-[400px]:flex-row pt-8"
        >
          <Button asChild size="lg" className="rounded-full text-base shadow-lg">
              <a href="#contact">Get in Touch</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="btn-glass rounded-full text-base shadow-lg">
              <a href="#projects">
              View My Work <ArrowRight className="ml-2 h-4 w-4" />
              </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
