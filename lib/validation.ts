/**
 * 表单验证工具函数
 * Form Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 验证邮箱格式
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

/**
 * 验证电话号码格式（国际格式，支持日本、中国、美国等）
 * Validate phone number format (international format)
 */
export const validatePhone = (phone: string): ValidationResult => {
  // 电话号码是可选的
  if (!phone || !phone.trim()) {
    return { isValid: true };
  }

  // 允许数字、空格、括号、加号、连字符
  const phoneRegex = /^[\d\-+() ]{10,20}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  return { isValid: true };
};

/**
 * 验证姓名
 * Validate name
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name is too short (min 2 characters)' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'Name is too long (max 100 characters)' };
  }

  return { isValid: true };
};

/**
 * 验证日期（可选，但如果提供必须是未来日期）
 * Validate date (optional, but must be future date if provided)
 */
export const validatePreferredDate = (date: string): ValidationResult => {
  // 日期是可选的
  if (!date || !date.trim()) {
    return { isValid: true };
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  return { isValid: true };
};

/**
 * 验证备注长度
 * Validate notes length
 */
export const validateNotes = (notes: string): ValidationResult => {
  // 备注是可选的
  if (!notes || !notes.trim()) {
    return { isValid: true };
  }

  if (notes.trim().length > 500) {
    return { isValid: false, error: 'Notes are too long (max 500 characters)' };
  }

  return { isValid: true };
};

/**
 * 验证所有支付表单字段
 * Validate all payment form fields
 */
export interface PaymentFormData {
  name: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  notes?: string;
}

export const validatePaymentForm = (data: PaymentFormData): ValidationResult => {
  // 验证姓名
  const nameResult = validateName(data.name);
  if (!nameResult.isValid) {
    return nameResult;
  }

  // 验证邮箱
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    return emailResult;
  }

  // 验证电话号码（可选）
  if (data.phone) {
    const phoneResult = validatePhone(data.phone);
    if (!phoneResult.isValid) {
      return phoneResult;
    }
  }

  // 验证日期（可选）
  if (data.preferredDate) {
    const dateResult = validatePreferredDate(data.preferredDate);
    if (!dateResult.isValid) {
      return dateResult;
    }
  }

  // 验证备注（可选）
  if (data.notes) {
    const notesResult = validateNotes(data.notes);
    if (!notesResult.isValid) {
      return notesResult;
    }
  }

  return { isValid: true };
};
