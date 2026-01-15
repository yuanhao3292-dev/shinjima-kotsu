'use client';

import React from 'react';
import { Star, Quote, MapPin, CheckCircle } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  flag: string;
  package: string;
  date: string;
  rating: number;
  text: string;
  highlight?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: '陳先生',
    location: '台北',
    flag: '🇹🇼',
    package: 'SELECT 甄選套餐',
    date: '2024年11月',
    rating: 5,
    text: '第一次來日本做健檢，從預約到體檢完成都非常順暢。TIMC的設備真的很先進，整個環境也很舒適，完全不像醫院。翻譯小姐全程陪同，溝通完全沒有障礙。',
    highlight: '設備先進、環境舒適'
  },
  {
    id: 2,
    name: '林小姐',
    location: '高雄',
    flag: '🇹🇼',
    package: 'PREMIUM 尊享套餐',
    date: '2024年10月',
    rating: 5,
    text: '朋友推薦的，做了PET-CT全身檢查，醫生非常仔細地解說了每一項結果。中文報告很詳盡，回台灣後給家庭醫師看也說很清楚。下次會帶爸媽一起來。',
    highlight: 'PET-CT檢查專業'
  },
  {
    id: 3,
    name: '王先生',
    location: '新竹',
    flag: '🇹🇼',
    package: 'VIP 至尊套餐',
    date: '2024年9月',
    rating: 5,
    text: '公司高管健檢選擇了VIP套餐，從機場接送到檢查後的休息都安排得很周到。腸胃鏡是無痛的，睡一覺就做完了。醫生還特別提醒了一些生活習慣要注意的地方。',
    highlight: '無痛腸胃鏡、服務周到'
  },
  {
    id: 4,
    name: '張女士',
    location: '台中',
    flag: '🇹🇼',
    package: 'SELECT 甄選套餐',
    date: '2024年8月',
    rating: 5,
    text: '本來很擔心語言問題，結果完全多慮了。翻譯非常專業，每個檢查項目都解釋得很清楚。TIMC的位置在梅田，交通很方便，做完檢查下午還能去逛街。',
    highlight: '中文服務完善'
  },
  {
    id: 5,
    name: '李先生',
    location: '桃園',
    flag: '🇹🇼',
    package: 'STANDARD 標準套餐',
    date: '2024年7月',
    rating: 5,
    text: '性價比很高，基礎檢查項目都有包含。護士小姐們都很親切，抽血一點都不痛。報告大約一週就收到了，很有效率。明年會再來，考慮升級到含腸胃鏡的套餐。',
    highlight: '性價比高、效率好'
  },
  {
    id: 6,
    name: '黃先生',
    location: '上海',
    flag: '🇨🇳',
    package: 'PREMIUM 尊享套餐',
    date: '2024年11月',
    rating: 5,
    text: '專程從上海飛過來做體檢，整體體驗非常好。日本的醫療水平確實領先，MRI檢查非常細緻。新島交通的預約服務很專業，解答了很多問題。',
    highlight: 'MRI檢查細緻'
  },
  {
    id: 7,
    name: '吳女士',
    location: '香港',
    flag: '🇭🇰',
    package: 'SELECT 甄選套餐',
    date: '2024年10月',
    rating: 5,
    text: '香港做健檢要排好耐，日本呢邊預約好快。TIMC嘅環境好似酒店咁，一啲都唔似醫院。檢查好仔細，醫生解釋得好清楚。',
    highlight: '預約快速、環境一流'
  },
  {
    id: 8,
    name: '趙先生',
    location: '北京',
    flag: '🇨🇳',
    package: 'VIP 至尊套餐',
    date: '2024年9月',
    rating: 5,
    text: '朋友推薦的這家，果然沒讓我失望。VIP套餐的PET-CT加全身MRI非常全面，醫生說以我的年紀每年做一次這樣的篩查很有必要。服務態度一流！',
    highlight: 'PET-CT+MRI全面篩查'
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{testimonial.name}</span>
            <span className="text-lg">{testimonial.flag}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={12} />
            <span>{testimonial.location}</span>
          </div>
        </div>
      </div>
      <div className="flex text-yellow-400 gap-0.5">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
    </div>

    {/* Package Badge */}
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
        {testimonial.package}
      </span>
      <span className="text-xs text-gray-400">{testimonial.date}</span>
    </div>

    {/* Quote */}
    <div className="relative flex-grow">
      <Quote size={20} className="absolute -top-1 -left-1 text-gray-100 transform -scale-x-100" />
      <p className="text-gray-600 text-sm leading-relaxed pl-4 relative z-10">
        {testimonial.text}
      </p>
    </div>

    {/* Highlight */}
    {testimonial.highlight && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={14} />
          <span className="text-xs font-medium">{testimonial.highlight}</span>
        </div>
      </div>
    )}
  </div>
);

const MedicalTestimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-4 py-2 rounded-full mb-4">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            客戶真實評價
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            來自台灣、中國大陸、香港等地客戶的體檢體驗分享
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">98%</div>
            <div className="text-sm text-gray-500">滿意度</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-500">服務人次</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">4.9</div>
            <div className="text-sm text-gray-500">平均評分</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400 mb-4">合作夥伴</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-500 font-semibold">TIMC OSAKA</div>
            <div className="text-gray-500 font-semibold">德洲會醫療集團</div>
            <div className="text-gray-500 font-semibold">新島交通株式会社</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicalTestimonials;
