
'use client';

import { usePathname } from 'next/navigation';
import {
  Home,
  Briefcase,
  Users,
  BarChart3,
  LayoutGrid,
  Menu,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import * as React from 'react';

const navItems = [
    { href: '/admin/core/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/workspace/meeting-room', label: 'Communications', icon: Users },
    {  
      label: 'Workspace', icon: LayoutGrid, 
      subItems: [
        { href: '/admin/workspace/clients', label: 'Clients' },
        { href: '/admin/workspace/tasks', label: 'Tasks' },
        { href: '/admin/workspace/projects', label: 'Projects' },
      ]
    },
    {  
      label: 'Portfolio', icon: Briefcase,
      subItems: [
        { href: '/admin/portfolio/projects', label: 'My Works' },
        { href: '/admin/portfolio/page-content', label: 'Page Content' },
      ]
    },
    { href: '/admin/core/reports', label: 'Reports', icon: BarChart3 },
];

const NavLink = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => {
    const pathname = usePathname();
    const Icon = item.icon;
    const isActive = pathname === item.href;

    if (item.subItems) {
      const isSubActive = item.subItems.some((subItem: any) => pathname.startsWith(subItem.href));
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors px-4 py-2 text-sm font-medium",
                isSubActive && "bg-foreground/10 text-foreground",
                isMobile && "w-full justify-start rounded-md text-lg h-auto py-3"
              )}
            >
              <Icon className={cn("h-5 w-5", isMobile && "mr-4")} />
              {item.label}
              {!isMobile && <ChevronDown className="ml-1 h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
            {item.subItems.map((subItem: any) => (
              <DropdownMenuItem key={subItem.href} asChild>
                <Link href={subItem.href}>{subItem.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    return (
      <Button
        variant="ghost"
        asChild
        className={cn(
          "rounded-full text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors px-4 py-2 text-sm font-medium",
          isActive && "bg-foreground/10 text-foreground",
          isMobile && "w-full justify-start rounded-md text-lg h-auto py-3"
        )}
      >
        <Link href={item.href}>
          <Icon className={cn("h-5 w-5", isMobile && "mr-4")} />
          {item.label}
        </Link>
      </Button>
    )
}

export default function AdminNav() {
  return (
    <>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => <NavLink key={item.label} item={item} />)}
        </nav>

        {/* Mobile Navigation Trigger */}
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] bg-background/90 backdrop-blur-xl">
                <div className="flex flex-col pt-12">
                <nav className="flex flex-col items-start space-y-2 text-lg font-medium">
                    {navItems.map((item) => (
                        <div key={item.label} className="w-full">
                            <NavLink item={item} isMobile />
                        </div>
                    ))}
                </nav>
                </div>
            </SheetContent>
        </Sheet>
    </>
  );
}
