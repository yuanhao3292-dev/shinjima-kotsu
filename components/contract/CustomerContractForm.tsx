'use client';

import { useState } from 'react';
import { User, Mail, Phone, Globe, Users } from 'lucide-react';

interface CustomerInfo {
  customerName: string;
  passportNumber: string;
  nationality: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface CustomerContractFormProps {
  initialData?: Partial<CustomerInfo>;
  onDataChange: (data: CustomerInfo) => void;
}

export default function CustomerContractForm({ initialData, onDataChange }: CustomerContractFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    customerName: initialData?.customerName || '',
    passportNumber: initialData?.passportNumber || '',
    nationality: initialData?.nationality || '中国',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    emergencyContact: initialData?.emergencyContact || '',
    emergencyPhone: initialData?.emergencyPhone || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // 清除该字段的错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }

    // 通知父组件
    onDataChange(newData);
  };

  const validateField = (field: keyof CustomerInfo): string | undefined => {
    const value = formData[field];

    if (!value.trim()) {
      return '此项为必填项';
    }

    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '请输入有效的邮箱地址';
    }

    if (field === 'phone' && !/^[\d\s\-+()]+$/.test(value)) {
      return '请输入有效的电话号码';
    }

    if (field === 'emergencyPhone' && value && !/^[\d\s\-+()]+$/.test(value)) {
      return '请输入有效的紧急联系电话';
    }

    return undefined;
  };

  const handleBlur = (field: keyof CustomerInfo) => {
    const error = validateField(field);
    if (error) {
      setErrors({ ...errors, [field]: error });
    }
  };

  return (
    <div className="space-y-6">
      {/* 客户基本信息 */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-blue-600" />
          客户信息
        </h3>

        <div className="space-y-4">
          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              onBlur={() => handleBlur('customerName')}
              placeholder="请输入您的真实姓名"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.customerName
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* 护照号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              护照号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.passportNumber}
              onChange={(e) => handleChange('passportNumber', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('passportNumber')}
              placeholder="例如: E12345678"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.passportNumber
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.passportNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>
            )}
          </div>

          {/* 国籍 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              国籍 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="中国">中国</option>
              <option value="日本">日本</option>
              <option value="美国">美国</option>
              <option value="韩国">韩国</option>
              <option value="新加坡">新加坡</option>
              <option value="马来西亚">马来西亚</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>
      </div>

      {/* 联系方式 */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Phone size={20} className="text-emerald-600" />
          联系方式
        </h3>

        <div className="space-y-4">
          {/* 手机号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              手机号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="+86 138 0000 0000"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.phone
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">请包含国家代码，如 +86</p>
          </div>

          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              电子邮箱 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">合同将发送到此邮箱</p>
          </div>
        </div>
      </div>

      {/* 紧急联系人 */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} className="text-amber-600" />
          紧急联系人
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              紧急联系人姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              onBlur={() => handleBlur('emergencyContact')}
              placeholder="请输入紧急联系人姓名"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.emergencyContact
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.emergencyContact && (
              <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              紧急联系人电话 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => handleChange('emergencyPhone', e.target.value)}
              onBlur={() => handleBlur('emergencyPhone')}
              placeholder="+86 138 0000 0000"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.emergencyPhone
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.emergencyPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
