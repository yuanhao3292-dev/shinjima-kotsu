'use client';

import {
  Heart,
  Shield,
  Sparkles,
  Activity,
  FileText,
  Users,
} from 'lucide-react';
import type { WhitelabelModuleProps } from './types';
import WhitelabelContactSection from './WhitelabelContactSection';

export default function HealthScreeningModule({ brandColor, brandName, contactInfo, showContact }: WhitelabelModuleProps) {
  return (
    <div>
      {/* Hero - hide when embedded in /g/[slug] */}
      {showContact !== false && (
        <section
          className="py-20"
          style={{
            background: `linear-gradient(135deg, ${brandColor}15 0%, white 100%)`,
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, ${adjustColor(brandColor, -20)})`,
              }}
            >
              <Heart className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              AI 智能健康筛查
            </h2>

            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              全新升级！通过人体图交互选择不适部位，AI
              根据您的症状智能推荐检查科室，并生成专业健康评估报告
            </p>

            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm shadow-sm"
              style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
            >
              <Sparkles className="w-4 h-4" />
              <span>每周免费使用，AI 驱动精准健康评估</span>
            </div>
          </div>
        </section>
      )}

      {/* New Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
            >
              <Sparkles className="w-4 h-4" />
              全新升级功能
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={<Activity className="w-6 h-6" />}
              title="人体图交互"
              desc="直观点击选择不适部位，无需文字描述"
              brandColor={brandColor}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="智能科室推荐"
              desc="AI 自动关联症状对应的医疗科室"
              brandColor={brandColor}
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="动态问诊"
              desc="根据症状智能调整问诊问题"
              brandColor={brandColor}
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="PDF 报告"
              desc="生成精美健康评估报告可下载"
              brandColor={brandColor}
            />
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Shield className="w-6 h-6" style={{ color: brandColor }} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">隐私保护</h4>
              <p className="text-gray-500 text-sm">
                您的健康数据安全加密存储，仅供您个人查看
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Sparkles className="w-6 h-6" style={{ color: brandColor }} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI 智能分析</h4>
              <p className="text-gray-500 text-sm">
                基于先进 AI 模型，为您提供专业的健康评估
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Heart className="w-6 h-6" style={{ color: brandColor }} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">日本医疗推荐</h4>
              <p className="text-gray-500 text-sm">
                根据您的情况推荐日本顶尖医疗机构
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      {showContact !== false && (
        <WhitelabelContactSection
          brandColor={brandColor}
          brandName={brandName}
          contactInfo={contactInfo}
        />
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  brandColor,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  brandColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
      >
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  const r = clamp(parseInt(hex.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
