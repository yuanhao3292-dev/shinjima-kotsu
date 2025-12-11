import React, { useState } from 'react';
import { ItineraryRequest, LocationType } from '../types';
import { LOCATIONS, STARS } from '../constants';
import { Calculator, MapPin, Users, Calendar, Bus, Building, Sparkles, MessageSquare } from 'lucide-react';
import { parseSmartImport } from '../services/geminiService';

interface QuoteFormProps {
  request: ItineraryRequest;
  setRequest: React.Dispatch<React.SetStateAction<ItineraryRequest>>;
  onCalculate: () => void;
  loading: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ request, setRequest, onCalculate, loading }) => {
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  
  const updateField = (field: keyof ItineraryRequest, value: any) => {
    setRequest(prev => ({ ...prev, [field]: value }));
  };

  const updateHotelField = (field: string, value: any) => {
    setRequest(prev => ({
      ...prev,
      hotel_req: { ...prev.hotel_req, [field]: value }
    }));
  };

  const handleSmartImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    try {
      const parsedData = await parseSmartImport(importText);
      if (parsedData) {
        // Merge parsed data into current state
        setRequest(prev => ({
          ...prev,
          ...parsedData,
          hotel_req: {
            ...prev.hotel_req,
            ...(parsedData.hotel_req || {})
          }
        }));
        setImportText("");
        setShowImport(false);
      } else {
        alert("無法識別內容，請重試或手動輸入。");
      }
    } catch (e) {
      console.error(e);
      alert("AI 服務暫時無法使用");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-blue-900">
          <Calculator className="w-6 h-6" />
          <h2 className="text-xl font-bold">新詢價單</h2>
        </div>
        <button 
          onClick={() => setShowImport(!showImport)}
          className="text-xs flex items-center gap-1 text-purple-600 font-medium hover:bg-purple-50 px-2 py-1 rounded transition"
        >
          <Sparkles size={14} />
          {showImport ? '隱藏智慧填單' : 'AI 智慧填單'}
        </button>
      </div>

      {/* Smart Import Section */}
      {showImport && (
        <div className="mb-6 bg-purple-50 border border-purple-100 rounded-lg p-4 animate-fade-in-down">
          <label className="block text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
            <MessageSquare size={16} />
            貼上 Line/微信 需求內容
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full p-3 text-sm border border-purple-200 rounded-lg mb-3 focus:ring-2 focus:ring-purple-400 outline-none"
            rows={3}
            placeholder="例如：你好，我們有25人要去大阪5天，大概10月出發，需要4星級飯店和一台大巴..."
          ></textarea>
          <button
            onClick={handleSmartImport}
            disabled={isImporting}
            className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                分析中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                AI 自動填入表格
              </>
            )}
          </button>
        </div>
      )}

      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
        
        {/* Agency Info */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">旅行社名稱</label>
          <input
            type="text"
            value={request.agency_name}
            onChange={(e) => updateField('agency_name', e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="例如：雄獅旅遊"
          />
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Users size={14} /> 人數 (Pax)
            </label>
            <input
              type="number"
              value={request.pax}
              onChange={(e) => updateField('pax', parseInt(e.target.value) || 0)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Calendar size={14} /> 天數
            </label>
            <input
              type="number"
              value={request.travel_days}
              onChange={(e) => updateField('travel_days', parseInt(e.target.value) || 0)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location & Hotel */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide flex items-center gap-2">
            <Building size={16}/> 住宿資訊
          </h3>
          
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">目的地</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <select
                value={request.hotel_req.location}
                onChange={(e) => updateHotelField('location', e.target.value)}
                className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-blue-500 appearance-none"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">等級</label>
                <select
                  value={request.hotel_req.stars}
                  onChange={(e) => updateHotelField('stars', parseInt(e.target.value))}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  {STARS.map(star => (
                    <option key={star.value} value={star.value}>{star.label}</option>
                  ))}
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">房間數</label>
                <input
                  type="number"
                  value={request.hotel_req.rooms}
                  onChange={(e) => updateHotelField('rooms', parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                />
             </div>
          </div>
        </div>

        {/* Transport */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
           <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Bus size={16}/> 需要巴士?
              </label>
              <input
                type="checkbox"
                checked={request.need_bus}
                onChange={(e) => updateField('need_bus', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
           </div>
           
           {request.need_bus && (
             <div className="mt-2">
                <select
                  value={request.bus_type}
                  onChange={(e) => updateField('bus_type', e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                >
                  <option value="coach">大型遊覽車 (45座)</option>
                  <option value="minibus">中型巴士 (20座)</option>
                </select>
             </div>
           )}
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onCalculate}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在計算最佳費率...
            </span>
          ) : (
            '計算估價'
          )}
        </button>
      </div>

    </div>
  );
};

export default QuoteForm;
