'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, Image } from 'lucide-react';
import type { Language } from '@/hooks/useLanguage';

const translations = {
  title: {
    ja: '診断書・検査報告書をアップロード',
    'zh-CN': '上传诊断书/检查报告',
    'zh-TW': '上傳診斷書/檢查報告',
    en: 'Upload Medical Document',
  },
  subtitle: {
    ja: 'AI が文書から医療情報を自動的に抽出し、分析に使用します',
    'zh-CN': 'AI 将自动提取文档中的医疗信息用于分析',
    'zh-TW': 'AI 將自動提取文檔中的醫療資訊用於分析',
    en: 'AI will automatically extract medical information for analysis',
  },
  dragDrop: {
    ja: 'ファイルをドラッグ＆ドロップ、または',
    'zh-CN': '拖拽文件到此处，或',
    'zh-TW': '拖曳檔案到此處，或',
    en: 'Drag & drop file here, or',
  },
  browse: {
    ja: 'ファイルを選択',
    'zh-CN': '选择文件',
    'zh-TW': '選擇檔案',
    en: 'Browse files',
  },
  formats: {
    ja: 'PDF, JPG, PNG 対応 (最大 10MB)',
    'zh-CN': '支持 PDF、JPG、PNG（最大 10MB）',
    'zh-TW': '支援 PDF、JPG、PNG（最大 10MB）',
    en: 'PDF, JPG, PNG supported (max 10MB)',
  },
  uploading: {
    ja: 'アップロード＆テキスト抽出中...',
    'zh-CN': '上传并提取文本中...',
    'zh-TW': '上傳並提取文字中...',
    en: 'Uploading & extracting text...',
  },
  success: {
    ja: 'アップロード完了・テキスト抽出成功',
    'zh-CN': '上传完成，文本提取成功',
    'zh-TW': '上傳完成，文字提取成功',
    en: 'Upload complete, text extracted successfully',
  },
  extractedPreview: {
    ja: '抽出内容プレビュー：',
    'zh-CN': '提取内容预览：',
    'zh-TW': '提取內容預覽：',
    en: 'Extracted content preview:',
  },
  remove: {
    ja: '削除して再アップロード',
    'zh-CN': '删除并重新上传',
    'zh-TW': '刪除並重新上傳',
    en: 'Remove and re-upload',
  },
  errorFormat: {
    ja: 'ファイル形式が対応していません。PDF, JPG, PNG のみ対応です',
    'zh-CN': '文件格式不支持，仅支持 PDF、JPG、PNG',
    'zh-TW': '檔案格式不支援，僅支援 PDF、JPG、PNG',
    en: 'Unsupported file format. Only PDF, JPG, PNG are supported',
  },
  errorSize: {
    ja: 'ファイルサイズが 10MB を超えています',
    'zh-CN': '文件大小超过 10MB',
    'zh-TW': '檔案大小超過 10MB',
    en: 'File size exceeds 10MB',
  },
  method: {
    ja: '抽出方式：',
    'zh-CN': '提取方式：',
    'zh-TW': '提取方式：',
    en: 'Method:',
  },
  methodPdf: {
    ja: 'PDF テキスト直接抽出',
    'zh-CN': 'PDF 文本直接提取',
    'zh-TW': 'PDF 文字直接提取',
    en: 'PDF text extraction',
  },
  methodVision: {
    ja: 'AI 画像認識 (OCR)',
    'zh-CN': 'AI 图像识别 (OCR)',
    'zh-TW': 'AI 圖像辨識 (OCR)',
    en: 'AI image recognition (OCR)',
  },
} as const;

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024;

interface DocumentUploadProps {
  screeningId: string;
  sessionId?: string;
  isWhitelabel?: boolean;
  language: Language;
  onUploadSuccess?: (data: UploadResult) => void;
  onRemove?: () => void;
}

export interface UploadResult {
  documentUrl: string;
  extractedText: string;
  extractionMethod: 'pdf-parse' | 'gpt4o-vision';
  confidence: 'high' | 'medium' | 'low';
  fileName: string;
}

export default function DocumentUpload({
  screeningId,
  sessionId,
  isWhitelabel = false,
  language,
  onUploadSuccess,
  onRemove,
}: DocumentUploadProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useCallback(
    (key: keyof typeof translations) => translations[key][language] || translations[key]['zh-CN'],
    [language]
  );

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return t('errorFormat');
      }
      if (file.size > MAX_SIZE) {
        return t('errorSize');
      }
      return null;
    },
    [t]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }

      setStatus('uploading');
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('screeningId', screeningId);
      if (isWhitelabel && sessionId) {
        formData.append('sessionId', sessionId);
      }

      const endpoint = isWhitelabel
        ? '/api/whitelabel/screening/upload-document'
        : '/api/health-screening/upload-document';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || '上传失败');
          setStatus('error');
          return;
        }

        const uploadResult: UploadResult = {
          documentUrl: data.documentUrl,
          extractedText: data.extractedText,
          extractionMethod: data.extractionMethod,
          confidence: data.confidence,
          fileName: data.fileName,
        };

        setResult(uploadResult);
        setStatus('success');
        onUploadSuccess?.(uploadResult);
      } catch {
        setError('网络错误，请稍后重试');
        setStatus('error');
      }
    },
    [screeningId, sessionId, isWhitelabel, validateFile, onUploadSuccess]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleRemove = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  }, [onRemove]);

  // 成功状态
  if (status === 'success' && result) {
    const previewText =
      result.extractedText.length > 200
        ? result.extractedText.substring(0, 200) + '...'
        : result.extractedText;

    return (
      <div className="rounded-xl border-2 border-medical-400/30 bg-medical-50/50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-medical-600" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-medical-700">{t('success')}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
              <FileText className="h-4 w-4" />
              <span className="truncate">{result.fileName}</span>
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {t('method')}
              {result.extractionMethod === 'pdf-parse' ? t('methodPdf') : t('methodVision')}
            </div>
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium text-neutral-500">{t('extractedPreview')}</p>
              <div className="max-h-32 overflow-y-auto rounded-lg bg-white/80 p-3 text-xs leading-relaxed text-neutral-600">
                {previewText}
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="mt-3 flex items-center gap-1 text-sm text-red-500 transition-colors hover:text-red-700"
            >
              <X className="h-3.5 w-3.5" />
              {t('remove')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 上传中
  if (status === 'uploading') {
    return (
      <div className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/30 p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          <p className="text-sm font-medium text-brand-600">{t('uploading')}</p>
        </div>
      </div>
    );
  }

  // 默认状态（包括错误后重试）
  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragOver
            ? 'border-medical-400 bg-medical-50/50'
            : 'border-neutral-300 bg-neutral-50/50 hover:border-brand-400 hover:bg-brand-50/30'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <Upload className="h-8 w-8 text-neutral-400" />
            <FileText className="h-6 w-6 text-neutral-300" />
            <Image className="h-6 w-6 text-neutral-300" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">
              {t('dragDrop')}
              <span className="font-medium text-brand-600">{t('browse')}</span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">{t('formats')}</p>
          </div>
        </div>
      </div>

      {status === 'error' && error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
