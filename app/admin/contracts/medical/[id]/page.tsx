'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, FileText, Download, Check, X } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MedicalContractDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadContract();
  }, [resolvedParams.id]);

  async function loadContract() {
    const { data } = await supabase
      .from('medical_institution_contracts')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    setContract(data);
    setLoading(false);
  }

  async function handleActivate() {
    const confirmed = confirm('确认激活此协议？');
    if (!confirmed) return;

    const { error } = await supabase
      .from('medical_institution_contracts')
      .update({
        status: 'active',
        signed_by_niijima_at: new Date().toISOString(),
        effective_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + contract.contract_term_years * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      })
      .eq('id', resolvedParams.id);

    if (!error) {
      alert('协议已激活！');
      loadContract();
    }
  }

  async function downloadPDF() {
    // TODO: 生成PDF的逻辑
    // 使用 contracts/medical-institution-cooperation-agreement.md 模板
    // 填充数据并生成PDF
    alert('PDF生成功能待实现');
  }

  if (loading) return <div className="p-8">加载中...</div>;
  if (!contract) return <div className="p-8">协议不存在</div>;

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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/contracts/medical"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          返回列表
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{contract.institution_name}</h1>
                {getStatusBadge(contract.status)}
              </div>
              <p className="text-gray-600">合同编号：{contract.contract_number}</p>
            </div>
            <div className="flex gap-2">
              {contract.status === 'draft' && (
                <button
                  onClick={handleActivate}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Check size={18} />
                  激活协议
                </button>
              )}
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download size={18} />
                下载PDF
              </button>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">医疗机构信息</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">机构类型：</span>{contract.institution_type}</div>
                <div><span className="text-gray-500">代表者：</span>{contract.representative_name} ({contract.representative_title})</div>
                <div><span className="text-gray-500">地址：</span>{contract.address}</div>
                <div><span className="text-gray-500">电话：</span>{contract.phone}</div>
                <div><span className="text-gray-500">Email：</span>{contract.email}</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">合同信息</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">生效日期：</span>{contract.effective_date || '未设置'}</div>
                <div><span className="text-gray-500">到期日期：</span>{contract.expiry_date || '未设置'}</div>
                <div><span className="text-gray-500">合同期限：</span>{contract.contract_term_years} 年</div>
                <div><span className="text-gray-500">自动续约：</span>{contract.auto_renewal ? '是' : '否'}</div>
                <div>
                  <span className="text-gray-500">诊疗类型：</span>
                  {contract.is_free_medical_care ? (
                    <span className="text-green-600 font-medium">✅ 自由诊疗（合规）</span>
                  ) : (
                    <span className="text-red-600 font-medium">❌ 非自由诊疗</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 紹介料标准 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">紹介料标准</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-500">计费方式：</span>{contract.referral_fee_type === 'percentage' ? '按比例' : '固定金额'}</div>
            <div><span className="text-gray-500">配置：</span>{JSON.stringify(contract.referral_fee_config)}</div>
            <div><span className="text-gray-500">支付周期：</span>{contract.payment_cycle}</div>
          </div>
        </div>

        {/* 合规提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">✅ 合规确认</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 该协议已确认为自由诊疗（非保险诊疗）</li>
            <li>• 符合厚生劳动省关于患者紹介料的規定</li>
            <li>• 合同主体为新岛交通株式会社（旅行業第2-3115号）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
