import React from 'react';
import Logo from './Logo';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="antialiased text-[#2D2D2D] bg-[#FAFAFA]">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 nav-blur border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            {/* Logo Replacement */}
            <div className="w-10 h-10 transition-transform duration-300 group-hover:scale-105">
                <Logo className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-serif tracking-widest text-gray-900">SHINJIMA</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">新島交通株式会社</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-12 text-sm font-medium text-gray-500 tracking-wider">
            <a href="#medical" className="hover:text-black transition">医療・癒やし</a>
            <a href="#business" className="hover:text-black transition">商務考察</a>
            <a href="#ai-b2b" className="gemini-text font-bold relative group">
              AI B2B System
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] gemini-gradient transition-all group-hover:w-full"></span>
            </a>
            <a href="#about" className="hover:text-black transition">会社概要</a>
          </div>

          <button 
            onClick={onLogin}
            className="text-xs border border-gray-800 px-6 py-2 rounded-full hover:bg-gray-800 hover:text-white transition duration-300 uppercase tracking-widest"
          >
            Partner Login
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?q=80&w=2070&auto=format&fit=crop" 
          alt="Japan Zen Landscape" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 animate-kenburns-slow"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/60"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col justify-center items-center h-full">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-600 mb-6 animate-fade-in-up">
            Premium Medical & Wellness Tourism
          </p>
          <h1 className="text-4xl md:text-7xl font-serif text-gray-800 leading-tight mb-8 drop-shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            静寂と、<br />
            <span className="italic font-light">最先端</span>の境目で。
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed text-sm md:text-base font-light animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            新岛交通重新定义日本医疗之旅。<br />
            链接大阪顶尖 PET-CT 影像中心与隐世疗愈地。<br />
            以 AI 赋能 B2B 同业，提供专业、透明的高端地接方案。
          </p>
          
          <div className="mt-12 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <a href="#ai-b2b" className="inline-flex items-center gap-2 text-sm border-b border-gray-800 pb-1 hover:text-blue-600 hover:border-blue-600 transition group">
              探索智能报价系统 
              <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-1 transition"></i>
            </a>
          </div>
        </div>
      </header>

      {/* Medical Section */}
      <section id="medical" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 image-card shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2070&auto=format&fit=crop" 
                alt="Advanced Medical Scanning (PET-CT)" 
                className="w-full h-[550px] object-cover grayscale hover:grayscale-0 transition duration-700"
              />
            </div>
            <div className="md:w-1/2 space-y-8">
              <span className="text-blue-500 text-xs tracking-widest uppercase font-bold">Medical & Wellness</span>
              <h2 className="text-4xl font-serif text-gray-900">生命の精密検査与再生</h2>
              <p className="text-gray-500 leading-8 font-light">
                在这个焦虑的时代，最大的奢侈是确定性。
                我们战略合作大阪中心高级医疗机构，为您提供世界级的早期癌症筛查服务，并在检测后安排隐世温泉疗愈，实现身心的彻底重启。
              </p>
              <ul className="space-y-6 pt-6 border-t border-gray-100">
                <li className="flex items-start gap-4">
                  <span className="text-xl serif text-gray-300 mt-1">01</span>
                  <div>
                    <h4 className="font-serif text-lg mb-1">高端精密体检 (PET-CT)</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      大阪核心区顶级影像中心直通预约。<br />
                      <span className="text-blue-600/70">合作机构特色：高精度癌症早期发现、舒适无痛检查环境。</span>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl serif text-gray-300 mt-1">02</span>
                  <div>
                    <h4 className="font-serif text-lg mb-1">私人定制疗愈行程</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      体检结束后的米其林养生膳食与京都/关西隐秘私汤安排。
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="business" className="py-24 bg-[#F5F5F7]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
            <div className="md:w-1/2 image-card shadow-lg">
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
                从公务签证函协助到商务晚宴安排，体现专业地接的深度。
              </p>
              <button className="inline-block border border-gray-300 px-8 py-3 text-sm hover:bg-black hover:text-white transition cursor-pointer tracking-wider uppercase">
                View Case Studies
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
              支持自然语言识别行程，<span className="font-medium text-gray-800">自动整合医疗资源协议价</span>与实时库存。
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
                  "您好，我们有 VIP 客户夫妇 2 人，下个月中旬想去大阪做一次最顶级的 PET-CT 防癌精密体检 (TIMC)，体检完安排 3 天京都高端疗愈，要住安缦或虹夕诺雅，全程阿尔法接送，麻烦报价。"
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
                    <p className="text-xs text-gray-500 mb-1">医疗资源 (大阪中央高级医疗中心)</p>
                    <p className="text-sm font-bold text-gray-800">VIP 精密体检套餐 (2名)</p>
                    <p className="text-xs text-blue-600 mt-1">
                      <i className="fas fa-check-circle"></i> 预约通道已锁定
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-800">协议打包价 (含服务费)</span>
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
                  <span className="text-3xl font-serif text-gray-900 gemini-text font-bold">¥ 1,258,000</span>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                  *此报价为AI估算结果，最终价格以人工确认书为准。
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

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                {/* Footer Logo */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent">
                   <Logo className="w-full h-full text-white/90" />
                </div>
                <h4 className="text-xl font-serif tracking-widest">SHINJIMA KOTSU</h4>
              </div>
              <p className="text-xs text-gray-500 tracking-wider leading-relaxed">
                大阪府知事登録旅行業第2-3115号<br />
                大阪市浪速区大国1-2-21-602
              </p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition flex flex-col items-center gap-1">
                <i className="fab fa-line text-xl"></i>
                <span className="text-[10px]">LINE</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition flex flex-col items-center gap-1">
                <i className="far fa-envelope text-xl"></i>
                <span className="text-[10px]">MAIL</span>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between text-xs text-gray-500">
            <p>&copy; 2025 Shinjima Kotsu Co., Ltd. All Rights Reserved.</p>
            <div className="space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;