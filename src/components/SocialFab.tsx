
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Linkedin, MessageSquare, Phone, Twitter, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91z" />
      <path d="M16.99 13.56c-.28-.14-1.68-.83-1.94-.93-.26-.1-.45-.15-.64.15-.19.3-.73.93-.9 1.12-.17.19-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.43-.85-.76-1.42-1.71-1.6-2-.17-.29-.01-.45.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.3-.49.09-.19.05-.38-.02-.52-.08-.14-.64-1.54-.87-2.11-.23-.57-.46-.49-.64-.5-.17-.01-.36-.01-.54-.01-.18 0-.48.07-.73.35s-.97.95-.97 2.32c0 1.37 1 2.69 1.14 2.88.14.19 1.98 3.01 4.8 4.25 2.82 1.24 2.82.83 3.34.78.52-.05 1.68-.68 1.92-1.33.24-.64.24-1.19.17-1.33-.07-.15-.26-.22-.54-.37z" />
    </svg>
  );
  

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const XIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

export function SocialFab() {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    {
        label: 'Phone',
        href: 'tel:+1234567890', // Replace with your phone number
        icon: <Phone strokeWidth={2.5} className="h-6 w-6" />,
      },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/1234567890', // Replace with your WhatsApp number
      icon: <WhatsAppIcon strokeWidth={1.5} className="h-6 w-6" />,
    },
    {
        label: 'Facebook',
        href: 'https://facebook.com', // Replace with your Facebook profile
        icon: <FacebookIcon strokeWidth={2.5} className="h-6 w-6" />,
      },
      {
        label: 'Instagram',
        href: 'https://instagram.com', // Replace with your Instagram profile
        icon: <InstagramIcon strokeWidth={2.5} className="h-6 w-6" />,
      },
    {
      label: 'Twitter',
      href: 'https://twitter.com', // Replace with your Twitter profile
      icon: <XIconSvg className="h-5 w-5" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com', // Replace with your LinkedIn profile
      icon: <Linkedin strokeWidth={2.5} className="h-6 w-6" />,
    },
  ];

  const handleMainButtonClick = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {socialLinks.map((link, index) => (
        <Button
          key={link.label}
          asChild
          size="icon"
          className={cn(
            'rounded-full w-14 h-14 bg-background/60 backdrop-blur-sm border border-border/40 text-foreground shadow-lg transition-all duration-300 ease-in-out',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          )}
          style={{ transitionDelay: isOpen ? `${index * 50}ms` : `${(socialLinks.length - index - 1) * 50}ms` }}
          aria-label={link.label}
        >
          <Link href={link.href} target="_blank" rel="noreferrer">
            {link.icon}
          </Link>
        </Button>
      ))}
      <Button
        size="icon"
        className="rounded-full shadow-lg w-14 h-14"
        onClick={handleMainButtonClick}
        onMouseEnter={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Toggle social media links"
      >
        <div className="relative h-full w-full flex items-center justify-center">
          <MessageSquare
            strokeWidth={2.5}
            className={cn(
              'absolute transition-all duration-300 ease-in-out h-6 w-6',
              isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <X
            strokeWidth={2.5}
            className={cn(
              'absolute transition-all duration-300 ease-in-out h-6 w-6',
              isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            )}
          />
        </div>
      </Button>
    </div>
  );
}
