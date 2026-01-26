# 测试文档 | Testing Documentation

## 概述

本项目使用 [Vitest](https://vitest.dev/) 作为测试框架，支持单元测试和集成测试。

## 运行测试

```bash
# 运行所有测试（单次）
npm test

# 监视模式（开发时使用）
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## 测试文件结构

```
tests/
├── README.md                    # 本文档
├── setup.ts                     # 测试环境配置
├── validation.test.ts           # 表单验证测试 ⭐ NEW
├── deepseekService.test.ts      # AI 服务测试
├── screening-utils.test.ts      # 健康筛查工具测试
└── performance.test.ts          # 性能测试
```

## 表单验证测试详情

**文件**: `tests/validation.test.ts`
**测试数量**: 54 个测试用例
**覆盖模块**: `lib/validation.ts`

### 测试覆盖范围

#### 1. Email 验证（12 个测试）
- ✅ 标准邮箱格式
- ✅ 包含数字、点号、子域名
- ✅ 拒绝无效格式（缺少@、域名、空格等）
- ✅ Unicode/国际化邮箱支持

#### 2. 电话号码验证（10 个测试）
- ✅ 日本手机号码格式
- ✅ 国际格式（+81）
- ✅ 带连字符、括号、空格
- ✅ 长度限制（10-20 位）
- ✅ 可选字段（允许空值）

#### 3. 姓名验证（10 个测试）
- ✅ 中文、日文、英文姓名
- ✅ 长度限制（2-100 字符）
- ✅ 自动去除首尾空格
- ✅ Unicode 字符支持

#### 4. 日期验证（4 个测试）
- ✅ 接受今天和未来日期
- ✅ 拒绝过去日期
- ✅ 可选字段

#### 5. 备注验证（3 个测试）
- ✅ 长度限制（最多 500 字符）
- ✅ 可选字段

#### 6. 完整表单验证（11 个测试）
- ✅ 组合验证所有字段
- ✅ 验证顺序测试
- ✅ 错误消息准确性

#### 7. 边界条件测试（4 个测试）
- ✅ null/undefined 处理
- ✅ Unicode 和 emoji 字符
- ✅ 极端长度值

## 最新测试结果

```
✓ tests/validation.test.ts (54 tests) 5ms
✓ tests/performance.test.ts (13 tests) 3ms
✓ tests/screening-utils.test.ts (33 tests) 10ms
✓ tests/deepseekService.test.ts (64 tests) 9ms

Test Files  4 passed (4)
     Tests  164 passed (164) ✅
   Duration  753ms
```

**所有测试 100% 通过！**

## 添加新测试

### 基本模板

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '@/lib/your-module';

describe('yourFunction', () => {
  describe('正常情况', () => {
    it('应该返回正确的结果', () => {
      const result = yourFunction('input');
      expect(result).toBe('expected');
    });
  });

  describe('异常情况', () => {
    it('应该处理错误输入', () => {
      const result = yourFunction('');
      expect(result).toBeUndefined();
    });
  });
});
```

### 最佳实践

1. **使用描述性的测试名称**
   ```typescript
   // ❌ 不好
   it('test 1', () => { ... });

   // ✅ 好
   it('应该接受标准的邮箱格式', () => { ... });
   ```

2. **分组相关测试**
   ```typescript
   describe('validateEmail', () => {
     describe('有效的邮箱地址', () => {
       it('应该接受...', () => { ... });
     });

     describe('无效的邮箱地址', () => {
       it('应该拒绝...', () => { ... });
     });
   });
   ```

3. **测试边界条件**
   - 空值（null, undefined, ''）
   - 最小/最大长度
   - 特殊字符
   - Unicode 字符

4. **一个测试只验证一件事**
   ```typescript
   // ❌ 不好 - 测试多个功能
   it('应该验证所有字段', () => {
     expect(validateEmail('test@test.com')).toBeTruthy();
     expect(validatePhone('123456')).toBeFalsy();
     expect(validateName('John')).toBeTruthy();
   });

   // ✅ 好 - 每个测试专注一个功能
   it('应该接受有效的邮箱', () => {
     expect(validateEmail('test@test.com')).toBeTruthy();
   });
   ```

## 持续集成（CI）

测试会在以下情况自动运行：
- ✅ Push 到 main 分支
- ✅ 创建 Pull Request
- ✅ Vercel 部署前

## 故障排查

### 测试失败

1. 检查测试输出中的错误消息
2. 使用 `test:watch` 模式实时调试
3. 添加 `console.log` 查看中间值

### 导入错误

确保使用正确的路径别名：
```typescript
// ✅ 正确
import { validateEmail } from '@/lib/validation';

// ❌ 错误
import { validateEmail } from '../lib/validation';
```

## 相关资源

- [Vitest 官方文档](https://vitest.dev/)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest 到 Vitest 迁移指南](https://vitest.dev/guide/migration.html)

---

**最后更新**: 2026-01-26
**测试覆盖率**: 目标 80%+
**维护者**: 开发团队
