
'use client';

import * as React from 'react';
import {
  Bell,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCheck,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
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

export function NotificationBell({ initialNotifications, onOpen }: { initialNotifications: Notification[], onOpen: () => Promise<void> }) {
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      if(audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      await onOpen();
      setNotifications(current => current.map(n => ({ ...n, is_read: true })));
    }
  };

  const handleItemClick = (notification: Notification) => {
    if (notification.link) {
      router.push(notification.link);
    }
    setIsOpen(false);
  };
  
  const handleClearAll = () => {
    // This would typically call a server action to delete all notifications
    setNotifications([]);
  };

  const formatDistanceToNow = (date: string) => {
      const d = new Date(date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if(days > 0) return `${days}d ago`;
      if(hours > 0) return `${hours}h ago`;
      if(minutes > 0) return `${minutes}m ago`;
      return `${seconds}s ago`;
  }

  return (
    <>
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && 
              <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 justify-center p-0 text-xs rounded-full">
                {unreadCount}
              </Badge>
            }
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 md:w-96 bg-background/80 backdrop-blur-xl p-0">
          <DropdownMenuLabel className="p-3 pb-2 flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs h-auto py-1 px-2">Clear All</Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="m-0" />
          <ScrollArea className="h-96">
            <div className="p-2">
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
                    >
                      <DropdownMenuItem 
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg mb-1 cursor-pointer transition-colors",
                          !notification.is_read ? "bg-blue-500/10" : ""
                        )}
                        onSelect={() => handleItemClick(notification)}
                      >
                         <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                         </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-sm leading-tight">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(notification.created_at)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground leading-snug">{notification.description}</p>
                        </div>
                         {!notification.is_read && <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500 mt-1"></div>}
                      </DropdownMenuItem>
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
                    <p>You have no new notifications.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
