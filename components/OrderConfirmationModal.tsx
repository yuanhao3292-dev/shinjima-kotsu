'use client';

import { Loader2, ShieldCheck, X } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const modalT = {
  title: {
    ja: '注文内容の確認',
    'zh-TW': '訂單確認',
    'zh-CN': '订单确认',
    en: 'Order Confirmation',
  },
  packageLabel: {
    ja: 'サービス',
    'zh-TW': '服務',
    'zh-CN': '服务',
    en: 'Service',
  },
  priceLabel: {
    ja: '金額（税込）',
    'zh-TW': '金額（含稅）',
    'zh-CN': '金额（含税）',
    en: 'Amount (tax incl.)',
  },
  customerLabel: {
    ja: 'お客様名',
    'zh-TW': '客戶姓名',
    'zh-CN': '客户姓名',
    en: 'Customer Name',
  },
  cancelPolicy: {
    ja: 'キャンセルポリシーに同意の上ご注文ください',
    'zh-TW': '請在同意取消政策後下單',
    'zh-CN': '请在同意取消政策后下单',
    en: 'Please review the cancellation policy before ordering',
  },
  legalLinks: {
    ja: '利用規約・特定商取引法に基づく表記',
    'zh-TW': '使用條款・特定商交易法標示',
    'zh-CN': '使用条款・特定商交易法标示',
    en: 'Terms of Service & Commercial Transaction Act',
  },
  confirm: {
    ja: '注文を確定する',
    'zh-TW': '確認訂單',
    'zh-CN': '确认订单',
    en: 'Confirm Order',
  },
  cancel: {
    ja: '戻る',
    'zh-TW': '返回',
    'zh-CN': '返回',
    en: 'Go Back',
  },
} as const;

export interface OrderConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  packageName: string;
  price: number;
  customerName: string;
  lang: Language;
  isProcessing: boolean;
}

export default function OrderConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  packageName,
  price,
  customerName,
  lang,
  isProcessing,
}: OrderConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-lg shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-600" />
            {modalT.title[lang]}
          </h3>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-neutral-400 hover:text-neutral-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-neutral-500">{modalT.packageLabel[lang]}</span>
              <span className="text-sm font-medium text-neutral-900 text-right max-w-[60%]">{packageName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">{modalT.priceLabel[lang]}</span>
              <span className="text-lg font-bold text-brand-900">¥{price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">{modalT.customerLabel[lang]}</span>
              <span className="text-sm font-medium text-neutral-900">{customerName}</span>
            </div>
          </div>

          {/* Legal notice */}
          <div className="text-xs text-neutral-500 space-y-1">
            <p>{modalT.cancelPolicy[lang]}</p>
            <a
              href="/legal/tokushoho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              {modalT.legalLinks[lang]} →
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                ...
              </>
            ) : (
              modalT.confirm[lang]
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full text-neutral-500 hover:text-neutral-700 font-medium py-2 transition text-sm"
          >
            {modalT.cancel[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}
