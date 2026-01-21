'use client';

import React from 'react';
import CompanyLayout from '@/components/CompanyLayout';

export default function MessagePage() {
  return (
    <CompanyLayout
      title="トップメッセージ"
      titleEn="Message from CEO"
      breadcrumb={[
        { label: '企業情報', path: '/company' },
        { label: 'トップメッセージ' }
      ]}
    >
      <article className="prose prose-gray max-w-none">
        {/* 社长照片和标题 */}
        <div className="not-prose mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://i.ibb.co/B2mJDvq7/founder.jpg"
                  alt="代表取締役 袁浩"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">代表取締役</p>
                <p className="text-xl font-bold text-gray-900">袁 浩</p>
                <p className="text-sm text-gray-400">Yuan Hao</p>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                用心連結世界與日本
              </h2>

              <div className="space-y-6 text-gray-600 leading-relaxed">
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
                  2024年には「ガイドパートナープログラム」を開始し、在日華人ガイドの皆様に旅行会社レベルのリソースと技術サポートを提供する取り組みを始めました。
                  これはビジネスモデルの革新にとどまらず、業界全体への責任と約束でもあります。
                </p>

                <p>
                  今後も医療ツーリズム、ハイエンドカスタマイズ、ビジネス視察の三大領域を深耕し、
                  テクノロジーでサービスを進化させ、真心でお客様の心を動かしてまいります。
                </p>

                <p className="text-lg font-medium text-gray-900 pt-4">
                  皆様のご支援を賜りますよう、何卒よろしくお願い申し上げます。
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-gray-900 font-bold">新島交通株式会社</p>
                <p className="text-gray-600">代表取締役 袁 浩</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </CompanyLayout>
  );
}
