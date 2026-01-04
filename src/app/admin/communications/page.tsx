
'use client';

import * as React from 'react';
import {
  Archive,
  File,
  Inbox,
  Send,
  Trash2,
  Search,
  Mail,
  Star,
  Clock,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  Paperclip,
  Smile,
  Edit,
  Calendar as CalendarIcon,
  Video,
  Plus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
  } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MailDisplay } from '@/components/admin/MailDisplay';
import type { Client } from '../clients/page';


export type Meeting = {
    id: number,
    title: string,
    time: Date,
    duration: string,
    participants: { name: string, avatar: string }[],
    meetLink: string,
    client_id: number,
}
type MailboxType = 'inbox' | 'starred' | 'sent' | 'snoozed' | 'archive' | 'trash';

const ComposeDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    const { toast } = useToast();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would handle email sending via a server action
        toast({ title: "Email Sent!", description: "Your message has been sent successfully." });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="to" className="text-right">To</Label>
                        <Input id="to" name="to" type="email" required className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" placeholder="recipient@example.com" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">Subject</Label>
                        <Input id="subject" name="subject" required className="col-span-3 bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                    </div>
                    <Textarea name="body" rows={10} className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" placeholder="Write your message here..."/>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="gap-2"><Send className="h-4 w-4"/>Send</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const MailView = () => {
    const [isComposeOpen, setIsComposeOpen] = React.useState(false);
   
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
            <Mail className="mx-auto h-16 w-16 mb-4 text-zinc-400 dark:text-zinc-600"/>
            <h3 className="text-xl font-semibold mb-2">Email Integration Not Configured</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
                To enable email functionality, you need to configure your mail provider (e.g., Resend, SMTP) in the settings.
            </p>
            <Button className="mt-6 rounded-lg" asChild>
                <Link href="/admin/settings">Go to Settings</Link>
            </Button>
            <Button className="mt-2 rounded-lg" variant="secondary" onClick={() => setIsComposeOpen(true)}>
                Open Demo Compose
            </Button>
            <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
        </div>
    )
}

const ScheduleMeetingForm = ({ onSave, onCancel, meetingToEdit, clients }: { onSave: (meeting: Omit<Meeting, 'id' | 'participants' | 'meetLink'> & {id?: number, meetLink?: string}) => void; onCancel: () => void, meetingToEdit?: Meeting | null, clients: Client[] }) => {
    const [title, setTitle] = React.useState(meetingToEdit?.title || '');
    const [date, setDate] = React.useState<Date | undefined>(meetingToEdit ? new Date(meetingToEdit.time) : new Date());
    const [contactId, setContactId] = React.useState(String(meetingToEdit?.client_id || ''));
    const [notes, setNotes] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !contactId) {
            alert('Please fill all required fields.');
            return;
        }

        const newMeeting = {
            id: meetingToEdit?.id,
            title,
            time: date,
            duration: '30 min',
            client_id: Number(contactId),
            meetLink: meetingToEdit?.meetLink
        };
        onSave(newMeeting as any);
    };

    const formatDate = (date: Date, format: string) => {
        // A simple date formatter, you might want to use a library like date-fns for more complex needs
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Project Sync-up" required className="bg-black/5 dark:bg-white/10"/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                 <Select onValueChange={setContactId} value={contactId} required>
                    <SelectTrigger id="contact" className="bg-black/5 dark:bg-white/10">
                        <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10">
                        {clients.map(contact => (
                            <SelectItem key={contact.id} value={String(contact.id)}>{contact.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Date & Time</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal bg-black/5 dark:bg-white/10",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? formatDate(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10">
                        <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agenda, topics to discuss, etc." className="bg-black/5 dark:bg-white/10"/>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg">Cancel</Button>
                <Button type="submit" className="rounded-lg">Save Meeting</Button>
            </div>
        </form>
    )
}

const MeetingsView = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);
    const [clients, setClients] = React.useState<Client[]>([]);
    const [isScheduling, setIsScheduling] = React.useState(false);
    const [meetingToEdit, setMeetingToEdit] = React.useState<Meeting | null>(null);
    const { toast } = useToast();

    const fetchMeetings = React.useCallback(async () => {
        // Mock data
        const clientsData: Client[] = [
          { id: '1', name: 'Innovate Inc.', email: 'contact@innovate.com', avatar: 'https://i.pravatar.cc/100?u=innovate', status: 'active', company: 'Innovate Inc.', phone: '555-0101', address: '123 Tech Avenue, Silicon Valley', notes: 'Leading tech startup.'},
          { id: '2', name: 'Creative Solutions', email: 'hello@creative.co', avatar: 'https://i.pravatar.cc/100?u=creative', status: 'active', company: 'Creative Solutions LLC', phone: '555-0102', address: '456 Design Drive, Arts District', notes: 'Design agency.'},
        ];
        const meetingsData = [
            { id: 1, title: 'Project Phoenix Weekly Sync', time: new Date(new Date().setDate(new Date().getDate() + 2)), duration: '30 min', meetLink: 'https://meet.google.com/abc-def-ghi', client_id: 1},
            { id: 2, title: 'Creative Co. Kick-off', time: new Date(new Date().setDate(new Date().getDate() + 5)), duration: '1 hour', meetLink: 'https://meet.google.com/jkl-mno-pqr', client_id: 2},
        ];

        setClients(clientsData);

        const populatedMeetings = meetingsData.map(m => {
            const client = clientsData.find(c => String(c.id) === String(m.client_id));
            return {
                ...m,
                time: new Date(m.time),
                participants: client ? [
                    { name: client.name, avatar: client.avatar },
                    { name: 'You', avatar: '' }
                ] : [{ name: 'You', avatar: '' }]
            };
        });
        setMeetings(populatedMeetings as Meeting[]);
    }, []);

    React.useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const handleSaveMeeting = async (meeting: Omit<Meeting, 'id' | 'participants' | 'meetLink'> & {id?: number, meetLink?: string}) => {
        if (meeting.id) {
             const updatedMeeting = { ...meeting, participants: [], meetLink: meeting.meetLink || '' };
            setMeetings(prev => prev.map(m => m.id === meeting.id ? updatedMeeting as Meeting : m));
            toast({ title: "Meeting Updated!" });
        } else {
            const newMeeting = { ...meeting, id: Math.random(), participants: [], meetLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`};
            setMeetings(prev => [...prev, newMeeting as Meeting]);
            toast({ title: "Meeting Scheduled!" });
        }
        await fetchMeetings(); // re-fetch to get correct participant info
        setIsScheduling(false);
        setMeetingToEdit(null);
    };

    const handleEditClick = (meeting: Meeting) => {
        setMeetingToEdit(meeting);
        setDate(new Date(meeting.time));
        setIsScheduling(true);
    };
    
    const handleDeleteMeeting = async (meetingId: number) => {
        setMeetings(prev => prev.filter(m => m.id !== meetingId));
        toast({ title: "Meeting Canceled" });
    };

    const handleCloseDialog = () => {
        setIsScheduling(false);
        setMeetingToEdit(null);
    };

    const filteredMeetings = React.useMemo(() => {
        if (!date) return [];
        return meetings.filter(meeting => new Date(meeting.time).toDateString() === date.toDateString());
    }, [date, meetings]);
    
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: true });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1">
                 <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                    <CardContent className="p-0">
                        <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full"
                        />
                    </CardContent>
                 </Card>
                 <Dialog open={isScheduling} onOpenChange={handleCloseDialog}>
                    <DialogTrigger asChild>
                        <Button className="w-full mt-4 rounded-lg gap-2" onClick={() => setIsScheduling(true)}>
                            <Plus className="h-4 w-4" />
                            Schedule New Meeting
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10">
                        <DialogHeader>
                            <DialogTitle>{meetingToEdit ? 'Edit Meeting' : 'Schedule a New Meeting'}</DialogTitle>
                            <DialogDescription>
                                {meetingToEdit ? 'Update the details for your meeting.' : 'Fill in the details to add a new meeting to your calendar.'}
                            </DialogDescription>
                        </DialogHeader>
                        <ScheduleMeetingForm onSave={handleSaveMeeting} onCancel={handleCloseDialog} meetingToEdit={meetingToEdit} clients={clients} />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="lg:col-span-2">
                <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-full">
                    <CardHeader>
                        <CardTitle>
                            {date ? `Meetings on ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : 'Upcoming Meetings'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-22rem)]">
                        <div className="space-y-4">
                            {filteredMeetings.length > 0 ? filteredMeetings.map(meeting => (
                                <div key={meeting.id} className="flex items-center gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-zinc-200/50 dark:border-white/10">
                                    <div className="flex flex-col items-center justify-center w-20">
                                        <span className="text-lg font-bold">{formatTime(meeting.time)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{meeting.title}</h4>
                                        <p className="text-sm text-muted-foreground">{meeting.duration}</p>
                                         <div className="flex items-center gap-2 mt-1">
                                            {meeting.participants.map(p => (
                                                <Avatar key={p.name} className="h-6 w-6 border-2 border-background">
                                                    <AvatarImage src={p.avatar} />
                                                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button asChild className="rounded-lg gap-2">
                                            <Link href={meeting.meetLink || 'https://meet.google.com'} target="_blank" rel="noopener noreferrer">
                                                <Video className="h-4 w-4" />
                                                Join
                                            </Link>
                                        </Button>
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10">
                                                <DropdownMenuItem onSelect={() => handleEditClick(meeting)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onSelect={() => handleDeleteMeeting(meeting.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-10">No meetings scheduled for this day.</p>
                            )}
                        </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function CommunicationsPage() {
  
  const navItems: { id: "inbox" | "meetings"; label: string; icon: React.ElementType }[] = [
      { id: 'inbox', label: 'Inbox', icon: Mail },
      { id: 'meetings', label: 'Meetings', icon: Video },
  ];

  return (
    <>
        <Tabs defaultValue="meetings" className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="flex items-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Communications</h1>
                </div>
                <div className="w-full">
                    <TabsList className="mb-4 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-auto p-2 w-full max-w-sm">
                    {navItems.map(item => (
                        <TabsTrigger key={item.id} value={item.id} className="w-full flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:text-white">
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </TabsTrigger>
                    ))}
                    </TabsList>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-4">
                <TabsContent value="inbox" className="h-full mt-0">
                  <MailView />
                </TabsContent>
                <TabsContent value="meetings" className="h-full mt-0">
                  <MeetingsView />
                </TabsContent>
            </div>
      </Tabs>
    </>
  );
}

    