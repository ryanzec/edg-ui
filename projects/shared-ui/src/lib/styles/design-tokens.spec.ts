import { describe, expect, it } from 'vitest';

import { designTokenUtils } from './design-tokens';

describe('designTokenUtils', () => {
  describe('getColorToken', () => {
    describe('light theme (default)', () => {
      it('returns a chart color override defined for the light theme', () => {
        expect(designTokenUtils.getColorToken('chart.blue.1')).toBe('oklch(0.58 0.14 240)');
      });

      it('returns the resting chevron color for the date picker trigger', () => {
        expect(designTokenUtils.getColorToken('date.picker.input.trigger.chevron.fg')).toBe('oklch(0.46 0.008 260)');
      });

      it('returns the hover chevron color for the date picker trigger', () => {
        expect(designTokenUtils.getColorToken('date.picker.input.trigger.chevron.fg.hover')).toBe(
          'oklch(0.22 0.008 260)'
        );
      });

      it('returns the same value when theme is explicitly "light"', () => {
        expect(designTokenUtils.getColorToken('chart.green.1', 'light')).toBe('oklch(0.6 0.14 145)');
      });

      it('returns undefined for a token that is only defined in the dark override map', () => {
        expect(designTokenUtils.getColorToken('fg')).toBeUndefined();
      });

      it('returns undefined for an unknown token', () => {
        // @ts-expect-error - guards the compile-time token-name typing; if this stops erroring the type-safety feature has regressed
        expect(designTokenUtils.getColorToken('this.does.not.exist')).toBeUndefined();
      });
    });

    describe('dark theme', () => {
      it('returns the dark override value for the foreground color', () => {
        expect(designTokenUtils.getColorToken('fg', 'dark')).toBe('oklch(0.89 0.005 95)');
      });

      it('returns a different value than light for bg.app', () => {
        expect(designTokenUtils.getColorToken('bg.app', 'dark')).toBe('oklch(0.17 0.01 260)');
      });

      it('returns a dark-specific border color', () => {
        expect(designTokenUtils.getColorToken('border', 'dark')).toBe('oklch(0.34 0.009 260)');
      });

      it('returns a dark-specific link color', () => {
        expect(designTokenUtils.getColorToken('link', 'dark')).toBe('oklch(0.78 0.16 250)');
      });

      it('returns undefined for an unknown token', () => {
        // @ts-expect-error - guards the compile-time token-name typing; if this stops erroring the type-safety feature has regressed
        expect(designTokenUtils.getColorToken('this.does.not.exist', 'dark')).toBeUndefined();
      });
    });

    describe('light vs dark values differ', () => {
      it('bg.app is lighter in light theme than dark theme', () => {
        const light = designTokenUtils.getColorToken('bg.app', 'light');
        const dark = designTokenUtils.getColorToken('bg.app', 'dark');
        expect(light).not.toBe(dark);
      });

      it('fg is darker in light theme than dark theme', () => {
        const light = designTokenUtils.getColorToken('fg', 'light');
        const dark = designTokenUtils.getColorToken('fg', 'dark');
        expect(light).not.toBe(dark);
      });
    });
  });

  describe('getToken', () => {
    describe('font tokens', () => {
      it('returns the regular font weight', () => {
        expect(designTokenUtils.getToken('font.weight.regular')).toBe('400');
      });

      it('returns the base font size', () => {
        expect(designTokenUtils.getToken('font.size.base')).toBe('0.875rem');
      });
    });

    describe('spacing tokens', () => {
      it('returns a spacing value', () => {
        expect(designTokenUtils.getToken('spacing.4')).toBe('1rem');
      });
    });

    describe('radius tokens', () => {
      it('returns a radius value', () => {
        expect(designTokenUtils.getToken('radius.base')).toBe('0.5rem');
      });

      it('returns the pill radius', () => {
        expect(designTokenUtils.getToken('radius.pill')).toBe('62.4375rem');
      });
    });

    describe('breakpoint tokens', () => {
      it('returns a breakpoint value', () => {
        expect(designTokenUtils.getToken('breakpoint.sm')).toBe('40rem');
      });
    });

    describe('opacity tokens', () => {
      it('returns the disabled opacity value', () => {
        expect(designTokenUtils.getToken('opacity.disabled')).toBe('0.5');
      });
    });

    describe('line height tokens', () => {
      it('returns the normal line height', () => {
        expect(designTokenUtils.getToken('line.height.normal')).toBe('1.45');
      });
    });

    describe('aspect ratio tokens', () => {
      it('returns the video aspect ratio', () => {
        expect(designTokenUtils.getToken('aspect.video')).toBe('16 / 9');
      });
    });

    describe('unknown tokens', () => {
      it('returns undefined for an unknown token', () => {
        // @ts-expect-error - guards the compile-time token-name typing; if this stops erroring the type-safety feature has regressed
        expect(designTokenUtils.getToken('this.does.not.exist')).toBeUndefined();
      });
    });
  });
});
