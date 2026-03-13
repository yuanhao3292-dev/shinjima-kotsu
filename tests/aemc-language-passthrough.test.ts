/**
 * 语言参数传递链路测试
 *
 * 验证：前端 language → API → normalizeToCasePacket → CasePacket.language
 * 确保显式 language 参数优先于自动检测。
 */

import { describe, it, expect } from 'vitest';
import { normalizeToCasePacket } from '@/services/aemc/input-normalizer';
import { HealthScreeningAnalyzeSchema } from '@/lib/validations/api-schemas';

// ============================================================
// Zod Schema 验证
// ============================================================

describe('HealthScreeningAnalyzeSchema — language 字段', () => {
  it('应接受有效的 language 参数 zh-CN', () => {
    const result = HealthScreeningAnalyzeSchema.safeParse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      phase: 2,
      language: 'zh-CN',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe('zh-CN');
    }
  });

  it('应接受有效的 language 参数 zh-TW', () => {
    const result = HealthScreeningAnalyzeSchema.safeParse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      language: 'zh-TW',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe('zh-TW');
    }
  });

  it('应接受有效的 language 参数 en', () => {
    const result = HealthScreeningAnalyzeSchema.safeParse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      language: 'en',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe('en');
    }
  });

  it('应接受有效的 language 参数 ja', () => {
    const result = HealthScreeningAnalyzeSchema.safeParse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      language: 'ja',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe('ja');
    }
  });

  it('language 为可选 — 不传也应通过验证', () => {
    const result = HealthScreeningAnalyzeSchema.safeParse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      phase: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBeUndefined();
    }
  });

  it('应拒绝无效的 language 值', () => {
    const result = HealthScreeningAnalyzeSchema.safeParse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      language: 'fr',
    });
    expect(result.success).toBe(false);
  });

  it('应拒绝空字符串 language', () => {
    const result = HealthScreeningAnalyzeSchema.safeParse({
      screeningId: '550e8400-e29b-41d4-a716-446655440000',
      language: '',
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// Input Normalizer — 显式 language 优先于自动检测
// ============================================================

describe('normalizeToCasePacket — language 优先级', () => {
  // 中文问卷 + 显式 language=ja → 应使用 ja
  it('显式 language 应覆盖自动检测（中文问卷 + language=ja → ja）', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-001',
      answers: [
        { questionId: 1, question: '您的年龄范围是？', answer: '40-49' },
        { questionId: 2, question: '您的性别是？', answer: 'male' },
      ],
      userType: 'authenticated',
      language: 'ja',
    });
    expect(result.language).toBe('ja');
  });

  // 日文问卷 + 显式 language=en → 应使用 en
  it('显式 language 应覆盖自动检测（日文问卷 + language=en → en）', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-002',
      answers: [
        { questionId: 1, question: 'あなたの年齢は？', answer: '40-49' },
        { questionId: 2, question: '性別は？', answer: 'male' },
      ],
      userType: 'authenticated',
      language: 'en',
    });
    expect(result.language).toBe('en');
  });

  // 英文问卷 + 显式 language=zh-TW → 应使用 zh-TW
  it('显式 language 应覆盖自动检测（英文问卷 + language=zh-TW → zh-TW）', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-003',
      answers: [
        { questionId: 1, question: 'What is your age range?', answer: '40-49' },
        { questionId: 2, question: 'What is your gender?', answer: 'male' },
      ],
      userType: 'whitelabel',
      language: 'zh-TW',
    });
    expect(result.language).toBe('zh-TW');
  });

  // 不传 language → 应自动检测为 zh-CN
  it('不传 language 时应自动检测（中文问卷 → zh-CN）', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-004',
      answers: [
        { questionId: 1, question: '您的年龄范围是？', answer: '40-49' },
        { questionId: 2, question: '您的性别是？', answer: 'male' },
      ],
      userType: 'authenticated',
    });
    expect(result.language).toBe('zh-CN');
  });

  // 不传 language → 应自动检测为 ja
  it('不传 language 时应自动检测（日文问卷 → ja）', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-005',
      answers: [
        { questionId: 1, question: 'あなたの年齢は？', answer: '40-49' },
        { questionId: 2, question: '性別は？', answer: 'male' },
      ],
      userType: 'authenticated',
    });
    expect(result.language).toBe('ja');
  });

  // 不传 language → 应自动检测为 en
  it('不传 language 时应自动检测（英文问卷 → en）', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-006',
      answers: [
        { questionId: 1, question: 'What is your age range?', answer: '30-39' },
        { questionId: 2, question: 'What is your gender?', answer: 'female' },
      ],
      userType: 'whitelabel',
    });
    expect(result.language).toBe('en');
  });

  // 繁体中文自动检测
  it('不传 language 时应自动检测（繁体中文问卷 → zh-TW）', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-007',
      answers: [
        { questionId: 1, question: '您的年齡範圍是？', answer: '40-49' },
        { questionId: 2, question: '請問您的體重是？', answer: '70' },
      ],
      userType: 'authenticated',
    });
    expect(result.language).toBe('zh-TW');
  });

  // 空答案 + 无 language → 默认 zh-CN
  it('空答案 + 无 language → 默认 zh-CN', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-008',
      answers: [],
      userType: 'authenticated',
    });
    expect(result.language).toBe('zh-CN');
  });

  // 空答案 + 显式 language=ja → 应使用 ja
  it('空答案 + 显式 language=ja → ja', () => {
    const result = normalizeToCasePacket({
      screeningId: 'test-009',
      answers: [],
      userType: 'whitelabel',
      language: 'ja',
    });
    expect(result.language).toBe('ja');
  });
});
