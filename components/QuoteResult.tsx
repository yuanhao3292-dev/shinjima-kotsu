import React from 'react';
import { QuoteResponse } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingDown, TrendingUp, Cpu, Download, CheckCircle } from 'lucide-react';

interface QuoteResultProps {
  quote: QuoteResponse;
  isAiLoading: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

const QuoteResult: React.FC<QuoteResultProps> = ({ quote, isAiLoading }) => {
  
  const chartData = [
    { name: '住宿', value: quote.breakdown.hotel_cost_basis },
    { name: '交通', value: quote.breakdown.transport },
    { name: '導遊', value: quote.breakdown.guide },
    { name: '利潤', value: quote.breakdown.margin },
  ].filter(d => d.value > 0);

  const isArbitrage = quote.breakdown.sourcing_strategy.includes('OTA');

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
             <button className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-lg">
                <Download size={18} />
                匯出 PDF 報價單
             </button>
             <button className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                發送給旅行社
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default QuoteResult;