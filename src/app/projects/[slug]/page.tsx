'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import type { PortfolioItem } from '@/components/landing/Portfolio';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { getPortfolioItemBySlug } from '@/lib/db';

const ImageLightbox = ({
    images,
    startIndex,
    onClose,
    project
  }: {
    images: string[] | undefined;
    startIndex: number | null;
    onClose: () => void;
    project: PortfolioItem | null;
  }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [direction, setDirection] = useState(0);
  
    useEffect(() => {
      setCurrentIndex(startIndex);
    }, [startIndex]);
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
  
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);
  
    if (startIndex === null || !images || images.length === 0 || !project) {
      return null;
    }
  
    const handleNext = () => {
      if (currentIndex === null) return;
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex! + 1) % images.length);
    };
  
    const handlePrev = () => {
      if (currentIndex === null) return;
      setDirection(-1);
      setCurrentIndex(
        (prevIndex) => (prevIndex! - 1 + images.length) % images.length
      );
    };
    
    const currentImage = images[currentIndex!];
  
    const variants = {
        enter: (direction: number) => ({
          x: direction > 0 ? '100%' : '-100%',
          opacity: 0,
        }),
        center: {
          zIndex: 1,
          x: 0,
          opacity: 1,
        },
        exit: (direction: number) => ({
          zIndex: 0,
          x: direction < 0 ? '100%' : '-100%',
          opacity: 0,
        }),
      };
  
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl px-4 sm:px-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative w-full h-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 rounded-full h-10 w-10 text-white bg-white/10 hover:bg-white/20"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <div className="relative flex-grow flex items-center justify-center overflow-hidden w-full max-w-7xl">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            className="w-full h-full flex items-center justify-center"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            }}
                        >
                            <motion.div 
                                className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden w-full h-full max-w-7xl flex items-center justify-center"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                <div className="relative w-full h-full flex-grow">
                                {currentImage && <Image
                                    src={currentImage}
                                    alt="Project screenshot"
                                    fill
                                    className="object-contain"
                                />}
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>


                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 rounded-full h-12 w-12 text-white bg-white/10 hover:bg-white/20"
                    onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                    }}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 rounded-full h-12 w-12 text-white bg-white/10 hover:bg-white/20"
                    onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                    }}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </motion.div>
        </motion.div>
    );
};


export default function ProjectPage({ params }: { params: { slug: string } }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const supabase = createClient();
      const foundProject = await getPortfolioItemBySlug(supabase, params.slug);
      if (foundProject) {
        setProject(foundProject as PortfolioItem);
      }
      setLoading(false);
    }
    fetchProject();
  }, [params.slug]);


  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 w-full pt-24 sm:pt-32 pb-24 flex items-center justify-center">
            <div className="container max-w-5xl mx-auto px-4 space-y-8">
                <Skeleton className="h-10 w-48 rounded-full" />
                <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.75,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1 w-full pt-24 sm:pt-32 pb-24"
      >
        <div className="container max-w-5xl mx-auto px-4">
          <Button asChild className={cn("btn-glass rounded-full text-base mb-8")}>
            <Link href="/#projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>

          <div className="bg-card/60 dark:bg-black/20 backdrop-blur-2xl border border-border/40 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative w-full h-64 md:h-96">
              {project.image && <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                data-ai-hint={project.hint}
                priority
              />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-white shadow-2xl">{project.title}</h1>
              </div>
            </div>
            <div className="p-6 sm:p-10">
              <div className="prose prose-lg max-w-none text-foreground/80 dark:text-white/80 dark:prose-invert mb-6">
                <p>{project.fullDescription}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag, i) => (
                  <Button key={i} variant="ghost" size="sm" className="btn-glass rounded-full text-sm font-medium pointer-events-none">
                    {tag}
                  </Button>
                ))}
              </div>
              
              {project.link && project.link !== '#' && (
                 <div className="mb-16">
                    <Button asChild size="lg" className="rounded-full text-base shadow-lg">
                        <Link href={project.link} target="_blank">
                            Visit Live Site
                        </Link>
                    </Button>
                 </div>
              )}
            </div>
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="pb-10 px-4 sm:px-6 md:px-10">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-center mb-8">Project Gallery</h2>
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent className="-ml-4">
                      {project.screenshots.map((screenshot, index) => (
                      <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                          <div 
                              className="relative aspect-video rounded-xl overflow-hidden border border-border/20 shadow-lg group cursor-pointer"
                              onClick={() => setLightboxIndex(index)}
                          >
                              {screenshot && <Image
                                  src={screenshot}
                                  alt={`${project.title} screenshot ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />}
                          </div>
                      </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 sm:-left-8" />
                  <CarouselNext className="right-2 sm:-right-8" />
                  </Carousel>
              </div>
            )}
          </div>
        </div>
      </motion.main>
      <Footer />
      <AnimatePresence>
        {lightboxIndex !== null && (
            <ImageLightbox 
                images={project.screenshots} 
                startIndex={lightboxIndex} 
                onClose={() => setLightboxIndex(null)}
                project={project}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
