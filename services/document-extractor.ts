/**
 * 文档提取服务 (Document Extractor)
 *
 * 从上传的 PDF 或图片中提取文本内容，用于 AEMC Pipeline 输入。
 *
 * 策略：
 * - PDF（有可选文本）: pdf-parse 直接提取
 * - PDF（扫描件，文本量 < 50 字符）: 返回低置信度结果
 * - 图片（JPG/PNG）: GPT-4o-mini Vision OCR
 */

import OpenAI from 'openai';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const VISION_MODEL = 'openai/gpt-4o-mini';
const VISION_TIMEOUT_MS = 9_000;
const MIN_PDF_TEXT_LENGTH = 50;

export interface DocumentExtractionResult {
  text: string;
  method: 'pdf-parse' | 'gpt4o-vision';
  pageCount?: number;
  confidence: 'high' | 'medium' | 'low';
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
 * 先用 pdf-parse 尝试提取可选文本，若失败或文本过短则返回低置信度结果（不抛错）
 */
async function extractFromPDF(buffer: Buffer): Promise<DocumentExtractionResult> {
  let pdfText = '';
  let pageCount: number | undefined;

  // Strategy 1: pdf-parse
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(buffer);
    pdfText = (pdfData.text || '').trim();
    pageCount = pdfData.numpages;
  } catch (error) {
    console.warn(
      '[DocExtractor] pdf-parse failed:',
      error instanceof Error ? error.message : error
    );
  }

  // 提取到足够文本 → 高置信度
  if (pdfText.length >= MIN_PDF_TEXT_LENGTH) {
    return {
      text: pdfText,
      method: 'pdf-parse',
      pageCount,
      confidence: 'high',
    };
  }

  // 扫描件 PDF 或 pdf-parse 崩溃 → 返回低置信度（不抛错，文件已上传到 Storage）
  console.info(
    `[DocExtractor] PDF text extraction yielded ${pdfText.length} chars — returning low confidence`
  );
  return {
    text: pdfText || '（扫描件 PDF，文本提取不完整。建议改为上传各页截图 JPG/PNG 以启用 AI OCR 识别。）',
    method: 'pdf-parse',
    pageCount,
    confidence: 'low',
  };
}

/**
 * 图片/扫描件 OCR（通过 GPT-4o Vision API）
 * 永不抛错：API 调用失败时返回低置信度结果（文件已上传到 Storage，不能阻断流程）
 */
async function extractFromImage(
  buffer: Buffer,
  mimeType: string
): Promise<DocumentExtractionResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('[DocExtractor] OPENROUTER_API_KEY not configured');
    return {
      text: '（OCR 服务未配置，无法识别图片文字。请联系管理员。）',
      method: 'gpt4o-vision',
      confidence: 'low',
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
      max_tokens: 4000,
    });

    const extractedText = response.choices[0]?.message?.content?.trim();
    if (!extractedText) {
      console.warn('[DocExtractor] GPT-4o Vision returned empty response');
      return {
        text: '（AI OCR 未能识别图片内容。请确保图片清晰、文字可读，然后重新上传。）',
        method: 'gpt4o-vision',
        confidence: 'low',
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
      text: '（AI OCR 识别失败，请稍后重试或确保图片清晰可读。）',
      method: 'gpt4o-vision',
      confidence: 'low',
    };
  }
}
