/**
 * 表单验证工具函数测试
 * Form Validation Utilities Tests
 */

import {
  validateEmail,
  validatePhone,
  validateName,
  validatePreferredDate,
  validateNotes,
  validatePaymentForm,
  type PaymentFormData,
} from '@/lib/validation';

describe('validateEmail', () => {
  describe('有效的邮箱地址', () => {
    it('应该接受标准的邮箱格式', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('应该接受包含数字的邮箱', () => {
      const result = validateEmail('user123@example.com');
      expect(result.isValid).toBe(true);
    });

    it('应该接受包含点号的邮箱', () => {
      const result = validateEmail('first.last@example.com');
      expect(result.isValid).toBe(true);
    });

    it('应该接受子域名邮箱', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.isValid).toBe(true);
    });

    it('应该接受短域名邮箱', () => {
      const result = validateEmail('user@example.co');
      expect(result.isValid).toBe(true);
    });
  });

  describe('无效的邮箱地址', () => {
    it('应该拒绝空字符串', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('应该拒绝只有空格的字符串', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('应该拒绝缺少@符号的邮箱', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('应该拒绝缺少域名的邮箱', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('应该拒绝缺少顶级域名的邮箱', () => {
      const result = validateEmail('test@example');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('应该拒绝包含空格的邮箱', () => {
      const result = validateEmail('test @example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('应该拒绝多个@符号的邮箱', () => {
      const result = validateEmail('test@@example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });
  });
});

describe('validatePhone', () => {
  describe('有效的电话号码', () => {
    it('应该接受空字符串（电话是可选的）', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(true);
    });

    it('应该接受标准的手机号码', () => {
      const result = validatePhone('09012345678');
      expect(result.isValid).toBe(true);
    });

    it('应该接受带连字符的电话', () => {
      const result = validatePhone('090-1234-5678');
      expect(result.isValid).toBe(true);
    });

    it('应该接受带括号的电话', () => {
      const result = validatePhone('(090) 1234-5678');
      expect(result.isValid).toBe(true);
    });

    it('应该接受国际格式电话', () => {
      const result = validatePhone('+81-90-1234-5678');
      expect(result.isValid).toBe(true);
    });

    it('应该接受带空格的电话', () => {
      const result = validatePhone('090 1234 5678');
      expect(result.isValid).toBe(true);
    });
  });

  describe('无效的电话号码', () => {
    it('应该拒绝太短的电话号码（<10位）', () => {
      const result = validatePhone('123456789');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number format');
    });

    it('应该拒绝太长的电话号码（>20位）', () => {
      const result = validatePhone('123456789012345678901');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number format');
    });

    it('应该拒绝包含字母的电话号码', () => {
      const result = validatePhone('090-abcd-5678');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number format');
    });

    it('应该拒绝包含特殊字符的电话号码', () => {
      const result = validatePhone('090@1234#5678');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number format');
    });
  });
});

describe('validateName', () => {
  describe('有效的姓名', () => {
    it('应该接受标准的姓名', () => {
      const result = validateName('山田太郎');
      expect(result.isValid).toBe(true);
    });

    it('应该接受英文姓名', () => {
      const result = validateName('John Smith');
      expect(result.isValid).toBe(true);
    });

    it('应该接受最短姓名（2字符）', () => {
      const result = validateName('王五');
      expect(result.isValid).toBe(true);
    });

    it('应该接受最长姓名（100字符）', () => {
      const longName = 'a'.repeat(100);
      const result = validateName(longName);
      expect(result.isValid).toBe(true);
    });

    it('应该自动去除首尾空格', () => {
      const result = validateName('  山田太郎  ');
      expect(result.isValid).toBe(true);
    });
  });

  describe('无效的姓名', () => {
    it('应该拒绝空字符串', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('应该拒绝只有空格的字符串', () => {
      const result = validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('应该拒绝太短的姓名（<2字符）', () => {
      const result = validateName('王');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is too short (min 2 characters)');
    });

    it('应该拒绝太长的姓名（>100字符）', () => {
      const longName = 'a'.repeat(101);
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is too long (max 100 characters)');
    });
  });
});

describe('validatePreferredDate', () => {
  describe('有效的日期', () => {
    it('应该接受空字符串（日期是可选的）', () => {
      const result = validatePreferredDate('');
      expect(result.isValid).toBe(true);
    });

    it('应该接受今天的日期', () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const result = validatePreferredDate(dateStr);
      expect(result.isValid).toBe(true);
    });

    it('应该接受未来的日期', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const year = future.getFullYear();
      const month = String(future.getMonth() + 1).padStart(2, '0');
      const day = String(future.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const result = validatePreferredDate(dateStr);
      expect(result.isValid).toBe(true);
    });
  });

  describe('无效的日期', () => {
    it('应该拒绝过去的日期', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const year = past.getFullYear();
      const month = String(past.getMonth() + 1).padStart(2, '0');
      const day = String(past.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const result = validatePreferredDate(dateStr);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date must be in the future');
    });
  });
});

describe('validateNotes', () => {
  describe('有效的备注', () => {
    it('应该接受空字符串（备注是可选的）', () => {
      const result = validateNotes('');
      expect(result.isValid).toBe(true);
    });

    it('应该接受标准的备注', () => {
      const result = validateNotes('希望早上9点预约');
      expect(result.isValid).toBe(true);
    });

    it('应该接受最长备注（500字符）', () => {
      const longNotes = 'a'.repeat(500);
      const result = validateNotes(longNotes);
      expect(result.isValid).toBe(true);
    });
  });

  describe('无效的备注', () => {
    it('应该拒绝超长的备注（>500字符）', () => {
      const longNotes = 'a'.repeat(501);
      const result = validateNotes(longNotes);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Notes are too long (max 500 characters)');
    });
  });
});

describe('validatePaymentForm', () => {
  const validFormData: PaymentFormData = {
    name: '山田太郎',
    email: 'test@example.com',
    phone: '090-1234-5678',
    preferredDate: '',
    notes: '',
  };

  describe('有效的表单数据', () => {
    it('应该接受所有字段都有效的表单', () => {
      const result = validatePaymentForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('应该接受没有可选字段的表单', () => {
      const result = validatePaymentForm({
        name: '山田太郎',
        email: 'test@example.com',
      });
      expect(result.isValid).toBe(true);
    });

    it('应该接受包含所有字段的表单', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const year = future.getFullYear();
      const month = String(future.getMonth() + 1).padStart(2, '0');
      const day = String(future.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const result = validatePaymentForm({
        name: '山田太郎',
        email: 'test@example.com',
        phone: '090-1234-5678',
        preferredDate: dateStr,
        notes: '希望早上预约',
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('无效的表单数据', () => {
    it('应该拒绝缺少姓名的表单', () => {
      const result = validatePaymentForm({
        name: '',
        email: 'test@example.com',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('应该拒绝缺少邮箱的表单', () => {
      const result = validatePaymentForm({
        name: '山田太郎',
        email: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('应该拒绝邮箱格式错误的表单', () => {
      const result = validatePaymentForm({
        name: '山田太郎',
        email: 'invalid-email',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('应该拒绝电话号码格式错误的表单', () => {
      const result = validatePaymentForm({
        name: '山田太郎',
        email: 'test@example.com',
        phone: '123',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number format');
    });

    it('应该拒绝日期为过去的表单', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const year = past.getFullYear();
      const month = String(past.getMonth() + 1).padStart(2, '0');
      const day = String(past.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const result = validatePaymentForm({
        name: '山田太郎',
        email: 'test@example.com',
        preferredDate: dateStr,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date must be in the future');
    });

    it('应该拒绝备注过长的表单', () => {
      const result = validatePaymentForm({
        name: '山田太郎',
        email: 'test@example.com',
        notes: 'a'.repeat(501),
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Notes are too long (max 500 characters)');
    });
  });

  describe('验证顺序', () => {
    it('应该先验证姓名，再验证邮箱', () => {
      const result = validatePaymentForm({
        name: '',
        email: 'invalid',
      });
      // 应该返回姓名错误，而不是邮箱错误
      expect(result.error).toBe('Name is required');
    });

    it('应该先验证必填字段，再验证可选字段', () => {
      const result = validatePaymentForm({
        name: '山田太郎',
        email: 'test@example.com',
        phone: '123', // 格式错误
      });
      // 应该返回电话格式错误
      expect(result.error).toBe('Invalid phone number format');
    });
  });
});

describe('边界条件测试', () => {
  it('应该处理 null 值', () => {
    const result = validateEmail(null as any);
    expect(result.isValid).toBe(false);
  });

  it('应该处理 undefined 值', () => {
    const result = validateEmail(undefined as any);
    expect(result.isValid).toBe(false);
  });

  it('应该处理包含 Unicode 字符的姓名', () => {
    const result = validateName('山田太郎👨‍💼');
    expect(result.isValid).toBe(true);
  });

  it('应该接受包含 Unicode 字符（emoji）的邮箱', () => {
    // 注意：虽然不常见，但技术上 Unicode 字符在邮箱地址中是有效的（RFC 6531）
    // 我们的简化正则表达式允许这些字符，这对于国际化邮箱地址是合理的
    const result = validateEmail('test😀@example.com');
    expect(result.isValid).toBe(true);
  });
});
