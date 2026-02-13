import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { FileText, Plus, ExternalLink, AlertCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function MedicalContractsListPage() {
  const supabase = await createClient();

  // 检查管理员权限
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // 获取所有医疗机构合同
  const { data: contracts, error } = await supabase
    .from('medical_institution_contracts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch medical contracts error:', error);
  }

  const activeContracts = contracts?.filter(c => c.status === 'active') || [];
  const pendingContracts = contracts?.filter(c => c.status === 'pending') || [];
  const expiringSoon = contracts?.filter(c => {
    if (!c.expiry_date) return false;
    const daysUntilExpiry = Math.floor(
      (new Date(c.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return c.status === 'active' && daysUntilExpiry <= 60 && daysUntilExpiry > 0;
  }) || [];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      draft: { label: '草稿', className: 'bg-gray-100 text-gray-700' },
      pending: { label: '待签署', className: 'bg-yellow-100 text-yellow-700' },
      active: { label: '生效中', className: 'bg-green-100 text-green-700' },
      expired: { label: '已过期', className: 'bg-red-100 text-red-700' },
      terminated: { label: '已终止', className: 'bg-gray-100 text-gray-700' },
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 顶部导航 */}
        <div className="mb-6">
          <Link
            href="/admin/contracts"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ← 返回合同管理
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">医疗机构合作协议</h1>
            <p className="text-gray-600">管理与医疗机构签署的合作协议和紹介料标准</p>
          </div>
          <Link
            href="/admin/contracts/medical/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            创建新协议
          </Link>
        </div>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">生效中的合同</div>
            <div className="text-3xl font-bold text-gray-900">{activeContracts.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">待签署</div>
            <div className="text-3xl font-bold text-yellow-600">{pendingContracts.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">即将到期（60天内）</div>
            <div className="text-3xl font-bold text-red-600">{expiringSoon.length}</div>
          </div>
        </div>

        {/* 即将到期警告 */}
        {expiringSoon.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">⚠️ 即将到期的合同</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  {expiringSoon.map(contract => {
                    const daysUntilExpiry = Math.floor(
                      (new Date(contract.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <li key={contract.id}>
                        • {contract.institution_name} - 还有 {daysUntilExpiry} 天到期
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 合同列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">所有合同</h2>
          </div>

          {contracts && contracts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <Link
                  key={contract.id}
                  href={`/admin/contracts/medical/${contract.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {contract.institution_name}
                          </h3>
                          {getStatusBadge(contract.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">合同编号: </span>
                            <span className="font-mono text-gray-900">{contract.contract_number}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">机构类型: </span>
                            <span className="text-gray-900">{contract.institution_type || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">生效日期: </span>
                            <span className="text-gray-900">
                              {contract.effective_date
                                ? new Date(contract.effective_date).toLocaleDateString('zh-CN')
                                : '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">到期日期: </span>
                            <span className={`${
                              contract.expiry_date &&
                              new Date(contract.expiry_date) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
                                ? 'text-red-600 font-medium'
                                : 'text-gray-900'
                            }`}>
                              {contract.expiry_date
                                ? new Date(contract.expiry_date).toLocaleDateString('zh-CN')
                                : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">紹介料类型:</span>
                            <span className="text-gray-900">
                              {contract.referral_fee_type === 'percentage' ? '百分比' : '固定金额'}
                            </span>
                          </div>
                          {contract.is_free_medical_care && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                              ✓ 自由诊疗
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ExternalLink size={20} className="text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无医疗机构合同</h3>
              <p className="text-gray-600 mb-6">开始创建您的第一份医疗机构合作协议</p>
              <Link
                href="/admin/contracts/medical/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                创建新协议
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
