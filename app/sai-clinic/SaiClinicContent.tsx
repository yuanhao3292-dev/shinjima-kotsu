'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, CheckCircle, MapPin, Sparkles, Heart,
  Shield, Clock, Star, ChevronDown, Scissors, Syringe,
  Pill, Droplets, Train, Phone, MessageCircle, Globe, Users,
  Stethoscope,
} from 'lucide-react';
import ContactButtons from '@/components/ContactButtons';
import type { SaiClinicImage } from '@/lib/services/sai-clinic-images';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Translation helper function
const t = (translations: Record<Language, string>, lang: Language): string => translations[lang];

// ━━━━━━━━ 静态 fallback 图片（数据库不可用时使用） ━━━━━━━━

const SAI = 'https://saicli.jp/wp-content/themes/initializr/img';
const SAI_UP = 'https://saicli.jp/wp-content/uploads';

const FALLBACK_IMAGES: SaiClinicImage[] = [
  { id: 'f-h1', category: 'hero', src: `${SAI}/topFvImg01.jpg`, alt: 'SAI CLINIC 大阪梅田 - 院内環境', label: '院内大厅', display_order: 1, metadata: { usage: 'hero_background' } },
  { id: 'f-h2', category: 'hero', src: `${SAI}/topFvImg02.jpg`, alt: '崔煌植医生施术中', label: '施术中', display_order: 2, metadata: { usage: 'hero_grid' } },
  { id: 'f-h3', category: 'hero', src: `${SAI}/topFvImg03.jpg`, alt: 'SAI CLINIC 院内', label: '院内', display_order: 3, metadata: { usage: 'hero_grid' } },
  { id: 'f-h4', category: 'hero', src: `${SAI}/topFvImg04.jpg`, alt: 'SAI CLINIC', label: 'CTA背景', display_order: 4, metadata: { usage: 'cta_background' } },
  { id: 'f-h5', category: 'hero', src: `${SAI}/topFvImg06.jpg`, alt: 'SAI CLINIC', label: '流程背景', display_order: 5, metadata: { usage: 'flow_background' } },
  { id: 'f-g1', category: 'gallery', src: `${SAI}/aboutGalleryImg1.jpg`, alt: 'SAI CLINIC 接待大厅', label: '接待大厅', display_order: 1, metadata: null },
  { id: 'f-g2', category: 'gallery', src: `${SAI}/aboutGalleryImg2.jpg`, alt: 'SAI CLINIC 候诊区域', label: '候诊区域', display_order: 2, metadata: null },
  { id: 'f-g3', category: 'gallery', src: `${SAI}/aboutGalleryImg3.jpg`, alt: 'SAI CLINIC 咨询室', label: '咨询室', display_order: 3, metadata: null },
  { id: 'f-g4', category: 'gallery', src: `${SAI}/aboutGalleryImg4.jpg`, alt: 'SAI CLINIC 治疗室', label: '治疗室', display_order: 4, metadata: null },
  { id: 'f-g5', category: 'gallery', src: `${SAI}/aboutGalleryImg5.jpg`, alt: 'SAI CLINIC 化妆间', label: '化妆间', display_order: 5, metadata: null },
  { id: 'f-g6', category: 'gallery', src: `${SAI}/aboutGalleryImg6.jpg`, alt: 'SAI CLINIC 手术室', label: '手术室', display_order: 6, metadata: null },
  { id: 'f-g7', category: 'gallery', src: `${SAI}/aboutGalleryImg7.jpg`, alt: 'SAI CLINIC 恢复室', label: '恢复室', display_order: 7, metadata: null },
  { id: 'f-g8', category: 'gallery', src: `${SAI}/aboutGalleryImg8.jpg`, alt: 'SAI CLINIC 入口', label: '诊所入口', display_order: 8, metadata: null },
  { id: 'f-g9', category: 'gallery', src: `${SAI}/aboutGalleryImg9.jpg`, alt: 'SAI CLINIC 走廊', label: '诊所走廊', display_order: 9, metadata: null },
  { id: 'f-c1', category: 'case', src: `${SAI_UP}/2025/05/SAI_PH_threadlift_009-01-819x1024.jpg`, alt: '40代女性 糸リフト+ヒアルロン酸', label: '40代女性', display_order: 1, metadata: { title: '40代女性 · 糸リフト+ヒアルロン酸', desc: 'SAI LIFT STANDARD + 法令纹玻尿酸注射。自然的提升效果，法令纹明显改善。' } },
  { id: 'f-c2', category: 'case', src: `${SAI_UP}/2025/08/SAI_PH_threadlift_001-01-819x1024.jpg`, alt: '50代女性 糸リフト', label: '50代女性', display_order: 2, metadata: { title: '50代女性 · 糸リフト', desc: 'SAI LIFT PERFECT 全脸线雕提升。显著改善面部松弛，恢复年轻轮廓。' } },
  { id: 'f-c3', category: 'case', src: `${SAI_UP}/2025/11/SAI_threadlift_006-01-819x1024.jpg`, alt: '50代女性 糸リフト+脂肪溶解', label: '50代女性', display_order: 3, metadata: { title: '50代女性 · 糸リフト+脂肪溶解', desc: '线雕提升 + 面部吸脂。V脸效果明显，下颚线条更加紧致。' } },
  { id: 'f-d1', category: 'doctor', src: `${SAI}/doctor.jpg`, alt: '崔煌植 院長', label: '院長头像', display_order: 1, metadata: { usage: 'avatar' } },
  { id: 'f-d2', category: 'doctor', src: `${SAI}/sign.png`, alt: '崔煌植 签名', label: '签名', display_order: 2, metadata: { usage: 'signature' } },
  { id: 'f-d3', category: 'doctor', src: `${SAI}/a-reccoImg.jpg`, alt: '推薦', label: '推薦头像', display_order: 3, metadata: { usage: 'recommend' } },
  { id: 'f-f1', category: 'feature', src: `${SAI}/topFeatureImg01.jpg`, alt: '糸リフト专门诊所', label: '糸リフト专门', display_order: 1, metadata: { title: '糸リフト专门诊所' } },
  { id: 'f-f2', category: 'feature', src: `${SAI}/topFeatureImg02.jpg`, alt: '韩式美学·日本品质', label: '韩式美学', display_order: 2, metadata: { title: '韩式美学·日本品质' } },
  { id: 'f-f3', category: 'feature', src: `${SAI}/aboutFeatureItem2.jpg`, alt: '内外兼修·个性定制', label: '内外兼修', display_order: 3, metadata: { title: '内外兼修·个性定制' } },
  { id: 'f-cp1', category: 'concept', src: `${SAI}/aboutConcept1.jpg`, alt: 'SAI CLINIC 施術風景', label: '施术风景', display_order: 1, metadata: null },
  { id: 'f-cp2', category: 'concept', src: `${SAI}/aboutConcept2.jpg`, alt: '抗衰老专门', label: '抗衰老专门', display_order: 2, metadata: null },
  { id: 'f-cp3', category: 'concept', src: `${SAI}/aboutConcept3.jpg`, alt: '韩式美学', label: '韩式美学', display_order: 3, metadata: null },
  { id: 'f-cp4', category: 'concept', src: `${SAI}/aboutConcept4.jpg`, alt: '个性化方案', label: '个性化方案', display_order: 4, metadata: null },
  { id: 'f-t1', category: 'threadlift', src: `${SAI_UP}/2025/06/sai_threadlift_title.jpg`, alt: 'SAI LIFT 糸リフト', label: '糸リフト hero', display_order: 1, metadata: null },
];

// ━━━━━━━━ 套餐数据 ━━━━━━━━

const THREAD_LIFT_PACKAGES = [
  {
    slug: 'sai-lift-try',
    name: { ja: 'SAI LIFT TRY', 'zh-CN': '体验版糸リフト', 'zh-TW': '體驗版糸リフト', en: 'SAI LIFT TRY' } as Record<Language, string>,
    price: 380000,
    features: [
      { ja: '初回体験推奨', 'zh-CN': '初次体验推荐', 'zh-TW': '初次體驗推薦', en: 'First-time recommended' } as Record<Language, string>,
      { ja: '自然な引き上げ効果', 'zh-CN': '自然提升效果', 'zh-TW': '自然提升效果', en: 'Natural lifting' } as Record<Language, string>,
      { ja: '術後回復が早い', 'zh-CN': '术后恢复快', 'zh-TW': '術後恢復快', en: 'Quick recovery' } as Record<Language, string>,
      { ja: '術後診察含む', 'zh-CN': '含术后回诊', 'zh-TW': '含術後回診', en: 'Includes follow-up' } as Record<Language, string>,
    ],
    color: 'rose',
  },
  {
    slug: 'sai-lift-standard',
    name: { ja: 'SAI LIFT STANDARD', 'zh-CN': '标准版糸リフト', 'zh-TW': '標準版糸リフト', en: 'SAI LIFT STANDARD' } as Record<Language, string>,
    price: 680000,
    features: [
      { ja: '人気No.1', 'zh-CN': '高人气选择', 'zh-TW': '高人氣選擇', en: 'Most popular' } as Record<Language, string>,
      { ja: '明らかな引き上げ効果', 'zh-CN': '明显提升效果', 'zh-TW': '明顯提升效果', en: 'Noticeable lifting' } as Record<Language, string>,
      { ja: 'コラーゲン再生促進', 'zh-CN': '刺激胶原再生', 'zh-TW': '刺激膠原再生', en: 'Stimulates collagen' } as Record<Language, string>,
      { ja: '効果12-18ヶ月持続', 'zh-CN': '效果持续12-18个月', 'zh-TW': '效果持續12-18個月', en: 'Lasts 12-18 months' } as Record<Language, string>,
      { ja: '術後診察含む', 'zh-CN': '含术后回诊', 'zh-TW': '含術後回診', en: 'Includes follow-up' } as Record<Language, string>,
    ],
    color: 'purple',
    popular: true,
  },
  {
    slug: 'sai-lift-perfect',
    name: { ja: 'SAI LIFT PERFECT', 'zh-CN': '完美版糸リフト', 'zh-TW': '完美版糸リフト', en: 'SAI LIFT PERFECT' } as Record<Language, string>,
    price: 980000,
    features: [
      { ja: '最強引き上げ効果', 'zh-CN': '最强提升效果', 'zh-TW': '最強提升效果', en: 'Maximum lifting' } as Record<Language, string>,
      { ja: '全顔総合改善', 'zh-CN': '全脸全方位改善', 'zh-TW': '全臉全方位改善', en: 'Full-face enhancement' } as Record<Language, string>,
      { ja: '最長持続期間', 'zh-CN': '最长持效期', 'zh-TW': '最長持效期', en: 'Longest duration' } as Record<Language, string>,
      { ja: '術後1年以内再診割引', 'zh-CN': '术后1年内复诊优惠', 'zh-TW': '術後1年內復診優惠', en: '1-year follow-up discount' } as Record<Language, string>,
      { ja: 'VIP専属サービス', 'zh-CN': 'VIP专属服务', 'zh-TW': 'VIP專屬服務', en: 'VIP exclusive service' } as Record<Language, string>,
    ],
    color: 'amber',
    flagship: true,
  },
];

const COMBO_PACKAGES = [
  { slug: 'sai-nasolabial-set', name: { ja: 'ほうれい線セット', 'zh-CN': '法令纹改善套餐', 'zh-TW': '法令紋改善套餐', en: 'Nasolabial Fold Set' } as Record<Language, string>, price: 378000, desc: { ja: '糸リフト + ヒアルロン酸注射', 'zh-CN': '糸リフト + 玻尿酸注射，针对法令纹的综合解决方案', 'zh-TW': '糸リフト + 玻尿酸注射，針對法令紋的綜合解決方案', en: 'Thread lift + hyaluronic acid injection for nasolabial folds' } as Record<Language, string> },
  { slug: 'sai-vline-set', name: { ja: 'V-Lineセット', 'zh-CN': 'V脸线条套餐', 'zh-TW': 'V臉線條套餐', en: 'V-Line Set' } as Record<Language, string>, price: 496000, desc: { ja: '脂肪溶解 + 糸リフト', 'zh-CN': '精准脂肪溶解 + 线雕提升，打造理想V脸线条', 'zh-TW': '精準脂肪溶解 + 線雕提升，打造理想V臉線條', en: 'Fat dissolving + thread lift for ideal V-line' } as Record<Language, string> },
  { slug: 'sai-neck-set', name: { ja: '首シワセット', 'zh-CN': '颈纹改善套餐', 'zh-TW': '頸紋改善套餐', en: 'Neck Wrinkle Set' } as Record<Language, string>, price: 378000, desc: { ja: '糸リフト + ヒアルロン酸', 'zh-CN': '糸リフト + 玻尿酸，有效改善颈部细纹和松弛', 'zh-TW': '糸リフト + 玻尿酸，有效改善頸部細紋和鬆弛', en: 'Thread lift + hyaluronic acid for neck wrinkles' } as Record<Language, string> },
  { slug: 'sai-eye-fatigue-set', name: { ja: '目元セット', 'zh-CN': '眼周疲劳改善套餐', 'zh-TW': '眼周疲勞改善套餐', en: 'Eye Rejuvenation Set' } as Record<Language, string>, price: 378000, desc: { ja: '目元総合若返り', 'zh-CN': '针对眼周暗沉、细纹的综合年轻化方案', 'zh-TW': '針對眼周暗沉、細紋的綜合年輕化方案', en: 'Comprehensive eye rejuvenation for dark circles and fine lines' } as Record<Language, string> },
];

const EYE_PACKAGES = [
  { slug: 'sai-double-eyelid', name: { ja: '二重埋没法', 'zh-CN': '自然双眼皮', 'zh-TW': '自然雙眼皮', en: 'Natural Double Eyelid' } as Record<Language, string>, price: 300000, desc: { ja: '埋没法・1年保証', 'zh-CN': '微创埋线法，自然双眼皮效果，1年保障', 'zh-TW': '微創埋線法，自然雙眼皮效果，1年保障', en: 'Minimally invasive suture method, 1-year guarantee' } as Record<Language, string> },
  { slug: 'sai-double-eyelid-premium', name: { ja: '6点連続法', 'zh-CN': '精致双眼皮（6点连续法）', 'zh-TW': '精緻雙眼皮（6點連續法）', en: 'Premium Double Eyelid (6-point)' } as Record<Language, string>, price: 580000, desc: { ja: '6点連続縫合・5年保証', 'zh-CN': '6点连续缝合法，精致持久，5年保障', 'zh-TW': '6點連續縫合法，精緻持久，5年保障', en: '6-point continuous suture, delicate & lasting, 5-year guarantee' } as Record<Language, string> },
  { slug: 'sai-under-eye-reversehamra', name: { ja: '裏ハムラ法', 'zh-CN': '黑眼圈·眼袋去除', 'zh-TW': '黑眼圈·眼袋去除', en: 'Under-Eye Bags Removal' } as Record<Language, string>, price: 880000, desc: { ja: '裏ハムラ法・眼袋除去', 'zh-CN': 'Reverse Hamra法，去除眼袋+脂肪重新分配，根本解决黑眼圈', 'zh-TW': 'Reverse Hamra法，去除眼袋+脂肪重新分配，根本解決黑眼圈', en: 'Reverse Hamra method: bag removal + fat redistribution' } as Record<Language, string> },
];

const NOSE_PACKAGES = [
  { slug: 'sai-nose-thread', name: { ja: 'SAI LIFT NOSE 8本', 'zh-CN': '线雕隆鼻（8线）', 'zh-TW': '線雕隆鼻（8線）', en: 'Nose Thread Lift (8 threads)' } as Record<Language, string>, price: 560000, desc: { ja: '8本専用鼻糸', 'zh-CN': '8根专用隆鼻线，自然挺拔鼻型，无需开刀', 'zh-TW': '8根專用隆鼻線，自然挺拔鼻型，無需開刀', en: '8 specialized nose threads, natural & defined, no surgery' } as Record<Language, string> },
  { slug: 'sai-nose-implant', name: { ja: 'プロテーゼ隆鼻', 'zh-CN': '硅胶隆鼻', 'zh-TW': '矽膠隆鼻', en: 'Silicone Rhinoplasty' } as Record<Language, string>, price: 480000, desc: { ja: 'シリコンプロテーゼ', 'zh-CN': '硅胶假体隆鼻，永久效果，自然手感', 'zh-TW': '矽膠假體隆鼻，永久效果，自然手感', en: 'Silicone implant rhinoplasty, permanent result, natural feel' } as Record<Language, string> },
];

const INJECTABLE_PACKAGES = [
  { slug: 'sai-botox-full-face', name: { ja: 'ボトックス全顔', 'zh-CN': 'Allergan全脸肉毒素', 'zh-TW': 'Allergan全臉肉毒素', en: 'Allergan Full Face Botox' } as Record<Language, string>, price: 240000, desc: { ja: 'Allergan 100単位', 'zh-CN': 'Allergan正品100单位，全脸抗皱除纹', 'zh-TW': 'Allergan正品100單位，全臉抗皺除紋', en: 'Allergan 100 units, full-face anti-wrinkle' } as Record<Language, string> },
  { slug: 'sai-hyaluronic-1cc', name: { ja: 'ヒアルロン酸1cc', 'zh-CN': '玻尿酸注射（1cc）', 'zh-TW': '玻尿酸注射（1cc）', en: 'Hyaluronic Acid Injection (1cc)' } as Record<Language, string>, price: 148000, desc: { ja: 'プレミアムヒアルロン酸', 'zh-CN': '高端玻尿酸填充，精准塑形', 'zh-TW': '高端玻尿酸填充，精準塑形', en: 'Premium hyaluronic acid filler, precise contouring' } as Record<Language, string> },
  { slug: 'sai-skin-rejuvenation', name: { ja: '水光注射+幹細胞', 'zh-CN': '肌肤再生·水光注射', 'zh-TW': '肌膚再生·水光注射', en: 'Skin Rejuvenation · Aqua Glow' } as Record<Language, string>, price: 304000, desc: { ja: '水光注射 + 幹細胞エッセンス', 'zh-CN': '水光注射 + 干细胞精华，深层修复再生', 'zh-TW': '水光注射 + 幹細胞精華，深層修復再生', en: 'Aqua glow injection + stem cell essence, deep repair & regeneration' } as Record<Language, string> },
  { slug: 'sai-exosome-therapy', name: { ja: 'エクソソーム療法', 'zh-CN': '干细胞外泌体疗法', 'zh-TW': '幹細胞外泌體療法', en: 'Exosome Therapy' } as Record<Language, string>, price: 760000, desc: { ja: '新鮮幹細胞エクソソーム（2-3回）', 'zh-CN': '新鲜干细胞外泌体（2-3次疗程），最前沿再生医疗', 'zh-TW': '新鮮幹細胞外泌體（2-3次療程），最前沿再生醫療', en: 'Fresh stem cell exosomes (2-3 sessions), cutting-edge regenerative medicine' } as Record<Language, string> },
];

const FAT_PACKAGES = [
  { slug: 'sai-fat-grafting-face', name: { ja: '全顔脂肪注入', 'zh-CN': '全脸脂肪填充', 'zh-TW': '全臉脂肪填充', en: 'Full Face Fat Grafting' } as Record<Language, string>, price: 1760000, desc: { ja: '自己脂肪採取+全顔無制限注入', 'zh-CN': '自体脂肪提取+全脸无限注入，永久自然的面部年轻化', 'zh-TW': '自體脂肪提取+全臉無限注入，永久自然的面部年輕化', en: 'Autologous fat extraction + unlimited full-face injection, permanent natural rejuvenation' } as Record<Language, string> },
  { slug: 'sai-liposuction-face', name: { ja: '脂肪吸引（2部位）', 'zh-CN': '面部吸脂（双区）', 'zh-TW': '面部吸脂（雙區）', en: 'Facial Liposuction (2 areas)' } as Record<Language, string>, price: 480000, desc: { ja: '頬+顎下 脂肪吸引', 'zh-CN': '精准面部吸脂（颊部+下颚），永久减脂不反弹', 'zh-TW': '精準面部吸脂（頰部+下顎），永久減脂不反彈', en: 'Precise facial liposuction (cheeks + jawline), permanent fat reduction' } as Record<Language, string> },
];

const WELLNESS_PACKAGES = [
  { slug: 'sai-nutrition-perfect', name: { ja: 'パーフェクト栄養解析', 'zh-CN': '精密营养分析套餐', 'zh-TW': '精密營養分析套餐', en: 'Perfect Nutrition Analysis' } as Record<Language, string>, price: 118000, desc: { ja: '82項目血液検査+栄養解析', 'zh-CN': '82项血液检测+专业营养分析，定制个人健康方案', 'zh-TW': '82項血液檢測+專業營養分析，定制個人健康方案', en: '82-item blood test + professional nutrition analysis, personalized health plan' } as Record<Language, string> },
  { slug: 'sai-vitamin-c-drip', name: { ja: '高濃度ビタミンC点滴', 'zh-CN': '高浓度维C点滴（20g）', 'zh-TW': '高濃度維C點滴（20g）', en: 'High-Dose Vitamin C Drip (20g)' } as Record<Language, string>, price: 26000, desc: { ja: '高濃度ビタミンC 20g', 'zh-CN': '超高浓度维生素C静脉注射，美白·抗氧化·免疫力提升', 'zh-TW': '超高濃度維生素C靜脈注射，美白·抗氧化·免疫力提升', en: 'Ultra-high dose vitamin C IV, whitening · antioxidant · immune boost' } as Record<Language, string> },
];

// ━━━━━━━━ 全部菜单价格表（展示用，非套餐）━━━━━━━━

const FULL_MENU = {
  surgery: {
    title: { ja: '美容外科', 'zh-CN': '美容外科', 'zh-TW': '美容外科', en: 'Aesthetic Surgery' } as Record<Language, string>,
    icon: <Scissors size={20} />,
    items: [
      { name: 'SAI LIFT TRY（糸リフト体验）', price: 380000 },
      { name: 'SAI LIFT STANDARD（糸リフト标准）', price: 680000 },
      { name: 'SAI LIFT PERFECT（糸リフト完美）', price: 980000 },
      { name: 'SAI LIFT COLLAGEN', price: 280000 },
      { name: '法令纹套餐（糸+玻尿酸）', price: 378000 },
      { name: 'V脸套餐', price: 496000 },
      { name: '颈纹套餐', price: 378000 },
      { name: '眼周疲劳套餐', price: 378000 },
      { name: '脂肪吸引注射（颊部）', price: 320000 },
      { name: '脂肪吸引注射（下颚）', price: 320000 },
      { name: '脂肪吸引注射（双区）', price: 480000 },
      { name: '自体脂肪注入（提取+准备）', price: 380000 },
      { name: '脂肪注入·额头', price: 500000 },
      { name: '脂肪注入·太阳穴', price: 320000 },
      { name: '脂肪注入·全脸无限', price: 1760000 },
      { name: '自然双眼皮（埋没法·1年保障）', price: 300000 },
      { name: '双眼皮4点连续法（3年保障）', price: 440000 },
      { name: '双眼皮6点连续法（5年保障）', price: 580000 },
      { name: '全切开双眼皮', price: 640000 },
      { name: '上眼睑脂肪去除', price: 280000 },
      { name: '眼睑下垂矫正', price: 420000 },
      { name: '开眼角（Z法）', price: 440000 },
      { name: '开眼角（韩式）', price: 500000 },
      { name: '眉下提升', price: 700000 },
      { name: '黑眼圈·脂肪去除', price: 440000 },
      { name: '黑眼圈·Reverse Hamra', price: 880000 },
      { name: '黑眼圈·Open Hamra', price: 1080000 },
      { name: '黑眼圈·皮肤切除', price: 660000 },
      { name: 'SAI LIFT NOSE（4线）', price: 320000 },
      { name: 'SAI LIFT NOSE（8线）', price: 560000 },
      { name: '硅胶隆鼻', price: 480000 },
      { name: '缩鼻翼', price: 540000 },
      { name: '人中缩短', price: 700000 },
    ],
  },
  injection: {
    title: { ja: '美容皮膚科（注射）', 'zh-CN': '注射美容', 'zh-TW': '注射美容', en: 'Injectable Treatments' } as Record<Language, string>,
    icon: <Syringe size={20} />,
    items: [
      { name: 'Allergan肉毒素·单部位', price: 36000 },
      { name: 'Allergan肉毒素·咬肌（标准）', price: 88000 },
      { name: 'Allergan肉毒素·咬肌（加强）', price: 160000 },
      { name: 'Allergan肉毒素·全脸50单位', price: 140000 },
      { name: 'Allergan肉毒素·全脸100单位', price: 240000 },
      { name: 'Allergan肉毒素·腋下止汗', price: 116000 },
      { name: 'Botulax·单部位', price: 14000 },
      { name: 'Botulax·咬肌（标准）', price: 36000 },
      { name: 'Botulax·全脸50单位', price: 64000 },
      { name: 'Botulax·全脸100单位', price: 116000 },
      { name: '玻尿酸（Juvéderm系列·1cc）', price: 148000 },
      { name: '玻尿酸溶解', price: 60000 },
      { name: 'Jalupro肌育注射', price: 166000 },
      { name: 'SNEKOS', price: 66000 },
      { name: '水光注射（基础）', price: 118000 },
      { name: '水光+肉毒素', price: 226000 },
      { name: '水光+干细胞', price: 304000 },
      { name: '水光+肉毒素+干细胞', price: 378000 },
      { name: '干细胞外泌体（冻干）', price: 186000 },
      { name: '干细胞外泌体（新鲜·2-3次）', price: 760000 },
      { name: '脂肪溶解注射 Fat X Core（/cc）', price: 16000 },
    ],
  },
  skincare: {
    title: { ja: '美容皮膚科（施術）', 'zh-CN': '皮肤管理', 'zh-TW': '皮膚管理', en: 'Skincare Treatments' } as Record<Language, string>,
    icon: <Droplets size={20} />,
    items: [
      { name: 'LDM 水玉提升·面部', price: 42000 },
      { name: 'LDM+干细胞·面部', price: 52000 },
      { name: 'LDM+干细胞·面部+颈部', price: 66000 },
      { name: 'Shopping Lift 20线', price: 84000 },
      { name: 'Shopping Lift 40线', price: 156000 },
      { name: 'Shopping Lift 60线', price: 236000 },
      { name: 'Shopping Lift 100线', price: 396000 },
      { name: 'Reverse Peel', price: 36000 },
      { name: 'Milano Repeel', price: 30000 },
      { name: 'Massage Peel', price: 30000 },
    ],
  },
  wellness: {
    title: { ja: '美容内科', 'zh-CN': '美容内科', 'zh-TW': '美容內科', en: 'Wellness & IV Therapy' } as Record<Language, string>,
    icon: <Pill size={20} />,
    items: [
      { name: '营养分析·简易版（34项）', price: 44000 },
      { name: '营养分析·标准版（64项）', price: 90000 },
      { name: '营养分析·完整版（82项）', price: 118000 },
      { name: '美白点滴（600mg）', price: 12000 },
      { name: '美白点滴（1200mg）', price: 18000 },
      { name: '高浓度维C点滴（10g）', price: 14000 },
      { name: '高浓度维C点滴（20g）', price: 26000 },
      { name: '高浓度维C点滴（30g）', price: 38000 },
      { name: '燃脂点滴', price: 18000 },
      { name: '疲劳恢复点滴', price: 14000 },
      { name: '医师定制点滴', price: 50000 },
      { name: '外泌体点滴（冻干）', price: 166000 },
      { name: '外泌体点滴（新鲜）', price: 700000 },
    ],
  },
  hairloss: {
    title: { ja: '薄毛治療・AGA', 'zh-CN': '生发治疗', 'zh-TW': '生髮治療', en: 'Hair Loss Treatment' } as Record<Language, string>,
    icon: <Sparkles size={20} />,
    items: [
      { name: '生发鸡尾酒注射（前/中/顶）', price: 116000 },
      { name: '生发鸡尾酒注射（全头）', price: 220000 },
      { name: '外泌体头皮注射（冻干）', price: 178000 },
      { name: '外泌体头皮注射（新鲜）', price: 700000 },
      { name: '生发营养套装（/月）', price: 50760 },
      { name: '非那雄胺（/月）', price: 19600 },
    ],
  },
};

// ━━━━━━━━ 客户评价 ━━━━━━━━

const REVIEWS = [
  { name: 'W 女士', loc: '上海', treatment: 'SAI LIFT STANDARD', date: '2025年10月', text: '做了线雕提升，效果非常自然。崔医生很有经验，整个过程很安心。术后恢复也很快，朋友都说我气色变好了但看不出做了手术。', stars: 5 },
  { name: 'C 小姐', loc: '台北', treatment: '双眼皮+法令纹', date: '2025年9月', text: '从台北专程来大阪，崔医生的审美很棒，非常自然的风格。诊所在梅田地下街直结，下雨天也完全不用淋雨，交通太方便了。', stars: 5 },
  { name: 'L 先生', loc: '深圳', treatment: '玻尿酸+肉毒素', date: '2025年11月', text: '第一次在日本做医美，原本很紧张。好在全程有中文陪诊，医生也非常耐心地解释了所有细节。体验比预期好很多。', stars: 5 },
  { name: 'Z 女士', loc: '香港', treatment: 'SAI LIFT PERFECT', date: '2025年8月', text: '试过其他诊所的线雕，这里的提升效果确实更好。崔医生会根据面部特征做个性化设计，不是千篇一律的方案。', stars: 5 },
  { name: 'H 小姐', loc: '北京', treatment: '水光+干细胞', date: '2025年12月', text: '做了水光注射加干细胞精华，皮肤状态明显改善。崔医生还做了营养分析，建议从内到外调理，很专业。', stars: 4 },
  { name: 'L 先生', loc: '新竹', treatment: 'AGA生发治疗', date: '2025年11月', text: '之前纠结了很久，来了之后崔医生给了很中肯的建议，没有过度推销。鸡尾酒注射三次后头发确实变浓密了。', stars: 5 },
];

// ━━━━━━━━ FAQ ━━━━━━━━

const FAQ = [
  { q: '诊疗需要预约吗？', a: 'SAI CLINIC采用完全预约制。可通过我们的预约系统或LINE进行预约。如需当日预约，请电话联系。' },
  { q: '中文服务是否可用？', a: '崔医生精通多国语言，我们也提供中文翻译服务。从咨询到术后回诊，确保全程无语言障碍。' },
  { q: '支付方式有哪些？', a: '支持现金、各大信用卡（Visa/Mastercard/JCB/Amex）以及在线支付。大额手术可提供医疗分期。' },
  { q: '线雕手术后多久能正常活动？', a: '线雕术后当天即可正常活动，约1-2周轻微肿胀消退。建议术后1周避免剧烈运动和大幅度面部表情。' },
  { q: '手术效果能维持多久？', a: '线雕效果通常维持12-18个月，随着胶原蛋白持续再生，部分效果可持续更久。注射类项目根据产品不同，效果维持3-12个月。' },
  { q: '来大阪做医美需要多长时间？', a: '大部分注射类项目当天即可完成。线雕手术建议预留2-3天（含咨询日和术后回诊）。开刀手术需根据具体项目安排，一般3-5天。' },
  { q: '线上咨询是否可用？', a: '可以。对于远距离的客人，我们提供线上视频咨询服务。咨询后可直接预约来院日期。' },
];

// ━━━━━━━━ 组件 ━━━━━━━━

interface SaiClinicContentProps {
  isGuideEmbed?: boolean;
  images?: SaiClinicImage[] | null;
}

export default function SaiClinicContent({ isGuideEmbed, images }: SaiClinicContentProps) {
  const lang = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuTab, setMenuTab] = useState<string>('surgery');

  const formatPrice = (price: number) => `¥${price.toLocaleString()}`;
  const getRefPrice = (price: number) => Math.ceil(price * 1.3 / 10000) * 10000;

  const checkoutBase = '/sai-clinic';

  // ━━━━━━━━ 图片查询工具（从 DB 或 fallback） ━━━━━━━━
  const allImages = images && images.length > 0 ? images : FALLBACK_IMAGES;

  const imgsByCategory = (cat: string) =>
    allImages.filter((i) => i.category === cat).sort((a, b) => a.display_order - b.display_order);

  const imgByUsage = (usage: string) =>
    allImages.find((i) => i.metadata?.usage === usage);

  const heroImages = imgsByCategory('hero');
  const galleryImages = imgsByCategory('gallery');
  const caseImages = imgsByCategory('case');
  const doctorImages = imgsByCategory('doctor');
  const featureImages = imgsByCategory('feature');
  const conceptImages = imgsByCategory('concept');
  const threadliftImages = imgsByCategory('threadlift');

  const heroBg = imgByUsage('hero_background') || heroImages[0];
  const ctaBg = imgByUsage('cta_background') || heroImages[3];
  const flowBg = imgByUsage('flow_background') || heroImages[4];
  const doctorAvatar = imgByUsage('avatar') || doctorImages[0];
  const doctorSign = imgByUsage('signature') || doctorImages[1];
  const recommendImg = imgByUsage('recommend') || doctorImages[2];
  const heroGridImages = heroImages.filter((i) => i.metadata?.usage === 'hero_grid');
  const galleryEntrance = galleryImages.find((i) => i.label === '诊所入口') || galleryImages[7];

  // ━━━━━━━━ UI翻译 ━━━━━━━━
  const TR = {
    heroSlogan: { ja: '大阪で、より美しい自分に出会う', 'zh-CN': '在大阪，遇见更美的自己', 'zh-TW': '在大阪，遇見更美的自己', en: 'Meet a more beautiful you in Osaka' } as Record<Language, string>,
    heroDesc: { ja: '糸リフトを中心に、韓国最先端美学と日本精密医療を融合。崔煌植医師が直接診察、15年以上の経験、2,800名以上の華僑客様から信頼。全て中文サービス、安心の美容旅。', 'zh-CN': '以糸リフト（线雕提升）为核心，融合韩国前沿美学与日本精密医疗。崔煌植医生亲诊，15年经验、2,800+华人客户信赖。全程中文服务，让变美之旅安心无忧。', 'zh-TW': '以糸リフト（線雕提升）為核心，融合韓國前沿美學與日本精密醫療。崔煌植醫生親診，15年經驗、2,800+華人客戶信賴。全程中文服務，讓變美之旅安心無憂。', en: 'Centered on thread lift, combining Korean cutting-edge aesthetics with Japanese precision medicine. Dr. Sai Koshoku personally diagnoses, 15+ years experience, trusted by 2,800+ Chinese clients. Full Chinese service for a worry-free beauty journey.' } as Record<Language, string>,
    tag1: { ja: '糸リフト専門', 'zh-CN': '糸リフト专门', 'zh-TW': '糸リフト專門', en: 'Thread Lift Specialist' } as Record<Language, string>,
    tag2: { ja: '韓国美学', 'zh-CN': '韩式美学', 'zh-TW': '韓式美學', en: 'Korean Aesthetics' } as Record<Language, string>,
    tag3: { ja: '完全予約制', 'zh-CN': '完全预约制', 'zh-TW': '完全預約制', en: 'By Appointment Only' } as Record<Language, string>,
    tag4: { ja: '梅田直結', 'zh-CN': '梅田直结', 'zh-TW': '梅田直結', en: 'Umeda Direct Access' } as Record<Language, string>,
    viewAll: { ja: '全プロジェクトを見る', 'zh-CN': '查看全部项目', 'zh-TW': '查看全部項目', en: 'View All Treatments' } as Record<Language, string>,
    stats1: { ja: '累計華僑客様', 'zh-CN': '累计服务华人客户', 'zh-TW': '累計服務華人客戶', en: 'Chinese clients served' } as Record<Language, string>,
    stats2: { ja: '客満足度', 'zh-CN': '客户满意度', 'zh-TW': '客戶滿意度', en: 'Customer satisfaction' } as Record<Language, string>,
    stats3: { ja: '美容外科臨床経験', 'zh-CN': '美容外科临床经验', 'zh-TW': '美容外科臨床經驗', en: 'Clinical experience' } as Record<Language, string>,
    whyTitle: { ja: 'SAI CLINICを選ぶ理由', 'zh-CN': '选择 SAI CLINIC 的理由', 'zh-TW': '選擇 SAI CLINIC 的理由', en: 'Why Choose SAI CLINIC' } as Record<Language, string>,
    bookNow: { ja: '今すぐ予約', 'zh-CN': '立即预约', 'zh-TW': '立即預約', en: 'Book Now' } as Record<Language, string>,
    location: { ja: '大阪梅田', 'zh-CN': '大阪梅田', 'zh-TW': '大阪梅田', en: 'Osaka Umeda' } as Record<Language, string>,
  };

  return (
    <div className="animate-fade-in-up">
      {/* Language Switcher - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher variant="compact" />
      </div>

      {/* ━━━━━━━━ 1. HERO ━━━━━━━━ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-950">
        <Image
          src={heroBg?.src || `${SAI}/topFvImg01.jpg`}
          alt={heroBg?.alt || 'SAI CLINIC'}
          fill
          className="object-cover"
          priority
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-gray-950/70 to-rose-950/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-rose-400"></div>
                <span className="text-xs tracking-[0.3em] text-rose-300 uppercase">Aesthetic Medicine in Osaka</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                SAI CLINIC
                <br />
                <span className="text-rose-300">{t(TR.location, lang)}</span>
              </h1>
              <p className="text-xl text-rose-200/80 mb-4 font-light">{t(TR.heroSlogan, lang)}</p>
              <p className="text-base text-gray-300/80 leading-relaxed mb-8 max-w-lg">
                {t(TR.heroDesc, lang)}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {[TR.tag1, TR.tag2, TR.tag3, TR.tag4].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">{t(tag, lang)}</span>
                ))}
              </div>
              <a href="#sai-packages" className="inline-flex items-center gap-3 bg-rose-500 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
                {t(TR.viewAll, lang)} <ArrowRight size={18} />
              </a>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10">
                    <Image src={heroGridImages[0]?.src || `${SAI}/topFvImg02.jpg`} alt={heroGridImages[0]?.alt || ''} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">15+</div>
                      <div className="text-[11px] text-gray-300">年医美经验</div>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-white/10">
                    <Image src={galleryImages[2]?.src || `${SAI}/aboutGalleryImg3.jpg`} alt={galleryImages[2]?.alt || ''} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">JSAS</div>
                      <div className="text-[11px] text-gray-300">日本美容外科学会</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-white/10">
                    <Image src={conceptImages[0]?.src || `${SAI}/aboutConcept1.jpg`} alt={conceptImages[0]?.alt || ''} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">KAAS</div>
                      <div className="text-[11px] text-gray-300">韩国美容外科学会</div>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10">
                    <Image src={heroGridImages[1]?.src || `${SAI}/topFvImg03.jpg`} alt={heroGridImages[1]?.alt || ''} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">梅田</div>
                      <div className="text-[11px] text-gray-300">阪急直结·地下通道</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ TRUST STATS ━━━━━━━━ */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-rose-600">2,800<span className="text-base">+</span></div>
              <div className="text-[11px] text-gray-500 mt-1">{t(TR.stats1, lang)}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-rose-600">98.5<span className="text-base">%</span></div>
              <div className="text-[11px] text-gray-500 mt-1">{t(TR.stats2, lang)}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-rose-600">15<span className="text-base">年+</span></div>
              <div className="text-[11px] text-gray-500 mt-1">{t(TR.stats3, lang)}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-rose-600">0</div>
              <div className="text-[11px] text-gray-500 mt-1">医疗事故记录</div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ PROMO BANNER ━━━━━━━━ */}
      <section className="py-3 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <p className="text-sm">
              <span className="text-rose-400 font-bold">2026 春季キャンペーン</span>
              <span className="mx-2 text-gray-600">|</span>
              <span className="text-gray-300">全项目一站式套餐价格 · 3月末截止</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-1.5 rounded-full">
            <Clock size={12} />
            本月余剩名额：<span className="text-rose-400">7名</span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 2. 医生介绍 ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Doctor</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">院長紹介</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-rose-50 to-gray-50 rounded-3xl p-8 border border-rose-100">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-rose-200 shrink-0">
                  <Image src={doctorAvatar?.src || `${SAI}/doctor.jpg`} alt={doctorAvatar?.alt || '崔煌植 院長'} width={96} height={96} className="object-cover w-full h-full" quality={75} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">崔 煌植</h3>
                  <p className="text-sm text-gray-500">Sai Koshoku｜SAI CLINIC 院长</p>
                  <Image src={doctorSign?.src || `${SAI}/sign.png`} alt={doctorSign?.alt || '崔煌植 签名'} width={100} height={32} className="mt-1 opacity-60" quality={75} />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                三重大学医学部毕业。曾在济生会西奈利病院（整形外科·皮肤科·内科）积累丰富临床经验，
                后担任湘南美容クリニック都市旗舰店院长，磨练出卓越的美容外科技术。
                秉持&ldquo;用心传递美丽&rdquo;的理念，创立SAI CLINIC。
              </p>
              <div className="space-y-3">
                {[
                  '日本美容外科学会（JSAS）会员',
                  '韩国美容外科学会（KAAS）会员',
                  'Allergan Botox Vista 认证医师',
                  'Allergan Juvéderm Vista 认证医师',
                  '日本救急医学会 ICLS 讲师',
                ].map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-rose-500 shrink-0" />
                    {q}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Heart size={18} className="text-rose-500" /> 诊疗理念</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  &ldquo;不推销不需要的手术，只提供真正适合您的方案。
                  通过外在美容与内在营养的双重调理，实现自然健康的美丽。
                  希望每位来到SAI CLINIC的客人都能轻松自在，放心把美丽交给我们。&rdquo;
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {conceptImages.slice(1, 4).map((item, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden h-28">
                    <Image src={item.src} alt={item.label} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium text-white">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 3. 特色介绍 ━━━━━━━━ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Why SAI CLINIC</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">选择 SAI CLINIC 的理由</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: featureImages[0]?.src || `${SAI}/topFeatureImg01.jpg`,
                imgAlt: featureImages[0]?.alt || '',
                title: '糸リフト专门诊所',
                desc: '以线雕提升为核心技术，崔医生在该领域拥有超过15年经验和数千例成功案例。独创SAI LIFT系列，从体验到完美，满足不同需求。',
                tags: ['SAI LIFT TRY', 'STANDARD', 'PERFECT'],
              },
              {
                img: featureImages[1]?.src || `${SAI}/topFeatureImg02.jpg`,
                imgAlt: featureImages[1]?.alt || '',
                title: '韩式美学·日本品质',
                desc: '积极引进最新韩国美容趋势与技术，同时保持日本医疗的精准与安全标准。兼具韩式审美的时尚感与日式品控的可靠性。',
                tags: ['JSAS会员', 'KAAS会员', 'Allergan认证'],
              },
              {
                img: featureImages[2]?.src || `${SAI}/aboutFeatureItem2.jpg`,
                imgAlt: featureImages[2]?.alt || '',
                title: '内外兼修·个性定制',
                desc: '不仅提供外在美容手术，还通过分子营养学分析（82项血液检测），从内部调理健康。为每位客人制定全方位的美丽健康计划。',
                tags: ['营养分析', '内服治疗', '点滴疗法'],
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative h-48">
                  <Image src={item.img} alt={item.imgAlt} fill className="object-cover" quality={75} />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, j) => (
                      <span key={j} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 3.5. 服务价值说明 ━━━━━━━━ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Our Service</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">一站式医美服务</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              您的费用包含以下全部服务 —— 让您只需专注于变美，其余一切交给我们
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Globe size={22} className="text-rose-500" />, title: '全程中文服务', desc: '从预约到术后，全程中文翻译陪诊，无任何语言障碍' },
              { icon: <MessageCircle size={22} className="text-blue-500" />, title: '预约·排期保障', desc: '与诊所直连排期，确保您来日本的时间与诊疗完美衔接' },
              { icon: <Stethoscope size={22} className="text-purple-500" />, title: '术后远程跟进', desc: '回国后持续追踪恢复状况，如有问题即时与崔医生沟通' },
              { icon: <Users size={22} className="text-teal-500" />, title: '到院全程陪同', desc: '专人陪诊，协助表达需求，确保医患沟通精准无误' },
              { icon: <Shield size={22} className="text-amber-500" />, title: '费用透明·无隐形消费', desc: '所有费用一次付清，诊所内不会产生任何额外收费' },
              { icon: <MapPin size={22} className="text-green-500" />, title: '住宿·交通协助', desc: '推荐梅田周边合适住宿，提供交通指引及接送安排建议' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50/30 transition">
                <div className="shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 3.7. 诊所环境 ━━━━━━━━ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Clinic Gallery</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">诊所环境</h2>
            <p className="text-gray-500 text-sm mt-2">位于大阪梅田 YANMAR 大楼 B2F，高端私密的诊疗空间</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {galleryImages.filter((g) => g.label !== '诊所入口').slice(0, 8).map((item, i) => (
              <div key={item.id} className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <div className={`relative ${i === 0 ? 'h-full min-h-[300px]' : 'h-48'}`}>
                  <Image src={item.src} alt={item.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" quality={75} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 3.8. 症例紹介（Before/After） ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Case Results</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">症例紹介</h2>
            <p className="text-gray-500 text-sm mt-2">糸リフト施術の実際の効果（写真掲載は患者様のご同意済み）</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {caseImages.map((item) => (
              <div key={item.id} className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition">
                <div className="relative h-80">
                  <Image src={item.src} alt={item.alt} fill className="object-cover object-top" quality={75} />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{item.metadata?.title || item.alt}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.metadata?.desc || ''}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-8">※ 施術効果には個人差がございます。詳しくはカウンセリング時にご説明いたします。</p>
        </div>
      </section>

      {/* ━━━━━━━━ 4. 人气套餐 - 糸リフト ━━━━━━━━ */}
      <section className="py-24 bg-white" id="sai-packages">
        <div className="max-w-6xl mx-auto px-6">
          {/* Thread Lift Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-16 h-64 md:h-80">
            <Image src={threadliftImages[0]?.src || `${SAI_UP}/2025/06/sai_threadlift_title.jpg`} alt={threadliftImages[0]?.alt || 'SAI LIFT'} fill className="object-cover" quality={75} />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
            <div className="absolute inset-0 flex items-center px-8 md:px-12">
              <div>
                <span className="text-sm tracking-widest text-rose-400 uppercase">Thread Lift Packages</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">SAI LIFT 糸リフト系列</h2>
                <p className="text-gray-300 text-sm mt-2 max-w-md">招牌线雕提升项目，三档可选</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 backdrop-blur border border-rose-400/30 rounded-full text-xs font-bold text-rose-300">
                  <Clock size={12} /> 本月预约名额余剩 7 名
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {THREAD_LIFT_PACKAGES.map((pkg) => (
              <div
                key={pkg.slug}
                className={`rounded-2xl p-6 hover:shadow-2xl transition hover:-translate-y-1 relative overflow-hidden flex flex-col ${
                  pkg.flagship
                    ? 'bg-gray-900 text-white border border-gray-800'
                    : pkg.popular
                      ? 'bg-gradient-to-br from-rose-50 to-purple-50 border border-rose-200'
                      : 'bg-white border border-gray-200'
                }`}
              >
                {pkg.flagship && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Flagship</div>}
                {pkg.popular && <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">人气</div>}
                <div className="mb-4">
                  <h4 className={`text-xl font-bold ${pkg.flagship ? 'text-amber-400' : pkg.popular ? 'text-rose-700' : 'text-gray-900'}`}>{t(pkg.name, lang)}</h4>
                  <div className="mt-2">
                    <span className={`text-xs line-through ${pkg.flagship ? 'text-gray-500' : 'text-gray-400'}`}>分别预约 {formatPrice(getRefPrice(pkg.price))}</span>
                  </div>
                  <p className={`text-2xl font-bold ${pkg.flagship ? 'text-amber-400' : pkg.popular ? 'text-rose-700' : 'text-gray-900'}`}>{formatPrice(pkg.price)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-1 ${pkg.flagship ? 'bg-amber-500/20 text-amber-400' : 'bg-green-100 text-green-700'}`}>
                    省 {formatPrice(getRefPrice(pkg.price) - pkg.price)}
                  </span>
                  <p className={`text-[10px] mt-1 ${pkg.flagship ? 'text-gray-500' : 'text-gray-400'}`}>含税·含中文陪诊·含术后跟进</p>
                </div>
                <div className="space-y-1.5 mb-4 text-xs flex-grow">
                  {pkg.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <CheckCircle size={14} className={`shrink-0 ${pkg.flagship ? 'text-amber-500' : pkg.popular ? 'text-rose-500' : 'text-gray-400'}`} />
                      <span className={pkg.flagship ? 'text-gray-300' : 'text-gray-700'}>{t(f, lang)}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`${checkoutBase}/${pkg.slug}`}
                  className={`w-full py-3 text-sm font-bold rounded-lg transition text-center block ${
                    pkg.flagship
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : pkg.popular
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  立即预约
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 5. 组合套餐 ━━━━━━━━ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Combination Sets</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">人气组合套餐</h2>
            <p className="text-gray-500 text-sm mt-2">针对特定问题的综合解决方案</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMBO_PACKAGES.map((pkg) => (
              <div key={pkg.slug} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition hover:-translate-y-1 flex flex-col">
                <h4 className="font-bold text-gray-900 mb-1">{t(pkg.name, lang)}</h4>
                <p className="text-xs text-gray-400 mb-3">{pkg.name.ja}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{t(pkg.desc, lang)}</p>
                <div className="mb-3">
                  <span className="text-xs line-through text-gray-400">分别预约 {formatPrice(getRefPrice(pkg.price))}</span>
                  <p className="text-xl font-bold text-gray-900">{formatPrice(pkg.price)}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">省 {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                </div>
                <Link href={`${checkoutBase}/${pkg.slug}`} className="w-full py-2 bg-rose-500 text-white text-sm font-bold rounded-lg hover:bg-rose-600 transition text-center block">立即预约</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 6. 眼部 + 鼻部套餐 ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Eye */}
            <div>
              <div className="mb-8">
                <span className="text-sm tracking-widest text-purple-500 uppercase">Eye Surgery</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">眼部整形</h3>
              </div>
              <div className="space-y-4">
                {EYE_PACKAGES.map((pkg) => (
                  <div key={pkg.slug} className="bg-purple-50/50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">{t(pkg.name, lang)}</h4>
                      <p className="text-xs text-gray-400 mb-1">{pkg.name.ja}</p>
                      <p className="text-sm text-gray-500">{t(pkg.desc, lang)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs line-through text-gray-400 block">参考价 {formatPrice(getRefPrice(pkg.price))}</span>
                      <p className="text-xl font-bold text-purple-700">{formatPrice(pkg.price)}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold inline-block mb-1">省 {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                      <Link href={`${checkoutBase}/${pkg.slug}`} className="inline-block mt-1 px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition">立即预约</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Nose */}
            <div>
              <div className="mb-8">
                <span className="text-sm tracking-widest text-blue-500 uppercase">Nose Surgery</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">鼻部整形</h3>
              </div>
              <div className="space-y-4">
                {NOSE_PACKAGES.map((pkg) => (
                  <div key={pkg.slug} className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">{t(pkg.name, lang)}</h4>
                      <p className="text-xs text-gray-400 mb-1">{pkg.name.ja}</p>
                      <p className="text-sm text-gray-500">{t(pkg.desc, lang)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs line-through text-gray-400 block">参考价 {formatPrice(getRefPrice(pkg.price))}</span>
                      <p className="text-xl font-bold text-blue-700">{formatPrice(pkg.price)}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold inline-block mb-1">省 {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                      <Link href={`${checkoutBase}/${pkg.slug}`} className="inline-block mt-1 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">立即预约</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 7. 注射 + 脂肪 + 内科 ━━━━━━━━ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">More Treatments</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">更多服务项目</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...INJECTABLE_PACKAGES, ...FAT_PACKAGES, ...WELLNESS_PACKAGES].map((pkg) => (
              <div key={pkg.slug} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition hover:-translate-y-1 flex flex-col">
                <h4 className="font-bold text-gray-900 mb-1">{t(pkg.name, lang)}</h4>
                <p className="text-xs text-gray-400 mb-3">{pkg.name.ja}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{t(pkg.desc, lang)}</p>
                <div>
                  <span className="text-xs line-through text-gray-400">分别预约 {formatPrice(getRefPrice(pkg.price))}</span>
                  <div className="flex items-end justify-between mt-1">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{formatPrice(pkg.price)}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">省 {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                    </div>
                    <Link href={`${checkoutBase}/${pkg.slug}`} className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition">立即预约</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 8. 完整价格表 ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Full Price List</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">完整价格一览</h2>
            <p className="text-gray-500 text-sm mt-2">所有项目价格（含税·含服务费）</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {Object.entries(FULL_MENU).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setMenuTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  menuTab === key ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {t(cat.title, lang)}
              </button>
            ))}
          </div>

          {/* Price Table */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                {t(FULL_MENU[menuTab as keyof typeof FULL_MENU].title, lang)}
              </h3>
              <span className="text-xs text-gray-400">{FULL_MENU[menuTab as keyof typeof FULL_MENU].items.length} 项目</span>
            </div>
            <div className="divide-y divide-gray-100">
              {FULL_MENU[menuTab as keyof typeof FULL_MENU].items.map((item, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-white transition">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-bold text-gray-900 shrink-0 ml-4">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 9. 治疗流程 ━━━━━━━━ */}
      <section className="py-24 text-white relative overflow-hidden">
        <Image src={flowBg?.src || `${SAI}/topFvImg06.jpg`} alt={flowBg?.alt || 'SAI CLINIC'} fill className="object-cover" quality={75} />
        <div className="absolute inset-0 bg-gray-900/85"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-400 uppercase">Treatment Flow</span>
            <h2 className="text-3xl font-bold mt-3">治疗流程</h2>
            <p className="text-gray-400 text-sm mt-2">完全预约制·全程中文服务</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { id: '01', icon: <Phone size={24} />, title: '预约咨询', desc: '通过线上系统或LINE预约，确定来院日期' },
              { id: '02', icon: <Heart size={24} />, title: '面诊方案', desc: '崔医生亲自面诊，制定个性化治疗方案' },
              { id: '03', icon: <Shield size={24} />, title: '确认付款', desc: '确认治疗内容和费用，签署知情同意书' },
              { id: '04', icon: <Sparkles size={24} />, title: '施术治疗', desc: '全程语音沟通，随时反馈感受' },
              { id: '05', icon: <Clock size={24} />, title: '术后跟进', desc: '提供术后护理指导，安排回诊复查' },
            ].map((step, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition text-center">
                <div className="text-rose-400 font-mono text-xl mb-4 opacity-50">{step.id}</div>
                <div className="flex justify-center mb-4 text-white opacity-80">{step.icon}</div>
                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 10. 交通信息 ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Access</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">交通指南</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <div className="relative h-48">
                <Image src={galleryEntrance?.src || `${SAI}/aboutGalleryImg8.jpg`} alt={galleryEntrance?.alt || 'SAI CLINIC 入口'} fill className="object-cover" quality={75} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
                  <MapPin size={14} className="text-rose-500" />
                  <span className="text-sm font-medium text-gray-800">梅田 YANMAR ビル B2F</span>
                </div>
              </div>
              <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">诊所地址</h3>
              <p className="text-gray-700 mb-2">〒530-0013</p>
              <p className="text-gray-700 mb-1">大阪府大阪市北区茶屋町1-32</p>
              <p className="text-gray-700 mb-6">ヤンマー本社ビル 地下2階（B2F）</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock size={14} className="text-gray-400" /> 营业时间：9:00 - 18:00
                </div>
              </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Train size={20} className="text-rose-500" /> 最近车站</h3>
              <div className="space-y-4">
                {[
                  { station: '阪急梅田站', time: '1分钟', line: '阪急线', note: '地下通道直结' },
                  { station: 'JR大阪站', time: '3分钟', line: 'JR线' },
                  { station: '御堂筋线梅田站', time: '3分钟', line: '大阪Metro' },
                  { station: '谷町线东梅田站', time: '5分钟', line: '大阪Metro' },
                  { station: '阪神梅田站', time: '5分钟', line: '阪神线' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                      <Train size={18} className="text-rose-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900">{s.station}</div>
                      <div className="text-xs text-gray-400">{s.line}{s.note ? ` · ${s.note}` : ''}</div>
                    </div>
                    <div className="text-sm font-bold text-rose-600">{s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 11. 客户评价 ━━━━━━━━ */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Reviews</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">客户评价</h2>
            <p className="text-gray-400 text-sm mt-2">来自2,800+客户的真实体验反馈</p>
            <div className="flex items-center justify-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="text-sm text-gray-600 ml-2 font-medium">4.9 / 5.0</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-6 animate-scroll-reviews px-6">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-w-[320px] max-w-[320px] shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.loc} · {r.date}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full inline-block mb-3">{r.treatment}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ TRANSFORMATION ━━━━━━━━ */}
      <section className="py-20 bg-rose-50/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-2 border-rose-200">
            <Image src={recommendImg?.src || `${SAI}/a-reccoImg.jpg`} alt={recommendImg?.alt || '推薦'} fill className="object-cover" quality={75} />
          </div>
          <span className="text-sm tracking-widest text-rose-500 uppercase">Transformation</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-12">从犹豫到自信的蜕变</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-gray-400" />
              </div>
              <h4 className="font-bold text-gray-400 mb-2 text-sm uppercase tracking-wider">Before</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                &ldquo;在日本做医美语言不通怎么办？&rdquo;&ldquo;价格会不会被加收？&rdquo;&ldquo;效果自然吗？&rdquo;
                —— 每一位第一次咨询的客人，都有同样的顾虑。
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">SAI CLINIC</div>
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                <Sparkles size={24} className="text-rose-500" />
              </div>
              <h4 className="font-bold text-rose-600 mb-2 text-sm uppercase tracking-wider">During</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                全程中文沟通、崔医生亲自设计方案、费用透明无隐形消费、术后持续追踪
                —— 原来在日本做医美可以这么安心。
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-rose-500" />
              </div>
              <h4 className="font-bold text-rose-500 mb-2 text-sm uppercase tracking-wider">After</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                &ldquo;朋友都说我气色好了&rdquo;&ldquo;效果超自然，完全看不出&rdquo;&ldquo;下次还来崔医生这里&rdquo;
                —— 这就是2,800+客户的真实心声。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 12. FAQ ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">FAQ</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">常见问题</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 13. CTA ━━━━━━━━ */}
      <section className="py-24 text-white text-center relative overflow-hidden">
        <Image src={ctaBg?.src || `${SAI}/topFvImg04.jpg`} alt={ctaBg?.alt || 'SAI CLINIC'} fill className="object-cover" quality={75} />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/90 to-pink-600/90"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">不要再等了，美丽不应该被推迟</h2>
          <p className="text-rose-100 text-lg mb-6 leading-relaxed">
            崔煌植医生亲自为您制定专属方案。从线上咨询到术后跟进，全程中文服务。
          </p>
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-rose-200">
            <Clock size={14} />
            <span>本月预约名额有限 · 建议提前2周预约</span>
          </div>
          <a href="#sai-packages" className="inline-flex items-center gap-3 bg-white text-rose-600 px-10 py-4 rounded-full font-bold hover:bg-rose-50 transition-all shadow-lg shadow-white/20">
            查看全部项目 · 立即预约 <ArrowRight size={18} />
          </a>
          <p className="text-xs text-rose-200/60 mt-6">咨询免费 · 无任何强制消费 · 不满意可全额退款</p>
        </div>
      </section>

      {/* ━━━━━━━━ 14. Contact ━━━━━━━━ */}
      {!isGuideEmbed && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">联系我们</h3>
            <ContactButtons />
          </div>
        </section>
      )}

      {/* ━━━━━━━━ 悬浮 CTA ━━━━━━━━ */}
      {!isGuideEmbed && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          <div className="bg-gray-900 text-white text-[10px] px-3 py-1 rounded-full shadow-lg opacity-90">
            <span className="text-rose-400 font-bold">春季优惠</span> · 余剩7名额
          </div>
          <a
            href="#sai-packages"
            className="flex items-center gap-2 bg-rose-500 text-white pl-5 pr-4 py-3 rounded-full font-bold shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/40 transition-all text-sm"
          >
            <Sparkles size={16} />
            立即预约
            <ArrowRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
