import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import CustomerContractSigningPage from './CustomerContractSigningPage';

interface ContractSignPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContractSignPage({ params }: ContractSignPageProps) {
  const { id } = await params;
  // 使用 service role（客户无需登录即可查看签约页面）
  const supabase = getSupabaseAdmin();

  // 获取合同信息
  const { data: contract, error } = await supabase
    .from('customer_service_contracts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !contract) {
    notFound();
  }

  // 如果合同已签署，显示已签署状态
  if (contract.status === 'signed' || contract.status === 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">合同已签署</h1>
          <p className="text-gray-600 mb-6">
            您的服务合同已于 {new Date(contract.signed_by_customer_at).toLocaleDateString('zh-CN')} 签署完成
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <div className="text-sm text-gray-600 mb-1">合同编号</div>
            <div className="font-mono text-gray-900">{contract.contract_number}</div>
          </div>
          {contract.pdf_url && (
            <a
              href={contract.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              下载合同 PDF
            </a>
          )}
        </div>
      </div>
    );
  }

  // 渲染签署页面（客户端组件）
  return <CustomerContractSigningPage contract={contract} />;
}

export async function generateMetadata({ params }: ContractSignPageProps) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: contract } = await supabase
    .from('customer_service_contracts')
    .select('contract_number, customer_name')
    .eq('id', id)
    .single();

  return {
    title: contract
      ? `签署合同 - ${contract.contract_number}`
      : '合同签署',
    description: '新岛交通医疗旅行服务合同在线签署',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  };
}
