
import { login } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gem } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <Gem className="h-10 w-10 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">Admin Sign In</h1>
                    <p className="text-sm text-muted-foreground">
                    Enter your credentials to access the dashboard
                    </p>
                </div>
                <form className="w-full space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="bg-background"
                        defaultValue="admin@example.com"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required  className="bg-background" defaultValue="password" />
                    </div>
                    <Button formAction={login} className="w-full rounded-lg">
                        Sign In
                    </Button>
                    {searchParams.message && (
                    <p className="text-center text-sm font-medium text-destructive">
                        {searchParams.message}
                    </p>
                    )}
                </form>
            </div>
        </main>
        <Footer />
    </div>
  );
}
