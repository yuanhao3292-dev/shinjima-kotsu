/**
 * AEMC B2B API — Medical Triage Endpoint
 *
 * POST /api/v1/medical-triage
 *
 * Public API for external partners to access AI medical triage.
 * Requires API key authentication (Bearer nk_live_XXX).
 *
 * Input:  { symptoms, age?, gender?, medicalHistory?, medications?, language? }
 * Output: { riskLevel, departments, recommendedTests, summary, healthScore, confidence }
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAPIKey, logAPIUsage } from '@/lib/utils/api-key-auth';
import { getClientIp } from '@/lib/utils/rate-limiter';
import { runAEMCPipeline, type AEMCInput } from '@/services/aemc';
import type { ScreeningAnswer } from '@/lib/screening-questions';
import { calculateHealthScore } from '@/lib/health-score';
import { randomUUID } from 'crypto';

// ============================================================
// Types
// ============================================================

interface TriageRequest {
  symptoms: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  medicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  language?: 'ja' | 'zh-CN' | 'zh-TW' | 'en';
}

interface TriageResponse {
  requestId: string;
  riskLevel: string;
  departments: string[];
  recommendedTests: string[];
  summary: string;
  healthScore: number;
  confidence: number | null;
  safetyGateClass: string;
  disclaimer: string;
  processingTimeMs: number;
}

// ============================================================
// Helpers
// ============================================================

/** Convert B2B input to screening answers format */
function toScreeningAnswers(input: TriageRequest): ScreeningAnswer[] {
  const answers: ScreeningAnswer[] = [];
  let qid = 9000; // Use high IDs to avoid collision with real question IDs

  // Main symptoms
  if (input.symptoms) {
    answers.push({
      questionId: qid++,
      question: 'What symptoms are you experiencing?',
      answer: input.symptoms,
    });
  }

  // Age
  if (input.age) {
    answers.push({
      questionId: qid++,
      question: 'What is your age?',
      answer: String(input.age),
    });
  }

  // Gender
  if (input.gender) {
    answers.push({
      questionId: qid++,
      question: 'What is your gender?',
      answer: input.gender,
    });
  }

  // Medical history
  if (input.medicalHistory?.length) {
    answers.push({
      questionId: qid++,
      question: 'Do you have any medical history?',
      answer: input.medicalHistory.join(', '),
    });
  }

  // Medications
  if (input.medications?.length) {
    answers.push({
      questionId: qid++,
      question: 'What medications are you currently taking?',
      answer: input.medications.join(', '),
    });
  }

  // Allergies
  if (input.allergies?.length) {
    answers.push({
      questionId: qid++,
      question: 'Do you have any allergies?',
      answer: input.allergies.join(', '),
    });
  }

  return answers;
}

// ============================================================
// POST /api/v1/medical-triage
// ============================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = randomUUID();
  const clientIp = getClientIp(request);

  // 1. Validate API key
  const auth = await validateAPIKey(
    request.headers.get('authorization'),
    'medical_triage'
  );

  if (!auth.valid || !auth.key) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized', requestId },
      { status: 401 }
    );
  }

  const apiKey = auth.key;

  try {
    // 2. Parse and validate input
    const body = await request.json() as TriageRequest;

    if (!body.symptoms || typeof body.symptoms !== 'string' || body.symptoms.trim().length < 5) {
      await logAPIUsage({
        apiKeyId: apiKey.id,
        endpoint: '/api/v1/medical-triage',
        statusCode: 400,
        latencyMs: Date.now() - startTime,
        error: 'Invalid symptoms input',
        ipAddress: clientIp,
      });
      return NextResponse.json(
        { error: 'symptoms field is required (minimum 5 characters)', requestId },
        { status: 400 }
      );
    }

    // 3. Convert to screening answers
    const answers = toScreeningAnswers(body);
    const screeningId = requestId; // Use requestId as virtual screening ID

    // 4. Run AEMC pipeline
    const aemcInput: AEMCInput = {
      screeningId,
      answers,
      userType: 'authenticated', // Use authenticated pipeline for quality
      phase: 1,
      language: body.language || 'en',
    };

    const output = await runAEMCPipeline(aemcInput);
    const result = output.legacyResult;

    // 5. Calculate health score
    const healthScore = calculateHealthScore(result);

    // 6. Build response
    const response: TriageResponse = {
      requestId,
      riskLevel: result.riskLevel,
      departments: result.recommendedDepartments || [],
      recommendedTests: result.recommendedTests || [],
      summary: result.riskSummary || '',
      healthScore,
      confidence: output.pipelineResult.adjudicated_assessment?.confidence ?? null,
      safetyGateClass: output.safetyGate.gate_class,
      disclaimer:
        'This is an AI-assisted triage tool and does not constitute medical advice. Always consult a licensed healthcare provider.',
      processingTimeMs: Date.now() - startTime,
    };

    // 7. Log usage
    const totalTokensIn = output.pipelineResult.ai_runs.reduce(
      (s, r) => s + (r.input_tokens || 0),
      0
    );
    const totalTokensOut = output.pipelineResult.ai_runs.reduce(
      (s, r) => s + (r.output_tokens || 0),
      0
    );

    await logAPIUsage({
      apiKeyId: apiKey.id,
      endpoint: '/api/v1/medical-triage',
      statusCode: 200,
      latencyMs: Date.now() - startTime,
      inputTokens: totalTokensIn,
      outputTokens: totalTokensOut,
      ipAddress: clientIp,
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[B2B API] Triage error for key=${apiKey.key_prefix}:`, errMsg);

    await logAPIUsage({
      apiKeyId: apiKey.id,
      endpoint: '/api/v1/medical-triage',
      statusCode: 500,
      latencyMs: Date.now() - startTime,
      error: errMsg,
      ipAddress: clientIp,
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        requestId,
      },
      { status: 500 }
    );
  }
}
