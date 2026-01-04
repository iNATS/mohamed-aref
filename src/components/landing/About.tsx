
'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CircularText from './CircularText';

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });
  
    return (
      <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
        {children}
      </section>
    )
}

export function About({ content }: { content: any }) {
  if (!content) {
    return <AnimatedSection id="about" className="px-4" />;
  }
  const { title, description, skills, avatar } = content;
  
  return (
    <AnimatedSection id="about" threshold={0.4} className="px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="flex flex-col items-center text-center md:col-span-1">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <CircularText
                    text="Creative • Developer • Designer •"
                    spinDuration={25}
                    className="absolute inset-0 text-foreground/70 dark:text-white/70"
                />
                <Avatar className="w-40 h-40 sm:w-48 sm:h-48 border-4 border-border/80 dark:border-white/20 shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <AvatarImage src={avatar} alt={title} />
                    <AvatarFallback>{title.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter font-headline mt-8">{title}</h2>
          </div>
          <div className="md:col-span-2 space-y-10 mt-4 md:mt-0">
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-2xl font-bold tracking-tighter font-headline">About Me</h3>
              <p className="text-foreground/80 dark:text-white/80 text-base sm:text-lg leading-relaxed">
                {description}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tighter font-headline mb-4 text-center md:text-left">My Skills</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                {(skills || []).map((skill: string) => (
                    <Button key={skill} variant="ghost" size="sm" className="btn-glass rounded-full text-xs font-medium pointer-events-none h-auto px-3 py-1.5">
                        {skill}
                    </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
