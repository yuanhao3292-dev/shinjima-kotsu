# 近畿大学病院白标页面 v4.0 — 官方设计风格改版计划

## 改版目标

根据官方 PDF 提供的设计风格和主题色调,对 v3.0 进行全面视觉改版,同时融入最新提取的先进医疗设备和医师信息。

---

## 官方设计风格分析（基于 PDF）

### 主题色调
- **主色**: 深蓝色 (#003e7e 或类似)
- **辅助色**: 白色、浅灰色
- **强调色**: 橙红色（用于按钮和重点标识）
- **整体风格**: 现代、专业、医疗机构感强

### 设计特征
1. **大幅图片使用**: 新医院建筑全景图、大型停车场实景
2. **深色导航栏**: 深蓝色背景,白色文字
3. **清晰的层次结构**: 模块化设计,间隔明确
4. **专业字体**: 黑体/无衬线字体,清晰易读
5. **高质量实景图片**: 不使用库存图,全部真实医院照片

---

## v3.0 → v4.0 主要改动

### 1. 配色方案改革（核心变更）

**v3.0 当前配色**:
- 蓝色系（blue-600, blue-50）
- 紫色系（purple-600）
- 琥珀色系（amber-600）
- 青绿色系（teal-600）

**v4.0 新配色**:
```css
/* 主色调 - 深蓝色 */
--kindai-primary: #003e7e;        /* 深蓝 */
--kindai-primary-light: #0052a3;  /* 中蓝 */
--kindai-primary-dark: #002a56;   /* 极深蓝 */

/* 辅助色 */
--kindai-accent: #e85d04;         /* 橙红色强调 */
--kindai-bg-light: #f5f7fa;       /* 浅灰背景 */
--kindai-text: #1a1a1a;           /* 深灰文字 */
--kindai-border: #d1d5db;         /* 边框灰 */
```

### 2. 图片资源更新

**Hero 背景图**:
- ❌ 移除: Unsplash 库存图
- ✅ 使用: 官网新医院建筑全景图
  - `https://www.med.kindai.ac.jp/img/about/relocation/img_concept01.jpg`（已在 next.config.js 配置）

**新增设备图片**:
- da Vinci 手术机器人实景照片
- Hybrid Operating Room 手术室照片
- Halcyon 放疗设备照片
- NAVIO 膝关节手术机器人照片

**医师照片**:
- 津谷康浩教授真实照片（呼吸器外科）

### 3. 国家级资质认证区域改版

**当前设计**:
- 4个卡片,蓝色渐变图标
- 网格布局

**v4.0 设计**:
- 保持4个核心认证
- 改用深蓝色背景 (#003e7e)
- 白色文字和图标
- 添加微妙的边框和阴影

### 4. Tab 区域改版

**当前 Tab 样式**:
```tsx
activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
```

**v4.0 Tab 样式**:
```tsx
activeTab === tab ? 'border-[#003e7e] text-[#003e7e]' : 'border-transparent text-gray-500'
```

### 5. 综合医疗实力数据卡片改版

**当前**:
- 蓝色图标背景（bg-blue-50）
- 蓝色文字（text-blue-600）

**v4.0**:
- 深蓝色图标背景（bg-[#003e7e]/10）
- 深蓝色文字（text-[#003e7e]）
- 白色卡片，深蓝色边框

### 6. 顶尖医疗设备 Tab 重构（重大更新）

**v3.0 当前展示** (4台通用设备):
1. PET分子影像中心 (BresTome®)
2. 高磁场MRI（3特斯拉）
3. 血管造影系统
4. 最新CT设备

**v4.0 新增展示** (整合最新提取的5台设备):

#### (1) da Vinci 手术支援机器人
```typescript
{
  name: {
    ja: 'da Vinci 手术支援机器人',
    'zh-CN': 'da Vinci 手术辅助机器人',
    'zh-TW': 'da Vinci 手術輔助機器人',
    en: 'da Vinci Surgical Robot'
  },
  description: {
    ja: '最新の第4世代da Vinci Xiシステムを導入。3D高精細画像と多関節アームによる精密手術を実現',
    'zh-CN': '引进最新第4代da Vinci Xi系统,通过3D高清影像和多关节机械臂实现精密手术',
    'zh-TW': '引進最新第4代da Vinci Xi系統,透過3D高清影像和多關節機械臂實現精密手術',
    en: 'Latest 4th generation da Vinci Xi system with 3D HD imaging and multi-articulated arms for precision surgery'
  },
  applications: {
    ja: '泌尿器科（前立腺がん）、外科（胃がん・大腸がん）、婦人科手術',
    'zh-CN': '泌尿外科(前列腺癌)、外科(胃癌、大肠癌)、妇科手术',
    'zh-TW': '泌尿外科(前列腺癌)、外科(胃癌、大腸癌)、婦科手術',
    en: 'Urology (prostate cancer), surgery (gastric/colorectal cancer), gynecology'
  },
  advantages: [
    { ja: '低侵襲手術（傷口小）', 'zh-CN': '微创手术(伤口小)', 'zh-TW': '微創手術(傷口小)', en: 'Minimally invasive (small incisions)' },
    { ja: '出血量の軽減', 'zh-CN': '减少出血量', 'zh-TW': '減少出血量', en: 'Reduced blood loss' },
    { ja: '早期回復・退院', 'zh-CN': '快速恢复和出院', 'zh-TW': '快速恢復和出院', en: 'Faster recovery & discharge' },
    { ja: '手ぶれ補正機能', 'zh-CN': '手部抖动补偿功能', 'zh-TW': '手部抖動補償功能', en: 'Tremor elimination' }
  ],
  imageUrl: 'https://www.med.kindai.ac.jp/geka/img/davinci_img01.jpg'
}
```

#### (2) Hybrid Operating Room (複合手術室)
```typescript
{
  name: {
    ja: 'ハイブリッド手術室',
    'zh-CN': '复合手术室',
    'zh-TW': '複合手術室',
    en: 'Hybrid Operating Room'
  },
  description: {
    ja: '手術と画像診断を同時に行える最新鋭の手術室。心臓血管外科や脳神経外科の高難度手術に対応',
    'zh-CN': '可同时进行手术和影像诊断的最先进手术室,适用于心血管外科和脑外科高难度手术',
    'zh-TW': '可同時進行手術和影像診斷的最先進手術室,適用於心血管外科和腦外科高難度手術',
    en: 'State-of-the-art OR enabling simultaneous surgery and imaging for complex cardiovascular and neurosurgical procedures'
  },
  equipment: {
    ja: '血管造影装置（Artis zee、ARTIS Q ceiling）、3D回転撮影機能',
    'zh-CN': '血管造影设备(Artis zee、ARTIS Q ceiling)、3D旋转拍摄功能',
    'zh-TW': '血管造影設備(Artis zee、ARTIS Q ceiling)、3D旋轉拍攝功能',
    en: 'Angiography systems (Artis zee, ARTIS Q ceiling), 3D rotational imaging'
  },
  advantages: [
    { ja: '手術中のリアルタイム画像診断', 'zh-CN': '术中实时影像诊断', 'zh-TW': '術中即時影像診斷', en: 'Real-time intraoperative imaging' },
    { ja: '開頭・開胸の軽減', 'zh-CN': '减少开颅、开胸手术', 'zh-TW': '減少開顱、開胸手術', en: 'Reduced need for craniotomy/thoracotomy' },
    { ja: '治療精度の向上', 'zh-CN': '提高治疗精度', 'zh-TW': '提高治療精度', en: 'Enhanced treatment precision' }
  ],
  imageUrl: 'https://www.med.kindai.ac.jp/cyushin/img/hybrid_img01.jpg'
}
```

#### (3) Halcyon 放射線治療装置
```typescript
{
  name: {
    ja: 'Halcyon 放射線治療装置',
    'zh-CN': 'Halcyon 放射治疗设备',
    'zh-TW': 'Halcyon 放射治療設備',
    en: 'Halcyon Radiation Therapy System'
  },
  description: {
    ja: '最新鋭の画像誘導放射線治療（IGRT）システム。毎回の治療前にCT撮影を行い、正確な照射を実現',
    'zh-CN': '最先进的影像引导放射治疗(IGRT)系统,每次治疗前进行CT扫描,实现精准照射',
    'zh-TW': '最先進的影像引導放射治療(IGRT)系統,每次治療前進行CT掃描,實現精準照射',
    en: 'Advanced image-guided radiation therapy (IGRT) system with pre-treatment CT for precise targeting'
  },
  features: {
    ja: 'kV-CBCT（コーンビームCT）、6軸治療台による自動位置補正',
    'zh-CN': 'kV-CBCT(锥形束CT)、6轴治疗台自动位置校正',
    'zh-TW': 'kV-CBCT(錐形束CT)、6軸治療台自動位置校正',
    en: 'kV-CBCT imaging, 6-axis treatment couch with automatic positioning'
  },
  advantages: [
    { ja: '治療時間の短縮（約15分→約3分）', 'zh-CN': '缩短治疗时间(约15分钟→约3分钟)', 'zh-TW': '縮短治療時間(約15分鐘→約3分鐘)', en: 'Reduced treatment time (15min→3min)' },
    { ja: '患者負担の軽減', 'zh-CN': '减轻患者负担', 'zh-TW': '減輕患者負擔', en: 'Reduced patient burden' },
    { ja: '高精度な照射', 'zh-CN': '高精度照射', 'zh-TW': '高精度照射', en: 'High-precision targeting' }
  ],
  imageUrl: 'https://www.med.kindai.ac.jp/houshasen/img/halcyon_img01.jpg'
}
```

#### (4) NAVIO 膝関節手術支援ロボット
```typescript
{
  name: {
    ja: 'NAVIO 膝関節手術支援ロボット',
    'zh-CN': 'NAVIO 膝关节手术辅助机器人',
    'zh-TW': 'NAVIO 膝關節手術輔助機器人',
    en: 'NAVIO Knee Surgery Robot'
  },
  description: {
    ja: '人工膝関節置換術を支援する最新ロボットシステム。CT不要で、術中にリアルタイムで骨形状を3Dマッピング',
    'zh-CN': '辅助人工膝关节置换术的最新机器人系统,无需CT,术中实时3D骨骼成像',
    'zh-TW': '輔助人工膝關節置換術的最新機器人系統,無需CT,術中即時3D骨骼成像',
    en: 'Advanced robotic system for knee replacement surgery with real-time 3D bone mapping, no CT required'
  },
  advantages: [
    { ja: 'CT撮影不要（被曝ゼロ）', 'zh-CN': '无需CT扫描(零辐射)', 'zh-TW': '無需CT掃描(零輻射)', en: 'No CT scan (zero radiation)' },
    { ja: '手術時間の短縮', 'zh-CN': '缩短手术时间', 'zh-TW': '縮短手術時間', en: 'Reduced surgery time' },
    { ja: '骨切除量の最小化', 'zh-CN': '最小化骨切除量', 'zh-TW': '最小化骨切除量', en: 'Minimized bone removal' },
    { ja: '正確なインプラント設置', 'zh-CN': '精准植入假体', 'zh-TW': '精準植入假體', en: 'Precise implant placement' }
  ],
  imageUrl: 'https://www.med.kindai.ac.jp/seikei/img/navio_img01.jpg'
}
```

#### (5) PET分子影像中心（保留原有）
```typescript
{
  name: {
    ja: 'PET分子イメージングセンター',
    'zh-CN': 'PET分子影像中心',
    'zh-TW': 'PET分子影像中心',
    en: 'PET Molecular Imaging Center'
  },
  description: {
    ja: '頭部・乳房専用PET装置（BresTome®）を導入。高精度ながん早期発見と認知症診断に対応',
    'zh-CN': '引进头部·乳房专用PET装置(BresTome®),实现高精度癌症早期发现和认知症诊断',
    'zh-TW': '引進頭部·乳房專用PET裝置(BresTome®),實現高精度癌症早期發現和認知症診斷',
    en: 'Head and breast-dedicated PET system (BresTome®) for early cancer detection and dementia diagnosis'
  }
}
```

**设计变更**:
- 每台设备使用卡片展示
- 左侧: 设备照片（400x300px）
- 右侧: 设备名称、描述、优势列表
- 深蓝色边框和图标

### 7. 新增医师团队展示区域（NEW！）

**位置**: 在"大学医院优势" Tab 之后,或作为独立 Tab

**展示内容**:

#### 津谷康浩教授（呼吸器外科）
```typescript
{
  name: {
    ja: '津谷 康浩',
    'zh-CN': '津谷康浩',
    'zh-TW': '津谷康浩',
    en: 'Tsutani Yasuhiro'
  },
  title: {
    ja: '教授・診療部長',
    'zh-CN': '教授·诊疗部长',
    'zh-TW': '教授·診療部長',
    en: 'Professor & Director'
  },
  department: {
    ja: '呼吸器外科',
    'zh-CN': '呼吸外科',
    'zh-TW': '呼吸外科',
    en: 'Thoracic Surgery'
  },
  specialties: [
    { ja: '肺がん', 'zh-CN': '肺癌', 'zh-TW': '肺癌', en: 'Lung cancer' },
    { ja: '縦隔腫瘍', 'zh-CN': '纵隔肿瘤', 'zh-TW': '縱隔腫瘤', en: 'Mediastinal tumors' },
    { ja: '胸腔鏡手術', 'zh-CN': '胸腔镜手术', 'zh-TW': '胸腔鏡手術', en: 'Thoracoscopic surgery' }
  ],
  credentials: {
    ja: '日本外科学会専門医・指導医、日本呼吸器外科学会専門医、da Vinci Certificate取得',
    'zh-CN': '日本外科学会专科医师·指导医师、日本呼吸外科学会专科医师、da Vinci 认证',
    'zh-TW': '日本外科學會專科醫師·指導醫師、日本呼吸外科學會專科醫師、da Vinci 認證',
    en: 'Board-certified surgeon, thoracic surgery specialist, da Vinci certified'
  },
  achievements: {
    ja: '肺がん手術年間150例以上、胸腔鏡手術のエキスパート',
    'zh-CN': '每年肺癌手术150例以上,胸腔镜手术专家',
    'zh-TW': '每年肺癌手術150例以上,胸腔鏡手術專家',
    en: '150+ lung cancer surgeries annually, expert in thoracoscopic procedures'
  }
}
```

**设计**:
- 横向卡片布局
- 左侧: 医师照片（圆形裁剪,150x150px）
- 右侧: 姓名、职位、专业领域、资质、成就
- 深蓝色边框和标题

### 8. 官方数据更新（来自 OFFICIAL-DATA-VALIDATION.md）

**综合医疗实力数据修正**:
```typescript
// 当前错误数据
{ number: '14', unit: t.centersSuffix, label: t.specializedCentersLabel }

// 修正为官方数据
{ number: '20', unit: t.centersSuffix, label: t.specializedCentersLabel }
```

**新增医疗团队数据**（2个新卡片）:
```typescript
{
  icon: Users,
  number: '773',
  unit: t.doctorsSuffix,     // "人"
  label: t.doctorsLabel       // "医师团队"
},
{
  icon: HeartPulse,
  number: '892',
  unit: t.nursesSuffix,       // "人"
  label: t.nursesLabel        // "护士团队"
}
```

**统计数据从 6 个扩展到 8 个**:
1. 800床（病床数）
2. 35科（诊疗科）
3. **20中心**（专门中心）← 修正
4. 23,451人（年度出院患者）
5. 3,000+台（年度手术）
6. 50年（临床实绩）
7. **773人（医师团队）**← 新增
8. **892人（护士团队）**← 新增

### 9. MDT 多学科协作 Tab 改版

**颜色变更**:
- ❌ 移除: 紫色主题（from-purple-600）
- ✅ 使用: 深蓝色主题（from-[#003e7e]）

### 10. 大学医院优势 Tab 改版

**颜色变更**:
- ❌ 移除: 琥珀色主题（from-amber-600）
- ✅ 使用: 深蓝色主题（from-[#003e7e]）

---

## 字体更新

### 当前字体栈
```css
font-family: system-ui, -apple-system, sans-serif;
```

### v4.0 字体栈（更专业）
```css
/* 日语优化 */
font-family:
  -apple-system, BlinkMacSystemFont,
  "Hiragino Kaku Gothic ProN", "Hiragino Sans",
  "Yu Gothic", "Meiryo",
  sans-serif;

/* 标题字体（粗体） */
font-weight: 700;
letter-spacing: 0.02em;  /* 略微增加字间距 */
```

---

## 响应式设计调整

### 移动端优化
- Hero 图片高度: 从 600px → 500px（移动端更合适）
- Tab 标签: 滚动容器，避免换行
- 设备卡片: 移动端改为纵向布局（图片在上,文字在下）
- 医师卡片: 移动端改为纵向布局

---

## 翻译文件更新需求

需要在 `lib/i18n/translations/kindai-hospital.ts` 添加以下新条目:

```typescript
// 设备相关
daVinciRobot: { ja: 'da Vinci手术支援ロボット', ... },
hybridOR: { ja: 'ハイブリッド手術室', ... },
halcyon: { ja: 'Halcyon放射線治療装置', ... },
navioRobot: { ja: 'NAVIO膝関節手術支援ロボット', ... },

// 医疗团队
doctorsSuffix: { ja: '人', 'zh-CN': '人', 'zh-TW': '人', en: 'Doctors' },
doctorsLabel: { ja: '医師数', 'zh-CN': '医师团队', 'zh-TW': '醫師團隊', en: 'Medical Doctors' },
nursesSuffix: { ja: '人', 'zh-CN': '人', 'zh-TW': '人', en: 'Nurses' },
nursesLabel: { ja: '看護師数', 'zh-CN': '护士团队', 'zh-TW': '護士團隊', en: 'Nursing Staff' },

// 医师信息
tsutaniName: { ja: '津谷 康浩', ... },
professorTitle: { ja: '教授・診療部長', ... },
thoracicSurgery: { ja: '呼吸器外科', ... },
// ... 更多医师相关翻译
```

---

## 实施步骤

### Phase 1: 配色和字体（基础改版）
1. ✅ 定义新的颜色变量
2. ✅ 更新所有蓝色/紫色/琥珀色组件
3. ✅ 更新字体栈和字重

### Phase 2: 图片资源更新
1. ✅ 替换 Hero 背景图为官网实景
2. ✅ 添加 5 台设备的实景照片
3. ✅ 添加津谷教授照片

### Phase 3: 数据更新
1. ✅ 修正专门中心数量（14→20）
2. ✅ 新增医师/护士数据卡片
3. ✅ 调整网格布局（6个→8个统计卡片）

### Phase 4: 设备展示区重构
1. ✅ 整合 5 台新设备数据
2. ✅ 重新设计设备卡片布局（图片+文字）
3. ✅ 添加设备优势列表展示

### Phase 5: 医师团队区域
1. ✅ 创建医师卡片组件
2. ✅ 添加津谷教授信息
3. ✅ 预留更多医师位置（可扩展）

### Phase 6: 翻译和测试
1. ✅ 更新翻译文件
2. ✅ 测试 4 种语言显示
3. ✅ 响应式测试（移动端/平板/桌面）

---

## 预期效果

### 视觉改进
- ✅ 专业医疗机构感更强（深蓝色主题）
- ✅ 真实感提升（全部使用官网实景图片）
- ✅ 设计统一性（与官网风格一致）

### 内容丰富度
- ✅ 设备展示从 4 台 → 5 台高端设备
- ✅ 新增医师团队展示
- ✅ 数据更准确（官方验证）

### 可信度提升
- ✅ 真实设备照片（不是库存图）
- ✅ 真实医师照片和详细资质
- ✅ 官方数据来源可追溯

---

## 文件修改清单

### 主要修改
- `app/kindai-hospital/KindaiHospitalContent.tsx` — 主组件改版

### 翻译更新
- `lib/i18n/translations/kindai-hospital.ts` — 新增翻译条目（如存在）

### 配置文件（已完成）
- `next.config.js` — 已添加 www.med.kindai.ac.jp 图片域名

### 备份
- `app/kindai-hospital/KindaiHospitalContent.v3-backup.tsx` — v3.0 备份

---

**创建日期**: 2026-03-06
**版本**: v4.0 Reform Plan
**改版理由**: 匹配官方设计风格,融入最新医疗设备和医师信息
**数据来源**: 官方 PDF + 10个官网 URL（5个成功提取）
