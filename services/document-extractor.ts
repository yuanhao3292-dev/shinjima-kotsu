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

  throw new Error(`不支持的文件类型: ${mimeType}`);
}

/**
 * PDF 文本提取
 * 先用 pdf-parse 尝试提取可选文本，若文本过短则降级为 Vision OCR
 */
async function extractFromPDF(buffer: Buffer): Promise<DocumentExtractionResult> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');

  try {
    const pdfData = await pdfParse(buffer);
    const text = (pdfData.text || '').trim();

    if (text.length >= MIN_PDF_TEXT_LENGTH) {
      return {
        text,
        method: 'pdf-parse',
        pageCount: pdfData.numpages,
        confidence: 'high',
      };
    }

    // 文本过短 → 扫描件 PDF，无法直接 Vision OCR（PDF 二进制不能当图片发送）
    // 返回提取到的少量文本，标记低置信度
    console.info(
      `[DocExtractor] PDF text too short (${text.length} chars), scanned PDF — returning low confidence`
    );
    return {
      text: text || '（扫描件 PDF，无法提取文本。请改为上传 JPG/PNG 图片格式。）',
      method: 'pdf-parse',
      pageCount: pdfData.numpages,
      confidence: 'low',
    };
  } catch (error) {
    console.warn(
      '[DocExtractor] pdf-parse failed:',
      error instanceof Error ? error.message : error
    );
    throw new Error('PDF 解析失败，请确保文件未损坏。如为扫描件，请改为上传 JPG/PNG 图片。');
  }
}

/**
 * 图片/扫描件 OCR（通过 GPT-4o Vision API）
 */
async function extractFromImage(
  buffer: Buffer,
  mimeType: string
): Promise<DocumentExtractionResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('[DocExtractor] OPENROUTER_API_KEY not configured');
  }

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
    throw new Error('[DocExtractor] GPT-4o Vision returned empty response');
  }

  return {
    text: extractedText,
    method: 'gpt4o-vision',
    confidence: extractedText.includes('[unclear]') ? 'medium' : 'high',
  };
}
