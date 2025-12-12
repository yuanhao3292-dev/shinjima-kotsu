import React, { useState } from 'react';
import { QuoteResponse } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingDown, TrendingUp, Cpu, Download, CheckCircle, Send, User, Phone, Mail, X, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface QuoteResultProps {
  quote: QuoteResponse;
  isAiLoading: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

const QuoteResult: React.FC<QuoteResultProps> = ({ quote, isAiLoading }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', contact: '' });
  const [isSending, setIsSending] = useState(false);

  const chartData = [
    { name: '住宿', value: quote.breakdown.hotel_cost_basis },
    { name: '交通', value: quote.breakdown.transport },
    { name: '導遊', value: quote.breakdown.guide },
    { name: '利潤', value: quote.breakdown.margin },
  ].filter(d => d.value > 0);

  const isArbitrage = quote.breakdown.sourcing_strategy.includes('OTA');

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.contact) {
        alert("請填寫聯繫人與聯繫方式");
        return;
    }
    
    setIsSending(true);

    // EmailJS Configuration - REAL CREDENTIALS
    const serviceId = 'service_epq3fhj';
    // CORRECTED TEMPLATE ID FROM USER SCREENSHOT
    const templateId = 'template_56izaei';
    const publicKey = 'exX0IhSSUjNgMhuGb';

    // Build the message details
    // "Magic Message" approach: Dump everything into the 'message' field
    const messageBody = `
      [Quote Inquiry #${quote.id}]
      ---------------------------
      Estimated Total: ¥${quote.estimated_total_jpy.toLocaleString()}
      Per Person: ¥${quote.per_person_jpy.toLocaleString()}
      
      [Sourcing Strategy]
      ${quote.breakdown.sourcing_strategy}
      
      [AI Analysis]
      ${quote.system_note}

      [Customer Contact]
      Name: ${contactForm.name}
      Contact: ${contactForm.contact}
      
      Timestamp: ${new Date().toLocaleString()}
    `;

    const templateParams = {
        // Universal mapping
        message: messageBody,
        
        // Standard keys
        from_name: contactForm.name,
        
        // Specific keys just in case template uses them
        user_name: contactForm.name,
        user_contact: contactForm.contact,
        quote_id: quote.id,
        total_price: quote.estimated_total_jpy.toLocaleString(),
        per_person: quote.per_person_jpy.toLocaleString(),
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
         alert("詢價單已發送至 info@niijima-koutsu.com！\n我們的工作人員將盡快與您聯繫。");
         setShowContactModal(false);
         setContactForm({ name: '', contact: '' });
      })
      .catch((err) => {
         console.error('FAILED...', err);
         alert("发送失败 (Send Failed): " + JSON.stringify(err));
      })
      .finally(() => {
         setIsSending(false);
      });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-medium mb-1">預估總價</p>
            <h3 className="text-4xl font-bold tracking-tight">¥{quote.estimated_total_jpy.toLocaleString()}</h3>
            <p className="mt-2 text-indigo-200 text-sm">
              人均： <span className="text-white font-bold">¥{quote.per_person_jpy.toLocaleString()}</span>
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
            <TrendingUp size={120} />
          </div>
        </div>

        <div className={`rounded-xl p-6 shadow-lg border relative overflow-hidden flex flex-col justify-center ${
          isArbitrage ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
        }`}>
           <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">採購策略</p>
           <div className="flex items-center gap-3">
             {isArbitrage ? (
                <div className="bg-green-100 p-2 rounded-full text-green-700">
                  <TrendingDown size={24} />
                </div>
             ) : (
                <div className="bg-gray-100 p-2 rounded-full text-gray-700">
                  <CheckCircle size={24} />
                </div>
             )}
             <div>
               <p className={`font-bold text-lg ${isArbitrage ? 'text-green-800' : 'text-gray-800'}`}>
                 {isArbitrage ? '已應用動態定價' : '標準合約價'}
               </p>
               <p className="text-xs text-gray-500 mt-1">{quote.breakdown.sourcing_strategy}</p>
             </div>
           </div>
        </div>
      </div>

      {/* Breakdown & AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">成本結構分析</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `¥${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI & Actions Section */}
        <div className="space-y-6">
           {/* AI Note */}
           <div className="bg-gradient-to-b from-purple-50 to-white rounded-xl border border-purple-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-purple-800">
                <Cpu size={18} />
                <h4 className="font-bold text-sm">系統分析師備註</h4>
              </div>
              <div className="min-h-[80px]">
                {isAiLoading ? (
                  <div className="flex space-x-1 animate-pulse py-4">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{quote.system_note}"
                  </p>
                )}
              </div>
           </div>

           {/* Action Buttons */}
           <div className="grid grid-cols-1 gap-3">
             <button 
                onClick={() => setShowContactModal(true)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-lg"
             >
                <Send size={18} />
                提交訂單給 OP
             </button>
             <button className="flex items-center justify-center gap-2 w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Download size={18} />
                匯出 PDF 報價單
             </button>
           </div>
        </div>

      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">確認聯繫方式</h3>
              <p className="text-sm text-gray-500 mb-6">
                請填寫您的聯繫資訊，此報價單將同步發送至 <span className="text-blue-600 font-mono">info@niijima-koutsu.com</span>
              </p>
              
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">聯繫人姓名</label>
                    <div className="relative">
                       <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                       <input 
                         type="text" 
                         value={contactForm.name}
                         onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                         className="w-full pl-9 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                         placeholder="王小明"
                         required
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">電話 / 微信 / Line</label>
                    <div className="relative">
                       <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                       <input 
                         type="text" 
                         value={contactForm.contact}
                         onChange={(e) => setContactForm({...contactForm, contact: e.target.value})}
                         className="w-full pl-9 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                         placeholder="+886 912 345 678"
                         required
                       />
                    </div>
                 </div>
                 
                 <button 
                    type="submit" 
                    disabled={isSending}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {isSending ? '發送中...' : '確認並發送'}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default QuoteResult;