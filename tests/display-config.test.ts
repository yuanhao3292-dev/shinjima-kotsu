import { describe, it, expect } from 'vitest';
import { COLOR_THEMES } from '@/lib/types/display-config';

describe('COLOR_THEMES', () => {
  const expectedThemes = [
    'teal', 'blue-dark', 'amber', 'emerald', 'rose',
    'purple', 'indigo', 'orange', 'slate', 'cyan',
  ];

  it('has 10 color themes', () => {
    expect(Object.keys(COLOR_THEMES)).toHaveLength(10);
  });

  it('has all expected themes', () => {
    for (const theme of expectedThemes) {
      expect(COLOR_THEMES[theme as keyof typeof COLOR_THEMES], `Missing theme: ${theme}`).toBeDefined();
    }
  });

  it('all themes have required color properties', () => {
    const requiredKeys = [
      'gradientFrom', 'gradientVia', 'accent', 'accentBg', 'descText',
      'statSubtext', 'ctaBg', 'ctaText', 'ctaHover',
      'sidebarIcon', 'sidebarStepBg', 'sidebarSubtext',
    ];

    for (const [name, theme] of Object.entries(COLOR_THEMES)) {
      for (const key of requiredKeys) {
        expect(
          (theme as Record<string, string>)[key],
          `Missing ${key} in theme ${name}`
        ).toBeTruthy();
      }
    }
  });

  it('all Tailwind classes are non-empty strings', () => {
    for (const [name, theme] of Object.entries(COLOR_THEMES)) {
      for (const [key, value] of Object.entries(theme)) {
        expect(typeof value).toBe('string');
        expect(value.length, `Empty ${key} in ${name}`).toBeGreaterThan(0);
      }
    }
  });
});
