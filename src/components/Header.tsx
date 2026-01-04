
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Menu, Gem } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useActiveSection } from '@/hooks/use-active-section';

export function Header() {
  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#projects', label: 'Projects' },
    { href: '#about', label: 'About' },
    { href: '#process', label: 'Process' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ];

  const activeSection = useActiveSection(navLinks.map(l => l.href.substring(1)));

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-fit mx-auto">
      <div className="hidden md:flex items-center justify-center p-2 rounded-full shadow-lg backdrop-blur-lg bg-background/70 dark:bg-background/50 border border-foreground/10">
        <Link href="/" className="mr-4 flex items-center space-x-2 px-2">
          <Gem className="h-6 w-6 text-primary" />
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors px-4 py-2",
                `#${activeSection}` === link.href && "bg-foreground/10 text-foreground"
              )}
            >
              <Link href={link.href}>
                {link.label}
              </Link>
            </Button>
          ))}
           <Button
              variant="ghost"
              asChild
              className={cn(
                "rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors px-4 py-2"
              )}
            >
              <Link href="/admin">Admin Panel</Link>
            </Button>
        </nav>

        <div className="flex items-center gap-1 pl-2">
           <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>العربية (Arabic)</DropdownMenuItem>
              <DropdownMenuItem>Français (French)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 shadow-lg">
         <Link href="/" className="flex items-center space-x-2 pl-2">
           <Gem className="h-6 w-6 text-primary" />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] bg-background/90 backdrop-blur-xl">
            <div className="flex flex-col pt-12">
              <nav className="flex flex-col items-start space-y-2 text-lg font-medium">
                {navLinks.map((link) => (
                   <Button key={link.href} variant="link" asChild className="text-foreground/80 hover:text-primary w-full justify-start text-left text-2xl py-6">
                    <Link href={link.href}>
                      {link.label}
                    </Link>
                  </Button>
                ))}
                 <Button variant="link" asChild className="text-foreground/80 hover:text-primary w-full justify-start text-left text-2xl py-6">
                    <Link href="/admin">
                      Admin Panel
                    </Link>
                  </Button>
              </nav>
            </div>
             <div className="absolute bottom-8 left-4 right-4 flex items-center gap-2">
                <ThemeToggle />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start btn-glass")}>
                    <Globe className="mr-2 h-5 w-5" />
                    <span>Change language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[calc(80vw-2rem)]">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>العربية (Arabic)</DropdownMenuItem>
                  <DropdownMenuItem>Français (French)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
