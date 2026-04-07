'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Phone, Clock, Train,
  Award, Stethoscope, Activity, Users, Shield,
  Heart, Brain, Baby, Pill, Eye, Ear,
  Syringe, Microscope, Sparkles, CheckCircle,
  ExternalLink, FileText, Flame,
  CircleDot, Zap, Cross, Gem,
  HeartPulse, Scan,
  ArrowRight, Globe, Mail, MessageSquare, CreditCard, Lock
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';


// ======================================
// 多语言翻译
// ======================================
const t = {
  // Hero
  heroTitle1: {
    ja: '兵庫医科大学病院',
    'zh-TW': '兵庫醫科大學病院',
    'zh-CN': '兵库医科大学病院',
    en: 'Hyogo Medical University Hospital',
    ko: '효고의과대학병원',
  } as Record<Language, string>,
  heroTitle2: {
    ja: '兵庫県最大規模の特定機能病院',
    'zh-TW': '兵庫縣最大規模特定功能醫院',
    'zh-CN': '兵库县最大规模特定功能医院',
    en: "Hyogo's Largest Advanced Treatment Hospital",
    ko: "효고현 최대 규모 특정기능병원",
  } as Record<Language, string>,
  heroSubtitle: {
    ja: '患者さんに希望を、医学に進歩を',
    'zh-TW': '為患者帶來希望，為醫學帶來進步',
    'zh-CN': '为患者带来希望，为医学带来进步',
    en: 'Bringing Hope to Patients, Progress to Medicine',
    ko: '환자에게 희망을, 의학에 진보를',
  } as Record<Language, string>,
  heroText: {
    ja: '1972年開院。50年以上にわたり先進的な医療設備と\n高度な医療技術で兵庫県の地域医療に貢献し続ける国指定特定機能病院。\n全国わずか87施設、兵庫県内2施設のみ。',
    'zh-TW': '1972年開院。50多年來以先進的醫療設備和\n醫療技術持續貢獻兵庫縣的地區醫療。\n國家指定特定功能醫院，全日本僅87家，兵庫縣內僅2家。',
    'zh-CN': '1972年开院。50多年来以先进的医疗设备和\n医疗技术持续贡献兵库县的地区医疗。\n国家指定特定功能医院，全日本仅87家，兵库县内仅2家。',
    en: 'Founded in 1972. Over 50 years of advanced equipment\nand medical technology serving Hyogo Prefecture.\nNationally designated — only 87 in Japan, 2 in Hyogo.',
    ko: '1972년 개원. 50년 이상에 걸쳐 첨단 의료 설비와\n고도의 의료 기술로 효고현 지역 의료에 공헌해 온 국가 지정 특정기능병원.\n전국 87개 시설, 효고현 내 2개 시설 중 하나.',
  } as Record<Language, string>,
  limitBadge: {
    ja: '2026年9月 新病院棟 開院予定',
    'zh-TW': '2026年9月 新病院大樓 即將開院',
    'zh-CN': '2026年9月 新病院大楼 即将开院',
    en: 'New Hospital Building Opening Sep 2026',
    ko: '2026년 9월 신병원동 개원 예정',
  } as Record<Language, string>,

  // Stats
  statsTag: {
    ja: '病院の実力',
    'zh-TW': '醫院實力',
    'zh-CN': '医院实力',
    en: 'Hospital Strength',
    ko: '병원 실력',
  } as Record<Language, string>,
  statsTitle: {
    ja: '数字で見る兵庫医大病院',
    'zh-TW': '數字看兵庫醫大病院',
    'zh-CN': '数字看兵库医大病院',
    en: 'Hyogo Medical by the Numbers',
    ko: '숫자로 보는 효고의대병원',
  } as Record<Language, string>,

  // National #1
  nationalTag: {
    ja: '全国有数の実績（DPC統計）',
    'zh-TW': '全國領先實績（DPC統計）',
    'zh-CN': '全国领先实绩（DPC统计）',
    en: 'Nationally Leading Achievements (DPC Data)',
    ko: '전국 유수의 실적(DPC 통계)',
  } as Record<Language, string>,
  nationalTitle: {
    ja: '全国DPC統計上位の専門分野',
    'zh-TW': '全國DPC統計前列的專科',
    'zh-CN': '全国DPC统计前列的专科',
    en: 'Nationally Top-Ranked Specialties (by DPC)',
    ko: '전국 DPC 통계 상위 전문 분야',
  } as Record<Language, string>,

  // Robots
  robotTag: {
    ja: 'ロボット支援手術',
    'zh-TW': '機器人輔助手術',
    'zh-CN': '机器人辅助手术',
    en: 'Robotic Surgery',
    ko: '로봇 지원 수술',
  } as Record<Language, string>,
  robotTitle: {
    ja: '2台のロボットが支える精密手術',
    'zh-TW': '2台機器人支撐的精密手術',
    'zh-CN': '2台机器人支撑的精密手术',
    en: 'Dual-Robot Precision Surgery',
    ko: '2대의 로봇이 뒷받침하는 정밀 수술',
  } as Record<Language, string>,

  // Certifications
  certTag: {
    ja: '12の国・県指定資格',
    'zh-TW': '12項國家・縣指定資質',
    'zh-CN': '12项国家・县指定资质',
    en: '12 National & Prefectural Designations',
    ko: '12개 국가·현 지정 자격',
  } as Record<Language, string>,
  certTitle: {
    ja: '国・自治体が認めた高度医療機関',
    'zh-TW': '國家與地方認定的醫療機構',
    'zh-CN': '国家与地方认定的医疗机构',
    en: 'Government-Certified Advanced Medical Institution',
    ko: '국가·지자체가 인정한 고도 의료기관',
  } as Record<Language, string>,

  // Centers
  centersTag: {
    ja: '専門センター',
    'zh-TW': '專門中心',
    'zh-CN': '专门中心',
    en: 'Specialty Centers',
    ko: '전문 센터',
  } as Record<Language, string>,
  centersTitle: {
    ja: '17以上の専門センター',
    'zh-TW': '17個以上專門中心',
    'zh-CN': '17个以上专门中心',
    en: '17+ Specialty Centers',
    ko: '17개 이상의 전문 센터',
  } as Record<Language, string>,

  // Equipment
  equipTitle: {
    ja: '先進的な医療設備',
    'zh-TW': '先進醫療設備',
    'zh-CN': '先进医疗设备',
    en: 'Advanced Medical Equipment',
    ko: '선진 의료 설비',
  } as Record<Language, string>,
  equipSub: {
    ja: '年間6万件以上の画像検査を支える充実した医療機器群',
    'zh-TW': '支撐每年6萬件以上影像檢查的充實醫療設備',
    'zh-CN': '支撑每年6万件以上影像检查的充实医疗设备',
    en: 'Comprehensive equipment supporting 60,000+ annual imaging studies',
    ko: '연간 6만 건 이상의 영상검사를 지원하는 충실한 의료기기',
  } as Record<Language, string>,

  // Facility / New Building
  newBuildTitle: {
    ja: '2026年9月 新病院棟開院',
    'zh-TW': '2026年9月 新病院大樓開院',
    'zh-CN': '2026年9月 新病院大楼开院',
    en: 'New Hospital Building — September 2026',
    ko: '2026년 9월 신병원동 개원',
  } as Record<Language, string>,
  newBuildDesc: {
    ja: '「Human Centered Hospital」をコンセプトに、\n患者中心の未来型スマート病院が誕生。\n地上15階建て・801床・延床面積約71,000㎡。\nIT・AI活用のスマートホスピタル設計、\n免震構造＋屋上ヘリポート完備。',
    'zh-TW': '以「Human Centered Hospital」為理念，\n以患者為中心的未來型智慧醫院即將誕生。\n地上15層・801床・總建築面積約71,000㎡。\nIT・AI驅動智慧醫院設計，\n免震結構＋屋頂直升機坪。',
    'zh-CN': '以「Human Centered Hospital」为理念，\n以患者为中心的未来型智慧医院即将诞生。\n地上15层・801床・总建筑面积约71,000㎡。\nIT・AI驱动智慧医院设计，\n免震结构＋屋顶直升机坪。',
    en: '"Human Centered Hospital" concept —\nA future-oriented smart hospital putting patients first.\n15 stories, 801 beds, ~71,000㎡ total area.\nIT/AI-driven smart hospital design,\nseismic isolation + rooftop helipad.',
    ko: '「인간 중심 병원」 콘셉트 —\n환자를 최우선으로 하는 미래지향형 스마트 호스피탈.\n지상 15층, 801병상, 총면적 약 71,000㎡.\nIT/AI 활용·완전 개인실 병동·면진 구조·옥상 헬리패드.',
  } as Record<Language, string>,

  // Emergency
  emergTitle: {
    ja: '救命救急・災害医療',
    'zh-TW': '急救・災害醫療',
    'zh-CN': '急救・灾害医疗',
    en: 'Emergency & Disaster Medicine',
    ko: '구급구명·재해의료',
  } as Record<Language, string>,
  emergDesc: {
    ja: '阪神医療圏約190万人の命を守る砦。\n20床のEICU＋24床の救急病棟、ドクターヘリポート完備。\n救急車受入率約93%。\n熱傷センター・中毒センター・脳卒中センター・心臓センターを併設し、\n24時間365日、最重症の患者に即応できる体制を整えています。',
    'zh-TW': '守護阪神醫療圈約190萬人生命的堡壘。\n20床EICU＋24床急救病棟、直升機停機坪。\n急救車接收率約93%。\n設有燒傷中心・中毒中心・腦中風中心・心臟中心，\n24小時365天隨時應對最危重患者。',
    'zh-CN': '守护阪神医疗圈约190万人生命的堡垒。\n20床EICU＋24床急救病栋、直升机停机坪。\n急救车接收率约93%。\n设有烧伤中心・中毒中心・脑中风中心・心脏中心，\n24小时365天随时应对最危重患者。',
    en: 'Safeguarding 1.9 million lives in the Hanshin medical district.\n20-bed EICU + 24-bed emergency ward, helipad.\n~93% ambulance acceptance rate.\nBurn, Poison, Stroke, and Cardiac Centers on-site.\n24/7/365 readiness for the most critical patients.',
    ko: '한신 의료권 190만 명의 생명을 지킵니다.\nEICU 20병상 + 응급병동 24병상, 헬리패드.\n구급차 접수율 약 93%.\n효고현 3차 응급의료기관.',
  } as Record<Language, string>,

  // Departments
  deptTitle: {
    ja: '全41診療科',
    'zh-TW': '全41診療科',
    'zh-CN': '全41诊疗科',
    en: 'All 41 Clinical Departments',
    ko: '전 41개 진료과',
  } as Record<Language, string>,
  deptInternal: { ja: '内科系', 'zh-TW': '內科系', 'zh-CN': '内科系', en: 'Internal Medicine', ko: '내과계' } as Record<Language, string>,
  deptSurgical: { ja: '外科系', 'zh-TW': '外科系', 'zh-CN': '外科系', en: 'Surgical', ko: '외과계' } as Record<Language, string>,
  deptSpecialty: { ja: '専門科・その他', 'zh-TW': '專科・其他', 'zh-CN': '专科・其他', en: 'Specialty & Others', ko: '전문과·기타' } as Record<Language, string>,

  // Access
  accessTitle: { ja: 'アクセス', 'zh-TW': '交通方式', 'zh-CN': '交通方式', en: 'Access', ko: '오시는 길' } as Record<Language, string>,
  ko: '오시는 길',
  accessAddress: { ja: '〒663-8501 兵庫県西宮市武庫川町1-1', 'zh-TW': '〒663-8501 兵庫縣西宮市武庫川町1-1', 'zh-CN': '〒663-8501 兵库县西宫市武库川町1-1', en: '1-1 Mukogawa-cho, Nishinomiya, Hyogo 663-8501', ko: '〒663-8501 효고현 니시노미야시 무코가와쵸 1-1' } as Record<Language, string>,
  accessTrain: { ja: '阪神電鉄「武庫川駅」西出口より徒歩5分', 'zh-TW': '阪神電鐵「武庫川站」西出口步行5分鐘', 'zh-CN': '阪神电铁「武库川站」西出口步行5分钟', en: '5-min walk from Hanshin Railway Mukogawa Station (West Exit)', ko: '한신전철 「무코가와역」 서쪽 출구에서 도보 5분' } as Record<Language, string>,
  hoursWeekday: { ja: '月〜金 8:30-11:00（初診受付）', 'zh-TW': '週一至週五 8:30-11:00（初診掛號）', 'zh-CN': '周一至周五 8:30-11:00（初诊挂号）', en: 'Mon-Fri 8:30-11:00 (Initial Visit)', ko: '월~금 8:30-11:00(초진 접수)' } as Record<Language, string>,
  hoursClosed: { ja: '休診：土日祝日・年末年始', 'zh-TW': '休診：週六日及國定假日', 'zh-CN': '休诊：周六日及法定节假日', en: 'Closed: Weekends & holidays', ko: '휴진: 토·일·공휴일·연말연시' } as Record<Language, string>,
  officialSite: { ja: '病院公式サイト（外部リンク）', 'zh-TW': '醫院官方網站（外部連結）', 'zh-CN': '医院官方网站（外部链接）', en: 'Official Website (External Link)', ko: '공식 웹사이트(외부 링크)' } as Record<Language, string>,

  // CTA
  ctaTitle: {
    ja: '兵庫医科大学病院での受診・健診をご検討の方へ',
    'zh-TW': '考慮在兵庫醫科大學病院就診・健檢的您',
    'zh-CN': '考虑在兵库医科大学病院就诊・健检的您',
    en: 'Considering Medical Care at Hyogo Medical University Hospital?',
    ko: '효고의과대학병원에서의 진료·건강검진을 검토 중이신 분께',
  } as Record<Language, string>,
  ctaDesc: {
    ja: '中国語対応スタッフが丁寧にサポートいたします。\n予約手配から通訳同行まで一括対応。お気軽にご相談ください。',
    'zh-TW': '中文服務人員為您提供全程支援。\n從預約安排到翻譯陪同一站式服務，歡迎隨時諮詢。',
    'zh-CN': '中文服务人员为您提供全程支援。\n从预约安排到翻译陪同一站式服务，欢迎随时咨询。',
    en: 'Chinese-speaking staff provide full support.\nFrom appointment arrangement to interpreter accompaniment. Feel free to consult us.',
    ko: '중국어 대응 스태프가 전면 서포트.\n예약 수배부터 통역 동행까지. 부담 없이 상담해 주십시오.',
  } as Record<Language, string>,

  // Robot badges & descriptions
  robotDaVinciBadge: { ja: '2017年導入', 'zh-TW': '2017年引進', 'zh-CN': '2017年引进', en: 'Since 2017', ko: '2017년 도입' } as Record<Language, string>,
  robotDaVinciDesc: {
    ja: '手ぶれ補正機能・多関節鉗子・立体3D映像を備えた先進的ロボット支援手術システム。泌尿器科、上部消化管外科、下部消化管外科、産科婦人科、呼吸器外科、耳鼻咽喉科の6科で活用。年間250件以上のロボット支援手術を実施。',
    'zh-TW': '配備防手震功能、多關節鉗子、立體3D影像的先進機器人輔助手術系統。在泌尿科、上消化道外科、下消化道外科、婦產科、呼吸器外科、耳鼻喉科6個科別使用。年間250件以上機器人輔助手術。',
    'zh-CN': '配备防手抖功能、多关节钳子、立体3D影像的先进机器人辅助手术系统。在泌尿科、上消化道外科、下消化道外科、妇产科、呼吸器外科、耳鼻喉科6个科室使用。年间250件以上机器人辅助手术。',
    en: 'Advanced robotic surgical system with anti-tremor, multi-jointed forceps, and stereoscopic 3D imaging. Used across 6 departments. 250+ robotic surgeries annually.',
    ko: '손떨림 보정 기능·다관절 겸자·입체 3D 영상을 갖춘 선진 로봇 지원 수술 시스템. 6개 진료과에서 활용. 연간 250건 이상의 로봇 지원 수술 실시.',
  } as Record<Language, string>,
  robotHinotoriBadge: { ja: '2024年導入・日本製', 'zh-TW': '2024年引進・日本製造', 'zh-CN': '2024年引进・日本制造', en: '2024 / Made in Japan', ko: '2024년 도입·일본제' } as Record<Language, string>,
  robotHinotoriDesc: {
    ja: '日本初の国産手術支援ロボット。2024年8月導入。泌尿器科で前立腺全摘術、産婦人科でロボット支援手術を実施。今後、肝胆膵外科・呼吸器外科へ拡大予定。',
    'zh-TW': '日本首台國產手術支援機器人。2024年8月引進。在泌尿科進行前列腺根治術、婦產科進行機器人輔助手術。計劃擴展至肝膽胰外科・呼吸器外科。',
    'zh-CN': '日本首台国产手术支援机器人。2024年8月引进。在泌尿科进行前列腺根治术、妇产科进行机器人辅助手术。计划扩展至肝胆胰外科・呼吸器外科。',
    en: "Japan's first domestically produced surgical robot. Introduced August 2024. Used in Urology and Ob/Gyn. Expanding to HPB and Thoracic Surgery.",
    ko: '일본 최초의 국산 수술 로봇. 2024년 8월 도입. 비뇨기과·산부인과에서 사용. 간담췌·흉부외과로 확대 예정.',
  } as Record<Language, string>,

  // Equipment titles & descriptions
  equipPetCtTitle: { ja: 'PET-CT × 3台', 'zh-TW': 'PET-CT × 3台', 'zh-CN': 'PET-CT × 3台', en: 'PET-CT × 3 Units', ko: 'PET-CT × 3대' } as Record<Language, string>,
  equipPetCtDesc: {
    ja: '専用サイクロトロン（加速器）を院内に設置し、PET用放射性薬剤を自家製造。年間4,719件のPET検査を実施する専門PETセンター（2006年開設）。全身のがん・病変を一度にスクリーニング。',
    'zh-TW': '院內設置專用迴旋加速器，自行製造PET放射性藥劑。年間4,719件PET檢查的專門PET中心（2006年開設）。一次性全身癌症・病變篩查。',
    'zh-CN': '院内设置专用回旋加速器，自行制造PET放射性药剂。年间4,719件PET检查的专门PET中心（2006年开设）。一次性全身癌症・病变筛查。',
    en: 'On-site cyclotron for in-house radiopharmaceutical production. PET Center (est. 2006) performing 4,719 PET scans/yr. Full-body cancer screening.',
    ko: '원내 전용 사이클로트론(가속기)을 설치하여 PET용 방사성 의약품을 자체 제조. 연간 4,719건의 PET 검사를 실시하는 전문 PET 센터(2006년 개설). 전신 암·병변 일괄 스크리닝.',
  } as Record<Language, string>,
  equipMriDesc: {
    ja: '4台のMRI（3.0テスラ3台＋1.5テスラ1台）を配備。年間16,289件のMRI検査を実施。超高磁場による高精細画像で脳・脊髄・関節等の微細病変を検出。',
    'zh-TW': '配備4台MRI（3.0T×3＋1.5T×1）。年間16,289件MRI檢查。超高磁場高精細影像檢測腦・脊髓・關節等微細病變。',
    'zh-CN': '配备4台MRI（3.0T×3＋1.5T×1）。年间16,289件MRI检查。超高磁场高精细影像检测脑・脊髓・关节等微细病变。',
    en: '4 MRI systems (3×3.0T + 1×1.5T). 16,289 annual exams. Ultra-high field imaging for minute lesions in brain, spine, joints.',
    ko: '4대의 MRI(3.0테슬라 3대＋1.5테슬라 1대) 배치. 연간 16,289건의 MRI 검사 실시. 초고자장에 의한 고정밀 화상으로 뇌·척수·관절 등의 미세 병변 검출.',
  } as Record<Language, string>,
  equipCtTitle: { ja: '128列マルチスライスCT × 3台', 'zh-TW': '128列多層CT × 3台', 'zh-CN': '128列多层CT × 3台', en: '128-Slice CT × 3 Units', ko: '128열 멀티슬라이스 CT × 3대' } as Record<Language, string>,
  equipCtDesc: {
    ja: '年間37,470件のCT検査を実施。高速撮影で心臓を1回転で撮影可能。低被ばくかつ高精細な画像診断を実現。',
    'zh-TW': '年間37,470件CT檢查。高速拍攝可一次旋轉完成心臟掃描。低輻射高精度影像診斷。',
    'zh-CN': '年间37,470件CT检查。高速拍摄可一次旋转完成心脏扫描。低辐射高精度影像诊断。',
    en: '37,470 annual CT scans. Single-rotation cardiac imaging. Low-radiation, high-resolution diagnostics.',
    ko: '연간 37,470건의 CT 검사 실시. 고속 촬영으로 심장을 1회전으로 촬영 가능. 저피폭 고정밀 화상진단 실현.',
  } as Record<Language, string>,
  equipRadTitle: { ja: '高精度放射線治療装置', 'zh-TW': '高精度放射治療裝置', 'zh-CN': '高精度放射治疗装置', en: 'Precision Radiation Therapy', ko: '고정밀 방사선 치료 장치' } as Record<Language, string>,
  equipRadDesc: {
    ja: 'Elekta Synergy高精度リニアック2台。IMRT・IGRT・定位放射線治療に対応。年間572名・12,322回照射。小線源治療（HDR/LDR）も完備。',
    'zh-TW': 'Elekta Synergy高精度直線加速器2台。支援IMRT・IGRT・立體定位放射治療。年間572名・12,322次照射。近接治療（HDR/LDR）完備。',
    'zh-CN': 'Elekta Synergy高精度直线加速器2台。支持IMRT・IGRT・立体定向放射治疗。年间572名・12,322次照射。近距离放疗（HDR/LDR）完备。',
    en: '2 Elekta Synergy linacs. IMRT, IGRT, stereotactic radiotherapy. 572 patients, 12,322 sessions/yr. HDR/LDR brachytherapy.',
    ko: 'Elekta Synergy 고정밀 리니악 2대. IMRT·IGRT·정위방사선 치료 대응. 연간 572명·12,322회 조사. 소선원 치료(HDR/LDR)도 완비.',
  } as Record<Language, string>,
  equipIvrTitle: { ja: 'IVRセンター（10室）', 'zh-TW': 'IVR中心（10間）', 'zh-CN': 'IVR中心（10间）', en: 'IVR Center (10 Suites)', ko: 'IVR 센터(10실)' } as Record<Language, string>,
  equipIvrDesc: {
    ja: '血管造影装置10室（循環器4台・脳神経3台・腹部IVR-CT 1台・コーンビームCT 2台）。年間1,081件のインターベンション手術。ハイブリッド手術室完備。',
    'zh-TW': '血管造影裝置10間（心臟4台・腦神經3台・腹部IVR-CT 1台・錐形束CT 2台）。年間1,081件介入手術。配備混合手術室。',
    'zh-CN': '血管造影装置10间（心脏4台・脑神经3台・腹部IVR-CT 1台・锥形束CT 2台）。年间1,081件介入手术。配备混合手术室。',
    en: '10 angiography suites (4 cardiac, 3 neuro, 1 abdominal IVR-CT, 2 cone-beam CT). 1,081 interventions/yr. Hybrid OR.',
    ko: '혈관조영장치 10실(순환기 4대·뇌신경 3대·복부 IVR-CT 1대·콘빔 CT 2대). 연간 1,081건의 인터벤션 수술. 하이브리드 수술실 완비.',
  } as Record<Language, string>,
  equipEndoTitle: { ja: '内視鏡センター（7室）', 'zh-TW': '內視鏡中心（7間）', 'zh-CN': '内镜中心（7间）', en: 'Endoscopy Center (7 Rooms)', ko: '내시경 센터(7실)' } as Record<Language, string>,
  equipEndoDesc: {
    ja: '年間13,734件（上部6,869件・下部5,357件・ESD 248件）。NBI拡大内視鏡・カプセル内視鏡・ダブルバルーン内視鏡・EUS完備。早期がん内視鏡治療に豊富な実績。',
    'zh-TW': '年間13,734件（上部6,869件・下部5,357件・ESD 248件）。配備NBI放大內視鏡・膠囊內視鏡・雙氣囊內視鏡・EUS。早期癌內視鏡治療實績豐富。',
    'zh-CN': '年间13,734件（上部6,869件・下部5,357件・ESD 248件）。配备NBI放大内镜・胶囊内镜・双气囊内镜・EUS。早期癌内镜治疗实绩丰富。',
    en: '13,734/yr (6,869 upper, 5,357 lower, 248 ESD). NBI, capsule, double-balloon, EUS. Extensive experience in early cancer endoscopic treatment.',
    ko: '연간 13,734건(상부 6,869건·하부 5,357건·ESD 248건). NBI 확대 내시경·캡슐 내시경·더블 발룬 내시경·EUS 완비. 조기암 내시경 치료에 풍부한 실적.',
  } as Record<Language, string>,

  // Additional equipment
  equipNucTitle: { ja: '核医学検査装置', 'zh-TW': '核醫學檢查裝置', 'zh-CN': '核医学检查装置', en: 'Nuclear Medicine Imaging', ko: '핵의학검사장치' } as Record<Language, string>,
  equipNucDesc: {
    ja: 'SPECT-CT装置2台を配備。心筋・骨・脳血流のアイソトープ検査に対応。甲状腺・副甲状腺シンチグラフィーにも使用。',
    'zh-TW': '配備2台SPECT-CT裝置。可進行心肌・骨・腦血流的同位素檢查。也用於甲狀腺・副甲狀腺閃爍攝影。',
    'zh-CN': '配备2台SPECT-CT装置。可进行心肌・骨・脑血流的同位素检查。也用于甲状腺・副甲状腺闪烁摄影。',
    en: '2 SPECT-CT systems. Cardiac, bone & cerebral blood flow isotope studies. Thyroid/parathyroid scintigraphy.',
    ko: 'SPECT-CT 장치 2대 배치. 심근·골·뇌혈류 아이소토프 검사 대응. 갑상선·부갑상선 신티그래피에도 사용.',
  } as Record<Language, string>,
  equipOpTitle: { ja: '手術室 17室', 'zh-TW': '手術室 17間', 'zh-CN': '手术室 17间', en: '17 Operating Rooms', ko: '수술실 17실' } as Record<Language, string>,
  equipOpDesc: {
    ja: 'ハイブリッド手術室含む17室。ダヴィンチXi・hinotori対応のロボット手術室を完備。年間9,672件の手術を支える先進的設備。',
    'zh-TW': '含混合手術室共17間。配備Da Vinci Xi・hinotori對應的機器人手術室。支撐每年9,672件手術的先進設備。',
    'zh-CN': '含混合手术室共17间。配备Da Vinci Xi・hinotori对应的机器人手术室。支撑每年9,672件手术的先进设备。',
    en: '17 ORs including hybrid suites. Da Vinci Xi & hinotori-ready robotic ORs. Supporting 9,672 surgeries annually.',
    ko: '하이브리드 수술실 포함 17실. 다빈치 Xi·히노토리 대응 로봇 수술실 완비. 연간 9,672건의 수술을 뒷받침하는 선진 설비.',
  } as Record<Language, string>,

  // New building badges
  newBuildSeismic: { ja: '免震構造', 'zh-TW': '免震結構', 'zh-CN': '免震结构', en: 'Seismic Isolation', ko: '면진 구조' } as Record<Language, string>,
  newBuildHelipad: { ja: '屋上ヘリポート', 'zh-TW': '屋頂直升機坪', 'zh-CN': '屋顶直升机坪', en: 'Rooftop Helipad', ko: '옥상 헬리패드' } as Record<Language, string>,

  // Emergency badge
  emergPopulation: { ja: '190万人圏域', 'zh-TW': '190萬人口', 'zh-CN': '190万人口', en: '1.9M Pop.', ko: '190만 명 의료권' } as Record<Language, string>,

  // Access labels
  accessLabelAddress: { ja: '所在地', 'zh-TW': '地址', 'zh-CN': '地址', en: 'Address', ko: '소재지' } as Record<Language, string>,
  accessLabelTrain: { ja: '電車でお越しの方', 'zh-TW': '電車交通', 'zh-CN': '电车交通', en: 'By Train', ko: '전차로 오시는 분' } as Record<Language, string>,
  accessLabelHours: { ja: '外来受付時間', 'zh-TW': '門診時間', 'zh-CN': '门诊时间', en: 'Outpatient Hours', ko: '외래 접수 시간' } as Record<Language, string>,

  // Footer / form
  privacyLabel: { ja: 'プライバシー保護', 'zh-TW': '隱私保護', 'zh-CN': '隐私保护', en: 'Privacy Protected', ko: '개인정보 보호' } as Record<Language, string>,
  wechatAddPrompt: { ja: '下記の微信IDを追加してください', 'zh-TW': '請添加以下微信號', 'zh-CN': '请添加以下微信号', en: 'Add the WeChat ID below', ko: '아래 위챗 ID를 추가해 주십시오' } as Record<Language, string>,
  copyLabel: { ja: 'コピー', 'zh-TW': '複製', 'zh-CN': '复制', en: 'Copy', ko: '복사' } as Record<Language, string>,
};

// ======================================
// 数据
// ======================================

// 核心数字
const HEADLINE_STATS = [
  {
    value: '963',
    label: { ja: '病床数', 'zh-TW': '病床數', 'zh-CN': '病床数', en: 'Hospital Beds', ko: '병상 수' } as Record<Language, string>,
    sub: { ja: '兵庫県最大規模', 'zh-TW': '兵庫縣最大規模', 'zh-CN': '兵库县最大规模', en: "Hyogo's Largest", ko: '효고현 최대 규모' } as Record<Language, string>,
  },
  {
    value: '9,672',
    label: { ja: '年間手術件数', 'zh-TW': '年間手術件數', 'zh-CN': '年手术件数', en: 'Annual Surgeries', ko: '연간 수술 건수' } as Record<Language, string>,
    sub: { ja: '2022年度実績', 'zh-TW': '2022年度實績', 'zh-CN': '2022年度实绩', en: 'FY2022', ko: '2022년도 실적' } as Record<Language, string>,
  },
  {
    value: '60,000+',
    label: { ja: '年間画像検査数', 'zh-TW': '年間影像檢查數', 'zh-CN': '年影像检查数', en: 'Annual Imaging Studies', ko: '연간 영상검사 수' } as Record<Language, string>,
    sub: { ja: 'CT・MRI・PET', 'zh-TW': 'CT・MRI・PET', 'zh-CN': 'CT・MRI・PET', en: 'CT, MRI & PET', ko: 'CT·MRI·PET' } as Record<Language, string>,
  },
  {
    value: '2,200',
    label: { ja: '1日あたり外来患者数', 'zh-TW': '每日門診人數', 'zh-CN': '每日门诊人数', en: 'Daily Outpatients', ko: '1일 외래 환자 수' } as Record<Language, string>,
    sub: { ja: '年間約58万人', 'zh-TW': '年間約58萬人', 'zh-CN': '年间约58万人', en: '~580K annually', ko: '연간 약 58만 명' } as Record<Language, string>,
  },
  {
    value: '17',
    label: { ja: '手術室', 'zh-TW': '手術室', 'zh-CN': '手术室', en: 'Operating Rooms', ko: '수술실' } as Record<Language, string>,
    sub: { ja: 'ハイブリッドOR含む', 'zh-TW': '含混合手術室', 'zh-CN': '含混合手术室', en: 'Including Hybrid OR', ko: '하이브리드 OR 포함' } as Record<Language, string>,
  },
  {
    value: '50+',
    label: { ja: '開院からの歴史', 'zh-TW': '開院歷史', 'zh-CN': '开院历史', en: 'Years of History', ko: '개원 이래 역사' } as Record<Language, string>,
    sub: { ja: '1972年開院', 'zh-TW': '1972年開院', 'zh-CN': '1972年开院', en: 'Founded 1972', ko: '1972년 개원' } as Record<Language, string>,
  },
];

// 日本一・全国トップの専門分野
const NATIONAL_FIRSTS = [
  {
    rank: { ja: 'DPC統計全国1位', 'zh-TW': 'DPC統計全國第1', 'zh-CN': 'DPC统计全国第1', en: '#1 by DPC Data', ko: 'DPC 통계 전국 1위' } as Record<Language, string>,
    title: { ja: 'IBDセンター（炎症性腸疾患）', 'zh-TW': 'IBD中心（炎症性腸病）', 'zh-CN': 'IBD中心（炎症性肠病）', en: 'IBD Center', ko: 'IBD 센터' } as Record<Language, string>,
    desc: {
      ja: '潰瘍性大腸炎・クローン病の入院患者数で全国DPC統計第1位。累計患者約3,150人、累計手術4,140件以上。血球成分除去療法はこの病院で発明された。年間2,000件以上の生物学的製剤治療を実施。',
      'zh-TW': '潰瘍性大腸炎・克隆氏病住院患者數全國DPC統計第1名。累計患者約3,150人、累計手術4,140件以上。血球成分除去療法在此發明。年間2,000件以上生物製劑治療。',
      'zh-CN': '溃疡性大肠炎・克罗恩病住院患者数全国DPC统计第1名。累计患者约3,150人、累计手术4,140件以上。血球成分除去疗法在此发明。年间2,000件以上生物制剂治疗。',
      en: '#1 nationally in UC & Crohn\'s disease by DPC volume. ~3,150 cumulative patients, 4,140+ surgeries. Blood cell apheresis invented here. 2,000+ biologic treatments annually.',
      ko: 'UC·CD 입원 환자 수 DPC 전국 1위. 누적 환자 약 3,150명, 수술 4,140건 이상. 혈구성분제거요법 발상지. 생물학적 제제 2,000건 이상/연.',
    } as Record<Language, string>,
    icon: Activity,
    color: 'from-[#0f7459] to-[#1766b0]',
  },
  {
    rank: { ja: 'DPC統計全国上位', 'zh-TW': 'DPC統計全國前列', 'zh-CN': 'DPC统计全国前列', en: 'Top by DPC Data' } as Record<Language, string>,
    title: { ja: '中皮腫センター（悪性中皮腫）', 'zh-TW': '間皮瘤中心（惡性間皮瘤）', 'zh-CN': '间皮瘤中心（恶性间皮瘤）', en: 'Mesothelioma Center', ko: '중피종 센터' } as Record<Language, string>,
    desc: {
      ja: '悪性中皮腫の症例数で全国DPC統計上位。年間800件以上を診療する専門施設。呼吸器外科では年間50件以上の根治手術を実施。呼吸器外科全体で年間403件の手術。',
      'zh-TW': '惡性間皮瘤病例數在全國DPC統計中名列前茅。每年診療800件以上的專門設施。呼吸器外科每年50件以上根治手術。呼吸器外科全年403件手術。',
      'zh-CN': '恶性间皮瘤病例数在全国DPC统计中名列前茅。每年诊疗800件以上的专门设施。呼吸器外科每年50件以上根治手术。呼吸器外科全年403件手术。',
      en: 'Top nationally in mesothelioma caseload by DPC data. 800+ cases/year. 50+ radical surgeries annually. 403 total thoracic surgeries per year.',
      ko: 'DPC 통계에서 악성 중피종 증례 수 전국 상위. 연간 800건 이상 진료. 호흡기 외과 연간 50건 이상의 근치 수술. 호흡기 외과 전체 연간 403건 수술.',
    } as Record<Language, string>,
    icon: Shield,
    color: 'from-[#0f7459] to-[#1766b0]',
  },
  {
    rank: { ja: '兵庫県1位 / 全国上位', 'zh-TW': '兵庫縣第1 / 全國領先', 'zh-CN': '兵库县第1 / 全国领先', en: '#1 in Hyogo / Nationally Leading' } as Record<Language, string>,
    title: { ja: '脳神経外科（血管内治療）', 'zh-TW': '腦神經外科（血管內治療）', 'zh-CN': '脑神经外科（血管内治疗）', en: 'Neurosurgery (Endovascular)', ko: '뇌신경외과(혈관내 치료)' } as Record<Language, string>,
    desc: {
      ja: '脳血管内治療件数で兵庫県第1位。年間手術810件、血管内治療315件。フローダイバーターステント治療は全国でも数施設のみ。吉村紳一教授の累計症例約4,000件。24時間365日専門医常駐。',
      'zh-TW': '腦血管內治療件數兵庫縣第1。年間手術810件、血管內治療315件。Flow Diverter支架治療全國僅數家。吉村紳一教授累計約4,000例。24小時365天專科醫師常駐。',
      'zh-CN': '脑血管内治疗件数兵库县第1。年间手术810件、血管内治疗315件。Flow Diverter支架治疗全国仅数家。吉村绅一教授累计约4,000例。24小时365天专科医师常驻。',
      en: '#1 in Hyogo for cerebrovascular endovascular. 810 surgeries, 315 endovascular/yr. Flow Diverter at only a few hospitals. Prof. Yoshimura: ~4,000 cases. 24/7 specialist coverage.',
      ko: '뇌혈관내 치료 건수 효고현 1위. 연간 수술 810건, 혈관내 치료 315건. 플로우 다이버터 스텐트 치료는 전국에서도 소수 시설만 가능. 요시무라 신이치 교수 누적 약 4,000건. 24시간 365일 전문의 상주.',
    } as Record<Language, string>,
    icon: Brain,
    color: 'from-[#0f7459] to-[#1766b0]',
  },
  {
    rank: { ja: '全国1～2位', 'zh-TW': '全國第1～2名', 'zh-CN': '全国第1～2名', en: '#1-2 Nationally' } as Record<Language, string>,
    title: { ja: '耳鼻咽喉科（耳手術）', 'zh-TW': '耳鼻喉科（耳手術）', 'zh-CN': '耳鼻喉科（耳手术）', en: 'ENT (Ear Surgery)', ko: '이비인후과(귀 수술)' } as Record<Language, string>,
    desc: {
      ja: '年間耳手術約350件は大学病院として全国上位の実績。累計人工内耳手術190件以上。鼓室形成術に豊富な実績。内視鏡下副鼻腔手術208件、頭頸部がん手術91件。',
      'zh-TW': '年間耳手術約350件，大學醫院中全國領先。累計人工耳蝸190件以上。鼓室形成術實績豐富。內視鏡鼻竇手術208件、頭頸部癌手術91件。',
      'zh-CN': '年间耳手术约350件，大学医院中全国领先。累计人工耳蜗190件以上。鼓室形成术实绩丰富。内镜鼻窦手术208件、头颈部癌手术91件。',
      en: '~350 ear surgeries/yr — among the top university hospitals. 190+ cochlear implants. Extensive tympanoplasty experience. 208 sinus surgeries, 91 head-neck cancer surgeries.',
      ko: '연간 귀 수술 약 350건은 대학병원으로서 전국 상위 실적. 누적 인공와우 수술 190건 이상. 고실성형술에 풍부한 실적. 내시경하 부비동 수술 208건, 두경부암 수술 91건.',
    } as Record<Language, string>,
    icon: Ear,
    color: 'from-[#0f7459] to-[#1766b0]',
  },
  {
    rank: { ja: '全国上位の実績', 'zh-TW': '全國領先實績', 'zh-CN': '全国领先实绩', en: 'Nationally Leading' } as Record<Language, string>,
    title: { ja: '腎移植センター', 'zh-TW': '腎移植中心', 'zh-CN': '肾移植中心', en: 'Kidney Transplant Center', ko: '신장이식 센터' } as Record<Language, string>,
    desc: {
      ja: '1983年からの累計411件以上。10年生着率85%・10年患者生存率96%。ABO不適合移植・先行的移植にも対応。腹腔鏡ドナー手術200件以上の実績。',
      'zh-TW': '自1983年累計411件以上。10年移植存活率85%・10年患者存活率96%。可進行ABO不相容移植・先行性移植。腹腔鏡供體手術200件以上。',
      'zh-CN': '自1983年累计411件以上。10年移植存活率85%・10年患者存活率96%。可进行ABO不相容移植・先行性移植。腹腔镜供体手术200件以上。',
      en: '411+ transplants since 1983. 10-year graft survival 85%, patient survival 96%. ABO-incompatible and pre-emptive transplants. 200+ laparoscopic donor surgeries.',
      ko: '1983년부터 누적 411건 이상. 10년 생착률 85%·10년 환자 생존율 96%. ABO 부적합 이식·선행적 이식에도 대응. 복강경 공여자 수술 200건 이상 실적.',
    } as Record<Language, string>,
    icon: HeartPulse,
    color: 'from-[#0f7459] to-[#1766b0]',
  },
];

// 认定资质（12项）
const CERTIFICATIONS = [
  {
    title: { ja: '特定機能病院', 'zh-TW': '特定功能醫院', 'zh-CN': '特定功能医院', en: 'Specified Function Hospital' } as Record<Language, string>,
    desc: { ja: '1994年認定。全国87施設・兵庫県内2施設のみ', 'zh-TW': '1994年認定。全日本87家・兵庫縣內僅2家', 'zh-CN': '1994年认定。全日本87家・兵库县内仅2家', en: 'Since 1994. Only 87 in Japan, 2 in Hyogo', ko: '1994년 인정. 전국 87시설·효고현 내 2시설만' } as Record<Language, string>,
    icon: Award, color: 'blue',
  },
  {
    title: { ja: 'がん診療連携拠点病院（高度型）', 'zh-TW': '癌症診療據點醫院（高度型）', 'zh-CN': '癌症诊疗据点医院（高度型）', en: 'Advanced Cancer Base Hospital', ko: '암 진료 연계 거점병원(고도형)' } as Record<Language, string>,
    desc: { ja: '2008年指定、2020年高度型に昇格', 'zh-TW': '2008年指定、2020年升格為高度型', 'zh-CN': '2008年指定、2020年升格为高度型', en: 'Designated 2008, upgraded to Advanced 2020', ko: '2008년 지정, 2020년 고도형으로 승격' } as Record<Language, string>,
    icon: Shield, color: 'purple',
  },
  {
    title: { ja: 'がんゲノム医療連携病院', 'zh-TW': '癌症基因體醫療合作醫院', 'zh-CN': '癌症基因组医疗合作医院', en: 'Cancer Genome Medicine Hospital', ko: '암 게놈 의료 연계 병원' } as Record<Language, string>,
    desc: { ja: '2018年指定。大阪大学と連携', 'zh-TW': '2018年指定。與大阪大學合作', 'zh-CN': '2018年指定。与大阪大学合作', en: 'Since 2018. Partnered with Osaka University', ko: '2018년 지정. 오사카대학과 연계' } as Record<Language, string>,
    icon: Microscope, color: 'indigo',
  },
  {
    title: { ja: '総合周産期母子医療センター', 'zh-TW': '綜合周產期母子醫療中心', 'zh-CN': '综合周产期母子医疗中心', en: 'Perinatal Maternal-Child Center', ko: '종합 주산기 모자의료센터' } as Record<Language, string>,
    desc: { ja: '2015年兵庫県指定', 'zh-TW': '2015年兵庫縣指定', 'zh-CN': '2015年兵库县指定', en: 'Hyogo Prefecture designated 2015', ko: '2015년 효고현 지정' } as Record<Language, string>,
    icon: Baby, color: 'pink',
  },
  {
    title: { ja: '災害拠点病院', 'zh-TW': '災害據點醫院', 'zh-CN': '灾害据点医院', en: 'Disaster Base Hospital', ko: '재해 거점 병원' } as Record<Language, string>,
    desc: { ja: '1996年指定。免震構造・ヘリポート完備', 'zh-TW': '1996年指定。免震結構・直升機坪', 'zh-CN': '1996年指定。免震结构・直升机坪', en: 'Since 1996. Seismic isolation + helipad', ko: '1996년 지정. 면진 구조·헬리포트 완비' } as Record<Language, string>,
    icon: Flame, color: 'orange',
  },
  {
    title: { ja: '肝疾患診療連携拠点病院', 'zh-TW': '肝疾病診療據點醫院', 'zh-CN': '肝疾病诊疗据点医院', en: 'Liver Disease Base Hospital', ko: '간질환 진료 연계 거점병원' } as Record<Language, string>,
    desc: { ja: '2008年厚生労働省指定', 'zh-TW': '2008年厚生勞動省指定', 'zh-CN': '2008年厚生劳动省指定', en: 'MHLW designated 2008', ko: '2008년 후생노동성 지정' } as Record<Language, string>,
    icon: Pill, color: 'green',
  },
  {
    title: { ja: '認知症疾患医療センター', 'zh-TW': '認知症疾病醫療中心', 'zh-CN': '认知症疾病医疗中心', en: 'Dementia Medical Center', ko: '인지증 질환 의료센터' } as Record<Language, string>,
    desc: { ja: '2009年兵庫県指定', 'zh-TW': '2009年兵庫縣指定', 'zh-CN': '2009年兵库县指定', en: 'Hyogo Prefecture designated 2009', ko: '2009년 효고현 지정' } as Record<Language, string>,
    icon: Brain, color: 'teal',
  },
  {
    title: { ja: 'HIV/AIDS中核拠点病院', 'zh-TW': 'HIV/AIDS核心據點醫院', 'zh-CN': 'HIV/AIDS核心据点医院', en: 'HIV/AIDS Core Hospital', ko: 'HIV/AIDS 핵심 거점 병원' } as Record<Language, string>,
    desc: { ja: '2007年指定。専門治療体制', 'zh-TW': '2007年指定。專門治療體制', 'zh-CN': '2007年指定。专门治疗体制', en: 'Since 2007. Specialized treatment system', ko: '2007년 지정. 전문 치료 체제' } as Record<Language, string>,
    icon: Cross, color: 'red',
  },
  {
    title: { ja: 'アレルギー疾患医療拠点病院', 'zh-TW': '過敏疾病醫療據點醫院', 'zh-CN': '过敏疾病医疗据点医院', en: 'Allergy Disease Base Hospital', ko: '알레르기 질환 의료 거점 병원' } as Record<Language, string>,
    desc: { ja: '2018年兵庫県指定', 'zh-TW': '2018年兵庫縣指定', 'zh-CN': '2018年兵库县指定', en: 'Hyogo Prefecture designated 2018', ko: '2018년 효고현 지정' } as Record<Language, string>,
    icon: Sparkles, color: 'amber',
  },
  {
    title: { ja: '難病診療連携拠点病院', 'zh-TW': '罕見病診療據點醫院', 'zh-CN': '罕见病诊疗据点医院', en: 'Rare Disease Base Hospital', ko: '난병 진료 연계 거점 병원' } as Record<Language, string>,
    desc: { ja: '2019年兵庫県指定', 'zh-TW': '2019年兵庫縣指定', 'zh-CN': '2019年兵库县指定', en: 'Hyogo Prefecture designated 2019', ko: '2019년 효고현 지정' } as Record<Language, string>,
    icon: Gem, color: 'violet',
  },
  {
    title: { ja: '小児がん連携病院', 'zh-TW': '小兒癌症合作醫院', 'zh-CN': '小儿癌症合作医院', en: 'Pediatric Cancer Hospital', ko: '소아암 연계 병원' } as Record<Language, string>,
    desc: { ja: '2019年指定。小児がんの集学的治療', 'zh-TW': '2019年指定。小兒癌症的集學治療', 'zh-CN': '2019年指定。小儿癌症的集学治疗', en: 'Since 2019. Multidisciplinary pediatric cancer care', ko: '2019년 지정. 소아암의 집학적 치료' } as Record<Language, string>,
    icon: Heart, color: 'rose',
  },
  {
    title: { ja: 'JCQHC認定 + ISO 15189', 'zh-TW': 'JCQHC認定 + ISO 15189', 'zh-CN': 'JCQHC认定 + ISO 15189', en: 'JCQHC + ISO 15189', ko: 'JCQHC 인정 + ISO 15189' } as Record<Language, string>,
    desc: { ja: '第4回更新認定(2024)。検査室ISO取得(2016)', 'zh-TW': '第4次更新認定(2024)。檢驗室ISO取得(2016)', 'zh-CN': '第4次更新认定(2024)。检验室ISO取得(2016)', en: '4th renewal (2024). Lab ISO certified (2016)', ko: '제4회 갱신인정(2024). 검사실 ISO 취득(2016)' } as Record<Language, string>,
    icon: CheckCircle, color: 'sky',
  },
];

// 专门中心
const CENTERS = [
  {
    name: { ja: 'IBDセンター', 'zh-TW': 'IBD中心', 'zh-CN': 'IBD中心', en: 'IBD Center', ko: 'IBD 센터' } as Record<Language, string>,
    stat: { ja: '累計4,140件以上の手術', 'zh-TW': '累計4,140件以上手術', 'zh-CN': '累计4,140件以上手术', en: '4,140+ cumulative surgeries', ko: '누적 4,140건 이상 수술' } as Record<Language, string>,
    icon: Activity,
  },
  {
    name: { ja: '脳卒中センター', 'zh-TW': '腦中風中心', 'zh-CN': '脑中风中心', en: 'Stroke Center', ko: '뇌졸중 센터' } as Record<Language, string>,
    stat: { ja: '年間血管内治療315件', 'zh-TW': '年間血管內治療315件', 'zh-CN': '年间血管内治疗315件', en: '315 endovascular procedures/yr', ko: '연간 혈관내 치료 315건' } as Record<Language, string>,
    icon: Brain,
  },
  {
    name: { ja: 'アイセンター', 'zh-TW': '眼科中心', 'zh-CN': '眼科中心', en: 'Eye Center', ko: '안과 센터' } as Record<Language, string>,
    stat: { ja: '年間白内障手術1,718件', 'zh-TW': '年間白內障手術1,718件', 'zh-CN': '年间白内障手术1,718件', en: '1,718 cataract surgeries/yr', ko: '연간 백내장 수술 1,718건' } as Record<Language, string>,
    icon: Eye,
  },
  {
    name: { ja: 'がんセンター', 'zh-TW': '癌症中心', 'zh-CN': '癌症中心', en: 'Cancer Center', ko: '암 센터' } as Record<Language, string>,
    stat: { ja: 'がんゲノム・CAR-T・IMRT', 'zh-TW': '癌症基因組・CAR-T・IMRT', 'zh-CN': '癌症基因组・CAR-T・IMRT', en: 'Genome, CAR-T, IMRT', ko: '게놈·CAR-T·IMRT' } as Record<Language, string>,
    icon: Microscope,
  },
  {
    name: { ja: '中皮腫センター', 'zh-TW': '間皮瘤中心', 'zh-CN': '间皮瘤中心', en: 'Mesothelioma Center', ko: '중피종 센터' } as Record<Language, string>,
    stat: { ja: '年間800件以上の症例', 'zh-TW': '年間800件以上病例', 'zh-CN': '年间800件以上病例', en: '800+ cases/year', ko: '연간 800건 이상 증례' } as Record<Language, string>,
    icon: Shield,
  },
  {
    name: { ja: '腎移植センター', 'zh-TW': '腎移植中心', 'zh-CN': '肾移植中心', en: 'Renal Transplant Center', ko: '신장이식 센터' } as Record<Language, string>,
    stat: { ja: '累計411件・10年生存率96%', 'zh-TW': '累計411件・10年存活率96%', 'zh-CN': '累计411件・10年存活率96%', en: '411 transplants, 96% 10yr survival', ko: '누적 411건·10년 생존율 96%' } as Record<Language, string>,
    icon: HeartPulse,
  },
  {
    name: { ja: '内視鏡センター', 'zh-TW': '內視鏡中心', 'zh-CN': '内镜中心', en: 'Endoscopy Center', ko: '내시경 센터' } as Record<Language, string>,
    stat: { ja: '年間13,734件の内視鏡検査', 'zh-TW': '年間13,734件內視鏡檢查', 'zh-CN': '年间13,734件内镜检查', en: '13,734 endoscopies/yr', ko: '연간 13,734건 내시경 검사' } as Record<Language, string>,
    icon: Scan,
  },
  {
    name: { ja: '救命救急センター', 'zh-TW': '急救中心', 'zh-CN': '急救中心', en: 'Emergency Center', ko: '구명구급 센터' } as Record<Language, string>,
    stat: { ja: '190万人の命を守る・受入率93%', 'zh-TW': '守護190萬人・接收率93%', 'zh-CN': '守护190万人・接收率93%', en: '1.9M population, 93% acceptance', ko: '190만 명 의료권·수용률 93%' } as Record<Language, string>,
    icon: Zap,
  },
  {
    name: { ja: '周産期センター', 'zh-TW': '周產期中心', 'zh-CN': '周产期中心', en: 'Perinatal Center', ko: '주산기 센터' } as Record<Language, string>,
    stat: { ja: 'NICU15床・兵庫県指定', 'zh-TW': 'NICU15床・兵庫縣指定', 'zh-CN': 'NICU15床・兵库县指定', en: '15-bed NICU, Hyogo designated', ko: 'NICU 15병상·효고현 지정' } as Record<Language, string>,
    icon: Baby,
  },
  {
    name: { ja: 'PETセンター', 'zh-TW': 'PET中心', 'zh-CN': 'PET中心', en: 'PET Center', ko: 'PET 센터' } as Record<Language, string>,
    stat: { ja: 'PET-CT 3台・専用サイクロトロン', 'zh-TW': 'PET-CT 3台・專用迴旋加速器', 'zh-CN': 'PET-CT 3台・专用回旋加速器', en: '3 PET-CTs + on-site cyclotron', ko: 'PET-CT 3대·전용 사이클로트론' } as Record<Language, string>,
    icon: CircleDot,
  },
];

// ======================================
// 合作专家医疗团队 (按疾病分类)
// ======================================
type DoctorCategory = 'cancer_surgery' | 'cancer_medical' | 'heart_brain' | 'digestive' | 'eye_ortho';

const DOCTOR_CATEGORIES: { id: DoctorCategory; label: Record<Language, string>; icon: typeof Activity }[] = [
  { id: 'cancer_surgery', label: { ja: '外科系がん治療', 'zh-TW': '癌症外科治療', 'zh-CN': '癌症外科治疗', en: 'Cancer Surgery', ko: '암 외과 치료' }, icon: Syringe },
  { id: 'cancer_medical', label: { ja: '内科系がん・IVR', 'zh-TW': '癌症內科・IVR', 'zh-CN': '癌症内科・IVR', en: 'Cancer Medical/IVR', ko: '암 내과·IVR' }, icon: Microscope },
  { id: 'heart_brain', label: { ja: '心臓・脳神経', 'zh-TW': '心臟・腦神經', 'zh-CN': '心脏・脑神经', en: 'Heart & Brain', ko: '심장·뇌신경' }, icon: Heart },
  { id: 'digestive', label: { ja: '消化器・IBD', 'zh-TW': '消化道・IBD', 'zh-CN': '消化道・IBD', en: 'Digestive & IBD', ko: '소화기·IBD' }, icon: Activity },
  { id: 'eye_ortho', label: { ja: '眼科・軟骨再生', 'zh-TW': '眼科・軟骨再生', 'zh-CN': '眼科・软骨再生', en: 'Eye & Cartilage', ko: '안과·연골 재생' }, icon: Eye },
];

interface DoctorInfo {
  name: Record<Language, string>;
  title: Record<Language, string>;
  dept: Record<Language, string>;
  specialty: Record<Language, string>;
  highlights: Record<Language, string>[];
  category: DoctorCategory;
  diseases: Record<Language, string>;
  /** Headline achievement badge shown prominently */
  badge: Record<Language, string>;
  /** Gradient for avatar background */
  gradient: string;
  /** Optional photo URL — replace initials avatar when available */
  photoUrl?: string;
}

const EXPERT_DOCTORS: DoctorInfo[] = [
  // ===== 癌症外科 =====
  {
    name: { ja: '篠原 尚', 'zh-TW': '篠原 尚', 'zh-CN': '篠原尚', en: 'Takashi Shinohara', ko: '시노하라 타카시' },
    title: { ja: '主任教授 / 副院長', 'zh-TW': '主任教授 / 副院長', 'zh-CN': '主任教授 / 副院长', en: 'Chief Professor / Vice Director', ko: '주임교수 / 부원장' },
    dept: { ja: '上部消化管外科', 'zh-TW': '上消化道外科', 'zh-CN': '上消化道外科', en: 'Upper GI Surgery', ko: '상부소화관외과' },
    specialty: { ja: '胃がん・食道がんの腹腔鏡・ロボット手術', 'zh-TW': '胃癌・食道癌的腹腔鏡・機器人手術', 'zh-CN': '胃癌・食道癌的腹腔镜・机器人手术', en: 'Gastric & esophageal cancer laparoscopic/robotic surgery', ko: '위암·식도암 복강경/로봇 수술' },
    highlights: [
      { ja: '30年以上消化器がん手術の経験', 'zh-TW': '30多年消化道癌手術經驗', 'zh-CN': '30多年消化道癌手术经验', en: '30+ years in GI cancer surgery', ko: '소화기암 수술 30년 이상 경력' },
      { ja: '腹腔鏡手術・ダヴィンチ手術の先駆者', 'zh-TW': '腹腔鏡・達芬奇手術的先驅者', 'zh-CN': '腹腔镜・达芬奇手术的先驱者', en: 'Pioneer in laparoscopic & Da Vinci surgery', ko: '복강경·다빈치 수술의 선구자' },
      { ja: 'AI支援手術・臨床解剖学の融合', 'zh-TW': 'AI輔助手術與臨床解剖學的融合', 'zh-CN': 'AI辅助手术与临床解剖学的融合', en: 'AI-assisted surgery & clinical anatomy integration', ko: 'AI 지원 수술·임상 해부학 융합' },
    ],
    category: 'cancer_surgery',
    diseases: { ja: '胃がん、食道がん', 'zh-TW': '胃癌、食道癌', 'zh-CN': '胃癌、食道癌', en: 'Gastric cancer, Esophageal cancer', ko: '위암, 식도암' },
    badge: { ja: 'ロボット手術の先駆者', 'zh-TW': '機器人手術先驅者', 'zh-CN': '机器人手术先驱者', en: 'Robotic Surgery Pioneer', ko: '로봇 수술의 선구자' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://www.hyo-med.ac.jp/department/gi-surgery/images/shinohara2024-2.png',
  },
  {
    name: { ja: '池田 正孝', 'zh-TW': '池田 正孝', 'zh-CN': '池田正孝', en: 'Masataka Ikeda', ko: '이케다 마사타카' },
    title: { ja: '主任教授 / 診療部長', 'zh-TW': '主任教授 / 診療部長', 'zh-CN': '主任教授 / 诊疗部长', en: 'Chief Professor / Clinical Director', ko: '주임교수 / 임상의학부장' },
    dept: { ja: '下部消化管外科', 'zh-TW': '下消化道外科', 'zh-CN': '下消化道外科', en: 'Lower GI Surgery', ko: '하부소화관외과' },
    specialty: { ja: '直腸がんのロボット支援手術・重粒子治療', 'zh-TW': '直腸癌的機器人手術・重粒子治療', 'zh-CN': '直肠癌的机器人手术・重粒子治疗', en: 'Rectal cancer robotic surgery & particle therapy', ko: '직장암 로봇 수술·입자선 치료' },
    highlights: [
      { ja: '直腸癌拡大手術で国際的評価', 'zh-TW': '直腸癌擴大手術享有國際聲譽', 'zh-CN': '直肠癌扩大手术享有国际声誉', en: 'Internationally renowned for advanced rectal cancer surgery', ko: '진행·재발 직장암 수술로 국제적 명성' },
      { ja: 'ダヴィンチロボット＋重粒子線治療', 'zh-TW': '達芬奇機器人＋重粒子線治療', 'zh-CN': '达芬奇机器人＋重粒子线治疗', en: 'Da Vinci robot + particle beam therapy', ko: '다빈치 로봇 + 입자선 치료' },
      { ja: '進行期・再発直腸癌の個別化治療', 'zh-TW': '進展期・復發直腸癌的個體化治療', 'zh-CN': '进展期・复发直肠癌的个体化治疗', en: 'Personalized treatment for advanced/recurrent rectal cancer', ko: '진행·재발 직장암의 개별 최적 치료' },
    ],
    category: 'cancer_surgery',
    diseases: { ja: '直腸がん、大腸がん', 'zh-TW': '直腸癌、大腸癌', 'zh-CN': '直肠癌、大肠癌', en: 'Rectal cancer, Colorectal cancer', ko: '직장암, 대장암' },
    badge: { ja: '国際的評価の直腸がん権威', 'zh-TW': '國際聲譽的直腸癌權威', 'zh-CN': '国际声誉的直肠癌权威', en: 'Internationally Renowned', ko: '국제적 명성' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
  },
  {
    name: { ja: '馬淵 誠士', 'zh-TW': '馬淵 誠士', 'zh-CN': '马渊诚士', en: 'Seishi Mabuchi', ko: '마부치 세이시' },
    title: { ja: '主任教授 / 診療部長 / 生殖医療中心主任', 'zh-TW': '主任教授 / 診療部長 / 生殖醫療中心主任', 'zh-CN': '主任教授 / 诊疗部长 / 生殖医疗中心主任', en: 'Chief Professor / Reproductive Center Director', ko: '주임교수 / 생식센터장' },
    dept: { ja: '産科婦人科（婦人科腫瘍）', 'zh-TW': '婦產科（婦科腫瘤）', 'zh-CN': '妇产科（妇科肿瘤）', en: 'OB/GYN (Gynecologic Oncology)', ko: '산부인과(부인종양)' },
    specialty: { ja: '子宮がん・卵巣がんのロボット・腹腔鏡手術', 'zh-TW': '子宮癌・卵巢癌的機器人・腹腔鏡手術', 'zh-CN': '子宫癌・卵巢癌的机器人・腹腔镜手术', en: 'Uterine/ovarian cancer robotic & laparoscopic surgery', ko: '자궁암·난소암 로봇·복강경 수술' },
    highlights: [
      { ja: 'ダヴィンチ・腹腔鏡・vNOTES手術', 'zh-TW': '達芬奇・腹腔鏡・vNOTES手術', 'zh-CN': '达芬奇・腹腔镜・vNOTES手术', en: 'Da Vinci, laparoscopic & vNOTES surgery', ko: '다빈치·복강경·vNOTES 수술' },
      { ja: '再発子宮頸がんの根治的救済手術', 'zh-TW': '復發子宮頸癌的根治性挽救手術', 'zh-CN': '复发子宫颈癌的根治性挽救手术', en: 'Radical salvage surgery for recurrent cervical cancer', ko: '재발 자궁경부암 근치 구제 수술' },
      { ja: '妊孕性温存 — 卵巣凍結保存・保留手術', 'zh-TW': '保留生育力 — 卵巢冷凍保存・保留手術', 'zh-CN': '保留生育力 — 卵巢冷冻保存・保留手术', en: 'Fertility preservation — ovarian cryopreservation', ko: '임신 기능 온존 — 난소 동결 보존' },
    ],
    category: 'cancer_surgery',
    diseases: { ja: '子宮がん、卵巣がん、外陰がん', 'zh-TW': '子宮癌、卵巢癌、外陰癌', 'zh-CN': '子宫癌、卵巢癌、外阴癌', en: 'Uterine, Ovarian, Vulvar cancer', ko: '자궁암, 난소암, 외음부암' },
    badge: { ja: '妊孕性温存の希望', 'zh-TW': '保留生育力的希望', 'zh-CN': '保留生育力的希望', en: 'Fertility Preservation', ko: '임신 기능 온존' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://hyogo-deptobgyn.jp/wp-content/themes/hyogo-obgyn/images/kyoshitu/professor.jpg',
  },
  // ===== 癌症内科・IVR =====
  {
    name: { ja: '木島 貴志', 'zh-TW': '木島 貴志', 'zh-CN': '木岛贵志', en: 'Takashi Kijima', ko: '키지마 타카시' },
    title: { ja: '副院長 / がんセンター主任', 'zh-TW': '副院長 / 癌症中心主任', 'zh-CN': '副院长 / 癌症中心主任', en: 'Vice Director / Cancer Center Chief', ko: '부원장 / 암센터장' },
    dept: { ja: '呼吸器・血液内科学', 'zh-TW': '呼吸・血液內科學', 'zh-CN': '呼吸・血液内科学', en: 'Respiratory & Hematology', ko: '호흡기·혈액내과' },
    specialty: { ja: '肺がん・中皮腫の化学免疫療法・ゲノム医療', 'zh-TW': '肺癌・間皮瘤的化學免疫療法・基因組醫療', 'zh-CN': '肺癌・间皮瘤的化学免疫疗法・基因组医疗', en: 'Lung cancer & mesothelioma chemo-immunotherapy & genomics', ko: '폐암·중피종 화학면역요법·게놈 의료' },
    highlights: [
      { ja: 'CHEMO-IMMUNO（化学＋免疫）療法を主導', 'zh-TW': '主導CHEMO-IMMUNO（化學＋免疫）療法', 'zh-CN': '主导CHEMO-IMMUNO（化学＋免疫）疗法', en: 'Leading CHEMO-IMMUNO (chemo + immune) therapy', ko: 'CHEMO-IMMUNO(화학+면역) 요법의 선도적 실시' },
      { ja: 'がんゲノム解析＋AI診断研究', 'zh-TW': '癌症基因組分析＋AI診斷研究', 'zh-CN': '癌症基因组分析＋AI诊断研究', en: 'Cancer genomic analysis + AI diagnostic research', ko: '암 게놈 분석 + AI 진단 연구' },
      { ja: '早期診断から緩和医療まで一体化', 'zh-TW': '從早期診斷到緩和醫療一體化', 'zh-CN': '从早期诊断到缓和医疗一体化', en: 'Integrated care from early diagnosis to palliative', ko: '조기 진단부터 완화 케어까지 통합 진료' },
    ],
    category: 'cancer_medical',
    diseases: { ja: '肺がん、中皮腫', 'zh-TW': '肺癌、間皮瘤', 'zh-CN': '肺癌、间皮瘤', en: 'Lung cancer, Mesothelioma', ko: '폐암, 중피종' },
    badge: { ja: '副院長 / がんセンター長', 'zh-TW': '副院長 / 癌症中心主任', 'zh-CN': '副院长 / 癌症中心主任', en: 'Vice Director / Cancer Center', ko: '부원장 / 암센터' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://www.hyo-med.ac.jp/department/rspr/images/pht_prof01.jpg',
  },
  {
    name: { ja: '栗林 康造 / 舟木 壮一郎', 'zh-TW': '栗林 康造 / 舟木 壯一郎', 'zh-CN': '栗林康造 / 舟木壮一郎', en: 'Kuribayashi / Funaki', ko: '쿠리바야시 / 후나키' },
    title: { ja: '教授（内科）/ 主任教授（外科）', 'zh-TW': '教授（內科）/ 主任教授（外科）', 'zh-CN': '教授（内科）/ 主任教授（外科）', en: 'Professor (Med) / Chief Prof (Surg)', ko: '교수(내과) / 주임교수(외과)' },
    dept: { ja: '中皮腫センター', 'zh-TW': '間皮瘤中心', 'zh-CN': '间皮瘤中心', en: 'Mesothelioma Center', ko: '중피종 센터' },
    specialty: { ja: '悪性中皮腫の内科・外科一体診療', 'zh-TW': '惡性間皮瘤的內外科一體診療', 'zh-CN': '恶性间皮瘤的内外科一体诊疗', en: 'Integrated medical-surgical mesothelioma care', ko: '중피종 내과·외과 일체형 진료' },
    highlights: [
      { ja: '日本最多の年間800件以上の症例', 'zh-TW': '日本最多的年間800件以上病例', 'zh-CN': '日本最多的年间800件以上病例', en: 'Japan\'s highest volume: 800+ cases/year', ko: '일본 최다 연간 800건 이상의 증례' },
      { ja: '栗林教授：日本石綿・中皮腫学会理事', 'zh-TW': '栗林教授：日本石棉・間皮瘤學會理事', 'zh-CN': '栗林教授：日本石棉・间皮瘤学会理事', en: 'Prof. Kuribayashi: Director, Japan Asbestos-Mesothelioma Society', ko: '쿠리바야시 교수: 일본석면중피종학회 이사장' },
      { ja: '舟木教授：胸腔鏡手術のエキスパート', 'zh-TW': '舟木教授：胸腔鏡手術專家', 'zh-CN': '舟木教授：胸腔镜手术专家', en: 'Prof. Funaki: Thoracoscopic surgery expert', ko: '후나키 교수: 흉강경 수술 전문가' },
    ],
    category: 'cancer_medical',
    diseases: { ja: '悪性中皮腫、肺がん', 'zh-TW': '惡性間皮瘤、肺癌', 'zh-CN': '恶性间皮瘤、肺癌', en: 'Mesothelioma, Lung cancer', ko: '중피종, 폐암' },
    badge: { ja: '年間800件+ 日本最多', 'zh-TW': '年間800件+ 日本最多', 'zh-CN': '年间800件+ 日本最多', en: '800+ Cases/yr #1 Japan', ko: '연간 800건 이상 일본 1위' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://www.hyo-med.ac.jp/department/rspr/images/pht_kuribayashi.png',
  },
  {
    name: { ja: '吉原 哲', 'zh-TW': '吉原 哲', 'zh-CN': '吉原哲', en: 'Satoshi Yoshihara', ko: '요시하라 사토시' },
    title: { ja: '教授 / 診療部部長 / 輸血・細胞治療センター副主任', 'zh-TW': '教授 / 診療部部長 / 輸血・細胞治療中心副主任', 'zh-CN': '教授 / 诊疗部部长 / 输血・细胞治疗中心副主任', en: 'Professor / Cell Therapy Center Vice Director', ko: '교수 / 세포치료센터 부센터장' },
    dept: { ja: '血液内科', 'zh-TW': '血液內科', 'zh-CN': '血液内科', en: 'Hematology', ko: '혈액내과' },
    specialty: { ja: 'CAR-T細胞療法・造血幹細胞移植', 'zh-TW': 'CAR-T細胞療法・造血幹細胞移植', 'zh-CN': 'CAR-T细胞疗法・造血干细胞移植', en: 'CAR-T cell therapy & stem cell transplant', ko: 'CAR-T 세포치료·조혈모세포이식' },
    highlights: [
      { ja: 'CAR-T細胞療法の日本導入を先導', 'zh-TW': '領先推動CAR-T細胞療法在日本的引進', 'zh-CN': '领先推动CAR-T细胞疗法在日本的引进', en: 'Leading CAR-T cell therapy introduction in Japan', ko: '일본 내 CAR-T 세포치료 도입의 선도적 역할' },
      { ja: '厚生労働省認定CAR-T療法機関', 'zh-TW': '厚生勞動省認定CAR-T療法機構', 'zh-CN': '厚生劳动省认定CAR-T疗法机构', en: 'MHLW-certified CAR-T therapy institution', ko: '후생노동성 인정 CAR-T 치료 시설' },
      { ja: 'CRS副作用対策の研究で成果', 'zh-TW': 'CRS副作用對策研究的成果', 'zh-CN': 'CRS副作用对策研究的成果', en: 'Research achievements in CRS side-effect management', ko: 'CRS(사이토카인 방출 증후군) 부작용 관리 연구 실적' },
    ],
    category: 'cancer_medical',
    diseases: { ja: 'ALL、DLBCL、多発性骨髄腫', 'zh-TW': 'ALL、DLBCL、多發性骨髓瘤', 'zh-CN': 'ALL、DLBCL、多发性骨髓瘤', en: 'ALL, DLBCL, Multiple Myeloma', ko: 'ALL, DLBCL, 다발골수종' },
    badge: { ja: 'CAR-T細胞療法 認定機関', 'zh-TW': 'CAR-T細胞療法 認定機構', 'zh-CN': 'CAR-T细胞疗法 认定机构', en: 'CAR-T Certified Center', ko: 'CAR-T 인정 시설' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://www.hyo-med.ac.jp/department/hmt/images/mainimg_face_pc.jpg',
  },
  {
    name: { ja: '山門 亨一郎 / 高木 治行', 'zh-TW': '山門 亨一郎 / 高木 治行', 'zh-CN': '山门亨一郎 / 高木治行', en: 'Yamakado / Takaki', ko: '야마카도 / 타카키' },
    title: { ja: '主任教授 / 教授', 'zh-TW': '主任教授 / 教授', 'zh-CN': '主任教授 / 教授', en: 'Chief Professor / Professor', ko: '주임교수 / 교수' },
    dept: { ja: 'IVRセンター（放射線科）', 'zh-TW': 'IVR中心（放射科）', 'zh-CN': 'IVR中心（放射科）', en: 'IVR Center (Radiology)', ko: 'IVR 센터(방사선과)' },
    specialty: { ja: '肝がん・肺がん・腎がんの微創介入治療', 'zh-TW': '肝癌・肺癌・腎癌的微創介入治療', 'zh-CN': '肝癌・肺癌・肾癌的微创介入治疗', en: 'Minimally invasive interventional radiology for liver/lung/kidney cancer', ko: '간암·폐암·신장암의 최소침습 인터벤션 치료' },
    highlights: [
      { ja: '山門教授：日本IVR医学会理事長', 'zh-TW': '山門教授：日本IVR醫學會理事長', 'zh-CN': '山门教授：日本IVR医学会理事长', en: 'Prof. Yamakado: President, Japan IVR Society', ko: '야마카도 교수: 일본IVR학회 이사장' },
      { ja: '高木教授：国際腫瘍介入治療専家', 'zh-TW': '高木教授：國際腫瘤介入治療專家', 'zh-CN': '高木教授：国际肿瘤介入治疗专家', en: 'Prof. Takaki: International interventional oncology expert', ko: '타카키 교수: 국제 인터벤션 종양학 전문가' },
      { ja: '切らない手術 — 消融・栓塞・導管治療', 'zh-TW': '不開刀手術 — 消融・栓塞・導管治療', 'zh-CN': '不开刀手术 — 消融・栓塞・导管治疗', en: 'Non-surgical: ablation, embolization, catheter therapy', ko: '비수술: 어블레이션·색전술·카테터 치료' },
    ],
    category: 'cancer_medical',
    diseases: { ja: '肝がん、肺がん、腎がん、子宮筋腫', 'zh-TW': '肝癌、肺癌、腎癌、子宮肌瘤', 'zh-CN': '肝癌、肺癌、肾癌、子宫肌瘤', en: 'Liver, Lung, Kidney cancer, Uterine fibroids', ko: '간암, 폐암, 신장암, 자궁근종' },
    badge: { ja: 'IVR学会理事長', 'zh-TW': 'IVR學會理事長', 'zh-CN': 'IVR学会理事长', en: 'IVR Society President', ko: 'IVR학회 이사장' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://hcm-radiology.com/images/guide_yamakado.jpg',
  },
  // ===== 心脏・脑神经 =====
  {
    name: { ja: '坂口 太一', 'zh-TW': '坂口 太一', 'zh-CN': '坂口太一', en: 'Taichi Sakaguchi', ko: '사카구치 타이치' },
    title: { ja: '主任教授', 'zh-TW': '主任教授', 'zh-CN': '主任教授', en: 'Chief Professor', ko: '주임교수' },
    dept: { ja: '心臓血管外科', 'zh-TW': '心臟血管外科', 'zh-CN': '心脏血管外科', en: 'Cardiovascular Surgery', ko: '심장혈관외과' },
    specialty: { ja: 'MICS（低侵襲心臓手術）', 'zh-TW': 'MICS（低侵襲心臟手術）', 'zh-CN': 'MICS（低侵袭心脏手术）', en: 'MICS (Minimally Invasive Cardiac Surgery)', ko: 'MICS(최소침습 심장수술)' },
    highlights: [
      { ja: '累計1,000例以上のMICS手術', 'zh-TW': '累計1,000例以上的MICS手術', 'zh-CN': '累计1,000例以上的MICS手术', en: '1,000+ MICS procedures performed', ko: 'MICS 수술 1,000건 이상 실적' },
      { ja: '日本低侵襲心臓手術学会（JMICS）理事長', 'zh-TW': '日本低侵襲心臟手術學會（JMICS）理事長', 'zh-CN': '日本低侵袭心脏手术学会（JMICS）理事长', en: 'President, Japan MICS Society (JMICS)', ko: '일본MICS학회(JMICS) 회장' },
      { ja: '全日本60以上の医院で手術指導', 'zh-TW': '在全日本60多家醫院進行手術指導', 'zh-CN': '在全日本60多家医院进行手术指导', en: 'Surgical training at 60+ hospitals across Japan', ko: '일본 전국 60개 이상 병원에서 수술 지도' },
    ],
    category: 'heart_brain',
    diseases: { ja: '弁膜症、冠動脈疾患、大動脈疾患', 'zh-TW': '瓣膜病、冠狀動脈疾病、大動脈疾病', 'zh-CN': '瓣膜病、冠状动脉疾病、大动脉疾病', en: 'Valvular disease, Coronary artery disease, Aortic disease', ko: '판막질환, 관상동맥질환, 대동맥질환' },
    badge: { ja: 'MICS 1,000例+', 'zh-TW': 'MICS 1,000例+', 'zh-CN': 'MICS 1,000例+', en: 'MICS 1,000+ Cases', ko: 'MICS 1,000건 이상' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
  },
  {
    name: { ja: '吉村 紳一', 'zh-TW': '吉村 紳一', 'zh-CN': '吉村绅一', en: 'Shinichi Yoshimura', ko: '요시무라 신이치' },
    title: { ja: '主任教授', 'zh-TW': '主任教授', 'zh-CN': '主任教授', en: 'Chief Professor', ko: '주임교수' },
    dept: { ja: '脳神経外科', 'zh-TW': '腦神經外科', 'zh-CN': '脑神经外科', en: 'Neurosurgery', ko: '뇌신경외과' },
    specialty: { ja: '脊髄損傷・脳血管疾患・神経再生', 'zh-TW': '脊髓損傷・腦血管疾病・神經再生', 'zh-CN': '脊髓损伤・脑血管疾病・神经再生', en: 'Spinal cord injury, Cerebrovascular disease, Neural regeneration', ko: '척수 손상, 뇌혈관질환, 신경재생' },
    highlights: [
      { ja: '累計約4,000件の脳神経手術', 'zh-TW': '累計約4,000件腦神經手術', 'zh-CN': '累计约4,000件脑神经手术', en: '~4,000 neurosurgical procedures', ko: '뇌신경외과 수술 약 4,000건' },
      { ja: 'NHK・朝日テレビ等メディア出演', 'zh-TW': 'NHK・朝日電視台等媒體出演', 'zh-CN': 'NHK・朝日电视台等媒体出演', en: 'Featured on NHK, Asahi TV and major media', ko: 'NHK·아사히TV 등 주요 미디어에 출연' },
      { ja: 'フローダイバーター治療（全国数施設のみ）', 'zh-TW': 'Flow Diverter治療（全國僅數家）', 'zh-CN': 'Flow Diverter治疗（全国仅数家）', en: 'Flow Diverter therapy (available at only a few hospitals in Japan)', ko: '플로우 다이버터 치료(전국 소수 시설만 가능)' },
    ],
    category: 'heart_brain',
    diseases: { ja: '脳卒中、脊髄損傷、脳動脈瘤、脳腫瘍', 'zh-TW': '腦中風、脊髓損傷、腦動脈瘤、腦腫瘤', 'zh-CN': '脑中风、脊髓损伤、脑动脉瘤、脑肿瘤', en: 'Stroke, Spinal cord injury, Brain aneurysm, Brain tumor', ko: '뇌졸중, 척수 손상, 뇌동맥류, 뇌종양' },
    badge: { ja: '累計4,000例 / NHK出演', 'zh-TW': '累計4,000例 / NHK出演', 'zh-CN': '累计4,000例 / NHK出演', en: '4,000 Cases / NHK Featured', ko: '4,000건 / NHK 출연' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
  },
  // ===== 消化道・IBD =====
  {
    name: { ja: '池内 浩基', 'zh-TW': '池内 浩基', 'zh-CN': '池内浩基', en: 'Hiroki Ikeuchi', ko: '이케우치 히로키' },
    title: { ja: '病院長 / 主任教授', 'zh-TW': '院長 / 主任教授', 'zh-CN': '院长 / 主任教授', en: 'Hospital Director / Chief Professor', ko: '병원장 / 주임교수' },
    dept: { ja: '炎症性腸疾患外科', 'zh-TW': '炎症性腸病外科', 'zh-CN': '炎症性肠病外科', en: 'IBD Surgery', ko: 'IBD 외과' },
    specialty: { ja: 'IBD外科治療の専門家', 'zh-TW': 'IBD外科治療專家', 'zh-CN': 'IBD外科治疗专家', en: 'IBD surgical treatment specialist', ko: 'IBD 외과 치료 전문가' },
    highlights: [
      { ja: 'UC・CD住院患者数 全国DPC第1位', 'zh-TW': 'UC・CD住院患者數 全國DPC第1', 'zh-CN': 'UC・CD住院患者数 全国DPC第1', en: '#1 nationally in UC & CD hospitalization (DPC)', ko: 'UC·CD 입원환자 수 전국 DPC 1위' },
      { ja: '累計手術4,140件以上', 'zh-TW': '累計手術4,140件以上', 'zh-CN': '累计手术4,140件以上', en: '4,140+ cumulative surgeries', ko: '누적 4,140건 이상 수술' },
      { ja: '微創手術＋多学科協作チーム', 'zh-TW': '微創手術＋多學科協作團隊', 'zh-CN': '微创手术＋多学科协作团队', en: 'Minimally invasive surgery + multidisciplinary team', ko: '최소침습 수술 + 다학제 팀' },
    ],
    category: 'digestive',
    diseases: { ja: '潰瘍性大腸炎、クローン病', 'zh-TW': '潰瘍性大腸炎、克羅恩病', 'zh-CN': '溃疡性大肠炎、克罗恩病', en: 'Ulcerative Colitis, Crohn\'s Disease', ko: '궤양성 대장염, 크론병' },
    badge: { ja: '病院長 / IBD全国DPC 1位', 'zh-TW': '院長 / IBD全國DPC第1', 'zh-CN': '院长 / IBD全国DPC第1', en: 'Director / IBD #1 DPC', ko: '병원장 / IBD DPC 전국 1위' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://www.hosp.hyo-med.ac.jp/new-building/common/img/ikeuchi.jpg',
  },
  {
    name: { ja: '新崎 信一郎', 'zh-TW': '新崎 信一郎', 'zh-CN': '新崎信一郎', en: 'Shinichiro Shinzaki', ko: '신자키 신이치로' },
    title: { ja: '消化管内科 主任教授 / IBDセンター主任', 'zh-TW': '消化道內科 主任教授 / IBD中心主任', 'zh-CN': '消化道内科 主任教授 / IBD中心主任', en: 'Chief Professor, GI Medicine / IBD Center Director', ko: '주임교수, 소화기내과 / IBD센터장' },
    dept: { ja: '消化管内科 / IBDセンター', 'zh-TW': '消化道內科 / IBD中心', 'zh-CN': '消化道内科 / IBD中心', en: 'GI Medicine / IBD Center', ko: '소화기내과 / IBD 센터' },
    specialty: { ja: 'IBDの薬物治療・生物学的製剤・総合管理', 'zh-TW': 'IBD的藥物治療・生物製劑・綜合管理', 'zh-CN': 'IBD的药物治疗・生物制剂・综合管理', en: 'IBD medication, biologics & comprehensive management', ko: 'IBD 약물·생물학적 제제·종합 관리' },
    highlights: [
      { ja: '年間2,000件以上の生物学的製剤治療', 'zh-TW': '年間2,000件以上生物製劑治療', 'zh-CN': '年间2,000件以上生物制剂治疗', en: '2,000+ biologic treatments annually', ko: '연간 2,000건 이상 생물학적 제제 치료' },
      { ja: 'アジアIBD領域の権威', 'zh-TW': '亞洲IBD領域的權威', 'zh-CN': '亚洲IBD领域的权威', en: 'Renowned authority in Asia\'s IBD field', ko: '아시아 IBD 분야 권위자' },
      { ja: '個体化薬物モニタリング・精密治療', 'zh-TW': '個體化藥物監測・精準治療', 'zh-CN': '个体化药物监测・精准治疗', en: 'Personalized drug monitoring & precision treatment', ko: '개별 약물 모니터링·정밀 치료' },
    ],
    category: 'digestive',
    diseases: { ja: '潰瘍性大腸炎、クローン病', 'zh-TW': '潰瘍性大腸炎、克羅恩病', 'zh-CN': '溃疡性大肠炎、克罗恩病', en: 'Ulcerative Colitis, Crohn\'s Disease', ko: '궤양성 대장염, 크론병' },
    badge: { ja: 'IBDセンター主任', 'zh-TW': 'IBD中心主任', 'zh-CN': 'IBD中心主任', en: 'IBD Center Director', ko: 'IBD 센터장' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://hyo-med-gastro.jp/img/staff/staff_SHINZAKI.jpg',
  },
  {
    name: { ja: '富田 寿彦', 'zh-TW': '富田 壽彥', 'zh-CN': '富田寿彦', en: 'Toshihiko Tomita', ko: '토미타 토시히코' },
    title: { ja: '主任教授 / 内視鏡センター主任 / 梅田健康医学センター院長', 'zh-TW': '主任教授 / 內視鏡中心主任 / 梅田健康醫學中心院長', 'zh-CN': '主任教授 / 内窥镜中心主任 / 梅田健康医学中心院长', en: 'Chief Prof / Endoscopy Center Director / Umeda Health Center Director', ko: '주임교수 / 내시경센터장 / 우메다건강센터장' },
    dept: { ja: '健康医療学 / 内視鏡センター', 'zh-TW': '健康醫療學 / 內視鏡中心', 'zh-CN': '健康医疗学 / 内窥镜中心', en: 'Health Medicine / Endoscopy Center', ko: '건강의학 / 내시경 센터' },
    specialty: { ja: '消化器早期がんの内視鏡精密診断・微創治療', 'zh-TW': '消化道早期癌的內視鏡精密診斷・微創治療', 'zh-CN': '消化道早期癌的内窥镜精密诊断・微创治疗', en: 'Early GI cancer endoscopic precision diagnosis & treatment', ko: '조기 소화기암 내시경 정밀 진단·치료' },
    highlights: [
      { ja: '累計数千例のEMR/ESD実績', 'zh-TW': '累計數千例EMR/ESD實績', 'zh-CN': '累计数千例EMR/ESD实绩', en: 'Thousands of EMR/ESD procedures', ko: 'EMR/ESD 수천 건 실적' },
      { ja: 'NBI拡大内視鏡・超音波内視鏡の国際的先駆者', 'zh-TW': 'NBI放大內視鏡・超音波內視鏡的國際先驅者', 'zh-CN': 'NBI放大内镜・超声内镜的国际先驱者', en: 'International pioneer in NBI magnification & EUS', ko: 'NBI 확대 내시경·EUS의 국제적 선구자' },
      { ja: 'AI内視鏡診断システム導入', 'zh-TW': '引進AI內視鏡診斷系統', 'zh-CN': '引进AI内窥镜诊断系统', en: 'Introduced AI-assisted endoscopic diagnosis', ko: 'AI 지원 내시경 진단 도입' },
    ],
    category: 'digestive',
    diseases: { ja: '胃がん、大腸がん、食道がん（早期）', 'zh-TW': '胃癌、大腸癌、食道癌（早期）', 'zh-CN': '胃癌、大肠癌、食道癌（早期）', en: 'Gastric, Colorectal, Esophageal cancer (early stage)', ko: '위암, 대장암, 식도암(조기)' },
    badge: { ja: 'AI内視鏡 / 数千例EMR/ESD', 'zh-TW': 'AI內視鏡 / 數千例EMR/ESD', 'zh-CN': 'AI内镜 / 数千例EMR/ESD', en: 'AI Endoscopy / 1000s EMR/ESD', ko: 'AI 내시경 / EMR·ESD 수천건' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://hyo-med-gastro.jp/img/staff/staff_TOMITA_2024.png',
  },
  // ===== 眼科・软骨再生 =====
  {
    name: { ja: '五味 文', 'zh-TW': '五味 文', 'zh-CN': '五味文', en: 'Aya Gomi', ko: '고미 아야' },
    title: { ja: '主任教授 / 診療部長', 'zh-TW': '主任教授 / 診療部長', 'zh-CN': '主任教授 / 诊疗部长', en: 'Chief Professor / Clinical Director', ko: '주임교수 / 임상의학부장' },
    dept: { ja: '眼科', 'zh-TW': '眼科', 'zh-CN': '眼科', en: 'Ophthalmology', ko: '안과' },
    specialty: { ja: '黄斑疾患・糖尿病網膜症・ぶどう膜炎', 'zh-TW': '黃斑疾病・糖尿病視網膜病變・葡萄膜炎', 'zh-CN': '黄斑疾病・糖尿病视网膜病变・葡萄膜炎', en: 'Macular disease, Diabetic retinopathy, Uveitis', ko: '황반질환, 당뇨병성 망막증, 포도막염' },
    highlights: [
      { ja: '抗VEGF・PDT・硝子体注射の前沿応用', 'zh-TW': '抗VEGF・PDT・玻璃體注射的前沿應用', 'zh-CN': '抗VEGF・PDT・玻璃体注射的前沿应用', en: 'Cutting-edge anti-VEGF, PDT & intravitreal injection', ko: '최첨단 항VEGF·PDT·유리체내 주사' },
      { ja: 'AMD・CSC・糖尿病網膜症の権威', 'zh-TW': 'AMD・CSC・糖尿病視網膜病變的權威', 'zh-CN': 'AMD・CSC・糖尿病视网膜病变的权威', en: 'Authority on AMD, CSC & diabetic retinopathy', ko: 'AMD·CSC·당뇨병성 망막증의 권위자' },
      { ja: '多数の臨床研究をリードする核心人物', 'zh-TW': '領導多項臨床研究的核心人物', 'zh-CN': '领导多项临床研究的核心人物', en: 'Core leader of multiple clinical research programs', ko: '다수의 임상연구 프로그램 핵심 리더' },
    ],
    category: 'eye_ortho',
    diseases: { ja: '加齢黄斑変性、糖尿病網膜症、ぶどう膜炎', 'zh-TW': '老年性黃斑變性、糖尿病視網膜病變、葡萄膜炎', 'zh-CN': '老年性黄斑变性、糖尿病视网膜病变、葡萄膜炎', en: 'AMD, Diabetic retinopathy, Uveitis', ko: 'AMD, 당뇨병성 망막증, 포도막염' },
    badge: { ja: '眼科の臨床研究リーダー', 'zh-TW': '眼科臨床研究領導者', 'zh-CN': '眼科临床研究领导者', en: 'Ophthalmology Research Leader', ko: '안과 연구 리더' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
    photoUrl: 'https://hyo-med-ganka.jp/webcms/wp-content/themes/hyo-med-ganka/assets/img/top/top_img01.jpg',
  },
  {
    name: { ja: 'JACC®軟骨再生チーム', 'zh-TW': 'JACC®軟骨再生團隊', 'zh-CN': 'JACC®软骨再生团队', en: 'JACC® Cartilage Regen Team', ko: 'JACC® 연골재생 팀' },
    title: { ja: '整形外科 専門チーム', 'zh-TW': '骨科 專門團隊', 'zh-CN': '骨科 专门团队', en: 'Orthopedics Specialist Team', ko: '정형외과 전문가 팀' },
    dept: { ja: '整形外科', 'zh-TW': '骨科', 'zh-CN': '骨科', en: 'Orthopedics', ko: '정형외과' },
    specialty: { ja: '自家培養軟骨JACC®移植による膝関節再生', 'zh-TW': '自體培養軟骨JACC®移植膝關節再生', 'zh-CN': '自体培养软骨JACC®移植膝关节再生', en: 'JACC® autologous cultured cartilage knee regeneration', ko: 'JACC® 자가배양 연골 무릎 재생' },
    highlights: [
      { ja: '厚生労働省承認の軟骨再生治療（JACC®）', 'zh-TW': '厚生勞動省批准的軟骨再生治療（JACC®）', 'zh-CN': '厚生劳动省批准的软骨再生治疗（JACC®）', en: 'MHLW-approved cartilage regeneration therapy (JACC®)', ko: '후생노동성 승인 연골재생치료(JACC®)' },
      { ja: '実績1,900例以上（7年間225例の臨床研究）', 'zh-TW': '實績1,900例以上（7年225例臨床研究）', 'zh-CN': '实绩1,900例以上（7年225例临床研究）', en: '1,900+ cases (225 in 7-year clinical study)', ko: '1,900건 이상(7년간 임상연구 225건)' },
      { ja: 'GCTP・GMP基準の細胞培養', 'zh-TW': '符合GCTP・GMP標準的細胞培養', 'zh-CN': '符合GCTP・GMP标准的细胞培养', en: 'GCTP & GMP-standard cell cultivation', ko: 'GCTP·GMP 기준 세포 배양' },
    ],
    category: 'eye_ortho',
    diseases: { ja: '膝軟骨損傷、離断性骨軟骨炎、変形性膝関節症', 'zh-TW': '膝軟骨損傷、離斷性骨軟骨炎、退化性膝關節炎', 'zh-CN': '膝软骨损伤、离断性骨软骨炎、变形性膝关节症', en: 'Knee cartilage injury, Osteochondritis, Knee osteoarthritis', ko: '무릎 연골손상, 골연골염, 무릎 골관절증' },
    badge: { ja: '厚労省承認 / 1,900例+', 'zh-TW': '厚勞省批准 / 1,900例+', 'zh-CN': '厚劳省批准 / 1,900例+', en: 'MHLW-Approved / 1,900+', ko: '후생노동성 승인 / 1,900건 이상' },
    gradient: 'from-[#0f7459] to-[#1766b0]',
  },
];

// 色彩映射
const ICON_COLORS: Record<string, { bg: string; text: string; hoverBg: string }> = {
  blue: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  purple: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  indigo: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  pink: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  orange: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  teal: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  green: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  red: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  amber: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  violet: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  rose: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
  sky: { bg: 'bg-[#ecf3f1]', text: 'text-[#0f7459]', hoverBg: 'group-hover:bg-[#0f7459]' },
};

// 诊疗科室
const DEPARTMENTS = {
  internal: [
    { ja: '循環器内科', 'zh-TW': '循環器內科', 'zh-CN': '循环器内科', en: 'Cardiovascular Medicine' },
    { ja: '呼吸器内科', 'zh-TW': '呼吸器內科', 'zh-CN': '呼吸器内科', en: 'Respiratory Medicine', ko: '호흡기내과' },
    { ja: '脳神経内科', 'zh-TW': '腦神經內科', 'zh-CN': '脑神经内科', en: 'Neurology' },
    { ja: '腎・透析内科', 'zh-TW': '腎・透析內科', 'zh-CN': '肾・透析内科', en: 'Nephrology & Dialysis' },
    { ja: '血液内科', 'zh-TW': '血液內科', 'zh-CN': '血液内科', en: 'Hematology', ko: '혈액내과' },
    { ja: '糖尿病・内分泌・代謝内科', 'zh-TW': '糖尿病・內分泌・代謝內科', 'zh-CN': '糖尿病・内分泌・代谢内科', en: 'Diabetes & Endocrinology' },
    { ja: '肝・胆・膵内科', 'zh-TW': '肝・膽・胰內科', 'zh-CN': '肝・胆・胰内科', en: 'Hepatobiliary & Pancreatic' },
    { ja: '消化管内科', 'zh-TW': '消化道內科', 'zh-CN': '消化道内科', en: 'Gastroenterology', ko: '소화기내과' },
    { ja: 'アレルギー・リウマチ内科', 'zh-TW': '過敏・風濕內科', 'zh-CN': '过敏・风湿内科', en: 'Allergy & Rheumatology', ko: '알레르기·류마티스내과' },
    { ja: '総合内科', 'zh-TW': '綜合內科', 'zh-CN': '综合内科', en: 'General Internal Medicine', ko: '종합내과' },
  ] as Record<Language, string>[],
  surgical: [
    { ja: '心臓血管外科', 'zh-TW': '心臟血管外科', 'zh-CN': '心脏血管外科', en: 'Cardiovascular Surgery', ko: '심장혈관외과' },
    { ja: '呼吸器外科', 'zh-TW': '呼吸器外科', 'zh-CN': '呼吸器外科', en: 'Thoracic Surgery', ko: '흉부외과' },
    { ja: '脳神経外科', 'zh-TW': '腦神經外科', 'zh-CN': '脑神经外科', en: 'Neurosurgery', ko: '뇌신경외과' },
    { ja: '肝・胆・膵外科', 'zh-TW': '肝・膽・胰外科', 'zh-CN': '肝・胆・胰外科', en: 'Hepatobiliary Surgery' },
    { ja: '上部消化管外科', 'zh-TW': '上消化道外科', 'zh-CN': '上消化道外科', en: 'Upper GI Surgery', ko: '상부소화관외과' },
    { ja: '下部消化管外科', 'zh-TW': '下消化道外科', 'zh-CN': '下消化道外科', en: 'Lower GI Surgery', ko: '하부소화관외과' },
    { ja: '乳腺・内分泌外科', 'zh-TW': '乳腺・內分泌外科', 'zh-CN': '乳腺・内分泌外科', en: 'Breast & Endocrine Surgery', ko: '유방·내분비외과' },
    { ja: '炎症性腸疾患外科', 'zh-TW': '炎症性腸病外科', 'zh-CN': '炎症性肠病外科', en: 'IBD Surgery', ko: 'IBD 외과' },
    { ja: '泌尿器科', 'zh-TW': '泌尿科', 'zh-CN': '泌尿科', en: 'Urology', ko: '비뇨기과' },
    { ja: '整形外科', 'zh-TW': '骨科', 'zh-CN': '骨科', en: 'Orthopedics', ko: '정형외과' },
    { ja: '形成外科', 'zh-TW': '整形外科', 'zh-CN': '整形外科', en: 'Plastic Surgery', ko: '성형외과' },
    { ja: '小児外科', 'zh-TW': '小兒外科', 'zh-CN': '小儿外科', en: 'Pediatric Surgery', ko: '소아외과' },
  ] as Record<Language, string>[],
  other: [
    { ja: '産科婦人科', 'zh-TW': '產科婦科', 'zh-CN': '产科妇科', en: 'OB/GYN' },
    { ja: '小児科', 'zh-TW': '小兒科', 'zh-CN': '小儿科', en: 'Pediatrics' },
    { ja: '眼科', 'zh-TW': '眼科', 'zh-CN': '眼科', en: 'Ophthalmology', ko: '안과' },
    { ja: '耳鼻咽喉科・頭頸部外科', 'zh-TW': '耳鼻喉科・頭頸部外科', 'zh-CN': '耳鼻喉科・头颈部外科', en: 'ENT & Head/Neck', ko: '이비인후과·두경부' },
    { ja: '皮膚科', 'zh-TW': '皮膚科', 'zh-CN': '皮肤科', en: 'Dermatology', ko: '피부과' },
    { ja: '精神科神経科', 'zh-TW': '精神神經科', 'zh-CN': '精神神经科', en: 'Psychiatry', ko: '정신과' },
    { ja: '放射線科', 'zh-TW': '放射科', 'zh-CN': '放射科', en: 'Radiology', ko: '방사선과' },
    { ja: '麻酔科', 'zh-TW': '麻醉科', 'zh-CN': '麻醉科', en: 'Anesthesiology', ko: '마취과' },
    { ja: '救急科', 'zh-TW': '急診科', 'zh-CN': '急诊科', en: 'Emergency', ko: '구급과' },
    { ja: 'リハビリテーション科', 'zh-TW': '復健科', 'zh-CN': '康复科', en: 'Rehabilitation', ko: '재활의학과' },
    { ja: '歯科口腔外科', 'zh-TW': '口腔外科', 'zh-CN': '口腔外科', en: 'Oral Surgery', ko: '구강외과' },
    { ja: '病理診断科', 'zh-TW': '病理診斷科', 'zh-CN': '病理诊断科', en: 'Pathology', ko: '병리진단과' },
    { ja: '臨床検査科', 'zh-TW': '臨床檢驗科', 'zh-CN': '临床检验科', en: 'Clinical Laboratory', ko: '임상검사과' },
  ] as Record<Language, string>[],
};

// ======================================
// 就诊流程 (4 phases)
// ======================================
const TREATMENT_FLOW = [
  { step: 1, title: { ja: '初期相談', 'zh-TW': '前期咨詢', 'zh-CN': '前期咨询', en: 'Initial Consultation', ko: '초기 상담' } as Record<Language, string>, subtitle: { ja: '申請提出・資料提供', 'zh-TW': '提交申請・提供資料', 'zh-CN': '提交申请・提供资料', en: 'Submit Application & Documents', ko: '신청 제출·자료 제공' } as Record<Language, string>, fee: '221,000', feeLabel: { ja: '円', 'zh-TW': '日元', 'zh-CN': '日元', en: 'JPY' } as Record<Language, string>, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent', ko: '중개' } as Record<Language, string>, desc: { ja: '治療情報提供書、血液/病理レポート、CT/MRI/PETデータ、手術記録等', 'zh-TW': '治療信息提供書、血液/病理報告、CT/MRI/PET數據、手術記錄等', 'zh-CN': '治疗信息提供书、血液/病理报告、CT/MRI/PET数据、手术记录等', en: 'Treatment info, blood/pathology reports, CT/MRI/PET data, surgical records' } as Record<Language, string> },
  { step: 2, title: { ja: '初期相談料お支払い', 'zh-TW': '支付前期諮詢費', 'zh-CN': '支付前期咨询费', en: 'Pay Initial Consultation Fee', ko: '초기 상담료 납부' } as Record<Language, string>, subtitle: { ja: '最適な病院・医師の選定', 'zh-TW': '選擇合適的醫院與醫生', 'zh-CN': '选择合适的医院与医生', en: 'Select Suitable Hospital & Doctor', ko: '적합한 병원·의사 선정' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent', ko: '중개' } as Record<Language, string>, desc: null },
  { step: 3, title: { ja: '資料翻訳', 'zh-TW': '資料翻譯', 'zh-CN': '资料翻译', en: 'Document Translation', ko: '자료 번역' } as Record<Language, string>, subtitle: { ja: '兵庫医大への相談', 'zh-TW': '諮詢兵庫醫大', 'zh-CN': '咨询兵库医大', en: 'Consult Hyogo Medical' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent', ko: '중개' } as Record<Language, string>, to: { ja: '病院/患者', 'zh-TW': '醫院/患者', 'zh-CN': '医院/患者', en: 'Hospital/Patient', ko: '병원/환자' } as Record<Language, string>, desc: null },
  { step: 4, title: { ja: '来日前遠隔診療', 'zh-TW': '赴日前遠程會診', 'zh-CN': '赴日前远程会诊', en: 'Pre-visit Remote Consultation', ko: '방일 전 원격 진료' } as Record<Language, string>, subtitle: { ja: '治療方針の相談', 'zh-TW': '討論治療方案', 'zh-CN': '讨论治疗方案', en: 'Discuss Treatment Plan', ko: '치료 방침 상담' } as Record<Language, string>, fee: '243,000', feeLabel: { ja: '円', 'zh-TW': '日元', 'zh-CN': '日元', en: 'JPY' } as Record<Language, string>, from: { ja: '病院', 'zh-TW': '醫院', 'zh-CN': '医院', en: 'Hospital', ko: '병원' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, desc: { ja: '治療方針の相談、治療計画の提供、治療費概算の提示', 'zh-TW': '討論治療方案，提供治療計劃，提示治療費概算金額', 'zh-CN': '讨论治疗方案，提供治疗计划，提示治疗费概算金额', en: 'Discuss treatment plan, provide cost estimation' } as Record<Language, string> },
  { step: 5, title: { ja: '来日治療の決定', 'zh-TW': '決定來日治療', 'zh-CN': '决定来日治疗', en: 'Decide to Visit Japan', ko: '방일 치료 결정' } as Record<Language, string>, subtitle: { ja: '治療保証金のお支払い', 'zh-TW': '支付治療保證金', 'zh-CN': '支付治疗保证金', en: 'Pay Treatment Deposit', ko: '치료 보증금 납부' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent', ko: '중개' } as Record<Language, string>, desc: null },
  { step: 6, title: { ja: '来日日程の確定', 'zh-TW': '確定來日日期', 'zh-CN': '确定来日日期', en: 'Confirm Visit Date', ko: '방일 일정 확정' } as Record<Language, string>, subtitle: { ja: '必要に応じて医療ビザ申請', 'zh-TW': '如需要申請醫療簽證', 'zh-CN': '如需要申请医疗签证', en: 'Apply for Medical Visa if Needed', ko: '필요시 의료비자 신청' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, to: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent', ko: '중개' } as Record<Language, string>, desc: null },
  { step: 7, title: { ja: '受診予約', 'zh-TW': '預約就診', 'zh-CN': '预约就诊', en: 'Book Appointment', ko: '진료 예약' } as Record<Language, string>, subtitle: { ja: '通訳の手配', 'zh-TW': '安排翻譯', 'zh-CN': '安排翻译', en: 'Arrange Interpreter', ko: '통역 수배' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介', 'zh-TW': '中介', 'zh-CN': '中介', en: 'Agent', ko: '중개' } as Record<Language, string>, to: { ja: '病院/患者', 'zh-TW': '醫院/患者', 'zh-CN': '医院/患者', en: 'Hospital/Patient', ko: '병원/환자' } as Record<Language, string>, desc: { ja: '経験と資格を有する専門医療通訳を手配', 'zh-TW': '安排有經驗及資格的專業醫療翻譯', 'zh-CN': '安排有经验及资格的专业医疗翻译', en: 'Arrange experienced professional medical interpreter' } as Record<Language, string> },
  { step: 8, title: { ja: '来日治療', 'zh-TW': '來日治療', 'zh-CN': '来日治疗', en: 'Treatment in Japan', ko: '방일 치료' } as Record<Language, string>, subtitle: { ja: '受診サポート', 'zh-TW': '就診支援', 'zh-CN': '就诊支援', en: 'Visit Support', ko: '진료 지원' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介/病院', 'zh-TW': '中介/醫院', 'zh-CN': '中介/医院', en: 'Agent/Hospital', ko: '중개/병원' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, desc: null },
  { step: 9, title: { ja: '治療完了', 'zh-TW': '治療結束', 'zh-CN': '治疗结束', en: 'Treatment Completed', ko: '치료 완료' } as Record<Language, string>, subtitle: { ja: '費用精算', 'zh-TW': '費用結算', 'zh-CN': '费用结算', en: 'Final Settlement', ko: '비용 정산' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '仲介/病院', 'zh-TW': '中介/醫院', 'zh-CN': '中介/医院', en: 'Agent/Hospital', ko: '중개/병원' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, desc: null },
  { step: 10, title: { ja: 'アフターサポート', 'zh-TW': '後續支持', 'zh-CN': '后续支持', en: 'Follow-up Support', ko: '사후 지원' } as Record<Language, string>, subtitle: { ja: '遠隔フォローアップ', 'zh-TW': '遠程隨訪', 'zh-CN': '远程随访', en: 'Remote Follow-up', ko: '원격 팔로업' } as Record<Language, string>, fee: null, feeLabel: null, from: { ja: '病院', 'zh-TW': '醫院', 'zh-CN': '医院', en: 'Hospital', ko: '병원' } as Record<Language, string>, to: { ja: '患者', 'zh-TW': '患者', 'zh-CN': '患者', en: 'Patient', ko: '환자' } as Record<Language, string>, desc: { ja: '病歴および中国の医師への治療まとめと提案を提供。必要に応じてオンライン経過観察や遠隔相談を実施', 'zh-TW': '提供病歷以及給中國醫生的治療總結與建議，必要時做線上隨訪或遠程諮詢', 'zh-CN': '提供病历以及给中国医生的治疗总结与建议，必要时做线上随访或远程咨询', en: 'Provide medical records and treatment summary for home doctors, with online follow-up if needed' } as Record<Language, string> },
];

const TREATMENT_PHASES = [
  {
    id: 'pre-assessment', phaseNumber: 1, icon: FileText, color: 'blue' as const,
    title: { ja: '前期評価', 'zh-TW': '前期評估', 'zh-CN': '前期评估', en: 'Pre-Assessment', ko: '사전 평가' } as Record<Language, string>,
    subtitle: { ja: '資料提出から兵庫医大への相談まで', 'zh-TW': '從提交資料到兵庫醫大諮詢', 'zh-CN': '从提交资料到兵库医大咨询', en: 'From document submission to Hyogo Medical consultation' } as Record<Language, string>,
    duration: { ja: '約1〜2週間', 'zh-TW': '約 1-2 週', 'zh-CN': '约 1-2 周', en: '~1-2 weeks', ko: '약 1-2주' } as Record<Language, string>,
    stepRange: [1, 3] as [number, number],
    patientActions: [
      { ja: '診療情報の提出', 'zh-TW': '提交診療資料', 'zh-CN': '提交诊疗资料', en: 'Submit medical records', ko: '진료 자료 제출' } as Record<Language, string>,
      { ja: '初期相談料のお支払い', 'zh-TW': '支付前期諮詢費', 'zh-CN': '支付前期咨询费', en: 'Pay consultation fee', ko: '상담비 납부' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '資料翻訳（中→日）', 'zh-TW': '資料翻譯（中→日）', 'zh-CN': '资料翻译（中→日）', en: 'Document translation (CN→JP)', ko: '자료 번역(중→일)' } as Record<Language, string>,
      { ja: '兵庫医大への初期相談', 'zh-TW': '向兵庫醫大初步諮詢', 'zh-CN': '向兵库医大初步咨询', en: 'Initial consultation with Hyogo Medical' } as Record<Language, string>,
      { ja: '治療可能性評価レポート', 'zh-TW': '治療可行性評估報告', 'zh-CN': '治疗可行性评估报告', en: 'Treatment feasibility report', ko: '치료 가능성 평가 보고서' } as Record<Language, string>,
    ],
    feeSummary: { ja: '¥221,000（税込）', 'zh-TW': '¥221,000（含稅）', 'zh-CN': '¥221,000（含税）', en: '¥221,000 (tax incl.)', ko: '¥221,000(세금 포함)' } as Record<Language, string>,
  },
  {
    id: 'remote-consultation', phaseNumber: 2, icon: Globe, color: 'purple' as const,
    title: { ja: '遠隔会診', 'zh-TW': '遠程會診', 'zh-CN': '远程会诊', en: 'Remote Consultation', ko: '원격 진료' } as Record<Language, string>,
    subtitle: { ja: '兵庫医大専門医とのビデオ診察', 'zh-TW': '與兵庫醫大專科醫生視頻會診', 'zh-CN': '与兵库医大专科医生视频会诊', en: 'Video consultation with Hyogo Medical specialist' } as Record<Language, string>,
    duration: { ja: '約1〜2週間', 'zh-TW': '約 1-2 週', 'zh-CN': '约 1-2 周', en: '~1-2 weeks', ko: '약 1-2주' } as Record<Language, string>,
    stepRange: [4, 5] as [number, number],
    patientActions: [
      { ja: '遠隔診療に参加', 'zh-TW': '參加遠程會診', 'zh-CN': '参加远程会诊', en: 'Attend remote consultation', ko: '원격 진료 참가' } as Record<Language, string>,
      { ja: '来日治療の最終判断', 'zh-TW': '最終決定是否赴日', 'zh-CN': '最终决定是否赴日', en: 'Final decision to visit Japan', ko: '방일 치료 최종 판단' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '兵庫医大専門医のスケジュール調整', 'zh-TW': '協調兵庫醫大專科醫生時間', 'zh-CN': '协调兵库医大专科医生时间', en: 'Coordinate Hyogo Medical specialist schedule' } as Record<Language, string>,
      { ja: '医療通訳の手配', 'zh-TW': '安排醫療翻譯', 'zh-CN': '安排医疗翻译', en: 'Arrange medical interpreter', ko: '의료 통역 수배' } as Record<Language, string>,
      { ja: '治療計画・費用概算の提示', 'zh-TW': '提供治療計劃與費用概算', 'zh-CN': '提供治疗计划与费用概算', en: 'Provide treatment plan & cost estimate', ko: '치료 계획·비용 개산 제시' } as Record<Language, string>,
      { ja: '治療保証金額のご案内', 'zh-TW': '告知治療保證金金額', 'zh-CN': '告知治疗保证金金额', en: 'Advise deposit amount for treatment', ko: '치료 보증금액 안내' } as Record<Language, string>,
    ],
    feeSummary: { ja: '¥243,000（税込）', 'zh-TW': '¥243,000（含稅）', 'zh-CN': '¥243,000（含税）', en: '¥243,000 (tax incl.)', ko: '¥243,000(세금 포함)' } as Record<Language, string>,
  },
  {
    id: 'treatment-japan', phaseNumber: 3, icon: Activity, color: 'amber' as const,
    title: { ja: '赴日治療', 'zh-TW': '赴日治療', 'zh-CN': '赴日治疗', en: 'Treatment in Japan', ko: '방일 치료' } as Record<Language, string>,
    subtitle: { ja: '保証金お支払い後、日程確定から治療完了まで', 'zh-TW': '支付保證金後，從確定日程到完成治療', 'zh-CN': '支付保证金后，从确定日程到完成治疗', en: 'After deposit payment, from schedule confirmation to treatment completion' } as Record<Language, string>,
    duration: { ja: '症状により異なる', 'zh-TW': '依病情而定', 'zh-CN': '依病情而定', en: 'Varies by condition', ko: '증상에 따라 다름' } as Record<Language, string>,
    stepRange: [6, 8] as [number, number],
    patientActions: [
      { ja: '治療保証金のお支払い', 'zh-TW': '支付治療保證金', 'zh-CN': '支付治疗保证金', en: 'Pay treatment deposit', ko: '치료 보증금 납부' } as Record<Language, string>,
      { ja: '来日スケジュールの確認', 'zh-TW': '確認赴日行程', 'zh-CN': '确认赴日行程', en: 'Confirm travel schedule', ko: '방일 스케줄 확인' } as Record<Language, string>,
      { ja: '医療ビザの申請（必要な場合）', 'zh-TW': '申請醫療簽證（如需要）', 'zh-CN': '申请医疗签证（如需要）', en: 'Apply for medical visa (if needed)', ko: '의료비자 신청(필요한 경우)' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '兵庫医大予約・通訳手配', 'zh-TW': '兵庫醫大預約、翻譯安排', 'zh-CN': '兵库医大预约、翻译安排', en: 'Hyogo Medical booking & interpreter arrangement' } as Record<Language, string>,
      { ja: '全行程の受診サポート', 'zh-TW': '全程就診支援', 'zh-CN': '全程就诊支援', en: 'Full visit support', ko: '전 과정 진료 지원' } as Record<Language, string>,
      { ja: '追加費用発生時の即時ご連絡', 'zh-TW': '如有追加費用即時通知', 'zh-CN': '如有追加费用即时通知', en: 'Immediate notification of any additional costs', ko: '추가 비용 발생 시 즉시 안내' } as Record<Language, string>,
      { ja: 'ビザ申請サポート', 'zh-TW': '簽證申請協助', 'zh-CN': '签证申请协助', en: 'Visa application support', ko: '비자 신청 지원' } as Record<Language, string>,
    ],
    feeSummary: null,
  },
  {
    id: 'followup', phaseNumber: 4, icon: HeartPulse, color: 'green' as const,
    title: { ja: '治療完了・随訪', 'zh-TW': '治療完成與隨訪', 'zh-CN': '治疗完成与随访', en: 'Completion & Follow-up', ko: '치료 완료·경과 관찰' } as Record<Language, string>,
    subtitle: { ja: '保証金による精算からアフターサポートまで', 'zh-TW': '保證金結算至後續支持', 'zh-CN': '保证金结算至后续支持', en: 'From deposit settlement to ongoing support', ko: '보증금 정산부터 사후 지원까지' } as Record<Language, string>,
    duration: { ja: '継続的サポート', 'zh-TW': '持續支援', 'zh-CN': '持续支援', en: 'Ongoing support', ko: '지속적 지원' } as Record<Language, string>,
    stepRange: [9, 10] as [number, number],
    patientActions: [
      { ja: '帰国後の報告', 'zh-TW': '歸國後告知狀況', 'zh-CN': '归国后告知状况', en: 'Report status after returning home', ko: '귀국 후 상태 보고' } as Record<Language, string>,
    ],
    weHandle: [
      { ja: '保証金から全治療費をお支払い・差額精算', 'zh-TW': '以保證金支付全部醫療費、多退少補', 'zh-CN': '以保证金支付全部医疗费、多退少补', en: 'Settle all medical costs from deposit, refund or charge difference', ko: '보증금에서 전체 치료비 정산·차액 환불 또는 추가 청구' } as Record<Language, string>,
      { ja: '治療まとめの提供', 'zh-TW': '提供治療總結', 'zh-CN': '提供治疗总结', en: 'Provide treatment summary', ko: '치료 요약 제공' } as Record<Language, string>,
      { ja: '遠隔フォローアップの手配', 'zh-TW': '安排遠程隨訪', 'zh-CN': '安排远程随访', en: 'Arrange remote follow-up', ko: '원격 팔로업 수배' } as Record<Language, string>,
    ],
    feeSummary: null,
  },
];

type PhaseColor = 'blue' | 'purple' | 'amber' | 'green';
const PHASE_COLORS: Record<PhaseColor, { bg: string; light: string; border: string; text: string; ring: string }> = {
  blue:   { bg: 'bg-[#0f7459]',   light: 'bg-[#ecf3f1]',   border: 'border-[#0f7459]',   text: 'text-[#0f7459]',   ring: 'ring-[#ecf3f1]' },
  purple: { bg: 'bg-[#0f7459]', light: 'bg-[#ecf3f1]', border: 'border-[#0f7459]', text: 'text-[#0f7459]', ring: 'ring-[#ecf3f1]' },
  amber:  { bg: 'bg-[#0f7459]',  light: 'bg-[#ecf3f1]',  border: 'border-[#0f7459]',  text: 'text-[#0f7459]',  ring: 'ring-[#ecf3f1]' },
  green:  { bg: 'bg-[#0f7459]',  light: 'bg-[#ecf3f1]',  border: 'border-[#0f7459]',  text: 'text-[#0f7459]',  ring: 'ring-[#ecf3f1]' },
};
const PHASE_GRADIENT_MAP: Record<PhaseColor, string> = {
  blue:   'from-[#0f7459] to-[#1766b0]',
  purple: 'from-[#0f7459] to-[#1766b0]',
  amber:  'from-[#0f7459] to-[#1766b0]',
  green:  'from-[#0f7459] to-[#1766b0]',
};
const PHASE_LIGHT_BG_MAP: Record<PhaseColor, string> = {
  blue:   'bg-[#ecf3f1] border-[#dae9e5]',
  purple: 'bg-[#ecf3f1] border-[#dae9e5]',
  amber:  'bg-[#ecf3f1] border-[#dae9e5]',
  green:  'bg-[#ecf3f1] border-[#dae9e5]',
};
const PHASE_DOT_MAP: Record<PhaseColor, string> = {
  blue: 'bg-[#0f7459]',
  purple: 'bg-[#0f7459]',
  amber: 'bg-[#0f7459]',
  green: 'bg-[#0f7459]',
};

// 咨询服务（使用兵庫医大专属 packages）
const CONSULTATION_SERVICES = [
  {
    slug: MEDICAL_PACKAGES['hyogo-initial-consultation'].slug,
    name: {
      ja: '前期相談サービス',
      'zh-TW': '前期諮詢服務',
      'zh-CN': '前期咨询服务',
      en: 'Initial Consultation',
      ko: '사전 상담 서비스',
    } as Record<Language, string>,
    nameEn: 'Initial Consultation Service',
    price: MEDICAL_PACKAGES['hyogo-initial-consultation'].priceJpy,
    desc: {
      ja: '診療情報を翻訳し、兵庫医大病院への初期相談を実施。治療可能性評価レポートと費用概算をご提供します。',
      'zh-TW': '翻譯診療資料，與兵庫醫大進行初步諮詢。提供治療可行性評估報告與費用概算。',
      'zh-CN': '翻译诊疗资料，与兵库医大进行初步咨询。提供治疗可行性评估报告与费用概算。',
      en: 'Translate medical records, initial consultation with Hyogo Medical. Provides feasibility report and cost estimate.',
      ko: '진료 기록 번역, 효고의대 초기 상담. 치료 가능성 보고서 및 비용 견적을 제공합니다.',
    } as Record<Language, string>,
    features: {
      ja: ['診療情報の翻訳（中→日）', '兵庫医大病院への初期相談', '治療可能性評価レポート', '費用概算のご説明', '次のステップのご案内'],
      'zh-TW': ['病歷資料翻譯（中→日）', '兵庫醫大初步諮詢', '治療可行性評估報告', '費用概算說明', '後續流程指導'],
      'zh-CN': ['病历资料翻译（中→日）', '兵库医大初步咨询', '治疗可行性评估报告', '费用概算说明', '后续流程指导'],
      en: ['Medical record translation (CN→JP)', 'Initial consultation with Hyogo Medical', 'Treatment feasibility report', 'Cost estimation', 'Next steps guidance'],
    } as Record<Language, string[]>,
    gradient: 'from-[#0f7459] to-[#1766b0]',
    hoverGradient: 'hover:from-[#0d634c] hover:to-[#135a96]',
    checkColor: 'text-[#0f7459]',
    href: '/hyogo-medical/initial-consultation',
  },
  {
    slug: MEDICAL_PACKAGES['hyogo-remote-consultation'].slug,
    name: {
      ja: '遠隔会診サービス',
      'zh-TW': '遠程會診服務',
      'zh-CN': '远程会诊服务',
      en: 'Remote Consultation',
      ko: '원격 진료 서비스',
    } as Record<Language, string>,
    nameEn: 'Remote Consultation Service',
    price: MEDICAL_PACKAGES['hyogo-remote-consultation'].priceJpy,
    desc: {
      ja: '兵庫医大の専門医とビデオ診察。治療方針の相談、治療計画の提供、治療費概算の提示。',
      'zh-TW': '與兵庫醫大專科醫生視頻會診。討論治療方案、提供治療計劃、提示治療費概算。',
      'zh-CN': '与兵库医大专科医生视频会诊。讨论治疗方案、提供治疗计划、提示治疗费概算。',
      en: 'Video consultation with Hyogo Medical specialist. Treatment planning, cost estimation, and next steps.',
      ko: '효고의대 전문의와의 화상 진찰',
    } as Record<Language, string>,
    features: {
      ja: ['兵庫医大専門医とのビデオ診察', '専門医療通訳が全行程同行', '詳細な治療計画のご説明', '治療費用の明細見積', '来日治療の最終判断サポート'],
      'zh-TW': ['兵庫醫大專科醫生視頻會診', '專業醫療翻譯全程陪同', '詳細治療方案說明', '治療費用明細報價', '赴日治療最終判斷支援'],
      'zh-CN': ['兵库医大专科医生视频会诊', '专业医疗翻译全程陪同', '详细治疗方案说明', '治疗费用明细报价', '赴日治疗最终判断支援'],
      en: ['Video consultation with specialist', 'Professional medical interpreter', 'Detailed treatment plan', 'Itemized cost quotation', 'Decision support for visiting Japan'],
    } as Record<Language, string[]>,
    gradient: 'from-[#0f7459] to-[#1766b0]',
    hoverGradient: 'hover:from-[#0d634c] hover:to-[#135a96]',
    checkColor: 'text-[#0f7459]',
    href: '/hyogo-medical/remote-consultation',
  },
];

// 就诊/支付 Section 翻译
const bookingT = {
  flowTag: { ja: '受診の流れ', 'zh-TW': '就診流程', 'zh-CN': '就诊流程', en: 'Treatment Process', ko: '치료 프로세스' } as Record<Language, string>,
  ko: '치료 과정',
  flowTitle: { ja: '兵庫医大での治療の流れ', 'zh-TW': '在兵庫醫大的治療流程', 'zh-CN': '在兵库医大的治疗流程', en: 'Treatment Process at Hyogo Medical', ko: '효고의대병원의 치료 과정' } as Record<Language, string>,
  flowDesc: {
    ja: '初回ご相談から治療完了まで、全行程プロフェッショナルサポート',
    'zh-TW': '從首次諮詢到治療完成，全程專業支援',
    'zh-CN': '从首次咨询到治疗完成，全程专业支援',
    en: 'Professional support from initial consultation to treatment completion',
    ko: '초기 상담부터 치료 완료까지 전 과정 전문 지원',
  } as Record<Language, string>,
  phaseLabel: { ja: 'PHASE', 'zh-TW': 'PHASE', 'zh-CN': 'PHASE', en: 'PHASE' } as Record<Language, string>,
  durationLabel: { ja: '目安期間', 'zh-TW': '預估時間', 'zh-CN': '预估时间', en: 'Est. Duration', ko: '예상 기간' } as Record<Language, string>,
  flowYouDo: { ja: 'お客様にしていただくこと', 'zh-TW': '您需要做的', 'zh-CN': '您需要做的', en: 'What You Do', ko: '환자분이 하실 일' } as Record<Language, string>,
  flowWeHandle: { ja: '当社が対応すること', 'zh-TW': '我們負責的', 'zh-CN': '我们负责的', en: 'What We Handle', ko: '저희가 담당하는 일' } as Record<Language, string>,
  flowStepDetail: { ja: 'ステップ詳細', 'zh-TW': '步驟詳情', 'zh-CN': '步骤详情', en: 'Step Details', ko: '단계 상세' } as Record<Language, string>,
  flowClickPhase: { ja: '↑ 各フェーズをクリックして詳細をご確認ください', 'zh-TW': '↑ 點擊各階段查看詳細內容', 'zh-CN': '↑ 点击各阶段查看详细内容', en: '↑ Click each phase to view details' } as Record<Language, string>,

  svcTag: { ja: 'サービスご予約', 'zh-TW': '服務預約', 'zh-CN': '服务预约', en: 'Book Service' } as Record<Language, string>,
  svcTitle: { ja: '相談サービスのご予約', 'zh-TW': '諮詢服務預約', 'zh-CN': '咨询服务预约', en: 'Book Consultation Service', ko: '상담 서비스 예약' } as Record<Language, string>,
  svcDesc: {
    ja: 'ご希望のサービスを選択し、お支払い後24時間以内にご連絡いたします',
    'zh-TW': '選擇您需要的服務，在線支付後我們將在 24 小時內與您聯繫',
    'zh-CN': '选择您需要的服务，在线支付后我们将在24小时内与您联系',
    en: 'Select your service — we will contact you within 24 hours after payment',
    ko: '희망하시는 서비스를 선택하시고, 결제 후 24시간 이내에 연락드리겠습니다',
  } as Record<Language, string>,
  svcLimit: { ja: '月10名様限定・残りわずか', 'zh-TW': '每月僅限 10 位 · 名額有限', 'zh-CN': '每月仅限 10 位 · 名额有限', en: 'Limited to 10/month' } as Record<Language, string>,
  taxIncl: { ja: '日円（税込）', 'zh-TW': '日圓（含稅）', 'zh-CN': '日元（含税）', en: 'JPY (tax incl.)', ko: '엔(세금 포함)' } as Record<Language, string>,
  bookNow: { ja: '今すぐ予約', 'zh-TW': '立即預約', 'zh-CN': '立即预约', en: 'Book Now', ko: '지금 예약하기' } as Record<Language, string>,

  contactTag: { ja: 'お問い合わせ', 'zh-TW': '聯繫我們', 'zh-CN': '联系我们', en: 'Contact Us', ko: '문의하기' } as Record<Language, string>,
  contactTitle: { ja: 'お支払い前のご質問はお気軽に', 'zh-TW': '付款前有疑問？歡迎諮詢', 'zh-CN': '付款前有疑问？欢迎咨询', en: 'Questions before payment? Contact us' } as Record<Language, string>,
  contactLine: { ja: 'LINEで相談', 'zh-TW': 'LINE 諮詢', 'zh-CN': 'LINE 咨询', en: 'LINE Chat', ko: 'LINE 상담' } as Record<Language, string>,
  contactEmail: { ja: 'メールで相談', 'zh-TW': '郵件諮詢', 'zh-CN': '邮件咨询', en: 'Email Us', ko: '이메일 상담' } as Record<Language, string>,
  contactWechat: { ja: 'WeChatで相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat', ko: '위챗 상담' } as Record<Language, string>,

  memberTitle: { ja: '会員制度', 'zh-TW': '會員體系', 'zh-CN': '会员体系', en: 'Membership', ko: '회원 안내' } as Record<Language, string>,
  memberDesc: {
    ja: 'いずれかのサービスご購入後、NIIJIMA会員となります。「マイオーダー」から全予約をご確認いただけます。',
    'zh-TW': '購買任一服務後，您將成為 NIIJIMA 會員，可在「我的訂單」查看所有預約。',
    'zh-CN': '购买任一服务后，您将成为 NIIJIMA 会员，可在「我的订单」查看所有预约。',
    en: 'After purchasing any service, you become a NIIJIMA member with access to all booking records.',
    ko: '어느 서비스든 구매 후 NIIJIMA 회원이 되어 전체 예약 기록을 확인하실 수 있습니다.',
  } as Record<Language, string>,

  wechatTitle: { ja: 'WeChat相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' } as Record<Language, string>,
  wechatScan: { ja: 'QRコードをスキャンして追加', 'zh-TW': '掃描二維碼添加客服微信', 'zh-CN': '扫描二维码添加客服微信', en: 'Scan QR code to add us', ko: 'QR코드를 스캔하여 추가' } as Record<Language, string>,
  wechatNote: { ja: '追加後「兵庫医大相談」とお伝えください', 'zh-TW': '添加後請注明：兵庫醫大諮詢', 'zh-CN': '添加后请注明：兵库医大咨询', en: 'Please note: Hyogo Medical consultation', ko: '추가 후 「효고의대 진료 상담」이라고 말씀해 주세요' } as Record<Language, string>,
};

// WeChat 图标 SVG path（消除重复）
const WECHAT_SVG_PATH = 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z';

function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="currentColor">
      <path d={WECHAT_SVG_PATH} />
    </svg>
  );
}

interface HyogoMedicalContentProps {
  isGuideEmbed?: boolean;
  guideSlug?: string;
}

export default function HyogoMedicalContent({ isGuideEmbed, guideSlug }: HyogoMedicalContentProps) {
  const lang = useLanguage();
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [activePhase, setActivePhase] = useState<number>(1);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [doctorCategory, setDoctorCategory] = useState<DoctorCategory | null>(null);

  return (
    <div className="animate-fade-in-up min-h-screen bg-white">

      {/* ========================================
          1. Hero Section - 全屏背景图 (TIMC 风格)
          ======================================== */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden text-white bg-slate-900">
        <Image
          src="https://www.hosp.hyo-med.ac.jp/new-building/common/img/newbuilding.png"
          fill
          className="object-cover opacity-80"
          alt="Hyogo Medical University Hospital"
          sizes="100vw"
          quality={75}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f7459]/90 via-[#0f7459]/50 to-transparent" />
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
        <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-4 md:mb-6 leading-[1.2]">
              {t.heroTitle1[lang]}<br />
              <span className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] text-transparent bg-clip-text bg-gradient-to-r from-[#ecf3f1] to-white">{t.heroTitle2[lang]}</span>
            </h1>
            <h2 className="text-base sm:text-lg md:text-2xl text-gray-300 font-light mb-6 md:mb-8 font-serif">
              {t.heroSubtitle[lang]}
            </h2>
            <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base border-l-2 border-[#ecf3f1] pl-4 md:pl-6 max-w-2xl whitespace-pre-line">
              {t.heroText[lang]}
            </p>
            <div className="mt-8 inline-flex items-center gap-3 bg-[#0f7459]/20 border border-[#ecf3f1]/60 px-5 py-3 rounded-full backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecf3f1] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0f7459]" />
              </span>
              <span className="text-[#ecf3f1] text-sm font-medium">{t.limitBadge[lang]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          2. Headline Stats - 核心数字 (暗色背景过渡区)
          ======================================== */}
      <div className="bg-gradient-to-r from-[#0f7459] to-[#1766b0] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#ecf3f1] text-xs tracking-[0.3em] uppercase font-bold">{t.statsTag[lang]}</span>
            <h3 className="text-3xl font-serif text-white mt-3">{t.statsTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {HEADLINE_STATS.map((stat, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                <div className="text-3xl md:text-4xl font-bold text-white font-serif">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-2 font-medium">{stat.label[lang]}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.sub[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24">

        {/* ========================================
            3. National #1 - 日本一の専門分野
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">{t.nationalTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.nationalTitle[lang]}</h3>
          </div>
          <div className="space-y-6">
            {NATIONAL_FIRSTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300 overflow-hidden group">
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className={`bg-gradient-to-br ${item.color} p-6 md:p-8 flex items-center justify-center md:min-w-[200px]`}>
                      <div className="text-center text-white">
                        <Icon size={32} className="mx-auto mb-3" />
                        <div className="text-sm font-bold tracking-wide">{item.rank[lang]}</div>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">{item.title[lang]}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc[lang]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================
            NEW: 合作专家医疗团队 — 按疾病快速找到医生
            ======================================== */}
        <div id="expert-team" className="mb-24">
          <div className="text-center mb-12">
            <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">
              {({ ja: '合作専門医チーム', 'zh-TW': '合作專科醫療團隊', 'zh-CN': '合作专科医疗团队', en: 'Partner Specialist Team' } as Record<Language, string>)[lang]}
            </span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">
              {({ ja: '疾患別 — あなたの名医を見つける', 'zh-TW': '按疾病分類 — 找到您的名醫', 'zh-CN': '按疾病分类 — 找到您的名医', en: 'Find Your Specialist by Condition', ko: '병상별 전문의 찾기' } as Record<Language, string>)[lang]}
            </h3>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm">
              {({ ja: '各分野の専門教授陣が、専門的な治療をご提供します', 'zh-TW': '各領域專業教授團隊，提供專科治療', 'zh-CN': '各领域专业教授团队，提供专科治疗', en: 'Professors in each field provide specialized treatment', ko: '각 분야 교수진이 전문 치료를 제공합니다' } as Record<Language, string>)[lang]}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setDoctorCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                doctorCategory === null
                  ? 'bg-[#0f7459] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {({ ja: '全て表示', 'zh-TW': '全部顯示', 'zh-CN': '全部显示', en: 'Show All', ko: '전체 보기' } as Record<Language, string>)[lang]}
            </button>
            {DOCTOR_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setDoctorCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    doctorCategory === cat.id
                      ? 'bg-[#0f7459] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={14} />
                  {cat.label[lang]}
                </button>
              );
            })}
          </div>

          {/* Doctor Cards Grid — Premium Trust Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPERT_DOCTORS
              .filter((d) => doctorCategory === null || d.category === doctorCategory)
              .map((doc, i) => {
                const initials = doc.name.ja.replace(/\s/g, '').slice(0, 2);
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  >
                    {/* Top Badge Banner */}
                    <div className={`bg-gradient-to-r ${doc.gradient} px-5 py-2.5 flex items-center justify-between`}>
                      <span className="text-white text-xs font-bold tracking-wide">{doc.badge[lang]}</span>
                      <span className="text-white/70 text-[10px] font-medium">
                        {DOCTOR_CATEGORIES.find((c) => c.id === doc.category)?.label[lang]}
                      </span>
                    </div>

                    <div className="p-5">
                      {/* Avatar + Name Row */}
                      <div className="flex items-center gap-4 mb-4">
                        {/* Photo or Initials Avatar */}
                        {doc.photoUrl ? (
                          <Image
                            src={doc.photoUrl}
                            alt={doc.name[lang]}
                            width={64}
                            height={64}
                            quality={75}
                            className="w-16 h-16 rounded-full object-cover object-top border-2 border-white shadow-md flex-shrink-0"
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${doc.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                            <span className="text-white text-lg font-bold">{initials}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-lg font-bold text-gray-900 font-serif truncate">{doc.name[lang]}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{doc.title[lang]}</p>
                          <p className="text-xs text-[#0f7459] font-medium mt-0.5">{doc.dept[lang]}</p>
                        </div>
                      </div>

                      {/* Specialty highlight */}
                      <p className="text-sm text-gray-800 font-medium mb-3 pl-3 border-l-2 border-[#0f7459]">
                        {doc.specialty[lang]}
                      </p>

                      {/* Key Highlights */}
                      <ul className="space-y-1.5 mb-4">
                        {doc.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-[13px] text-gray-600">
                            <CheckCircle size={13} className="text-[#0f7459] mt-0.5 flex-shrink-0" />
                            <span>{h[lang]}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Disease Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                        {doc.diseases[lang].split(/[、,]/).map((d, j) => (
                          <span key={j} className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                            {d.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ========================================
            4. 手术机器人 - Da Vinci Xi + hinotori
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">{t.robotTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.robotTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Da Vinci Xi */}
            <div className="bg-gray-900 text-white rounded-2xl overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="https://www.hosp.hyo-med.ac.jp/upload/department/highlevel/urology_02.jpg" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" alt="Da Vinci Xi" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4 bg-[#0f7459] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t.robotDaVinciBadge[lang]}
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-serif font-bold mb-3">Da Vinci Xi</h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {t.robotDaVinciDesc[lang]}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">6 Departments</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">250+ Cases/Year</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">3D Vision</span>
                </div>
              </div>
            </div>
            {/* hinotori */}
            <div className="bg-gray-900 text-white rounded-2xl overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="https://www.hosp.hyo-med.ac.jp/upload/news/content/hinotori2.png" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" alt="hinotori" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4 bg-[#0f7459] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t.robotHinotoriBadge[lang]}
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-serif font-bold mb-3">hinotori™</h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {t.robotHinotoriDesc[lang]}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">Made in Japan</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">2024 New</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">Expanding</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            5. 12项国家认证资质
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">{t.certTag[lang]}</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.certTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert, i) => {
              const Icon = cert.icon;
              const colors = ICON_COLORS[cert.color];
              return (
                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 group">
                  <div className={`w-10 h-10 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center mb-4 ${colors.hoverBg} group-hover:text-white transition`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-gray-800 mb-2 font-serif">{cert.title[lang]}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{cert.desc[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================
            6. 10+ 专门中心 (TIMC 深色圆角风格)
            ======================================== */}
        <div className="mb-24 bg-[#0f7459] text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="relative z-10 text-center mb-12">
            <span className="text-[#ecf3f1] text-xs tracking-[0.3em] uppercase font-bold">{t.centersTag[lang]}</span>
            <h3 className="text-3xl font-serif mt-3">{t.centersTitle[lang]}</h3>
          </div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CENTERS.map((center, i) => {
              const Icon = center.icon;
              return (
                <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition group text-center">
                  <div className="flex justify-center mb-3 text-[#ecf3f1] group-hover:scale-110 transition"><Icon size={28} /></div>
                  <h4 className="font-bold text-sm mb-1">{center.name[lang]}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{center.stat[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================
          7. 医疗设备 - 全宽图片区 (TIMC 双列风格)
          ======================================== */}
      <div className="mb-0">
        <div className="text-center py-16 bg-white">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-3">{t.equipTitle[lang]}</h3>
          <p className="text-gray-500 text-sm tracking-widest uppercase mb-4">Medical Equipment Lineup</p>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto px-4">{t.equipSub[lang]}</p>
        </div>
      </div>
      {/* Row 1: PET-CT + MRI */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://hcm-radiology.com/images/mainimg01.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="PET-CT" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{t.equipPetCtTitle[lang]}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipPetCtDesc[lang]}
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://hcm-radiology.com/images/mainimg02.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="MRI" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">3.0T MRI × 3 + 1.5T × 1</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipMriDesc[lang]}
            </p>
          </div>
        </div>
      </div>
      {/* Row 2: CT + Radiation Therapy */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://hcm-radiology.com/images/mainimg04.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="CT Scanner" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{t.equipCtTitle[lang]}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipCtDesc[lang]}
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://hcm-radiology.com/images/mainimg05.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Radiation Therapy" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{t.equipRadTitle[lang]}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipRadDesc[lang]}
            </p>
          </div>
        </div>
      </div>
      {/* Row 3: IVR + Endoscopy */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://www.hosp.hyo-med.ac.jp/upload/department/highlevel/1.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="IVR Center" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{t.equipIvrTitle[lang]}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipIvrDesc[lang]}
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://www.hosp.hyo-med.ac.jp/img/image03_02.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Endoscopy" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{t.equipEndoTitle[lang]}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipEndoDesc[lang]}
            </p>
          </div>
        </div>
      </div>
      {/* Row 4: Nuclear Medicine + Operating Rooms */}
      <div className="flex flex-col md:flex-row min-h-[35vh] md:min-h-[50vh]">
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://www.hosp.hyo-med.ac.jp/about/3min/img/latest_medical_equipment01.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Nuclear Medicine" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{t.equipNucTitle[lang]}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipNucDesc[lang]}
            </p>
          </div>
        </div>
        <div className="relative flex-1 min-h-[35vh] md:min-h-0 overflow-hidden group">
          <Image src="https://www.hosp.hyo-med.ac.jp/upload/department/highlevel/neurosurgery_02.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Operating Rooms" sizes="(max-width: 768px) 100vw, 50vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <h4 className="text-xl md:text-2xl text-white font-serif mb-3">{t.equipOpTitle[lang]}</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              {t.equipOpDesc[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          8. 新病院大楼 2026 (全屏展示)
          ======================================== */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image src="https://www.hosp.hyo-med.ac.jp/new-building/common/img/newbuilding.png" fill className="object-cover" alt="New Hospital Building 2026" sizes="100vw" quality={75} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#ecf3f1]" />
              <span className="text-xs tracking-[0.3em] text-[#ecf3f1] uppercase">NEW BUILDING 2026</span>
            </div>
            <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.newBuildTitle[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">{t.newBuildDesc[lang]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">15F / ~73m</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">801 Beds</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">71,000㎡</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">{t.newBuildSeismic[lang]}</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">{t.newBuildHelipad[lang]}</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">Smart Hospital</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          8b. 新病院大楼 Gallery — 内装イメージ
          ======================================== */}
      <div className="bg-slate-900 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#ecf3f1] text-xs tracking-[0.3em] uppercase font-bold">
              {({ ja: '新病院棟イメージ', 'zh-TW': '新院區內部設計', 'zh-CN': '新院区内部设计', en: 'New Building Interior Design' } as Record<Language, string>)[lang]}
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-white mt-3">
              {({ ja: '未来型スマートホスピタルの全貌', 'zh-TW': '未來型智慧醫院全貌', 'zh-CN': '未来型智慧医院全貌', en: 'The Future Smart Hospital Unveiled', ko: '미래형 스마트 호스피탈의 전모' } as Record<Language, string>)[lang]}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { src: 'https://www.hosp.hyo-med.ac.jp/new-building/common/img/nb_img01.jpg', label: { ja: '正面エントランス', 'zh-TW': '正面入口', 'zh-CN': '正面入口', en: 'Main Entrance', ko: '정면 입구' } as Record<Language, string> },
              { src: 'https://www.hosp.hyo-med.ac.jp/new-building/common/img/nb_img02.jpg', label: { ja: 'メインロビー', 'zh-TW': '大廳', 'zh-CN': '大厅', en: 'Main Lobby', ko: '메인 로비' } as Record<Language, string> },
              { src: 'https://www.hosp.hyo-med.ac.jp/new-building/common/img/nb_img03.jpg', label: { ja: '外来フロア', 'zh-TW': '門診樓層', 'zh-CN': '门诊楼层', en: 'Outpatient Floor', ko: '외래 층' } as Record<Language, string> },
              { src: 'https://www.hosp.hyo-med.ac.jp/new-building/common/img/nb_img04.jpg', label: { ja: '待合エリア', 'zh-TW': '候診區', 'zh-CN': '候诊区', en: 'Waiting Area', ko: '대기 공간' } as Record<Language, string> },
              { src: 'https://www.hosp.hyo-med.ac.jp/new-building/common/img/nb_img05.jpg', label: { ja: '病棟フロア', 'zh-TW': '病房樓層', 'zh-CN': '病房楼层', en: 'Ward Floor', ko: '병동 층' } as Record<Language, string> },
              { src: 'https://www.hosp.hyo-med.ac.jp/new-building/common/img/nb_img06.jpg', label: { ja: '屋上庭園', 'zh-TW': '屋頂花園', 'zh-CN': '屋顶花园', en: 'Rooftop Garden', ko: '옥상 정원' } as Record<Language, string> },
            ].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <Image src={img.src} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt={img.label.en} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={75} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white text-sm font-medium">{img.label[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================
          8c. 建設進捗 — Construction Progress
          ======================================== */}
      <div className="bg-[#f7f6f0] py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gray-500 text-xs tracking-[0.2em] uppercase font-bold">
              {({ ja: '建設進捗', 'zh-TW': '建設進度', 'zh-CN': '建设进度', en: 'Construction Progress', ko: '건설 진척' } as Record<Language, string>)[lang]}
            </span>
            <h3 className="text-xl md:text-2xl font-serif text-gray-900 mt-2">
              {({ ja: '2025年12月時点 — 完成率91.7%', 'zh-TW': '2025年12月 — 完成率91.7%', 'zh-CN': '2025年12月 — 完成率91.7%', en: 'As of December 2025 — 91.7% Complete', ko: '2025년 12월 기준 — 완성률 91.7%' } as Record<Language, string>)[lang]}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {({ ja: '地上躯体工事完了、各階仕上工事を施工中', 'zh-TW': '地上結構工程完成，各樓層裝修施工中', 'zh-CN': '地上结构工程完成，各楼层装修施工中', en: 'Structural work complete, finishing work in progress on all floors', ko: '지상 구조체 공사 완료, 각 층 마감 공사 시공 중' } as Record<Language, string>)[lang]}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/202601_01.jpg',
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/202601_2.jpg',
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/202601_03.jpg',
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/202601_04.jpg',
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/202601_05.jpg',
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/202601_06.jpg',
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/202601_07.jpg',
              'https://www.hosp.hyo-med.ac.jp/upload/news/content/20250919_sinbyouin_01.jpg',
            ].map((src, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <Image src={src} fill className="object-cover transition-transform duration-500 group-hover:scale-105" alt={`Construction progress ${i + 1}`} sizes="(max-width: 768px) 50vw, 25vw" quality={75} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================
          9. 救急・災害 (右对齐全屏)
          ======================================== */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <Image src="https://www.hosp.hyo-med.ac.jp/upload/news/content/kouji1.jpg" fill className="object-cover" alt="Emergency Center" sizes="100vw" quality={75} />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-2xl ml-auto text-right">
            <div className="flex items-center justify-end gap-3 mb-4">
              <span className="text-xs tracking-[0.3em] text-[#ecf3f1] uppercase">Emergency & Disaster</span>
              <div className="h-[1px] w-12 bg-[#ecf3f1]" />
            </div>
            <h4 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-serif">{t.emergTitle[lang]}</h4>
            <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">{t.emergDesc[lang]}</p>
            <div className="mt-6 flex justify-end flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">20-bed EICU</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">24/7/365</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">{t.emergPopulation[lang]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24">

        {/* ========================================
            10. 全41诊疗科
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">41 Clinical Departments</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.deptTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ecf3f1] text-[#0f7459] rounded-full flex items-center justify-center"><Heart size={20} /></div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptInternal[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.internal.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-[#0f7459] shrink-0 mt-0.5" />{dept[lang]}</div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ecf3f1] text-[#0f7459] rounded-full flex items-center justify-center"><Syringe size={20} /></div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptSurgical[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.surgical.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-[#0f7459] shrink-0 mt-0.5" />{dept[lang]}</div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center"><Stethoscope size={20} /></div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">{t.deptSpecialty[lang]}</h4>
              </div>
              <div className="space-y-2">
                {DEPARTMENTS.other.map((dept, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />{dept[lang]}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            11. Access & Info Section
            ======================================== */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">Hospital Information</span>
            <h3 className="text-3xl font-serif text-gray-900 mt-2">{t.accessTitle[lang]}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-100 rounded-2xl h-80 md:h-[450px] overflow-hidden relative">
              <Image
                src="/images/hyogo-medical/access-map.png"
                alt={t.accessAddress[lang]}
                fill
                className="object-cover rounded-2xl"
                quality={75}
              />
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#ecf3f1] text-[#0f7459] rounded-full flex items-center justify-center shrink-0"><MapPin size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{t.accessLabelAddress[lang]}</h4>
                    <p className="text-sm text-gray-500">{t.accessAddress[lang]}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#ecf3f1] text-[#0f7459] rounded-full flex items-center justify-center shrink-0"><Train size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{t.accessLabelTrain[lang]}</h4>
                    <p className="text-sm text-gray-500">{t.accessTrain[lang]}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#ecf3f1] text-[#0f7459] rounded-full flex items-center justify-center shrink-0"><Clock size={20} /></div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 font-serif">{t.accessLabelHours[lang]}</h4>
                    <p className="text-sm text-gray-500">{t.hoursWeekday[lang]}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.hoursClosed[lang]}</p>
                  </div>
                </div>
              </div>
              <a href="https://www.hosp.hyo-med.ac.jp/" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition text-center">
                <ExternalLink size={16} />{t.officialSite[lang]}
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================
          12. 就诊流程 (Treatment Flow)
          ======================================== */}
      <section id="treatment-flow" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">{bookingT.flowTag[lang]}</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">{bookingT.flowTitle[lang]}</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">{bookingT.flowDesc[lang]}</p>
          </div>

          {/* Phase Navigation */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TREATMENT_PHASES.map((phase) => {
                const PhaseIcon = phase.icon;
                const isActive = activePhase === phase.phaseNumber;
                const c = PHASE_COLORS[phase.color];
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
                    <h4 className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                      {phase.title[lang]}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {phase.duration[lang]}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">{bookingT.flowClickPhase[lang]}</p>
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
                  {/* Phase Header */}
                  <div className={`bg-gradient-to-r ${PHASE_GRADIENT_MAP[phase.color]} p-6 md:p-8 text-white`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                          <PhaseIcon size={24} />
                        </div>
                        <div>
                          <div className="text-white/70 text-xs font-bold tracking-wider">PHASE {phase.phaseNumber}</div>
                          <h4 className="text-xl md:text-2xl font-bold">{phase.title[lang]}</h4>
                          <p className="text-white/80 text-sm mt-1">{phase.subtitle[lang]}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                          <Clock size={14} /> {phase.duration[lang]}
                        </span>
                        {phase.feeSummary && (
                          <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                            <CreditCard size={14} /> {phase.feeSummary[lang]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Two-column: You Do vs We Handle */}
                  <div className="p-6 md:p-8 bg-white">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {/* Patient Actions */}
                      <div className={`rounded-xl p-5 border ${PHASE_LIGHT_BG_MAP[phase.color]}`}>
                        <div className="flex items-center gap-2 mb-4">
                          <Users size={18} className="text-gray-600" />
                          <h5 className="font-bold text-gray-900 text-sm">{bookingT.flowYouDo[lang]}</h5>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.patientActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-[#0f7459] flex-shrink-0 mt-0.5" />
                              <span>{action[lang]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* We Handle */}
                      <div className="rounded-xl p-5 border bg-gray-50 border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield size={18} className="text-gray-600" />
                          <h5 className="font-bold text-gray-900 text-sm">{bookingT.flowWeHandle[lang]}</h5>
                        </div>
                        <ul className="space-y-2.5">
                          {phase.weHandle.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-[#0f7459] flex-shrink-0 mt-0.5" />
                              <span>{item[lang]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sub-step Timeline */}
                    <div>
                      <h5 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        {bookingT.flowStepDetail[lang]}
                      </h5>
                      <div className="relative">
                        <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${PHASE_DOT_MAP[phase.color]} opacity-20`}></div>
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
                                      <h6 className="text-sm font-bold text-gray-900">{step.title[lang]}</h6>
                                      {step.fee && (
                                        <span className="bg-[#ecf3f1] text-[#0f7459] text-xs font-bold px-2 py-0.5 rounded-full">
                                          ¥{step.fee}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">{step.subtitle[lang]}</p>
                                    {expandedStep === step.step && step.desc && (
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs text-gray-600 leading-relaxed">{step.desc[lang]}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">{step.from[lang]}</span>
                                    <ArrowRight size={10} />
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">{step.to[lang]}</span>
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

      {/* ========================================
          13. 咨询服务预约（Stripe 支付）
          ======================================== */}
      <section id="contact-form" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#0f7459] text-xs tracking-widest uppercase font-bold">{bookingT.svcTag[lang]}</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">{bookingT.svcTitle[lang]}</h3>
              <p className="text-gray-500 mb-4">{bookingT.svcDesc[lang]}</p>
              <div className="inline-flex items-center gap-2 bg-[#ecf3f1] border border-[#dae9e5] px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecf3f1] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0f7459]" />
                </span>
                <span className="text-[#0f7459] text-sm">{bookingT.svcLimit[lang]}</span>
              </div>
            </div>

            {/* 2 Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {CONSULTATION_SERVICES.map((svc) => (
                <div key={svc.slug} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all">
                  <div className={`bg-gradient-to-r ${svc.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold">{svc.name[lang]}</h4>
                        <p className="text-white/70 text-sm">{svc.nameEn}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">¥{svc.price.toLocaleString()}</p>
                        <p className="text-xs text-white/60">{bookingT.taxIncl[lang]}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-6">{svc.desc[lang]}</p>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      {svc.features[lang].map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={14} className={`${svc.checkColor} mt-0.5 shrink-0`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={guideSlug ? `${svc.href}?guide=${guideSlug}` : svc.href}
                      className={`block w-full py-3 bg-gradient-to-r ${svc.gradient} ${svc.hoverGradient} text-white text-center font-bold rounded-xl transition shadow-lg`}
                    >
                      {bookingT.bookNow[lang]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Member System Notice */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ecf3f1] rounded-xl flex items-center justify-center shrink-0">
                  <Users size={24} className="text-[#0f7459]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{bookingT.memberTitle[lang]}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{bookingT.memberDesc[lang]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          15. Contact Methods (非白标模式)
          ======================================== */}
      {!isGuideEmbed && (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-6 text-center text-lg flex items-center justify-center gap-2">
                <MessageSquare size={20} className="text-gray-600" />
                {bookingT.contactTitle[lang]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://line.me/ti/p/j3XxBP50j9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#06C755] text-white p-4 rounded-xl hover:bg-[#05b04c] transition font-bold"
                >
                  <MessageSquare size={20} />
                  {bookingT.contactLine[lang]}
                </a>
                <a
                  href="mailto:info@niijima-koutsu.jp"
                  className="flex items-center justify-center gap-3 bg-gray-800 text-white p-4 rounded-xl hover:bg-gray-700 transition font-bold"
                >
                  <Mail size={20} />
                  {bookingT.contactEmail[lang]}
                </a>
                <button
                  onClick={() => setShowWechatQR(true)}
                  className="flex items-center justify-center gap-3 bg-[#07C160] text-white p-4 rounded-xl hover:bg-[#06ad56] transition font-bold"
                >
                  <WeChatIcon />
                  {bookingT.contactWechat[lang]}
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-1.5"><Lock size={14} /><span>SSL</span></div>
                <div className="flex items-center gap-1.5"><CreditCard size={14} /><span>Stripe</span></div>
                <div className="flex items-center gap-1.5"><Shield size={14} /><span>{t.privacyLabel[lang]}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ========================================
          16. CTA Section
          ======================================== */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h3 className="text-3xl font-serif text-gray-900 mb-4">{t.ctaTitle[lang]}</h3>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto whitespace-pre-line mb-8">{t.ctaDesc[lang]}</p>
          {!isGuideEmbed && (
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0f7459] to-[#1766b0] text-white px-8 py-4 rounded-full font-bold hover:from-[#0d634c] hover:to-[#135a96] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Stethoscope size={20} />
              {bookingT.bookNow[lang]}
              <ArrowRight size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Contact section is hidden in guide embed mode */}

      {/* WeChat QR Modal */}
      {showWechatQR && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowWechatQR(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowWechatQR(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-16 h-16 bg-[#07C160] rounded-full flex items-center justify-center mx-auto mb-4">
              <WeChatIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{bookingT.wechatTitle[lang]}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {t.wechatAddPrompt[lang]}
            </p>
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-mono font-bold text-gray-800 select-all">niijima-medical</span>
                <button
                  onClick={() => { navigator.clipboard.writeText('niijima-medical'); }}
                  className="px-3 py-1 bg-[#07C160] text-white text-xs rounded-lg hover:bg-[#06ad56] transition"
                >
                  {t.copyLabel[lang]}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400">{bookingT.wechatNote[lang]}</p>
          </div>
        </div>
      )}

      {/* ━━━━━━━━ Medical Disclaimer ━━━━━━━━ */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <ul className="space-y-1.5 text-xs text-gray-500 leading-relaxed">
            <li>※ {{ ja: '本ページで紹介する検査・治療には自由診療（保険適用外）が含まれます。費用は医療機関の基準に従います。', 'zh-TW': '本頁介紹的檢查・治療包含自費診療（不適用保險）。費用依醫療機構標準。', 'zh-CN': '本页介绍的检查・治疗包含自费诊疗（不适用保险）。费用依医疗机构标准。', en: 'Examinations and treatments on this page may include self-pay options (not covered by insurance). Fees follow each facility\'s standards.' }[lang]}</li>
            <li>※ {{ ja: '治療効果には個人差があり、すべての患者に同様の効果を保証するものではありません。', 'zh-TW': '治療效果因人而異，不保證所有患者均能獲得相同效果。', 'zh-CN': '治疗效果因人而异，不保证所有患者均能获得相同效果。', en: 'Treatment effects vary by individual and are not guaranteed for all patients.', ko: '치료 효과에는 개인차가 있으며, 모든 환자에게 동일한 효과를 보장하는 것은 아닙니다.' }[lang]}</li>
            <li>※ {{ ja: '当社（新島交通株式会社・大阪府知事登録旅行業 第2-3115号）は旅行業者であり、医療機関ではありません。医療行為は各提携医療機関が提供します。', 'zh-TW': '本公司（新島交通株式會社・大阪府知事登錄旅行業 第2-3115號）為旅行業者，非醫療機構。醫療行為由各合作醫療機構提供。', 'zh-CN': '本公司（新岛交通株式会社・大阪府知事登录旅行业 第2-3115号）为旅行业者，非医疗机构。医疗行为由各合作医疗机构提供。', en: 'Niijima Kotsu Co., Ltd. (Osaka Gov. Registered Travel Agency No. 2-3115) is a travel agency, not a medical institution. Medical services are provided by partner facilities.', ko: '당사(신지마교통주식회사·오사카부 지사 등록 여행업 제2-3115호)는 여행업자이며, 의료기관이 아닙니다. 의료행위는 각 제휴 의료기관이 제공합니다.' }[lang]}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
