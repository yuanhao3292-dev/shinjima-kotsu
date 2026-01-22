'use client';

import React from 'react';
import PublicLayout from '@/components/PublicLayout';
import {
  Award, Shield, Building2, Users, MapPin, Phone, Mail,
  Quote, CheckCircle, Globe, Heart, Target, Briefcase
} from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                NIIJIMA KOTSU Co., Ltd.
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                新島交通株式会社
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                華人世界と日本の高品質な資源をつなぐ架け橋
              </p>
            </div>
          </div>
        </section>

        {/* CEO Message Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Message from CEO</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">トップメッセージ</h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* CEO Photo */}
                <div className="lg:w-1/3 flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 transform translate-x-4 translate-y-4 rounded-2xl"></div>
                    <img
                      src="https://i.ibb.co/B2mJDvq7/founder.jpg"
                      alt="代表取締役 袁浩"
                      className="relative rounded-2xl shadow-lg w-full aspect-[3/4] object-cover object-top"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">代表取締役</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">員 昊</p>
                    <p className="text-sm text-gray-400">Yuan Hao</p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="lg:w-2/3">
                  <div className="relative mb-8">
                    <Quote className="absolute -top-4 -left-6 text-gray-100 w-20 h-20 transform -scale-x-100" />
                    <p className="text-2xl text-gray-800 relative z-10 italic font-serif pl-4 border-l-4 border-blue-500 leading-relaxed">
                      "用心連結世界與日本"
                    </p>
                  </div>

                  <div className="space-y-5 text-gray-600 leading-relaxed">
                    <p>
                      平素より新島交通株式会社をご愛顧いただき、誠にありがとうございます。
                    </p>

                    <p>
                      私は日本で長年生活する中で、日本独自の「おもてなし」精神——心からのきめ細やかなサービスを深く体験してまいりました。
                      しかし同時に、多くの華人旅行者が言語の壁や情報の非対称性により、日本の最高品質のサービスを十分に享受できていない現状も目の当たりにしてきました。
                    </p>

                    <p>
                      これこそが新島交通を創業した原点です。
                      <strong className="text-gray-900">「華人世界と日本の高品質な資源をつなぐ架け橋となる」</strong>——
                      世界トップクラスの精密健診、会員制の名門ゴルフ場、充実したビジネス視察など、
                      お客様一人ひとりに「日本にはこんな楽しみ方があったのか」という驚きと感動をお届けしたいと考えております。
                    </p>

                    <p>
                      今後も医療ツーリズム、ハイエンドカスタマイズ、ビジネス視察の三大領域を深耕し、
                      テクノロジーでサービスを進化させ、真心でお客様の心を動かしてまいります。
                    </p>

                    <p className="text-lg font-medium text-gray-900 pt-4">
                      皆様のご支援を賜りますよう、何卒よろしくお願い申し上げます。
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-900 font-bold">新島交通株式会社</p>
                    <p className="text-gray-600">代表取締役 員 昊</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Philosophy */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Philosophy</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">経営理念</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">用心</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    お客様の立場に立ち、心を込めたサービスを提供します
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">連結</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    華人世界と日本の架け橋として、文化と価値をつなぎます
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">革新</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    テクノロジーで業界を革新し、新たな価値を創造します
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Profile Table */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Company Profile</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">会社概要</h2>
              </div>

              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { label: '商号', value: '新島交通株式会社' },
                      { label: '英文商号', value: 'NIIJIMA KOTSU Co., Ltd.' },
                      { label: '設立', value: '2020年2月' },
                      { label: '資本金', value: '2,500万円' },
                      { label: '代表者', value: '代表取締役 員 昊' },
                      { label: '従業員数', value: '25名（2024年12月現在）' },
                      { label: '本社所在地', value: '〒556-0014\n大阪府大阪市浪速区大国1-2-21\nNICビル602号' },
                      { label: '電話番号', value: '06-6632-8807' },
                      { label: 'メール', value: 'info@niijima-koutsu.jp' },
                      { label: '事業内容', value: '・インバウンド旅行事業\n・医療ツーリズム事業\n・ゴルフツーリズム事業\n・ビジネス視察事業' },
                    ].map((row, index) => (
                      <tr key={index} className="flex flex-col md:table-row hover:bg-white transition">
                        <th className="py-5 px-6 text-left font-bold text-gray-900 bg-gray-100 md:bg-transparent md:w-44">
                          {row.label}
                        </th>
                        <td className="py-5 px-6 text-gray-600 whitespace-pre-line">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Licenses & Certifications */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Licenses</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">登録・許認可</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Award,
                    title: '第二種旅行業',
                    number: '大阪府知事登録',
                    desc: '国内旅行・海外旅行の手配旅行業務',
                    color: 'blue'
                  },
                  {
                    icon: Shield,
                    title: '全国旅行業協会',
                    number: 'ANTA 正会員',
                    desc: '全国旅行業協会に加盟',
                    color: 'green'
                  },
                  {
                    icon: Building2,
                    title: 'TIMC公式代理店',
                    number: '公式認定パートナー',
                    desc: '徳洲会国際医療センター 公式予約代理店',
                    color: 'purple'
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  const colorClasses = {
                    blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
                    green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
                    purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600'
                  };
                  return (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[item.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.number}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Partners</span>
                <h2 className="text-3xl font-serif text-gray-900 mt-3">主要取引先</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  '徳洲会グループ',
                  'TIMC OSAKA',
                  '関西名門ゴルフ倶楽部',
                  '帝国ホテル大阪',
                  'ザ・リッツ・カールトン',
                  'ANA',
                  'JAL',
                  'JR西日本',
                ].map((partner, index) => (
                  <div key={index} className="p-5 bg-gray-50 rounded-xl text-center font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition cursor-default">
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-serif text-white">お問い合わせ</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <a href="tel:06-6632-8807" className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-5 hover:bg-white/20 transition group">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">電話番号</p>
                    <p className="text-white font-bold group-hover:text-blue-300 transition">06-6632-8807</p>
                  </div>
                </a>

                <a href="mailto:info@niijima-koutsu.jp" className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-5 hover:bg-white/20 transition group">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">メール</p>
                    <p className="text-white font-bold group-hover:text-green-300 transition">info@niijima-koutsu.jp</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-5">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">所在地</p>
                    <p className="text-white font-bold text-sm">大阪市浪速区大国1-2-21</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
