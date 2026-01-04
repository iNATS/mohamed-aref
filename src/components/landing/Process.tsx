
'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, ArrowRight, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const iconMap: { [key: string]: LucideIcon } = {
    MessageCircle,
    Lightbulb,
    PencilRuler,
    Code,
    Combine,
    Rocket
};

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });

  return (
    <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
      {children}
    </section>
  )
}

export function Process({ content }: { content: any[] | null }) {
    if (!content || content.length === 0) {
      return <AnimatedSection id="process" />;
    }
    const processSteps = content;
    
    return (
        <AnimatedSection id="process" threshold={0.1}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                    <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                        A streamlined journey from a spark of an idea to a stunning final product.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {processSteps.map((step, index) => {
                        const Icon = iconMap[step.icon as keyof typeof iconMap] || PencilRuler;
                        const stepRef = useRef<HTMLDivElement>(null);
                        const stepInView = useInView(stepRef, { triggerOnce: true, threshold: 0.3 });
                        
                        return (
                            <motion.div
                                key={index}
                                ref={stepRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={stepInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className={cn(
                                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border bg-background/50 shadow-inner-lg",
                                    step.color
                                )}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-lg font-bold font-headline">
                                      <span className="text-primary/40 mr-2">0{index + 1}</span>
                                      {step.title}
                                  </h3>
                                  <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                  <Button asChild size="lg" className="rounded-full text-base">
                      <Link href="#contact">
                          Let's Talk
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                </div>
            </div>
        </AnimatedSection>
    );
};
