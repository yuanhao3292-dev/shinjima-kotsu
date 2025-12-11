import React from 'react';
import { QuoteResponse, ItineraryRequest } from '../types';
import { Clock, Search, FileText, ArrowUpRight } from 'lucide-react';

interface HistoryViewProps {
  history: Array<{ quote: QuoteResponse; request: ItineraryRequest }>;
  onViewQuote: (item: { quote: QuoteResponse; request: ItineraryRequest }) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onViewQuote }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">歷史報價紀錄</h2>
          <p className="text-gray-500 text-sm">檢視所有由 AI 與定價引擎生成的歷史訂單。</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="搜尋旅行社或編號..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">報價單號</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">日期</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">旅行社</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">地區/天數</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">預估總價 (JPY)</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">策略</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                         <Clock className="w-8 h-8 opacity-40" />
                      </div>
                      <p className="font-medium">尚無歷史紀錄</p>
                      <p className="text-sm opacity-70">請先至報價引擎建立您的第一筆訂單。</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.quote.id} className="hover:bg-blue-50/50 transition group">
                    <td className="p-4 font-mono text-xs text-gray-500">#{item.quote.id}</td>
                    <td className="p-4 text-sm text-gray-700">
                      {new Date(item.quote.timestamp).toLocaleDateString()}
                      <span className="text-xs text-gray-400 block">{new Date(item.quote.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{item.request.agency_name}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{item.request.hotel_req.location}</span>
                        <span className="text-xs text-gray-400">{item.request.travel_days} 天</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800">¥{item.quote.estimated_total_jpy.toLocaleString()}</td>
                    <td className="p-4">
                       {item.quote.breakdown.sourcing_strategy.includes('OTA') ? (
                         <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                           AI 套利
                         </span>
                       ) : (
                         <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                           標準
                         </span>
                       )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => onViewQuote(item)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition"
                        title="查看詳情"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;