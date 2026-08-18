import { FileText, Users, ScrollText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContractsOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">合同管理系统</h1>
          <p className="text-gray-600">管理医疗机构合作协议、导游佣金协议和客户服务合同</p>
        </div>

        {/* 合规提示 */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">⚠️ 合规要求</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 所有合同必须由新岛交通株式会社作为合同主体签署</li>
                <li>• 医疗机构合作协议必须确认为自由诊疗（非保险诊疗）</li>
                <li>• 导游佣金协议必须明确禁止直接收取医疗介绍费</li>
                <li>• 客户服务合同必须包含医疗风险告知</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 三种合同类型卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* 医疗机构合作协议 */}
          <Link href="/admin/contracts/medical">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">管理员专用</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">医疗机构合作协议</h3>
              <p className="text-sm text-gray-600 mb-4">
                与医疗机构签署合作协议，明确紹介料标准和合作条款
              </p>
            </div>
          </Link>

          {/* 导游佣金协议 */}
          {/* 目标页面尚未实现，先不做成链接，避免后台里出现 404 入口 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-emerald-600" />
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">尚未开通</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">导游佣金协议</h3>
              <p className="text-sm text-gray-600 mb-4">
                与导游签署佣金协议，明确合规要求和佣金标准
              </p>
            </div>

          {/* 客户服务合同 */}
          {/* 目标页面尚未实现，先不做成链接，避免后台里出现 404 入口 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ScrollText size={24} className="text-amber-600" />
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">尚未开通</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">客户服务合同</h3>
              <p className="text-sm text-gray-600 mb-4">
                客户医疗旅行服务合同，支持在线签名和移动端访问
              </p>
            </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">快速操作</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin/contracts/medical/new"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText size={20} className="text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">创建医疗机构协议</div>
                <div className="text-sm text-gray-500">与新的医疗机构签署合作协议</div>
              </div>
            </Link>

            <Link
              href="/admin/compliance"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertCircle size={20} className="text-amber-600" />
              <div>
                <div className="font-medium text-gray-900">合规审查</div>
                <div className="text-sm text-gray-500">查看季度合规审查任务</div>
              </div>
            </Link>
          </div>
        </div>

        {/* 合规资料 */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">📚 合规文档资料</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700 mb-1">合同模板</div>
              <a href="/contracts/medical-institution-cooperation-agreement.md" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                医疗机构合作协议模板
              </a>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-1">合规规范</div>
              <span className="text-gray-500">见仓库 CLAUDE.md「医疗旅游业务合规规范」</span>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-1">法律依据</div>
              <a
                href="https://www.pref.osaka.lg.jp/o070070/toshimiryoku/tourokujigyousya/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                大阪府旅行業登録
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
