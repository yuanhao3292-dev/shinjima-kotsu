import type { Language } from '@/hooks/useLanguage';

/**
 * 病症联想词库 — hero 搜索框 autocomplete 的种子数据。
 *
 * 结构灵感来自 DiseaseOntology/SymptomOntology（CC0），但词条为本站
 * 面向就医场景自建：每条 = 一个患者常用表述 × 5 语言 + 对应科室。
 * 匹配时对所有语言的词面做子串匹配（很多繁体用户会打简体、
 * 日文用户会打汉字，跨语言命中是特性不是 bug）。
 *
 * ⚠️ 科室 dept 用 zh-CN 词面，与 /api/hospital-match 的 DEPARTMENTS
 * 列表保持一致 —— 分诊 LLM 与本地匹配引擎都认这套中文科室名。
 */

export interface SymptomSuggestion {
  /** 科室（zh-CN，与 hospital-match DEPARTMENTS 一致） */
  dept: string;
  /** 各语言显示词面 */
  t: Record<Language, string>;
}

/** 科室显示名（下拉右侧的小标签用） */
export const DEPT_LABELS: Record<string, Record<Language, string>> = {
  消化内科: { ja: '消化器内科', 'zh-TW': '消化內科', 'zh-CN': '消化内科', en: 'Gastroenterology', ko: '소화기내과' },
  呼吸内科: { ja: '呼吸器内科', 'zh-TW': '呼吸內科', 'zh-CN': '呼吸内科', en: 'Pulmonology', ko: '호흡기내과' },
  循环内科: { ja: '循環器内科', 'zh-TW': '心臟內科', 'zh-CN': '循环内科', en: 'Cardiology', ko: '순환기내과' },
  神经内科: { ja: '神経内科', 'zh-TW': '神經內科', 'zh-CN': '神经内科', en: 'Neurology', ko: '신경과' },
  骨科: { ja: '整形外科', 'zh-TW': '骨科', 'zh-CN': '骨科', en: 'Orthopedics', ko: '정형외과' },
  泌尿外科: { ja: '泌尿器科', 'zh-TW': '泌尿科', 'zh-CN': '泌尿外科', en: 'Urology', ko: '비뇨기과' },
  妇产科: { ja: '産婦人科', 'zh-TW': '婦產科', 'zh-CN': '妇产科', en: 'OB/GYN', ko: '산부인과' },
  乳腺外科: { ja: '乳腺外科', 'zh-TW': '乳房外科', 'zh-CN': '乳腺外科', en: 'Breast Surgery', ko: '유방외과' },
  眼科: { ja: '眼科', 'zh-TW': '眼科', 'zh-CN': '眼科', en: 'Ophthalmology', ko: '안과' },
  耳鼻喉科: { ja: '耳鼻咽喉科', 'zh-TW': '耳鼻喉科', 'zh-CN': '耳鼻喉科', en: 'ENT', ko: '이비인후과' },
  皮肤科: { ja: '皮膚科', 'zh-TW': '皮膚科', 'zh-CN': '皮肤科', en: 'Dermatology', ko: '피부과' },
  内分泌科: { ja: '内分泌科', 'zh-TW': '內分泌科', 'zh-CN': '内分泌科', en: 'Endocrinology', ko: '내분비과' },
  肿瘤科: { ja: '腫瘍科', 'zh-TW': '腫瘤科', 'zh-CN': '肿瘤科', en: 'Oncology', ko: '종양내과' },
  血液内科: { ja: '血液内科', 'zh-TW': '血液科', 'zh-CN': '血液内科', en: 'Hematology', ko: '혈액내과' },
  肾脏内科: { ja: '腎臓内科', 'zh-TW': '腎臟科', 'zh-CN': '肾脏内科', en: 'Nephrology', ko: '신장내과' },
  精神科: { ja: '精神科', 'zh-TW': '精神科', 'zh-CN': '精神科', en: 'Psychiatry', ko: '정신건강의학과' },
  康复科: { ja: 'リハビリテーション科', 'zh-TW': '復健科', 'zh-CN': '康复科', en: 'Rehabilitation', ko: '재활의학과' },
  再生医疗: { ja: '再生医療', 'zh-TW': '再生醫療', 'zh-CN': '再生医疗', en: 'Regenerative Medicine', ko: '재생의료' },
  内科: { ja: '内科', 'zh-TW': '內科', 'zh-CN': '内科', en: 'General Medicine', ko: '내과' },
};

export const SYMPTOM_SUGGESTIONS: SymptomSuggestion[] = [
  // 肿瘤（本页主场景，放最前）
  { dept: '肿瘤科', t: { ja: 'がん確定診断済み・治療相談', 'zh-TW': '已確診癌症・尋求治療', 'zh-CN': '已确诊癌症・寻求治疗', en: 'Diagnosed cancer, seeking treatment', ko: '암 확진·치료 상담' } },
  { dept: '肿瘤科', t: { ja: 'セカンドオピニオン希望', 'zh-TW': '尋求第二診療意見', 'zh-CN': '寻求第二诊疗意见', en: 'Second opinion', ko: '세컨드 오피니언' } },
  { dept: '肿瘤科', t: { ja: '腫瘍マーカー高値', 'zh-TW': '腫瘤標誌物升高', 'zh-CN': '肿瘤标志物升高', en: 'Elevated tumor markers', ko: '종양표지자 상승' } },
  { dept: '肿瘤科', t: { ja: 'リンパ節の腫れ', 'zh-TW': '淋巴結腫大', 'zh-CN': '淋巴结肿大', en: 'Swollen lymph nodes', ko: '림프절 종대' } },
  // 消化
  { dept: '消化内科', t: { ja: '胃の痛み', 'zh-TW': '胃痛', 'zh-CN': '胃痛', en: 'Stomach pain', ko: '위통' } },
  { dept: '消化内科', t: { ja: '胃もたれ・膨満感', 'zh-TW': '胃脹', 'zh-CN': '胃胀', en: 'Bloating', ko: '속 더부룩함' } },
  { dept: '消化内科', t: { ja: '胸やけ・呑酸', 'zh-TW': '胃酸逆流', 'zh-CN': '反酸烧心', en: 'Acid reflux', ko: '속쓰림' } },
  { dept: '消化内科', t: { ja: '黒色便・血便', 'zh-TW': '黑便・血便', 'zh-CN': '黑便・便血', en: 'Black or bloody stool', ko: '흑변·혈변' } },
  { dept: '消化内科', t: { ja: '腹痛', 'zh-TW': '腹痛', 'zh-CN': '腹痛', en: 'Abdominal pain', ko: '복통' } },
  { dept: '消化内科', t: { ja: '慢性の下痢', 'zh-TW': '長期腹瀉', 'zh-CN': '长期腹泻', en: 'Chronic diarrhea', ko: '만성 설사' } },
  { dept: '消化内科', t: { ja: '便秘', 'zh-TW': '便祕', 'zh-CN': '便秘', en: 'Constipation', ko: '변비' } },
  { dept: '消化内科', t: { ja: '嚥下困難', 'zh-TW': '吞嚥困難', 'zh-CN': '吞咽困难', en: 'Difficulty swallowing', ko: '삼킴 곤란' } },
  { dept: '消化内科', t: { ja: '食欲不振・体重減少', 'zh-TW': '食慾不振・消瘦', 'zh-CN': '食欲不振・消瘦', en: 'Appetite loss, weight loss', ko: '식욕부진·체중감소' } },
  { dept: '消化内科', t: { ja: '黄疸', 'zh-TW': '黃疸', 'zh-CN': '黄疸', en: 'Jaundice', ko: '황달' } },
  // 呼吸
  { dept: '呼吸内科', t: { ja: '長引く咳', 'zh-TW': '長期咳嗽', 'zh-CN': '长期咳嗽', en: 'Persistent cough', ko: '오래가는 기침' } },
  { dept: '呼吸内科', t: { ja: '血痰・喀血', 'zh-TW': '咳血', 'zh-CN': '咳血', en: 'Coughing blood', ko: '객혈' } },
  { dept: '呼吸内科', t: { ja: '息切れ・呼吸苦', 'zh-TW': '胸悶氣短', 'zh-CN': '胸闷气短', en: 'Shortness of breath', ko: '숨참' } },
  { dept: '呼吸内科', t: { ja: '肺結節（健診で指摘）', 'zh-TW': '體檢發現肺結節', 'zh-CN': '体检发现肺结节', en: 'Lung nodule found', ko: '폐결절 발견' } },
  // 循环
  { dept: '循环内科', t: { ja: '胸の痛み', 'zh-TW': '胸痛', 'zh-CN': '胸痛', en: 'Chest pain', ko: '흉통' } },
  { dept: '循环内科', t: { ja: '動悸', 'zh-TW': '心悸', 'zh-CN': '心悸', en: 'Palpitations', ko: '두근거림' } },
  { dept: '循环内科', t: { ja: '高血圧', 'zh-TW': '高血壓', 'zh-CN': '高血压', en: 'High blood pressure', ko: '고혈압' } },
  { dept: '循环内科', t: { ja: '足のむくみ', 'zh-TW': '下肢水腫', 'zh-CN': '下肢水肿', en: 'Leg swelling', ko: '다리 부종' } },
  // 神经
  { dept: '神经内科', t: { ja: '頭痛', 'zh-TW': '頭痛', 'zh-CN': '头痛', en: 'Headache', ko: '두통' } },
  { dept: '神经内科', t: { ja: 'めまい', 'zh-TW': '頭暈', 'zh-CN': '头晕', en: 'Dizziness', ko: '어지러움' } },
  { dept: '神经内科', t: { ja: '手足のしびれ', 'zh-TW': '手腳麻木', 'zh-CN': '手脚麻木', en: 'Numbness in limbs', ko: '손발 저림' } },
  { dept: '神经内科', t: { ja: 'もの忘れ', 'zh-TW': '記憶力下降', 'zh-CN': '记忆力下降', en: 'Memory decline', ko: '기억력 저하' } },
  { dept: '神经内科', t: { ja: '手のふるえ', 'zh-TW': '手抖・震顫', 'zh-CN': '手抖・震颤', en: 'Tremor', ko: '손 떨림' } },
  // 骨科
  { dept: '骨科', t: { ja: '膝の痛み', 'zh-TW': '膝蓋疼痛', 'zh-CN': '膝盖疼痛', en: 'Knee pain', ko: '무릎 통증' } },
  { dept: '骨科', t: { ja: '腰痛', 'zh-TW': '腰痛', 'zh-CN': '腰痛', en: 'Lower back pain', ko: '요통' } },
  { dept: '骨科', t: { ja: '首・肩の痛み', 'zh-TW': '頸肩疼痛', 'zh-CN': '颈肩疼痛', en: 'Neck & shoulder pain', ko: '목·어깨 통증' } },
  { dept: '骨科', t: { ja: '関節の腫れ・痛み', 'zh-TW': '關節腫痛', 'zh-CN': '关节肿痛', en: 'Joint swelling & pain', ko: '관절 통증' } },
  // 泌尿
  { dept: '泌尿外科', t: { ja: '血尿', 'zh-TW': '血尿', 'zh-CN': '血尿', en: 'Blood in urine', ko: '혈뇨' } },
  { dept: '泌尿外科', t: { ja: '頻尿・尿意切迫', 'zh-TW': '頻尿', 'zh-CN': '尿频尿急', en: 'Frequent urination', ko: '빈뇨' } },
  { dept: '泌尿外科', t: { ja: '前立腺の悩み', 'zh-TW': '攝護腺問題', 'zh-CN': '前列腺问题', en: 'Prostate issues', ko: '전립선 문제' } },
  // 妇产 / 乳腺
  { dept: '妇产科', t: { ja: '月経不順', 'zh-TW': '月經不調', 'zh-CN': '月经不调', en: 'Irregular periods', ko: '생리불순' } },
  { dept: '妇产科', t: { ja: '不妊の相談', 'zh-TW': '不孕諮詢', 'zh-CN': '不孕咨询', en: 'Fertility consultation', ko: '난임 상담' } },
  { dept: '妇产科', t: { ja: '更年期症状', 'zh-TW': '更年期症狀', 'zh-CN': '更年期症状', en: 'Menopause symptoms', ko: '갱년기 증상' } },
  { dept: '乳腺外科', t: { ja: '乳房のしこり', 'zh-TW': '乳房腫塊', 'zh-CN': '乳房肿块', en: 'Breast lump', ko: '유방 멍울' } },
  // 眼 / 耳鼻喉
  { dept: '眼科', t: { ja: '視力低下', 'zh-TW': '視力下降', 'zh-CN': '视力下降', en: 'Vision decline', ko: '시력 저하' } },
  { dept: '眼科', t: { ja: '白内障', 'zh-TW': '白內障', 'zh-CN': '白内障', en: 'Cataract', ko: '백내장' } },
  { dept: '眼科', t: { ja: '飛蚊症', 'zh-TW': '飛蚊症', 'zh-CN': '飞蚊症', en: 'Eye floaters', ko: '비문증' } },
  { dept: '耳鼻喉科', t: { ja: '耳鳴り・難聴', 'zh-TW': '耳鳴・聽力下降', 'zh-CN': '耳鸣・听力下降', en: 'Tinnitus, hearing loss', ko: '이명·난청' } },
  { dept: '耳鼻喉科', t: { ja: '声のかすれ', 'zh-TW': '聲音嘶啞', 'zh-CN': '声音嘶哑', en: 'Hoarseness', ko: '쉰 목소리' } },
  // 皮肤
  { dept: '皮肤科', t: { ja: 'ほくろの変化', 'zh-TW': '痣的變化', 'zh-CN': '痣的变化', en: 'Changing mole', ko: '점 변화' } },
  { dept: '皮肤科', t: { ja: '湿疹・皮疹', 'zh-TW': '濕疹皮疹', 'zh-CN': '湿疹皮疹', en: 'Eczema, rash', ko: '습진·발진' } },
  { dept: '皮肤科', t: { ja: '抜け毛・薄毛', 'zh-TW': '脫髮', 'zh-CN': '脱发', en: 'Hair loss', ko: '탈모' } },
  // 内分泌 / 血液 / 肾脏
  { dept: '内分泌科', t: { ja: '糖尿病', 'zh-TW': '糖尿病', 'zh-CN': '糖尿病', en: 'Diabetes', ko: '당뇨병' } },
  { dept: '内分泌科', t: { ja: '甲状腺結節', 'zh-TW': '甲狀腺結節', 'zh-CN': '甲状腺结节', en: 'Thyroid nodule', ko: '갑상선 결절' } },
  { dept: '血液内科', t: { ja: '貧血', 'zh-TW': '貧血', 'zh-CN': '贫血', en: 'Anemia', ko: '빈혈' } },
  { dept: '肾脏内科', t: { ja: '蛋白尿・腎機能異常', 'zh-TW': '蛋白尿・腎功能異常', 'zh-CN': '蛋白尿・肾功能异常', en: 'Proteinuria, kidney issues', ko: '단백뇨·신기능 이상' } },
  // 精神 / 康复 / 再生
  { dept: '精神科', t: { ja: '不眠', 'zh-TW': '失眠', 'zh-CN': '失眠', en: 'Insomnia', ko: '불면증' } },
  { dept: '精神科', t: { ja: '不安・気分の落ち込み', 'zh-TW': '焦慮抑鬱', 'zh-CN': '焦虑抑郁', en: 'Anxiety, depression', ko: '불안·우울' } },
  { dept: '康复科', t: { ja: '脳卒中後のリハビリ', 'zh-TW': '中風後復健', 'zh-CN': '中风后康复', en: 'Post-stroke rehab', ko: '뇌졸중 후 재활' } },
  { dept: '再生医疗', t: { ja: '幹細胞治療の相談', 'zh-TW': '幹細胞治療諮詢', 'zh-CN': '干细胞治疗咨询', en: 'Stem cell therapy', ko: '줄기세포 치료 상담' } },
];

/** 输入为空时展示的高频入口（按本页人群排序；按 zh-CN 词面查找，杜绝下标漂移） */
export const POPULAR_SUGGESTIONS: SymptomSuggestion[] = [
  '已确诊癌症・寻求治疗',
  '寻求第二诊疗意见',
  '胃痛',
  '体检发现肺结节',
  '乳房肿块',
  '膝盖疼痛',
  '头痛',
  '糖尿病',
].map((zh) => {
  const hit = SYMPTOM_SUGGESTIONS.find((s) => s.t['zh-CN'] === zh);
  if (!hit) throw new Error(`POPULAR_SUGGESTIONS: 词条不存在 ${zh}`);
  return hit;
});

/** 取输入框里正在敲的那个词（最后一个分隔符之后） */
export function activeToken(value: string): string {
  const parts = value.split(/[，,、;；\n]/);
  return (parts[parts.length - 1] || '').trim();
}

/** 跨语言子串匹配 */
export function filterSuggestions(token: string, limit = 8): SymptomSuggestion[] {
  const q = token.trim().toLowerCase();
  if (!q) return [];
  return SYMPTOM_SUGGESTIONS.filter((s) =>
    Object.values(s.t).some((v) => v.toLowerCase().includes(q))
  ).slice(0, limit);
}
