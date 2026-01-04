
'use client';

import { cn } from "@/lib/utils";

export function Gradient(props: any) {
    return (
        <div
            className={cn(
                'absolute inset-0 z-0 opacity-60',
                'bg-gradient-to-tr from-cyan-400/20 via-purple-400/20 to-pink-400/20'
            )}
            style={{
                background: `radial-gradient(600px at 50% 50%, hsla(0, 0%, 100%, 0.08), transparent 80%)`,
            }}
        />
    );
}

    