'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import TIMCContent from './TIMCContent';

export default function TIMCProductPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Product Center */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/guide-partner/product-center')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition text-sm"
          >
            <ArrowLeft size={16} />
            返回选品中心
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">TIMC 体检中心</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">完整服务模块</span>
          </div>
        </div>
      </div>

      <TIMCContent />

      {/* Back to Product Center */}
      <div className="text-center py-12">
        <button onClick={() => router.push('/guide-partner/product-center')} className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
          <ArrowLeft size={16} /> 返回选品中心
        </button>
      </div>
    </div>
  );
}
