import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { ArrowLeft, CheckCircle, MapPin, Building, Activity, Star, Shield, Armchair } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

type PageView = 'home' | 'medical' | 'business';

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to handle image fallback (If local image fails, show Unsplash)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string) => {
    e.currentTarget.src = fallbackUrl;
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  // Common Navbar
  const Navbar = () => (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'nav-blur border-gray-200 py-3' : 'bg-transparent border-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }}>
          {/* Logo Container - Using text color #1a1a1a for the ink look */}
          <div className="w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Logo className="w-full h-full text-[#1a1a1a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-serif tracking-widest text-gray-900 drop-shadow-sm font-semibold">SHINJIMA</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">新島交通株式会社</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-12 text-sm font-medium text-gray-600 tracking-wider">
          <button onClick={() => setCurrentPage('medical')} className={`transition hover:text-black ${currentPage === 'medical' ? 'text-blue-600 font-bold' : ''}`}>TIMC 特別提携</button>
          <button onClick={() => setCurrentPage('business')} className={`transition hover:text-black ${currentPage === 'business' ? 'text-blue-600 font-bold' : ''}`}>商務考察</button>
          <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="gemini-text font-bold relative group">
            AI B2B System
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] gemini-gradient transition-all group-hover:w-full"></span>
          </button>
          <button onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'}), 100); }} className="hover:text-black transition">会社概要</button>
        </div>

        <button 
          onClick={onLogin}
          className="text-xs border border-gray-800 px-6 py-2 rounded-full hover:bg-gray-800 hover:text-white transition duration-300 uppercase tracking-widest bg-white/50 backdrop-blur-sm"
        >
          Partner Login
        </button>
      </div>
    </nav>
  );

  // --- Sub-View: Medical Page (Detailed TIMC Info) ---
  const MedicalView = () => (
    <div className="animate-fade-in-up pt-24 min-h-screen bg-white">
      {/* TIMC Hero - Updated for high quality image */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden text-white bg-slate-900">
        <img 
            src="images/timc_lobby.jpg" 
            onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop")}
            className="absolute inset-0 w-full h-full object-cover" 
            alt="TIMC Lobby Luxury Environment" 
        />
        {/* Gradient Overlay: Dark on left for text readability, transparent on right to show the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl animate-fade-in-up">
                <span className="text-blue-400 text-xs tracking-[0.3em] uppercase font-bold border border-blue-400/30 px-3 py-1 rounded-full backdrop-blur-md">Official Authorized Partner</span>
                <h1 className="text-4xl md:text-6xl font-serif mt-6 mb-6 leading-tight">TIMC 大阪中央<br/>高級医療センター</h1>
                <p className="text-gray-100 font-light leading-relaxed text-lg text-shadow-sm">
                   日本最大級の医療グループ「徳洲会」が贈る、最高峰の人間ドック。<br/>
                   大阪駅直結・JPタワー大阪 (KITTE大阪) 11階。<br/>
                   最新鋭の医療機器と、五つ星ホテルのようなホスピタリティが融合する場所。
                </p>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        
        {/* Feature 1: Facility & Access */}
        <div className="flex flex-col md:flex-row gap-16 items-center mb-24">
            <div className="md:w-1/2 space-y-8">
               <div className="flex items-center gap-3 mb-4">
                 <MapPin className="text-blue-600 w-6 h-6" />
                 <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Excellent Access</span>
               </div>
               <h3 className="text-3xl font-serif text-gray-900">大阪駅直結、<br/>圧倒的な利便性とステータス。</h3>
               <p className="text-gray-500 leading-8 font-light">
                 TIMCは、大阪の新たなランドマーク「JPタワー大阪 (KITTE大阪)」の11階に位置しています。
                 関西国際空港からのアクセスも抜群。検査の前後には、同ビル内でのショッピングや美食もお楽しみいただけます。
               </p>
               <ul className="space-y-4 pt-4">
                 <li className="flex items-start gap-3">
                   <CheckCircle className="text-blue-600 w-5 h-5 mt-1 shrink-0" />
                   <span className="text-gray-700 text-sm">JR大阪駅 西口直結 (雨に濡れずに移動可能)</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <CheckCircle className="text-blue-600 w-5 h-5 mt-1 shrink-0" />
                   <span className="text-gray-700 text-sm">徳洲会グループの旗艦施設としての信頼と実績</span>
                 </li>
               </ul>
            </div>
            <div className="md:w-1/2 h-[450px] rounded-2xl overflow-hidden shadow-2xl relative image-card">
                <img 
                    src="images/timc_building.jpg" 
                    onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop")}
                    className="w-full h-full object-cover" 
                    alt="JP Tower Osaka View" 
                />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg">
                   <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                   <p className="font-serif font-bold text-gray-900">JP Tower Osaka / KITTE 11F</p>
                </div>
            </div>
        </div>

        {/* Feature 2: Privacy & VIP Rooms */}
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center mb-24">
            <div className="md:w-1/2 space-y-8">
               <div className="flex items-center gap-3 mb-4">
                 <Shield className="text-purple-600 w-6 h-6" />
                 <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Privacy First</span>
               </div>
               <h3 className="text-3xl font-serif text-gray-900">全室個室。<br/>誰にも会わない、究極のプライバシー。</h3>
               <p className="text-gray-500 leading-8 font-light">
                 VIPのお客様のために、問診から採血、検査結果の説明まで、すべて専用の個室で行います。
                 各部屋には専用のシャワールーム、トイレ、リラックスできるソファを完備。
                 医療機関特有の「待ち時間」のストレスから解放された、優雅なひとときを提供します。
               </p>
               <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl mt-4">
                  <h4 className="flex items-center gap-2 font-bold text-purple-900 mb-2">
                    <Armchair size={18} /> VIP Suite Amenities
                  </h4>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    プライベートコンシェルジュ / 専用更衣室 / アメニティ完備 / 検査後特製ランチ
                  </p>
               </div>
            </div>
            <div className="md:w-1/2 h-[450px] rounded-2xl overflow-hidden shadow-2xl image-card">
                <img 
                    src="images/timc_room.jpg" 
                    onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop")}
                    className="w-full h-full object-cover" 
                    alt="VIP Private Medical Suite" 
                />
            </div>
        </div>

        {/* Feature 3: Technology */}
        <div className="bg-gray-50 rounded-3xl p-10 md:p-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
             <Activity className="w-10 h-10 text-blue-600 mx-auto mb-4" />
             <h3 className="text-3xl font-serif text-gray-900 mb-4">世界最高水準の検査機器</h3>
             <p className="text-gray-500 leading-relaxed">
               GEヘルスケア社製の最新鋭 PET-CT や 3.0テスラ MRI を導入。<br/>
               微細な「がん」の早期発見に加え、受診者様の身体的負担（被爆量や検査時間）を大幅に軽減します。
             </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center group hover:-translate-y-1 transition duration-300">
               <div className="h-40 overflow-hidden rounded-lg mb-4 bg-gray-200">
                 <img 
                    src="images/timc_petct.jpg" 
                    onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1579684385180-1ea55f9f7485?q=80&w=2000&auto=format&fit=crop")}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    alt="PET-CT" 
                 />
               </div>
               <h4 className="font-bold text-gray-800">PET-CT</h4>
               <p className="text-xs text-gray-500 mt-2">Discovery MI (GE Healthcare)</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center group hover:-translate-y-1 transition duration-300">
               <div className="h-40 overflow-hidden rounded-lg mb-4 bg-gray-200">
                  <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="MRI" />
               </div>
               <h4 className="font-bold text-gray-800">3.0T MRI</h4>
               <p className="text-xs text-gray-500 mt-2">SIGNA Architect (GE Healthcare)</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center group hover:-translate-y-1 transition duration-300">
               <div className="h-40 overflow-hidden rounded-lg mb-4 bg-gray-200">
                  <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Microscope" />
               </div>
               <h4 className="font-bold text-gray-800">病理診断</h4>
               <p className="text-xs text-gray-500 mt-2">AI支援画像診断システム</p>
             </div>
          </div>
        </div>

      </div>
      
      <div className="text-center py-12 pb-24 border-t border-gray-100">
        <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
           <ArrowLeft size={16} /> トップページへ戻る
        </button>
      </div>
    </div>
  );

  // --- Sub-View: Business Page ---
  const BusinessView = () => (
    <div className="animate-fade-in-up pt-24 min-h-screen bg-[#F5F5F7]">
      <div className="bg-gray-900 py-20 relative overflow-hidden text-white">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
        <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="text-purple-400 text-xs tracking-[0.3em] uppercase font-bold">Business Inspection & MICE</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">関西産業視察・商務考察</h1>
            <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
               モノづくりの街・大阪から、京都の伝統産業まで。<br/>
               企業の成長に直結する、深みのある視察プログラムをコーディネートします。
            </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-12 -mt-24 relative z-20">
           <h3 className="text-2xl font-serif mb-8 text-center border-b pb-4">提供可能な視察テーマ</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition">
                    <Building className="text-blue-600" />
                 </div>
                 <h4 className="font-bold text-gray-800 mb-2">先端製造業</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   キーエンス、ダイキン工業などの工場見学や企業ミュージアム訪問。リーン生産方式の現場視察。
                 </p>
              </div>
              <div className="text-center group">
                 <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition">
                    <Activity className="text-green-600" />
                 </div>
                 <h4 className="font-bold text-gray-800 mb-2">介護・福祉</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   日本の先進的な高齢者施設や、介護ロボット導入現場の視察。運営ノウハウのレクチャー。
                 </p>
              </div>
              <div className="text-center group">
                 <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition">
                    <MapPin className="text-purple-600" />
                 </div>
                 <h4 className="font-bold text-gray-800 mb-2">不動産投資</h4>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   大阪万博(2025)を見据えたエリア開発視察。タワーマンションや京町家のリノベーション物件案内。
                 </p>
              </div>
           </div>
        </div>

        <div className="mt-16 text-center">
           <h3 className="text-xl font-bold text-gray-800 mb-6">サポート体制</h3>
           <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-white rounded shadow text-sm text-gray-600">招へい理由書作成 (公務ビザ)</span>
              <span className="px-4 py-2 bg-white rounded shadow text-sm text-gray-600">専門通訳手配 (逐次/同時)</span>
              <span className="px-4 py-2 bg-white rounded shadow text-sm text-gray-600">会食セッティング</span>
              <span className="px-4 py-2 bg-white rounded shadow text-sm text-gray-600">専用車手配 (Alphard/Hiace)</span>
           </div>
        </div>
      </div>
      
      <div className="text-center py-12 pb-24">
        <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition">
           <ArrowLeft size={16} /> トップページへ戻る
        </button>
      </div>
    </div>
  );

  // --- Main Home View ---
  const HomeView = () => (
    <div className="bg-[#FAFAFA]">
      {/* Hero Header */}
      <header className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?q=80&w=2070&auto=format&fit=crop" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 animate-kenburns-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/60"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col justify-center items-center h-full">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-600 mb-6 animate-fade-in-up">
            Official Partner of TIMC & Tokushukai Group
          </p>
          <h1 className="text-4xl md:text-7xl font-serif text-gray-800 leading-tight mb-8 drop-shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            静寂と、<br />
            <span className="italic font-light">最先端</span>の境目で。
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed text-sm md:text-base font-light animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            新岛交通携手日本最大医疗集团“德洲会”，<br />
            为您开启通往 <span className="font-bold">TIMC 大阪中央高级医疗中心</span> 的贵宾通道。<br />
            高端体检 · 隐世疗愈 · 商务考察。
          </p>
          <div className="mt-12 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <button onClick={() => { document.getElementById('ai-b2b')?.scrollIntoView({behavior: 'smooth'}) }} className="inline-flex items-center gap-2 text-sm border-b border-gray-800 pb-1 hover:text-blue-600 hover:border-blue-600 transition group">
              探索智能报价系统 
              <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-1 transition"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Medical Preview Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 image-card shadow-xl cursor-pointer rounded-2xl" onClick={() => setCurrentPage('medical')}>
              <img 
                src="images/timc_lobby.jpg" 
                onError={(e) => handleImageError(e, "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop")}
                alt="TIMC Advanced MRI" 
                className="w-full h-[550px] object-cover hover:scale-105 transition duration-700"
              />
            </div>
            <div className="md:w-1/2 space-y-8">
              <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">TIMC Authorized Partner</span>
              <h2 className="text-4xl font-serif text-gray-900">TIMC 大阪中央高級医療センター</h2>
              <p className="text-gray-500 leading-8 font-light">
                位于 JP Tower 大阪 11 层，德洲会集团的顶级旗舰店。<br/>
                我们提供全包间式的 VIP 体验。所有检查无需等待，保护隐私。配备 GE Healthcare 最新型 PET-CT，可发现毫米级病变。
              </p>
              <button 
                onClick={() => setCurrentPage('medical')}
                className="inline-block border border-gray-300 px-8 py-3 text-sm hover:bg-blue-600 hover:border-blue-600 hover:text-white transition cursor-pointer tracking-wider uppercase rounded"
              >
                查看 TIMC 设施详情
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Business Preview Section */}
      <section className="py-24 bg-[#F5F5F7]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
            <div className="md:w-1/2 image-card shadow-lg cursor-pointer rounded-2xl" onClick={() => setCurrentPage('business')}>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                alt="Business MICE" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-8 text-right md:text-left">
              <div className="flex flex-col md:items-start items-end">
                <span className="text-purple-500 text-xs tracking-widest uppercase font-bold">Business & Insights</span>
                <h2 className="text-4xl font-serif text-gray-900 mt-4">商业洞察与连接</h2>
              </div>
              <p className="text-gray-500 leading-8 font-light">
                不仅仅是安排会议室。我们深入日本关西产业带，为您链接医疗器械、养老产业及精密制造企业的参访机会。
              </p>
              <button 
                onClick={() => setCurrentPage('business')}
                className="inline-block border border-gray-300 px-8 py-3 text-sm hover:bg-black hover:text-white transition cursor-pointer tracking-wider uppercase rounded"
              >
                查看考察案例
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI B2B Section */}
      <section id="ai-b2b" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-50 via-purple-50/30 to-transparent opacity-60 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="gemini-text font-bold text-sm tracking-widest uppercase">For Travel Agencies</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-6">AI 智能报价系统</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              将繁琐的询价工作留给 AI。专为台湾同业打造。<br />
              支持自然语言识别行程，<span className="font-medium text-gray-800">自动整合 TIMC 协议价</span>与实时库存。
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="p-10 md:w-1/2 border-r border-gray-50 bg-gray-[50] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Input Request (LINE/Email)</span>
                </div>
                <div className="font-mono text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 p-6 rounded-lg mb-8 shadow-sm">
                  "您好，我们有 VIP 客户夫妇 2 人，下个月中旬想去大阪做一次最顶级的 PET-CT 防癌精密体检 (TIMC)，体检完安排 3 天京都高端疗愈，要住安缦或虹夕诺雅，全程阿尔法接送，麻煩报价。"
                </div>
              </div>
              <button 
                onClick={onLogin}
                className="w-full py-4 gemini-gradient text-white font-medium rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <i className="fas fa-sparkles"></i> AI 极速估价
              </button>
            </div>

            <div className="p-10 md:w-1/2 bg-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-xs text-gray-400 uppercase tracking-wider">AI Quotation Result</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full ring-1 ring-blue-100">
                  <i className="fas fa-bolt mr-1"></i> Generated in 1.2s
                </span>
              </div>
              
              <div className="space-y-5">
                <div className="flex justify-between items-start bg-[#FAFAFA] p-5 rounded-xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-blue-400"></div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">医疗资源 (TIMC 德洲会)</p>
                    <p className="text-sm font-bold text-gray-800">TIMC Premium PET-CT Course</p>
                    <p className="text-xs text-blue-600 mt-1">
                      <i className="fas fa-check-circle"></i> 绿色通道预约确立
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-800">¥ 880,000</span>
                    <p className="text-[10px] text-green-600 bg-green-50 px-1 rounded inline-block mt-1">含 20% 服务费</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 pl-2">
                  <div>
                    <p className="text-xs text-gray-400">住宿 (Aman Kyoto / Hoshinoya)</p>
                    <p className="text-sm font-bold text-gray-800">2晚 (OTA比价优选)</p>
                  </div>
                  <span className="text-green-500 text-xs flex items-center gap-1"><i className="fas fa-check-circle"></i> 库存确认</span>
                </div>

                <div className="flex justify-between items-center p-4 pl-2 border-t border-dashed border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">交通 (Alphard)</p>
                    <p className="text-sm font-bold text-gray-800">全程包车 (5天)</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm text-gray-500">预估总成本 (含税)</span>
                  <span className="text-3xl font-serif text-gray-900 gemini-text font-bold">¥ 1,880,000</span>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                  *此报价为AI估算結果，最終价格以人工确认书为准。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 max-w-4xl">
          <h3 className="text-3xl font-serif mb-12 text-center tracking-widest">会社概要</h3>
          
          <div className="border-t border-gray-200 text-sm font-light bg-white shadow-sm rounded-lg overflow-hidden">
            {[
              { label: '社名', value: '新島交通株式会社 (SHINJIMA KOTSU Co., Ltd.)' },
              { label: '設立', value: '2020年（令和2年）2月' },
              { label: '代表者', value: '代表取締役　員昊 (Yun Hao)' },
              { label: '所在地', value: '〒556-0014 大阪府大阪市浪速区大国1-2-21-602' },
              { label: '主要取引先', value: '大阪中央高級医療センター (TIMC)\n台湾大手旅行代理店各社\n国内主要ホテルチェーン' },
              { label: '登録免許', value: '大阪府知事登録旅行業第2-3115号' },
            ].map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 py-6 border-b border-gray-100 hover:bg-gray-50 transition px-6 group">
                <div className="md:col-span-3 text-gray-400 font-medium group-hover:text-gray-600 transition">{item.label}</div>
                <div className="md:col-span-9 text-gray-800 font-medium whitespace-pre-line leading-relaxed">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="font-sans text-gray-900">
      <Navbar />
      {currentPage === 'home' && <HomeView />}
      {currentPage === 'medical' && <MedicalView />}
      {currentPage === 'business' && <BusinessView />}
    </div>
  );
};

export default LandingPage;