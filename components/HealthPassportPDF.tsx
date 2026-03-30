'use client';

import React from 'react';
import { formatDateJPKanji, formatDateShort } from '@/lib/utils/format-date';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer';
import type { ScoreBreakdownResult, ScoreBreakdownItem, HealthSnapshotRow } from '@/lib/health-score';

// ============================================================
// Font registration (same CDN fonts as HealthReportPDF)
// ============================================================

Font.register({
  family: 'NotoSansSC',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-400-normal.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-700-normal.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'NotoSansTC',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-400-normal.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-700-normal.ttf', fontWeight: 700 },
  ],
});

Font.registerHyphenationCallback((word: string) => [word]);

// ============================================================
// Types
// ============================================================

type PDFLanguage = 'ja' | 'zh-CN' | 'zh-TW' | 'en';

interface PassportPDFData {
  language: PDFLanguage;
  userName?: string;
  healthScore: number;
  riskLevel: string;
  trend: string;
  scoreDelta: number | null;
  breakdown: ScoreBreakdownResult;
  topFindings: string[];
  departments: string[];
  latestScreeningDate: string;
  snapshots: HealthSnapshotRow[];
}

// ============================================================
// i18n
// ============================================================

const T: Record<string, Record<PDFLanguage, string>> = {
  title: { ja: 'ヘルスパスポート', 'zh-CN': '健康护照', 'zh-TW': '健康護照', en: 'Health Passport' },
  subtitle: { ja: 'PERSONAL HEALTH PASSPORT', 'zh-CN': 'PERSONAL HEALTH PASSPORT', 'zh-TW': 'PERSONAL HEALTH PASSPORT', en: 'PERSONAL HEALTH PASSPORT' },
  healthScore: { ja: '健康スコア', 'zh-CN': '健康评分', 'zh-TW': '健康評分', en: 'Health Score' },
  outOf100: { ja: '/100', 'zh-CN': '/100', 'zh-TW': '/100', en: '/100' },
  scoreBreakdown: { ja: 'スコア内訳', 'zh-CN': '评分详情', 'zh-TW': '評分詳情', en: 'Score Breakdown' },
  baseScore: { ja: '基礎スコア', 'zh-CN': '基础分', 'zh-TW': '基礎分', en: 'Base Score' },
  finalScore: { ja: '最終スコア', 'zh-CN': '最终评分', 'zh-TW': '最終評分', en: 'Final Score' },
  riskLevel: { ja: 'リスクレベル', 'zh-CN': '风险等级', 'zh-TW': '風險等級', en: 'Risk Level' },
  riskLow: { ja: '低リスク', 'zh-CN': '低风险', 'zh-TW': '低風險', en: 'Low Risk' },
  riskMedium: { ja: '中リスク', 'zh-CN': '中等风险', 'zh-TW': '中等風險', en: 'Medium Risk' },
  riskHigh: { ja: '高リスク', 'zh-CN': '高风险', 'zh-TW': '高風險', en: 'High Risk' },
  trend: { ja: 'トレンド', 'zh-CN': '趋势', 'zh-TW': '趨勢', en: 'Trend' },
  improving: { ja: '改善中', 'zh-CN': '改善中', 'zh-TW': '改善中', en: 'Improving' },
  stable: { ja: '安定', 'zh-CN': '稳定', 'zh-TW': '穩定', en: 'Stable' },
  worsening: { ja: '要注意', 'zh-CN': '需注意', 'zh-TW': '需注意', en: 'Needs Attention' },
  keyFindings: { ja: '主な所見', 'zh-CN': '主要发现', 'zh-TW': '主要發現', en: 'Key Findings' },
  departments: { ja: '推奨診療科', 'zh-CN': '推荐科室', 'zh-TW': '推薦科室', en: 'Recommended Departments' },
  history: { ja: 'チェック履歴', 'zh-CN': '自测历史', 'zh-TW': '自測歷史', en: 'Check History' },
  date: { ja: '日付', 'zh-CN': '日期', 'zh-TW': '日期', en: 'Date' },
  score: { ja: 'スコア', 'zh-CN': '评分', 'zh-TW': '評分', en: 'Score' },
  risk: { ja: 'リスク', 'zh-CN': '风险', 'zh-TW': '風險', en: 'Risk' },
  lastUpdated: { ja: '最終更新', 'zh-CN': '最后更新', 'zh-TW': '最後更新', en: 'Last Updated' },
  disclaimer: {
    ja: '本パスポートはAI分析に基づく健康参考情報です。医療診断に代わるものではありません。',
    'zh-CN': '本护照基于AI分析的健康参考信息，不能替代医疗诊断。',
    'zh-TW': '本護照基於AI分析的健康參考資訊，不能替代醫療診斷。',
    en: 'This passport is health reference information based on AI analysis. It does not replace medical diagnosis.',
  },
  // Category labels for breakdown
  risk_level: { ja: 'リスクレベル', 'zh-CN': '风险等级', 'zh-TW': '風險等級', en: 'Risk Level' },
  department: { ja: '診療科', 'zh-CN': '科室', 'zh-TW': '科室', en: 'Dept' },
  test: { ja: '検査', 'zh-CN': '检查', 'zh-TW': '檢查', en: 'Tests' },
  safety_gate: { ja: '安全ゲート', 'zh-CN': '安全闸门', 'zh-TW': '安全閘門', en: 'Safety Gate' },
  human_review: { ja: '専門家審査', 'zh-CN': '人工审核', 'zh-TW': '人工審核', en: 'Expert Review' },
  cancer_keyword: { ja: 'がんリスク', 'zh-CN': '癌症风险', 'zh-TW': '癌症風險', en: 'Cancer Risk' },
};

const pt = (key: string, lang: PDFLanguage) => T[key]?.[lang] ?? T[key]?.['zh-CN'] ?? key;

// ============================================================
// Colors & Styles
// ============================================================

const colors = {
  primary: '#0c1829',
  gold: '#c9a961',
  goldLight: '#d4bc7e',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#7a7a7a',
  textLight: '#ffffff',
  bgCream: '#faf8f5',
  bgCard: '#ffffff',
  bgWarm: '#f5f2ed',
  divider: '#e5e0d8',
  riskLow: '#2d5a4a',
  riskLowBg: '#e8f3ef',
  riskMedium: '#8b6914',
  riskMediumBg: '#fef7e6',
  riskHigh: '#8b2635',
  riskHighBg: '#fce8eb',
};

function getScoreColor(score: number) {
  if (score >= 80) return colors.emerald;
  if (score >= 60) return colors.amber;
  return colors.red;
}

function getRiskStyle(risk: string) {
  if (risk === 'low') return { color: colors.riskLow, bg: colors.riskLowBg };
  if (risk === 'medium') return { color: colors.riskMedium, bg: colors.riskMediumBg };
  return { color: colors.riskHigh, bg: colors.riskHighBg };
}

const styles = StyleSheet.create({
  page: { fontFamily: 'NotoSansSC', fontSize: 10, backgroundColor: colors.bgCream, paddingHorizontal: 50, paddingVertical: 45 },
  // Cover header
  coverHeader: { backgroundColor: colors.primary, marginHorizontal: -50, marginTop: -45, paddingHorizontal: 40, paddingTop: 40, paddingBottom: 30 },
  brand: { fontSize: 12, color: colors.gold, letterSpacing: 3, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: 700, color: colors.textLight, marginBottom: 6 },
  subtitle: { fontSize: 10, color: colors.goldLight, letterSpacing: 1.5 },
  goldBar: { height: 3, backgroundColor: colors.gold, marginHorizontal: -50 },
  // Score section
  scoreSection: { alignItems: 'center', paddingVertical: 30 },
  scoreBig: { fontSize: 56, fontWeight: 700 },
  scoreLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  // Info row
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.divider, borderBottomWidth: 1, borderBottomColor: colors.divider },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 8, color: colors.textMuted, marginBottom: 3 },
  infoValue: { fontSize: 11, fontWeight: 700, color: colors.textPrimary },
  // Breakdown
  sectionTitle: { fontSize: 13, fontWeight: 700, color: colors.textPrimary, marginBottom: 10 },
  sectionBar: { width: 35, height: 2, backgroundColor: colors.gold, marginBottom: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 10, marginBottom: 2 },
  breakdownCategory: { fontSize: 8, color: colors.textMuted, width: 60 },
  breakdownLabel: { fontSize: 9, color: colors.textSecondary, flex: 1 },
  breakdownDeduction: { fontSize: 9, fontWeight: 700, width: 40, textAlign: 'right' },
  // Findings / Departments
  card: { backgroundColor: colors.bgCard, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: colors.gold },
  cardText: { fontSize: 9, color: colors.textSecondary, lineHeight: 1.6 },
  tag: { fontSize: 8, color: colors.primary, backgroundColor: '#e8eef5', paddingHorizontal: 6, paddingVertical: 3, marginRight: 4, marginBottom: 3 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
  // History table
  tableHeader: { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 8 },
  tableHeaderText: { fontSize: 8, fontWeight: 700, color: colors.textLight },
  tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: colors.divider },
  tableCell: { fontSize: 9, color: colors.textSecondary },
  // Footer
  footer: { position: 'absolute', bottom: 25, left: 50, right: 50, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.divider },
  footerText: { fontSize: 8, color: colors.textMuted },
  footerBrand: { fontSize: 8, fontWeight: 700, color: colors.gold },
  // Disclaimer
  disclaimer: { backgroundColor: colors.bgWarm, padding: 12, marginTop: 15, borderTopWidth: 2, borderTopColor: colors.gold },
  disclaimerText: { fontSize: 8, color: colors.textMuted, lineHeight: 1.5 },
});

function getFontFamily(lang: PDFLanguage): string {
  switch (lang) {
    case 'ja': return 'NotoSansJP';
    case 'zh-TW': return 'NotoSansTC';
    default: return 'NotoSansSC';
  }
}

// ============================================================
// Document
// ============================================================

const HealthPassportDocument: React.FC<{ data: PassportPDFData }> = ({ data }) => {
  const { language: lang, healthScore, riskLevel, trend, scoreDelta, latestScreeningDate } = data;
  // AI 输出字段可能 undefined，做 fallback 防止 .map() 崩溃
  const breakdown = data.breakdown || { items: [], finalScore: healthScore };
  const topFindings = data.topFindings || [];
  const departments = data.departments || [];
  const snapshots = data.snapshots || [];
  const fontFamily = getFontFamily(lang);
  const scoreColor = getScoreColor(healthScore);
  const riskStyle = getRiskStyle(riskLevel);

  const riskLabel = riskLevel === 'low' ? pt('riskLow', lang) : riskLevel === 'medium' ? pt('riskMedium', lang) : pt('riskHigh', lang);
  const trendLabel = trend === 'improving' ? pt('improving', lang) : trend === 'worsening' ? pt('worsening', lang) : pt('stable', lang);

  return (
    <Document>
      {/* Page 1: Score + Breakdown */}
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        {/* Header */}
        <View style={styles.coverHeader}>
          <Text style={styles.brand}>新島交通株式会社</Text>
          <Text style={styles.title}>{pt('title', lang)}</Text>
          <Text style={styles.subtitle}>{pt('subtitle', lang)}</Text>
        </View>
        <View style={styles.goldBar} />

        {/* Health Score */}
        <View style={styles.scoreSection}>
          <Text style={[styles.scoreBig, { color: scoreColor }]}>{healthScore}</Text>
          <Text style={styles.scoreLabel}>{pt('healthScore', lang)} {pt('outOf100', lang)}</Text>
        </View>

        {/* Risk / Trend / Date row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{pt('riskLevel', lang)}</Text>
            <Text style={[styles.infoValue, { color: riskStyle.color }]}>{riskLabel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{pt('trend', lang)}</Text>
            <Text style={styles.infoValue}>
              {scoreDelta !== null && scoreDelta !== 0 ? `${scoreDelta > 0 ? '+' : ''}${scoreDelta} ` : ''}
              {trendLabel}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{pt('lastUpdated', lang)}</Text>
            <Text style={styles.infoValue}>{formatDateShort(latestScreeningDate)}</Text>
          </View>
        </View>

        {/* Score Breakdown */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>{pt('scoreBreakdown', lang)}</Text>
          <View style={styles.sectionBar} />

          <View style={[styles.breakdownRow, { backgroundColor: colors.bgCard }]}>
            <Text style={styles.breakdownCategory} />
            <Text style={styles.breakdownLabel}>{pt('baseScore', lang)}</Text>
            <Text style={[styles.breakdownDeduction, { color: colors.textPrimary }]}>100</Text>
          </View>

          {breakdown.items.map((item: ScoreBreakdownItem, idx: number) => (
            <View key={idx} style={[styles.breakdownRow, { backgroundColor: idx % 2 === 0 ? colors.bgWarm : colors.bgCard }]}>
              <Text style={styles.breakdownCategory}>{pt(item.category, lang)}</Text>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <Text style={[styles.breakdownDeduction, { color: item.deduction >= 20 ? colors.red : item.deduction >= 8 ? colors.amber : '#d97706' }]}>
                -{item.deduction}
              </Text>
            </View>
          ))}

          <View style={[styles.breakdownRow, { backgroundColor: colors.bgCard, borderTopWidth: 2, borderTopColor: colors.gold, marginTop: 4 }]}>
            <Text style={styles.breakdownCategory} />
            <Text style={[styles.breakdownLabel, { fontWeight: 700 }]}>{pt('finalScore', lang)}</Text>
            <Text style={[styles.breakdownDeduction, { color: scoreColor, fontSize: 12 }]}>{healthScore}</Text>
          </View>
        </View>

        {/* Key Findings */}
        {topFindings.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>{pt('keyFindings', lang)}</Text>
            <View style={styles.sectionBar} />
            <View style={styles.card}>
              {topFindings.map((f, idx) => (
                <Text key={idx} style={[styles.cardText, { marginBottom: 3 }]}>{`• ${f}`}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Departments */}
        {departments.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>{pt('departments', lang)}</Text>
            <View style={styles.sectionBar} />
            <View style={styles.tagRow}>
              {departments.map((d, idx) => (
                <Text key={idx} style={styles.tag}>{d}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{pt('disclaimer', lang)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{formatDateShort(latestScreeningDate)}</Text>
          <Text style={styles.footerBrand}>新島交通株式会社</Text>
          <Text style={styles.footerText}>1/{ snapshots.length >= 2 ? '2' : '1'}</Text>
        </View>
      </Page>

      {/* Page 2: History (only if 2+ screenings) */}
      {snapshots.length >= 2 && (
        <Page size="A4" style={[styles.page, { fontFamily }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
            <Text style={styles.footerBrand}>新島交通</Text>
            <Text style={[styles.footerText, { fontSize: 10 }]}>{pt('title', lang)}</Text>
          </View>

          <Text style={styles.sectionTitle}>{pt('history', lang)}</Text>
          <View style={styles.sectionBar} />

          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { width: '30%' }]}>{pt('date', lang)}</Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>{pt('score', lang)}</Text>
            <Text style={[styles.tableHeaderText, { width: '25%' }]}>{pt('risk', lang)}</Text>
            <Text style={[styles.tableHeaderText, { width: '25%' }]}>{pt('trend', lang)}</Text>
          </View>

          {/* Table rows (newest first, max 20) */}
          {snapshots.slice(0, 20).map((snap, idx) => {
            const sColor = getScoreColor(snap.health_score);
            const sRisk = snap.risk_level === 'low' ? pt('riskLow', lang) : snap.risk_level === 'medium' ? pt('riskMedium', lang) : pt('riskHigh', lang);
            const sTrend = snap.trend === 'improving' ? pt('improving', lang) : snap.trend === 'worsening' ? pt('worsening', lang) : pt('stable', lang);
            const sDelta = snap.score_delta !== null && snap.score_delta !== 0 ? `${snap.score_delta > 0 ? '+' : ''}${snap.score_delta}` : '';

            return (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 ? { backgroundColor: colors.bgCard } : { backgroundColor: colors.bgWarm }]}>
                <Text style={[styles.tableCell, { width: '30%' }]}>{formatDateShort(snap.created_at)}</Text>
                <Text style={[styles.tableCell, { width: '20%', fontWeight: 700, color: sColor }]}>{snap.health_score}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{sRisk}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{sDelta ? `${sDelta} ${sTrend}` : sTrend}</Text>
              </View>
            );
          })}

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>{pt('disclaimer', lang)}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{formatDateShort(latestScreeningDate)}</Text>
            <Text style={styles.footerBrand}>新島交通株式会社</Text>
            <Text style={styles.footerText}>2/2</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

// ============================================================
// Export functions
// ============================================================

export async function generateHealthPassportPDF(data: PassportPDFData): Promise<Blob> {
  return pdf(<HealthPassportDocument data={data} />).toBlob();
}

export async function downloadHealthPassportPDF(data: PassportPDFData, filename?: string): Promise<void> {
  const blob = await generateHealthPassportPDF(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `Niijima-Health-Passport-${formatDateShort(data.latestScreeningDate).replace(/\//g, '')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export type { PassportPDFData, PDFLanguage };
export default HealthPassportDocument;
