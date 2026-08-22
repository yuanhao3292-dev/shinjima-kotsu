import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';
import { matchBySymptomFeatures } from '@/services/aemc/hospital-matcher';

/**
 * POST /api/hospital-match  — 病症 → 定位医院（综合治疗页原型）
 *
 * 一次轻量 LLM 把自由文本病症分诊成 科室/症状/风险，再交给现有
 * hospital-matcher（纯本地规则引擎，174 家 JTB+直营 DB）算出 top-N。
 * 不跑完整 AEMC 多 AI 管线，快且便宜。
 *
 * ⚠️ 定位为"就诊科别与医院参考"，不是医疗诊断。前端附免责声明。
 */

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'anthropic/claude-sonnet-4.5';

const DEPARTMENTS = [
  '肿瘤科', '消化内科', '消化外科', '呼吸内科', '循环内科', '心血管外科', '神经内科',
  '脑神经外科', '骨科', '整形外科', '泌尿外科', '妇产科', '乳腺外科', '眼科',
  '耳鼻喉科', '皮肤科', '内分泌科', '肾脏内科', '血液内科', '风湿免疫科', '精神科',
  '牙科', '康复科', '放射科', '再生医疗', '内科', '外科', '小儿科',
];

interface TriageOut {
  departments: string[];
  symptoms: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  chiefComplaint: string;
}

const SYS_PROMPT = `你是日本就医的分诊助手。用户会用自然语言描述病症/诉求，你要判断最相关的就诊科室。
规则：
- 只输出 JSON，形如 {"departments":["消化内科"],"symptoms":["腹痛","黑便"],"riskLevel":"medium","chiefComplaint":"上腹痛伴黑便"}
- departments 从这个列表里选 1-3 个最贴切的：${DEPARTMENTS.join('、')}
- symptoms 提取用户提到的关键症状/疾病名（原文关键词，2-5 个）
- riskLevel：明显危及生命（大出血、意识障碍、剧烈胸痛、卒中样症状等）→ emergency；较重 → high；一般 → medium；轻微/咨询 → low
- chiefComplaint：一句话概括主诉
- 绝不做诊断、不给治疗建议，只判断科室方向`;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rl = await checkRateLimit(`${clientIp}:/api/hospital-match`, RATE_LIMITS.standard);
    if (!rl.success) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const symptom: string = (body.symptom || '').toString().trim();
    const language: string = body.language || 'zh-CN';
    if (symptom.length < 2 || symptom.length > 500) {
      return NextResponse.json({ error: '请输入 2–500 字的病症描述' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: '匹配服务暂时不可用' }, { status: 503 });
    }
    const client = new OpenAI({ apiKey, baseURL: OPENROUTER_BASE_URL, timeout: 30000 });

    // 1) 轻量分诊
    let triage: TriageOut;
    try {
      const resp = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: SYS_PROMPT },
          { role: 'user', content: symptom },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
        max_tokens: 400,
      });
      // 有的模型无视 response_format，回 ```json 代码块 —— 剥壳后再解析
      let raw = (resp.choices[0]?.message?.content || '{}').trim();
      const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fence) raw = fence[1].trim();
      else { const b = raw.indexOf('{'), e = raw.lastIndexOf('}'); if (b >= 0 && e > b) raw = raw.slice(b, e + 1); }
      triage = JSON.parse(raw);
    } catch (e) {
      console.error('[hospital-match] triage failed:', e);
      return NextResponse.json({ error: '分诊失败，请稍后再试' }, { status: 502 });
    }

    if (!triage.departments?.length) {
      return NextResponse.json({ error: '未能识别就诊科室，请更具体地描述症状' }, { status: 422 });
    }

    // 2) 本地匹配 174 家
    const rec = await matchBySymptomFeatures(
      {
        departments: triage.departments,
        symptoms: triage.symptoms,
        riskLevel: triage.riskLevel,
        chiefComplaint: triage.chiefComplaint,
      },
      language
    );

    return NextResponse.json({
      triage: {
        departments: triage.departments,
        symptoms: triage.symptoms || [],
        riskLevel: triage.riskLevel,
        chiefComplaint: triage.chiefComplaint || symptom,
      },
      hospitals: rec.recommended_hospitals.slice(0, 4).map((h) => ({
        id: h.hospital_id,
        name: h.hospital_name,
        nameJa: h.hospital_name_ja,
        location: h.location,
        department: h.department,
        score: h.match_score,
        reasons: h.match_reasons,
      })),
      needsCoordinator: rec.requires_manual_coordinator_review || triage.riskLevel === 'emergency',
    });
  } catch (error) {
    console.error('[hospital-match] error:', error);
    return NextResponse.json({ error: '匹配失败，请稍后再试' }, { status: 500 });
  }
}
