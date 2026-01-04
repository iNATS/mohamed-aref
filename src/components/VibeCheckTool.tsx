'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getCodeFeedback, getVideoFeedback } from '@/app/vibe-check/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={cn("btn-glass rounded-full text-base w-full sm:w-auto")}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

function FeedbackDisplay({ feedback }: { feedback: string | null }) {
  if (!feedback) return null;
  return (
    <Card className="mt-8 bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot className="h-6 w-6 text-primary" />
          AI Vibe Check Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-foreground prose-p:text-foreground">
          {feedback.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const CodeFeedbackForm = () => {
  const initialState = { message: null, errors: {}, feedback: null };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch] = useActionState(getCodeFeedback, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.message === 'Success') {
        toast({ title: 'Feedback received!' });
        formRef.current?.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={dispatch}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code Snippet</Label>
          <Textarea id="code" name="code" placeholder="Paste your code here..." rows={15} className="font-mono" required />
          {state.errors?.code && <p className="text-sm font-medium text-destructive">{state.errors.code[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language (Optional)</Label>
          <Select name="language">
            <SelectTrigger id="language">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SubmitButton>Get Feedback</SubmitButton>
      </div>
      <FeedbackDisplay feedback={state.feedback} />
    </form>
  );
};

const VideoFeedbackForm = () => {
  const initialState = { message: null, errors: {}, feedback: null };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch] = useActionState(getVideoFeedback, initialState);
  const { toast } = useToast();
  const [fileName, setFileName] = useState('');
  const [videoDataUri, setVideoDataUri] = useState('');

  useEffect(() => {
    if (state.message) {
      if (state.message === 'Success') {
        toast({ title: 'Feedback received!' });
        formRef.current?.reset();
        setFileName('');
        setVideoDataUri('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoDataUri(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form ref={formRef} action={dispatch}>
      <input type="hidden" name="videoDataUri" value={videoDataUri} />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-upload">Video Edit</Label>
          <Label
            htmlFor="video-upload"
            className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border bg-secondary/50 hover:border-primary transition-colors"
          >
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">{fileName ? fileName : 'Click or drag to upload a video'}</p>
            </div>
          </Label>
          <Input id="video-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} />
          {state.errors?.videoDataUri && <p className="text-sm font-medium text-destructive">{state.errors.videoDataUri[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your video edit, goals, or areas you want feedback on."
            rows={5}
            required
          />
          {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
        </div>
        <SubmitButton>Get Feedback</SubmitButton>
      </div>
      <FeedbackDisplay feedback={state.feedback} />
    </form>
  );
};

export function VibeCheckTool() {
  return (
    <Tabs defaultValue="code" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="code">Code Feedback</TabsTrigger>
        <TabsTrigger value="video">Video Edit Feedback</TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Code Vibe Check</CardTitle>
            <CardDescription>
              Get AI-powered feedback on your code snippets for quality, efficiency, and best practices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeFeedbackForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="video">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Video Edit Vibe Check</CardTitle>
            <CardDescription>Upload a video edit and get constructive suggestions to improve your work.</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoFeedbackForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
