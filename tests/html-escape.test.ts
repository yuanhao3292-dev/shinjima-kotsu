import { describe, it, expect } from 'vitest';
import { escapeHtml } from '@/lib/utils/html-escape';

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });

  it('escapes less-than', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater-than', () => {
    expect(escapeHtml('a>b')).toBe('a&gt;b');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('escapes all special characters in one string', () => {
    expect(escapeHtml('<a href="x" onclick=\'alert(&)\'>')).toBe(
      '&lt;a href=&quot;x&quot; onclick=&#39;alert(&amp;)&#39;&gt;'
    );
  });

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('returns unchanged string when no special chars', () => {
    expect(escapeHtml('hello world 123')).toBe('hello world 123');
  });

  it('handles XSS attack payload', () => {
    const payload = '<img src=x onerror="alert(\'XSS\')">';
    const result = escapeHtml(payload);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('"');
  });

  it('handles Unicode characters without escaping them', () => {
    expect(escapeHtml('日本語テスト')).toBe('日本語テスト');
  });
});
