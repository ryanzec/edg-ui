import { extendTailwindMerge } from 'tailwind-merge';

// example usage for custom tailwind classes
const merge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'] } },
});

// const merge = extendTailwindMerge({});

export const tailwindUtils = { merge };
