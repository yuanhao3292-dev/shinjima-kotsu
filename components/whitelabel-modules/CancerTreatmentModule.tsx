'use client';

import React, { useState } from 'react';
import {
  ArrowRight, CheckCircle, Shield, Activity,
  Target, Dna, Stethoscope,
  FileText, Clock, Users, Building, Globe,
  Atom, Pill, Radio, FlaskConical, HeartPulse, Leaf, CreditCard,
  MapPin, Award, Info, ExternalLink, MessageSquare,
} from 'lucide-react';
import type { WhitelabelModuleProps } from './types';
import WhitelabelContactSection from './WhitelabelContactSection';

// ============================================================================
// 治疗流程步骤数据 (zh-CN)
// ============================================================================
const TREATMENT_FLOW = [
  { step: 1, title: '前期咨询', subtitle: '提交申请・提供资料', fee: '¥221,000', from: '患者', to: '中介', desc: '治疗信息提供书、血液/病理报告、CT/MRI/PET数据、手术记录等' },
  { step: 2, title: '支付前期咨询费', subtitle: '选择合适的医院与医生', fee: null, from: '患者', to: '中介', desc: null },
  { step: 3, title: '资料翻译', subtitle: '咨询医院', fee: null, from: '中介', to: '医院/患者', desc: null },
  { step: 4, title: '赴日前远程会诊', subtitle: '讨论治疗方案', fee: '¥243,000', from: '医院', to: '患者', desc: '讨论治疗方案，提供治疗计划，提示治疗费概算金额' },
  { step: 5, title: '决定来日治疗', subtitle: '支付治疗保证金', fee: null, from: '患者', to: '中介', desc: null },
  { step: 6, title: '确定来日日期', subtitle: '如需要申请医疗签证', fee: null, from: '患者', to: '中介', desc: null },
  { step: 7, title: '预约就诊', subtitle: '安排翻译', fee: null, from: '中介', to: '医院/患者', desc: '安排有经验及资格的专业医疗翻译' },
  { step: 8, title: '来日治疗', subtitle: '就诊支援', fee: null, from: '中介/医院', to: '患者', desc: null },
  { step: 9, title: '治疗结束', subtitle: '费用结算', fee: null, from: '中介/医院', to: '患者', desc: null },
  { step: 10, title: '后续支持', subtitle: '远程随访', fee: null, from: '医院', to: '患者', desc: '提供病历以及给中国医生的治疗总结与建议，必要时做线上随访或远程咨询' },
];

// ============================================================================
// 治疗阶段分组
// ============================================================================
type PhaseColor = 'blue' | 'purple' | 'amber' | 'green';

interface TreatmentPhase {
  id: string;
  phaseNumber: number;
  icon: typeof FileText;
  color: PhaseColor;
  title: string;
  subtitle: string;
  duration: string;
  stepRange: [number, number];
  patientActions: string[];
  weHandle: string[];
  feeSummary: string | null;
}

const TREATMENT_PHASES: TreatmentPhase[] = [
  {
    id: 'pre-assessment', phaseNumber: 1, icon: FileText, color: 'blue',
    title: '前期评估', subtitle: '从提交资料到医院咨询', duration: '约 1-2 周',
    stepRange: [1, 3],
    patientActions: ['提交诊疗资料', '支付前期咨询费'],
    weHandle: ['资料翻译（中→日）', '选择合适的医院与医生', '向医院初步咨询'],
    feeSummary: '¥221,000（含税）',
  },
  {
    id: 'remote-consultation', phaseNumber: 2, icon: Globe, color: 'purple',
    title: '远程会诊', subtitle: '与日本专科医生视频会诊', duration: '约 1-2 周',
    stepRange: [4, 5],
    patientActions: ['参加远程会诊', '最终决定是否赴日'],
    weHandle: ['协调专科医生时间', '安排医疗翻译', '提供治疗计划与费用概算', '告知治疗保证金金额'],
    feeSummary: '¥243,000（含税）',
  },
  {
    id: 'treatment-japan', phaseNumber: 3, icon: Activity, color: 'amber',
    title: '赴日治疗', subtitle: '支付保证金后，从确定日程到完成治疗', duration: '依病情而定',
    stepRange: [6, 8],
    patientActions: ['支付治疗保证金', '确认赴日行程', '申请医疗签证（如需要）'],
    weHandle: ['医院预约、翻译安排', '全程就诊支援', '如有追加费用即时通知', '签证申请协助'],
    feeSummary: null,
  },
  {
    id: 'followup', phaseNumber: 4, icon: HeartPulse, color: 'green',
    title: '治疗完成与随访', subtitle: '保证金结算至后续支持', duration: '持续支援',
    stepRange: [9, 10],
    patientActions: ['归国后告知状况'],
    weHandle: ['以保证金支付全部医疗费、多退少补', '提供治疗总结', '安排远程随访'],
    feeSummary: null,
  },
];

const PHASE_COLOR_MAP: Record<PhaseColor, { bg: string; light: string; border: string; text: string; ring: string }> = {
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-600',   text: 'text-blue-600',   ring: 'ring-blue-200' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-600', text: 'text-purple-600', ring: 'ring-purple-200' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-500',  text: 'text-amber-600',  ring: 'ring-amber-200' },
  green:  { bg: 'bg-green-600',  light: 'bg-green-50',  border: 'border-green-600',  text: 'text-green-600',  ring: 'ring-green-200' },
};

const PHASE_GRADIENT_MAP: Record<PhaseColor, string> = {
  blue:   'from-blue-600 to-blue-700',
  purple: 'from-purple-600 to-purple-700',
  amber:  'from-amber-500 to-amber-600',
  green:  'from-green-600 to-green-700',
};

const PHASE_LIGHT_BG_MAP: Record<PhaseColor, string> = {
  blue:   'bg-blue-50 border-blue-100',
  purple: 'bg-purple-50 border-purple-100',
  amber:  'bg-amber-50 border-amber-100',
  green:  'bg-green-50 border-green-100',
};

const PHASE_DOT_MAP: Record<PhaseColor, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
};

// ============================================================================
// 标准治疗方式
// ============================================================================
const STANDARD_TREATMENTS = [
  {
    id: 'surgery', icon: Stethoscope, title: '手术', color: 'blue',
    features: ['创伤小、恢复快、安全性高', '不仅追求生存率，更重视术后生活质量', '进食、排尿、说话等功能保护'],
    desc: '日本微创手术技术世界领先，在追求治愈的同时最大限度保护患者的生活质量。',
  },
  {
    id: 'chemo', icon: Pill, title: '化学治疗', color: 'green',
    features: ['根据患者年龄、体力、合并症调整剂量', '副作用管理非常细致', '适合高龄患者、慢性肿瘤患者'],
    desc: '不一味追求最大剂量，而是根据个体差异制定最适合的方案，把副作用降到最低。',
  },
  {
    id: 'radiation', icon: Radio, title: '放射线治疗', color: 'purple',
    features: ['质子线、重离子线治疗世界领先', '立体定向放射治疗技术成熟', '最大限度保护正常组织，减少并发症'],
    desc: '高精度放射线技术可精准打击肿瘤细胞，同时将对周围正常组织的损伤降到最低。',
  },
  {
    id: 'immune', icon: Shield, title: '免疫治疗', color: 'orange',
    features: ['严格筛选适应症', '高度警惕免疫相关不良反应', '把对正常器官的"误伤"控制到最低'],
    desc: '在发挥免疫治疗效果的同时，通过精细管理避免免疫系统攻击正常器官。',
  },
  {
    id: 'targeted', icon: Target, title: '靶向治疗', color: 'red',
    features: ['针对癌细胞特定基因进行精准治疗', '"无基因证据，不轻易用药"', '避免无效治疗和不必要副作用'],
    desc: '基于基因检测结果选择最适合的靶向药物，真正做到精准医疗。',
  },
];

// ============================================================================
// 再生医疗辅助治疗
// ============================================================================
const REGENERATIVE_TREATMENTS = [
  {
    id: 'msc', icon: Dna, title: '间充质干细胞', subtitle: 'MSC Therapy',
    purpose: '身体恢复', color: 'blue',
    features: ['抗炎与免疫调节', '化疗、放疗后的身体恢复', '促进组织再生'],
  },
  {
    id: 'exosome', icon: Atom, title: '外泌体', subtitle: 'Exosome Therapy',
    purpose: '长期健康管理', color: 'purple',
    features: ['促进细胞修复', '治疗后的长期健康管理', '抗衰老调理'],
  },
  {
    id: 'nk', icon: Shield, title: 'NK等免疫细胞', subtitle: 'NK Cell Therapy',
    purpose: '预防复发', color: 'green',
    features: ['增强机体免疫功能', '提高抗肿瘤防御能力', '预防癌症复发'],
  },
];

// ============================================================================
// 合作医疗机构类型
// ============================================================================
const PARTNER_INSTITUTIONS = [
  { icon: Building, label: '大学医院、综合医院' },
  { icon: Atom, label: '重粒子线、质子线治疗设施' },
  { icon: Stethoscope, label: '专门诊所' },
  { icon: FlaskConical, label: '再生医疗诊所' },
];

// ============================================================================
// 日本知名癌症治疗医疗机构
// ============================================================================
const JAPAN_MEDICAL_INSTITUTIONS = [
  {
    category: '关西地区癌症专门医院',
    color: 'red',
    institutions: [
      { name: '大阪国際がんセンター', nameZh: '大阪国际癌症中心', location: '大阪府大阪市中央区', website: 'https://oici.jp/', specialty: ['肺癌', '消化器癌', '乳癌', '血液肿瘤', '妇科肿瘤'], features: ['大阪府立癌症专门医院（2017年新建）', '年间手术量超 5,000 例', '最先端癌症治疗设备完备', '癌症基因组医疗核心据点', '国际患者支援窗口'], treatments: ['达芬奇机器人手术', '免疫治疗', '基因靶向治疗', '放射线治疗'] },
      { name: '兵庫県立がんセンター', nameZh: '兵库县立癌症中心', location: '兵库县明石市', website: 'https://www.hyogo-cc.jp/', specialty: ['肺癌', '消化器癌', '乳癌', '头颈部癌'], features: ['兵库县癌症治疗核心医院', '多学科协作治疗体制', '缓和医疗充实', '临床试验积极参与'], treatments: ['微创手术', '化学疗法', '放射线治疗', '缓和医疗'] },
      { name: '神戸大学医学部附属病院', nameZh: '神户大学医学部附属医院', location: '兵库县神户市', website: 'https://www.hosp.kobe-u.ac.jp/', specialty: ['肝胆胰癌', '消化器癌', '乳癌', '血液肿瘤'], features: ['神户医疗产业都市核心医院', '肝胆胰外科日本领先', '先进医疗设备完备', '国际医疗交流活跃'], treatments: ['高难度肝胆胰手术', '免疫治疗', '基因组医疗'] },
      { name: '奈良県立医科大学附属病院', nameZh: '奈良县立医科大学附属医院', location: '奈良县橿原市', website: 'https://www.naramed-u.ac.jp/hospital/', specialty: ['消化器癌', '肺癌', '妇科肿瘤', '血液肿瘤'], features: ['奈良县唯一的特定机能医院', '癌症诊疗连携据点医院', '地域医疗支援完善', '多职种团队医疗'], treatments: ['腹腔镜手术', '化学疗法', '放射线治疗'] },
      { name: '和歌山県立医科大学附属病院', nameZh: '和歌山县立医科大学附属医院', location: '和歌山县和歌山市', website: 'https://www.wakayama-med.ac.jp/hospital/', specialty: ['消化器癌', '肺癌', '乳癌', '泌尿器癌'], features: ['和歌山县癌症诊疗核心医院', '内视镜治疗技术精湛', '癌症基因组医疗据点', '缓和医疗团队完备'], treatments: ['内视镜手术', '化学疗法', '基因组医疗', '缓和医疗'] },
    ],
  },
  {
    category: '关西地区大学附属医院',
    color: 'green',
    institutions: [
      { name: '大阪大学医学部附属病院', nameZh: '大阪大学医学部附属医院', location: '大阪府吹田市', website: 'https://www.hosp.med.osaka-u.ac.jp/', specialty: ['消化器癌', '血液肿瘤', '皮肤癌'], features: ['关西地区顶级医疗机构', '光免疫疗法临床研究领先', '干细胞治疗研究先驱'], treatments: ['光免疫疗法', '再生医疗', 'CAR-T 疗法'] },
      { name: '京都大学医学部附属病院', nameZh: '京都大学医学部附属医院', location: '京都府京都市', website: 'https://www.kuhp.kyoto-u.ac.jp/', specialty: ['血液肿瘤', '消化器癌', '脑肿瘤', '乳癌'], features: ['iPS 细胞研究发源地（山中伸弥教授）', '再生医疗世界领先', '癌症基因组医疗核心据点', '关西医学研究重镇'], treatments: ['iPS 细胞治疗', '基因组医疗', 'CAR-T 疗法', '免疫治疗'] },
      { name: '近畿大学医学部附属病院', nameZh: '近畿大学医学部附属医院', location: '大阪府大阪狭山市', website: 'https://www.med.kindai.ac.jp/', specialty: ['肝癌', '肾癌', '膀胱癌', '前列腺癌'], features: ['近大医院', '泌尿器科肿瘤治疗强项', '达芬奇机器人手术经验丰富', '癌症免疫治疗研究活跃'], treatments: ['达芬奇机器人手术', '免疫检查点抑制剂', '精准放射治疗'] },
    ],
  },
  {
    category: 'BNCT 硼中子俘获治疗（关西）',
    color: 'orange',
    institutions: [
      { name: '大阪医科薬科大学病院', nameZh: '大阪医科药科大学医院', location: '大阪府高槻市', website: 'https://hospital.ompu.ac.jp/', specialty: ['头颈部癌（复发）', '脑肿瘤', '恶性黑色素瘤'], features: ['全球首个医院内设置 BNCT 设备', '对手术困难、复发癌症效果显著', '单次照射即可完成治疗'], treatments: ['BNCT 硼中子俘获治疗'] },
    ],
  },
  {
    category: '重粒子线・质子线治疗设施（关西）',
    color: 'purple',
    institutions: [
      { name: '兵庫県立粒子線医療センター', nameZh: '兵库县立粒子线医疗中心', location: '兵库县龙野市', website: 'https://www.hibmc.shingu.hyogo.jp/', specialty: ['肺癌', '肝癌', '前列腺癌', '胰脏癌'], features: ['全球首个同时拥有质子线和重粒子线的设施', '治疗适应症最广', '可根据癌症类型选择最佳粒子线'], treatments: ['质子线治疗', '重粒子线治疗'] },
    ],
  },
  {
    category: '国立癌症中心（东京）',
    color: 'blue',
    institutions: [
      { name: '国立がん研究センター中央病院', nameZh: '国立癌症研究中心中央医院', location: '东京都中央区', website: 'https://www.ncc.go.jp/jp/ncch/', specialty: ['消化器癌', '肺癌', '乳癌', '血液肿瘤'], features: ['日本癌症研究最高学府', '年手术量超 8,000 例', '最新临床试验优先参与', '多学科团队会诊制度'], treatments: ['达芬奇机器人手术', '免疫检查点抑制剂', '基因靶向治疗'] },
      { name: '国立がん研究センター東病院', nameZh: '国立癌症研究中心东医院', location: '千叶县柏市', website: 'https://www.ncc.go.jp/jp/ncce/', specialty: ['头颈部癌', '食道癌', '肝胆胰癌'], features: ['质子线治疗先驱', '头颈部癌治疗日本领先', '消化器内视镜治疗技术顶尖', '国际患者支援体制完善'], treatments: ['质子线治疗', '光免疫疗法', '内视镜黏膜下剥离术(ESD)'] },
    ],
  },
  {
    category: '首都圈大学附属医院',
    color: 'blue',
    institutions: [
      { name: '東京大学医学部附属病院', nameZh: '东京大学医学部附属医院', location: '东京都文京区', website: 'https://www.h.u-tokyo.ac.jp/', specialty: ['全科癌症', '罕见癌症', '复发难治癌症'], features: ['日本医学最高学府', '最新治疗技术临床应用', '疑难杂症诊断能力强'], treatments: ['CAR-T 细胞疗法', '精准医疗', '临床试验'] },
      { name: '慶應義塾大学病院', nameZh: '庆应义塾大学医院', location: '东京都新宿区', website: 'https://www.hosp.keio.ac.jp/', specialty: ['肺癌', '消化器癌', '妇科肿瘤'], features: ['私立医学名校附属医院', '肿瘤内科实力强劲', '国际患者接待经验丰富'], treatments: ['分子靶向治疗', '免疫治疗', '微创手术'] },
    ],
  },
  {
    category: '其他地区先进设施',
    color: 'purple',
    institutions: [
      { name: '量子科学技術研究開発機構 QST病院', nameZh: 'QST医院（原放医研）', location: '千叶县千叶市', website: 'https://www.qst.go.jp/', specialty: ['骨软部肉瘤', '头颈部癌', '前列腺癌', '肝癌'], features: ['世界重粒子线治疗发源地', '治疗经验超 14,000 例', '对放射线抵抗性癌症效果显著', '短疗程（约 3-4 周）'], treatments: ['重粒子线治疗（碳离子线）'] },
      { name: '静岡県立静岡がんセンター', nameZh: '静冈县立静冈癌症中心', location: '静冈县长泉町', website: 'https://www.scchr.jp/', specialty: ['肺癌', '食道癌', '纵隔肿瘤'], features: ['质子线治疗经验丰富', '环境优美，康复氛围佳', '多学科整合治疗'], treatments: ['质子线治疗', '立体定向放射治疗'] },
      { name: '南東北BNCT研究センター', nameZh: '南东北BNCT研究中心', location: '福岛县郡山市', website: 'https://www.southerntohoku-bnct.com/', specialty: ['头颈部癌', '脑肿瘤', '恶性黑色素瘤'], features: ['BNCT 治疗先驱机构', '加速器型 BNCT 治疗系统', '无需核反应炉，安全性高'], treatments: ['BNCT 硼中子俘获治疗'] },
    ],
  },
];

// ============================================================================
// 咨询服务（用于展示，非购买）
// ============================================================================
const CONSULTATION_SERVICES = [
  {
    title: '前期咨询服务',
    titleEn: 'Initial Consultation',
    price: 221000,
    gradient: 'from-blue-600 to-indigo-700',
    checkColor: 'text-blue-500',
    features: ['病历资料翻译（中→日）', '日本医院初步咨询', '治疗可行性评估报告', '费用概算说明'],
  },
  {
    title: '远程会诊服务',
    titleEn: 'Remote Consultation',
    price: 243000,
    gradient: 'from-purple-600 to-pink-700',
    checkColor: 'text-purple-500',
    features: ['日本专科医生视频会诊', '专业医疗翻译全程陪同', '详细治疗方案说明', '治疗费用明细报价'],
  },
];

// ============================================================================
// Main Component
// ============================================================================
export default function CancerTreatmentModule({ brandColor, brandName, contactInfo }: WhitelabelModuleProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<number>(1);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca?q=80&w=2080&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/85 to-slate-900/70" />
        </div>
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl top-1/4 -left-20" />
          <div className="absolute w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl bottom-1/4 right-10" />
        </div>
        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <HeartPulse size={16} className="text-red-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">日本癌症治疗</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              日本癌症治疗<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">五年存活率领先全球</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed max-w-2xl">
              柳叶刀研究显示日本癌症五年存活率达 <span className="text-white font-bold">57.4%</span>
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl">
              质子重离子、光免疫疗法、BNCT 硼中子俘获——世界前沿疗法汇聚日本
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => document.getElementById('cancer-contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <MessageSquare size={20} />
                咨询治疗方案
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => document.getElementById('treatment-flow')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                了解治疗流程
              </button>
            </div>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-5 py-3 rounded-full backdrop-blur-md mb-12">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
              <span className="text-amber-200 text-sm font-medium">为保证治疗品质，每月仅限 10 位患者接诊</span>
            </div>
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">74.9%</div>
                <div className="text-sm text-gray-300">胃癌五年存活率</div>
                <div className="text-xs text-gray-400 mt-1">Lancet 2018*</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">95%+</div>
                <div className="text-sm text-gray-300">前列腺癌质子治疗</div>
                <div className="text-xs text-gray-400 mt-1">五年存活率*</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">1/3</div>
                <div className="text-sm text-gray-300">费用仅为美国</div>
                <div className="text-xs text-gray-400 mt-1">参考估算</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">*数据来源：Lancet Oncology 2018; 各医疗机构公开资料。个人疗效因病情而异，仅供参考。</p>
            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">超早期精密筛查，5mm 肿瘤可检出</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">专业医疗翻译全程陪同</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">远程会诊确认后再赴日</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Japan Medical Institutions */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Japan Medical Institutions</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              日本知名癌症治疗医疗机构
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto mb-6">
              以下资讯旨在帮助您了解日本各大医疗机构的特色与先进治疗技术，供您参考选择
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg text-sm text-amber-700">
              <Info size={16} />
              <span>以下信息仅供参考，实际治疗需以医院诊断为准</span>
            </div>
          </div>
          <div className="space-y-12 max-w-6xl mx-auto">
            {JAPAN_MEDICAL_INSTITUTIONS.map((category, catIndex) => {
              const colorClasses: Record<string, { headerBg: string; headerText: string; cardBorder: string; badge: string; tagBg: string; tagText: string }> = {
                blue:   { headerBg: 'bg-blue-600',   headerText: 'text-white', cardBorder: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',     tagBg: 'bg-blue-50',   tagText: 'text-blue-600' },
                purple: { headerBg: 'bg-purple-600', headerText: 'text-white', cardBorder: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', tagBg: 'bg-purple-50', tagText: 'text-purple-600' },
                green:  { headerBg: 'bg-green-600',  headerText: 'text-white', cardBorder: 'border-green-200',  badge: 'bg-green-100 text-green-700',   tagBg: 'bg-green-50',  tagText: 'text-green-600' },
                orange: { headerBg: 'bg-orange-600', headerText: 'text-white', cardBorder: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', tagBg: 'bg-orange-50', tagText: 'text-orange-600' },
                red:    { headerBg: 'bg-red-600',    headerText: 'text-white', cardBorder: 'border-red-200',    badge: 'bg-red-100 text-red-700',       tagBg: 'bg-red-50',    tagText: 'text-red-600' },
              };
              const colors = colorClasses[category.color];
              return (
                <div key={catIndex}>
                  <div className={`${colors.headerBg} ${colors.headerText} px-6 py-4 rounded-t-2xl flex items-center gap-3`}>
                    <Award size={24} />
                    <h3 className="text-xl font-bold">{category.category}</h3>
                  </div>
                  <div className={`bg-white border-2 ${colors.cardBorder} border-t-0 rounded-b-2xl p-6`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {category.institutions.map((inst, instIndex) => (
                        <div key={instIndex} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                          <div className="mb-4">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{inst.name}</h4>
                            <p className="text-sm text-gray-500">{inst.nameZh}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                              <MapPin size={12} />
                              {inst.location}
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">擅长领域</p>
                            <div className="flex flex-wrap gap-1">
                              {inst.specialty.map((spec, i) => (
                                <span key={i} className={`${colors.badge} text-xs px-2 py-1 rounded-full`}>{spec}</span>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">机构特色</p>
                            <ul className="space-y-1">
                              {inst.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                  <CheckCircle size={14} className={`${colors.tagText} mt-0.5 flex-shrink-0`} />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">特色治疗</p>
                            <div className="flex flex-wrap gap-1">
                              {inst.treatments.map((treatment, i) => (
                                <span key={i} className={`${colors.tagBg} ${colors.tagText} text-xs px-2 py-1 rounded border border-current/20`}>{treatment}</span>
                              ))}
                            </div>
                          </div>
                          {inst.website && (
                            <a href={inst.website} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-xs ${colors.tagText} hover:underline mt-2 pt-3 border-t border-gray-200`}>
                              <ExternalLink size={12} />
                              <span>医院官网（外部链接）</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              以上资讯来源于各医疗机构公开资料，仅供患者了解日本癌症治疗资源。如需就诊，我们将根据您的病情为您推荐最适合的医疗机构。
            </p>
          </div>
        </div>
      </section>

      {/* Treatment Flow Section */}
      <section id="treatment-flow" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Treatment Process</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              癌症患者赴日治疗流程
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              从前期咨询到治疗完成，全程专业支援，让您安心治疗
            </p>
          </div>

          {/* Phase Navigation */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TREATMENT_PHASES.map((phase) => {
                const PhaseIcon = phase.icon;
                const isActive = activePhase === phase.phaseNumber;
                const c = PHASE_COLOR_MAP[phase.color];
                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.phaseNumber)}
                    className={`relative rounded-2xl p-4 text-left transition-all ${
                      isActive
                        ? `${c.light} ${c.border} border-2 shadow-md ring-4 ${c.ring}`
                        : 'bg-gray-50 border border-gray-200 hover:shadow-sm hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? c.bg : 'bg-gray-200'}`}>
                        <PhaseIcon size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <span className={`text-xs font-bold ${isActive ? c.text : 'text-gray-400'}`}>
                        PHASE {phase.phaseNumber}
                      </span>
                    </div>
                    <h3 className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {phase.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {phase.duration}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">点击阶段查看详情</p>
          </div>

          {/* Active Phase Detail */}
          {(() => {
            const phase = TREATMENT_PHASES.find(p => p.phaseNumber === activePhase)!;
            const PhaseIcon = phase.icon;
            const phaseSteps = TREATMENT_FLOW.filter(
              s => s.step >= phase.stepRange[0] && s.step <= phase.stepRange[1]
            );
            return (
              <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <div className={`bg-gradient-to-r ${PHASE_GRADIENT_MAP[phase.color]} p-6 md:p-8 text-white`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                          <PhaseIcon size={24} />
                        </div>
                        <div>
                          <div className="text-white/70 text-xs font-bold tracking-wider">PHASE {phase.phaseNumber}</div>
                          <h3 className="text-xl md:text-2xl font-bold">{phase.title}</h3>
                          <p className="text-white/80 text-sm mt-1">{phase.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                          <Clock size={14} /> {phase.duration}
                        </span>
                        {phase.feeSummary && (
                          <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                            <CreditCard size={14} /> {phase.feeSummary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 bg-white">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className={`rounded-xl p-5 border ${PHASE_LIGHT_BG_MAP[phase.color]}`}>
                        <div className="flex items-center gap-2 mb-4">
                          <Users size={18} className="text-gray-600" />
                          <h4 className="font-bold text-gray-900 text-sm">您需要做的</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.patientActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl p-5 border bg-gray-50 border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield size={18} className="text-gray-600" />
                          <h4 className="font-bold text-gray-900 text-sm">我们为您处理</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.weHandle.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sub-step Timeline */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        详细步骤
                      </h4>
                      <div className="relative">
                        <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${PHASE_DOT_MAP[phase.color]} opacity-20`} />
                        <div className="space-y-3">
                          {phaseSteps.map((step) => (
                            <div
                              key={step.step}
                              className="relative flex gap-4 group cursor-pointer"
                              onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 ${PHASE_DOT_MAP[phase.color]}`}>
                                {step.step}
                              </div>
                              <div className={`flex-grow rounded-xl p-4 border transition-all ${
                                expandedStep === step.step ? 'bg-white shadow-md border-gray-200' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-sm'
                              }`}>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="text-sm font-bold text-gray-900">{step.title}</h5>
                                      {step.fee && (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                          {step.fee}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">{step.subtitle}</p>
                                    {expandedStep === step.step && step.desc && (
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">{step.from}</span>
                                    <ArrowRight size={10} />
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">{step.to}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Standard Treatments Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-purple-600 text-xs tracking-widest uppercase font-bold">Standard Treatment</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              癌症标准治疗
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              安全性高、治疗精准、重视生活质量（QOL）、强调循证医学与多学科协作
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {STANDARD_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
                blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200' },
                green:  { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200' },
                purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
                red:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200' },
              };
              const colors = colorClasses[treatment.color];
              return (
                <div key={treatment.id} className={`bg-white rounded-2xl p-8 border ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
                  <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">{treatment.title}</h3>
                  <ul className="space-y-2 mb-4">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {treatment.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regenerative Medicine Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 text-xs tracking-widest uppercase font-bold">Regenerative Medicine</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              再生医疗等辅助治疗
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              结合最新再生医疗技术，帮助患者身体恢复并预防癌症复发
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
              <HeartPulse size={16} />
              身体恢复
            </div>
            <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">
              <Leaf size={16} />
              长期健康管理
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              <Shield size={16} />
              预防复发
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {REGENERATIVE_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { gradient: string; bg: string; text: string }> = {
                blue:   { gradient: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-50',   text: 'text-blue-600' },
                purple: { gradient: 'from-purple-500 to-pink-600',   bg: 'bg-purple-50', text: 'text-purple-600' },
                green:  { gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50',  text: 'text-green-600' },
              };
              const colors = colorClasses[treatment.color];
              return (
                <div key={treatment.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon size={32} />
                  </div>
                  <div className={`inline-block ${colors.bg} ${colors.text} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                    {treatment.purpose}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">{treatment.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{treatment.subtitle}</p>
                  <ul className="space-y-2">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Institutions */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">可协助咨询的医疗机构类型</h2>
            <p className="text-gray-300">涵盖日本各类顶尖癌症治疗设施</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {PARTNER_INSTITUTIONS.map((inst, i) => {
              const Icon = inst.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-sm text-white/90">{inst.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Overview (replaced Stripe with contact CTA) */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Book Service</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
                咨询服务预约
              </h2>
              <p className="text-gray-500 mb-4">
                选择您需要的服务，我们将在 24 小时内与您联系
              </p>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-amber-700 text-sm">每月仅限 10 位 · 名额有限</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {CONSULTATION_SERVICES.map((svc, idx) => (
                <div key={idx} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group">
                  <div className={`bg-gradient-to-r ${svc.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{svc.title}</h3>
                        <p className="text-white/70 text-sm">{svc.titleEn}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">¥{svc.price.toLocaleString()}</p>
                        <p className="text-xs text-white/70">日元（含税）</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      {svc.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={14} className={`${svc.checkColor} mt-0.5 flex-shrink-0`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => document.getElementById('cancer-contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`block w-full py-3 bg-gradient-to-r ${svc.gradient} text-white text-center font-bold rounded-xl hover:opacity-90 transition shadow-lg`}
                    >
                      立即咨询
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">会员体系说明</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    癌症治疗咨询服务与 TIMC 体检服务共用同一会员体系。购买任一服务后，您将自动成为 NIIJIMA 会员，可在「我的订单」中查看所有预约记录，并享受会员专属服务。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <div id="cancer-contact">
        <WhitelabelContactSection
          brandColor={brandColor}
          brandName={brandName}
          contactInfo={contactInfo}
        />
      </div>
    </div>
  );
}
