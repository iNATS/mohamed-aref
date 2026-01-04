
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
  MessageSquare,
  FolderKanban,
  ListTodo,
  FileBarChart,
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
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/communications', label: 'Communications', icon: MessageSquare },
    {  
      label: 'Workspace', icon: LayoutGrid, 
      subItems: [
        { href: '/admin/clients', label: 'Clients', icon: Users },
        { href: '/admin/projects', label: 'Projects', icon: Briefcase },
        { href: '/admin/tasks', label: 'Tasks', icon: ListTodo },
      ]
    },
    {  
      label: 'Portfolio', icon: Briefcase,
      subItems: [
        { href: '/admin/portfolio/projects', label: 'My Works', icon: FolderKanban },
        { href: '/admin/portfolio/page-content', label: 'Page Content', icon: Users },
      ]
    },
    { href: '/admin/reports', label: 'Reports', icon: FileBarChart },
];

const NavLink = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => {
    const pathname = usePathname();
    const Icon = item.icon;

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
                <Link href={subItem.href} className="flex items-center gap-2">
                  {subItem.icon && <subItem.icon className="h-4 w-4 text-foreground/60" />}
                  {subItem.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    const isActive = pathname === item.href;
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
