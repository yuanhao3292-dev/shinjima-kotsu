'use client';

import React, { useState, useMemo } from 'react';
import { X, FileText, Download, Users, Calendar, Building2, Phone, Mail, Hotel, Plane, Languages, ClipboardCheck } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import {
  TIMC_PACKAGES,
  HOTEL_RATES,
  calculateTIMCQuote,
  formatPrice,
  TIMCQuoteRequest,
  TIMCQuoteResult,
} from '@/services/timcQuoteCalculator';
import TIMCQuotePDF from './TIMCQuotePDF';

interface TIMCQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'form' | 'preview';

export const TIMCQuoteModal: React.FC<TIMCQuoteModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('form');
  const [quoteResult, setQuoteResult] = useState<TIMCQuoteResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    // 旅行社信息
    companyName: '',
    contactName: '',
    contactMethod: '',
    email: '',

    // 客户信息
    guestCount: 2,
    preferredDate: '',
    alternateDate: '',

    // 套餐选择
    packageId: 'vip',

    // 增值服务
    airportTransfer: false,
    airportTransferRoundTrip: true,
    translator: false,
    translatorDays: 1,
    reportTranslation: false,

    // 酒店
    needHotel: false,
    hotelNights: 2,
    hotelRooms: 1,
    hotelStars: 5 as 3 | 4 | 5,
    hotelLocation: 'Osaka',

    // 备注
    notes: '',
  });

  // 实时计算价格预览
  const pricePreview = useMemo(() => {
    const pkg = TIMC_PACKAGES.find(p => p.id === formData.packageId);
    if (!pkg) return null;

    let total = pkg.price * formData.guestCount;

    if (formData.airportTransfer) {
      total += formData.airportTransferRoundTrip ? 70000 : 35000;
    }

    if (formData.translator) {
      total += 25000 * formData.translatorDays;
    }

    if (formData.reportTranslation) {
      total += 15000 * formData.guestCount;
    }

    if (formData.needHotel) {
      const rates = HOTEL_RATES[formData.hotelLocation] || HOTEL_RATES['Osaka'];
      const rate = rates[formData.hotelStars] || rates[5];
      total += rate * formData.hotelRooms * formData.hotelNights;
    }

    // 加上利润
    total = Math.ceil(total * 1.15);

    return {
      total,
      perPerson: Math.ceil(total / formData.guestCount),
    };
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateQuote = async () => {
    // 验证必填字段
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.preferredDate) {
      alert('請填寫所有必填項目');
      return;
    }

    setIsGenerating(true);

    try {
      const request: TIMCQuoteRequest = {
        packageId: formData.packageId,
        guestCount: formData.guestCount,
        addOns: {
          airportTransfer: formData.airportTransfer,
          airportTransferRoundTrip: formData.airportTransferRoundTrip,
          translator: formData.translator,
          translatorDays: formData.translatorDays,
          reportTranslation: formData.reportTranslation,
        },
        hotel: formData.needHotel ? {
          nights: formData.hotelNights,
          rooms: formData.hotelRooms,
          stars: formData.hotelStars,
          location: formData.hotelLocation,
        } : undefined,
        agencyInfo: {
          companyName: formData.companyName,
          contactName: formData.contactName,
          contactMethod: formData.contactMethod,
          email: formData.email,
        },
        preferredDate: formData.preferredDate,
        alternateDate: formData.alternateDate || undefined,
        notes: formData.notes || undefined,
      };

      const result = calculateTIMCQuote(request);
      setQuoteResult(result);
      setStep('preview');
    } catch (error) {
      console.error('計算報價失敗:', error);
      alert('計算報價失敗，請重試');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!quoteResult) return;

    setIsGenerating(true);
    try {
      const blob = await pdf(<TIMCQuotePDF quote={quoteResult} />).toBlob();
      saveAs(blob, `${quoteResult.quoteNumber}.pdf`);
    } catch (error) {
      console.error('生成 PDF 失敗:', error);
      alert('生成 PDF 失敗，請重試');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setQuoteResult(null);
    onClose();
  };

  if (!isOpen) return null;

  const selectedPackage = TIMC_PACKAGES.find(p => p.id === formData.packageId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} />
            <div>
              <h2 className="text-lg font-bold">TIMC 醫療健檢報價單</h2>
              <p className="text-blue-100 text-sm">B2B 打包淨價查詢</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 'form' ? (
            <div className="p-6 space-y-6">
              {/* 旅行社信息 */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Building2 size={18} className="text-blue-600" />
                  旅行社資料
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">公司名稱 *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="XX旅行社"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">聯繫人 *</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="王先生"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Phone size={14} />
                      聯繫方式（電話/微信/LINE）
                    </label>
                    <input
                      type="text"
                      value={formData.contactMethod}
                      onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="+886-912-345-678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Mail size={14} />
                      電子郵箱 *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="contact@travel.com"
                    />
                  </div>
                </div>
              </div>

              {/* 客户信息 */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  客戶資訊
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">客戶人數 *</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.guestCount}
                      onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 1)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar size={14} />
                      首選日期 *
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">備選日期</label>
                    <input
                      type="date"
                      value={formData.alternateDate}
                      onChange={(e) => handleInputChange('alternateDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 套餐选择 */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <ClipboardCheck size={18} className="text-blue-600" />
                  健檢套餐
                </h3>
                <select
                  value={formData.packageId}
                  onChange={(e) => handleInputChange('packageId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                >
                  {TIMC_PACKAGES.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.nameZh}（{formatPrice(pkg.price)}/人）
                    </option>
                  ))}
                </select>
                {selectedPackage && (
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                    已選：<strong>{selectedPackage.name} {selectedPackage.nameZh}</strong>
                    <span className="ml-2">×</span>
                    <span className="ml-1">{formData.guestCount} 人</span>
                    <span className="ml-2">=</span>
                    <span className="ml-1 font-bold">{formatPrice(selectedPackage.price * formData.guestCount)}</span>
                  </div>
                )}
              </div>

              {/* 增值服务 */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">增值服務</h3>
                <div className="space-y-3">
                  {/* 机场接送 */}
                  <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      checked={formData.airportTransfer}
                      onChange={(e) => handleInputChange('airportTransfer', e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Plane size={16} className="text-blue-600" />
                        <span className="font-medium">機場接送服務（Alphard）</span>
                        <span className="text-blue-600 text-sm">¥35,000/趟</span>
                      </div>
                      {formData.airportTransfer && (
                        <div className="mt-2 flex gap-4 text-sm">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              checked={!formData.airportTransferRoundTrip}
                              onChange={() => handleInputChange('airportTransferRoundTrip', false)}
                            />
                            單程
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              checked={formData.airportTransferRoundTrip}
                              onChange={() => handleInputChange('airportTransferRoundTrip', true)}
                            />
                            來回（¥70,000）
                          </label>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* 翻译陪同 */}
                  <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      checked={formData.translator}
                      onChange={(e) => handleInputChange('translator', e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Languages size={16} className="text-blue-600" />
                        <span className="font-medium">全程翻譯陪同</span>
                        <span className="text-blue-600 text-sm">¥25,000/天</span>
                      </div>
                      {formData.translator && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <span>天數：</span>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={formData.translatorDays}
                            onChange={(e) => handleInputChange('translatorDays', parseInt(e.target.value) || 1)}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                          />
                          <span className="text-gray-500">天</span>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* 报告翻译 */}
                  <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      checked={formData.reportTranslation}
                      onChange={(e) => handleInputChange('reportTranslation', e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      <span className="font-medium">報告翻譯加急（5工作日）</span>
                      <span className="text-blue-600 text-sm">¥15,000/份</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 酒店需求 */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.needHotel}
                    onChange={(e) => handleInputChange('needHotel', e.target.checked)}
                  />
                  <Hotel size={18} className="text-blue-600" />
                  <span className="font-bold text-gray-800">需要酒店代訂</span>
                </label>

                {formData.needHotel && (
                  <div className="grid grid-cols-4 gap-4 pl-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">住宿天數</label>
                      <input
                        type="number"
                        min={1}
                        max={14}
                        value={formData.hotelNights}
                        onChange={(e) => handleInputChange('hotelNights', parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">房間數</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.hotelRooms}
                        onChange={(e) => handleInputChange('hotelRooms', parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">星級</label>
                      <select
                        value={formData.hotelStars}
                        onChange={(e) => handleInputChange('hotelStars', parseInt(e.target.value) as 3 | 4 | 5)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value={3}>3星</option>
                        <option value={4}>4星</option>
                        <option value={5}>5星</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">地點</label>
                      <select
                        value={formData.hotelLocation}
                        onChange={(e) => handleInputChange('hotelLocation', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="Osaka">大阪</option>
                        <option value="Kyoto">京都</option>
                        <option value="Tokyo">東京</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">特殊需求備註</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="如有特殊飲食需求、輪椅服務等，請在此說明..."
                />
              </div>

              {/* 价格预览 */}
              {pricePreview && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">預估總價（含服務費）</span>
                    <span className="text-2xl font-bold text-blue-700">{formatPrice(pricePreview.total)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                    <span>人均約</span>
                    <span>{formatPrice(pricePreview.perPerson)}</span>
                  </div>
                </div>
              )}

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleGenerateQuote}
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      計算中...
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      生成報價單
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* 报价预览 */
            <div className="p-6 space-y-6">
              {quoteResult && (
                <>
                  {/* 报价头部 */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">報價單已生成</h3>
                        <p className="text-blue-600 text-sm mt-1">編號：{quoteResult.quoteNumber}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">有效期至</div>
                        <div className="font-medium">{quoteResult.validUntil}</div>
                      </div>
                    </div>
                  </div>

                  {/* 明细 */}
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">{quoteResult.packageName} {quoteResult.packageNameZh} × {quoteResult.guestCount}人</span>
                      <span className="font-medium">{formatPrice(quoteResult.packageTotal)}</span>
                    </div>
                    {quoteResult.airportTransferPrice > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">機場接送服務</span>
                        <span className="font-medium">{formatPrice(quoteResult.airportTransferPrice)}</span>
                      </div>
                    )}
                    {quoteResult.translatorPrice > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">翻譯陪同（{quoteResult.translatorDays}天）</span>
                        <span className="font-medium">{formatPrice(quoteResult.translatorPrice)}</span>
                      </div>
                    )}
                    {quoteResult.reportTranslationPrice > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">報告翻譯加急</span>
                        <span className="font-medium">{formatPrice(quoteResult.reportTranslationPrice)}</span>
                      </div>
                    )}
                    {quoteResult.hotelDetails && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">
                          酒店（{quoteResult.hotelDetails.location} {quoteResult.hotelDetails.stars}星 × {quoteResult.hotelDetails.nights}晚 × {quoteResult.hotelDetails.rooms}間）
                        </span>
                        <span className="font-medium">{formatPrice(quoteResult.hotelPrice)}</span>
                      </div>
                    )}
                  </div>

                  {/* 总计 */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">總計</span>
                      <span className="text-2xl font-bold text-blue-700">{formatPrice(quoteResult.finalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                      <span>人均</span>
                      <span>{formatPrice(quoteResult.pricePerPerson)}</span>
                    </div>
                  </div>

                  {/* 按钮 */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('form')}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      返回修改
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGenerating}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          生成中...
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          下載 PDF 報價單
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TIMCQuoteModal;
