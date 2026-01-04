'use client';
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { handleContactForm } from '@/lib/actions';

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="lg" disabled={pending} className="rounded-full text-base shadow-lg w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Message
        </Button>
    );
};

const ContactForm = () => {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(handleContactForm, { success: false, message: ''});

    useEffect(() => {
        if(state.success) {
            toast({
                variant: 'success',
                title: "Message Sent!",
                description: state.message,
            });
            formRef.current?.reset();
        } else if (state.message) {
             toast({
                variant: 'destructive',
                title: "Error",
                description: state.message,
            });
        }
    }, [state, toast]);
    
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Contact Me</h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-xl mx-auto">
            Have a project in mind or just want to say hello? Drop me a line.
          </p>
        </div>
        <form ref={formRef} action={formAction} className="grid gap-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80 dark:text-white/80">Your Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80 dark:text-white/80">Your Email</Label>
              <Input id="email" name="email" type="email" required placeholder="john.doe@example.com" className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground/80 dark:text-white/80">Your Message</Label>
            <Textarea id="message" name="message" required placeholder="I'd like to discuss..." rows={5} className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
          </div>
          <div className="flex justify-center sm:justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>
    );
  };

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });
  
    return (
      <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
        {children}
      </section>
    )
}

export function Contact() {
    return (
        <AnimatedSection id="contact" threshold={0.4}>
            <ContactForm />
        </AnimatedSection>
    )
}
