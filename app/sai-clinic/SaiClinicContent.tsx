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
  { id: 'f-c1', category: 'case', src: `${SAI_UP}/2025/05/SAI_PH_threadlift_009-01.jpg`, alt: '40代女性 线雕+玻尿酸', label: '40代女性', display_order: 1, metadata: { title: '40代女性 · 线雕+玻尿酸', desc: 'SAI LIFT STANDARD + 法令纹玻尿酸注射。自然的提升效果，法令纹明显改善。' } },
  { id: 'f-c2', category: 'case', src: `${SAI_UP}/2025/08/SAI_PH_threadlift_001-01.jpg`, alt: '50代女性 线雕', label: '50代女性', display_order: 2, metadata: { title: '50代女性 · 线雕', desc: 'SAI LIFT PERFECT 全脸线雕提升。显著改善面部松弛，恢复年轻轮廓。' } },
  { id: 'f-c3', category: 'case', src: `${SAI_UP}/2025/11/SAI_PH_threadlift_006-01.jpg`, alt: '50代女性 线雕+脂肪溶解', label: '50代女性', display_order: 3, metadata: { title: '50代女性 · 线雕+脂肪溶解', desc: '线雕提升 + 面部吸脂。V脸效果明显，下颚线条更加紧致。' } },
  { id: 'f-d1', category: 'doctor', src: `${SAI}/doctor.jpg`, alt: '崔煌植 院長', label: '院長头像', display_order: 1, metadata: { usage: 'avatar' } },
  { id: 'f-d2', category: 'doctor', src: `${SAI}/sign.png`, alt: '崔煌植 签名', label: '签名', display_order: 2, metadata: { usage: 'signature' } },
  { id: 'f-d3', category: 'doctor', src: `${SAI}/a-reccoImg.jpg`, alt: '推薦', label: '推薦头像', display_order: 3, metadata: { usage: 'recommend' } },
  { id: 'f-f1', category: 'feature', src: `${SAI}/topFeatureImg01.jpg`, alt: '线雕专门诊所', label: '线雕专门', display_order: 1, metadata: { title: '线雕专门诊所' } },
  { id: 'f-f2', category: 'feature', src: `${SAI}/topFeatureImg02.jpg`, alt: '韩式美学·日本品质', label: '韩式美学', display_order: 2, metadata: { title: '韩式美学·日本品质' } },
  { id: 'f-f3', category: 'feature', src: `${SAI}/aboutFeatureItem2.jpg`, alt: '内外兼修·个性定制', label: '内外兼修', display_order: 3, metadata: { title: '内外兼修·个性定制' } },
  { id: 'f-cp1', category: 'concept', src: `${SAI}/aboutConcept1.jpg`, alt: 'SAI CLINIC 施術風景', label: '施术风景', display_order: 1, metadata: null },
  { id: 'f-cp2', category: 'concept', src: `${SAI}/aboutConcept2.jpg`, alt: '抗衰老专门', label: '抗衰老专门', display_order: 2, metadata: null },
  { id: 'f-cp3', category: 'concept', src: `${SAI}/aboutConcept3.jpg`, alt: '韩式美学', label: '韩式美学', display_order: 3, metadata: null },
  { id: 'f-cp4', category: 'concept', src: `${SAI}/aboutConcept4.jpg`, alt: '个性化方案', label: '个性化方案', display_order: 4, metadata: null },
  { id: 'f-t1', category: 'threadlift', src: `${SAI_UP}/2025/06/sai_threadlift_title.jpg`, alt: 'SAI LIFT 线雕', label: '线雕 hero', display_order: 1, metadata: null },
];

// ━━━━━━━━ 套餐数据 ━━━━━━━━

const THREAD_LIFT_PACKAGES = [
  {
    slug: 'sai-lift-try',
    name: { ja: 'SAI LIFT TRY', 'zh-CN': '体验版线雕', 'zh-TW': '體驗版線雕', en: 'SAI LIFT TRY' } as Record<Language, string>,
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
    name: { ja: 'SAI LIFT STANDARD', 'zh-CN': '标准版线雕', 'zh-TW': '標準版線雕', en: 'SAI LIFT STANDARD' } as Record<Language, string>,
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
    name: { ja: 'SAI LIFT PERFECT', 'zh-CN': '完美版线雕', 'zh-TW': '完美版线雕', en: 'SAI LIFT PERFECT' } as Record<Language, string>,
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
  { slug: 'sai-nasolabial-set', name: { ja: 'ほうれい線セット', 'zh-CN': '法令纹改善套餐', 'zh-TW': '法令紋改善套餐', en: 'Nasolabial Fold Set' } as Record<Language, string>, price: 378000, desc: { ja: '糸リフト + ヒアルロン酸注射', 'zh-CN': '线雕 + 玻尿酸注射，针对法令纹的综合解决方案', 'zh-TW': '線雕 + 玻尿酸注射，針對法令紋的綜合解決方案', en: 'Thread lift + hyaluronic acid injection for nasolabial folds' } as Record<Language, string> },
  { slug: 'sai-vline-set', name: { ja: 'V-Lineセット', 'zh-CN': 'V脸线条套餐', 'zh-TW': 'V臉線條套餐', en: 'V-Line Set' } as Record<Language, string>, price: 496000, desc: { ja: '脂肪溶解 + 糸リフト', 'zh-CN': '精准脂肪溶解 + 线雕提升，打造理想V脸线条', 'zh-TW': '精準脂肪溶解 + 線雕提升，打造理想V臉線條', en: 'Fat dissolving + thread lift for ideal V-line' } as Record<Language, string> },
  { slug: 'sai-neck-set', name: { ja: '首シワセット', 'zh-CN': '颈纹改善套餐', 'zh-TW': '頸紋改善套餐', en: 'Neck Wrinkle Set' } as Record<Language, string>, price: 378000, desc: { ja: '糸リフト + ヒアルロン酸', 'zh-CN': '线雕 + 玻尿酸，有效改善颈部细纹和松弛', 'zh-TW': '線雕 + 玻尿酸，有效改善頸部細紋和鬆弛', en: 'Thread lift + hyaluronic acid for neck wrinkles' } as Record<Language, string> },
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

const mi = (ja: string, cn: string, tw: string, en: string) => ({ ja, 'zh-CN': cn, 'zh-TW': tw, en }) as Record<Language, string>;

const FULL_MENU = {
  surgery: {
    title: mi('美容外科', '美容外科', '美容外科', 'Aesthetic Surgery'),
    icon: <Scissors size={20} />,
    items: [
      { name: mi('SAI LIFT TRY（糸リフト体験）', 'SAI LIFT TRY（线雕体验）', 'SAI LIFT TRY（線雕體驗）', 'SAI LIFT TRY (Thread Lift Trial)'), price: 380000 },
      { name: mi('SAI LIFT STANDARD（糸リフト標準）', 'SAI LIFT STANDARD（线雕标准）', 'SAI LIFT STANDARD（線雕標準）', 'SAI LIFT STANDARD (Thread Lift Standard)'), price: 680000 },
      { name: mi('SAI LIFT PERFECT（糸リフト完美）', 'SAI LIFT PERFECT（线雕完美）', 'SAI LIFT PERFECT（線雕完美）', 'SAI LIFT PERFECT (Thread Lift Perfect)'), price: 980000 },
      { name: mi('SAI LIFT COLLAGEN', 'SAI LIFT COLLAGEN', 'SAI LIFT COLLAGEN', 'SAI LIFT COLLAGEN'), price: 280000 },
      { name: mi('ほうれい線セット（糸+ヒアルロン酸）', '法令纹套餐（线雕+玻尿酸）', '法令紋套餐（線雕+玻尿酸）', 'Nasolabial Fold Set (Thread + HA)'), price: 378000 },
      { name: mi('V-Lineセット', 'V脸套餐', 'V臉套餐', 'V-Line Set'), price: 496000 },
      { name: mi('首シワセット', '颈纹套餐', '頸紋套餐', 'Neck Wrinkle Set'), price: 378000 },
      { name: mi('目元セット', '眼周疲劳套餐', '眼周疲勞套餐', 'Eye Rejuvenation Set'), price: 378000 },
      { name: mi('脂肪吸引注入（頬）', '脂肪吸引注射（颊部）', '脂肪吸引注射（頰部）', 'Liposuction Injection (Cheeks)'), price: 320000 },
      { name: mi('脂肪吸引注入（顎下）', '脂肪吸引注射（下颚）', '脂肪吸引注射（下顎）', 'Liposuction Injection (Jawline)'), price: 320000 },
      { name: mi('脂肪吸引注入（2部位）', '脂肪吸引注射（双区）', '脂肪吸引注射（雙區）', 'Liposuction Injection (2 Areas)'), price: 480000 },
      { name: mi('自己脂肪注入（採取+準備）', '自体脂肪注入（提取+准备）', '自體脂肪注入（提取+準備）', 'Fat Grafting (Extraction + Prep)'), price: 380000 },
      { name: mi('脂肪注入・額', '脂肪注入·额头', '脂肪注入·額頭', 'Fat Grafting · Forehead'), price: 500000 },
      { name: mi('脂肪注入・こめかみ', '脂肪注入·太阳穴', '脂肪注入·太陽穴', 'Fat Grafting · Temples'), price: 320000 },
      { name: mi('脂肪注入・全顔無制限', '脂肪注入·全脸无限', '脂肪注入·全臉無限', 'Fat Grafting · Full Face Unlimited'), price: 1760000 },
      { name: mi('二重埋没法（1年保証）', '自然双眼皮（埋没法·1年保障）', '自然雙眼皮（埋沒法·1年保障）', 'Double Eyelid Suture (1-Year)'), price: 300000 },
      { name: mi('二重4点連続法（3年保証）', '双眼皮4点连续法（3年保障）', '雙眼皮4點連續法（3年保障）', 'Double Eyelid 4-Point (3-Year)'), price: 440000 },
      { name: mi('二重6点連続法（5年保証）', '双眼皮6点连续法（5年保障）', '雙眼皮6點連續法（5年保障）', 'Double Eyelid 6-Point (5-Year)'), price: 580000 },
      { name: mi('全切開二重', '全切开双眼皮', '全切開雙眼皮', 'Full Incision Double Eyelid'), price: 640000 },
      { name: mi('上まぶた脂肪除去', '上眼睑脂肪去除', '上眼瞼脂肪去除', 'Upper Eyelid Fat Removal'), price: 280000 },
      { name: mi('眼瞼下垂矯正', '眼睑下垂矫正', '眼瞼下垂矯正', 'Ptosis Correction'), price: 420000 },
      { name: mi('目頭切開（Z法）', '开眼角（Z法）', '開眼角（Z法）', 'Epicanthoplasty (Z-method)'), price: 440000 },
      { name: mi('目頭切開（韓国式）', '开眼角（韩式）', '開眼角（韓式）', 'Epicanthoplasty (Korean)'), price: 500000 },
      { name: mi('眉下リフト', '眉下提升', '眉下提升', 'Sub-Brow Lift'), price: 700000 },
      { name: mi('クマ取り・脂肪除去', '黑眼圈·脂肪去除', '黑眼圈·脂肪去除', 'Under-Eye Fat Removal'), price: 440000 },
      { name: mi('クマ取り・裏ハムラ法', '黑眼圈·Reverse Hamra', '黑眼圈·Reverse Hamra', 'Under-Eye Reverse Hamra'), price: 880000 },
      { name: mi('クマ取り・表ハムラ法', '黑眼圈·Open Hamra', '黑眼圈·Open Hamra', 'Under-Eye Open Hamra'), price: 1080000 },
      { name: mi('クマ取り・皮膚切除', '黑眼圈·皮肤切除', '黑眼圈·皮膚切除', 'Under-Eye Skin Excision'), price: 660000 },
      { name: mi('SAI LIFT NOSE（4本）', 'SAI LIFT NOSE（4线）', 'SAI LIFT NOSE（4線）', 'SAI LIFT NOSE (4 Threads)'), price: 320000 },
      { name: mi('SAI LIFT NOSE（8本）', 'SAI LIFT NOSE（8线）', 'SAI LIFT NOSE（8線）', 'SAI LIFT NOSE (8 Threads)'), price: 560000 },
      { name: mi('プロテーゼ隆鼻', '硅胶隆鼻', '矽膠隆鼻', 'Silicone Rhinoplasty'), price: 480000 },
      { name: mi('小鼻縮小', '缩鼻翼', '縮鼻翼', 'Alar Reduction'), price: 540000 },
      { name: mi('人中短縮', '人中缩短', '人中縮短', 'Lip Lift'), price: 700000 },
    ],
  },
  injection: {
    title: mi('美容皮膚科（注射）', '注射美容', '注射美容', 'Injectable Treatments'),
    icon: <Syringe size={20} />,
    items: [
      { name: mi('Allerganボトックス・1部位', 'Allergan肉毒素·单部位', 'Allergan肉毒素·單部位', 'Allergan Botox · 1 Area'), price: 36000 },
      { name: mi('Allerganボトックス・咬筋（標準）', 'Allergan肉毒素·咬肌（标准）', 'Allergan肉毒素·咬肌（標準）', 'Allergan Botox · Masseter (Standard)'), price: 88000 },
      { name: mi('Allerganボトックス・咬筋（強力）', 'Allergan肉毒素·咬肌（加强）', 'Allergan肉毒素·咬肌（加強）', 'Allergan Botox · Masseter (Strong)'), price: 160000 },
      { name: mi('Allerganボトックス・全顔50単位', 'Allergan肉毒素·全脸50单位', 'Allergan肉毒素·全臉50單位', 'Allergan Botox · Full Face 50u'), price: 140000 },
      { name: mi('Allerganボトックス・全顔100単位', 'Allergan肉毒素·全脸100单位', 'Allergan肉毒素·全臉100單位', 'Allergan Botox · Full Face 100u'), price: 240000 },
      { name: mi('Allerganボトックス・ワキ制汗', 'Allergan肉毒素·腋下止汗', 'Allergan肉毒素·腋下止汗', 'Allergan Botox · Underarm'), price: 116000 },
      { name: mi('Botulax・1部位', 'Botulax·单部位', 'Botulax·單部位', 'Botulax · 1 Area'), price: 14000 },
      { name: mi('Botulax・咬筋（標準）', 'Botulax·咬肌（标准）', 'Botulax·咬肌（標準）', 'Botulax · Masseter (Standard)'), price: 36000 },
      { name: mi('Botulax・全顔50単位', 'Botulax·全脸50单位', 'Botulax·全臉50單位', 'Botulax · Full Face 50u'), price: 64000 },
      { name: mi('Botulax・全顔100単位', 'Botulax·全脸100单位', 'Botulax·全臉100單位', 'Botulax · Full Face 100u'), price: 116000 },
      { name: mi('ヒアルロン酸（Juvéderm・1cc）', '玻尿酸（Juvéderm系列·1cc）', '玻尿酸（Juvéderm系列·1cc）', 'Hyaluronic Acid (Juvéderm · 1cc)'), price: 148000 },
      { name: mi('ヒアルロン酸溶解', '玻尿酸溶解', '玻尿酸溶解', 'Hyaluronidase'), price: 60000 },
      { name: mi('Jalupro肌再生注射', 'Jalupro肌育注射', 'Jalupro肌育注射', 'Jalupro Skin Booster'), price: 166000 },
      { name: mi('SNEKOS', 'SNEKOS', 'SNEKOS', 'SNEKOS'), price: 66000 },
      { name: mi('水光注射（ベーシック）', '水光注射（基础）', '水光注射（基礎）', 'Aqua Glow (Basic)'), price: 118000 },
      { name: mi('水光+ボトックス', '水光+肉毒素', '水光+肉毒素', 'Aqua Glow + Botox'), price: 226000 },
      { name: mi('水光+幹細胞', '水光+干细胞', '水光+幹細胞', 'Aqua Glow + Stem Cell'), price: 304000 },
      { name: mi('水光+ボトックス+幹細胞', '水光+肉毒素+干细胞', '水光+肉毒素+幹細胞', 'Aqua Glow + Botox + Stem Cell'), price: 378000 },
      { name: mi('エクソソーム（凍結乾燥）', '干细胞外泌体（冻干）', '幹細胞外泌體（凍乾）', 'Exosome (Lyophilized)'), price: 186000 },
      { name: mi('エクソソーム（新鮮・2-3回）', '干细胞外泌体（新鲜·2-3次）', '幹細胞外泌體（新鮮·2-3次）', 'Exosome (Fresh · 2-3 Sessions)'), price: 760000 },
      { name: mi('脂肪溶解注射 Fat X Core（/cc）', '脂肪溶解注射 Fat X Core（/cc）', '脂肪溶解注射 Fat X Core（/cc）', 'Fat Dissolving Fat X Core (/cc)'), price: 16000 },
    ],
  },
  skincare: {
    title: mi('美容皮膚科（施術）', '皮肤管理', '皮膚管理', 'Skincare Treatments'),
    icon: <Droplets size={20} />,
    items: [
      { name: mi('LDM 水玉リフト・顔', 'LDM 水玉提升·面部', 'LDM 水玉提升·面部', 'LDM Aqua Lift · Face'), price: 42000 },
      { name: mi('LDM+幹細胞・顔', 'LDM+干细胞·面部', 'LDM+幹細胞·面部', 'LDM + Stem Cell · Face'), price: 52000 },
      { name: mi('LDM+幹細胞・顔+首', 'LDM+干细胞·面部+颈部', 'LDM+幹細胞·面部+頸部', 'LDM + Stem Cell · Face + Neck'), price: 66000 },
      { name: mi('Shopping Lift 20本', 'Shopping Lift 20线', 'Shopping Lift 20線', 'Shopping Lift 20 Threads'), price: 84000 },
      { name: mi('Shopping Lift 40本', 'Shopping Lift 40线', 'Shopping Lift 40線', 'Shopping Lift 40 Threads'), price: 156000 },
      { name: mi('Shopping Lift 60本', 'Shopping Lift 60线', 'Shopping Lift 60線', 'Shopping Lift 60 Threads'), price: 236000 },
      { name: mi('Shopping Lift 100本', 'Shopping Lift 100线', 'Shopping Lift 100線', 'Shopping Lift 100 Threads'), price: 396000 },
      { name: mi('Reverse Peel', 'Reverse Peel', 'Reverse Peel', 'Reverse Peel'), price: 36000 },
      { name: mi('Milano Repeel', 'Milano Repeel', 'Milano Repeel', 'Milano Repeel'), price: 30000 },
      { name: mi('Massage Peel', 'Massage Peel', 'Massage Peel', 'Massage Peel'), price: 30000 },
    ],
  },
  wellness: {
    title: mi('美容内科', '美容内科', '美容內科', 'Wellness & IV Therapy'),
    icon: <Pill size={20} />,
    items: [
      { name: mi('栄養分析・簡易版（34項目）', '营养分析·简易版（34项）', '營養分析·簡易版（34項）', 'Nutrition Analysis · Basic (34 Items)'), price: 44000 },
      { name: mi('栄養分析・標準版（64項目）', '营养分析·标准版（64项）', '營養分析·標準版（64項）', 'Nutrition Analysis · Standard (64 Items)'), price: 90000 },
      { name: mi('栄養分析・完全版（82項目）', '营养分析·完整版（82项）', '營養分析·完整版（82項）', 'Nutrition Analysis · Complete (82 Items)'), price: 118000 },
      { name: mi('美白点滴（600mg）', '美白点滴（600mg）', '美白點滴（600mg）', 'Whitening IV (600mg)'), price: 12000 },
      { name: mi('美白点滴（1200mg）', '美白点滴（1200mg）', '美白點滴（1200mg）', 'Whitening IV (1200mg)'), price: 18000 },
      { name: mi('高濃度ビタミンC点滴（10g）', '高浓度维C点滴（10g）', '高濃度維C點滴（10g）', 'High-Dose Vitamin C IV (10g)'), price: 14000 },
      { name: mi('高濃度ビタミンC点滴（20g）', '高浓度维C点滴（20g）', '高濃度維C點滴（20g）', 'High-Dose Vitamin C IV (20g)'), price: 26000 },
      { name: mi('高濃度ビタミンC点滴（30g）', '高浓度维C点滴（30g）', '高濃度維C點滴（30g）', 'High-Dose Vitamin C IV (30g)'), price: 38000 },
      { name: mi('脂肪燃焼点滴', '燃脂点滴', '燃脂點滴', 'Fat Burning IV'), price: 18000 },
      { name: mi('疲労回復点滴', '疲劳恢复点滴', '疲勞恢復點滴', 'Recovery IV'), price: 14000 },
      { name: mi('医師カスタム点滴', '医师定制点滴', '醫師定制點滴', 'Doctor Custom IV'), price: 50000 },
      { name: mi('エクソソーム点滴（凍結乾燥）', '外泌体点滴（冻干）', '外泌體點滴（凍乾）', 'Exosome IV (Lyophilized)'), price: 166000 },
      { name: mi('エクソソーム点滴（新鮮）', '外泌体点滴（新鲜）', '外泌體點滴（新鮮）', 'Exosome IV (Fresh)'), price: 700000 },
    ],
  },
  hairloss: {
    title: mi('薄毛治療・AGA', '生发治疗', '生髮治療', 'Hair Loss Treatment'),
    icon: <Sparkles size={20} />,
    items: [
      { name: mi('育毛カクテル注射（前/中/頭頂）', '生发鸡尾酒注射（前/中/顶）', '生髮雞尾酒注射（前/中/頂）', 'Hair Cocktail Injection (Front/Mid/Top)'), price: 116000 },
      { name: mi('育毛カクテル注射（全頭）', '生发鸡尾酒注射（全头）', '生髮雞尾酒注射（全頭）', 'Hair Cocktail Injection (Full Head)'), price: 220000 },
      { name: mi('エクソソーム頭皮注射（凍結乾燥）', '外泌体头皮注射（冻干）', '外泌體頭皮注射（凍乾）', 'Exosome Scalp Injection (Lyophilized)'), price: 178000 },
      { name: mi('エクソソーム頭皮注射（新鮮）', '外泌体头皮注射（新鲜）', '外泌體頭皮注射（新鮮）', 'Exosome Scalp Injection (Fresh)'), price: 700000 },
      { name: mi('育毛栄養セット（/月）', '生发营养套装（/月）', '生髮營養套裝（/月）', 'Hair Growth Supplement Set (/mo)'), price: 50760 },
      { name: mi('フィナステリド（/月）', '非那雄胺（/月）', '非那雄胺（/月）', 'Finasteride (/mo)'), price: 19600 },
    ],
  },
};

// ━━━━━━━━ 客户评价 ━━━━━━━━

const REVIEWS = [
  { name: mi('W 様', 'W 女士', 'W 女士', 'Ms. W'), loc: mi('上海', '上海', '上海', 'Shanghai'), treatment: 'SAI LIFT STANDARD', date: mi('2025年10月', '2025年10月', '2025年10月', 'Oct 2025'), text: mi('糸リフトの施術を受けました。効果がとても自然で、崔先生はとても経験豊富で、全過程安心でした。術後の回復も早く、友人から顔色が良くなったと言われましたが、手術したとは分からないそうです。', '做了线雕提升，效果非常自然。崔医生很有经验，整个过程很安心。术后恢复也很快，朋友都说我气色变好了但看不出做了手术。', '做了線雕提升，效果非常自然。崔醫生很有經驗，整個過程很安心。術後恢復也很快，朋友都說我氣色變好了但看不出做了手術。', 'Had a thread lift — very natural results. Dr. Sai is very experienced and I felt reassured throughout. Recovery was quick, friends say I look refreshed but can\'t tell I had anything done.'), stars: 5 },
  { name: mi('C 様', 'C 小姐', 'C 小姐', 'Ms. C'), loc: mi('台北', '台北', '台北', 'Taipei'), treatment: mi('二重+ほうれい線', '双眼皮+法令纹', '雙眼皮+法令紋', 'Double Eyelid + Nasolabial'), date: mi('2025年9月', '2025年9月', '2025年9月', 'Sep 2025'), text: mi('台北からわざわざ大阪に来ました。崔先生の美的センスは素晴らしく、とても自然なスタイルです。クリニックは梅田の地下街に直結で、雨の日でも濡れずに行けて、交通がとても便利です。', '从台北专程来大阪，崔医生的审美很棒，非常自然的风格。诊所在梅田地下街直结，下雨天也完全不用淋雨，交通太方便了。', '從台北專程來大阪，崔醫生的審美很棒，非常自然的風格。診所在梅田地下街直結，下雨天也完全不用淋雨，交通太方便了。', 'Came from Taipei specifically for this. Dr. Sai has great aesthetic sense — very natural style. The clinic connects directly to Umeda underground mall, super convenient even on rainy days.'), stars: 5 },
  { name: mi('L 様', 'L 先生', 'L 先生', 'Mr. L'), loc: mi('深圳', '深圳', '深圳', 'Shenzhen'), treatment: mi('ヒアルロン酸+ボトックス', '玻尿酸+肉毒素', '玻尿酸+肉毒素', 'HA + Botox'), date: mi('2025年11月', '2025年11月', '2025年11月', 'Nov 2025'), text: mi('初めて日本で美容施術を受けました。最初はとても緊張していましたが、全過程中国語の通訳付きで、先生もとても丁寧にすべてを説明してくれました。期待以上の体験でした。', '第一次在日本做医美，原本很紧张。好在全程有中文陪诊，医生也非常耐心地解释了所有细节。体验比预期好很多。', '第一次在日本做醫美，原本很緊張。好在全程有中文陪診，醫生也非常耐心地解釋了所有細節。體驗比預期好很多。', 'First time getting aesthetic treatment in Japan. Was nervous at first, but Chinese interpretation was available throughout and the doctor patiently explained everything. Far exceeded my expectations.'), stars: 5 },
  { name: mi('Z 様', 'Z 女士', 'Z 女士', 'Ms. Z'), loc: mi('香港', '香港', '香港', 'Hong Kong'), treatment: 'SAI LIFT PERFECT', date: mi('2025年8月', '2025年8月', '2025年8月', 'Aug 2025'), text: mi('他のクリニックで糸リフトを試しましたが、ここの引き上げ効果は確かに優れています。崔先生は顔の特徴に合わせて個別にデザインしてくれて、画一的ではありません。', '试过其他诊所的线雕，这里的提升效果确实更好。崔医生会根据面部特征做个性化设计，不是千篇一律的方案。', '試過其他診所的線雕，這裡的提升效果確實更好。崔醫生會根據面部特徵做個性化設計，不是千篇一律的方案。', 'Tried thread lifts at other clinics — the results here are noticeably better. Dr. Sai creates personalized designs based on facial features, not one-size-fits-all.'), stars: 5 },
  { name: mi('H 様', 'H 小姐', 'H 小姐', 'Ms. H'), loc: mi('北京', '北京', '北京', 'Beijing'), treatment: mi('水光注射+幹細胞', '水光+干细胞', '水光+幹細胞', 'Aqua Glow + Stem Cell'), date: mi('2025年12月', '2025年12月', '2025年12月', 'Dec 2025'), text: mi('水光注射と幹細胞エッセンスを受けました。肌の状態が明らかに改善しました。崔先生は栄養分析もしてくれて、体の内側からのケアを提案してくれました。とてもプロフェッショナルです。', '做了水光注射加干细胞精华，皮肤状态明显改善。崔医生还做了营养分析，建议从内到外调理，很专业。', '做了水光注射加幹細胞精華，皮膚狀態明顯改善。崔醫生還做了營養分析，建議從內到外調理，很專業。', 'Had aqua glow injection with stem cell essence — noticeable skin improvement. Dr. Sai also did a nutrition analysis, recommending inside-out wellness. Very professional.'), stars: 4 },
  { name: mi('L 様', 'L 先生', 'L 先生', 'Mr. L'), loc: mi('新竹', '新竹', '新竹', 'Hsinchu'), treatment: mi('AGA育毛治療', 'AGA生发治疗', 'AGA生髮治療', 'AGA Hair Treatment'), date: mi('2025年11月', '2025年11月', '2025年11月', 'Nov 2025'), text: mi('長い間悩んでいましたが、崔先生はとても率直なアドバイスをくれて、過度な勧誘は一切ありませんでした。カクテル注射3回後、確かに髪が濃くなりました。', '之前纠结了很久，来了之后崔医生给了很中肯的建议，没有过度推销。鸡尾酒注射三次后头发确实变浓密了。', '之前糾結了很久，來了之後崔醫生給了很中肯的建議，沒有過度推銷。雞尾酒注射三次後頭髮確實變濃密了。', 'Hesitated for a long time, but Dr. Sai gave honest advice with zero hard-selling. After 3 cocktail injection sessions, my hair is noticeably thicker.'), stars: 5 },
];

// ━━━━━━━━ FAQ ━━━━━━━━

const FAQ = [
  { q: mi('診療は予約が必要ですか？', '诊疗需要预约吗？', '診療需要預約嗎？', 'Do I need an appointment?'), a: mi('SAI CLINICは完全予約制です。当院の予約システムまたはLINEからご予約いただけます。当日予約をご希望の場合はお電話ください。', 'SAI CLINIC采用完全预约制。可通过我们的预约系统或LINE进行预约。如需当日预约，请电话联系。', 'SAI CLINIC採用完全預約制。可通過我們的預約系統或LINE進行預約。如需當日預約，請電話聯繫。', 'SAI CLINIC is by appointment only. You can book through our system or LINE. For same-day appointments, please call.') },
  { q: mi('中国語サービスは利用できますか？', '中文服务是否可用？', '中文服務是否可用？', 'Is Chinese service available?'), a: mi('崔医師は多言語に堪能で、中国語通訳サービスも提供しております。カウンセリングから術後の再診まで、言語の壁なく対応いたします。', '崔医生精通多国语言，我们也提供中文翻译服务。从咨询到术后回诊，确保全程无语言障碍。', '崔醫生精通多國語言，我們也提供中文翻譯服務。從諮詢到術後回診，確保全程無語言障礙。', 'Dr. Sai is multilingual, and we provide Chinese interpretation. From consultation to follow-up, we ensure zero language barriers.') },
  { q: mi('支払い方法は？', '支付方式有哪些？', '支付方式有哪些？', 'What payment methods are accepted?'), a: mi('現金、各種クレジットカード（Visa/Mastercard/JCB/Amex）、オンライン決済に対応。高額施術には医療分割払いもご利用いただけます。', '支持现金、各大信用卡（Visa/Mastercard/JCB/Amex）以及在线支付。大额手术可提供医疗分期。', '支持現金、各大信用卡（Visa/Mastercard/JCB/Amex）以及線上支付。大額手術可提供醫療分期。', 'Cash, major credit cards (Visa/Mastercard/JCB/Amex), and online payment. Medical installment plans available for larger procedures.') },
  { q: mi('糸リフト後、どのくらいで通常活動できますか？', '线雕手术后多久能正常活动？', '線雕手術後多久能正常活動？', 'How soon can I resume normal activities after thread lift?'), a: mi('糸リフト後は当日から通常活動が可能です。軽度の腫れは約1-2週間で消退します。術後1週間は激しい運動と大きな表情を避けることをお勧めします。', '线雕术后当天即可正常活动，约1-2周轻微肿胀消退。建议术后1周避免剧烈运动和大幅度面部表情。', '線雕術後當天即可正常活動，約1-2週輕微腫脹消退。建議術後1週避免劇烈運動和大幅度面部表情。', 'You can resume normal activities the same day. Mild swelling subsides in 1-2 weeks. Avoid intense exercise and exaggerated facial expressions for 1 week.') },
  { q: mi('効果はどのくらい持続しますか？', '手术效果能维持多久？', '手術效果能維持多久？', 'How long do results last?'), a: mi('糸リフトの効果は通常12-18ヶ月持続し、コラーゲン再生により一部の効果はさらに長く持続します。注射系は製品により3-12ヶ月です。', '线雕效果通常维持12-18个月，随着胶原蛋白持续再生，部分效果可持续更久。注射类项目根据产品不同，效果维持3-12个月。', '線雕效果通常維持12-18個月，隨著膠原蛋白持續再生，部分效果可持續更久。注射類項目根據產品不同，效果維持3-12個月。', 'Thread lift results typically last 12-18 months, with some effects lasting longer due to ongoing collagen regeneration. Injectables last 3-12 months depending on the product.') },
  { q: mi('大阪での美容施術にどのくらいの日数が必要ですか？', '来大阪做医美需要多长时间？', '來大阪做醫美需要多長時間？', 'How many days do I need in Osaka?'), a: mi('注射系は当日完了可能です。糸リフトは2-3日（カウンセリング+術後再診含む）。切開手術は内容により3-5日をお勧めします。', '大部分注射类项目当天即可完成。线雕手术建议预留2-3天（含咨询日和术后回诊）。开刀手术需根据具体项目安排，一般3-5天。', '大部分注射類項目當天即可完成。線雕手術建議預留2-3天（含諮詢日和術後回診）。開刀手術需根據具體項目安排，一般3-5天。', 'Most injectables can be done same-day. Thread lifts need 2-3 days (including consultation and follow-up). Surgical procedures typically require 3-5 days.') },
  { q: mi('オンライン相談はできますか？', '线上咨询是否可用？', '線上諮詢是否可用？', 'Is online consultation available?'), a: mi('はい。遠方のお客様にはオンラインビデオ相談を提供しております。相談後、来院日を直接ご予約いただけます。', '可以。对于远距离的客人，我们提供线上视频咨询服务。咨询后可直接预约来院日期。', '可以。對於遠距離的客人，我們提供線上視頻諮詢服務。諮詢後可直接預約來院日期。', 'Yes. We offer online video consultations for distant clients. You can book your visit date directly after the consultation.') },
];

// ━━━━━━━━ 组件 ━━━━━━━━

interface SaiClinicContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
  images?: SaiClinicImage[] | null;
}

export default function SaiClinicContent({ isGuideEmbed, guideSlug, images }: SaiClinicContentProps) {
  const lang = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuTab, setMenuTab] = useState<string>('surgery');

  const formatPrice = (price: number) => `¥${price.toLocaleString()}`;
  const getRefPrice = (price: number) => Math.ceil(price * 1.3 / 10000) * 10000;

  const checkoutBase = '/sai-clinic';
  /** 白标模式下，CTA 链接自动带上 ?guide= 参数 */
  const checkoutHref = (path: string) =>
    guideSlug ? `${path}?guide=${guideSlug}` : path;

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
    heroSlogan: mi('大阪で、より美しい自分に出会う', '在大阪，遇见更美的自己', '在大阪，遇見更美的自己', 'Meet a more beautiful you in Osaka'),
    heroDesc: mi('糸リフトを中心に、韓国最先端美学と日本精密医療を融合。崔煌植医師が直接診察、15年以上の経験、2,800名以上の華僑客様から信頼。全て中文サービス、安心の美容旅。', '以线雕提升为核心，融合韩国前沿美学与日本精密医疗。崔煌植医生亲诊，15年经验、2,800+华人客户信赖。全程中文服务，让变美之旅安心无忧。', '以線雕提升為核心，融合韓國前沿美學與日本精密醫療。崔煌植醫生親診，15年經驗、2,800+華人客戶信賴。全程中文服務，讓變美之旅安心無憂。', 'Centered on thread lift, combining Korean cutting-edge aesthetics with Japanese precision medicine. Dr. Sai personally diagnoses, 15+ years experience, trusted by 2,800+ Chinese clients. Full Chinese service.'),
    tag1: mi('糸リフト専門', '线雕专门', '線雕專門', 'Thread Lift Specialist'),
    tag2: mi('韓国美学', '韩式美学', '韓式美學', 'Korean Aesthetics'),
    tag3: mi('完全予約制', '完全预约制', '完全預約制', 'By Appointment Only'),
    tag4: mi('梅田直結', '梅田直结', '梅田直結', 'Umeda Direct Access'),
    viewAll: mi('全メニューを見る', '查看全部项目', '查看全部項目', 'View All Treatments'),
    stats1: mi('累計華僑客様', '累计服务华人客户', '累計服務華人客戶', 'Chinese clients served'),
    stats2: mi('客満足度', '客户满意度', '客戶滿意度', 'Customer satisfaction'),
    stats3: mi('美容外科臨床経験', '美容外科临床经验', '美容外科臨床經驗', 'Clinical experience'),
    whyTitle: mi('SAI CLINICを選ぶ理由', '选择 SAI CLINIC 的理由', '選擇 SAI CLINIC 的理由', 'Why Choose SAI CLINIC'),
    bookNow: mi('今すぐ予約', '立即预约', '立即預約', 'Book Now'),
    location: mi('大阪梅田', '大阪梅田', '大阪梅田', 'Osaka Umeda'),
    // Hero grid
    yearsExp: mi('年美容外科経験', '年医美经验', '年醫美經驗', 'years aesthetic exp.'),
    jsas: mi('日本美容外科学会', '日本美容外科学会', '日本美容外科學會', 'Japan Society of Aesthetic Surgery'),
    kaas: mi('韓国美容外科医学会', '韩国美容外科学会', '韓國美容外科學會', 'Korean Academy of Aesthetic Surgery'),
    umedaAccess: mi('阪急直結・地下通路', '阪急直结·地下通道', '阪急直結·地下通道', 'Hankyu direct · underground'),
    stats4: mi('医療事故記録', '医疗事故记录', '醫療事故記錄', 'Medical incidents'),
    // Promo
    promoCampaign: mi('2026 春キャンペーン', '2026 春季优惠', '2026 春季優惠', '2026 Spring Campaign'),
    promoDesc: mi('全プロジェクト一括パッケージ価格 · 3月末まで', '全项目一站式套餐价格 · 3月末截止', '全項目一站式套餐價格 · 3月末截止', 'All-in-one package pricing · Until end of March'),
    promoQuota: mi('今月残り枠：', '本月余剩名额：', '本月餘剩名額：', 'Slots remaining: '),
    promoSlots: mi('7名', '7名', '7名', '7'),
    // Doctor
    doctorSectionTitle: mi('院長紹介', '院长介绍', '院長介紹', 'About the Doctor'),
    doctorPhilosophy: mi('本気であなたのことを考える\n心のこもった美容医療をお届けしたい', '真心为您着想\n用心提供美容医疗服务', '真心為您著想\n用心提供美容醫療服務', 'Thinking sincerely about you\nDelivering heartfelt aesthetic medicine'),
    doctorMsg1: mi('多くの美容クリニックが生まれる中、流れ作業的な施術や機械的な対応ではなく、患者様お一人おひとりに丁寧に寄り添い、その方にとって本当に必要な施術、心のこもった美容医療をお届けしたい。大手クリニックで経験を積んだからこそ、そう強く思うようになりました。', '在众多美容诊所涌现的当下，我不想流水线式地操作，而是希望用心陪伴每一位患者，提供真正适合的治疗方案。正是因为在大型诊所积累了经验，才更加坚定了这个信念。', '在眾多美容診所湧現的當下，我不想流水線式地操作，而是希望用心陪伴每一位患者，提供真正適合的治療方案。正是因為在大型診所積累了經驗，才更加堅定了這個信念。', 'Among the many aesthetic clinics today, I want to provide sincere, personalized care — not assembly-line treatments. Having gained experience at major clinics, I feel this conviction more strongly than ever.'),
    doctorMsg2: mi('私たちが何よりも大切にしているのは、患者様との信頼関係です。誠実な対応で、信頼し合える心の関係を最優先に、長く関係を築いていきたいと考えています。', '我们最珍视的是与患者之间的信赖关系。以真诚的态度，将心与心的信赖放在首位，建立长久的医患关系。', '我們最珍視的是與患者之間的信賴關係。以真誠的態度，將心與心的信賴放在首位，建立長久的醫患關係。', 'What we value most is trust with our patients. With sincerity, we prioritize building lasting relationships founded on mutual trust.'),
    doctorMsg3: mi('患者様にとって、肩肘張らずリラックスして気軽に通える場所でありたい。そして当院で過ごす時間、そのすべてが楽しかったと思ってもらいたいから。', '我们希望成为患者可以轻松自在前来的场所。希望在诊所度过的每一刻，都能成为愉快的体验。', '我們希望成為患者可以輕鬆自在前來的場所。希望在診所度過的每一刻，都能成為愉快的體驗。', 'We want to be a place where patients feel relaxed and comfortable. We hope every moment spent at our clinic is a pleasant experience.'),
    doctorMsg4: mi('本気であなたのことを考えるクリニックとして、すべての女性が年齢を重ねることを恐れず、前向きに自分らしく輝けるよう、私たちが全力でサポートいたします。', '作为真心为您着想的诊所，我们全力支持每一位女性无惧年龄、积极自信地绽放自己的光芒。', '作為真心為您著想的診所，我們全力支持每一位女性無懼年齡、積極自信地綻放自己的光芒。', 'As a clinic that truly cares about you, we fully support every woman in embracing aging with confidence and shining in their own way.'),
    doctorMsg5: mi('お悩みが少しでもあるようでしたら、ぜひお気軽にご来院ください。', '如果您有任何烦恼，欢迎随时来院咨询。', '如果您有任何煩惱，歡迎隨時來院諮詢。', 'If you have any concerns at all, please feel free to visit us.'),
    careerLabel: mi('経歴', '经历', '經歷', 'Career'),
    credLabel: mi('資格・所属学会', '资质·所属学会', '資質·所屬學會', 'Certifications'),
    career1: mi('三重大学医学部 卒業', '三重大学医学部 毕业', '三重大學醫學部 畢業', 'Mie University School of Medicine'),
    career2: mi('済生会千里病院 形成外科・皮膚科・内科 勤務', '济生会千里医院 整形外科·皮肤科·内科', '濟生會千里醫院 整形外科·皮膚科·內科', 'Saiseikai Senri Hospital — Plastic Surgery, Dermatology, Internal Medicine'),
    career3: mi('湘南美容クリニック 都市部大型院 院長', '湘南美容诊所 都市大型分院 院长', '湘南美容診所 都市大型分院 院長', 'Shonan Beauty Clinic — Urban Major Branch Director'),
    career4: mi('美容クリニック技術指導医', '美容诊所技术指导医师', '美容診所技術指導醫師', 'Aesthetic Clinic Technical Supervisor'),
    career5: mi('崔先生の糸リフト塾 代表', '"崔医生线雕讲堂" 主讲', '「崔醫生線雕講堂」主講', 'Director, Dr. Sai\'s Thread Lift Academy'),
    career6: mi('化粧品 imini 監修医', '化妆品品牌 imini 监修医师', '化妝品品牌 imini 監修醫師', 'Medical Supervisor, imini Cosmetics'),
    career7: mi('SAI CLINIC 院長', 'SAI CLINIC 院长', 'SAI CLINIC 院長', 'SAI CLINIC Director'),
    cred1: mi('日本美容外科学会（JSAS）', '日本美容外科学会（JSAS）', '日本美容外科學會（JSAS）', 'Japan Society of Aesthetic Surgery (JSAS)'),
    cred2: mi('韓国美容外科医学会（KAAS）', '韩国美容外科学会（KAAS）', '韓國美容外科學會（KAAS）', 'Korean Academy of Aesthetic Surgery (KAAS)'),
    cred3: mi('アラガン・ボトックスビスタ認定医', 'Allergan BOTOX VISTA 认证医师', 'Allergan BOTOX VISTA 認證醫師', 'Allergan BOTOX VISTA Certified'),
    cred4: mi('アラガン・ジュビダームビスタ認定医', 'Allergan JUVÉDERM VISTA 认证医师', 'Allergan JUVÉDERM VISTA 認證醫師', 'Allergan JUVÉDERM VISTA Certified'),
    cred5: mi('日本救急医学会 ICLSインストラクター認定医', '日本急救医学会 ICLS 认证讲师', '日本急救醫學會 ICLS 認證講師', 'Japan Association for Acute Medicine ICLS Instructor'),
    // Features
    feat1Title: mi('糸リフト専門クリニック', '线雕提升专门诊所', '線雕提升專門診所', 'Thread Lift Specialist Clinic'),
    feat1Desc: mi('糸リフトをコア技術とし、崔医師はこの分野で15年以上の経験と数千例の成功実績を持っています。独自のSAI LIFTシリーズで、体験から完美まで多様なニーズに対応。', '以线雕提升为核心技术，崔医生在该领域拥有超过15年经验和数千例成功案例。独创SAI LIFT系列，从体验到完美，满足不同需求。', '以線雕提升為核心技術，崔醫生在該領域擁有超過15年經驗和數千例成功案例。獨創SAI LIFT系列，從體驗到完美，滿足不同需求。', 'Thread lifting as our core expertise — Dr. Sai has 15+ years of experience and thousands of successful cases. Our original SAI LIFT series offers options from trial to perfect.'),
    feat2Title: mi('内外兼修・オーダーメイド', '内外兼修·个性定制', '內外兼修·個性定制', 'Inside-Out · Custom Design'),
    feat2Desc: mi('外見の美容手術だけでなく、分子栄養学分析（82項目血液検査）で体の内側から健康をケア。一人ひとりに合わせた美と健康の総合プランをご提案します。', '不仅提供外在美容手术，还通过分子营养学分析（82项血液检测），从内部调理健康。为每位客人制定全方位的美丽健康计划。', '不僅提供外在美容手術，還通過分子營養學分析（82項血液檢測），從內部調理健康。為每位客人制定全方位的美麗健康計劃。', 'Beyond external procedures, we offer molecular nutrition analysis (82-item blood test) for internal wellness. A comprehensive beauty & health plan tailored to each client.'),
    feat1Tags: [mi('SAI LIFT TRY', 'SAI LIFT TRY', 'SAI LIFT TRY', 'SAI LIFT TRY'), mi('STANDARD', 'STANDARD', 'STANDARD', 'STANDARD'), mi('PERFECT', 'PERFECT', 'PERFECT', 'PERFECT')],
    feat2Tags: [mi('栄養分析', '营养分析', '營養分析', 'Nutrition Analysis'), mi('内服治療', '内服治疗', '內服治療', 'Oral Treatment'), mi('点滴療法', '点滴疗法', '點滴療法', 'IV Therapy')],
    // Service value
    serviceTitle: mi('ワンストップ美容医療', '一站式医美服务', '一站式醫美服務', 'One-Stop Aesthetic Service'),
    serviceDesc: mi('お客様の費用には以下のサービスが全て含まれています — 美しくなることだけに集中してください', '您的费用包含以下全部服务 —— 让您只需专注于变美，其余一切交给我们', '您的費用包含以下全部服務 —— 讓您只需專注於變美，其餘一切交給我們', 'Your fee includes all the following services — just focus on becoming more beautiful'),
    svc1Title: mi('全て中国語サービス', '全程中文服务', '全程中文服務', 'Full Chinese Service'),
    svc1Desc: mi('ご予約から術後まで全て中国語通訳付き、言語の壁はございません', '从预约到术后，全程中文翻译陪诊，无任何语言障碍', '從預約到術後，全程中文翻譯陪診，無任何語言障礙', 'Chinese interpretation from booking to post-op, zero language barriers'),
    svc2Title: mi('予約・スケジュール保証', '预约·排期保障', '預約·排期保障', 'Scheduling Guarantee'),
    svc2Desc: mi('クリニックと直接連携し、来日スケジュールと診療を完璧に調整', '与诊所直连排期，确保您来日本的时间与诊疗完美衔接', '與診所直連排期，確保您來日本的時間與診療完美銜接', 'Direct scheduling with the clinic ensures perfect alignment with your Japan visit'),
    svc3Title: mi('術後リモートフォロー', '术后远程跟进', '術後遠程跟進', 'Remote Post-Op Follow-Up'),
    svc3Desc: mi('帰国後も回復状況を継続追跡、問題があれば崔医師と即時連絡', '回国后持续追踪恢复状况，如有问题即时与崔医生沟通', '回國後持續追蹤恢復狀況，如有問題即時與崔醫生溝通', 'Continuous recovery tracking after returning home, instant communication with Dr. Sai if needed'),
    svc4Title: mi('来院時全程同行', '到院全程陪同', '到院全程陪同', 'Full Clinic Escort'),
    svc4Desc: mi('専属スタッフが同行し、ご要望の伝達をサポート、医患コミュニケーションの正確性を確保', '专人陪诊，协助表达需求，确保医患沟通精准无误', '專人陪診，協助表達需求，確保醫患溝通精準無誤', 'Dedicated staff escorts you, ensuring precise doctor-patient communication'),
    svc5Title: mi('明朗会計・追加料金なし', '费用透明·无隐形消费', '費用透明·無隱形消費', 'Transparent Pricing'),
    svc5Desc: mi('全ての費用は一括払い、院内で追加料金は一切発生しません', '所有费用一次付清，诊所内不会产生任何额外收费', '所有費用一次付清，診所內不會產生任何額外收費', 'All fees paid upfront, no additional charges at the clinic'),
    svc6Title: mi('宿泊・交通サポート', '住宿·交通协助', '住宿·交通協助', 'Accommodation & Transport'),
    svc6Desc: mi('梅田周辺のおすすめ宿泊施設のご紹介、交通案内・送迎のご手配', '推荐梅田周边合适住宿，提供交通指引及接送安排建议', '推薦梅田周邊合適住宿，提供交通指引及接送安排建議', 'Hotel recommendations near Umeda, transport guidance and transfer arrangements'),
    // Gallery
    galleryTitle: mi('院内ギャラリー', '诊所环境', '診所環境', 'Clinic Gallery'),
    galleryDesc: mi('大阪梅田 YANMAR ビル B2F、プレミアムプライベート診療空間', '位于大阪梅田 YANMAR 大楼 B2F，高端私密的诊疗空间', '位於大阪梅田 YANMAR 大樓 B2F，高端私密的診療空間', 'Premium private treatment space in YANMAR Building B2F, Osaka Umeda'),
    // Case
    caseTitle: mi('症例紹介', '症例介绍', '症例介紹', 'Case Results'),
    caseDesc: mi('糸リフト施術の実際の効果（写真掲載は患者様のご同意済み）', '线雕提升实际效果（照片经患者同意刊登）', '線雕提升實際效果（照片經患者同意刊登）', 'Actual thread lift results (photos published with patient consent)'),
    caseDisclaimer: mi('※ 施術効果には個人差がございます。詳しくはカウンセリング時にご説明いたします。', '※ 手术效果因人而异，详情请在咨询时说明。', '※ 手術效果因人而異，詳情請在諮詢時說明。', '※ Results vary by individual. Details will be explained during consultation.'),
    // Thread Lift packages
    threadLiftTitle: mi('SAI LIFT 糸リフトシリーズ', 'SAI LIFT 线雕提升系列', 'SAI LIFT 線雕提升系列', 'SAI LIFT Thread Lift Series'),
    threadLiftDesc: mi('看板メニューの糸リフト、3つのプランから選択可能', '招牌线雕提升项目，三档可选', '招牌線雕提升項目，三檔可選', 'Our signature thread lift — choose from 3 plans'),
    monthlyQuota: mi('今月の予約枠 残り 7 名', '本月预约名额余剩 7 名', '本月預約名額餘剩 7 名', '7 slots remaining this month'),
    popular: mi('人気', '人气', '人氣', 'Popular'),
    separateBooking: mi('個別予約', '分别预约', '分別預約', 'Book separately'),
    save: mi('お得', '省', '省', 'Save'),
    includedServices: mi('税込・中文通訳・術後フォロー含む', '含税·含中文陪诊·含术后跟进', '含稅·含中文陪診·含術後跟進', 'Tax incl. · Chinese service · Post-op follow-up'),
    refPrice: mi('参考価格', '参考价', '參考價', 'Ref. price'),
    // Combo
    comboTitle: mi('人気コンビネーションセット', '人气组合套餐', '人氣組合套餐', 'Popular Combination Sets'),
    comboDesc: mi('特定のお悩みに対する総合ソリューション', '针对特定问题的综合解决方案', '針對特定問題的綜合解決方案', 'Comprehensive solutions for specific concerns'),
    // Eye/Nose
    eyeTitle: mi('目元整形', '眼部整形', '眼部整形', 'Eye Surgery'),
    noseTitle: mi('鼻整形', '鼻部整形', '鼻部整形', 'Nose Surgery'),
    // More
    moreTitle: mi('その他のメニュー', '更多服务项目', '更多服務項目', 'More Treatments'),
    // Price list
    priceListTitle: mi('全メニュー料金表', '完整价格一览', '完整價格一覽', 'Full Price List'),
    priceListDesc: mi('全メニュー価格（税込・サービス料含む）', '所有项目价格（含税·含服务费）', '所有項目價格（含稅·含服務費）', 'All treatment prices (tax & service included)'),
    itemCount: mi('メニュー', '项目', '項目', 'items'),
    // Flow
    flowTitle: mi('施術の流れ', '治疗流程', '治療流程', 'Treatment Flow'),
    flowDesc: mi('完全予約制・全て中国語サービス', '完全预约制·全程中文服务', '完全預約制·全程中文服務', 'By appointment · Full Chinese service'),
    flow1: mi('予約相談', '预约咨询', '預約諮詢', 'Book Consultation'),
    flow1Desc: mi('オンラインまたはLINEでご予約、来院日を確定', '通过线上系统或LINE预约，确定来院日期', '通過線上系統或LINE預約，確定來院日期', 'Book via online system or LINE, confirm visit date'),
    flow2: mi('対面カウンセリング', '面诊方案', '面診方案', 'In-Person Consultation'),
    flow2Desc: mi('崔医師が直接対面診察、個別治療プランを策定', '崔医生亲自面诊，制定个性化治疗方案', '崔醫生親自面診，制定個性化治療方案', 'Dr. Sai personally consults and designs a custom treatment plan'),
    flow3: mi('確認・お支払い', '确认付款', '確認付款', 'Confirm & Pay'),
    flow3Desc: mi('施術内容と費用を確認、同意書にサイン', '确认治疗内容和费用，签署知情同意书', '確認治療內容和費用，簽署知情同意書', 'Confirm treatment details and fees, sign consent form'),
    flow4: mi('施術', '施术治疗', '施術治療', 'Treatment'),
    flow4Desc: mi('全過程コミュニケーション可能、いつでもフィードバック', '全程语音沟通，随时反馈感受', '全程語音溝通，隨時反饋感受', 'Full communication throughout, real-time feedback'),
    flow5: mi('アフターケア', '术后跟进', '術後跟進', 'Aftercare'),
    flow5Desc: mi('術後ケアガイド提供、フォローアップ診察手配', '提供术后护理指导，安排回诊复查', '提供術後護理指導，安排回診復查', 'Post-op care guidance and follow-up appointment'),
    // Access
    accessTitle: mi('アクセス', '交通指南', '交通指南', 'Access'),
    addressTitle: mi('クリニック所在地', '诊所地址', '診所地址', 'Clinic Address'),
    hours: mi('診療時間：9:00 - 18:00', '营业时间：9:00 - 18:00', '營業時間：9:00 - 18:00', 'Hours: 9:00 - 18:00'),
    nearestStation: mi('最寄り駅', '最近车站', '最近車站', 'Nearest Stations'),
    sta1: mi('阪急梅田駅', '阪急梅田站', '阪急梅田站', 'Hankyu Umeda Sta.'), sta1Time: mi('1分', '1分钟', '1分鐘', '1 min'), sta1Line: mi('阪急線', '阪急线', '阪急線', 'Hankyu Line'), sta1Note: mi('地下通路直結', '地下通道直结', '地下通道直結', 'Underground direct access'),
    sta2: mi('JR大阪駅', 'JR大阪站', 'JR大阪站', 'JR Osaka Sta.'), sta2Time: mi('3分', '3分钟', '3分鐘', '3 min'), sta2Line: mi('JR線', 'JR线', 'JR線', 'JR Line'),
    sta3: mi('御堂筋線梅田駅', '御堂筋线梅田站', '御堂筋線梅田站', 'Midosuji Umeda Sta.'), sta3Time: mi('3分', '3分钟', '3分鐘', '3 min'), sta3Line: mi('大阪メトロ', '大阪Metro', '大阪Metro', 'Osaka Metro'),
    sta4: mi('谷町線東梅田駅', '谷町线东梅田站', '谷町線東梅田站', 'Tanimachi Higashi-Umeda'), sta4Time: mi('5分', '5分钟', '5分鐘', '5 min'), sta4Line: mi('大阪メトロ', '大阪Metro', '大阪Metro', 'Osaka Metro'),
    sta5: mi('阪神梅田駅', '阪神梅田站', '阪神梅田站', 'Hanshin Umeda Sta.'), sta5Time: mi('5分', '5分钟', '5分鐘', '5 min'), sta5Line: mi('阪神線', '阪神线', '阪神線', 'Hanshin Line'),
    // Reviews
    reviewsTitle: mi('お客様の声', '客户评价', '客戶評價', 'Client Reviews'),
    reviewsDesc: mi('2,800名以上のお客様からのリアルな体験談', '来自2,800+客户的真实体验反馈', '來自2,800+客戶的真實體驗反饋', 'Real feedback from 2,800+ clients'),
    // Transformation
    transformTitle: mi('迷いから自信への変化', '从犹豫到自信的蜕变', '從猶豫到自信的蛻變', 'From Hesitation to Confidence'),
    transformBefore: mi('「日本で美容施術、言葉が通じなかったらどうしよう？」「追加料金を取られないかな？」「自然な効果になるかな？」—— 初めてご相談いただくお客様は皆、同じ不安をお持ちです。', '"在日本做医美语言不通怎么办？""价格会不会被加收？""效果自然吗？"—— 每一位第一次咨询的客人，都有同样的顾虑。', '「在日本做醫美語言不通怎麼辦？」「價格會不會被加收？」「效果自然嗎？」—— 每一位第一次諮詢的客人，都有同樣的顧慮。', '"What if there\'s a language barrier?" "Will I be overcharged?" "Will results look natural?" — Every first-time client shares these concerns.'),
    transformDuring: mi('全過程中国語対応、崔医師が直接プランを設計、明朗会計で追加料金なし、術後も継続フォロー —— 日本での美容施術はこんなに安心できるのです。', '全程中文沟通、崔医生亲自设计方案、费用透明无隐形消费、术后持续追踪 —— 原来在日本做医美可以这么安心。', '全程中文溝通、崔醫生親自設計方案、費用透明無隱形消費、術後持續追蹤 —— 原來在日本做醫美可以這麼安心。', 'Full Chinese communication, Dr. Sai personally designs your plan, transparent pricing, ongoing post-op tracking — aesthetic treatment in Japan can be this reassuring.'),
    transformAfter: mi('「友人に顔色が良くなったと言われた」「超自然で全く分からない」「次も崔先生のところに来る」—— これが2,800名以上のお客様のリアルな声です。', '"朋友都说我气色好了""效果超自然，完全看不出""下次还来崔医生这里" —— 这就是2,800+客户的真实心声。', '「朋友都說我氣色好了」「效果超自然，完全看不出」「下次還來崔醫生這裡」—— 這就是2,800+客戶的真實心聲。', '"Friends say I look refreshed" "So natural, completely undetectable" "Coming back to Dr. Sai next time" — Real words from 2,800+ clients.'),
    // FAQ
    faqTitle: mi('よくあるご質問', '常见问题', '常見問題', 'FAQ'),
    // CTA
    ctaTitle: mi('もう待たなくていい、美しさを先延ばしにしないで', '不要再等了，美丽不应该被推迟', '不要再等了，美麗不應該被推遲', "Don't wait — beauty shouldn't be delayed"),
    ctaDesc: mi('崔煌植医師があなた専用のプランを策定。オンライン相談から術後フォローまで、全て中国語サービス。', '崔煌植医生亲自为您制定专属方案。从线上咨询到术后跟进，全程中文服务。', '崔煌植醫生親自為您制定專屬方案。從線上諮詢到術後跟進，全程中文服務。', 'Dr. Sai personally creates your exclusive plan. Full Chinese service from online consultation to post-op follow-up.'),
    ctaQuota: mi('今月の予約枠に限りがあります · 2週間前のご予約をお勧めします', '本月预约名额有限 · 建议提前2周预约', '本月預約名額有限 · 建議提前2週預約', 'Limited slots this month · Book 2 weeks in advance'),
    ctaButton: mi('全メニューを見る · 今すぐ予約', '查看全部项目 · 立即预约', '查看全部項目 · 立即預約', 'View All Treatments · Book Now'),
    ctaNote: mi('相談無料 · 強制消費なし · ご不満の場合は全額返金', '咨询免费 · 无任何强制消费 · 不满意可全额退款', '諮詢免費 · 無任何強制消費 · 不滿意可全額退款', 'Free consultation · No pressure · Full refund if unsatisfied'),
    // Contact
    contactTitle: mi('お問い合わせ', '联系我们', '聯繫我們', 'Contact Us'),
    // Floating CTA
    floatPromo: mi('春キャンペーン', '春季优惠', '春季優惠', 'Spring Sale'),
    floatSlots: mi('残り7枠', '余剩7名额', '餘剩7名額', '7 slots left'),
  };

  return (
    <div className="animate-fade-in-up">

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
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
                      <div className="text-[11px] text-gray-300">{t(TR.yearsExp, lang)}</div>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-white/10">
                    <Image src={galleryImages[2]?.src || `${SAI}/aboutGalleryImg3.jpg`} alt={galleryImages[2]?.alt || ''} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">JSAS</div>
                      <div className="text-[11px] text-gray-300">{t(TR.jsas, lang)}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-white/10">
                    <Image src={conceptImages[0]?.src || `${SAI}/aboutConcept1.jpg`} alt={conceptImages[0]?.alt || ''} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">KAAS</div>
                      <div className="text-[11px] text-gray-300">{t(TR.kaas, lang)}</div>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10">
                    <Image src={heroGridImages[1]?.src || `${SAI}/topFvImg03.jpg`} alt={heroGridImages[1]?.alt || ''} fill className="object-cover" quality={75} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">{t(TR.location, lang)}</div>
                      <div className="text-[11px] text-gray-300">{t(TR.umedaAccess, lang)}</div>
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
              <div className="text-[11px] text-gray-500 mt-1">{t(TR.stats4, lang)}</div>
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
              <span className="text-rose-400 font-bold">{t(TR.promoCampaign, lang)}</span>
              <span className="mx-2 text-gray-600">|</span>
              <span className="text-gray-300">{t(TR.promoDesc, lang)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-1.5 rounded-full">
            <Clock size={12} />
            {t(TR.promoQuota, lang)}<span className="text-rose-400">{t(TR.promoSlots, lang)}</span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 2. 医生介绍 ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">Doctor</span>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.doctorSectionTitle, lang)}</h2>
          </div>

          {/* Philosophy heading */}
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug whitespace-pre-line">
              {t(TR.doctorPhilosophy, lang)}
            </h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: secondary photo + message */}
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-8 aspect-[4/5]">
                <Image src={`${SAI}/aboutDoctorImg2.jpg`} alt="崔煌植 院長" fill className="object-cover" quality={80} />
              </div>
              <div className="space-y-5 text-[15px] text-gray-600 leading-[1.9]">
                <p>{t(TR.doctorMsg1, lang)}</p>
                <p>{t(TR.doctorMsg2, lang)}</p>
                <p>{t(TR.doctorMsg3, lang)}</p>
                <p>{t(TR.doctorMsg4, lang)}</p>
                <p>{t(TR.doctorMsg5, lang)}</p>
              </div>
            </div>

            {/* Right: main doctor photo + name + credentials */}
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-8 aspect-[3/4]">
                <Image src={doctorAvatar?.src || `${SAI}/doctor.jpg`} alt={doctorAvatar?.alt || '崔煌植 院長'} fill className="object-cover" quality={80} />
              </div>

              {/* Signature + Name */}
              <div className="text-center mb-10">
                <Image src={doctorSign?.src || `${SAI}/sign.png`} alt={doctorSign?.alt || '崔煌植 签名'} width={160} height={50} className="mx-auto mb-3 opacity-70" quality={75} />
                <h4 className="text-2xl font-bold text-gray-900 tracking-wide">崔 煌植</h4>
                <p className="text-sm text-gray-500 mt-1">Sai Koshoku</p>
              </div>

              {/* Career */}
              <div className="mb-8">
                <h5 className="text-xs tracking-widest text-rose-500 uppercase mb-4">{t(TR.careerLabel, lang)}</h5>
                <div className="space-y-2.5 text-sm text-gray-600">
                  {[TR.career1, TR.career2, TR.career3, TR.career4, TR.career5, TR.career6, TR.career7].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 shrink-0"></span>
                      <span>{t(item, lang)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credentials */}
              <div>
                <h5 className="text-xs tracking-widest text-rose-500 uppercase mb-4">{t(TR.credLabel, lang)}</h5>
                <div className="space-y-2.5 text-sm text-gray-600">
                  {[TR.cred1, TR.cred2, TR.cred3, TR.cred4, TR.cred5].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                      <span>{t(item, lang)}</span>
                    </div>
                  ))}
                </div>
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.whyTitle, lang)}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                img: featureImages[0]?.src || `${SAI}/topFeatureImg01.jpg`,
                imgAlt: featureImages[0]?.alt || '',
                title: t(TR.feat1Title, lang),
                desc: t(TR.feat1Desc, lang),
                tags: TR.feat1Tags,
              },
              {
                img: featureImages[2]?.src || `${SAI}/aboutFeatureItem2.jpg`,
                imgAlt: featureImages[2]?.alt || '',
                title: t(TR.feat2Title, lang),
                desc: t(TR.feat2Desc, lang),
                tags: TR.feat2Tags,
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
                      <span key={j} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">{t(tag, lang)}</span>
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.serviceTitle, lang)}</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              {t(TR.serviceDesc, lang)}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Globe size={22} className="text-rose-500" />, title: t(TR.svc1Title, lang), desc: t(TR.svc1Desc, lang) },
              { icon: <MessageCircle size={22} className="text-blue-500" />, title: t(TR.svc2Title, lang), desc: t(TR.svc2Desc, lang) },
              { icon: <Stethoscope size={22} className="text-purple-500" />, title: t(TR.svc3Title, lang), desc: t(TR.svc3Desc, lang) },
              { icon: <Users size={22} className="text-teal-500" />, title: t(TR.svc4Title, lang), desc: t(TR.svc4Desc, lang) },
              { icon: <Shield size={22} className="text-amber-500" />, title: t(TR.svc5Title, lang), desc: t(TR.svc5Desc, lang) },
              { icon: <MapPin size={22} className="text-green-500" />, title: t(TR.svc6Title, lang), desc: t(TR.svc6Desc, lang) },
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.galleryTitle, lang)}</h2>
            <p className="text-gray-500 text-sm mt-2">{t(TR.galleryDesc, lang)}</p>
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.caseTitle, lang)}</h2>
            <p className="text-gray-500 text-sm mt-2">{t(TR.caseDesc, lang)}</p>
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
          <p className="text-center text-[11px] text-gray-400 mt-8">{t(TR.caseDisclaimer, lang)}</p>
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
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2">{t(TR.threadLiftTitle, lang)}</h2>
                <p className="text-gray-300 text-sm mt-2 max-w-md">{t(TR.threadLiftDesc, lang)}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 backdrop-blur border border-rose-400/30 rounded-full text-xs font-bold text-rose-300">
                  <Clock size={12} /> {t(TR.monthlyQuota, lang)}
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
                {pkg.popular && <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">{t(TR.popular, lang)}</div>}
                <div className="mb-4">
                  <h4 className={`text-xl font-bold ${pkg.flagship ? 'text-amber-400' : pkg.popular ? 'text-rose-700' : 'text-gray-900'}`}>{t(pkg.name, lang)}</h4>
                  <div className="mt-2">
                    <span className={`text-xs line-through ${pkg.flagship ? 'text-gray-500' : 'text-gray-400'}`}>{t(TR.separateBooking, lang)} {formatPrice(getRefPrice(pkg.price))}</span>
                  </div>
                  <p className={`text-2xl font-bold ${pkg.flagship ? 'text-amber-400' : pkg.popular ? 'text-rose-700' : 'text-gray-900'}`}>{formatPrice(pkg.price)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-1 ${pkg.flagship ? 'bg-amber-500/20 text-amber-400' : 'bg-green-100 text-green-700'}`}>
                    {t(TR.save, lang)} {formatPrice(getRefPrice(pkg.price) - pkg.price)}
                  </span>
                  <p className={`text-[10px] mt-1 ${pkg.flagship ? 'text-gray-500' : 'text-gray-400'}`}>{t(TR.includedServices, lang)}</p>
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
                  href={checkoutHref(`${checkoutBase}/${pkg.slug}`)}
                  className={`w-full py-3 text-sm font-bold rounded-lg transition text-center block ${
                    pkg.flagship
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : pkg.popular
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(TR.bookNow, lang)}
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.comboTitle, lang)}</h2>
            <p className="text-gray-500 text-sm mt-2">{t(TR.comboDesc, lang)}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMBO_PACKAGES.map((pkg) => (
              <div key={pkg.slug} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition hover:-translate-y-1 flex flex-col">
                <h4 className="font-bold text-gray-900 mb-1">{t(pkg.name, lang)}</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{t(pkg.desc, lang)}</p>
                <div className="mb-3">
                  <span className="text-xs line-through text-gray-400">{t(TR.separateBooking, lang)} {formatPrice(getRefPrice(pkg.price))}</span>
                  <p className="text-xl font-bold text-gray-900">{formatPrice(pkg.price)}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">{t(TR.save, lang)} {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                </div>
                <Link href={checkoutHref(`${checkoutBase}/${pkg.slug}`)} className="w-full py-2 bg-rose-500 text-white text-sm font-bold rounded-lg hover:bg-rose-600 transition text-center block">{t(TR.bookNow, lang)}</Link>
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
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{t(TR.eyeTitle, lang)}</h3>
              </div>
              <div className="space-y-4">
                {EYE_PACKAGES.map((pkg) => (
                  <div key={pkg.slug} className="bg-purple-50/50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">{t(pkg.name, lang)}</h4>
                      <p className="text-sm text-gray-500">{t(pkg.desc, lang)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs line-through text-gray-400 block">{t(TR.refPrice, lang)} {formatPrice(getRefPrice(pkg.price))}</span>
                      <p className="text-xl font-bold text-purple-700">{formatPrice(pkg.price)}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold inline-block mb-1">{t(TR.save, lang)} {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                      <Link href={checkoutHref(`${checkoutBase}/${pkg.slug}`)} className="inline-block mt-1 px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition">{t(TR.bookNow, lang)}</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Nose */}
            <div>
              <div className="mb-8">
                <span className="text-sm tracking-widest text-blue-500 uppercase">Nose Surgery</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{t(TR.noseTitle, lang)}</h3>
              </div>
              <div className="space-y-4">
                {NOSE_PACKAGES.map((pkg) => (
                  <div key={pkg.slug} className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">{t(pkg.name, lang)}</h4>
                      <p className="text-sm text-gray-500">{t(pkg.desc, lang)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs line-through text-gray-400 block">{t(TR.refPrice, lang)} {formatPrice(getRefPrice(pkg.price))}</span>
                      <p className="text-xl font-bold text-blue-700">{formatPrice(pkg.price)}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold inline-block mb-1">{t(TR.save, lang)} {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                      <Link href={checkoutHref(`${checkoutBase}/${pkg.slug}`)} className="inline-block mt-1 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">{t(TR.bookNow, lang)}</Link>
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.moreTitle, lang)}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...INJECTABLE_PACKAGES, ...FAT_PACKAGES, ...WELLNESS_PACKAGES].map((pkg) => (
              <div key={pkg.slug} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition hover:-translate-y-1 flex flex-col">
                <h4 className="font-bold text-gray-900 mb-1">{t(pkg.name, lang)}</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{t(pkg.desc, lang)}</p>
                <div>
                  <span className="text-xs line-through text-gray-400">{t(TR.separateBooking, lang)} {formatPrice(getRefPrice(pkg.price))}</span>
                  <div className="flex items-end justify-between mt-1">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{formatPrice(pkg.price)}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">{t(TR.save, lang)} {formatPrice(getRefPrice(pkg.price) - pkg.price)}</span>
                    </div>
                    <Link href={checkoutHref(`${checkoutBase}/${pkg.slug}`)} className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition">{t(TR.bookNow, lang)}</Link>
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.priceListTitle, lang)}</h2>
            <p className="text-gray-500 text-sm mt-2">{t(TR.priceListDesc, lang)}</p>
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
              <span className="text-xs text-gray-400">{FULL_MENU[menuTab as keyof typeof FULL_MENU].items.length} {t(TR.itemCount, lang)}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {FULL_MENU[menuTab as keyof typeof FULL_MENU].items.map((item, i) => (
                <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-white transition">
                  <span className="text-sm text-gray-700">{t(item.name, lang)}</span>
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
            <h2 className="text-3xl font-serif font-bold mt-3">{t(TR.flowTitle, lang)}</h2>
            <p className="text-gray-400 text-sm mt-2">{t(TR.flowDesc, lang)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { id: '01', icon: <Phone size={24} />, title: t(TR.flow1, lang), desc: t(TR.flow1Desc, lang) },
              { id: '02', icon: <Heart size={24} />, title: t(TR.flow2, lang), desc: t(TR.flow2Desc, lang) },
              { id: '03', icon: <Shield size={24} />, title: t(TR.flow3, lang), desc: t(TR.flow3Desc, lang) },
              { id: '04', icon: <Sparkles size={24} />, title: t(TR.flow4, lang), desc: t(TR.flow4Desc, lang) },
              { id: '05', icon: <Clock size={24} />, title: t(TR.flow5, lang), desc: t(TR.flow5Desc, lang) },
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.accessTitle, lang)}</h2>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t(TR.addressTitle, lang)}</h3>
              <p className="text-gray-700 mb-2">〒530-0013</p>
              <p className="text-gray-700 mb-1">大阪府大阪市北区茶屋町1-32</p>
              <p className="text-gray-700 mb-6">ヤンマー本社ビル 地下2階（B2F）</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock size={14} className="text-gray-400" /> {t(TR.hours, lang)}
                </div>
              </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Train size={20} className="text-rose-500" /> {t(TR.nearestStation, lang)}</h3>
              <div className="space-y-4">
                {[
                  { station: t(TR.sta1, lang), time: t(TR.sta1Time, lang), line: t(TR.sta1Line, lang), note: t(TR.sta1Note, lang) },
                  { station: t(TR.sta2, lang), time: t(TR.sta2Time, lang), line: t(TR.sta2Line, lang) },
                  { station: t(TR.sta3, lang), time: t(TR.sta3Time, lang), line: t(TR.sta3Line, lang) },
                  { station: t(TR.sta4, lang), time: t(TR.sta4Time, lang), line: t(TR.sta4Line, lang) },
                  { station: t(TR.sta5, lang), time: t(TR.sta5Time, lang), line: t(TR.sta5Line, lang) },
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
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.reviewsTitle, lang)}</h2>
            <p className="text-gray-400 text-sm mt-2">{t(TR.reviewsDesc, lang)}</p>
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
                    <div className="font-medium text-gray-900 text-sm">{t(r.name, lang)}</div>
                    <div className="text-xs text-gray-400">{t(r.loc, lang)} · {t(r.date, lang)}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full inline-block mb-3">{typeof r.treatment === 'string' ? r.treatment : t(r.treatment, lang)}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{t(r.text, lang)}</p>
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
          <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3 mb-12">{t(TR.transformTitle, lang)}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-gray-400" />
              </div>
              <h4 className="font-bold text-gray-400 mb-2 text-sm uppercase tracking-wider">Before</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{t(TR.transformBefore, lang)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">SAI CLINIC</div>
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                <Sparkles size={24} className="text-rose-500" />
              </div>
              <h4 className="font-bold text-rose-600 mb-2 text-sm uppercase tracking-wider">During</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{t(TR.transformDuring, lang)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-rose-500" />
              </div>
              <h4 className="font-bold text-rose-500 mb-2 text-sm uppercase tracking-wider">After</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{t(TR.transformAfter, lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━ 12. FAQ ━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-rose-500 uppercase">FAQ</span>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-3">{t(TR.faqTitle, lang)}</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-900 text-sm pr-4">{t(faq.q, lang)}</span>
                  <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{t(faq.a, lang)}</div>
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
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t(TR.ctaTitle, lang)}</h2>
          <p className="text-rose-100 text-lg mb-6 leading-relaxed">
            {t(TR.ctaDesc, lang)}
          </p>
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-rose-200">
            <Clock size={14} />
            <span>{t(TR.ctaQuota, lang)}</span>
          </div>
          <a href="#sai-packages" className="inline-flex items-center gap-3 bg-white text-rose-600 px-10 py-4 rounded-full font-bold hover:bg-rose-50 transition-all shadow-lg shadow-white/20">
            {t(TR.ctaButton, lang)} <ArrowRight size={18} />
          </a>
          <p className="text-xs text-rose-200/60 mt-6">{t(TR.ctaNote, lang)}</p>
        </div>
      </section>

      {/* ━━━━━━━━ 14. Contact ━━━━━━━━ */}
      {!isGuideEmbed && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t(TR.contactTitle, lang)}</h3>
            <ContactButtons />
          </div>
        </section>
      )}

      {/* ━━━━━━━━ 悬浮 CTA ━━━━━━━━ */}
      {!isGuideEmbed && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          <div className="bg-gray-900 text-white text-[10px] px-3 py-1 rounded-full shadow-lg opacity-90">
            <span className="text-rose-400 font-bold">{t(TR.floatPromo, lang)}</span> · {t(TR.floatSlots, lang)}
          </div>
          <a
            href="#sai-packages"
            className="flex items-center gap-2 bg-rose-500 text-white pl-5 pr-4 py-3 rounded-full font-bold shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/40 transition-all text-sm"
          >
            <Sparkles size={16} />
            {t(TR.bookNow, lang)}
            <ArrowRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
