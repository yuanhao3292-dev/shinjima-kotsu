'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  LayoutDashboard,
  Store,
  Calendar,
  Wallet,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
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

// Document type options
const DOCUMENT_TYPES = [
  { value: 'passport', label: '護照 Passport' },
  { value: 'id_card', label: '身份證 ID Card' },
  { value: 'residence_card', label: '在留卡 Residence Card' },
  { value: 'other', label: '其他 Other' },
];

// Nationality options
const NATIONALITIES = [
  { value: 'CN', label: '中國 China' },
  { value: 'TW', label: '台灣 Taiwan' },
  { value: 'HK', label: '香港 Hong Kong' },
  { value: 'JP', label: '日本 Japan' },
  { value: 'KR', label: '韓國 Korea' },
  { value: 'SG', label: '新加坡 Singapore' },
  { value: 'MY', label: '馬來西亞 Malaysia' },
  { value: 'OTHER', label: '其他 Other' },
];

export default function SettingsPage() {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

      setMessage({ type: 'success', text: '個人資訊已更新' });
      await loadGuideData();
    } catch (err) {
      setMessage({ type: 'error', text: '更新失敗，請稍後重試' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: '兩次輸入的新密碼不一致' });
      setSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密碼至少需要6位' });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: '密碼已更新' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setMessage({ type: 'error', text: '密碼更新失敗' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner');
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '請上傳圖片文件' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '圖片大小不能超過 5MB' });
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
      setMessage({ type: 'error', text: '請選擇證件類型' });
      return;
    }
    if (!kycForm.documentNumber) {
      setMessage({ type: 'error', text: '請輸入證件號碼' });
      return;
    }
    if (!kycForm.legalName) {
      setMessage({ type: 'error', text: '請輸入證件姓名' });
      return;
    }
    if (!kycForm.nationality) {
      setMessage({ type: 'error', text: '請選擇國籍' });
      return;
    }
    if (!frontImage && !guide.id_document_front_url) {
      setMessage({ type: 'error', text: '請上傳證件正面照片' });
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
          throw new Error('正面照片上傳失敗');
        }
      }

      if (backImage) {
        backUrl = await uploadImage(backImage, guide.id, 'back');
        if (!backUrl) {
          throw new Error('背面照片上傳失敗');
        }
      }

      // 通过 API 提交 KYC（服务端加密敏感信息）
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('请重新登录');
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
        throw new Error(result.error || 'KYC 提交失败');
      }

      await loadGuideData();
      setShowKycSuccessModal(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'KYC 提交失敗' });
    } finally {
      setUploading(false);
    }
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      bronze: '青銅會員',
      silver: '白銀會員',
      gold: '黃金會員',
      black: '黑金會員',
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard' },
    { icon: Store, label: '店舖列表', href: '/guide-partner/venues' },
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings' },
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings', active: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">帳戶設置</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <Logo className="w-8 h-8 text-orange-600" />
          <div>
            <span className="font-bold text-gray-900">NIIJIMA</span>
            <p className="text-xs text-gray-500">Guide Partner</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${item.active
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>退出登入</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-2xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">帳戶設置</h1>
            <p className="text-gray-500 mt-1">管理您的個人資訊和安全設置</p>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-600">
                  {guide?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{guide?.name}</h2>
                <p className="text-gray-500">{guide?.email}</p>
                <p className="text-sm text-orange-600 font-medium mt-1">
                  {getLevelLabel(guide?.level || 'bronze')}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-500">
              <span>推薦碼:</span>
              <span className="font-mono font-bold text-gray-900">{guide?.referral_code}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setActiveTab('profile'); setMessage(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              <User className="inline mr-2" size={16} />
              個人資訊
            </button>
            <button
              onClick={() => { setActiveTab('password'); setMessage(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'password'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              <Lock className="inline mr-2" size={16} />
              修改密碼
            </button>
            <button
              onClick={() => { setActiveTab('kyc'); setMessage(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'kyc'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              <Shield className="inline mr-2" size={16} />
              身份驗證
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
                    姓名
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline mr-1" size={16} />
                    手機號
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-1" size={16} />
                    郵箱
                  </label>
                  <input
                    type="email"
                    value={guide?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">郵箱不可修改</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="inline mr-1" size={16} />
                    微信號
                  </label>
                  <input
                    type="text"
                    value={profileForm.wechatId}
                    onChange={(e) => setProfileForm({ ...profileForm, wechatId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="選填"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  儲存修改
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
                    新密碼
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="至少6位"
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
                    確認新密碼
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="再次輸入新密碼"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                  更新密碼
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
                    <p className="font-bold text-green-800">身份驗證已通過</p>
                    <p className="text-sm text-green-600">
                      審核通過時間: {guide.kyc_reviewed_at ? new Date(guide.kyc_reviewed_at).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              )}

              {guide?.kyc_status === 'submitted' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-bold text-yellow-800">審核中</p>
                    <p className="text-sm text-yellow-600">
                      提交時間: {guide.kyc_submitted_at ? new Date(guide.kyc_submitted_at).toLocaleDateString() : '-'}
                      <br />我們會在 1-3 個工作日內完成審核
                    </p>
                  </div>
                </div>
              )}

              {guide?.kyc_status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <XCircle className="text-red-600" size={24} />
                  <div>
                    <p className="font-bold text-red-800">驗證未通過</p>
                    <p className="text-sm text-red-600">
                      原因: {guide.kyc_review_note || '請重新提交有效證件'}
                    </p>
                  </div>
                </div>
              )}

              {guide?.kyc_status === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                  <Shield className="text-blue-600" size={24} />
                  <div>
                    <p className="font-bold text-blue-800">請完成身份驗證</p>
                    <p className="text-sm text-blue-600">
                      完成 KYC 驗證後即可開始獲得佣金
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
                        證件類型 *
                      </label>
                      <select
                        value={kycForm.documentType}
                        onChange={(e) => setKycForm({ ...kycForm, documentType: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">請選擇證件類型</option>
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
                        證件姓名 *
                      </label>
                      <input
                        type="text"
                        value={kycForm.legalName}
                        onChange={(e) => setKycForm({ ...kycForm, legalName: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="請輸入與證件一致的姓名"
                      />
                    </div>

                    {/* Document Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        證件號碼 *
                      </label>
                      <input
                        type="text"
                        value={kycForm.documentNumber}
                        onChange={(e) => setKycForm({ ...kycForm, documentNumber: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="請輸入證件號碼"
                      />
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        國籍 *
                      </label>
                      <select
                        value={kycForm.nationality}
                        onChange={(e) => setKycForm({ ...kycForm, nationality: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">請選擇國籍</option>
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
                          證件正面 *
                        </label>
                        <div
                          onClick={() => frontInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 transition"
                        >
                          {frontPreview || guide?.id_document_front_url ? (
                            <img
                              src={frontPreview || guide?.id_document_front_url || ''}
                              alt="證件正面"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                              <p className="text-sm text-gray-500">點擊上傳正面照片</p>
                              <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG (最大 5MB)</p>
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
                          證件背面（選填）
                        </label>
                        <div
                          onClick={() => backInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 transition"
                        >
                          {backPreview || guide?.id_document_back_url ? (
                            <img
                              src={backPreview || guide?.id_document_back_url || ''}
                              alt="證件背面"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="py-4">
                              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                              <p className="text-sm text-gray-500">點擊上傳背面照片</p>
                              <p className="text-xs text-gray-400 mt-1">護照可不上傳背面</p>
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
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          上傳中...
                        </>
                      ) : (
                        <>
                          <Shield size={20} />
                          {guide?.kyc_status === 'rejected' ? '重新提交驗證' : '提交身份驗證'}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      您的證件信息將被安全加密存儲，僅用於身份驗證目的
                    </p>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Account Created */}
          <div className="mt-6 text-center text-sm text-gray-400">
            帳號創建於 {guide?.created_at ? new Date(guide.created_at).toLocaleDateString() : ''}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* KYC Success Modal */}
      {showKycSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">提交成功</h3>
            <p className="text-gray-600 mb-6">
              您的 KYC 資料已成功提交，我們會在 1-3 個工作日內完成審核。審核結果將通過郵件通知您。
            </p>
            <button
              onClick={() => setShowKycSuccessModal(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
