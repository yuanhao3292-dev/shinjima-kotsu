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
  /** 匹配别名（口语/俗称/近义词，不展示只参与匹配），如 牛皮癣→银屑病 */
  k?: string[];
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
  脑神经外科: { ja: '脳神経外科', 'zh-TW': '腦神經外科', 'zh-CN': '脑神经外科', en: 'Neurosurgery', ko: '신경외과' },
  风湿免疫科: { ja: 'リウマチ・膠原病科', 'zh-TW': '風濕免疫科', 'zh-CN': '风湿免疫科', en: 'Rheumatology', ko: '류마티스내과' },
};

export const SYMPTOM_SUGGESTIONS: SymptomSuggestion[] = [
  // 肿瘤（本页主场景，放最前）
  { dept: '肿瘤科', t: { ja: 'がん確定診断済み・治療相談', 'zh-TW': '已確診癌症・尋求治療', 'zh-CN': '已确诊癌症・寻求治疗', en: 'Diagnosed cancer, seeking treatment', ko: '암 확진·치료 상담' } },
  { dept: '肿瘤科', t: { ja: 'セカンドオピニオン希望', 'zh-TW': '尋求第二診療意見', 'zh-CN': '寻求第二诊疗意见', en: 'Second opinion', ko: '세컨드 오피니언' } },
  { dept: '肿瘤科', t: { ja: '腫瘍マーカー高値', 'zh-TW': '腫瘤標誌物升高', 'zh-CN': '肿瘤标志物升高', en: 'Elevated tumor markers', ko: '종양표지자 상승' } },
  { dept: '肿瘤科', t: { ja: 'リンパ節の腫れ', 'zh-TW': '淋巴結腫大', 'zh-CN': '淋巴结肿大', en: 'Swollen lymph nodes', ko: '림프절 종대' } },
  // 常见癌种（本页核心人群会直接打癌种名）
  { dept: '肿瘤科', t: { ja: '肺がん', 'zh-TW': '肺癌', 'zh-CN': '肺癌', en: 'Lung cancer', ko: '폐암' } },
  { dept: '肿瘤科', t: { ja: '胃がん', 'zh-TW': '胃癌', 'zh-CN': '胃癌', en: 'Stomach cancer', ko: '위암' } },
  { dept: '肿瘤科', t: { ja: '肝臓がん', 'zh-TW': '肝癌', 'zh-CN': '肝癌', en: 'Liver cancer', ko: '간암' } },
  { dept: '肿瘤科', t: { ja: '大腸がん', 'zh-TW': '大腸癌', 'zh-CN': '大肠癌', en: 'Colorectal cancer', ko: '대장암' }, k: ['直肠癌', '结肠癌', '直腸癌', '結腸癌'] },
  { dept: '肿瘤科', t: { ja: '食道がん', 'zh-TW': '食道癌', 'zh-CN': '食道癌', en: 'Esophageal cancer', ko: '식도암' } },
  { dept: '肿瘤科', t: { ja: 'すい臓がん', 'zh-TW': '胰臟癌', 'zh-CN': '胰腺癌', en: 'Pancreatic cancer', ko: '췌장암' } },
  { dept: '肿瘤科', t: { ja: '甲状腺がん', 'zh-TW': '甲狀腺癌', 'zh-CN': '甲状腺癌', en: 'Thyroid cancer', ko: '갑상선암' } },
  { dept: '乳腺外科', t: { ja: '乳がん', 'zh-TW': '乳癌', 'zh-CN': '乳腺癌', en: 'Breast cancer', ko: '유방암' } },
  { dept: '泌尿外科', t: { ja: '前立腺がん', 'zh-TW': '攝護腺癌', 'zh-CN': '前列腺癌', en: 'Prostate cancer', ko: '전립선암' } },
  { dept: '妇产科', t: { ja: '子宮頸がん・子宮がん', 'zh-TW': '子宮頸癌・子宮癌', 'zh-CN': '宫颈癌・子宫癌', en: 'Cervical / uterine cancer', ko: '자궁경부암·자궁암' } },
  { dept: '妇产科', t: { ja: '卵巣がん', 'zh-TW': '卵巢癌', 'zh-CN': '卵巢癌', en: 'Ovarian cancer', ko: '난소암' } },
  { dept: '血液内科', t: { ja: '白血病・リンパ腫', 'zh-TW': '白血病・淋巴瘤', 'zh-CN': '白血病・淋巴瘤', en: 'Leukemia, lymphoma', ko: '백혈병·림프종' } },
  // 消化
  { dept: '消化内科', t: { ja: '胃の痛み', 'zh-TW': '胃痛', 'zh-CN': '胃痛', en: 'Stomach pain', ko: '위통' } },
  { dept: '消化内科', t: { ja: '胃もたれ・膨満感', 'zh-TW': '胃脹', 'zh-CN': '胃胀', en: 'Bloating', ko: '속 더부룩함' } },
  { dept: '消化内科', t: { ja: '胸やけ・呑酸', 'zh-TW': '胃酸逆流', 'zh-CN': '反酸烧心', en: 'Acid reflux', ko: '속쓰림' } },
  { dept: '消化内科', t: { ja: '黒色便・血便', 'zh-TW': '黑便・血便', 'zh-CN': '黑便・便血', en: 'Black or bloody stool', ko: '흑변·혈변' } },
  { dept: '消化内科', t: { ja: '腹痛', 'zh-TW': '腹痛', 'zh-CN': '腹痛', en: 'Abdominal pain', ko: '복통' } },
  { dept: '消化内科', t: { ja: '慢性の下痢', 'zh-TW': '長期腹瀉', 'zh-CN': '长期腹泻', en: 'Chronic diarrhea', ko: '만성 설사' }, k: ['拉肚子'] },
  { dept: '消化内科', t: { ja: '便秘', 'zh-TW': '便祕', 'zh-CN': '便秘', en: 'Constipation', ko: '변비' } },
  { dept: '消化内科', t: { ja: '嚥下困難', 'zh-TW': '吞嚥困難', 'zh-CN': '吞咽困难', en: 'Difficulty swallowing', ko: '삼킴 곤란' } },
  { dept: '消化内科', t: { ja: '食欲不振・体重減少', 'zh-TW': '食慾不振・消瘦', 'zh-CN': '食欲不振・消瘦', en: 'Appetite loss, weight loss', ko: '식욕부진·체중감소' } },
  { dept: '消化内科', t: { ja: '黄疸', 'zh-TW': '黃疸', 'zh-CN': '黄疸', en: 'Jaundice', ko: '황달' } },
  // 肝胆胰
  { dept: '消化内科', t: { ja: '肝機能異常（健診で指摘）', 'zh-TW': '體檢發現肝功能異常', 'zh-CN': '体检发现肝功能异常', en: 'Abnormal liver function', ko: '간기능 이상' } },
  { dept: '消化内科', t: { ja: '脂肪肝', 'zh-TW': '脂肪肝', 'zh-CN': '脂肪肝', en: 'Fatty liver', ko: '지방간' } },
  { dept: '消化内科', t: { ja: 'B型肝炎・肝硬変', 'zh-TW': 'B肝・肝硬化', 'zh-CN': '乙肝・肝硬化', en: 'Hepatitis B, cirrhosis', ko: 'B형 간염·간경변' } },
  { dept: '消化内科', t: { ja: '胆石・胆のうポリープ', 'zh-TW': '膽結石・膽息肉', 'zh-CN': '胆结石・胆息肉', en: 'Gallstones, gallbladder polyps', ko: '담석·담낭 용종' } },
  { dept: '消化内科', t: { ja: 'ピロリ菌感染', 'zh-TW': '幽門螺旋桿菌感染', 'zh-CN': '幽门螺杆菌感染', en: 'H. pylori infection', ko: '헬리코박터균 감염' } },
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
  { dept: '泌尿外科', t: { ja: '血尿', 'zh-TW': '血尿', 'zh-CN': '血尿', en: 'Blood in urine', ko: '혈뇨' }, k: ['尿血'] },
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
  { dept: '皮肤科', t: { ja: '抜け毛・薄毛', 'zh-TW': '脫髮', 'zh-CN': '脱发', en: 'Hair loss', ko: '탈모' }, k: ['掉头发', '掉髮'] },
  // 内分泌 / 血液 / 肾脏
  { dept: '内分泌科', t: { ja: '糖尿病', 'zh-TW': '糖尿病', 'zh-CN': '糖尿病', en: 'Diabetes', ko: '당뇨병' }, k: ['血糖'] },
  { dept: '内分泌科', t: { ja: '甲状腺結節', 'zh-TW': '甲狀腺結節', 'zh-CN': '甲状腺结节', en: 'Thyroid nodule', ko: '갑상선 결절' } },
  { dept: '血液内科', t: { ja: '貧血', 'zh-TW': '貧血', 'zh-CN': '贫血', en: 'Anemia', ko: '빈혈' } },
  { dept: '肾脏内科', t: { ja: '蛋白尿・腎機能異常', 'zh-TW': '蛋白尿・腎功能異常', 'zh-CN': '蛋白尿・肾功能异常', en: 'Proteinuria, kidney issues', ko: '단백뇨·신기능 이상' } },
  // 精神 / 康复 / 再生
  { dept: '精神科', t: { ja: '不眠', 'zh-TW': '失眠', 'zh-CN': '失眠', en: 'Insomnia', ko: '불면증' }, k: ['睡不着', '睡不著'] },
  { dept: '精神科', t: { ja: '不安・気分の落ち込み', 'zh-TW': '焦慮抑鬱', 'zh-CN': '焦虑抑郁', en: 'Anxiety, depression', ko: '불안·우울' } },
  { dept: '康复科', t: { ja: '脳卒中後のリハビリ', 'zh-TW': '中風後復健', 'zh-CN': '中风后康复', en: 'Post-stroke rehab', ko: '뇌졸중 후 재활' } },
  { dept: '再生医疗', t: { ja: '幹細胞治療の相談', 'zh-TW': '幹細胞治療諮詢', 'zh-CN': '干细胞治疗咨询', en: 'Stem cell therapy', ko: '줄기세포 치료 상담' } },
  // ---- 二期补充：癌种（续） ----
  { dept: '肿瘤科', t: { ja: '上咽頭がん', 'zh-TW': '鼻咽癌', 'zh-CN': '鼻咽癌', en: 'Nasopharyngeal cancer', ko: '비인두암' } },
  { dept: '脑神经外科', t: { ja: '脳腫瘍・神経膠腫', 'zh-TW': '腦瘤・膠質瘤', 'zh-CN': '脑瘤・胶质瘤', en: 'Brain tumor, glioma', ko: '뇌종양' } },
  { dept: '泌尿外科', t: { ja: '腎臓がん', 'zh-TW': '腎癌', 'zh-CN': '肾癌', en: 'Kidney cancer', ko: '신장암' } },
  { dept: '泌尿外科', t: { ja: '膀胱がん', 'zh-TW': '膀胱癌', 'zh-CN': '膀胱癌', en: 'Bladder cancer', ko: '방광암' } },
  { dept: '肿瘤科', t: { ja: '胆管がん・胆のうがん', 'zh-TW': '膽管癌・膽囊癌', 'zh-CN': '胆管癌・胆囊癌', en: 'Bile duct / gallbladder cancer', ko: '담관암·담낭암' } },
  { dept: '皮肤科', t: { ja: 'メラノーマ・皮膚がん', 'zh-TW': '黑色素瘤・皮膚癌', 'zh-CN': '黑色素瘤・皮肤癌', en: 'Melanoma, skin cancer', ko: '흑색종·피부암' } },
  { dept: '肿瘤科', t: { ja: 'がんの骨転移', 'zh-TW': '癌症骨轉移', 'zh-CN': '癌症骨转移', en: 'Bone metastasis', ko: '암 골전이' }, k: ['转移', '轉移'] },
  { dept: '血液内科', t: { ja: '多発性骨髄腫', 'zh-TW': '多發性骨髓瘤', 'zh-CN': '多发性骨髓瘤', en: 'Multiple myeloma', ko: '다발성 골수종' } },
  // ---- 先进治疗方式（本页卖点，用户会直接搜疗法名） ----
  { dept: '肿瘤科', t: { ja: '陽子線・重粒子線治療', 'zh-TW': '質子・重粒子治療', 'zh-CN': '质子・重离子治疗', en: 'Proton / heavy-ion therapy', ko: '양성자·중입자 치료' }, k: ['重离子', '質子'] },
  { dept: '肿瘤科', t: { ja: '光免疫療法', 'zh-TW': '光免疫療法', 'zh-CN': '光免疫疗法', en: 'Photoimmunotherapy', ko: '광면역요법' } },
  { dept: '肿瘤科', t: { ja: 'BNCT（ホウ素中性子捕捉療法）', 'zh-TW': 'BNCT 硼中子治療', 'zh-CN': 'BNCT 硼中子俘获治疗', en: 'BNCT (boron neutron capture)', ko: 'BNCT 붕소중성자치료' }, k: ['硼中子'] },
  { dept: '肿瘤科', t: { ja: 'CAR-T・免疫細胞療法', 'zh-TW': 'CAR-T・免疫細胞治療', 'zh-CN': 'CAR-T・免疫细胞治疗', en: 'CAR-T, immune cell therapy', ko: 'CAR-T·면역세포치료' }, k: ['免疫治疗', '免疫治療'] },
  // ---- 体检筛查（赴日就医高频入口） ----
  { dept: '内科', t: { ja: '人間ドック（精密健診）', 'zh-TW': '全面健檢・精密健檢', 'zh-CN': '全面体检・精密体检', en: 'Comprehensive health screening', ko: '종합검진' }, k: ['体检', '健診'] },
  { dept: '内科', t: { ja: 'PET-CT がん検診', 'zh-TW': 'PET-CT 癌症篩查', 'zh-CN': 'PET-CT 癌症筛查', en: 'PET-CT cancer screening', ko: 'PET-CT 암 검진' }, k: ['petct', 'pet'] },
  { dept: '消化内科', t: { ja: '胃・大腸内視鏡検査', 'zh-TW': '胃腸鏡檢查', 'zh-CN': '胃肠镜检查', en: 'Gastroscopy & colonoscopy', ko: '위·대장 내시경' }, k: ['胃镜', '肠镜', '胃鏡', '腸鏡', '内视镜', '內視鏡'] },
  // ---- 二期补充：高频症状与慢病 ----
  { dept: '内科', t: { ja: '原因不明の発熱', 'zh-TW': '不明原因發燒', 'zh-CN': '不明原因发热', en: 'Unexplained fever', ko: '원인불명 발열' }, k: ['发烧'] },
  { dept: '内科', t: { ja: 'だるさ・疲れやすい', 'zh-TW': '容易疲勞', 'zh-CN': '乏力・容易疲劳', en: 'Fatigue', ko: '피로감' } },
  { dept: '呼吸内科', t: { ja: 'いびき・睡眠時無呼吸', 'zh-TW': '打鼾・睡眠呼吸中止', 'zh-CN': '打鼾・睡眠呼吸暂停', en: 'Snoring, sleep apnea', ko: '코골이·수면무호흡' }, k: ['打呼噜'] },
  { dept: '呼吸内科', t: { ja: '喘息', 'zh-TW': '氣喘', 'zh-CN': '哮喘', en: 'Asthma', ko: '천식' } },
  { dept: '循环内科', t: { ja: '狭心症・ステント術後', 'zh-TW': '冠心病・支架術後', 'zh-CN': '冠心病・支架术后', en: 'Coronary disease, post-stent', ko: '관상동맥질환·스텐트 시술 후' }, k: ['心脏病', '心臟病', '心肌梗塞'] },
  { dept: '循环内科', t: { ja: '不整脈・心房細動', 'zh-TW': '心律不整・房顫', 'zh-CN': '心律不齐・房颤', en: 'Arrhythmia, AFib', ko: '부정맥·심방세동' } },
  { dept: '神经内科', t: { ja: 'パーキンソン病', 'zh-TW': '帕金森氏症', 'zh-CN': '帕金森病', en: "Parkinson's disease", ko: '파킨슨병' } },
  { dept: '神经内科', t: { ja: '認知症・アルツハイマー', 'zh-TW': '失智症・阿茲海默', 'zh-CN': '认知症・阿尔茨海默', en: "Dementia, Alzheimer's", ko: '치매·알츠하이머' }, k: ['老年痴呆', '痴呆'] },
  { dept: '神经内科', t: { ja: 'てんかん', 'zh-TW': '癲癇', 'zh-CN': '癫痫', en: 'Epilepsy', ko: '뇌전증' }, k: ['羊癫疯'] },
  { dept: '脑神经外科', t: { ja: '脳梗塞・脳出血', 'zh-TW': '腦梗塞・腦出血', 'zh-CN': '脑梗・脑出血', en: 'Stroke, brain hemorrhage', ko: '뇌경색·뇌출혈' }, k: ['脑中风', '腦中風', '脑血管'] },
  { dept: '骨科', t: { ja: '椎間板ヘルニア', 'zh-TW': '椎間盤突出', 'zh-CN': '椎间盘突出', en: 'Herniated disc', ko: '추간판 탈출증' }, k: ['腰椎', '颈椎', '頸椎', '허리디스크'] },
  { dept: '骨科', t: { ja: '大腿骨頭壊死', 'zh-TW': '股骨頭壞死', 'zh-CN': '股骨头坏死', en: 'Femoral head necrosis', ko: '대퇴골두 괴사' } },
  { dept: '骨科', t: { ja: '骨粗しょう症', 'zh-TW': '骨質疏鬆', 'zh-CN': '骨质疏松', en: 'Osteoporosis', ko: '골다공증' } },
  { dept: '风湿免疫科', t: { ja: '痛風', 'zh-TW': '痛風', 'zh-CN': '痛风', en: 'Gout', ko: '통풍' }, k: ['尿酸'] },
  { dept: '风湿免疫科', t: { ja: '関節リウマチ', 'zh-TW': '類風濕性關節炎', 'zh-CN': '类风湿关节炎', en: 'Rheumatoid arthritis', ko: '류마티스 관절염' }, k: ['风湿', '風濕'] },
  { dept: '泌尿外科', t: { ja: '腎結石・尿路結石', 'zh-TW': '腎結石', 'zh-CN': '肾结石', en: 'Kidney stones', ko: '신장결석·요로결석' }, k: ['尿路结石', '尿路結石'] },
  { dept: '妇产科', t: { ja: '子宮筋腫', 'zh-TW': '子宮肌瘤', 'zh-CN': '子宫肌瘤', en: 'Uterine fibroids', ko: '자궁근종' } },
  { dept: '妇产科', t: { ja: '卵巣のう腫', 'zh-TW': '卵巢囊腫', 'zh-CN': '卵巢囊肿', en: 'Ovarian cyst', ko: '난소낭종' } },
  { dept: '妇产科', t: { ja: 'HPV感染・子宮頸部異形成', 'zh-TW': 'HPV 感染・子宮頸病變', 'zh-CN': 'HPV 感染・宫颈病变', en: 'HPV, cervical dysplasia', ko: 'HPV 감염·자궁경부 이형성' } },
  { dept: '眼科', t: { ja: '緑内障', 'zh-TW': '青光眼', 'zh-CN': '青光眼', en: 'Glaucoma', ko: '녹내장' } },
  { dept: '眼科', t: { ja: '加齢黄斑変性・眼底疾患', 'zh-TW': '黃斑部病變', 'zh-CN': '黄斑变性・眼底病', en: 'Macular degeneration', ko: '황반변성' } },
  { dept: '耳鼻喉科', t: { ja: '鼻づまり・副鼻腔炎', 'zh-TW': '鼻塞・鼻竇炎', 'zh-CN': '鼻塞・鼻窦炎', en: 'Sinusitis, nasal congestion', ko: '축농증·코막힘' } },
  { dept: '皮肤科', t: { ja: '乾癬', 'zh-TW': '乾癬', 'zh-CN': '银屑病', en: 'Psoriasis', ko: '건선' }, k: ['牛皮癣', '牛皮癬'] },
  { dept: '皮肤科', t: { ja: '白斑（尋常性白斑）', 'zh-TW': '白斑症', 'zh-CN': '白癜风', en: 'Vitiligo', ko: '백반증' } },
  { dept: '内分泌科', t: { ja: '甲状腺機能亢進症・低下症', 'zh-TW': '甲亢・甲減', 'zh-CN': '甲亢・甲减', en: 'Hyper / hypothyroidism', ko: '갑상선 기능 항진·저하' } },
  { dept: '内分泌科', t: { ja: '肥満・減量相談', 'zh-TW': '肥胖・減重', 'zh-CN': '肥胖・减重', en: 'Obesity, weight management', ko: '비만·체중감량' }, k: ['减肥', '減肥'] },
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

/** 跨语言子串匹配（词面 + 别名） */
export function filterSuggestions(token: string, limit = 8): SymptomSuggestion[] {
  const q = token.trim().toLowerCase();
  if (!q) return [];
  return SYMPTOM_SUGGESTIONS.filter(
    (s) =>
      Object.values(s.t).some((v) => v.toLowerCase().includes(q)) ||
      (s.k ?? []).some((v) => v.toLowerCase().includes(q))
  ).slice(0, limit);
}
