
'use client';

import { motion } from 'framer-motion';

export function LandingPageMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="w-full bg-background"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
