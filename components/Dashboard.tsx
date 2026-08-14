
import React, { useState } from 'react';
import { QuoteResponse, ItineraryRequest, LocationType, UserProfile } from '../types';
import QuoteForm from './QuoteForm';
import QuoteResult from './QuoteResult';
import HistoryView from './HistoryView';
import SettingsView from './SettingsView';
import Logo from './Logo';
import { calculateQuoteAPI } from '../services/apiClient';
import { generateAIAnalysis } from '../services/geminiService';
import { LayoutDashboard, History, Settings, LogOut, Menu, X, type LucideIcon } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  initialRequestText?: string;
}

type ViewState = 'quote' | 'history' | 'settings';

function NavItem({
  view,
  icon: Icon,
  label,
  currentView,
  onSelect,
}: {
  view: ViewState;
  icon: LucideIcon;
  label: string;
  currentView: ViewState;
  onSelect: (view: ViewState) => void;
}) {
  return (
    <button
      onClick={() => onSelect(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
        currentView === view
          ? 'bg-brand-50 text-brand-700'
          : 'text-neutral-600 hover:bg-neutral-50'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, initialRequestText }) => {
  const [currentView, setCurrentView] = useState<ViewState>('quote');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavSelect = (view: ViewState) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [history, setHistory] = useState<Array<{ quote: QuoteResponse; request: ItineraryRequest }>>([]);

  // Initial Form State - Pre-fill agency name from registration if possible
  const [request, setRequest] = useState<ItineraryRequest>({
    agency_name: user.companyName || '',
    pax: 20,
    travel_days: 5,
    need_bus: true,
    bus_type: 'large_bus', // Default to Large Bus for 20 pax
    guide_language: 'zh', // Default Chinese
    hotel_req: {
      stars: 4,
      rooms: 10,
      nights: 4,
      location: LocationType.OSAKA
    }
  });

  const handleCalculate = async () => {
    if (!request.agency_name) {
        alert("請輸入旅行社名稱");
        return;
    }

    setLoading(true);
    setQuote(null);
    setAiLoading(true);
    setCurrentView('quote'); // Ensure we are on the quote view

    try {
      // 1. Calculate the Math (Call Backend API)
      const result = await calculateQuoteAPI(request);
      setQuote(result);
      
      // Save to History immediately
      const historyItem = { quote: result, request: { ...request } };
      setHistory(prev => [historyItem, ...prev]);

      setLoading(false);

      // 2. Generate AI Insight (Async)
      generateAIAnalysis(result, request).then((note) => {
        setQuote(prev => prev ? { ...prev, system_note: note } : null);
        
        // Also update the item in history with the note once available
        setHistory(prev => prev.map(item => 
          item.quote.id === result.id 
            ? { ...item, quote: { ...item.quote, system_note: note } }
            : item
        ));
        setAiLoading(false);
      });

    } catch (error) {
      console.error("Calculation failed", error);
      setLoading(false);
      setAiLoading(false);
    }
  };

  const handleViewQuoteFromHistory = (item: { quote: QuoteResponse; request: ItineraryRequest }) => {
    setRequest(item.request);
    setQuote(item.quote);
    setCurrentView('quote');
    setAiLoading(false); // Assume history items already have AI data or we don't reload it
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-800 font-sans">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 sticky top-0 h-screen z-40">
        <div className="p-6 flex items-center gap-3 border-b border-neutral-100">
           {/* Sidebar Logo */}
           <div className="w-10 h-10 flex-shrink-0">
             <Logo className="w-full h-full text-neutral-900" />
           </div>
           <div>
             <h1 className="font-bold text-lg leading-tight">Niijima<span className="text-brand-600">Admin</span></h1>
             <p className="text-xs text-neutral-400">新島交通 B2B</p>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="quote" icon={LayoutDashboard} label="報價引擎" currentView={currentView} onSelect={handleNavSelect} />
          <NavItem view="history" icon={History} label="歷史紀錄" currentView={currentView} onSelect={handleNavSelect} />
          <NavItem view="settings" icon={Settings} label="系統設定" currentView={currentView} onSelect={handleNavSelect} />
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-brand-50 hover:text-brand-600 rounded-lg font-medium transition mt-10"
          >
            <LogOut size={20} />
            登出系統
          </button>
        </nav>

        <div className="p-4 border-t border-neutral-100">
           <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-xl p-4 text-white shadow-lg">
             <p className="text-xs font-medium text-brand-200 mb-1">今日匯率</p>
             <div className="flex justify-between items-end">
               <span className="font-bold text-xl">1 TWD</span>
               <span className="text-sm opacity-80">≈ 4.65 JPY</span>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center shadow-sm z-30">
           <div className="flex items-center gap-3">
             <button className="md:hidden text-neutral-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X /> : <Menu />}
             </button>
             
             {/* Mobile Header Logo */}
             <div className="md:hidden w-8 h-8 flex-shrink-0">
               <Logo className="w-full h-full text-neutral-900" />
             </div>

             <h2 className="text-xl font-bold text-neutral-800 ml-1">
               {currentView === 'quote' && '建立新報價'}
               {currentView === 'history' && '歷史訂單'}
               {currentView === 'settings' && '系統設定'}
             </h2>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-neutral-800 flex items-center justify-end gap-1">
                 <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                 {user.companyName}
               </p>
               <p className="text-xs text-neutral-500">{user.email}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 border-2 border-white shadow-md flex items-center justify-center font-bold text-sm">
               {user.companyName.charAt(0).toUpperCase()}
             </div>
           </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[73px] left-0 w-full bg-white border-b border-neutral-200 z-50 p-4 shadow-lg animate-fade-in-down">
             <nav className="space-y-2">
                <NavItem view="quote" icon={LayoutDashboard} label="報價引擎" currentView={currentView} onSelect={handleNavSelect} />
                <NavItem view="history" icon={History} label="歷史紀錄" currentView={currentView} onSelect={handleNavSelect} />
                <NavItem view="settings" icon={Settings} label="系統設定" currentView={currentView} onSelect={handleNavSelect} />
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-brand-600 font-medium border-t border-neutral-100 mt-2 pt-4">
                  <LogOut size={20} /> 登出
                </button>
             </nav>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-7xl mx-auto h-full">
             
             {/* View: Quote Engine */}
             {currentView === 'quote' && (
               <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
                 <div className="xl:col-span-4 h-fit">
                   <QuoteForm 
                     request={request} 
                     setRequest={setRequest} 
                     onCalculate={handleCalculate}
                     loading={loading} 
                     initialImportText={initialRequestText}
                   />
                 </div>
                 <div className="xl:col-span-8">
                   {quote ? (
                     // PASS REQUEST OBJECT HERE
                     <QuoteResult quote={quote} request={request} isAiLoading={aiLoading} />
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-neutral-400 min-h-[400px] border-2 border-dashed border-neutral-200 rounded-xl bg-white/50">
                        <div className="bg-brand-50 p-6 rounded-full mb-4">
                          <LayoutDashboard size={48} className="text-brand-300" />
                        </div>
                        <p className="text-lg font-bold text-neutral-600">準備計算</p>
                        <p className="text-sm text-neutral-400">請左側填寫資料或使用 AI 智慧填單。</p>
                     </div>
                   )}
                 </div>
               </div>
             )}

             {/* View: History */}
             {currentView === 'history' && (
               <HistoryView history={history} onViewQuote={handleViewQuoteFromHistory} />
             )}

             {/* View: Settings */}
             {currentView === 'settings' && (
               <SettingsView />
             )}

           </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
