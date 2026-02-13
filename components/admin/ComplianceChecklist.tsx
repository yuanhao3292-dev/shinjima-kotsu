'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, Circle, Loader2, Save } from 'lucide-react';

interface ComplianceTask {
  task: string;
  status: 'pending' | 'completed';
  completed_at: string | null;
  description?: string;
}

interface ComplianceChecklistProps {
  review: {
    id: string;
    review_quarter: string;
    review_due_date: string;
    tasks: ComplianceTask[];
    status: string;
    notes?: string;
  };
}

export default function ComplianceChecklist({ review }: ComplianceChecklistProps) {
  const [tasks, setTasks] = useState<ComplianceTask[]>(review.tasks || []);
  const [notes, setNotes] = useState(review.notes || '');
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleToggleTask = async (index: number) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[index];

    if (task.status === 'pending') {
      task.status = 'completed';
      task.completed_at = new Date().toISOString();
    } else {
      task.status = 'pending';
      task.completed_at = null;
    }

    setTasks(updatedTasks);
    await saveChanges(updatedTasks, notes);
  };

  const saveChanges = async (updatedTasks: ComplianceTask[], updatedNotes: string) => {
    setSaving(true);

    try {
      // 检查是否所有任务都完成了
      const allCompleted = updatedTasks.every(t => t.status === 'completed');
      const newStatus = allCompleted ? 'completed' : 'in_progress';

      const updateData: any = {
        tasks: updatedTasks,
        notes: updatedNotes,
        status: newStatus,
      };

      if (allCompleted && review.status !== 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('compliance_review_records')
        .update(updateData)
        .eq('id', review.id);

      if (error) throw error;

      if (allCompleted && review.status !== 'completed') {
        alert('🎉 所有审查任务已完成！');
      }
    } catch (error) {
      console.error('Save compliance error:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = () => {
    saveChanges(tasks, notes);
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  // 计算距离截止日期的天数
  const daysUntilDue = Math.ceil(
    (new Date(review.review_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* 标题和进度 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{review.review_quarter} 合规审查</h2>
            <p className="text-sm text-gray-600">
              截止日期: {new Date(review.review_due_date).toLocaleDateString('zh-CN')}
              {daysUntilDue > 0 ? (
                <span className="ml-2 text-blue-600">（还有 {daysUntilDue} 天）</span>
              ) : (
                <span className="ml-2 text-red-600">（已逾期 {Math.abs(daysUntilDue)} 天）</span>
              )}
            </p>
          </div>
          {saving && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 size={16} className="animate-spin" />
              保存中...
            </div>
          )}
        </div>

        {/* 进度条 */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">完成进度</span>
            <span className="font-medium text-gray-900">
              {completedCount}/{totalCount} ({progress}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                progress === 100 ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 任务清单 */}
      <div className="space-y-4 mb-6">
        <h3 className="font-bold text-gray-900">审查任务</h3>
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-all ${
              task.status === 'completed'
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => handleToggleTask(index)}
                className="flex-shrink-0 mt-0.5"
              >
                {task.status === 'completed' ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <Circle size={24} className="text-gray-400 hover:text-blue-600 transition-colors" />
                )}
              </button>
              <div className="flex-1">
                <div
                  className={`font-medium mb-1 ${
                    task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}
                >
                  {task.task}
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
                {task.completed_at && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ 完成于 {new Date(task.completed_at).toLocaleDateString('zh-CN')}
                  </p>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* 备注 */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-bold text-gray-900 mb-3">审查备注</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSaveNotes}
          placeholder="记录审查过程中发现的问题、采取的措施等..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
        />
        <button
          onClick={handleSaveNotes}
          disabled={saving}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          保存备注
        </button>
      </div>

      {/* 完成提示 */}
      {progress === 100 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            🎉 恭喜！{review.review_quarter} 的所有审查任务已完成。请确保已将发现的问题记录在备注中。
          </p>
        </div>
      )}
    </div>
  );
}
