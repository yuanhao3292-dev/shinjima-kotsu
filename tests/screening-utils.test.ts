/**
 * 健康筛查工具函数测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SCREENING_CONFIG,
  sanitizeTextInput,
  isValidAnswer,
  calculateProgress,
  saveDraftToLocal,
  loadDraftFromLocal,
  clearDraftFromLocal,
  getSafeErrorMessage,
  updateAnswer,
  mergeAnswers,
  RISK_LEVEL_CONFIG,
} from '@/lib/screening-utils';
import { ScreeningAnswer } from '@/lib/screening-questions';

// ============================================
// 常量配置测试
// ============================================

describe('SCREENING_CONFIG', () => {
  it('应该有合理的默认值', () => {
    expect(SCREENING_CONFIG.MAX_TEXT_LENGTH).toBe(500);
    expect(SCREENING_CONFIG.MAX_NOTE_LENGTH).toBe(200);
    expect(SCREENING_CONFIG.AUTO_SAVE_INTERVAL).toBe(10000);
    expect(SCREENING_CONFIG.API_TIMEOUT).toBe(30000);
  });
});

// ============================================
// 输入清理测试
// ============================================

describe('sanitizeTextInput', () => {
  it('应该正常处理普通文本', () => {
    expect(sanitizeTextInput('hello world')).toBe('hello world');
  });

  it('应该限制长度', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeTextInput(long)).toHaveLength(500);
  });

  it('应该使用自定义长度限制', () => {
    const long = 'a'.repeat(300);
    expect(sanitizeTextInput(long, 100)).toHaveLength(100);
  });

  it('应该处理空值', () => {
    expect(sanitizeTextInput('')).toBe('');
    expect(sanitizeTextInput(null as any)).toBe('');
    expect(sanitizeTextInput(undefined as any)).toBe('');
  });

  it('应该移除控制字符', () => {
    expect(sanitizeTextInput('hello\x00world')).toBe('helloworld');
  });

  it('应该去除首尾空格', () => {
    expect(sanitizeTextInput('  hello  ')).toBe('hello');
  });
});

// ============================================
// 答案验证测试
// ============================================

describe('isValidAnswer', () => {
  it('应该验证字符串答案', () => {
    expect(isValidAnswer('有效答案')).toBe(true);
    expect(isValidAnswer('')).toBe(false);
    expect(isValidAnswer('   ')).toBe(false);
  });

  it('应该验证数组答案', () => {
    expect(isValidAnswer(['选项1', '选项2'])).toBe(true);
    expect(isValidAnswer([])).toBe(false);
    expect(isValidAnswer(['', '  '])).toBe(false);
  });

  it('应该处理 undefined 和 null', () => {
    expect(isValidAnswer(undefined)).toBe(false);
    expect(isValidAnswer(null as any)).toBe(false);
  });
});

// ============================================
// 进度计算测试
// ============================================

describe('calculateProgress', () => {
  it('应该正确计算进度', () => {
    const answers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'A1' },
      { questionId: 2, question: 'Q2', answer: 'A2' },
    ];
    expect(calculateProgress(answers, 10)).toBe(20);
  });

  it('应该处理空答案', () => {
    expect(calculateProgress([], 10)).toBe(0);
  });

  it('应该处理总数为0', () => {
    expect(calculateProgress([], 0)).toBe(0);
  });

  it('应该四舍五入', () => {
    const answers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'A1' },
    ];
    expect(calculateProgress(answers, 3)).toBe(33);
  });

  it('应该忽略无效答案', () => {
    const answers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'A1' },
      { questionId: 2, question: 'Q2', answer: '' },
    ];
    expect(calculateProgress(answers, 10)).toBe(10);
  });
});

// ============================================
// LocalStorage 测试
// ============================================

describe('LocalStorage 操作', () => {
  const mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  it('saveDraftToLocal 应该保存草稿', () => {
    const answers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'A1' },
    ];
    saveDraftToLocal('test-id', answers);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('loadDraftFromLocal 应该加载草稿', () => {
    const answers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'A1' },
    ];
    mockStorage['screening_draft_test-id'] = JSON.stringify({
      answers,
      savedAt: new Date().toISOString(),
    });

    const loaded = loadDraftFromLocal('test-id');
    expect(loaded).toEqual(answers);
  });

  it('loadDraftFromLocal 应该处理无数据', () => {
    const loaded = loadDraftFromLocal('nonexistent');
    expect(loaded).toBeNull();
  });

  it('clearDraftFromLocal 应该清除草稿', () => {
    clearDraftFromLocal('test-id');
    expect(localStorage.removeItem).toHaveBeenCalled();
  });
});

// ============================================
// 错误消息测试
// ============================================

describe('getSafeErrorMessage', () => {
  it('应该处理超时错误', () => {
    // DOMException 在 Node 环境下行为不同，使用 Object.assign 模拟
    const error = Object.assign(new Error('Aborted'), { name: 'AbortError' });
    expect(getSafeErrorMessage(error)).toBe('請求超時，請稍後重試');
  });

  it('应该处理网络错误', () => {
    const error = new Error('fetch failed');
    expect(getSafeErrorMessage(error)).toBe('網絡連接失敗，請檢查網絡');
  });

  it('应该返回通用错误消息', () => {
    const error = new Error('some random error');
    expect(getSafeErrorMessage(error)).toBe('操作失敗，請稍後重試');
  });

  it('应该处理非 Error 对象', () => {
    expect(getSafeErrorMessage('string error')).toBe('操作失敗，請稍後重試');
    expect(getSafeErrorMessage(null)).toBe('操作失敗，請稍後重試');
  });
});

// ============================================
// 答案更新测试
// ============================================

describe('updateAnswer', () => {
  it('应该添加新答案', () => {
    const answers: ScreeningAnswer[] = [];
    const updated = updateAnswer(answers, 1, 'Q1', 'A1');
    expect(updated).toHaveLength(1);
    expect(updated[0]).toEqual({
      questionId: 1,
      question: 'Q1',
      answer: 'A1',
      note: undefined,
    });
  });

  it('应该更新已有答案', () => {
    const answers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'A1' },
    ];
    const updated = updateAnswer(answers, 1, 'Q1', 'A1-updated');
    expect(updated).toHaveLength(1);
    expect(updated[0].answer).toBe('A1-updated');
  });

  it('应该清理答案内容', () => {
    const answers: ScreeningAnswer[] = [];
    const updated = updateAnswer(answers, 1, 'Q1', '  spaced answer  ');
    expect(updated[0].answer).toBe('spaced answer');
  });

  it('应该处理数组答案', () => {
    const answers: ScreeningAnswer[] = [];
    const updated = updateAnswer(answers, 1, 'Q1', ['opt1', 'opt2']);
    expect(updated[0].answer).toEqual(['opt1', 'opt2']);
  });

  it('应该处理备注', () => {
    const answers: ScreeningAnswer[] = [];
    const updated = updateAnswer(answers, 1, 'Q1', 'A1', '这是备注');
    expect(updated[0].note).toBe('这是备注');
  });
});

// ============================================
// 答案合并测试
// ============================================

describe('mergeAnswers', () => {
  it('应该合并服务器和本地答案', () => {
    const serverAnswers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'Server A1' },
    ];
    const localAnswers: ScreeningAnswer[] = [
      { questionId: 2, question: 'Q2', answer: 'Local A2' },
    ];
    const merged = mergeAnswers(serverAnswers, localAnswers);
    expect(merged).toHaveLength(2);
  });

  it('本地答案应该覆盖空的服务器答案', () => {
    const serverAnswers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: '' },
    ];
    const localAnswers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'Local answer' },
    ];
    const merged = mergeAnswers(serverAnswers, localAnswers);
    expect(merged[0].answer).toBe('Local answer');
  });

  it('服务器有效答案应该保留', () => {
    const serverAnswers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'Server answer' },
    ];
    const localAnswers: ScreeningAnswer[] = [
      { questionId: 1, question: 'Q1', answer: 'Local answer' },
    ];
    const merged = mergeAnswers(serverAnswers, localAnswers);
    expect(merged[0].answer).toBe('Server answer');
  });
});

// ============================================
// 风险等级配置测试
// ============================================

describe('RISK_LEVEL_CONFIG', () => {
  it('应该有三个风险等级', () => {
    expect(RISK_LEVEL_CONFIG.low).toBeDefined();
    expect(RISK_LEVEL_CONFIG.medium).toBeDefined();
    expect(RISK_LEVEL_CONFIG.high).toBeDefined();
  });

  it('每个等级应该有完整的配置', () => {
    const levels = ['low', 'medium', 'high'] as const;
    levels.forEach(level => {
      expect(RISK_LEVEL_CONFIG[level].label).toBeDefined();
      expect(RISK_LEVEL_CONFIG[level].color).toBeDefined();
      expect(RISK_LEVEL_CONFIG[level].bgColor).toBeDefined();
      expect(RISK_LEVEL_CONFIG[level].borderColor).toBeDefined();
      expect(RISK_LEVEL_CONFIG[level].icon).toBeDefined();
    });
  });
});
