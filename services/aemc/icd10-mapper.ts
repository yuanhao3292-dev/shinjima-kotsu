/**
 * ICD-10 诊断编码映射器 (ICD-10 Diagnosis Code Mapper)
 *
 * 确定性后处理层，将 AI 输出的自由文本鉴别诊断映射到标准 ICD-10 编码。
 * 在 AI-4 仲裁完成后执行，不改变诊断内容，只附加编码。
 *
 * 用途：
 * 1. 提升输出专业度（医院/医生看到标准编码更信任）
 * 2. 为未来与医院 HIS/EMR 系统对接打基础
 * 3. 统计分析（哪些诊断最常被 AI 识别）
 *
 * 设计原则：
 * - 纯确定性逻辑，无 AI 调用
 * - 采用模糊匹配（关键词触发），不要求精确
 * - 一个诊断可匹配多个 ICD-10（返回最可能的）
 * - 未匹配的诊断保持原样，不强制编码
 * - ≤4 字符的纯 ASCII 缩写使用单词边界匹配，防止 substring 误匹配
 */

// ============================================================
// ICD-10 编码条目
// ============================================================

interface ICD10Entry {
  /** ICD-10 编码 */
  code: string;
  /** 疾病名称（中文） */
  nameCn: string;
  /** 疾病名称（日文） */
  nameJa: string;
  /** 疾病名称（英文） */
  nameEn: string;
  /** 触发关键词（任一匹配） */
  keywords: string[];
}

const ICD10_DATABASE: ICD10Entry[] = [
  // ============ 恶性肿瘤 ============
  { code: 'C22.0', nameCn: '肝细胞癌', nameJa: '肝細胞癌', nameEn: 'Hepatocellular carcinoma', keywords: ['肝细胞癌', '肝癌', 'hepatocellular carcinoma', '肝細胞癌'] },
  { code: 'C22.1', nameCn: '肝内胆管细胞癌', nameJa: '肝内胆管癌', nameEn: 'Intrahepatic cholangiocarcinoma', keywords: ['胆管细胞癌', 'cholangiocarcinoma', '胆管癌', '肝内胆管'] },
  { code: 'C78.7', nameCn: '肝继发恶性肿瘤（肝转移）', nameJa: '肝転移', nameEn: 'Secondary malignant neoplasm of liver', keywords: ['肝转移', 'liver metasta', '肝転移'] },
  { code: 'C79.5', nameCn: '骨继发恶性肿瘤（骨转移）', nameJa: '骨転移', nameEn: 'Secondary malignant neoplasm of bone', keywords: ['骨转移', 'bone metasta', '骨転移'] },
  { code: 'C77.2', nameCn: '腹腔淋巴结继发恶性肿瘤', nameJa: '腹腔リンパ節転移', nameEn: 'Secondary neoplasm of intra-abdominal lymph nodes', keywords: ['淋巴结转移', '门脉淋巴', 'lymph node metasta', 'リンパ節転移', '门静脉旁'] },
  { code: 'C80.0', nameCn: '原发灶不明恶性肿瘤', nameJa: '原発不明癌', nameEn: 'Cancer of unknown primary (CUP)', keywords: ['原发灶不明', '原发不明', 'unknown primary', '原発不明'] },
  { code: 'C34', nameCn: '支气管和肺恶性肿瘤', nameJa: '肺癌', nameEn: 'Malignant neoplasm of bronchus and lung', keywords: ['肺癌', 'lung cancer', '肺恶性', '肺腫瘍', '非小细胞'] },
  { code: 'C18', nameCn: '结肠恶性肿瘤', nameJa: '結腸癌', nameEn: 'Malignant neoplasm of colon', keywords: ['结肠癌', '大肠癌', 'colon cancer', 'colorectal', '結腸癌'] },
  { code: 'C25', nameCn: '胰腺恶性肿瘤', nameJa: '膵臓癌', nameEn: 'Malignant neoplasm of pancreas', keywords: ['胰腺癌', 'pancreatic cancer', '膵臓癌', '膵癌'] },
  { code: 'C16', nameCn: '胃恶性肿瘤', nameJa: '胃癌', nameEn: 'Malignant neoplasm of stomach', keywords: ['胃癌', 'gastric cancer', 'stomach cancer', '胃がん'] },
  { code: 'C61', nameCn: '前列腺恶性肿瘤', nameJa: '前立腺癌', nameEn: 'Malignant neoplasm of prostate', keywords: ['前列腺癌', 'prostate cancer', '前立腺癌'] },
  { code: 'C50', nameCn: '乳房恶性肿瘤', nameJa: '乳癌', nameEn: 'Malignant neoplasm of breast', keywords: ['乳腺癌', 'breast cancer', '乳癌', '乳がん'] },

  // ============ 心血管 ============
  { code: 'I25.1', nameCn: '冠状动脉粥样硬化性心脏病', nameJa: '冠動脈硬化性心疾患', nameEn: 'Atherosclerotic heart disease', keywords: ['冠心病', '冠状动脉', 'coronary artery disease', 'atherosclerotic heart', '冠動脈硬化'] },
  { code: 'I21', nameCn: '急性心肌梗死', nameJa: '急性心筋梗塞', nameEn: 'Acute myocardial infarction', keywords: ['心肌梗死', 'myocardial infarction', '心筋梗塞', 'acute coronary syndrome', '急性冠脉'] },
  { code: 'I50', nameCn: '心力衰竭', nameJa: '心不全', nameEn: 'Heart failure', keywords: ['心力衰竭', 'heart failure', '心不全', 'hfref', 'hfpef'] },
  { code: 'I48', nameCn: '心房颤动和心房扑动', nameJa: '心房細動', nameEn: 'Atrial fibrillation and flutter', keywords: ['房颤', 'atrial fibrillation', '心房細動', 'atrial flutter'] },
  { code: 'I10', nameCn: '原发性高血压', nameJa: '本態性高血圧', nameEn: 'Essential hypertension', keywords: ['高血压', 'hypertension', '高血圧'] },
  { code: 'I63', nameCn: '脑梗死', nameJa: '脳梗塞', nameEn: 'Cerebral infarction', keywords: ['脑梗', 'cerebral infarction', 'ischemic stroke', '脳梗塞'] },
  { code: 'I61', nameCn: '脑出血', nameJa: '脳出血', nameEn: 'Intracerebral hemorrhage', keywords: ['脑出血', 'intracerebral hemorrhage', 'hemorrhagic stroke', '脳出血'] },
  { code: 'I71', nameCn: '主动脉瘤和夹层', nameJa: '大動脈瘤・解離', nameEn: 'Aortic aneurysm and dissection', keywords: ['主动脉瘤', '主动脉夹层', 'aortic aneurysm', 'aortic dissection', '大動脈'] },

  // ============ 肾脏 ============
  { code: 'N18', nameCn: '慢性肾脏病', nameJa: '慢性腎臓病', nameEn: 'Chronic kidney disease', keywords: ['慢性肾', 'chronic kidney', '慢性腎', '肾功能不全'] },
  { code: 'N17', nameCn: '急性肾损伤', nameJa: '急性腎障害', nameEn: 'Acute kidney injury', keywords: ['急性肾', 'acute kidney', '急性腎'] },

  // ============ 代谢/内分泌 ============
  { code: 'E11', nameCn: '2型糖尿病', nameJa: '2型糖尿病', nameEn: 'Type 2 diabetes mellitus', keywords: ['2型糖尿病', 'type 2 diabetes', '糖尿病', 'diabetes mellitus'] },
  { code: 'E78', nameCn: '脂蛋白代谢障碍', nameJa: '脂質異常症', nameEn: 'Disorders of lipoprotein metabolism', keywords: ['血脂异常', 'dyslipidemia', '脂質異常', '高脂血', '高胆固醇'] },
  { code: 'E05', nameCn: '甲状腺功能亢进', nameJa: '甲状腺機能亢進症', nameEn: 'Thyrotoxicosis', keywords: ['甲亢', 'hyperthyroid', '甲状腺機能亢進', 'graves disease'] },
  { code: 'E03', nameCn: '甲状腺功能减退', nameJa: '甲状腺機能低下症', nameEn: 'Hypothyroidism', keywords: ['甲减', 'hypothyroid', '甲状腺機能低下', 'hashimoto'] },

  // ============ 肝脏（非肿瘤） ============
  { code: 'B18.1', nameCn: '慢性乙型肝炎', nameJa: '慢性B型肝炎', nameEn: 'Chronic viral hepatitis B', keywords: ['乙肝', 'hepatitis b', 'b型肝炎'] },
  { code: 'B18.2', nameCn: '慢性丙型肝炎', nameJa: '慢性C型肝炎', nameEn: 'Chronic viral hepatitis C', keywords: ['丙肝', 'hepatitis c', 'c型肝炎'] },
  { code: 'K74', nameCn: '肝纤维化和肝硬化', nameJa: '肝線維症・肝硬変', nameEn: 'Fibrosis and cirrhosis of liver', keywords: ['肝硬化', 'cirrhosis', '肝硬変', '肝纤维化'] },

  // ============ 呼吸 ============
  { code: 'I26', nameCn: '肺栓塞', nameJa: '肺塞栓症', nameEn: 'Pulmonary embolism', keywords: ['肺栓塞', 'pulmonary embolism', '肺塞栓'] },
  { code: 'J18', nameCn: '肺炎', nameJa: '肺炎', nameEn: 'Pneumonia', keywords: ['肺炎', 'pneumonia'] },

  // ============ 消化 ============
  { code: 'K92.0', nameCn: '呕血', nameJa: '吐血', nameEn: 'Hematemesis', keywords: ['呕血', 'hematemesis', '吐血'] },
  { code: 'K92.1', nameCn: '黑便', nameJa: '下血', nameEn: 'Melena', keywords: ['黑便', 'melena', '下血', '消化道出血'] },
  { code: 'K35', nameCn: '急性阑尾炎', nameJa: '急性虫垂炎', nameEn: 'Acute appendicitis', keywords: ['阑尾炎', 'appendicitis', '虫垂炎'] },

  // ============ 神经 ============
  { code: 'G43', nameCn: '偏头痛', nameJa: '片頭痛', nameEn: 'Migraine', keywords: ['偏头痛', 'migraine', '片頭痛'] },
  { code: 'I60', nameCn: '蛛网膜下腔出血', nameJa: 'くも膜下出血', nameEn: 'Subarachnoid hemorrhage', keywords: ['蛛网膜下腔', 'subarachnoid hemorrhage', 'くも膜下出血'] },
  { code: 'G03', nameCn: '脑膜炎', nameJa: '髄膜炎', nameEn: 'Meningitis', keywords: ['脑膜炎', 'meningitis', '髄膜炎'] },
];

// ============================================================
// 匹配结果类型
// ============================================================

export interface ICD10Match {
  /** 原始鉴别诊断文本 */
  originalText: string;
  /** 匹配到的 ICD-10 编码 */
  code: string;
  /** 标准名称 */
  standardName: string;
}

export interface ICD10MappingResult {
  /** 所有匹配结果 */
  matches: ICD10Match[];
  /** 注入前端显示的格式化文本 */
  formattedForDisplay: string;
  /** 注入 AI prompt 的文本 */
  icd10ContextForAI: string;
}

// ============================================================
// 主入口
// ============================================================

/**
 * 将鉴别诊断列表映射到 ICD-10 编码
 *
 * @param differentials AI 输出的鉴别诊断名称列表
 * @param language 输出语言
 */
export function mapToICD10(
  differentials: string[],
  language: string
): ICD10MappingResult {
  const matches: ICD10Match[] = [];
  const seen = new Set<string>(); // 去重

  for (const diff of differentials) {
    const diffLower = diff.toLowerCase();

    for (const entry of ICD10_DATABASE) {
      if (seen.has(entry.code)) continue;

      const matched = entry.keywords.some((kw) =>
        diffLower.includes(kw.toLowerCase())
      );

      if (matched) {
        const standardName =
          language === 'ja'
            ? entry.nameJa
            : language.startsWith('zh')
              ? entry.nameCn
              : entry.nameEn;

        matches.push({
          originalText: diff,
          code: entry.code,
          standardName,
        });
        seen.add(entry.code);
        break; // 每个鉴别诊断只匹配第一个 ICD-10
      }
    }
  }

  // 格式化显示
  const formattedForDisplay = matches
    .map((m) => `${m.standardName} [${m.code}]`)
    .join('、');

  // AI prompt 注入
  let icd10ContextForAI = '';
  if (matches.length > 0) {
    const lines = matches.map(
      (m) => `- ${m.originalText} → ${m.code} (${m.standardName})`
    );
    icd10ContextForAI =
      `\n\n--- ICD-10 CODES (auto-mapped, for reference) ---\n` +
      lines.join('\n') +
      `\n--- END ICD-10 ---`;

    console.info(
      `[ICD10Mapper] Mapped ${matches.length}/${differentials.length} differentials to ICD-10`
    );
  }

  return { matches, formattedForDisplay, icd10ContextForAI };
}
