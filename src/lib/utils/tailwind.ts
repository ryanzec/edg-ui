import { extendTailwindMerge } from 'tailwind-merge';

// example usage for custom tailwind classes
// const merge = extendTailwindMerge({
//   extend: {
//     classGroups: {
//       z: ['z-drop-down'],
//     },
//   },
// });

const merge = extendTailwindMerge({});

export const tailwindUtils = { merge };
