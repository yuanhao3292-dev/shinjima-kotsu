'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerContractForm from '@/components/contract/CustomerContractForm';
import SignatureCanvas from '@/components/contract/SignatureCanvas';
import { FileText, CheckCircle, AlertCircle, Loader2, Calendar, MapPin, DollarSign } from 'lucide-react';

interface CustomerContractSigningPageProps {
  contract: any;
}

export default function CustomerContractSigningPage({ contract }: CustomerContractSigningPageProps) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 信息填写, 2: 合同预览, 3: 签名
  const [customerData, setCustomerData] = useState<any>({
    customerName: contract.customer_name || '',
    passportNumber: contract.passport_number || '',
    nationality: contract.nationality || '中国',
    phone: contract.phone || '',
    email: contract.email || '',
    emergencyContact: contract.emergency_contact || '',
    emergencyPhone: contract.emergency_phone || '',
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStepValid = () => {
    if (step === 1) {
      // 验证所有必填字段
      return (
        customerData.customerName &&
        customerData.passportNumber &&
        customerData.nationality &&
        customerData.phone &&
        customerData.email &&
        customerData.emergencyContact &&
        customerData.emergencyPhone
      );
    }
    if (step === 2) {
      return agreedToTerms;
    }
    if (step === 3) {
      return signature !== null;
    }
    return false;
  };

  const handleNextStep = () => {
    if (isStepValid()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!signature || !agreedToTerms) {
      setError('请完成签名并同意服务条款');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contract/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractId: contract.id,
          customerData,
          signature,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '提交失败');
      }

      // 提交成功，刷新页面显示成功状态
      router.refresh();
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 顶部进度条 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="font-medium hidden sm:inline">填写信息</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className="font-medium hidden sm:inline">确认合同</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div className={`h-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-medium hidden sm:inline">在线签名</span>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* 步骤1：填写信息 */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FileText size={28} className="text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">医疗旅行服务合同</h1>
                  <p className="text-sm text-gray-600">合同编号: {contract.contract_number}</p>
                </div>
              </div>

              <CustomerContractForm
                initialData={customerData}
                onDataChange={setCustomerData}
              />

              <button
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className="mt-8 w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                下一步：查看合同详情
              </button>
            </div>
          )}

          {/* 步骤2：合同预览 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">合同详情</h2>

              {/* 服务信息 */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  服务内容
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">医疗机构</span>
                    <span className="font-medium text-gray-900">{contract.medical_institution_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">预约项目</span>
                    <span className="font-medium text-gray-900">{contract.appointment_project}</span>
                  </div>
                  {contract.appointment_datetime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">预约时间</span>
                      <span className="font-medium text-gray-900">
                        {new Date(contract.appointment_datetime).toLocaleString('zh-CN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 费用信息 */}
              <div className="bg-emerald-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-emerald-600" />
                  费用明细
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">旅行服务费</span>
                    <span className="font-medium text-gray-900">¥{contract.service_fee_jpy?.toLocaleString()} 日元</span>
                  </div>
                  {contract.medical_fee_estimate_jpy && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">医疗费预估</span>
                      <span className="font-medium text-gray-900">¥{contract.medical_fee_estimate_jpy?.toLocaleString()} 日元</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-emerald-200">
                    <p className="text-xs text-gray-600">
                      💡 医疗费用需直接支付给医疗机构，不包含在服务费中
                    </p>
                  </div>
                </div>
              </div>

              {/* 行程信息 */}
              {contract.arrival_date && contract.departure_date && (
                <div className="bg-amber-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-amber-600" />
                    行程安排
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">抵达日期</span>
                      <span className="font-medium text-gray-900">
                        {new Date(contract.arrival_date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">离开日期</span>
                      <span className="font-medium text-gray-900">
                        {new Date(contract.departure_date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 服务条款 */}
              <div className="border-2 border-gray-200 rounded-lg p-6 mb-6 max-h-64 overflow-y-auto">
                <h3 className="font-bold text-gray-900 mb-3">服务条款</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>1. 服务范围：</strong>新岛交通株式会社提供医疗预约安排、中文翻译、全程陪同等旅行服务。</p>
                  <p><strong>2. 医疗费用：</strong>医疗服务由医疗机构直接提供，医疗费用需您直接支付给医疗机构。</p>
                  <p><strong>3. 风险告知：</strong>医疗服务存在固有风险，请仔细阅读医疗机构提供的风险告知书。</p>
                  <p><strong>4. 取消政策：</strong>出发前30天取消可退款50%，出发前15天取消不予退款。</p>
                  <p><strong>5. 隐私保护：</strong>您的个人信息将严格保密，仅用于提供本次服务。</p>
                </div>
              </div>

              {/* 同意条款 */}
              <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-6">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  我已仔细阅读并完全理解上述服务条款，自愿签署本合同。我确认所填写的个人信息真实准确，并同意新岛交通株式会社使用这些信息为我提供医疗旅行服务。
                </span>
              </label>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!isStepValid()}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  下一步：在线签名
                </button>
              </div>
            </div>
          )}

          {/* 步骤3：在线签名 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">在线签名</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">签名须知</p>
                    <ul className="space-y-1 text-xs">
                      <li>• 请使用手指或鼠标在下方白色区域内签署您的真实姓名</li>
                      <li>• 签名将作为合同的法律效力证明</li>
                      <li>• 签名后合同将自动生成并发送到您的邮箱</li>
                    </ul>
                  </div>
                </div>
              </div>

              <SignatureCanvas
                onSignatureChange={setSignature}
                className="mb-6"
              />

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      确认签署合同
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>新岛交通株式会社 | 大阪府知事登録旅行業 第2-3115号</p>
          <p className="text-xs mt-1">如有疑问，请联系客服：info@niijima-kotsu.jp</p>
        </div>
      </div>
    </div>
  );
}
