import {
  Settings,
  Shield,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import { NotificationBell } from './components/NotificationBell';
import AdminNav from './components/AdminNav';

// Mock user data as there is no DB
const user = {
    user_metadata: {
        avatar_url: 'https://i.pravatar.cc/100?u=admin',
        full_name: 'Admin User'
    },
    email: 'admin@example.com'
}

// Mock notifications as there is no DB
const notifications = [
    { id: 1, user_id: '1', type: 'task_overdue', title: 'Task Overdue: Initial Mockups', description: 'The task "Initial Mockups" was due yesterday.', link: '/admin/tasks', is_read: false, created_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
    { id: 2, user_id: '1', type: 'client', title: 'New Client Added', description: 'You\'ve added a new client: Global Goods.', link: '/admin/clients', is_read: true, created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-fit mx-auto">
        <div className="flex items-center justify-between p-2 rounded-full shadow-lg backdrop-blur-lg bg-background/70 dark:bg-background/50 border border-foreground/10">
          
          <AdminNav />
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <NotificationBell initialNotifications={notifications} />
           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                    <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || 'Admin'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/admin/settings"><Shield className="mr-2 h-4 w-4" /><span>Security</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <button type="submit" className="w-full text-left flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
          {children}
      </main>
    </div>
  );
}
