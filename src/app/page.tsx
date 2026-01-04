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

// Mock data since DB is removed
const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
    return [
     { id: 1, title: 'E-commerce Platform', slug: 'e-commerce-platform', description: 'A robust and scalable online store built with Next.js and Stripe.', fullDescription: 'Full description here.', image: 'https://picsum.photos/seed/ecom/600/400', hint: 'online store', tags: ['Next.js', 'Stripe'], category: 'Web', link: '#', screenshots: ['https://picsum.photos/seed/ecom1/600/400', 'https://picsum.photos/seed/ecom2/600/400']},
     { id: 2, title: 'Task Management App', slug: 'task-app', description: 'A sleek mobile app for managing tasks.', fullDescription: 'Full description here.', image: 'https://picsum.photos/seed/taskapp/600/400', hint: 'mobile productivity', tags: ['React Native', 'Supabase'], category: 'Mobile', link: '#', screenshots: ['https://picsum.photos/seed/task1/400/800']},
     { id: 3, title: 'Branding & UI Kit', slug: 'ui-kit', description: 'A complete brand identity and component library.', fullDescription: 'Full description here.', image: 'https://picsum.photos/seed/design/600/400', hint: 'design system', tags: ['Figma', 'UI/UX'], category: 'Design', link: '#', screenshots: []},
   ];
}

const getPortfolioCategories = async () => {
    return [{id: 1, name: 'Web'}, {id: 2, name: 'Mobile'}, {id: 3, name: 'Design'}];
}

const getPageContent = async (section: string) => {
    if(section === 'hero') {
        return { title: 'Creative Developer & Designer', subtitle: 'MOHAMED AREF', description: 'I build beautiful, functional, and accessible digital experiences.', background: 'orb' };
    }
    if(section === 'about') {
        return {
          title: "Mohamed Aref", 
          description: "I am a passionate developer and designer with a knack for creating things that are both beautiful and useful.", 
          skills: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "Figma", "UI/UX Design"], 
          avatar: "https://yt3.googleusercontent.com/ytc/AIdro_n8R-S22Q-23v_h_2k2l_v0w_zX_zX_zX_zX=s176-c-k-c0x00ffffff-no-rj"
        };
    }
    if(section === 'process') {
        return [
            {"icon": "Lightbulb", "title": "Discovery & Strategy", "description": "We start by understanding your goals and mapping out a strategy for success.", "color": "text-blue-500"},
            {"icon": "PencilRuler", "title": "UI/UX Design", "description": "I design intuitive and beautiful interfaces that your users will love to interact with.", "color": "text-purple-500"},
            {"icon": "Code", "title": "Development", "description": "Bringing designs to life with clean, efficient, and scalable code.", "color": "text-orange-500"},
        ];
    }
    return null;
}

const getTestimonials = async () => {
    return [
        { id: 1, name: 'Alice Johnson', company: 'TechCorp', feedback: 'Working with Mohamed was a fantastic experience.', avatar: 'https://i.pravatar.cc/100?u=alice' },
        { id: 2, name: 'Bob Williams', company: 'Innovate Inc.', feedback: 'The final result exceeded our expectations.', avatar: 'https://i.pravatar.cc/100?u=bob' },
    ];
}


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
