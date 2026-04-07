import { describe, it, expect } from 'vitest';
import { generateAnswersHash } from '@/lib/utils/answers-hash';

describe('generateAnswersHash', () => {
  const answers = [
    { questionId: 1, question: 'Q1', answer: 'yes' },
    { questionId: 2, question: 'Q2', answer: 'no', note: 'some note' },
  ];

  it('returns a hex string of length 16', () => {
    const hash = generateAnswersHash(answers);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('returns consistent hash for same input', () => {
    const h1 = generateAnswersHash(answers);
    const h2 = generateAnswersHash(answers);
    expect(h1).toBe(h2);
  });

  it('returns same hash regardless of answer order (sorted internally)', () => {
    const reversed = [...answers].reverse();
    expect(generateAnswersHash(answers)).toBe(generateAnswersHash(reversed));
  });

  it('returns different hash for different answers', () => {
    const other = [{ questionId: 1, question: 'Q1', answer: 'different' }];
    expect(generateAnswersHash(answers)).not.toBe(generateAnswersHash(other));
  });

  it('returns different hash when documentText differs', () => {
    const h1 = generateAnswersHash([], 'Document A content');
    const h2 = generateAnswersHash([], 'Document B content');
    expect(h1).not.toBe(h2);
  });

  it('returns different hash with vs without documentText', () => {
    const withDoc = generateAnswersHash(answers, 'some document');
    const withoutDoc = generateAnswersHash(answers);
    expect(withDoc).not.toBe(withoutDoc);
  });

  it('handles empty answers array', () => {
    const hash = generateAnswersHash([]);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('includes note in hash computation', () => {
    const withNote = [{ questionId: 1, question: 'Q1', answer: 'yes', note: 'important' }];
    const withoutNote = [{ questionId: 1, question: 'Q1', answer: 'yes' }];
    expect(generateAnswersHash(withNote)).not.toBe(generateAnswersHash(withoutNote));
  });
});
