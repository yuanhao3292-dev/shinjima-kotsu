import { notFound } from 'next/navigation';
import { getGuideDistributionPage, recordPageView } from '@/lib/services/whitelabel';
import { headers } from 'next/headers';
import {
  Car,
  User,
  Package,
  ChevronRight,
  Users,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import WhitelabelContactSection from '@/components/whitelabel-modules/WhitelabelContactSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDistributionPage({ params }: PageProps) {
  const { slug } = await params;

  // 获取导游分销页面数据
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    notFound();
  }

  const { guide, config, selectedModules, selectedVehicles } = pageData;

  // 从数据库获取图片，保持与主页视觉一致（直接 fetch，避免导入 'use client' 模块）
  let siteImages: Record<string, string> = {};
  try {
    const imgRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_images?is_active=eq.true&select=image_key,image_url`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 300 },
      }
    );
    if (imgRes.ok) {
      const imgData: Array<{ image_key: string; image_url: string }> = await imgRes.json();
      imgData.forEach((img) => { siteImages[img.image_key] = img.image_url; });
    }
  } catch {
    // 静默失败，使用 fallback 图片
  }
  const getImage = (key: string, fallback: string) => siteImages[key] || fallback;

  // 记录页面访问
  const headersList = await headers();
  const referer = headersList.get('referer') || undefined;

  recordPageView(guide.id, {
    pagePath: `/g/${slug}`,
    referrer: referer,
  }).catch((err) => {
    console.error('Failed to record page view:', err);
  });

  const brandName = guide.brandName || guide.name;
  const brandColor = guide.brandColor || '#2563eb';

  // 获取已选择的 componentKey 集合
  const selectedKeys = new Set(
    selectedModules
      .map(m => m.module.componentKey)
      .filter(Boolean)
  );
  const genericModules = selectedModules.filter(m => !m.module.componentKey);

  // 构建联系信息
  const contactInfo = {
    wechat: guide.contactWechat,
    line: guide.contactLine,
    phone: guide.contactDisplayPhone,
    email: guide.email,
  };

  // 构建动态导航（与主页服务板块对应）
  const navItems: Array<{ id: string; label: string }> = [
    { id: 'about', label: '关于我们' },
  ];

  if (selectedKeys.has('medical_tourism')) navItems.push({ id: 'medical', label: '医疗旅游' });
  if (selectedKeys.has('cancer_treatment')) navItems.push({ id: 'treatment', label: '重疾治疗' });
  if (selectedKeys.has('golf')) navItems.push({ id: 'golf', label: '名门高尔夫' });
  if (selectedKeys.has('health_screening')) navItems.push({ id: 'health-screening', label: '健康筛查' });
  if (selectedKeys.has('medical_packages')) navItems.push({ id: 'medical-packages', label: 'TIMC体检' });
  if (selectedKeys.has('vehicles') || selectedVehicles.length > 0) navItems.push({ id: 'vehicles', label: '车辆介绍' });
  if (genericModules.length > 0) navItems.push({ id: 'services', label: '服务项目' });
  navItems.push({ id: 'contact', label: '联系我们' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="bg-white border-b sticky top-0 z-50"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {guide.brandLogoUrl ? (
              <img
                src={guide.brandLogoUrl}
                alt={brandName}
                className="h-10 w-auto"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: brandColor }}
              >
                {brandName.charAt(0)}
              </div>
            )}
            <span className="text-xl font-bold text-gray-900">{brandName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm overflow-x-auto">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-20 text-white"
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, -30)} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {config.seoTitle || `${brandName} - 日本高端定制旅行`}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {config.seoDescription ||
              '专业日本高端医疗体检、商务考察、私人定制服务。中文服务、专属定制。'}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">关于我们</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              为您提供最优质的日本旅行和医疗服务体验
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                {guide.brandLogoUrl ? (
                  <img
                    src={guide.brandLogoUrl}
                    alt={brandName}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{guide.name}</h3>
                <p className="text-gray-600 mb-4">
                  专业导游，为您提供最贴心的服务。
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    中文服务
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    专属定制
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    高端体验
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 主页风格沉浸式服务板块 ========== */}

      {/* 医疗旅游 - 与主页一致的90vh沉浸式板块 */}
      {selectedKeys.has('medical_tourism') && (
        <section id="medical" className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={getImage('homepage_medical_bg', 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')}
              alt="Healthcare"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-900/70 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-teal-300"></div>
                <span className="text-xs tracking-[0.3em] text-teal-300 uppercase">Medical Tourism</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 leading-tight">
                把健康交给
                <br />
                <span className="text-teal-300">值得信赖的人</span>
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-teal-100/80 mb-6 md:mb-8 leading-relaxed font-light">
                日本医疗技术全球领先，PET-CT可发现5mm早期病变。我们提供专车接送、全程陪诊翻译、报告解读——让您专心照顾健康，其他的交给我们。
              </p>

              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">12<span className="text-teal-300">年</span></div>
                  <div className="text-[10px] md:text-xs text-teal-200/60 tracking-wider uppercase">医疗服务经验</div>
                </div>
                <div className="border-x border-white/20 px-2 md:px-6 text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">3000<span className="text-teal-300">+</span></div>
                  <div className="text-[10px] md:text-xs text-teal-200/60 tracking-wider uppercase">服务客户</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">100<span className="text-teal-300">%</span></div>
                  <div className="text-[10px] md:text-xs text-teal-200/60 tracking-wider uppercase">全程陪同</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                {['专车接送', '医疗翻译', '报告解读', '后续跟进'].map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-900 text-sm font-medium rounded-lg hover:bg-teal-50 transition-colors"
              >
                咨询体检方案
                <ArrowRight size={18} className="ml-3" />
              </a>
            </div>
          </div>

          {/* 右下角：检查项目卡片（桌面端） */}
          <div className="hidden lg:block absolute right-8 bottom-8 w-80">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="text-white font-medium mb-4">精密检查项目</h4>
              <div className="space-y-3">
                {[
                  { name: 'PET-CT', desc: '全身癌症早期筛查' },
                  { name: 'MRI 3.0T', desc: '脑部·心脏精密检查' },
                  { name: '无痛胃肠镜', desc: '消化道全面检查' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} className="text-teal-300 flex-shrink-0" />
                    <div>
                      <span className="text-white">{item.name}</span>
                      <span className="text-teal-200/60 ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 重疾治疗 - 与主页一致的90vh沉浸式板块 */}
      {selectedKeys.has('cancer_treatment') && (
        <section id="treatment" className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={getImage('homepage_treatment_bg', 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2000&auto=format&fit=crop')}
              alt="Advanced Medical Treatment"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-950/70 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-sky-300"></div>
                <span className="text-xs tracking-[0.3em] text-sky-300 uppercase">Advanced Treatment</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 leading-tight">
                面对重疾
                <br />
                <span className="text-sky-300">日本医疗给您更多希望</span>
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-blue-100/80 mb-6 md:mb-8 leading-relaxed font-light">
                质子重离子治疗、免疫细胞疗法、达文西微创手术——日本癌症5年生存率全球领先。我们协助您获得日本顶尖医院的治疗机会，全程陪同，让您专注康复。
              </p>

              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">68<span className="text-sky-300">%</span></div>
                  <div className="text-[10px] md:text-xs text-blue-200/60 tracking-wider uppercase">癌症5年生存率</div>
                </div>
                <div className="border-x border-white/20 px-2 md:px-6 text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">98<span className="text-sky-300">%</span></div>
                  <div className="text-[10px] md:text-xs text-blue-200/60 tracking-wider uppercase">心脏手术成功率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">24<span className="text-sky-300">h</span></div>
                  <div className="text-[10px] md:text-xs text-blue-200/60 tracking-wider uppercase">病历评估响应</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                {['癌症治疗', '质子重离子', '心脏手术', '脑血管'].map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-950 text-sm font-medium rounded-lg hover:bg-sky-50 transition-colors"
              >
                咨询治疗服务
                <ArrowRight size={18} className="ml-3" />
              </a>
            </div>
          </div>

          {/* 右下角：服务流程（桌面端） */}
          <div className="hidden lg:block absolute right-8 bottom-8 w-80">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="text-white font-medium mb-4">服务流程</h4>
              <div className="space-y-3">
                {[
                  { step: '01', text: '提交病历，24小时内评估' },
                  { step: '02', text: '制定方案，明确费用' },
                  { step: '03', text: '赴日治疗，全程陪同' },
                  { step: '04', text: '回国后持续跟进' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 bg-sky-400/30 rounded-full flex items-center justify-center text-xs text-sky-200 flex-shrink-0">{item.step}</span>
                    <span className="text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 名门高尔夫 - 与主页一致的90vh沉浸式板块 */}
      {selectedKeys.has('golf') && (
        <section id="golf" className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={getImage('homepage_golf_bg', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop')}
              alt="Premium Golf Course"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-amber-400"></div>
                <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">Exclusive Access</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 leading-tight">
                踏入
                <br />
                <span className="text-amber-400">传说中的名门</span>
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed font-light">
                广野、霞ヶ関、小野——这些球场的名字，在高尔夫爱好者心中如雷贯耳。平时需要会员介绍才能踏入的圣地，现在向您敞开大门。
              </p>

              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">25<span className="text-amber-400">+</span></div>
                  <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase">名门球场</div>
                </div>
                <div className="border-x border-white/20 px-2 md:px-6 text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">0</div>
                  <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase">会员介绍</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">VIP</div>
                  <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase">专属待遇</div>
                </div>
              </div>

              <div className="mb-10">
                <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">合作名门</div>
                <div className="flex flex-wrap gap-2">
                  {['廣野ゴルフ倶楽部', '霞ヶ関カンツリー倶楽部', '小野ゴルフ倶楽部', '茨木カンツリー倶楽部', '古賀ゴルフ・クラブ'].map((course, idx) => (
                    <span key={idx} className="text-sm text-white/80 after:content-['·'] after:mx-2 after:text-amber-400 last:after:content-none">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 bg-amber-400 text-black text-sm font-medium tracking-wider hover:bg-amber-300 transition-colors"
              >
                预约名门球场
                <ArrowRight size={18} className="ml-3" />
              </a>
            </div>
          </div>

          {/* 右下角服务标签 */}
          <div className="absolute bottom-12 right-12 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 max-w-xs">
              <div className="text-xs text-amber-400 mb-2 uppercase tracking-wider">尊享服务</div>
              <div className="space-y-2 text-sm text-white/80">
                <div>✓ 专属开球时段</div>
                <div>✓ 双语球童服务</div>
                <div>✓ 温泉旅馆安排</div>
                <div>✓ 怀石料理预约</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI 智能健康筛查 - 沉浸式板块 */}
      {selectedKeys.has('health_screening') && (
        <section id="health-screening" className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={getImage('hero_slide_3', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop')}
              alt="AI Health Screening"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-950/70 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-indigo-300"></div>
                <span className="text-xs tracking-[0.3em] text-indigo-300 uppercase">AI Health Screening</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 leading-tight">
                AI 智能问诊
                <br />
                <span className="text-indigo-300">精准推荐体检方案</span>
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-indigo-100/80 mb-6 md:mb-8 leading-relaxed font-light">
                通过人体图交互选择不适部位，AI 根据您的症状智能推荐检查科室，并生成专业健康评估报告。3分钟了解您的健康风险，为您推荐最适合的体检方案。
              </p>

              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">3<span className="text-indigo-300">分钟</span></div>
                  <div className="text-[10px] md:text-xs text-indigo-200/60 tracking-wider uppercase">快速评估</div>
                </div>
                <div className="border-x border-white/20 px-2 md:px-6 text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">AI</div>
                  <div className="text-[10px] md:text-xs text-indigo-200/60 tracking-wider uppercase">智能驱动</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">PDF</div>
                  <div className="text-[10px] md:text-xs text-indigo-200/60 tracking-wider uppercase">专业报告</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                {['人体图交互', '智能科室推荐', '动态问诊', 'PDF 报告'].map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-900 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors"
              >
                咨询健康筛查
                <ArrowRight size={18} className="ml-3" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* TIMC 健检套餐 - 沉浸式板块 */}
      {selectedKeys.has('medical_packages') && (
        <section id="medical-packages" className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={getImage('hero_slide_2', getImage('medical_hero', 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg'))}
              alt="TIMC Health Checkup"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/70 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-6 py-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-12 bg-emerald-300"></div>
                <span className="text-xs tracking-[0.3em] text-emerald-300 uppercase">TIMC Health Checkup</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 leading-tight">
                日本 TIMC 精密体检
                <br />
                <span className="text-emerald-300">早期发现，守护健康</span>
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-emerald-100/80 mb-6 md:mb-8 leading-relaxed font-light">
                德洲会国际医疗中心（TIMC）提供世界顶级精密体检服务。PET-CT、MRI、胃肠镜等先进设备，配合日本医师专业解读，为您的健康保驾护航。
              </p>

              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">6<span className="text-emerald-300">种</span></div>
                  <div className="text-[10px] md:text-xs text-emerald-200/60 tracking-wider uppercase">体检套餐</div>
                </div>
                <div className="border-x border-white/20 px-2 md:px-6 text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">5mm</div>
                  <div className="text-[10px] md:text-xs text-emerald-200/60 tracking-wider uppercase">早期病变检出</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">100<span className="text-emerald-300">%</span></div>
                  <div className="text-[10px] md:text-xs text-emerald-200/60 tracking-wider uppercase">中文陪诊</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                {['PET-CT', 'MRI 3.0T', '无痛胃肠镜', '基因检测', '心脑血管'].map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-900 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors"
              >
                咨询体检套餐
                <ArrowRight size={18} className="ml-3" />
              </a>
            </div>
          </div>

          {/* 右下角：套餐列表（桌面端） */}
          <div className="hidden lg:block absolute right-8 bottom-8 w-80">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h4 className="text-white font-medium mb-4">体检套餐</h4>
              <div className="space-y-3">
                {[
                  { name: '标准套餐', desc: '基础全面检查' },
                  { name: 'PET-CT 套餐', desc: '全身癌症筛查' },
                  { name: 'VIP 套餐', desc: '深度精密检查' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} className="text-emerald-300 flex-shrink-0" />
                    <div>
                      <span className="text-white">{item.name}</span>
                      <span className="text-emerald-200/60 ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 车辆介绍 */}
      {(selectedKeys.has('vehicles') || selectedVehicles.length > 0) && (
        <section id="vehicles" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">车辆介绍</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                为您提供舒适、安全的高端座驾
              </p>
            </div>

            {selectedVehicles.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedVehicles.map((sv) => (
                  <div
                    key={sv.id}
                    className="bg-gray-50 rounded-xl overflow-hidden border hover:shadow-lg transition"
                  >
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      {sv.vehicle.images?.[0] ? (
                        <img
                          src={sv.vehicle.images[0]}
                          alt={sv.vehicle.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Car size={48} className="text-gray-400" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {sv.vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {sv.vehicle.description || sv.vehicle.vehicleType}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {sv.vehicle.seats} 座
                        </span>
                      </div>
                      {sv.vehicle.features && sv.vehicle.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {sv.vehicle.features.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Generic Services Section (modules without componentKey) */}
      {genericModules.length > 0 && (
        <section id="services" className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">服务项目</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                为您精选的优质医疗和旅行服务
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genericModules.map((sm) => (
                <div
                  key={sm.id}
                  className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${brandColor}15` }}
                      >
                        {sm.module.thumbnailUrl ? (
                          <img
                            src={sm.module.thumbnailUrl}
                            alt={sm.module.name}
                            className="w-8 h-8"
                          />
                        ) : (
                          <Package size={28} style={{ color: brandColor }} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {sm.module.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {sm.module.description || '优质服务项目'}
                    </p>
                    <a
                      href="#contact"
                      className="w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      了解详情
                      <ChevronRight size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <div id="contact">
        <WhitelabelContactSection
          brandColor={brandColor}
          brandName={brandName}
          contactInfo={contactInfo}
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {guide.brandLogoUrl ? (
                <img
                  src={guide.brandLogoUrl}
                  alt={brandName}
                  className="h-8 w-auto brightness-0 invert"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="font-medium">{brandName}</span>
            </div>
            <div className="text-sm text-gray-400 text-center md:text-right">
              <p>旅行服务由 新岛交通株式会社 提供</p>
              <p className="mt-1">大阪府知事登录旅行业 第2-3115号</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 调整颜色明暗
function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  const r = clamp(parseInt(hex.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pageData = await getGuideDistributionPage(slug);

  if (!pageData) {
    return {
      title: '页面不存在',
    };
  }

  const brandName = pageData.guide.brandName || pageData.guide.name;

  return {
    title: pageData.config.seoTitle || `${brandName} - 日本高端定制旅行`,
    description:
      pageData.config.seoDescription ||
      '专业日本高端体检、医疗服务、商务考察。中文服务、专属定制。',
    openGraph: {
      title: pageData.config.seoTitle || `${brandName} - 日本高端定制旅行`,
      description:
        pageData.config.seoDescription ||
        '专业日本高端体检、医疗服务、商务考察服务。',
    },
  };
}
