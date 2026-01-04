
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Quote } from 'lucide-react';

type Testimonial = {
    id: number;
    name: string;
    company: string;
    feedback: string;
    avatar: string;
};

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: threshold });

    return (
      <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
        {children}
      </section>
    )
}

export function Testimonials({ initialTestimonials }: { initialTestimonials: Testimonial[] | null }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  
  const testimonials = initialTestimonials;

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: false })
  );

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!testimonials || testimonials.length === 0) {
    return <AnimatedSection id="testimonials" />;
  }

  return (
    <AnimatedSection id="testimonials" threshold={0.1} className="px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">What My Clients Say</h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
            Kind words from people I've had the pleasure to work with.
          </p>
        </div>
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id || index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full mx-auto max-w-[400px]">
                  <Card className="h-full flex flex-col justify-between backdrop-blur-3xl border border-border/30 dark:border-white/10 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:border-border/60 dark:hover:border-white/20 overflow-hidden">
                    <CardContent className="p-6 flex-grow relative">
                      <Quote className="absolute top-4 left-4 h-12 w-12 text-primary/10" />
                      <p className="relative z-10 text-foreground/80 dark:text-white/80 leading-relaxed pt-8">"{testimonial.feedback}"</p>
                    </CardContent>
                    <CardHeader className="flex flex-row items-center gap-4 p-6 pt-4">
                      <Avatar className="w-12 h-12 border-2 border-border/80 dark:border-white/20">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-bold font-headline">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{testimonial.company}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: count }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                        "h-2 rounded-full bg-primary/20 transition-all duration-300 ease-in-out",
                        i === current ? 'w-4 bg-primary' : 'w-2'
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                />
            ))}
        </div>
      </div>
    </AnimatedSection>
  );
};
