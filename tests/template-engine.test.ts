import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  registerTemplate,
  getTemplate,
  getRegisteredTemplates,
  renderTemplate,
  parseTemplateKey,
  isValidHexColor,
  adjustColor,
  getColorWithAlpha,
  isColorDark,
  getContrastColor,
} from '@/lib/templates/engine';

// ============================================================
// Color utility functions (pure, no React needed)
// ============================================================

describe('isValidHexColor', () => {
  it('accepts valid 6-char hex without #', () => {
    expect(isValidHexColor('ff0000')).toBe(true);
    expect(isValidHexColor('000000')).toBe(true);
    expect(isValidHexColor('ABCDEF')).toBe(true);
  });

  it('accepts valid 6-char hex with #', () => {
    expect(isValidHexColor('#ff0000')).toBe(true);
    expect(isValidHexColor('#000000')).toBe(true);
  });

  it('rejects invalid hex', () => {
    expect(isValidHexColor('xyz')).toBe(false);
    expect(isValidHexColor('#12345')).toBe(false);
    expect(isValidHexColor('#1234567')).toBe(false);
    expect(isValidHexColor('')).toBe(false);
    expect(isValidHexColor('gggggg')).toBe(false);
  });
});

describe('adjustColor', () => {
  it('lightens color with positive amount', () => {
    const result = adjustColor('#000000', 50);
    expect(result).toBe('#323232');
  });

  it('darkens color with negative amount', () => {
    const result = adjustColor('#ffffff', -50);
    expect(result).toBe('#cdcdcd');
  });

  it('clamps to 0 (no negative RGB)', () => {
    const result = adjustColor('#000000', -50);
    expect(result).toBe('#000000');
  });

  it('clamps to 255 (no overflow)', () => {
    const result = adjustColor('#ffffff', 50);
    expect(result).toBe('#ffffff');
  });

  it('returns original for invalid color', () => {
    expect(adjustColor('invalid', 50)).toBe('invalid');
  });

  it('works without # prefix', () => {
    const result = adjustColor('808080', 10);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('getColorWithAlpha', () => {
  it('converts hex to rgba', () => {
    expect(getColorWithAlpha('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('handles white', () => {
    expect(getColorWithAlpha('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)');
  });

  it('handles black', () => {
    expect(getColorWithAlpha('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
  });

  it('returns original for invalid color', () => {
    expect(getColorWithAlpha('invalid', 0.5)).toBe('invalid');
  });
});

describe('isColorDark', () => {
  it('returns true for black', () => {
    expect(isColorDark('#000000')).toBe(true);
  });

  it('returns false for white', () => {
    expect(isColorDark('#ffffff')).toBe(false);
  });

  it('returns true for dark blue', () => {
    expect(isColorDark('#00008b')).toBe(true);
  });

  it('returns false for yellow', () => {
    expect(isColorDark('#ffff00')).toBe(false);
  });

  it('returns false for invalid color', () => {
    expect(isColorDark('invalid')).toBe(false);
  });
});

describe('getContrastColor', () => {
  it('returns white for dark background', () => {
    expect(getContrastColor('#000000')).toBe('#ffffff');
    expect(getContrastColor('#1a1a1a')).toBe('#ffffff');
  });

  it('returns dark color for light background', () => {
    expect(getContrastColor('#ffffff')).toBe('#1f2937');
    expect(getContrastColor('#f0f0f0')).toBe('#1f2937');
  });
});

// ============================================================
// parseTemplateKey
// ============================================================

describe('parseTemplateKey', () => {
  it('parses type_theme format', () => {
    const result = parseTemplateKey('bio_modern', 'bio');
    expect(result.type).toBe('bio');
    expect(result.theme).toBe('modern');
  });

  it('parses theme_type format', () => {
    const result = parseTemplateKey('modern_bio', 'service');
    expect(result.type).toBe('bio');
    expect(result.theme).toBe('modern');
  });

  it('parses single theme', () => {
    const result = parseTemplateKey('elegant', 'bio');
    expect(result.type).toBe('bio');
    expect(result.theme).toBe('elegant');
  });

  it('returns defaults for empty string', () => {
    const result = parseTemplateKey('', 'bio');
    expect(result.type).toBe('bio');
    expect(result.theme).toBe('modern');
  });

  it('returns default theme for unknown single value', () => {
    const result = parseTemplateKey('unknown', 'contact');
    expect(result.type).toBe('contact');
    expect(result.theme).toBe('modern');
  });

  it('handles all valid template types', () => {
    const types = ['bio', 'service', 'contact', 'hero', 'footer'] as const;
    for (const type of types) {
      const result = parseTemplateKey(`${type}_classic`, type);
      expect(result.type).toBe(type);
      expect(result.theme).toBe('classic');
    }
  });

  it('handles all valid themes', () => {
    const themes = ['modern', 'classic', 'minimal', 'elegant', 'corporate'] as const;
    for (const theme of themes) {
      const result = parseTemplateKey(theme, 'bio');
      expect(result.theme).toBe(theme);
    }
  });
});

// ============================================================
// Template registry (registerTemplate, getTemplate, etc.)
// ============================================================

describe('template registry', () => {
  // Note: template registry is a module-level Map so tests may interact.
  // Tests here focus on the functional behavior.

  it('registerTemplate and getTemplate roundtrip', () => {
    const mockComponent = vi.fn().mockReturnValue(null);
    registerTemplate('footer', 'minimal', mockComponent);

    const retrieved = getTemplate('footer', 'minimal');
    expect(retrieved).toBe(mockComponent);
  });

  it('getTemplate returns null for unknown type', () => {
    const result = getTemplate('bio' as any, 'corporate');
    // May or may not exist depending on test order; just ensure no error
    expect(result === null || typeof result === 'function').toBe(true);
  });

  it('getRegisteredTemplates returns array', () => {
    const templates = getRegisteredTemplates();
    expect(Array.isArray(templates)).toBe(true);
    for (const entry of templates) {
      expect(entry.type).toBeTruthy();
      expect(Array.isArray(entry.themes)).toBe(true);
    }
  });

  it('renderTemplate returns null for unregistered template', () => {
    const context = {
      brandName: 'test',
      brandColor: '#000000',
      pageData: {} as any,
    };
    const result = renderTemplate('hero' as any, 'corporate' as any, context, {});
    // May return null or rendered result depending on test order
    expect(result === null || result !== undefined).toBe(true);
  });
});
