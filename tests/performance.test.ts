/**
 * 性能監控模塊測試
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordMetrics,
  getPerformanceStats,
  clearMetrics,
  createPerformanceTimer,
  PerformanceMetrics,
} from '@/services/deepseek/performance';

describe('Performance Monitoring', () => {
  beforeEach(() => {
    clearMetrics();
  });

  describe('recordMetrics', () => {
    it('應該正確記錄性能指標', () => {
      const metrics: PerformanceMetrics = {
        requestId: 'req_test_123',
        startTime: 1000,
        endTime: 2000,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      };

      recordMetrics(metrics);
      const stats = getPerformanceStats();
      expect(stats.totalRequests).toBe(1);
    });

    it('應該計算持續時間', () => {
      const metrics: PerformanceMetrics = {
        requestId: 'req_test_123',
        startTime: 1000,
        endTime: 2500,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      };

      recordMetrics(metrics);
      expect(metrics.duration).toBe(1500);
    });
  });

  describe('getPerformanceStats', () => {
    it('空數據應該返回零值', () => {
      const stats = getPerformanceStats();
      expect(stats.totalRequests).toBe(0);
      expect(stats.averageDuration).toBe(0);
      expect(stats.successRate).toBe(0);
    });

    it('應該正確計算成功率', () => {
      recordMetrics({
        requestId: 'req_1',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      });
      recordMetrics({
        requestId: 'req_2',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: false,
      });

      const stats = getPerformanceStats();
      expect(stats.successRate).toBe(50);
    });

    it('應該正確計算 AI 使用率', () => {
      recordMetrics({
        requestId: 'req_1',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      });
      recordMetrics({
        requestId: 'req_2',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'rule-based',
        success: true,
      });
      recordMetrics({
        requestId: 'req_3',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      });

      const stats = getPerformanceStats();
      expect(stats.aiUsageRate).toBe(67); // 2/3 ≈ 67%
    });

    it('應該正確計算緩存命中率', () => {
      recordMetrics({
        requestId: 'req_1',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'cache',
        success: true,
      });
      recordMetrics({
        requestId: 'req_2',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      });

      const stats = getPerformanceStats();
      expect(stats.cacheHitRate).toBe(50);
    });

    it('應該正確計算降級率', () => {
      recordMetrics({
        requestId: 'req_1',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'rule-based',
        success: true,
      });
      recordMetrics({
        requestId: 'req_2',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      });

      const stats = getPerformanceStats();
      expect(stats.fallbackRate).toBe(50);
    });

    it('應該正確計算平均持續時間', () => {
      // 確保清除之前的指標
      clearMetrics();

      // 使用帶有 duration 屬性的指標
      const metrics1: PerformanceMetrics = {
        requestId: 'req_1',
        startTime: 0,
        endTime: 100,
        duration: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      };
      const metrics2: PerformanceMetrics = {
        requestId: 'req_2',
        startTime: 0,
        endTime: 200,
        duration: 200,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      };
      const metrics3: PerformanceMetrics = {
        requestId: 'req_3',
        startTime: 0,
        endTime: 300,
        duration: 300,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      };

      recordMetrics(metrics1);
      recordMetrics(metrics2);
      recordMetrics(metrics3);

      const stats = getPerformanceStats();
      expect(stats.averageDuration).toBe(200); // (100+200+300)/3
    });
  });

  describe('createPerformanceTimer', () => {
    it('應該創建有效的計時器', () => {
      const timer = createPerformanceTimer('req_test', 2, 10);
      expect(timer).toHaveProperty('end');
      expect(typeof timer.end).toBe('function');
    });

    it('timer.end 應該返回正確的指標', () => {
      const timer = createPerformanceTimer('req_test', 1, 5);

      // 模擬一些處理時間
      const metrics = timer.end('ai', true);

      expect(metrics.requestId).toBe('req_test');
      expect(metrics.phase).toBe(1);
      expect(metrics.answersCount).toBe(5);
      expect(metrics.source).toBe('ai');
      expect(metrics.success).toBe(true);
      expect(metrics.duration).toBeDefined();
      expect(metrics.duration).toBeGreaterThanOrEqual(0);
    });

    it('timer.end 應該記錄錯誤類型', () => {
      const timer = createPerformanceTimer('req_test', 2, 10);
      const metrics = timer.end('rule-based', false, 'timeout');

      expect(metrics.success).toBe(false);
      expect(metrics.errorType).toBe('timeout');
    });

    it('timer.end 應該自動記錄到指標存儲', () => {
      const timer = createPerformanceTimer('req_test', 2, 10);
      timer.end('ai', true);

      const stats = getPerformanceStats();
      expect(stats.totalRequests).toBe(1);
    });
  });

  describe('clearMetrics', () => {
    it('應該清除所有指標', () => {
      recordMetrics({
        requestId: 'req_1',
        startTime: 0,
        endTime: 100,
        phase: 2,
        answersCount: 10,
        source: 'ai',
        success: true,
      });

      expect(getPerformanceStats().totalRequests).toBe(1);

      clearMetrics();

      expect(getPerformanceStats().totalRequests).toBe(0);
    });
  });
});
