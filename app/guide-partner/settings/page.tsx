'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  Settings,
  User,
  Phone,
  Mail,
  MessageCircle,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
  Upload,
  FileCheck,
  Clock,
  XCircle
} from 'lucide-react';

// ============================================================
// Translations
// ============================================================

const translations = {
  // Page title & header
  pageTitle: {
    ja: 'アカウント設定',
    'zh-CN': '账户设置',
    'zh-TW': '帳戶設置',
    en: 'Account Settings',
  },
  pageSubtitle: {
    ja: '個人情報とセキュリティ設定を管理',
    'zh-CN': '管理您的个人信息和安全设置',
    'zh-TW': '管理您的個人資訊和安全設置',
    en: 'Manage your personal information and security settings',
  },

  // Loading
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },

  // Account info section
  referralCode: {
    ja: '紹介コード:',
    'zh-CN': '推荐码:',
    'zh-TW': '推薦碼:',
    en: 'Referral code:',
  },

  // Level labels
  levelGrowth: {
    ja: '初期パートナー',
    'zh-CN': '初期合伙人',
    'zh-TW': '初期合夥人',
    en: 'Growth Partner',
  },
  levelGold: {
    ja: 'ゴールドパートナー',
    'zh-CN': '金牌合伙人',
    'zh-TW': '金牌合夥人',
    en: 'Gold Partner',
  },

  // Tabs
  tabProfile: {
    ja: '個人情報',
    'zh-CN': '个人信息',
    'zh-TW': '個人資訊',
    en: 'Profile',
  },
  tabPassword: {
    ja: 'パスワード変更',
    'zh-CN': '修改密码',
    'zh-TW': '修改密碼',
    en: 'Change Password',
  },
  tabKyc: {
    ja: '本人確認',
    'zh-CN': '身份验证',
    'zh-TW': '身份驗證',
    en: 'Identity Verification',
  },

  // Profile form labels
  labelName: {
    ja: '氏名',
    'zh-CN': '姓名',
    'zh-TW': '姓名',
    en: 'Name',
  },
  labelPhone: {
    ja: '電話番号',
    'zh-CN': '手机号',
    'zh-TW': '手機號',
    en: 'Phone Number',
  },
  labelEmail: {
    ja: 'メールアドレス',
    'zh-CN': '邮箱',
    'zh-TW': '郵箱',
    en: 'Email',
  },
  emailNotEditable: {
    ja: 'メールアドレスは変更できません',
    'zh-CN': '邮箱不可修改',
    'zh-TW': '郵箱不可修改',
    en: 'Email cannot be changed',
  },
  labelWechat: {
    ja: 'WeChat ID',
    'zh-CN': '微信号',
    'zh-TW': '微信號',
    en: 'WeChat ID',
  },
  wechatPlaceholder: {
    ja: '任意',
    'zh-CN': '选填',
    'zh-TW': '選填',
    en: 'Optional',
  },
  saveChanges: {
    ja: '変更を保存',
    'zh-CN': '保存修改',
    'zh-TW': '儲存修改',
    en: 'Save Changes',
  },

  // Profile messages
  profileUpdated: {
    ja: '個人情報が更新されました',
    'zh-CN': '个人信息已更新',
    'zh-TW': '個人資訊已更新',
    en: 'Profile updated successfully',
  },
  profileUpdateFailed: {
    ja: '更新に失敗しました。後ほどお試しください',
    'zh-CN': '更新失败，请稍后重试',
    'zh-TW': '更新失敗，請稍後重試',
    en: 'Update failed. Please try again later',
  },

  // Password form labels
  labelNewPassword: {
    ja: '新しいパスワード',
    'zh-CN': '新密码',
    'zh-TW': '新密碼',
    en: 'New Password',
  },
  passwordPlaceholder: {
    ja: '6文字以上',
    'zh-CN': '至少6位',
    'zh-TW': '至少6位',
    en: 'At least 6 characters',
  },
  labelConfirmPassword: {
    ja: '新しいパスワード（確認）',
    'zh-CN': '确认新密码',
    'zh-TW': '確認新密碼',
    en: 'Confirm New Password',
  },
  confirmPasswordPlaceholder: {
    ja: '新しいパスワードを再入力',
    'zh-CN': '再次输入新密码',
    'zh-TW': '再次輸入新密碼',
    en: 'Re-enter new password',
  },
  updatePassword: {
    ja: 'パスワードを更新',
    'zh-CN': '更新密码',
    'zh-TW': '更新密碼',
    en: 'Update Password',
  },

  // Password messages
  passwordMismatch: {
    ja: '新しいパスワードが一致しません',
    'zh-CN': '两次输入的新密码不一致',
    'zh-TW': '兩次輸入的新密碼不一致',
    en: 'New passwords do not match',
  },
  passwordTooShort: {
    ja: '新しいパスワードは6文字以上必要です',
    'zh-CN': '新密码至少需要6位',
    'zh-TW': '新密碼至少需要6位',
    en: 'New password must be at least 6 characters',
  },
  passwordUpdated: {
    ja: 'パスワードが更新されました',
    'zh-CN': '密码已更新',
    'zh-TW': '密碼已更新',
    en: 'Password updated successfully',
  },
  passwordUpdateFailed: {
    ja: 'パスワードの更新に失敗しました',
    'zh-CN': '密码更新失败',
    'zh-TW': '密碼更新失敗',
    en: 'Password update failed',
  },

  // Image upload messages
  uploadImageOnly: {
    ja: '画像ファイルをアップロードしてください',
    'zh-CN': '请上传图片文件',
    'zh-TW': '請上傳圖片文件',
    en: 'Please upload an image file',
  },
  imageTooLarge: {
    ja: '画像サイズは5MB以下にしてください',
    'zh-CN': '图片大小不能超过 5MB',
    'zh-TW': '圖片大小不能超過 5MB',
    en: 'Image size must not exceed 5MB',
  },

  // KYC validation messages
  selectDocType: {
    ja: '証明書の種類を選択してください',
    'zh-CN': '请选择证件类型',
    'zh-TW': '請選擇證件類型',
    en: 'Please select a document type',
  },
  enterDocNumber: {
    ja: '証明書番号を入力してください',
    'zh-CN': '请输入证件号码',
    'zh-TW': '請輸入證件號碼',
    en: 'Please enter the document number',
  },
  enterLegalName: {
    ja: '証明書の氏名を入力してください',
    'zh-CN': '请输入证件姓名',
    'zh-TW': '請輸入證件姓名',
    en: 'Please enter the name on the document',
  },
  selectNationality: {
    ja: '国籍を選択してください',
    'zh-CN': '请选择国籍',
    'zh-TW': '請選擇國籍',
    en: 'Please select your nationality',
  },
  uploadFrontPhoto: {
    ja: '証明書の表面写真をアップロードしてください',
    'zh-CN': '请上传证件正面照片',
    'zh-TW': '請上傳證件正面照片',
    en: 'Please upload the front photo of your document',
  },

  // KYC upload errors
  frontUploadFailed: {
    ja: '表面写真のアップロードに失敗しました',
    'zh-CN': '正面照片上传失败',
    'zh-TW': '正面照片上傳失敗',
    en: 'Front photo upload failed',
  },
  backUploadFailed: {
    ja: '裏面写真のアップロードに失敗しました',
    'zh-CN': '背面照片上传失败',
    'zh-TW': '背面照片上傳失敗',
    en: 'Back photo upload failed',
  },
  pleaseRelogin: {
    ja: '再度ログインしてください',
    'zh-CN': '请重新登录',
    'zh-TW': '請重新登錄',
    en: 'Please log in again',
  },
  kycSubmitFailed: {
    ja: 'KYC の提出に失敗しました',
    'zh-CN': 'KYC 提交失败',
    'zh-TW': 'KYC 提交失敗',
    en: 'KYC submission failed',
  },

  // KYC status banners
  kycApprovedTitle: {
    ja: '本人確認が完了しました',
    'zh-CN': '身份验证已通过',
    'zh-TW': '身份驗證已通過',
    en: 'Identity verification approved',
  },
  kycApprovedTime: {
    ja: '審査通過日:',
    'zh-CN': '审核通过时间:',
    'zh-TW': '審核通過時間:',
    en: 'Approved on:',
  },
  kycSubmittedTitle: {
    ja: '審査中',
    'zh-CN': '审核中',
    'zh-TW': '審核中',
    en: 'Under Review',
  },
  kycSubmittedTime: {
    ja: '提出日:',
    'zh-CN': '提交时间:',
    'zh-TW': '提交時間:',
    en: 'Submitted on:',
  },
  kycReviewPeriod: {
    ja: '1〜3営業日以内に審査いたします',
    'zh-CN': '我们会在 1-3 个工作日内完成审核',
    'zh-TW': '我們會在 1-3 個工作日內完成審核',
    en: 'We will complete the review within 1-3 business days',
  },
  kycRejectedTitle: {
    ja: '認証が否認されました',
    'zh-CN': '验证未通过',
    'zh-TW': '驗證未通過',
    en: 'Verification rejected',
  },
  kycRejectedReason: {
    ja: '理由:',
    'zh-CN': '原因:',
    'zh-TW': '原因:',
    en: 'Reason:',
  },
  kycRejectedDefault: {
    ja: '有効な証明書を再提出してください',
    'zh-CN': '请重新提交有效证件',
    'zh-TW': '請重新提交有效證件',
    en: 'Please resubmit a valid document',
  },
  kycPendingTitle: {
    ja: '本人確認を完了してください',
    'zh-CN': '请完成身份验证',
    'zh-TW': '請完成身份驗證',
    en: 'Please complete identity verification',
  },
  kycPendingDesc: {
    ja: 'KYC 認証完了後、コミッションの受け取りが可能になります',
    'zh-CN': '完成 KYC 验证后即可开始获得佣金',
    'zh-TW': '完成 KYC 驗證後即可開始獲得佣金',
    en: 'Complete KYC verification to start earning commissions',
  },

  // KYC form labels
  labelDocType: {
    ja: '証明書の種類 *',
    'zh-CN': '证件类型 *',
    'zh-TW': '證件類型 *',
    en: 'Document Type *',
  },
  selectDocTypePlaceholder: {
    ja: '証明書の種類を選択',
    'zh-CN': '请选择证件类型',
    'zh-TW': '請選擇證件類型',
    en: 'Select document type',
  },
  labelLegalName: {
    ja: '証明書記載の氏名 *',
    'zh-CN': '证件姓名 *',
    'zh-TW': '證件姓名 *',
    en: 'Legal Name *',
  },
  legalNamePlaceholder: {
    ja: '証明書と同じ氏名を入力してください',
    'zh-CN': '请输入与证件一致的姓名',
    'zh-TW': '請輸入與證件一致的姓名',
    en: 'Enter name as shown on document',
  },
  labelDocNumber: {
    ja: '証明書番号 *',
    'zh-CN': '证件号码 *',
    'zh-TW': '證件號碼 *',
    en: 'Document Number *',
  },
  docNumberPlaceholder: {
    ja: '証明書番号を入力してください',
    'zh-CN': '请输入证件号码',
    'zh-TW': '請輸入證件號碼',
    en: 'Enter document number',
  },
  labelNationality: {
    ja: '国籍 *',
    'zh-CN': '国籍 *',
    'zh-TW': '國籍 *',
    en: 'Nationality *',
  },
  selectNationalityPlaceholder: {
    ja: '国籍を選択',
    'zh-CN': '请选择国籍',
    'zh-TW': '請選擇國籍',
    en: 'Select nationality',
  },

  // Document front/back
  labelDocFront: {
    ja: '証明書の表面 *',
    'zh-CN': '证件正面 *',
    'zh-TW': '證件正面 *',
    en: 'Document Front *',
  },
  altDocFront: {
    ja: '証明書の表面',
    'zh-CN': '证件正面',
    'zh-TW': '證件正面',
    en: 'Document front',
  },
  uploadFrontText: {
    ja: 'クリックして表面写真をアップロード',
    'zh-CN': '点击上传正面照片',
    'zh-TW': '點擊上傳正面照片',
    en: 'Click to upload front photo',
  },
  uploadFormatFront: {
    ja: 'JPG, PNG 対応（最大 5MB）',
    'zh-CN': '支持 JPG, PNG (最大 5MB)',
    'zh-TW': '支持 JPG, PNG (最大 5MB)',
    en: 'Supports JPG, PNG (max 5MB)',
  },
  labelDocBack: {
    ja: '証明書の裏面（任意）',
    'zh-CN': '证件背面（选填）',
    'zh-TW': '證件背面（選填）',
    en: 'Document Back (Optional)',
  },
  altDocBack: {
    ja: '証明書の裏面',
    'zh-CN': '证件背面',
    'zh-TW': '證件背面',
    en: 'Document back',
  },
  uploadBackText: {
    ja: 'クリックして裏面写真をアップロード',
    'zh-CN': '点击上传背面照片',
    'zh-TW': '點擊上傳背面照片',
    en: 'Click to upload back photo',
  },
  uploadFormatBack: {
    ja: 'パスポートの場合、裏面は不要です',
    'zh-CN': '护照可不上传背面',
    'zh-TW': '護照可不上傳背面',
    en: 'Back photo not required for passports',
  },

  // KYC submit button
  uploading: {
    ja: 'アップロード中...',
    'zh-CN': '上传中...',
    'zh-TW': '上傳中...',
    en: 'Uploading...',
  },
  resubmitKyc: {
    ja: '再提出する',
    'zh-CN': '重新提交验证',
    'zh-TW': '重新提交驗證',
    en: 'Resubmit Verification',
  },
  submitKyc: {
    ja: '本人確認を提出',
    'zh-CN': '提交身份验证',
    'zh-TW': '提交身份驗證',
    en: 'Submit Identity Verification',
  },
  kycPrivacyNote: {
    ja: 'お客様の証明書情報は安全に暗号化して保存され、本人確認の目的にのみ使用されます',
    'zh-CN': '您的证件信息将被安全加密存储，仅用于身份验证目的',
    'zh-TW': '您的證件信息將被安全加密存儲，僅用於身份驗證目的',
    en: 'Your document information will be securely encrypted and used only for identity verification purposes',
  },

  // KYC success modal
  kycSuccessTitle: {
    ja: '提出完了',
    'zh-CN': '提交成功',
    'zh-TW': '提交成功',
    en: 'Submission Successful',
  },
  kycSuccessDesc: {
    ja: 'KYC 資料の提出が完了しました。1〜3営業日以内に審査いたします。審査結果はメールでお知らせします。',
    'zh-CN': '您的 KYC 资料已成功提交，我们会在 1-3 个工作日内完成审核。审核结果将通过邮件通知您。',
    'zh-TW': '您的 KYC 資料已成功提交，我們會在 1-3 個工作日內完成審核。審核結果將通過郵件通知您。',
    en: 'Your KYC documents have been submitted successfully. We will complete the review within 1-3 business days. You will be notified of the result via email.',
  },
  kycSuccessButton: {
    ja: '了解しました',
    'zh-CN': '我知道了',
    'zh-TW': '我知道了',
    en: 'Got it',
  },

  // Account creation
  accountCreatedOn: {
    ja: 'アカウント作成日:',
    'zh-CN': '账号创建于',
    'zh-TW': '帳號創建於',
    en: 'Account created on',
  },

  // Document types
  docPassport: {
    ja: 'パスポート Passport',
    'zh-CN': '护照 Passport',
    'zh-TW': '護照 Passport',
    en: 'Passport',
  },
  docIdCard: {
    ja: '身分証明書 ID Card',
    'zh-CN': '身份证 ID Card',
    'zh-TW': '身份證 ID Card',
    en: 'ID Card',
  },
  docResidenceCard: {
    ja: '在留カード Residence Card',
    'zh-CN': '在留卡 Residence Card',
    'zh-TW': '在留卡 Residence Card',
    en: 'Residence Card',
  },
  docOther: {
    ja: 'その他 Other',
    'zh-CN': '其他 Other',
    'zh-TW': '其他 Other',
    en: 'Other',
  },

  // Nationalities
  natChina: {
    ja: '中国 China',
    'zh-CN': '中国 China',
    'zh-TW': '中國 China',
    en: 'China',
  },
  natTaiwan: {
    ja: '台湾 Taiwan',
    'zh-CN': '台湾 Taiwan',
    'zh-TW': '台灣 Taiwan',
    en: 'Taiwan',
  },
  natHongKong: {
    ja: '香港 Hong Kong',
    'zh-CN': '香港 Hong Kong',
    'zh-TW': '香港 Hong Kong',
    en: 'Hong Kong',
  },
  natJapan: {
    ja: '日本 Japan',
    'zh-CN': '日本 Japan',
    'zh-TW': '日本 Japan',
    en: 'Japan',
  },
  natKorea: {
    ja: '韓国 Korea',
    'zh-CN': '韩国 Korea',
    'zh-TW': '韓國 Korea',
    en: 'Korea',
  },
  natSingapore: {
    ja: 'シンガポール Singapore',
    'zh-CN': '新加坡 Singapore',
    'zh-TW': '新加坡 Singapore',
    en: 'Singapore',
  },
  natMalaysia: {
    ja: 'マレーシア Malaysia',
    'zh-CN': '马来西亚 Malaysia',
    'zh-TW': '馬來西亞 Malaysia',
    en: 'Malaysia',
  },
  natOther: {
    ja: 'その他 Other',
    'zh-CN': '其他 Other',
    'zh-TW': '其他 Other',
    en: 'Other',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};
const dateLocaleMap: Record<Language, string> = { ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US' };

// ============================================================
// Interfaces
// ============================================================

interface Guide {
  id: string;
  name: string;
  phone: string;
  email: string;
  wechat_id: string | null;
  referral_code: string;
  level: string;
  created_at: string;
  // KYC fields
  kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
  id_document_type: string | null;
  id_document_number: string | null;
  id_document_front_url: string | null;
  id_document_back_url: string | null;
  legal_name: string | null;
  nationality: string | null;
  kyc_submitted_at: string | null;
  kyc_reviewed_at: string | null;
  kyc_review_note: string | null;
}

// ============================================================
// Component
// ============================================================

export default function SettingsPage() {
  const lang = useLanguage();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'kyc'>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    wechatId: '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // KYC form
  const [kycForm, setKycForm] = useState({
    documentType: '',
    documentNumber: '',
    legalName: '',
    nationality: '',
  });
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showKycSuccessModal, setShowKycSuccessModal] = useState(false);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const supabase = createClient();

  // Document type options (language-aware)
  const DOCUMENT_TYPES = [
    { value: 'passport', label: t('docPassport', lang) },
    { value: 'id_card', label: t('docIdCard', lang) },
    { value: 'residence_card', label: t('docResidenceCard', lang) },
    { value: 'other', label: t('docOther', lang) },
  ];

  // Nationality options (language-aware)
  const NATIONALITIES = [
    { value: 'CN', label: t('natChina', lang) },
    { value: 'TW', label: t('natTaiwan', lang) },
    { value: 'HK', label: t('natHongKong', lang) },
    { value: 'JP', label: t('natJapan', lang) },
    { value: 'KR', label: t('natKorea', lang) },
    { value: 'SG', label: t('natSingapore', lang) },
    { value: 'MY', label: t('natMalaysia', lang) },
    { value: 'OTHER', label: t('natOther', lang) },
  ];

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guideData } = await supabase
        .from('guides')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (!guideData || guideData.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      setGuide(guideData);
      setProfileForm({
        name: guideData.name || '',
        phone: guideData.phone || '',
        wechatId: guideData.wechat_id || '',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('guides')
        .update({
          name: profileForm.name,
          phone: profileForm.phone,
          wechat_id: profileForm.wechatId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', guide.id);

      if (error) throw error;

      setMessage({ type: 'success', text: t('profileUpdated', lang) });
      await loadGuideData();
    } catch (err) {
      setMessage({ type: 'error', text: t('profileUpdateFailed', lang) });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordMismatch', lang) });
      setSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('passwordTooShort', lang) });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: t('passwordUpdated', lang) });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setMessage({ type: 'error', text: t('passwordUpdateFailed', lang) });
    } finally {
      setSaving(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: t('uploadImageOnly', lang) });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: t('imageTooLarge', lang) });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'front') {
        setFrontImage(file);
        setFrontPreview(reader.result as string);
      } else {
        setBackImage(file);
        setBackPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File, guideId: string, side: 'front' | 'back'): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${guideId}/${side}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Submit KYC
  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;

    // Validation
    if (!kycForm.documentType) {
      setMessage({ type: 'error', text: t('selectDocType', lang) });
      return;
    }
    if (!kycForm.documentNumber) {
      setMessage({ type: 'error', text: t('enterDocNumber', lang) });
      return;
    }
    if (!kycForm.legalName) {
      setMessage({ type: 'error', text: t('enterLegalName', lang) });
      return;
    }
    if (!kycForm.nationality) {
      setMessage({ type: 'error', text: t('selectNationality', lang) });
      return;
    }
    if (!frontImage && !guide.id_document_front_url) {
      setMessage({ type: 'error', text: t('uploadFrontPhoto', lang) });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      let frontUrl = guide.id_document_front_url;
      let backUrl = guide.id_document_back_url;

      // Upload new images if selected
      if (frontImage) {
        frontUrl = await uploadImage(frontImage, guide.id, 'front');
        if (!frontUrl) {
          throw new Error(t('frontUploadFailed', lang));
        }
      }

      if (backImage) {
        backUrl = await uploadImage(backImage, guide.id, 'back');
        if (!backUrl) {
          throw new Error(t('backUploadFailed', lang));
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error(t('pleaseRelogin', lang));
      }

      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          guideId: guide.id,
          documentType: kycForm.documentType,
          documentNumber: kycForm.documentNumber,
          legalName: kycForm.legalName,
          nationality: kycForm.nationality,
          frontUrl,
          backUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || t('kycSubmitFailed', lang));
      }

      await loadGuideData();
      setShowKycSuccessModal(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || t('kycSubmitFailed', lang) });
    } finally {
      setUploading(false);
    }
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      growth: t('levelGrowth', lang),
      gold: t('levelGold', lang),
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('pageTitle', lang)}</h1>
            <p className="text-gray-500 mt-1">{t('pageSubtitle', lang)}</p>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-600">
                  {guide?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{guide?.name}</h2>
                <p className="text-gray-500">{guide?.email}</p>
                <p className="text-sm text-brand-600 font-medium mt-1">
                  {getLevelLabel(guide?.level || 'bronze')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-500">
              <span>{t('referralCode', lang)}</span>
              <span className="font-mono font-bold text-gray-900">{guide?.referral_code}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setActiveTab('profile'); setMessage(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              <User className="inline mr-2" size={16} />
              {t('tabProfile', lang)}
            </button>
            <button
              onClick={() => { setActiveTab('password'); setMessage(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'password'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              <Lock className="inline mr-2" size={16} />
              {t('tabPassword', lang)}
            </button>
            <button
              onClick={() => { setActiveTab('kyc'); setMessage(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'kyc'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              <Shield className="inline mr-2" size={16} />
              {t('tabKyc', lang)}
              {guide?.kyc_status === 'approved' && (
                <CheckCircle2 className="inline ml-1 text-green-500" size={14} />
              )}
              {guide?.kyc_status === 'submitted' && (
                <Clock className="inline ml-1 text-yellow-500" size={14} />
              )}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-2 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Profile Form */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline mr-1" size={16} />
                    {t('labelName', lang)}
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline mr-1" size={16} />
                    {t('labelPhone', lang)}
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-1" size={16} />
                    {t('labelEmail', lang)}
                  </label>
                  <input
                    type="email"
                    value={guide?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">{t('emailNotEditable', lang)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="inline mr-1" size={16} />
                    {t('labelWechat', lang)}
                  </label>
                  <input
                    type="text"
                    value={profileForm.wechatId}
                    onChange={(e) => setProfileForm({ ...profileForm, wechatId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder={t('wechatPlaceholder', lang)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {t('saveChanges', lang)}
                </button>
              </form>
            </div>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-xl border p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('labelNewPassword', lang)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder={t('passwordPlaceholder', lang)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('labelConfirmPassword', lang)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder={t('confirmPasswordPlaceholder', lang)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                  {t('updatePassword', lang)}
                </button>
              </form>
            </div>
          )}

          {/* KYC Form */}
          {activeTab === 'kyc' && (
            <div className="space-y-6">
              {/* KYC Status Banner */}
              {guide?.kyc_status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <FileCheck className="text-green-600" size={24} />
                  <div>
                    <p className="font-bold text-green-800">{t('kycApprovedTitle', lang)}</p>
                    <p className="text-sm text-green-600">
                      {t('kycApprovedTime', lang)} {guide.kyc_reviewed_at ? new Date(guide.kyc_reviewed_at).toLocaleDateString(dateLocaleMap[lang]) : '-'}
                    </p>
                  </div>
                </div>
              )}

              {guide?.kyc_status === 'submitted' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-bold text-yellow-800">{t('kycSubmittedTitle', lang)}</p>
                    <p className="text-sm text-yellow-600">
                      {t('kycSubmittedTime', lang)} {guide.kyc_submitted_at ? new Date(guide.kyc_submitted_at).toLocaleDateString(dateLocaleMap[lang]) : '-'}
                      <br />{t('kycReviewPeriod', lang)}
                    </p>
                  </div>
                </div>
              )}

              {guide?.kyc_status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <XCircle className="text-red-600" size={24} />
                  <div>
                    <p className="font-bold text-red-800">{t('kycRejectedTitle', lang)}</p>
                    <p className="text-sm text-red-600">
                      {t('kycRejectedReason', lang)} {guide.kyc_review_note || t('kycRejectedDefault', lang)}
                    </p>
                  </div>
                </div>
              )}

              {guide?.kyc_status === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                  <Shield className="text-blue-600" size={24} />
                  <div>
                    <p className="font-bold text-blue-800">{t('kycPendingTitle', lang)}</p>
                    <p className="text-sm text-blue-600">
                      {t('kycPendingDesc', lang)}
                    </p>
                  </div>
                </div>
              )}

              {/* KYC Form - Only show if not approved */}
              {guide?.kyc_status !== 'approved' && (
                <div className="bg-white rounded-xl border p-6">
                  <form onSubmit={handleKycSubmit} className="space-y-5">
                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('labelDocType', lang)}
                      </label>
                      <select
                        value={kycForm.documentType}
                        onChange={(e) => setKycForm({ ...kycForm, documentType: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      >
                        <option value="">{t('selectDocTypePlaceholder', lang)}</option>
                        {DOCUMENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Legal Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('labelLegalName', lang)}
                      </label>
                      <input
                        type="text"
                        value={kycForm.legalName}
                        onChange={(e) => setKycForm({ ...kycForm, legalName: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder={t('legalNamePlaceholder', lang)}
                      />
                    </div>

                    {/* Document Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('labelDocNumber', lang)}
                      </label>
                      <input
                        type="text"
                        value={kycForm.documentNumber}
                        onChange={(e) => setKycForm({ ...kycForm, documentNumber: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder={t('docNumberPlaceholder', lang)}
                      />
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('labelNationality', lang)}
                      </label>
                      <select
                        value={kycForm.nationality}
                        onChange={(e) => setKycForm({ ...kycForm, nationality: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      >
                        <option value="">{t('selectNationalityPlaceholder', lang)}</option>
                        {NATIONALITIES.map((nat) => (
                          <option key={nat.value} value={nat.value}>
                            {nat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Document Images */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Front */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('labelDocFront', lang)}
                        </label>
                        {/* Front sample diagram */}
                        <div className="mb-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3">
                          <p className="text-xs font-bold text-emerald-700 mb-1.5">在留カード 表面 例図</p>
                          <div className="grid grid-cols-[40px_1fr] gap-2 text-[10px] text-emerald-600">
                            <div className="row-span-4 bg-white border border-emerald-200 rounded flex items-center justify-center text-emerald-400">
                              Photo
                            </div>
                            <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">氏名 Name</div>
                            <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">国籍・地域 Nationality</div>
                            <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">在留資格 Status ／ 在留期間 Period</div>
                            <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">在留カード番号 Card No.</div>
                          </div>
                        </div>
                        <div
                          onClick={() => frontInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-brand-400 transition"
                        >
                          {frontPreview || guide?.id_document_front_url ? (
                            <img
                              src={frontPreview || guide?.id_document_front_url || ''}
                              alt={t('altDocFront', lang)}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                              <p className="text-sm text-gray-500">{t('uploadFrontText', lang)}</p>
                              <p className="text-xs text-gray-400 mt-1">{t('uploadFormatFront', lang)}</p>
                            </div>
                          )}
                          <input
                            ref={frontInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageSelect(e, 'front')}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* Back */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('labelDocBack', lang)}
                        </label>
                        {/* Back sample diagram */}
                        <div className="mb-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3">
                          <p className="text-xs font-bold text-emerald-700 mb-1.5">在留カード 裏面 例図</p>
                          <div className="space-y-1 text-[10px] text-emerald-600">
                            <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">住居地 Address</div>
                            <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">住居地変更届出 Change of Address</div>
                            <div className="grid grid-cols-2 gap-1">
                              <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">資格外活動許可</div>
                              <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">在留期間更新</div>
                            </div>
                            <div className="bg-white/70 rounded px-1.5 py-0.5 border border-emerald-200">在留カード番号 Card No.</div>
                          </div>
                        </div>
                        <div
                          onClick={() => backInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-brand-400 transition"
                        >
                          {backPreview || guide?.id_document_back_url ? (
                            <img
                              src={backPreview || guide?.id_document_back_url || ''}
                              alt={t('altDocBack', lang)}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                              <p className="text-sm text-gray-500">{t('uploadBackText', lang)}</p>
                              <p className="text-xs text-gray-400 mt-1">{t('uploadFormatBack', lang)}</p>
                            </div>
                          )}
                          <input
                            ref={backInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageSelect(e, 'back')}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          {t('uploading', lang)}
                        </>
                      ) : (
                        <>
                          <Shield size={20} />
                          {guide?.kyc_status === 'rejected' ? t('resubmitKyc', lang) : t('submitKyc', lang)}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      {t('kycPrivacyNote', lang)}
                    </p>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Account Created */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {t('accountCreatedOn', lang)} {guide?.created_at ? new Date(guide.created_at).toLocaleDateString(dateLocaleMap[lang]) : ''}
          </div>
        </div>
      </main>

      {/* KYC Success Modal */}
      {showKycSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('kycSuccessTitle', lang)}</h3>
            <p className="text-gray-600 mb-6">
              {t('kycSuccessDesc', lang)}
            </p>
            <button
              onClick={() => setShowKycSuccessModal(false)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition"
            >
              {t('kycSuccessButton', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
