'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Upload, Check, AlertCircle } from 'lucide-react';
import SignatureUpload from '@/components/guide-partner/SignatureUpload';

export default function GuideContractPage() {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadContract();
  }, []);

  async function loadContract() {
    // 获取当前登录导游的信息
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 获取导游ID
    const { data: guide } = await supabase
      .from('guides')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!guide) return;

    // 获取导游的佣金协议
    const { data: contractData } = await supabase
      .from('guide_commission_contracts')
      .select('*')
      .eq('guide_id', guide.id)
      .eq('status', 'active')
      .single();

    setContract(contractData);
    setLoading(false);
  }

  async function handleSignatureUploaded(url: string) {
    const { error } = await supabase
      .from('guide_commission_contracts')
      .update({
        guide_signature_url: url,
        signed_by_guide_at: new Date().toISOString(),
        status: 'active',
      })
      .eq('id', contract.id);

    if (!error) {
      alert('签字上传成功！协议已激活。');
      setShowUpload(false);
      loadContract();
    }
  }

  if (loading) return <div className="p-8">加载中...</div>;

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无佣金协议</h3>
            <p className="text-gray-600">请联系管理员创建您的佣金协议</p>
          </div>
        </div>
      </div>
    );
  }

  const hasSigned = !!contract.guide_signature_url;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的佣金协议</h1>

        {/* 协议状态 */}
        <div className={`rounded-lg border p-6 mb-6 ${hasSigned ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-start gap-3">
            {hasSigned ? (
              <Check size={24} className="text-green-600" />
            ) : (
              <AlertCircle size={24} className="text-yellow-600" />
            )}
            <div>
              <h3 className={`font-bold mb-1 ${hasSigned ? 'text-green-900' : 'text-yellow-900'}`}>
                {hasSigned ? '✅ 协议已签署' : '⚠️ 待签署'}
              </h3>
              <p className={`text-sm ${hasSigned ? 'text-green-700' : 'text-yellow-700'}`}>
                {hasSigned
                  ? `您已于 ${new Date(contract.signed_by_guide_at).toLocaleDateString()} 签署协议`
                  : '请下载协议，签字后上传扫描件'}
              </p>
            </div>
          </div>
        </div>

        {/* 协议信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">协议信息</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">合同编号：</span>{contract.contract_number}</div>
            <div><span className="text-gray-500">签署日期：</span>{contract.signed_by_guide_at ? new Date(contract.signed_by_guide_at).toLocaleDateString() : '未签署'}</div>
            <div><span className="text-gray-500">生效日期：</span>{contract.effective_date || '未设置'}</div>
            <div><span className="text-gray-500">到期日期：</span>{contract.expiry_date || '未设置'}</div>
          </div>
        </div>

        {/* 佣金标准 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">佣金标准</h3>
          <div className="text-sm space-y-2">
            <div><span className="text-gray-500">类型：</span>{contract.commission_type}</div>
            <div><span className="text-gray-500">配置：</span>{JSON.stringify(contract.commission_config)}</div>
          </div>
        </div>

        {/* 合规要求 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-red-900 mb-3">⛔ 严格禁止的行为</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• ❌ 不得以任何名义直接从医疗机构收取费用或好处</li>
            <li>• ❌ 不得以个人名义与客户签署医疗旅游合同</li>
            <li>• ❌ 不得虚假宣传医疗效果（"包治百病""100%治愈"等）</li>
            <li>• ❌ 不得泄露客户个人信息和医疗隐私</li>
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <a
            href="/contracts/guide-commission-agreement.md"
            download
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <FileText size={20} />
            下载协议模板
          </a>

          {!hasSigned && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              <Upload size={20} />
              上传签字扫描件
            </button>
          )}
        </div>

        {/* 上传签字组件 */}
        {showUpload && (
          <SignatureUpload
            onSuccess={handleSignatureUploaded}
            onCancel={() => setShowUpload(false)}
          />
        )}
      </div>
    </div>
  );
}
