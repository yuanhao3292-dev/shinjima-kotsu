
import React from 'react';
import { Save, User, Globe, DollarSign, Bell } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">系統設定</h2>
        <p className="text-gray-500">管理您的個人偏好、預設費用參數與通知設定。</p>
      </div>

      {/* User Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-800">基本資料</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">操作員名稱</label>
            <input type="text" defaultValue="Satoshi" className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">所屬分部</label>
             <select className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition">
               <option>東京總部 (Tokyo HQ)</option>
               <option>大阪分部 (Osaka Branch)</option>
               <option>福岡辦事處 (Fukuoka Office)</option>
             </select>
          </div>
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
             <input type="email" defaultValue="satoshi@niijima-koutsu.com" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" disabled />
          </div>
        </div>
      </div>

      {/* Pricing Config */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-800">計價參數 (Global)</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
             <div className="flex justify-between items-center mb-2">
                {/* CHANGED LABEL FROM MARGIN TO SERVICE FEE */}
                <label className="block text-sm font-medium text-gray-700">預設服務費率 (Service Fee)</label>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded text-xs">15%</span>
             </div>
             <input type="range" min="5" max="30" defaultValue="15" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
             <p className="text-xs text-gray-500 mt-2">注意：此設定將套用於所有新產生的報價單，但不會影響歷史紀錄。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">導遊日薪基準 (JPY)</label>
               <div className="relative">
                 <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
                 <input type="number" defaultValue={30000} className="w-full pl-8 p-2.5 border border-gray-200 rounded-lg" />
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">參考匯率 (JPY/TWD)</label>
               <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">0.</span>
                 <input type="number" defaultValue={215} className="w-full pl-8 p-2.5 border border-gray-200 rounded-lg" />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-gray-800">系統偏好</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-800">啟用 AI 自動分析</p>
              <p className="text-xs text-gray-500">在報價生成後自動呼叫 Gemini 撰寫分析備註</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-800">深色模式 (Dark Mode)</p>
              <p className="text-xs text-gray-500">切換系統介面至深色主題</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-bold transform active:scale-95">
          <Save size={18} />
          儲存變更
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
