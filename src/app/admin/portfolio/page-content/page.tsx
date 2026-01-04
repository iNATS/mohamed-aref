
'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPageContent, getTestimonials } from '@/lib/db';
import { handlePageContentSave, handleAddTestimonial, handleTestimonialSave, handleRemoveTestimonial } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Testimonial = {
  id: number;
  name: string;
  company: string;
  feedback: string;
  avatar: string;
};

const defaultAboutContent = { title: '', description: '', skills: [], avatar: '' };

export default function PageContentPage() {
    const { toast } = useToast();
    const [heroContent, setHeroContent] = React.useState({ title: '', subtitle: '', description: '', background: 'orb' });
    const [aboutContent, setAboutContent] = React.useState(defaultAboutContent);
    const [processSteps, setProcessSteps] = React.useState<any[]>([]);
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            const [hero, about, process, testimonialsData] = await Promise.all([
                getPageContent('hero'),
                getPageContent('about'),
                getPageContent('process'),
                getTestimonials()
            ]);
            if (hero) setHeroContent(hero);
            if (about) {
                setAboutContent(about);
                setAvatarPreview(about.avatar);
            }
            if (process) setProcessSteps(process);
            if (testimonialsData) setTestimonials(testimonialsData as Testimonial[]);
        };
        fetchData();
    }, []);

    const onGenericSave = async (e: React.FormEvent<HTMLFormElement>, section: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await handlePageContentSave(section, formData);
        if(result.success) {
            toast({ title: 'Success', description: `${section} content updated!` });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error || `Failed to update ${section} content.` });
        }
    }
    
    const onAddTestimonial = async () => {
        await handleAddTestimonial();
        const data = await getTestimonials();
        setTestimonials(data as Testimonial[]);
        toast({ title: 'Success', description: 'New testimonial added.' });
    };

    const onRemoveTestimonial = async (id: number) => {
        await handleRemoveTestimonial(id);
        setTestimonials(testimonials.filter((t) => t.id !== id));
        toast({ title: 'Success', description: 'Testimonial removed.' });
    };

    const onTestimonialSave = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await handleTestimonialSave(id, formData);
        const data = await getTestimonials();
        setTestimonials(data as Testimonial[]);
        toast({ title: 'Success', description: 'Testimonial updated successfully!' });
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
            <h1 className="text-2xl font-bold">Page Content</h1>
        </div>
        <div className="flex-1 overflow-y-auto pb-8">
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                <CardHeader>
                <CardTitle>Manage Landing Page</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">
                    Update the content for the different sections of your landing page.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="hero">
                    
                    <AccordionItem value="hero">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-foreground/80">Hero Section</AccordionTrigger>
                    <AccordionContent>
                        <form className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10" onSubmit={(e) => onGenericSave(e, 'hero')}>
                        <div className="space-y-2">
                            <Label htmlFor="hero-title" className="text-zinc-700 dark:text-white/70">Title</Label>
                            <Input id="hero-title" name="title" defaultValue={heroContent.title} onChange={(e) => setHeroContent({...heroContent, title: e.target.value})} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hero-subtitle" className="text-zinc-700 dark:text-white/70">Subtitle</Label>
                            <Input id="hero-subtitle" name="subtitle" defaultValue={heroContent.subtitle} onChange={(e) => setHeroContent({...heroContent, subtitle: e.target.value})} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hero-description" className="text-zinc-700 dark:text-white/70">Description</Label>
                            <Textarea id="hero-description" name="description" defaultValue={heroContent.description} onChange={(e) => setHeroContent({...heroContent, description: e.target.value})} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hero-background" className="text-zinc-700 dark:text-white/70">Background</Label>
                            <Select name="background" value={heroContent.background} onValueChange={(value) => setHeroContent({ ...heroContent, background: value })}>
                                <SelectTrigger id="hero-background" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20">
                                    <SelectValue placeholder="Select a background" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                                    <SelectItem value="orb">Orb</SelectItem>
                                    <SelectItem value="gradient">Gradient</SelectItem>
                                    <SelectItem value="starfield">Starfield</SelectItem>
                                    <SelectItem value="noise">Noise</SelectItem>
                                    <SelectItem value="floatingLines">Floating Lines</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="rounded-lg" type="submit">Save Hero Content</Button>
                        </form>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="about">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-foreground/80">About Me Section</AccordionTrigger>
                    <AccordionContent>
                        <form className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10" onSubmit={(e) => onGenericSave(e, 'about')}>
                        <input type="hidden" name="currentAvatar" value={aboutContent.avatar || ''} />
                        <div className="space-y-2">
                            <Label className="text-zinc-700 dark:text-white/70">Avatar</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-20 h-20 border-2 border-zinc-200 dark:border-white/10">
                                    {avatarPreview && <AvatarImage src={avatarPreview} alt="Avatar Preview" />}
                                    <AvatarFallback>MA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Input id="avatar-upload" name="avatar" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                    <Label htmlFor="avatar-upload" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload New Image
                                    </Label>
                                    <p className="text-xs text-zinc-500 dark:text-white/50 mt-2">Recommended size: 200x200px. PNG or JPG.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about-title" className="text-zinc-700 dark:text-white/70">Title</Label>
                            <Input id="about-title" name="title" defaultValue={aboutContent.title} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about-description" className="text-zinc-700 dark:text-white/70">Description</Label>
                            <Textarea id="about-description" name="description" rows={4} defaultValue={aboutContent.description} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about-skills" className="text-zinc-700 dark:text-white/70">Skills (comma-separated)</Label>
                            <Textarea id="about-skills" name="skills" rows={3} defaultValue={Array.isArray(aboutContent.skills) ? aboutContent.skills.join(', ') : ''} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                        </div>
                        <Button className="rounded-lg" type="submit">Save About Content</Button>
                        </form>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="process">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-foreground/80">Process Section</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                         <p className="text-sm text-muted-foreground">This section is not currently editable.</p>
                        </div>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="testimonials">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-foreground/80">Testimonials Section</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10">
                        {testimonials.map((testimonial, index) => (
                            <form key={testimonial.id} className="space-y-3 p-3 rounded-md bg-black/5 dark:bg-white/5 border border-zinc-300 dark:border-white/10 relative" onSubmit={(e) => onTestimonialSave(e, testimonial.id)}>
                                <div className="space-y-2">
                                    <Label htmlFor={`testimonial-name-${index}`} className="text-zinc-700 dark:text-white/70">Name</Label>
                                    <Input id={`testimonial-name-${index}`} name="name" defaultValue={testimonial.name} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`testimonial-company-${index}`} className="text-zinc-700 dark:text-white/70">Company</Label>
                                    <Input id={`testimonial-company-${index}`} name="company" defaultValue={testimonial.company} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`testimonial-feedback-${index}`} className="text-zinc-700 dark:text-white/70">Feedback</Label>
                                    <Textarea id={`testimonial-feedback-${index}`} name="feedback" rows={3} defaultValue={testimonial.feedback} className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/20"/>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Button type="submit" size="sm" className="rounded-lg">Save Testimonial</Button>
                                    <Button type="button" variant="destructive" size="icon" className="rounded-full h-7 w-7" onClick={() => onRemoveTestimonial(testimonial.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </form>
                        ))}
                        <Button onClick={onAddTestimonial} variant="outline" className="w-full rounded-lg mt-4"><PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial</Button>
                        </div>
                    </AccordionContent>
                    </AccordionItem>

                </Accordion>
                </CardContent>
            </Card>
        </div>
    </>
  );
}
