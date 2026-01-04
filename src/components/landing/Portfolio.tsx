
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export type PortfolioItem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  hint: string;
  tags: string[];
  category: string;
  link?: string;
  fullDescription: string;
  screenshots: string[];
};

const PortfolioCard = ({ item, index, isVisible }: { item: PortfolioItem, index: number, isVisible: boolean }) => {
  return (
    <Link
      href={`/projects/${item.slug}`}
      className={cn(
        "group relative rounded-3xl transition-all duration-700 ease-in-out cursor-pointer overflow-hidden block",
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={{ animationDelay: `${(index % 3) * 150}ms` }}
    >
      <div className="bg-card/60 dark:bg-black/20 backdrop-blur-2xl border border-border/40 dark:border-white/20 shadow-2xl overflow-hidden rounded-3xl transition-all duration-300 group-hover:shadow-primary/20 group-hover:border-border/80 dark:group-hover:border-white/30 h-full">
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative h-48 md:h-full w-full">
            {item.image ? (
                <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                data-ai-hint={item.hint}
                />
            ) : (
                <div className="w-full h-full bg-muted" />
            )}
          </div>
          <div className="p-6 flex flex-col">
            <h3 className="text-xl font-bold font-headline text-foreground">{item.title}</h3>
            <p className="mt-2 text-foreground/70 dark:text-white/70 text-sm flex-grow">
              {item.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(item.tags || []).slice(0, 3).map((tag, i) => (
                <Button key={i} variant="ghost" size="sm" className="btn-glass rounded-full text-xs font-medium pointer-events-none">
                  {tag}
                </Button>
              ))}
            </div>
             <div className="mt-4 flex justify-end">
                <ArrowUpRight className="h-6 w-6 text-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export function Portfolio({ initialItems, initialCategories }: { initialItems: PortfolioItem[], initialCategories: {id: number, name: string}[] }) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialItems || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [loading, setLoading] = useState(!initialItems);

  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: 0.05 });
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    if (initialItems) {
      setPortfolioItems(initialItems);
      setLoading(false);
    }
  }, [initialItems]);

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  useEffect(() => {
    if (inView) {
      setCardsVisible(true);
    } else {
      setCardsVisible(false);
    }
  }, [inView]);

  const handleFilterChange = (newFilter: string) => {
    if (filter === newFilter) return;
    setVisibleCount(6); // Reset visible count on filter change
    setCardsVisible(false);
    setTimeout(() => {
      setFilter(newFilter);
      setCardsVisible(true);
    }, 150); // A short delay for the animations to reset
  };

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };

  const filteredItems = React.useMemo(() => {
    if (!portfolioItems) return [];
    if (filter === 'all') return portfolioItems;
    return portfolioItems.filter((item) => item.category.toLowerCase() === filter.toLowerCase());
  }, [portfolioItems, filter]);

  const visibleItems = React.useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  return (
    <>
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32 scroll-mt-20">
       <div className={cn("px-4", inView ? 'animate-fade-in-up' : 'opacity-0')}>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center">My Work</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
          A selection of projects that I'm proud of.
        </p>
      </div>
      <div className={cn("flex justify-center flex-wrap mt-8 gap-2 px-4", inView ? 'animate-fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
          <Button
            variant="ghost"
            onClick={() => handleFilterChange('all')}
            className={cn("btn-glass rounded-full text-base", filter === 'all' ? "btn-glass-active" : "")}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => handleFilterChange(category.name)}
              className={cn("btn-glass rounded-full text-base", filter === category.name ? "btn-glass-active" : "")}
            >
              {category.name}
            </Button>
          ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card/60 dark:bg-black/20 p-4 rounded-3xl"><Skeleton className="w-full h-64" /></div>
          ))
        ) : (
          visibleItems.map((item, index) => (
            <PortfolioCard key={`${filter}-${item.slug}-${index}`} item={item} index={index} isVisible={cardsVisible} />
          ))
        )}
      </div>
       {visibleCount < filteredItems.length && (
        <div className="mt-12 text-center px-4">
          <Button onClick={handleLoadMore} size="lg" className="rounded-full text-base shadow-lg">
            Load More
          </Button>
        </div>
      )}
    </section>
    </>
  );
};
