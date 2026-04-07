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
  XCircle,
  Banknote
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
    ko: '계정 설정',
  },
  pageSubtitle: {
    ja: '個人情報とセキュリティ設定を管理',
    'zh-CN': '管理您的个人信息和安全设置',
    'zh-TW': '管理您的個人資訊和安全設置',
    en: 'Manage your personal information and security settings',
    ko: '개인 정보 및 보안 설정을 관리합니다',
  },

  // Loading
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
    ko: '로딩 중...',
  },

  // Account info section
  referralCode: {
    ja: '紹介コード:',
    'zh-CN': '推荐码:',
    'zh-TW': '推薦碼:',
    en: 'Referral code:',
    ko: '추천 코드:',
  },

  // Level labels
  levelGrowth: {
    ja: '初期パートナー',
    'zh-CN': '初期合伙人',
    'zh-TW': '初期合夥人',
    en: 'Growth Partner',
    ko: '초기 파트너',
  },
  levelGold: {
    ja: 'ゴールドパートナー',
    'zh-CN': '金牌合伙人',
    'zh-TW': '金牌合夥人',
    en: 'Gold Partner',
    ko: '골드 파트너',
  },

  // Tabs
  tabProfile: {
    ja: '個人情報',
    'zh-CN': '个人信息',
    'zh-TW': '個人資訊',
    en: 'Profile',
    ko: '개인 정보',
  },
  tabPassword: {
    ja: 'パスワード変更',
    'zh-CN': '修改密码',
    'zh-TW': '修改密碼',
    en: 'Change Password',
    ko: '비밀번호 변경',
  },
  tabKyc: {
    ja: '本人確認',
    'zh-CN': '身份验证',
    'zh-TW': '身份驗證',
    en: 'Identity Verification',
    ko: '본인 인증',
  },
  tabTax: {
    ja: '税務情報',
    'zh-CN': '税务信息',
    'zh-TW': '稅務資訊',
    en: 'Tax Information',
    ko: '세무 정보',
  },

  // Profile form labels
  labelName: {
    ja: '氏名',
    'zh-CN': '姓名',
    'zh-TW': '姓名',
    en: 'Name',
    ko: '이름',
  },
  labelPhone: {
    ja: '電話番号',
    'zh-CN': '手机号',
    'zh-TW': '手機號',
    en: 'Phone Number',
    ko: '전화번호',
  },
  labelEmail: {
    ja: 'メールアドレス',
    'zh-CN': '邮箱',
    'zh-TW': '郵箱',
    en: 'Email',
    ko: '이메일',
  },
  emailNotEditable: {
    ja: 'メールアドレスは変更できません',
    'zh-CN': '邮箱不可修改',
    'zh-TW': '郵箱不可修改',
    en: 'Email cannot be changed',
    ko: '이메일은 변경할 수 없습니다',
  },
  labelWechat: {
    ja: 'WeChat ID',
    'zh-CN': '微信号',
    'zh-TW': '微信號',
    en: 'WeChat ID',
    ko: 'WeChat ID',
  },
  wechatPlaceholder: {
    ja: '任意',
    'zh-CN': '选填',
    'zh-TW': '選填',
    en: 'Optional',
    ko: '선택 사항',
  },
  saveChanges: {
    ja: '変更を保存',
    'zh-CN': '保存修改',
    'zh-TW': '儲存修改',
    en: 'Save Changes',
    ko: '변경 사항 저장',
  },

  // Profile messages
  profileUpdated: {
    ja: '個人情報が更新されました',
    'zh-CN': '个人信息已更新',
    'zh-TW': '個人資訊已更新',
    en: 'Profile updated successfully',
    ko: '개인 정보가 업데이트되었습니다',
  },
  profileUpdateFailed: {
    ja: '更新に失敗しました。後ほどお試しください',
    'zh-CN': '更新失败，请稍后重试',
    'zh-TW': '更新失敗，請稍後重試',
    en: 'Update failed. Please try again later',
    ko: '업데이트에 실패했습니다. 나중에 다시 시도해 주세요',
  },

  // Password form labels
  labelNewPassword: {
    ja: '新しいパスワード',
    'zh-CN': '新密码',
    'zh-TW': '新密碼',
    en: 'New Password',
    ko: '새 비밀번호',
  },
  passwordPlaceholder: {
    ja: '6文字以上',
    'zh-CN': '至少6位',
    'zh-TW': '至少6位',
    en: 'At least 6 characters',
    ko: '6자 이상',
  },
  labelConfirmPassword: {
    ja: '新しいパスワード（確認）',
    'zh-CN': '确认新密码',
    'zh-TW': '確認新密碼',
    en: 'Confirm New Password',
    ko: '새 비밀번호 확인',
  },
  confirmPasswordPlaceholder: {
    ja: '新しいパスワードを再入力',
    'zh-CN': '再次输入新密码',
    'zh-TW': '再次輸入新密碼',
    en: 'Re-enter new password',
    ko: '새 비밀번호를 다시 입력하세요',
  },
  updatePassword: {
    ja: 'パスワードを更新',
    'zh-CN': '更新密码',
    'zh-TW': '更新密碼',
    en: 'Update Password',
    ko: '비밀번호 업데이트',
  },

  // Password messages
  passwordMismatch: {
    ja: '新しいパスワードが一致しません',
    'zh-CN': '两次输入的新密码不一致',
    'zh-TW': '兩次輸入的新密碼不一致',
    en: 'New passwords do not match',
    ko: '새 비밀번호가 일치하지 않습니다',
  },
  passwordTooShort: {
    ja: '新しいパスワードは6文字以上必要です',
    'zh-CN': '新密码至少需要6位',
    'zh-TW': '新密碼至少需要6位',
    en: 'New password must be at least 6 characters',
    ko: '새 비밀번호는 6자 이상이어야 합니다',
  },
  passwordUpdated: {
    ja: 'パスワードが更新されました',
    'zh-CN': '密码已更新',
    'zh-TW': '密碼已更新',
    en: 'Password updated successfully',
    ko: '비밀번호가 업데이트되었습니다',
  },
  passwordUpdateFailed: {
    ja: 'パスワードの更新に失敗しました',
    'zh-CN': '密码更新失败',
    'zh-TW': '密碼更新失敗',
    en: 'Password update failed',
    ko: '비밀번호 업데이트에 실패했습니다',
  },

  // Image upload messages
  uploadImageOnly: {
    ja: '画像ファイルをアップロードしてください',
    'zh-CN': '请上传图片文件',
    'zh-TW': '請上傳圖片文件',
    en: 'Please upload an image file',
    ko: '이미지 파일을 업로드해 주세요',
  },
  imageTooLarge: {
    ja: '画像サイズは5MB以下にしてください',
    'zh-CN': '图片大小不能超过 5MB',
    'zh-TW': '圖片大小不能超過 5MB',
    en: 'Image size must not exceed 5MB',
    ko: '이미지 크기는 5MB 이하여야 합니다',
  },

  // KYC validation messages
  selectDocType: {
    ja: '証明書の種類を選択してください',
    'zh-CN': '请选择证件类型',
    'zh-TW': '請選擇證件類型',
    en: 'Please select a document type',
    ko: '서류 유형을 선택해 주세요',
  },
  enterDocNumber: {
    ja: '証明書番号を入力してください',
    'zh-CN': '请输入证件号码',
    'zh-TW': '請輸入證件號碼',
    en: 'Please enter the document number',
    ko: '서류 번호를 입력해 주세요',
  },
  enterLegalName: {
    ja: '証明書の氏名を入力してください',
    'zh-CN': '请输入证件姓名',
    'zh-TW': '請輸入證件姓名',
    en: 'Please enter the name on the document',
    ko: '서류상 이름을 입력해 주세요',
  },
  selectNationality: {
    ja: '国籍を選択してください',
    'zh-CN': '请选择国籍',
    'zh-TW': '請選擇國籍',
    en: 'Please select your nationality',
    ko: '국적을 선택해 주세요',
  },
  uploadFrontPhoto: {
    ja: '証明書の表面写真をアップロードしてください',
    'zh-CN': '请上传证件正面照片',
    'zh-TW': '請上傳證件正面照片',
    en: 'Please upload the front photo of your document',
    ko: '서류 앞면 사진을 업로드해 주세요',
  },

  // KYC upload errors
  frontUploadFailed: {
    ja: '表面写真のアップロードに失敗しました',
    'zh-CN': '正面照片上传失败',
    'zh-TW': '正面照片上傳失敗',
    en: 'Front photo upload failed',
    ko: '앞면 사진 업로드에 실패했습니다',
  },
  backUploadFailed: {
    ja: '裏面写真のアップロードに失敗しました',
    'zh-CN': '背面照片上传失败',
    'zh-TW': '背面照片上傳失敗',
    en: 'Back photo upload failed',
    ko: '뒷면 사진 업로드에 실패했습니다',
  },
  pleaseRelogin: {
    ja: '再度ログインしてください',
    'zh-CN': '请重新登录',
    'zh-TW': '請重新登錄',
    en: 'Please log in again',
    ko: '다시 로그인해 주세요',
  },
  kycSubmitFailed: {
    ja: 'KYC の提出に失敗しました',
    'zh-CN': 'KYC 提交失败',
    'zh-TW': 'KYC 提交失敗',
    en: 'KYC submission failed',
    ko: 'KYC 제출에 실패했습니다',
  },

  // KYC status banners
  kycApprovedTitle: {
    ja: '本人確認が完了しました',
    'zh-CN': '身份验证已通过',
    'zh-TW': '身份驗證已通過',
    en: 'Identity verification approved',
    ko: '본인 인증이 완료되었습니다',
  },
  kycApprovedTime: {
    ja: '審査通過日:',
    'zh-CN': '审核通过时间:',
    'zh-TW': '審核通過時間:',
    en: 'Approved on:',
    ko: '심사 통과일:',
  },
  kycSubmittedTitle: {
    ja: '審査中',
    'zh-CN': '审核中',
    'zh-TW': '審核中',
    en: 'Under Review',
    ko: '심사 중',
  },
  kycSubmittedTime: {
    ja: '提出日:',
    'zh-CN': '提交时间:',
    'zh-TW': '提交時間:',
    en: 'Submitted on:',
    ko: '제출일:',
  },
  kycReviewPeriod: {
    ja: '1〜3営業日以内に審査いたします',
    'zh-CN': '我们会在 1-3 个工作日内完成审核',
    'zh-TW': '我們會在 1-3 個工作日內完成審核',
    en: 'We will complete the review within 1-3 business days',
    ko: '1~3영업일 이내에 심사하겠습니다',
  },
  kycRejectedTitle: {
    ja: '認証が否認されました',
    'zh-CN': '验证未通过',
    'zh-TW': '驗證未通過',
    en: 'Verification rejected',
    ko: '인증이 거부되었습니다',
  },
  kycRejectedReason: {
    ja: '理由:',
    'zh-CN': '原因:',
    'zh-TW': '原因:',
    en: 'Reason:',
    ko: '사유:',
  },
  kycRejectedDefault: {
    ja: '有効な証明書を再提出してください',
    'zh-CN': '请重新提交有效证件',
    'zh-TW': '請重新提交有效證件',
    en: 'Please resubmit a valid document',
    ko: '유효한 서류를 다시 제출해 주세요',
  },
  kycPendingTitle: {
    ja: '本人確認を完了してください',
    'zh-CN': '请完成身份验证',
    'zh-TW': '請完成身份驗證',
    en: 'Please complete identity verification',
    ko: '본인 인증을 완료해 주세요',
  },
  kycPendingDesc: {
    ja: 'KYC 認証完了後、コミッションの受け取りが可能になります',
    'zh-CN': '完成 KYC 验证后即可开始获得佣金',
    'zh-TW': '完成 KYC 驗證後即可開始獲得佣金',
    en: 'Complete KYC verification to start earning commissions',
    ko: 'KYC 인증 완료 후 커미션을 받으실 수 있습니다',
  },

  // KYC form labels
  labelDocType: {
    ja: '証明書の種類 *',
    'zh-CN': '证件类型 *',
    'zh-TW': '證件類型 *',
    en: 'Document Type *',
    ko: '서류 유형 *',
  },
  selectDocTypePlaceholder: {
    ja: '証明書の種類を選択',
    'zh-CN': '请选择证件类型',
    'zh-TW': '請選擇證件類型',
    en: 'Select document type',
    ko: '서류 유형 선택',
  },
  labelLegalName: {
    ja: '証明書記載の氏名 *',
    'zh-CN': '证件姓名 *',
    'zh-TW': '證件姓名 *',
    en: 'Legal Name *',
    ko: '서류상 이름 *',
  },
  legalNamePlaceholder: {
    ja: '証明書と同じ氏名を入力してください',
    'zh-CN': '请输入与证件一致的姓名',
    'zh-TW': '請輸入與證件一致的姓名',
    en: 'Enter name as shown on document',
    ko: '서류와 동일한 이름을 입력해 주세요',
  },
  labelDocNumber: {
    ja: '証明書番号 *',
    'zh-CN': '证件号码 *',
    'zh-TW': '證件號碼 *',
    en: 'Document Number *',
    ko: '서류 번호 *',
  },
  docNumberPlaceholder: {
    ja: '証明書番号を入力してください',
    'zh-CN': '请输入证件号码',
    'zh-TW': '請輸入證件號碼',
    en: 'Enter document number',
    ko: '서류 번호를 입력해 주세요',
  },
  labelNationality: {
    ja: '国籍 *',
    'zh-CN': '国籍 *',
    'zh-TW': '國籍 *',
    en: 'Nationality *',
    ko: '국적 *',
  },
  selectNationalityPlaceholder: {
    ja: '国籍を選択',
    'zh-CN': '请选择国籍',
    'zh-TW': '請選擇國籍',
    en: 'Select nationality',
    ko: '국적 선택',
  },

  // Document front/back
  labelDocFront: {
    ja: '証明書の表面 *',
    'zh-CN': '证件正面 *',
    'zh-TW': '證件正面 *',
    en: 'Document Front *',
    ko: '서류 앞면 *',
  },
  altDocFront: {
    ja: '証明書の表面',
    'zh-CN': '证件正面',
    'zh-TW': '證件正面',
    en: 'Document front',
    ko: '서류 앞면',
  },
  uploadFrontText: {
    ja: 'クリックして表面写真をアップロード',
    'zh-CN': '点击上传正面照片',
    'zh-TW': '點擊上傳正面照片',
    en: 'Click to upload front photo',
    ko: '클릭하여 앞면 사진 업로드',
  },
  uploadFormatFront: {
    ja: 'JPG, PNG 対応（最大 5MB）',
    'zh-CN': '支持 JPG, PNG (最大 5MB)',
    'zh-TW': '支持 JPG, PNG (最大 5MB)',
    en: 'Supports JPG, PNG (max 5MB)',
    ko: 'JPG, PNG 지원 (최대 5MB)',
  },
  labelDocBack: {
    ja: '証明書の裏面（任意）',
    'zh-CN': '证件背面（选填）',
    'zh-TW': '證件背面（選填）',
    en: 'Document Back (Optional)',
    ko: '서류 뒷면 (선택 사항)',
  },
  altDocBack: {
    ja: '証明書の裏面',
    'zh-CN': '证件背面',
    'zh-TW': '證件背面',
    en: 'Document back',
    ko: '서류 뒷면',
  },
  uploadBackText: {
    ja: 'クリックして裏面写真をアップロード',
    'zh-CN': '点击上传背面照片',
    'zh-TW': '點擊上傳背面照片',
    en: 'Click to upload back photo',
    ko: '클릭하여 뒷면 사진 업로드',
  },
  uploadFormatBack: {
    ja: 'パスポートの場合、裏面は不要です',
    'zh-CN': '护照可不上传背面',
    'zh-TW': '護照可不上傳背面',
    en: 'Back photo not required for passports',
    ko: '여권의 경우 뒷면이 필요하지 않습니다',
  },

  // KYC submit button
  uploading: {
    ja: 'アップロード中...',
    'zh-CN': '上传中...',
    'zh-TW': '上傳中...',
    en: 'Uploading...',
    ko: '업로드 중...',
  },
  resubmitKyc: {
    ja: '再提出する',
    'zh-CN': '重新提交验证',
    'zh-TW': '重新提交驗證',
    en: 'Resubmit Verification',
    ko: '다시 제출',
  },
  submitKyc: {
    ja: '本人確認を提出',
    'zh-CN': '提交身份验证',
    'zh-TW': '提交身份驗證',
    en: 'Submit Identity Verification',
    ko: '본인 인증 제출',
  },
  kycPrivacyNote: {
    ja: 'お客様の証明書情報は安全に暗号化して保存され、本人確認の目的にのみ使用されます',
    'zh-CN': '您的证件信息将被安全加密存储，仅用于身份验证目的',
    'zh-TW': '您的證件信息將被安全加密存儲，僅用於身份驗證目的',
    en: 'Your document information will be securely encrypted and used only for identity verification purposes',
    ko: '서류 정보는 안전하게 암호화되어 저장되며 본인 인증 목적으로만 사용됩니다',
  },

  // KYC success modal
  kycSuccessTitle: {
    ja: '提出完了',
    'zh-CN': '提交成功',
    'zh-TW': '提交成功',
    en: 'Submission Successful',
    ko: '제출 완료',
  },
  kycSuccessDesc: {
    ja: 'KYC 資料の提出が完了しました。1〜3営業日以内に審査いたします。審査結果はメールでお知らせします。',
    'zh-CN': '您的 KYC 资料已成功提交，我们会在 1-3 个工作日内完成审核。审核结果将通过邮件通知您。',
    'zh-TW': '您的 KYC 資料已成功提交，我們會在 1-3 個工作日內完成審核。審核結果將通過郵件通知您。',
    en: 'Your KYC documents have been submitted successfully. We will complete the review within 1-3 business days. You will be notified of the result via email.',
    ko: 'KYC 자료가 성공적으로 제출되었습니다. 1~3영업일 이내에 심사하겠습니다. 심사 결과는 이메일로 알려드리겠습니다.',
  },
  kycSuccessButton: {
    ja: '了解しました',
    'zh-CN': '我知道了',
    'zh-TW': '我知道了',
    en: 'Got it',
    ko: '알겠습니다',
  },

  // Account creation
  accountCreatedOn: {
    ja: 'アカウント作成日:',
    'zh-CN': '账号创建于',
    'zh-TW': '帳號創建於',
    en: 'Account created on',
    ko: '계정 생성일:',
  },

  // Document types
  docPassport: {
    ja: 'パスポート Passport',
    'zh-CN': '护照 Passport',
    'zh-TW': '護照 Passport',
    en: 'Passport',
    ko: '여권 Passport',
  },
  docIdCard: {
    ja: '身分証明書 ID Card',
    'zh-CN': '身份证 ID Card',
    'zh-TW': '身份證 ID Card',
    en: 'ID Card',
    ko: '신분증 ID Card',
  },
  docResidenceCard: {
    ja: '在留カード Residence Card',
    'zh-CN': '在留卡 Residence Card',
    'zh-TW': '在留卡 Residence Card',
    en: 'Residence Card',
    ko: '재류카드 Residence Card',
  },
  docOther: {
    ja: 'その他 Other',
    'zh-CN': '其他 Other',
    'zh-TW': '其他 Other',
    en: 'Other',
    ko: '기타 Other',
  },

  // Nationalities
  natChina: {
    ja: '中国 China',
    'zh-CN': '中国 China',
    'zh-TW': '中國 China',
    en: 'China',
    ko: '중국 China',
  },
  natTaiwan: {
    ja: '台湾 Taiwan',
    'zh-CN': '台湾 Taiwan',
    'zh-TW': '台灣 Taiwan',
    en: 'Taiwan',
    ko: '대만 Taiwan',
  },
  natHongKong: {
    ja: '香港 Hong Kong',
    'zh-CN': '香港 Hong Kong',
    'zh-TW': '香港 Hong Kong',
    en: 'Hong Kong',
    ko: '홍콩 Hong Kong',
  },
  natJapan: {
    ja: '日本 Japan',
    'zh-CN': '日本 Japan',
    'zh-TW': '日本 Japan',
    en: 'Japan',
    ko: '일본 Japan',
  },
  natKorea: {
    ja: '韓国 Korea',
    'zh-CN': '韩国 Korea',
    'zh-TW': '韓國 Korea',
    en: 'Korea',
    ko: '한국 Korea',
  },
  natSingapore: {
    ja: 'シンガポール Singapore',
    'zh-CN': '新加坡 Singapore',
    'zh-TW': '新加坡 Singapore',
    en: 'Singapore',
    ko: '싱가포르 Singapore',
  },
  natMalaysia: {
    ja: 'マレーシア Malaysia',
    'zh-CN': '马来西亚 Malaysia',
    'zh-TW': '馬來西亞 Malaysia',
    en: 'Malaysia',
    ko: '말레이시아 Malaysia',
  },
  natOther: {
    ja: 'その他 Other',
    'zh-CN': '其他 Other',
    'zh-TW': '其他 Other',
    en: 'Other',
    ko: '기타 Other',
  },

  // Tax info tab
  taxResidencyLabel: {
    ja: '税務居住地',
    'zh-CN': '税务居住地',
    'zh-TW': '稅務居住地',
    en: 'Tax Residency',
    ko: '세무 거주지',
  },
  taxResidencyDesc: {
    ja: '日本国内に住所がある場合は「日本居住者」を選択してください。源泉徴収率に影響します。',
    'zh-CN': '如果您在日本有住所，请选择"日本居住者"。这将影响预扣税率。',
    'zh-TW': '如果您在日本有住所，請選擇「日本居住者」。這將影響預扣稅率。',
    en: 'Select "Japan Resident" if you have an address in Japan. This affects the withholding tax rate.',
    ko: '일본에 주소가 있는 경우 \'일본 거주자\'를 선택해 주세요. 원천징수율에 영향을 미칩니다.',
  },
  taxResident: {
    ja: '日本居住者（源泉徴収 10.21%〜）',
    'zh-CN': '日本居住者（预扣税 10.21%〜）',
    'zh-TW': '日本居住者（預扣稅 10.21%〜）',
    en: 'Japan Resident (Withholding 10.21%~)',
    ko: '일본 거주자 (원천징수 10.21%~)',
  },
  taxNonResident: {
    ja: '非居住者（源泉徴収 20.42%）',
    'zh-CN': '非居住者（预扣税 20.42%）',
    'zh-TW': '非居住者（預扣稅 20.42%）',
    en: 'Non-Resident (Withholding 20.42%)',
    ko: '비거주자 (원천징수 20.42%)',
  },
  invoiceNumberLabel: {
    ja: '適格請求書発行事業者登録番号',
    'zh-CN': '合格发票发行事业者登记号',
    'zh-TW': '合格發票發行事業者登記號',
    en: 'Qualified Invoice Issuer Registration Number',
    ko: '적격 청구서 발행 사업자 등록번호',
  },
  invoiceNumberPlaceholder: {
    ja: 'T1234567890123',
    'zh-CN': 'T1234567890123',
    'zh-TW': 'T1234567890123',
    en: 'T1234567890123',
    ko: 'T1234567890123',
  },
  invoiceNumberDesc: {
    ja: 'インボイス制度に基づく登録番号をお持ちの場合はご入力ください（T + 13桁数字）',
    'zh-CN': '如果您持有发票制度登记号，请输入（T + 13位数字）',
    'zh-TW': '如果您持有發票制度登記號，請輸入（T + 13位數字）',
    en: 'Enter your invoice registration number if applicable (T + 13 digits)',
    ko: '인보이스 제도에 따른 등록번호가 있으시면 입력해 주세요 (T + 13자리 숫자)',
  },
  invoiceNumberInvalid: {
    ja: '登録番号の形式が正しくありません（T + 13桁数字）',
    'zh-CN': '登记号格式不正确（T + 13位数字）',
    'zh-TW': '登記號格式不正確（T + 13位數字）',
    en: 'Invalid registration number format (T + 13 digits)',
    ko: '등록번호 형식이 올바르지 않습니다 (T + 13자리 숫자)',
  },
  taxInfoSaved: {
    ja: '税務情報が更新されました',
    'zh-CN': '税务信息已更新',
    'zh-TW': '稅務資訊已更新',
    en: 'Tax information updated successfully',
    ko: '세무 정보가 업데이트되었습니다',
  },
  taxInfoSaveFailed: {
    ja: '税務情報の更新に失敗しました',
    'zh-CN': '税务信息更新失败',
    'zh-TW': '稅務資訊更新失敗',
    en: 'Failed to update tax information',
    ko: '세무 정보 업데이트에 실패했습니다',
  },
  taxInfoNote: {
    ja: '※ 源泉徴収は所得税法に基づき、紹介報酬の支払い時に控除されます。年末に支払調書を発行いたします。',
    'zh-CN': '※ 预扣税根据日本所得税法，在支付介绍报酬时扣除。年末将发放支付调书。',
    'zh-TW': '※ 預扣稅根據日本所得稅法，在支付介紹報酬時扣除。年末將發放支付調書。',
    en: '※ Withholding tax is deducted from referral commissions per Japan Income Tax Act. A payment report will be issued at year-end.',
    ko: '※ 원천징수는 일본 소득세법에 따라 소개 보수 지급 시 공제됩니다. 연말에 지급조서를 발행해 드리겠습니다.',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};
const dateLocaleMap: Record<Language, string> = { ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US', ko: 'ko-KR' };

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
  // Tax fields
  tax_residency: 'resident' | 'non_resident';
  invoice_registration_number: string | null;
}

// ============================================================
// Component
// ============================================================

export default function SettingsPage() {
  const lang = useLanguage();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'kyc' | 'tax'>('profile');
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
  // Tax form
  const [taxForm, setTaxForm] = useState<{
    taxResidency: 'resident' | 'non_resident';
    invoiceNumber: string;
  }>({ taxResidency: 'non_resident', invoiceNumber: '' });

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
      setTaxForm({
        taxResidency: guideData.tax_residency || 'non_resident',
        invoiceNumber: guideData.invoice_registration_number || '',
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

  // Submit Tax Info
  const handleTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;

    // Validate invoice number format if provided
    if (taxForm.invoiceNumber && !/^T\d{13}$/.test(taxForm.invoiceNumber)) {
      setMessage({ type: 'error', text: t('invoiceNumberInvalid', lang) });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('guides')
        .update({
          tax_residency: taxForm.taxResidency,
          invoice_registration_number: taxForm.invoiceNumber || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', guide.id);

      if (error) throw error;

      setMessage({ type: 'success', text: t('taxInfoSaved', lang) });
      await loadGuideData();
    } catch (err) {
      setMessage({ type: 'error', text: t('taxInfoSaveFailed', lang) });
    } finally {
      setSaving(false);
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-serif text-brand-900">{t('pageTitle', lang)}</h1>
            <p className="text-neutral-500 mt-1">{t('pageSubtitle', lang)}</p>
          </div>

          {/* Account Info */}
          <div className="bg-white border p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-600">
                  {guide?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-brand-900">{guide?.name}</h2>
                <p className="text-neutral-500">{guide?.email}</p>
                <p className="text-sm text-brand-600 font-medium mt-1">
                  {getLevelLabel(guide?.level || 'bronze')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-neutral-500">
              <span>{t('referralCode', lang)}</span>
              <span className="font-mono font-bold text-neutral-900">{guide?.referral_code}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setActiveTab('profile'); setMessage(null); }}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border'
              }`}
            >
              <User className="inline mr-2" size={16} />
              {t('tabProfile', lang)}
            </button>
            <button
              onClick={() => { setActiveTab('password'); setMessage(null); }}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === 'password'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border'
              }`}
            >
              <Lock className="inline mr-2" size={16} />
              {t('tabPassword', lang)}
            </button>
            <button
              onClick={() => { setActiveTab('kyc'); setMessage(null); }}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === 'kyc'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border'
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
            <button
              onClick={() => { setActiveTab('tax'); setMessage(null); }}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === 'tax'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border'
              }`}
            >
              <Banknote className="inline mr-2" size={16} />
              {t('tabTax', lang)}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 px-4 py-3 flex items-center gap-2 text-sm ${
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
            <div className="bg-white border p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <User className="inline mr-1" size={16} />
                    {t('labelName', lang)}
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Phone className="inline mr-1" size={16} />
                    {t('labelPhone', lang)}
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Mail className="inline mr-1" size={16} />
                    {t('labelEmail', lang)}
                  </label>
                  <input
                    type="email"
                    value={guide?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50 text-neutral-500"
                  />
                  <p className="text-xs text-neutral-400 mt-1">{t('emailNotEditable', lang)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <MessageCircle className="inline mr-1" size={16} />
                    {t('labelWechat', lang)}
                  </label>
                  <input
                    type="text"
                    value={profileForm.wechatId}
                    onChange={(e) => setProfileForm({ ...profileForm, wechatId: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder={t('wechatPlaceholder', lang)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-3 transition flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {t('saveChanges', lang)}
                </button>
              </form>
            </div>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <div className="bg-white border p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('labelNewPassword', lang)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder={t('passwordPlaceholder', lang)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('labelConfirmPassword', lang)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder={t('confirmPasswordPlaceholder', lang)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-3 transition flex items-center justify-center gap-2"
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
                <div className="bg-green-50 border border-green-200 p-4 flex items-center gap-3">
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
                <div className="bg-yellow-50 border border-yellow-200 p-4 flex items-center gap-3">
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
                <div className="bg-red-50 border border-red-200 p-4 flex items-center gap-3">
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
                <div className="bg-blue-50 border border-blue-200 p-4 flex items-center gap-3">
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
                <div className="bg-white border p-6">
                  <form onSubmit={handleKycSubmit} className="space-y-5">
                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('labelDocType', lang)}
                      </label>
                      <select
                        value={kycForm.documentType}
                        onChange={(e) => setKycForm({ ...kycForm, documentType: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('labelLegalName', lang)}
                      </label>
                      <input
                        type="text"
                        value={kycForm.legalName}
                        onChange={(e) => setKycForm({ ...kycForm, legalName: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder={t('legalNamePlaceholder', lang)}
                      />
                    </div>

                    {/* Document Number */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('labelDocNumber', lang)}
                      </label>
                      <input
                        type="text"
                        value={kycForm.documentNumber}
                        onChange={(e) => setKycForm({ ...kycForm, documentNumber: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder={t('docNumberPlaceholder', lang)}
                      />
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('labelNationality', lang)}
                      </label>
                      <select
                        value={kycForm.nationality}
                        onChange={(e) => setKycForm({ ...kycForm, nationality: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('labelDocFront', lang)}
                        </label>
                        {/* Front sample diagram */}
                        <div className="mb-2 border border-emerald-300 bg-emerald-50 p-3">
                          <p className="text-xs font-bold text-emerald-700 mb-1.5">在留カード 表面 例図</p>
                          <div className="grid grid-cols-[40px_1fr] gap-2 text-[10px] text-emerald-600">
                            <div className="row-span-4 bg-white border border-emerald-200 flex items-center justify-center text-emerald-400">
                              Photo
                            </div>
                            <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">氏名 Name</div>
                            <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">国籍・地域 Nationality</div>
                            <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">在留資格 Status ／ 在留期間 Period</div>
                            <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">在留カード番号 Card No.</div>
                          </div>
                        </div>
                        <div
                          onClick={() => frontInputRef.current?.click()}
                          className="border-2 border-dashed border-neutral-300 p-4 text-center cursor-pointer hover:border-brand-400 transition"
                        >
                          {frontPreview || guide?.id_document_front_url ? (
                            <img
                              src={frontPreview || guide?.id_document_front_url || ''}
                              alt={t('altDocFront', lang)}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto text-neutral-400 mb-2" size={32} />
                              <p className="text-sm text-neutral-500">{t('uploadFrontText', lang)}</p>
                              <p className="text-xs text-neutral-400 mt-1">{t('uploadFormatFront', lang)}</p>
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
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t('labelDocBack', lang)}
                        </label>
                        {/* Back sample diagram */}
                        <div className="mb-2 border border-emerald-300 bg-emerald-50 p-3">
                          <p className="text-xs font-bold text-emerald-700 mb-1.5">在留カード 裏面 例図</p>
                          <div className="space-y-1 text-[10px] text-emerald-600">
                            <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">住居地 Address</div>
                            <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">住居地変更届出 Change of Address</div>
                            <div className="grid grid-cols-2 gap-1">
                              <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">資格外活動許可</div>
                              <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">在留期間更新</div>
                            </div>
                            <div className="bg-white/70 px-1.5 py-0.5 border border-emerald-200">在留カード番号 Card No.</div>
                          </div>
                        </div>
                        <div
                          onClick={() => backInputRef.current?.click()}
                          className="border-2 border-dashed border-neutral-300 p-4 text-center cursor-pointer hover:border-brand-400 transition"
                        >
                          {backPreview || guide?.id_document_back_url ? (
                            <img
                              src={backPreview || guide?.id_document_back_url || ''}
                              alt={t('altDocBack', lang)}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto text-neutral-400 mb-2" size={32} />
                              <p className="text-sm text-neutral-500">{t('uploadBackText', lang)}</p>
                              <p className="text-xs text-neutral-400 mt-1">{t('uploadFormatBack', lang)}</p>
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
                      className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-3 transition flex items-center justify-center gap-2"
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

                    <p className="text-xs text-neutral-400 text-center">
                      {t('kycPrivacyNote', lang)}
                    </p>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Tax Info Form */}
          {activeTab === 'tax' && (
            <div className="bg-white border p-6">
              <form onSubmit={handleTaxSubmit} className="space-y-6">
                {/* Tax Residency */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('taxResidencyLabel', lang)}
                  </label>
                  <p className="text-xs text-neutral-500 mb-3">
                    {t('taxResidencyDesc', lang)}
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-50 transition">
                      <input
                        type="radio"
                        name="taxResidency"
                        value="resident"
                        checked={taxForm.taxResidency === 'resident'}
                        onChange={() => setTaxForm({ ...taxForm, taxResidency: 'resident' })}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-neutral-700">{t('taxResident', lang)}</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-neutral-50 transition">
                      <input
                        type="radio"
                        name="taxResidency"
                        value="non_resident"
                        checked={taxForm.taxResidency === 'non_resident'}
                        onChange={() => setTaxForm({ ...taxForm, taxResidency: 'non_resident' })}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-neutral-700">{t('taxNonResident', lang)}</span>
                    </label>
                  </div>
                </div>

                {/* Invoice Registration Number */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('invoiceNumberLabel', lang)}
                  </label>
                  <p className="text-xs text-neutral-500 mb-2">
                    {t('invoiceNumberDesc', lang)}
                  </p>
                  <input
                    type="text"
                    value={taxForm.invoiceNumber}
                    onChange={(e) => setTaxForm({ ...taxForm, invoiceNumber: e.target.value })}
                    placeholder={t('invoiceNumberPlaceholder', lang)}
                    className="w-full px-4 py-3 border border-neutral-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Note */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded">
                  <p className="text-xs text-amber-700">
                    {t('taxInfoNote', lang)}
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white font-bold py-3 transition flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t('loading', lang)}
                    </>
                  ) : (
                    <>
                      <Banknote size={20} />
                      {t('saveChanges', lang)}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Account Created */}
          <div className="mt-6 text-center text-sm text-neutral-400">
            {t('accountCreatedOn', lang)} {guide?.created_at ? new Date(guide.created_at).toLocaleDateString(dateLocaleMap[lang]) : ''}
          </div>
        </div>
      </main>

      {/* KYC Success Modal */}
      {showKycSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-brand-900 mb-2">{t('kycSuccessTitle', lang)}</h3>
            <p className="text-neutral-600 mb-6">
              {t('kycSuccessDesc', lang)}
            </p>
            <button
              onClick={() => setShowKycSuccessModal(false)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 transition"
            >
              {t('kycSuccessButton', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
