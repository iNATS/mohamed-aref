
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialFab } from '@/components/SocialFab';
import { Hero } from '@/components/landing/Hero';
import { Portfolio } from '@/components/landing/Portfolio';
import { About } from '@/components/landing/About';
import { Process } from '@/components/landing/Process';
import { Testimonials } from '@/components/landing/Testimonials';
import { Contact } from '@/components/landing/Contact';
import { motion } from 'framer-motion';
import { getPortfolioItems, getPageContent, getTestimonials, getPortfolioCategories } from '@/lib/db';
import type { PortfolioItem } from '@/components/landing/Portfolio';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioCategories, setPortfolioCategories] = useState<{id: number, name: string}[]>([]);
  const [heroContent, setHeroContent] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [processContent, setProcessContent] = useState(null);
  const [testimonials, setTestimonials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const [
        items,
        categories,
        hero,
        process,
        testimonialsData,
      ] = await Promise.all([
        getPortfolioItems(),
        getPortfolioCategories(),
        getPageContent('hero'),
        getPageContent('process'),
        getTestimonials(),
      ]);

      let about;
      if (user) {
          const userAbout = {
              title: user.user_metadata.full_name || 'Your Name',
              description: user.user_metadata.bio || 'Your professional bio goes here.',
              skills: [], // Skills are not in user_metadata, can be added if needed
              avatar: user.user_metadata.avatar_url || '',
          };
          about = userAbout;
      } else {
          about = await getPageContent('about');
      }

      setPortfolioItems(items as any[]);
      setPortfolioCategories(categories);
      setHeroContent(hero as any);
      setAboutContent(about as any);
      setProcessContent(process as any);
      setTestimonials(testimonialsData as any);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
       <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 w-full pt-24 sm:pt-32 pb-24 flex items-center justify-center">
            <div className="container max-w-5xl mx-auto px-4 space-y-8 text-center">
                <Skeleton className="h-40 w-40 rounded-full mx-auto" />
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className='flex min-h-screen flex-col bg-background'
    >
      <Header />
      <main className="flex-1 w-full">
        <Hero content={heroContent} />
        <motion.div 
          className="w-full bg-background"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Portfolio initialItems={portfolioItems} initialCategories={portfolioCategories} />
          <About content={aboutContent} />
          <Process content={processContent} />
          <Testimonials initialTestimonials={testimonials} />
          <Contact />
        </motion.div>
      </main>
      <SocialFab />
      <Footer />
    </motion.div>
  );
}
