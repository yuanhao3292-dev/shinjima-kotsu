/**
 * 文档提取服务 (Document Extractor)
 *
 * 从上传的 PDF 或图片中提取文本内容，用于 AEMC Pipeline 输入。
 *
 * 策略：
 * - PDF（有可选文本）: pdf-parse 直接提取（快速，免费）
 * - PDF（扫描件，pdf-parse < 50 字符）: Gemini 2.5 Flash 原生 PDF OCR
 * - 图片（JPG/PNG）: GPT-4o-mini Vision OCR
 *
 * 设计原则：整条链路永不 throw，所有失败路径返回 low confidence 结果。
 */

import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const VISION_MODEL = 'openai/gpt-4o-mini';
const GEMINI_MODEL = 'gemini-2.5-flash';
const VISION_TIMEOUT_MS = 30_000; // 30s — 复杂医学报告图片 OCR 需要更长时间
const GEMINI_OCR_TIMEOUT_MS = 45_000; // 45s — 多页医学报告（含表格/图表）需要更长处理时间
const MIN_PDF_TEXT_LENGTH = 50;

export interface DocumentExtractionResult {
  text: string;
  method: 'pdf-parse' | 'gpt4o-vision' | 'gemini-ocr';
  pageCount?: number;
  confidence: 'high' | 'medium' | 'low';
  /** 提取失败时的用户友好提示（与 text 分离，防止错误信息被当作医学数据） */
  errorMessage?: string;
}

/**
 * 统一入口：根据文件类型自动选择提取方法
 */
export async function extractDocument(
  buffer: Buffer,
  mimeType: string
): Promise<DocumentExtractionResult> {
  if (mimeType === 'application/pdf') {
    return extractFromPDF(buffer);
  }

  if (mimeType.startsWith('image/')) {
    return extractFromImage(buffer, mimeType);
  }

  // 防御性：API 路由已校验 MIME 类型，此处不应到达。但不抛错，返回低置信度。
  console.error(`[DocExtractor] Unsupported MIME type reached extractor: ${mimeType}`);
  return {
    text: '',
    method: 'pdf-parse',
    confidence: 'low',
  };
}

/**
 * PDF 文本提取
 * 1. pdf-parse（快速提取可选文本）
 * 2. Gemini 2.5 Flash 原生 PDF OCR（扫描件降级）
 */
async function extractFromPDF(buffer: Buffer): Promise<DocumentExtractionResult> {
  let pdfText = '';
  let pageCount: number | undefined;

  // Strategy 1: pdf-parse（免费，毫秒级）
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(buffer);
    pdfText = (pdfData.text || '').trim();
    pageCount = pdfData.numpages;
    console.info(`[DocExtractor] pdf-parse: ${pdfText.length} chars, ${pageCount} pages`);
  } catch (error) {
    console.warn(
      '[DocExtractor] pdf-parse failed:',
      error instanceof Error ? error.message : error
    );
  }

  // 提取到足够文本 → 高置信度，直接返回
  if (pdfText.length >= MIN_PDF_TEXT_LENGTH) {
    console.info(`[DocExtractor] pdf-parse success: ${pdfText.length} chars (threshold: ${MIN_PDF_TEXT_LENGTH})`);
    return {
      text: pdfText,
      method: 'pdf-parse',
      pageCount,
      confidence: 'high',
    };
  }

  // Strategy 2: Gemini 2.5 Flash 原生 PDF OCR（扫描件/pdf-parse 崩溃时）
  console.info(
    `[DocExtractor] pdf-parse yielded ${pdfText.length} chars — falling back to Gemini OCR`
  );
  const geminiResult = await extractPdfWithGemini(buffer);
  if (geminiResult) {
    return {
      ...geminiResult,
      pageCount: pageCount ?? geminiResult.pageCount,
    };
  }

  // 两个策略都失败 → 低置信度
  // [SAFETY-FIX] text 保持为空或原始提取内容，错误信息放在 errorMessage
  // 防止错误提示文本被下游 AEMC Pipeline 当作医学数据分析
  return {
    text: pdfText || '',
    method: 'pdf-parse',
    pageCount,
    confidence: 'low',
    errorMessage: '（PDF 文本提取失败。建议改为上传各页截图 JPG/PNG 以重试。）',
  };
}

/**
 * Gemini 2.5 Flash 原生 PDF OCR
 * 直接将 PDF 二进制发送给 Gemini，无需转为图片。
 * 返回 null 表示失败（调用方负责降级）。
 */
async function extractPdfWithGemini(
  buffer: Buffer
): Promise<DocumentExtractionResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[DocExtractor] GEMINI_API_KEY not configured — skipping Gemini OCR');
    return null;
  }

  const pdfSizeKB = Math.round(buffer.length / 1024);
  console.info(`[DocExtractor] Gemini OCR starting — PDF size: ${pdfSizeKB}KB`);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64 = buffer.toString('base64');

    // 超时控制：防止大 PDF 导致 Vercel 504
    const geminiStartTime = Date.now();
    const geminiPromise = ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64,
              },
            },
            {
              text: `Extract ALL text from this medical document PDF.

Rules:
1. Preserve the original structure (headers, sections, tables) as plain text
2. For tables, use tab-separated columns with headers
3. Include ALL numbers, dates, units, and reference ranges exactly as printed
4. Include patient name, date of birth, examination date, and hospital/clinic name
5. Mark any text you cannot read clearly as [unclear]
6. Output in the ORIGINAL language of the document (do not translate)
7. Return ONLY the extracted text, no commentary or explanation`,
            },
          ],
        },
      ],
    });

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), GEMINI_OCR_TIMEOUT_MS)
    );
    const response = await Promise.race([geminiPromise, timeoutPromise]);
    const geminiElapsedMs = Date.now() - geminiStartTime;

    if (!response) {
      console.warn(`[DocExtractor] Gemini OCR timed out after ${geminiElapsedMs}ms (limit: ${GEMINI_OCR_TIMEOUT_MS}ms) — PDF: ${pdfSizeKB}KB`);
      return null;
    }

    const extractedText = response.text?.trim();
    if (!extractedText || extractedText.length < MIN_PDF_TEXT_LENGTH) {
      console.warn(
        `[DocExtractor] Gemini returned insufficient text (${extractedText?.length ?? 0} chars) in ${geminiElapsedMs}ms — PDF: ${pdfSizeKB}KB`
      );
      return null;
    }

    console.info(`[DocExtractor] Gemini OCR success: ${extractedText.length} chars in ${geminiElapsedMs}ms — PDF: ${pdfSizeKB}KB`);
    return {
      text: extractedText,
      method: 'gemini-ocr',
      confidence: extractedText.includes('[unclear]') ? 'medium' : 'high',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.constructor.name : 'Unknown';
    console.error(
      `[DocExtractor] Gemini OCR failed — type: ${errorName}, message: ${errorMsg}, PDF: ${pdfSizeKB}KB`
    );
    return null;
  }
}

/**
 * 图片/扫描件 OCR
 * 优先使用 Gemini 2.5 Flash（更快，中文医学文档更好）
 * 备选使用 GPT-4o-mini Vision
 * 永不抛错：API 调用失败时返回低置信度结果
 */
async function extractFromImage(
  buffer: Buffer,
  mimeType: string
): Promise<DocumentExtractionResult> {
  const imageSizeKB = Math.round(buffer.length / 1024);
  console.info(`[DocExtractor] Image OCR starting — size: ${imageSizeKB}KB, type: ${mimeType}`);

  // Strategy 1: Gemini 2.5 Flash（优先 — 中文/日文医学文档更优）
  const geminiResult = await extractImageWithGemini(buffer, mimeType);
  if (geminiResult) {
    return geminiResult;
  }

  // Strategy 2: GPT-4o-mini Vision（备选）
  return extractImageWithVision(buffer, mimeType);
}

/**
 * Gemini 2.5 Flash 图片 OCR
 * 直接发送图片二进制给 Gemini，支持中日英多语言医学文档
 */
async function extractImageWithGemini(
  buffer: Buffer,
  mimeType: string
): Promise<DocumentExtractionResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[DocExtractor] GEMINI_API_KEY not configured — skipping Gemini image OCR');
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64 = buffer.toString('base64');

    const geminiStartTime = Date.now();
    const geminiPromise = ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
            {
              text: `Extract ALL text from this medical document image.

Rules:
1. Preserve the original structure (headers, sections, tables) as plain text
2. For tables, use tab-separated columns with headers
3. Include ALL numbers, dates, units, and reference ranges exactly as printed
4. Include patient name, date of birth, examination date, and hospital/clinic name
5. Mark any text you cannot read clearly as [unclear]
6. Output in the ORIGINAL language of the document (do not translate)
7. Return ONLY the extracted text, no commentary or explanation`,
            },
          ],
        },
      ],
    });

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), GEMINI_OCR_TIMEOUT_MS)
    );
    const response = await Promise.race([geminiPromise, timeoutPromise]);
    const elapsedMs = Date.now() - geminiStartTime;

    if (!response) {
      console.warn(`[DocExtractor] Gemini image OCR timed out after ${elapsedMs}ms`);
      return null;
    }

    const extractedText = response.text?.trim();
    if (!extractedText || extractedText.length < MIN_PDF_TEXT_LENGTH) {
      console.warn(
        `[DocExtractor] Gemini image OCR insufficient text (${extractedText?.length ?? 0} chars) in ${elapsedMs}ms`
      );
      return null;
    }

    console.info(`[DocExtractor] Gemini image OCR success: ${extractedText.length} chars in ${elapsedMs}ms`);
    return {
      text: extractedText,
      method: 'gemini-ocr',
      confidence: extractedText.includes('[unclear]') ? 'medium' : 'high',
    };
  } catch (error) {
    console.error(
      '[DocExtractor] Gemini image OCR failed:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * GPT-4o-mini Vision OCR（备选方案）
 * 永不抛错：API 调用失败时返回低置信度结果
 */
async function extractImageWithVision(
  buffer: Buffer,
  mimeType: string
): Promise<DocumentExtractionResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('[DocExtractor] OPENROUTER_API_KEY not configured');
    return {
      text: '',
      method: 'gpt4o-vision',
      confidence: 'low',
      errorMessage: '（OCR 服务未配置，无法识别图片文字。请联系管理员。）',
    };
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: OPENROUTER_BASE_URL,
      timeout: VISION_TIMEOUT_MS,
    });

    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const response = await client.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a medical document OCR specialist. Extract ALL text from the uploaded medical document image.

Rules:
1. Preserve the original structure (headers, tables, lists) as plain text
2. For tables, use tab-separated columns
3. Include ALL numbers, dates, units, and reference ranges
4. Mark any text you cannot read clearly as [unclear]
5. Output in the ORIGINAL language of the document (do not translate)
6. If the image is not a medical document, describe what you see and note it is not a medical document`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all text from this medical document. Return only the extracted text, no commentary.',
            },
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 8000,
    });

    const extractedText = response.choices[0]?.message?.content?.trim();
    if (!extractedText) {
      console.warn('[DocExtractor] GPT-4o Vision returned empty response');
      return {
        text: '',
        method: 'gpt4o-vision',
        confidence: 'low',
        errorMessage: '（AI OCR 未能识别图片内容。请确保图片清晰、文字可读，然后重新上传。）',
      };
    }

    return {
      text: extractedText,
      method: 'gpt4o-vision',
      confidence: extractedText.includes('[unclear]') ? 'medium' : 'high',
    };
  } catch (error) {
    console.error(
      '[DocExtractor] Vision OCR failed:',
      error instanceof Error ? error.message : error
    );
    return {
      text: '',
      method: 'gpt4o-vision',
      confidence: 'low',
      errorMessage: '（AI OCR 识别失败，请稍后重试或确保图片清晰可读。）',
    };
  }
}
