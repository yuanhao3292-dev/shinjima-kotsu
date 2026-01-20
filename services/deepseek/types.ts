/**
 * DeepSeek 服務類型定義
 */

export interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskSummary: string;
  recommendedTests: string[];
  treatmentSuggestions: string[];
  recommendedHospitals: RecommendedHospital[];
  nextSteps: string[];
  rawContent: string;
  disclaimer: string;
  isFallback?: boolean;
  analysisSource?: 'ai' | 'rule-based';
  requestId?: string; // 請求追蹤 ID
}

export interface RecommendedHospital {
  name: string;
  nameJa?: string;
  location: string;
  features: string[];
  suitableFor: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
