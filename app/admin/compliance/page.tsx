import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import ComplianceChecklist from '@/components/admin/ComplianceChecklist';

export default async function CompliancePage() {
  const supabase = await createClient();

  // 获取所有合规审查记录
  const { data: reviews, error } = await supabase
    .from('compliance_review_records')
    .select('*')
    .order('review_due_date', { ascending: false });

  if (error) {
    console.error('Fetch compliance reviews error:', error);
  }

  // 计算统计数据
  const currentReview = reviews?.find(r => r.status === 'pending' || r.status === 'in_progress');
  const completedReviews = reviews?.filter(r => r.status === 'completed') || [];
  const overdueReviews = reviews?.filter(r => {
    if (r.status !== 'pending' && r.status !== 'in_progress') return false;
    return new Date(r.review_due_date) < new Date();
  }) || [];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">合规审查</h1>
          <p className="text-gray-600">定期审查业务合规性，确保符合日本旅行业法和医疗相关法规</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">当前审查周期</div>
              <Clock size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentReview?.review_quarter || '无'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">已完成审查</div>
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedReviews.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">逾期审查</div>
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{overdueReviews.length}</div>
          </div>
        </div>

        {/* 逾期警告 */}
        {overdueReviews.length > 0 && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-red-900 mb-2">⚠️ 逾期审查提醒</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  {overdueReviews.map(review => {
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - new Date(review.review_due_date).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <li key={review.id}>
                        • {review.review_quarter} - 已逾期 {daysOverdue} 天
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 当前审查清单 */}
        {currentReview && (
          <div className="mb-8">
            <ComplianceChecklist review={currentReview} />
          </div>
        )}

        {/* 审查历史 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">审查历史</h2>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => {
                const getStatusBadge = (status: string) => {
                  const badges: Record<string, { label: string; className: string }> = {
                    pending: { label: '待处理', className: 'bg-yellow-100 text-yellow-700' },
                    in_progress: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
                    completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
                    overdue: { label: '已逾期', className: 'bg-red-100 text-red-700' },
                  };
                  const badge = badges[status] || badges.pending;
                  return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  );
                };

                // 计算任务完成度
                const tasks = review.tasks as any[];
                const completedTasks = tasks.filter(t => t.status === 'completed').length;
                const totalTasks = tasks.length;
                const progress = Math.round((completedTasks / totalTasks) * 100);

                return (
                  <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-gray-900 text-lg">{review.review_quarter}</h3>
                          {getStatusBadge(review.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600">截止日期: </span>
                            <span className="text-gray-900">
                              {new Date(review.review_due_date).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">完成时间: </span>
                            <span className="text-gray-900">
                              {review.completed_at
                                ? new Date(review.completed_at).toLocaleDateString('zh-CN')
                                : '-'}
                            </span>
                          </div>
                        </div>

                        {/* 进度条 */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">任务完成度</span>
                            <span className="font-medium text-gray-900">
                              {completedTasks}/{totalTasks} ({progress}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* 任务列表预览 */}
                        <div className="space-y-1">
                          {tasks.slice(0, 3).map((task, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              {task.status === 'completed' ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                              )}
                              <span className={task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                {task.task}
                              </span>
                            </div>
                          ))}
                          {tasks.length > 3 && (
                            <div className="text-sm text-gray-500 ml-6">
                              +{tasks.length - 3} 项其他任务
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无审查记录</h3>
              <p className="text-gray-600">系统会自动创建季度审查任务</p>
            </div>
          )}
        </div>

        {/* 合规指南 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">📚 合规审查指南</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>审查周期：</strong>每季度进行一次全面合规审查（3月、6月、9月、12月）</p>
            <p><strong>审查范围：</strong>白标页面文案、合同模板、导游合规培训、业务流程合规性</p>
            <p><strong>法律依据：</strong>日本旅行业法、厚生劳动省医疗相关規定、大阪府旅行业登録要求</p>
            <p>
              <strong>参考资料：</strong>
              <Link href="/CLAUDE.md#医疗旅游业务合规规范" className="text-blue-600 hover:underline ml-1">
                查看 CLAUDE.md 合规规范
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
