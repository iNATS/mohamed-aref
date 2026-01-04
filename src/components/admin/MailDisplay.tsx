
'use client';

import * as React from 'react';
import {
  Archive,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Trash2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
  } from '@/components/ui/dialog';
import { format } from 'date-fns';

export type MailboxItem = {
    id: string;
    name: string;
    email: string;
    subject: string;
    text: string;
    date: string;
    read: boolean;
    avatar: string;
    starred?: boolean;
    sent?: boolean;
    archived?: boolean;
    trash?: boolean;
};

export const MailDisplay = ({ selectedEmail, onOpenChange, onAction }: { selectedEmail: MailboxItem | null; onOpenChange: (open: boolean) => void; onAction: (action: string, emailId: string) => void; }) => {
    const [formattedDate, setFormattedDate] = React.useState('');

    React.useEffect(() => {
        if (selectedEmail?.date) {
            setFormattedDate(format(new Date(selectedEmail.date), 'PPpp'));
        }
    }, [selectedEmail?.date]);

  if (!selectedEmail) {
    return null;
  }

  const handleAction = (action: string) => {
      onAction(action, selectedEmail.id);
  }

  return (
    <Dialog open={!!selectedEmail} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex flex-col h-[90vh] max-h-[800px] w-[90vw] max-w-4xl p-0">
          <DialogHeader className="p-4 border-b border-zinc-200/80 dark:border-white/10">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-zinc-200 dark:border-white/20">
                  <AvatarImage src={selectedEmail.avatar} alt={selectedEmail.name} />
                  <AvatarFallback>{selectedEmail.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-left">{selectedEmail.name}</p>
                  <DialogDescription className="text-sm text-muted-foreground text-left">{`to me <mohamed.aref@example.com>`}</DialogDescription>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {formattedDate && <span className="text-xs text-muted-foreground">{formattedDate}</span>}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                    <DropdownMenuItem onClick={() => handleAction('reply')}><Reply className="mr-2 h-4 w-4" />Reply</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('reply-all')}><ReplyAll className="mr-2 h-4 w-4" />Reply All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('forward')}><Forward className="mr-2 h-4 w-4" />Forward</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAction('archive')}><Archive className="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-white" onClick={() => handleAction('delete')}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
             <DialogTitle className="text-xl font-bold mb-4 p-6 pb-0">{selectedEmail.subject}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="p-6 pt-0">
              <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                {selectedEmail.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-zinc-200/80 dark:border-white/10">
            <Textarea placeholder="Click here to reply..." className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><Smile className="h-4 w-4" /></Button>
              </div>
              <Button onClick={() => handleAction('send-reply')} className="rounded-lg gap-2">Send <Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </DialogContent>
    </Dialog>
  );
};
