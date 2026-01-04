
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
import { createServerClient } from '@/lib/supabase/server';
import { getNotifications, markNotificationsAsRead } from '@/lib/db';
import { cookies } from 'next/headers';
import { logout } from '@/lib/actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  const notifications = await getNotifications(supabase);

  const handleMarkRead = async () => {
    'use server'
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    await markNotificationsAsRead(supabase);
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-fit mx-auto">
        <div className="flex items-center justify-between p-2 rounded-full shadow-lg dark:shadow-none backdrop-blur-lg bg-background/70 dark:bg-background/50 border border-foreground/10">
          
          <AdminNav />
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <NotificationBell initialNotifications={notifications as any[]} onOpen={handleMarkRead} />
           
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
                <form action={logout}>
                    <button type="submit" className="w-full">
                         <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </button>
                </form>
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
