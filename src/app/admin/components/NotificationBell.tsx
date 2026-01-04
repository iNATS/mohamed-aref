
'use client';

import * as React from 'react';
import {
  Bell,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCheck
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { handleMarkNotificationsAsRead } from '@/lib/actions';

type Notification = {
    id: number;
    user_id: string;
    type: string;
    title: string;
    description: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const getNotificationIcon = (type: string) => {
    const iconClass = "h-6 w-6";
    switch (type) {
        case 'client': return <Users className={cn(iconClass, "text-blue-500")} />;
        case 'project': return <Briefcase className={cn(iconClass, "text-purple-500")} />;
        case 'task_overdue': return <AlertTriangle className={cn(iconClass, "text-red-500")} />;
        case 'task_completed': return <CheckCheck className={cn(iconClass, "text-green-500")} />;
        default: return <Bell className={cn(iconClass, "text-zinc-500")} />;
    }
}

export function NotificationBell({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = React.useState(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const onOpenChange = async (isOpen: boolean) => {
    if (isOpen && unreadCount > 0) {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      await handleMarkNotificationsAsRead(unreadIds);
      // Optimistically update UI
      setNotifications(current => current.map(n => ({ ...n, is_read: true })));
    }
  };

  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background/90 backdrop-blur-xl p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex justify-between items-center">
            <span>Notifications</span>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4.5rem)]">
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border",
                      notification.is_read
                        ? "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                        : "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40"
                    )}
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <Link href={notification.link || '#'} className="flex-grow">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-base">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </Link>
                    {!notification.is_read && <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500 mt-2.5"></div>}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground"
                >
                  <Bell className="mx-auto h-12 w-12 mb-4 text-zinc-400 dark:text-zinc-600" />
                  <h3 className="text-lg font-semibold">All caught up!</h3>
                  <p>You have no notifications.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
