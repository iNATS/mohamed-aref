
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialFab } from '@/components/SocialFab';
import { Hero } from '@/components/landing/Hero';
import { Portfolio } from '@/components/landing/Portfolio';
import { About } from '@/components/landing/About';
import { Process } from '@/components/landing/Process';
import { Testimonials } from '@/components/landing/Testimonials';
import { Contact } from '@/components/landing/Contact';
import { LandingPageMotion } from '@/components/landing/LandingPageMotion';
import { getPortfolioItems, getPageContent, getTestimonials, getPortfolioCategories } from '@/lib/db';
import type { PortfolioItem } from '@/components/landing/Portfolio';
import { createServerClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    portfolioItems,
    portfolioCategories,
    heroContent,
    processContent,
    testimonials,
  ] = await Promise.all([
    getPortfolioItems(),
    getPortfolioCategories(),
    getPageContent('hero'),
    getPageContent('process'),
    getTestimonials(),
  ]);

  let aboutContent;
  if (user && user.user_metadata) {
      aboutContent = {
          title: user.user_metadata.full_name || 'Your Name',
          description: user.user_metadata.bio || 'Your professional bio goes here.',
          skills: user.user_metadata.skills || [],
          avatar: user.user_metadata.avatar_url || '',
      };
  } else {
      aboutContent = await getPageContent('about');
  }

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <Header />
      <main className="flex-1 w-full">
        <Hero content={heroContent} />
        <LandingPageMotion>
          <Portfolio initialItems={portfolioItems as PortfolioItem[]} initialCategories={portfolioCategories} />
          <About content={aboutContent} />
          <Process content={processContent} />
          <Testimonials initialTestimonials={testimonials as any[]} />
          <Contact />
        </LandingPageMotion>
      </main>
      <SocialFab />
      <Footer />
    </div>
  );
}
