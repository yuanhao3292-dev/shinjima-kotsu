'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import {
  ArrowLeft, CheckCircle, FileText, Shield, Clock,
  Loader2, CreditCard, Users, Phone, Video, MessageSquare
} from 'lucide-react';

const SERVICE_INFO = {
  id: 'cancer-remote-consultation',
  slug: 'cancer-remote-consultation',
  name: '遠程會診服務',
  nameEn: 'Remote Consultation',
  price: 243000,
  description: '與日本醫生遠程視頻會診、討論治療方案、費用概算',
  longDescription: '與日本專科醫生進行遠程視頻會診，由專業醫療翻譯全程陪同。醫生將詳細說明治療方案、預期效果、治療費用明細等，幫助您做出赴日治療的決定。',
  features: [
    '日本專科醫生視頻會診（約30-60分鐘）',
    '專業醫療翻譯全程陪同',
    '詳細治療方案說明',
    '治療費用明細報價',
    '問答環節解答疑問',
    '會診後書面總結報告',
  ],
  prerequisites: [
    '已完成前期諮詢服務',
    '已提交完整病歷資料',
    '日本醫院已完成初步評估',
  ],
  note: '* 如尚未完成前期諮詢，建議先購買前期諮詢服務',
};

export default function RemoteConsultationPage() {
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    line: '',
    wechat: '',
    country: 'TW',
  });
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    age: '',
    gender: '',
    diagnosis: '',
    previousConsultation: '',
    questions: '',
  });
  const [preferredTimes, setPreferredTimes] = useState({
    time1: '',
    time2: '',
    time3: '',
  });
  const [notes, setNotes] = useState('');
  const [contactError, setContactError] = useState('');

  const hasValidContact = () => {
    return customerInfo.phone.trim() !== '' ||
           customerInfo.email.trim() !== '' ||
           customerInfo.line.trim() !== '' ||
           customerInfo.wechat.trim() !== '';
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError('');
    setProcessing(true);

    try {
      if (!customerInfo.name) {
        alert('請填寫聯繫人姓名');
        setProcessing(false);
        return;
      }
      if (!patientInfo.patientName) {
        alert('請填寫患者姓名');
        setProcessing(false);
        return;
      }
      if (!hasValidContact()) {
        setContactError('請至少填寫一種聯繫方式（手機、郵箱、LINE 或微信）');
        setProcessing(false);
        return;
      }

      // 构建联系方式信息
      const contactMethods: string[] = [];
      if (customerInfo.phone) contactMethods.push(`電話: ${customerInfo.phone}`);
      if (customerInfo.email) contactMethods.push(`郵箱: ${customerInfo.email}`);
      if (customerInfo.line) contactMethods.push(`LINE: ${customerInfo.line}`);
      if (customerInfo.wechat) contactMethods.push(`微信: ${customerInfo.wechat}`);

      let fullNotes = `【癌症治療 - 遠程會診服務】\n\n`;
      fullNotes += `【患者信息】\n`;
      fullNotes += `姓名: ${patientInfo.patientName}\n`;
      fullNotes += `年齡: ${patientInfo.age || '未提供'}\n`;
      fullNotes += `性別: ${patientInfo.gender || '未提供'}\n`;
      fullNotes += `診斷: ${patientInfo.diagnosis || '未提供'}\n`;
      fullNotes += `前期諮詢情況: ${patientInfo.previousConsultation || '未提供'}\n\n`;
      fullNotes += `【希望諮詢的問題】\n${patientInfo.questions || '未提供'}\n\n`;
      fullNotes += `【希望會診時間】\n`;
      if (preferredTimes.time1) fullNotes += `首選: ${preferredTimes.time1}\n`;
      if (preferredTimes.time2) fullNotes += `備選1: ${preferredTimes.time2}\n`;
      if (preferredTimes.time3) fullNotes += `備選2: ${preferredTimes.time3}\n`;
      fullNotes += `\n【聯繫方式】\n${contactMethods.join('\n')}\n\n`;
      if (notes) {
        fullNotes += `【補充說明】\n${notes}`;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: SERVICE_INFO.slug,
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email || `${customerInfo.name.replace(/\s/g, '')}@placeholder.niijima.jp`,
            phone: customerInfo.phone,
            line: customerInfo.line,
            wechat: customerInfo.wechat,
            country: customerInfo.country,
          },
          preferredDate: preferredTimes.time1 || null,
          preferredTime: null,
          notes: fullNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '創建支付會話失敗');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else throw new Error('未獲取到支付鏈接');
    } catch (error: any) {
      alert(error.message || '支付流程出現錯誤，請稍後重試');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <PublicLayout showFooter={true} transparentNav={false}>
      {/* Header */}
      <div className="pt-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/cancer-treatment"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition"
          >
            <ArrowLeft size={16} />
            返回日本綜合治療
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video size={20} className="text-purple-200" />
                <span className="text-purple-200 text-sm">視頻會診</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-white">{SERVICE_INFO.name}</h1>
              <p className="text-purple-200 text-sm mt-1">{SERVICE_INFO.nameEn}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">¥{SERVICE_INFO.price.toLocaleString()}</p>
              <p className="text-xs text-purple-200 mt-1">日円（税込）</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Service Info */}
          <div className="lg:col-span-1">
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 sticky top-8">
              <h3 className="text-lg font-bold text-purple-900 mb-3">服務包含</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{SERVICE_INFO.longDescription}</p>
              <div className="space-y-2.5 text-sm text-gray-700">
                {SERVICE_INFO.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-purple-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-purple-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-purple-600" />
                  前提條件
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {SERVICE_INFO.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-orange-600 mt-4">{SERVICE_INFO.note}</p>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">預約信息</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Patient Info */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-purple-600" />
                    患者信息
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">患者姓名 *</label>
                      <input
                        type="text"
                        required
                        value={patientInfo.patientName}
                        onChange={(e) => setPatientInfo({ ...patientInfo, patientName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="請輸入患者姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">年齡</label>
                      <input
                        type="text"
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例如：65歲"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                      <select
                        value={patientInfo.gender}
                        onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">請選擇</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">診斷</label>
                      <input
                        type="text"
                        value={patientInfo.diagnosis}
                        onChange={(e) => setPatientInfo({ ...patientInfo, diagnosis: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例如：肺癌III期"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">前期諮詢情況</label>
                      <textarea
                        value={patientInfo.previousConsultation}
                        onChange={(e) => setPatientInfo({ ...patientInfo, previousConsultation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={2}
                        placeholder="請說明是否已完成前期諮詢、諮詢的醫院等"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">希望諮詢的問題</label>
                      <textarea
                        value={patientInfo.questions}
                        onChange={(e) => setPatientInfo({ ...patientInfo, questions: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="請列出您希望在會診中詢問醫生的問題"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Times */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-purple-600" />
                    希望會診時間
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    請提供 1-3 個您方便的時間段（日本時間 JST），我們將根據醫生排班確認
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">首選時間</label>
                      <input
                        type="text"
                        value={preferredTimes.time1}
                        onChange={(e) => setPreferredTimes({ ...preferredTimes, time1: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例如：1月20日 14:00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">備選時間 1</label>
                      <input
                        type="text"
                        value={preferredTimes.time2}
                        onChange={(e) => setPreferredTimes({ ...preferredTimes, time2: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例如：1月21日 10:00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">備選時間 2</label>
                      <input
                        type="text"
                        value={preferredTimes.time3}
                        onChange={(e) => setPreferredTimes({ ...preferredTimes, time3: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例如：1月22日 15:00"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone size={18} className="text-purple-600" />
                    聯繫人信息
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">聯繫人姓名 *</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="請輸入聯繫人姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">所在地區</label>
                      <select
                        value={customerInfo.country}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="TW">台灣</option>
                        <option value="CN">中國大陸</option>
                        <option value="HK">香港</option>
                        <option value="SG">新加坡</option>
                        <option value="MY">馬來西亞</option>
                        <option value="OTHER">其他</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">手機號碼</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+886 912345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">電子郵箱</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LINE ID</label>
                      <input
                        type="text"
                        value={customerInfo.line}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, line: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="您的 LINE ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">微信 WeChat</label>
                      <input
                        type="text"
                        value={customerInfo.wechat}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, wechat: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="您的微信號"
                      />
                    </div>
                  </div>
                  {contactError && (
                    <p className="mt-2 text-sm text-red-500">{contactError}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">* 至少填寫一種聯繫方式</p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">補充說明</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="如有其他需要說明的情況，請在此填寫"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">服務費用</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">¥{SERVICE_INFO.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 ml-1">日円</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    支付完成後，我們將在 24 小時內與您聯繫，確認會診時間
                  </p>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        處理中...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        確認並支付
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-green-500" />
                    <span>安全支付</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-purple-500" />
                    <span>24小時內確認時間</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
