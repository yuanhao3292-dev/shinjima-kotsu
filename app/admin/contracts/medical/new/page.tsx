'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, FileText, DollarSign, Calendar, Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NewMedicalContractPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // 医疗机构信息
    institutionName: '',
    institutionType: '病院',
    institutionCode: '',
    certifications: [] as string[],
    representativeName: '',
    representativeTitle: '院長',
    address: '',
    phone: '',
    email: '',

    // 合作范围
    serviceScope: [] as string[],
    isFreeMedicalCare: true,

    // 紹介料标准
    referralFeeType: 'percentage' as 'percentage' | 'fixed',
    percentageRate: 15,
    fixedAmount: 50000,
    paymentCycle: 'monthly' as 'monthly' | 'quarterly',
    paymentDay: 15,

    // 合同条款
    contractTermYears: 1,
    autoRenewal: true,
    noticeDays: 60,

    // 生效日期
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  const certificationOptions = ['JCI认证', 'ISO认证', '厚生省认证', '其他'];
  const serviceScopeOptions = ['健康体检', '精密体检', '专科诊疗', '美容医疗', '癌症治疗', '其他'];

  const handleCheckboxChange = (field: 'certifications' | 'serviceScope', value: string) => {
    const currentArray = formData[field];
    if (currentArray.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentArray.filter(item => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentArray, value],
      });
    }
  };

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NJKT-MIC-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // 计算到期日期
      const effectiveDate = new Date(formData.effectiveDate);
      const expiryDate = new Date(effectiveDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + formData.contractTermYears);

      // 构建紹介料配置
      const referralFeeConfig = formData.referralFeeType === 'percentage'
        ? {
            type: 'percentage',
            rate: formData.percentageRate,
            description: `医疗费用的 ${formData.percentageRate}%`,
          }
        : {
            type: 'fixed',
            amount: formData.fixedAmount,
            description: `每位患者 ¥${formData.fixedAmount.toLocaleString()} 日元`,
          };

      const { data, error: insertError } = await supabase
        .from('medical_institution_contracts')
        .insert({
          contract_number: generateContractNumber(),
          institution_name: formData.institutionName,
          institution_type: formData.institutionType,
          institution_code: formData.institutionCode || null,
          certifications: formData.certifications,
          representative_name: formData.representativeName,
          representative_title: formData.representativeTitle,
          address: formData.address || null,
          phone: formData.phone || null,
          email: formData.email || null,
          service_scope: formData.serviceScope,
          is_free_medical_care: formData.isFreeMedicalCare,
          referral_fee_type: formData.referralFeeType,
          referral_fee_config: referralFeeConfig,
          payment_cycle: formData.paymentCycle,
          payment_day: formData.paymentDay,
          contract_term_years: formData.contractTermYears,
          auto_renewal: formData.autoRenewal,
          notice_days: formData.noticeDays,
          effective_date: formData.effectiveDate,
          expiry_date: expiryDate.toISOString().split('T')[0],
          status: 'draft',
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 跳转到详情页
      router.push(`/admin/contracts/medical/${data.id}`);
    } catch (err: any) {
      setError(err.message || '创建合同失败');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 顶部导航 */}
        <div className="mb-6">
          <Link
            href="/admin/contracts/medical"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ← 返回医疗机构合同列表
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建医疗机构合作协议</h1>
          <p className="text-gray-600">填写医疗机构信息和合作条款</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 医疗机构基本信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              医疗机构信息
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  医疗机构名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="例如: 兵库医科大学病院"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">机构类型</label>
                <select
                  value={formData.institutionType}
                  onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="病院">病院</option>
                  <option value="クリニック">クリニック</option>
                  <option value="検診センター">検診センター</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">医疗机构代码</label>
                <input
                  type="text"
                  value={formData.institutionCode}
                  onChange={(e) => setFormData({ ...formData, institutionCode: e.target.value })}
                  placeholder="医療機関コード"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">认证资质</label>
                <div className="grid grid-cols-2 gap-3">
                  {certificationOptions.map(cert => (
                    <label key={cert} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => handleCheckboxChange('certifications', cert)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  代表者姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.representativeName}
                  onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                  placeholder="例如: 山田太郎"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">职务</label>
                <select
                  value={formData.representativeTitle}
                  onChange={(e) => setFormData({ ...formData, representativeTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="院長">院長</option>
                  <option value="理事長">理事長</option>
                  <option value="事務長">事務長</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">地址</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="〒XXX-XXXX ..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="06-XXXX-XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@example.jp"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 合作范围 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-emerald-600" />
              合作范围
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">服务项目</label>
                <div className="grid grid-cols-2 gap-3">
                  {serviceScopeOptions.map(service => (
                    <label key={service} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.serviceScope.includes(service)}
                        onChange={() => handleCheckboxChange('serviceScope', service)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFreeMedicalCare}
                    onChange={(e) => setFormData({ ...formData, isFreeMedicalCare: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">✓ 确认为自由诊疗（非保险诊疗）</div>
                    <div className="text-blue-700">
                      根据厚生劳动省规定，只有自由诊疗允许支付紹介料
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 紹介料标准 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-amber-600" />
              紹介料标准
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">紹介料类型</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.referralFeeType === 'percentage'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="referralFeeType"
                      value="percentage"
                      checked={formData.referralFeeType === 'percentage'}
                      onChange={(e) => setFormData({ ...formData, referralFeeType: 'percentage' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">百分比</div>
                      <div className="text-xs text-gray-600">按医疗费用百分比计算</div>
                    </div>
                  </label>
                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.referralFeeType === 'fixed'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="referralFeeType"
                      value="fixed"
                      checked={formData.referralFeeType === 'fixed'}
                      onChange={(e) => setFormData({ ...formData, referralFeeType: 'fixed' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">固定金额</div>
                      <div className="text-xs text-gray-600">每位患者固定费用</div>
                    </div>
                  </label>
                </div>
              </div>

              {formData.referralFeeType === 'percentage' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">百分比（%）</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.percentageRate}
                    onChange={(e) => setFormData({ ...formData, percentageRate: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    例如: 15% 表示医疗费用的 15% 作为紹介料
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">固定金额（日元）</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.fixedAmount}
                    onChange={(e) => setFormData({ ...formData, fixedAmount: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    每位患者固定支付金额
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">支付周期</label>
                  <select
                    value={formData.paymentCycle}
                    onChange={(e) => setFormData({ ...formData, paymentCycle: e.target.value as 'monthly' | 'quarterly' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">每月</option>
                    <option value="quarterly">每季度</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">支付日</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.paymentDay}
                    onChange={(e) => setFormData({ ...formData, paymentDay: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">每月第几日支付</p>
                </div>
              </div>
            </div>
          </div>

          {/* 合同条款 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-purple-600" />
              合同条款
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">合同期限（年）</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.contractTermYears}
                  onChange={(e) => setFormData({ ...formData, contractTermYears: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">生效日期</label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">提前通知天数</label>
                <input
                  type="number"
                  min="30"
                  max="180"
                  value={formData.noticeDays}
                  onChange={(e) => setFormData({ ...formData, noticeDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-600 mt-1">终止合同提前通知天数</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoRenewal}
                  onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">自动续约</span>
              </label>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex gap-4">
            <Link
              href="/admin/contracts/medical"
              className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <Save size={20} />
                  创建协议
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
