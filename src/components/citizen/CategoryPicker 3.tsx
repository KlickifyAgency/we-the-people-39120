'use client';

import { ReportCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CategoryPickerProps {
  selected: ReportCategory | null;
  onSelect: (category: ReportCategory) => void;
}

const CATEGORY_ORDER: ReportCategory[] = [
  'graffiti', 'dumping', 'abandoned_vehicle', 'property_neglect',
  'noise', 'street_issues', 'vegetation', 'animal',
  'safety_hazard', 'water_drainage',
];

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <div>
      <p className="text-xl font-bold text-gray-900 mb-4">What's the issue?</p>
      <div className="grid grid-cols-2 gap-3" role="listbox" aria-label="Issue category">
        {CATEGORY_ORDER.map((key) => {
          const cat = CATEGORIES[key];
          const isSelected = selected === key;
          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(key)}
              role="option"
              aria-selected={isSelected}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-left',
                isSelected
                  ? 'border-[#1e3a8a] bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 active:opacity-70'
              )}
            >
              <span className="text-4xl leading-none" role="img" aria-label={cat.label}>
                {cat.emoji}
              </span>
              <span
                className={cn(
                  'text-sm font-semibold text-center leading-tight',
                  isSelected ? 'text-[#1e3a8a]' : 'text-gray-700'
                )}
              >
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
