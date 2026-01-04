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
import type { PortfolioItem } from '@/components/landing/Portfolio';
import { getPortfolioItems, getPortfolioCategories, getPageContent, getTestimonials } from '@/lib/db';


export default async function Home() {
  const [
    portfolioItems,
    portfolioCategories,
    heroContent,
    processContent,
    testimonials,
    aboutContent,
  ] = await Promise.all([
    getPortfolioItems(),
    getPortfolioCategories(),
    getPageContent('hero'),
    getPageContent('process'),
    getTestimonials(),
    getPageContent('about'),
  ]);

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
