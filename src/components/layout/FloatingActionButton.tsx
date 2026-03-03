'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function FloatingActionButton() {
  return (
    <Link
      href="/report"
      aria-label="Report an issue"
      className="fixed bottom-20 right-4 z-40"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[var(--color-accent)] rounded-full flex items-center justify-center"
        style={{
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
        }}
      >
        <Plus size={24} color="white" strokeWidth={2.5} />
      </motion.div>
    </Link>
  );
}
