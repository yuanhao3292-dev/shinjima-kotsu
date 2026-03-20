# 合同管理系统完整实施指南

**创建日期**：2026-02-13
**系统规模**：16个文件
**预计开发时间**：2-3天

---

## 📋 系统概览

本系统实现四大核心功能：
1. **管理员** - 与医疗机构签署合作协议
2. **导游** - 查看并上传签字的佣金协议
3. **客户** - 在线填写并签署服务合同（移动端优先）
4. **管理员** - 定期合规审查提示

---

## ✅ 已完成（2/16）

1. ✅ `supabase/migrations/062_contract_management_system.sql` - 数据库表
2. ✅ `app/admin/contracts/page.tsx` - 合同管理总览页

---

## 🚧 待实现文件清单（14/16）

### **Phase 1：管理员 - 医疗机构合作协议（3个文件）**

#### 3. `app/admin/contracts/medical/page.tsx` - 医疗机构协议列表

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, FileText, Clock, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function MedicalContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    const { data } = await supabase
      .from('medical_institution_contracts')
      .select('*')
      .order('created_at', { ascending: false });

    setContracts(data || []);
    setLoading(false);
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      expired: 'bg-red-100 text-red-700',
    };
    const labels = {
      draft: '草稿',
      pending: '待签署',
      active: '有效',
      expired: '已过期',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">医疗机构合作协议</h1>
            <p className="text-gray-600">管理与医疗机构的合作协议</p>
          </div>
          <Link
            href="/admin/contracts/medical/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            创建新协议
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">加载中...</div>
        ) : contracts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有合作协议</h3>
            <p className="text-gray-600 mb-6">创建第一个医疗机构合作协议</p>
            <Link
              href="/admin/contracts/medical/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              创建协议
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <Link
                key={contract.id}
                href={`/admin/contracts/medical/${contract.id}`}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {contract.institution_name}
                      </h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">合同编号：</span>
                        {contract.contract_number}
                      </div>
                      <div>
                        <span className="font-medium">生效日期：</span>
                        {contract.effective_date || '未设置'}
                      </div>
                      <div>
                        <span className="font-medium">到期日期：</span>
                        {contract.expiry_date || '未设置'}
                      </div>
                    </div>
                  </div>
                  <FileText size={24} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 4. `app/admin/contracts/medical/new/page.tsx` - 创建医疗机构协议

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewMedicalContractPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    institution_name: '',
    institution_type: 'hospital',
    institution_code: '',
    representative_name: '',
    representative_title: 'director',
    address: '',
    phone: '',
    email: '',
    service_scope: [],
    is_free_medical_care: true,
    referral_fee_type: 'percentage',
    referral_fee_config: { service_fee: 10, ranges: [] },
    contract_term_years: 1,
    auto_renewal: true,
    notice_days: 60,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // 生成合同编号
    const contractNumber = `NJKT-MIC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('medical_institution_contracts')
      .insert([{
        ...formData,
        contract_number: contractNumber,
        status: 'draft',
      }])
      .select()
      .single();

    if (error) {
      alert('创建失败：' + error.message);
      setSaving(false);
      return;
    }

    alert('协议创建成功！');
    router.push(`/admin/contracts/medical/${data.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/contracts/medical"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          返回列表
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">创建医疗机构合作协议</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 医疗机构基本信息 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">医疗机构信息</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    机构名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institution_name}
                    onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="德州会国际医疗中心"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    机构类型
                  </label>
                  <select
                    value={formData.institution_type}
                    onChange={(e) => setFormData({ ...formData, institution_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hospital">病院</option>
                    <option value="clinic">クリニック</option>
                    <option value="screening_center">検診センター</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    代表者姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.representative_name}
                    onChange={(e) => setFormData({ ...formData, representative_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职位
                  </label>
                  <select
                    value={formData.representative_title}
                    onChange={(e) => setFormData({ ...formData, representative_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="director">院長</option>
                    <option value="president">理事長</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    地址
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    电话
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 诊疗类型确认 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_free_medical_care}
                  onChange={(e) => setFormData({ ...formData, is_free_medical_care: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-blue-900">
                    ✅ 确认为自由诊疗（非保险诊疗）
                  </div>
                  <div className="text-sm text-blue-700">
                    根据厚生劳动省規定，只有自由诊疗允许支付患者紹介料
                  </div>
                </div>
              </label>
            </div>

            {/* 紹介料标准 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">紹介料标准</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    计费方式
                  </label>
                  <select
                    value={formData.referral_fee_type}
                    onChange={(e) => setFormData({ ...formData, referral_fee_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">按医疗费比例</option>
                    <option value="fixed">固定金额</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 合同条款 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">合同条款</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    合同期限（年）
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.contract_term_years}
                    onChange={(e) => setFormData({ ...formData, contract_term_years: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    自动续约
                  </label>
                  <select
                    value={formData.auto_renewal ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, auto_renewal: e.target.value === 'yes' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="yes">是</option>
                    <option value="no">否</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提前终止通知天数
                  </label>
                  <input
                    type="number"
                    value={formData.notice_days}
                    onChange={(e) => setFormData({ ...formData, notice_days: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Link
                href="/admin/contracts/medical"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '保存中...' : '创建协议'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 您的选择

由于完整实现需要大量代码（预计还需10,000+行），我建议：

**Option 1：我继续完整实现**
- 我现在继续创建剩余的12个文件
- 预计需要2-3轮对话完成
- 您将获得一个完整可用的系统

**Option 2：提供详细指南，您按需实现**
- 我提供每个文件的详细代码结构和核心逻辑
- 您可以选择性实现需要的功能
- 节省Token，更灵活

**Option 3：先实现客户端在线签约**
- 这是最面向C端的核心功能
- 实现移动端友好的在线签名
- 其他功能后续再实现

请告诉我您的选择，我立即执行！
