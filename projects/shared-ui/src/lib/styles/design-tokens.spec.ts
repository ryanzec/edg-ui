import { describe, expect, it } from 'vitest';

import { designTokenUtils } from './design-tokens';

describe('designTokenUtils', () => {
  describe('getColorToken', () => {
    describe('light theme (default)', () => {
      it('returns a resolved semantic token that was originally a var() reference', () => {
        expect(designTokenUtils.getColorToken('text')).toBe('oklch(20.5% 0 0)');
      });

      it('returns a resolved semantic sub-variant token', () => {
        expect(designTokenUtils.getColorToken('text.subtle')).toBe('oklch(55.6% 0 0)');
      });

      it('resolves a chain of var() references', () => {
        expect(designTokenUtils.getColorToken('text.selected')).toBe('oklch(60% 0.118 184.704)');
      });

      it('returns the light value when theme is explicitly "light"', () => {
        expect(designTokenUtils.getColorToken('background', 'light')).toBe('oklch(97% 0 0)');
      });

      it('returns undefined for an unknown token', () => {
        expect(designTokenUtils.getColorToken('this.does.not.exist')).toBeUndefined();
      });
    });

    describe('dark theme', () => {
      it('returns the dark override value for a semantic token', () => {
        expect(designTokenUtils.getColorToken('text', 'dark')).toBe('oklch(97% 0 0)');
      });

      it('returns a different value than light for background', () => {
        expect(designTokenUtils.getColorToken('background', 'dark')).toBe('oklch(20.5% 0 0)');
      });

      it('returns a dark-specific resolved border color', () => {
        expect(designTokenUtils.getColorToken('border', 'dark')).toBe('oklch(37.1% 0 0)');
      });

      it('returns a dark-specific resolved link color', () => {
        expect(designTokenUtils.getColorToken('link', 'dark')).toBe('oklch(70.7% 0.165 254.624)');
      });

      it('returns undefined for a token not defined in dark theme', () => {
        expect(designTokenUtils.getColorToken('red.50', 'dark')).toBeUndefined();
      });

      it('returns undefined for an unknown token', () => {
        expect(designTokenUtils.getColorToken('this.does.not.exist', 'dark')).toBeUndefined();
      });
    });

    describe('light vs dark values differ', () => {
      it('background is lighter in light theme than dark theme', () => {
        const light = designTokenUtils.getColorToken('background', 'light');
        const dark = designTokenUtils.getColorToken('background', 'dark');
        expect(light).not.toBe(dark);
      });

      it('text is darker in light theme than dark theme', () => {
        const light = designTokenUtils.getColorToken('text', 'light');
        const dark = designTokenUtils.getColorToken('text', 'dark');
        expect(light).not.toBe(dark);
      });
    });
  });

  describe('getToken', () => {
    describe('font tokens', () => {
      it('returns the normal font weight', () => {
        expect(designTokenUtils.getToken('font.weight.normal')).toBe('400');
      });
    });

    describe('spacing tokens', () => {
      it('returns a spacing value', () => {
        expect(designTokenUtils.getToken('spacing.4')).toBe('1rem');
      });
    });

    describe('radius tokens', () => {
      it('returns a radius value', () => {
        expect(designTokenUtils.getToken('radius.md')).toBe('0.375rem');
      });
    });

    describe('breakpoint tokens', () => {
      it('returns a breakpoint value', () => {
        expect(designTokenUtils.getToken('breakpoint.sm')).toBe('40rem');
      });
    });

    describe('opacity tokens', () => {
      it('returns the disabled opacity value', () => {
        expect(designTokenUtils.getToken('opacity.disabled')).toBe('0.4');
      });
    });

    describe('text scale tokens', () => {
      it('returns a text size value', () => {
        expect(designTokenUtils.getToken('text.xs')).toBe('0.75rem');
      });

      it('resolves double-dash sub-property: text.xs.line.height', () => {
        expect(designTokenUtils.getToken('text.xs.line.height')).toBe('calc(1 / 0.75)');
      });

      it('resolves double-dash sub-property: text.2xs.line.height', () => {
        expect(designTokenUtils.getToken('text.2xs.line.height')).toBe('calc(1 / 0.625)');
      });
    });

    describe('aspect ratio tokens', () => {
      it('returns the video aspect ratio', () => {
        expect(designTokenUtils.getToken('aspect.video')).toBe('16 / 9');
      });
    });

    describe('unknown tokens', () => {
      it('returns undefined for an unknown token', () => {
        expect(designTokenUtils.getToken('this.does.not.exist')).toBeUndefined();
      });
    });
  });
});
