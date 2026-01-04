
'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, KeyRound, Bell, Languages, Mail, MessageSquare, BarChart, Settings2, Code, Bot, FolderKanban, Trash2, PlusCircle, Info, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPortfolioCategories } from '@/lib/db';
import { handleAddPortfolioCategory, handleDeletePortfolioCategory, handleProfileUpdate, testSupabaseConnection } from '@/lib/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';

type Category = {
    id: number;
    name: string;
};

const PortfolioCategoryManager = () => {
    const { toast } = useToast();
    const [categories, setCategories] = React.useState<Category[]>([]);
    const formRef = React.useRef<HTMLFormElement>(null);

    const fetchCategories = React.useCallback(async () => {
        const cats = await getPortfolioCategories();
        setCategories(cats);
    }, []);

    React.useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async (formData: FormData) => {
        const result = await handleAddPortfolioCategory(formData);
        if (result.success) {
            toast({ title: 'Category Added' });
            fetchCategories();
            formRef.current?.reset();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };

    const handleDelete = async (id: number) => {
        const result = await handleDeletePortfolioCategory(id);
        if (result.success) {
            toast({ title: 'Category Deleted' });
            fetchCategories();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };

    return (
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FolderKanban className="h-5 w-5" /> Portfolio Categories</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Manage the categories for your portfolio projects.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleAddCategory} ref={formRef} className="flex items-center gap-2 mb-4">
                    <Input name="name" placeholder="New category name..." className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                    <Button type="submit" className="rounded-lg gap-2">
                        <PlusCircle className="h-4 w-4" /> Add
                    </Button>
                </form>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5">
                            <span className="font-medium text-sm">{cat.name}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={() => handleDelete(cat.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const MailSettingsForm = () => {
    const [provider, setProvider] = React.useState('resend');
    const { toast } = useToast();

    return (
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" />Communication</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Configure your mail and chat settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10">
                    <h4 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Mail Server</h4>
                    <Select value={provider} onValueChange={setProvider}>
                        <SelectTrigger className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                            <SelectValue placeholder="Select mail provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                            <SelectItem value="resend">Resend</SelectItem>
                            <SelectItem value="smtp">SMTP</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Configuration via Environment Variables</AlertTitle>
                        <AlertDescription>
                            Mail settings are configured securely via the <strong>.env</strong> file. Update the file with your credentials. The application needs to be restarted for changes to take effect.
                        </AlertDescription>
                    </Alert>

                    {provider === 'resend' && (
                        <div className="space-y-2 pt-2">
                             <Label className="text-sm text-muted-foreground">Set the following variable in your .env file:</Label>
                             <div className="p-2 bg-black/10 dark:bg-white/10 rounded-md text-sm font-mono">
                                RESEND_API_KEY=your_api_key_here
                             </div>
                        </div>
                    )}

                    {provider === 'smtp' && (
                        <div className="space-y-4 pt-2">
                             <Label className="text-sm text-muted-foreground">Set the following variables in your .env file:</Label>
                             <div className="p-3 bg-black/10 dark:bg-white/10 rounded-md text-sm font-mono space-y-1">
                                <p>SMTP_HOST=your_host</p>
                                <p>SMTP_PORT=your_port</p>
                                <p>SMTP_USER=your_username</p>
                                <p>SMTP_PASS=your_password</p>
                                <p>SMTP_FROM=your_from_email</p>
                             </div>
                        </div>
                    )}

                </div>
                 <div className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10">
                     <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Chat Widget</h4>
                        <Switch id="chat-enabled" />
                     </div>
                     <p className="text-sm text-zinc-600 dark:text-white/60">Enable or disable the customer chat widget on your portfolio.</p>
                    <div className="space-y-2">
                        <Label htmlFor="chat-script">Chat Provider Script/ID</Label>
                        <Textarea id="chat-script" placeholder="Paste your chat widget script or ID here" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10 text-xs" rows={3}/>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <Button onClick={() => toast({title: "Settings Information", description: "Chat widget settings saved."})} className="rounded-lg">Save Communication</Button>
                </div>
            </CardContent>
        </Card>
    );
}

const DatabaseSettingsForm = () => {
    const { toast } = useToast();
    const [supabaseUrl, setSupabaseUrl] = React.useState(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
    const [supabaseAnonKey, setSupabaseAnonKey] = React.useState(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
    const [isTesting, setIsTesting] = React.useState(false);

    const handleTestConnection = async () => {
        if (!supabaseUrl || !supabaseAnonKey) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter both Supabase URL and Anon Key.' });
            return;
        }
        setIsTesting(true);
        const result = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
        setIsTesting(false);
        if (result.success) {
            toast({ variant: 'success', title: 'Connection Successful!', description: 'Supabase connection is working.' });
        } else {
            toast({ variant: 'destructive', title: 'Connection Failed', description: result.error });
        }
    };
    
    const handleSave = () => {
        toast({ title: 'Information', description: 'Update your .env file with these values and restart the application to apply.' });
    };

    return (
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Database Connection</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Configure your connection to a Supabase project.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Environment Variables</AlertTitle>
                        <AlertDescription>
                            Your Supabase credentials should be stored in the <strong>.env</strong> file. This form allows you to test them.
                        </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        <Label htmlFor="supabase-url">Supabase Project URL</Label>
                        <Input id="supabase-url" value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} placeholder="https://your-project.supabase.co" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supabase-anon-key">Supabase Anon Key</Label>
                        <Input id="supabase-anon-key" value={supabaseAnonKey} onChange={(e) => setSupabaseAnonKey(e.target.value)} type="password" placeholder="ey..." className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleTestConnection} className="rounded-lg" disabled={isTesting}>
                            {isTesting ? 'Testing...' : 'Test Connection'}
                        </Button>
                        <Button type="button" onClick={handleSave} className="rounded-lg">Save</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default function SettingsPage() {
    const { toast } = useToast();
    const [profileState, formAction] = useActionState(handleProfileUpdate, { success: false, message: ''});
    const [profile, setProfile] = React.useState({
        name: '',
        title: '',
        bio: '',
        avatar: ''
    });

    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const profileData = {
                    name: user.user_metadata.full_name || '',
                    title: user.user_metadata.title || '',
                    bio: user.user_metadata.bio || '',
                    avatar: user.user_metadata.avatar_url || ''
                }
                setProfile(profileData);
                setAvatarPreview(profileData.avatar);
            }
        };
        fetchProfile();
    }, []);
    
    React.useEffect(() => {
        if (profileState.message) {
            if (profileState.success) {
                toast({ title: 'Success', description: profileState.message });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: profileState.message });
            }
        }
    }, [profileState, toast]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>, section: string) => {
        e.preventDefault();
        toast({
            title: 'Settings Saved',
            description: `${section} settings have been updated.`,
        });
    };
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
        }
    };

  return (
    <>
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      <div className="flex-1 overflow-y-auto pb-8">
         <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl mb-8 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-lg">Integrations</TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-lg">Portfolio</TabsTrigger>
            <TabsTrigger value="database" className="rounded-lg">Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Update your public profile details.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" action={formAction}>
                     <input type="hidden" name="currentAvatar" value={profile.avatar} />
                    <div className="space-y-2">
                        <Label>Avatar</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20 border-2 border-zinc-200 dark:border-white/10">
                                {avatarPreview && <AvatarImage src={avatarPreview} alt="Avatar Preview" />}
                                <AvatarFallback>MA</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Input id="avatar-upload" name="avatar" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                <Label htmlFor="avatar-upload" className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload New Image
                                </Label>
                                <p className="text-xs text-zinc-500 dark:text-white/50 mt-2">PNG, JPG, WEBP up to 5MB.</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" defaultValue={profile.name} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="title">Professional Title</Label>
                            <Input id="title" name="title" defaultValue={profile.title} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Public Bio</Label>
                        <Textarea id="bio" name="bio" defaultValue={profile.bio} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="rounded-lg">Save Profile</Button>
                    </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" />Security</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Manage your account security settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={(e) => handleFormSubmit(e, 'Security')}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="mohamed.aref@example.com" readOnly className="bg-black/10 dark:bg-white/10 border-zinc-300 dark:border-white/10 cursor-not-allowed" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="rounded-lg">Update Password</Button>
                    </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
             <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                    <div>
                        <Label htmlFor="task-overdue-notif" className="font-semibold">Overdue Tasks</Label>
                        <p className="text-sm text-zinc-600 dark:text-white/60">Notify me when a task becomes overdue.</p>
                    </div>
                    <Switch id="task-overdue-notif" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                    <div>
                        <Label htmlFor="client-message-notif" className="font-semibold">New Client Messages</Label>
                        <p className="text-sm text-zinc-600 dark:text-white/60">Send an email when a new message is received.</p>
                    </div>
                    <Switch id="client-message-notif" />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                    <div>
                        <Label htmlFor="project-complete-notif" className="font-semibold">Project Completion</Label>
                        <p className="text-sm text-zinc-600 dark:text-white/60">Get a summary when a project is marked as complete.</p>
                    </div>
                    <Switch id="project-complete-notif" defaultChecked />
                </div>
              </CardContent>
            </Card>

             <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Languages className="h-5 w-5" />Language</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Choose your preferred language for the interface.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Select defaultValue="en">
                    <SelectTrigger className="max-w-xs bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                    </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5" />Marketing & Analytics</CardTitle>
                        <CardDescription className="text-zinc-600 dark:text-white/60">Connect your marketing and analytics tools.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="ga-id" className="flex items-center gap-2"><Code className="h-4 w-4" /> Google Analytics ID</Label>
                            <Input id="ga-id" placeholder="G-XXXXXXXXXX" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta-pixel" className="flex items-center gap-2"><Bot className="h-4 w-4" /> Meta Pixel ID</Label>
                            <Input id="meta-pixel" placeholder="Your Meta Pixel ID" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                         <div className="flex justify-end">
                            <Button type="submit" className="rounded-lg">Save Analytics</Button>
                        </div>
                    </CardContent>
                </Card>
                <MailSettingsForm />
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioCategoryManager />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseSettingsForm />
          </TabsContent>

        </Tabs>
      </div>
    </>
  );
}
