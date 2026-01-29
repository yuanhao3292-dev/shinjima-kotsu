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
import { type BodyMapSelectionData } from './BodyMapSelector';
import { MEDICAL_DEPARTMENTS, BODY_PARTS } from '@/lib/body-map-config';

// 注册中文字体 - 使用繁体中文字体 Noto Sans TC
Font.register({
  family: 'NotoSansTC',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// 完全禁用连字符 - 返回整个单词不分割，避免出现 "-" 符号
Font.registerHyphenationCallback((word: string) => {
  // 返回整个单词作为单一元素，禁止在任何位置断词
  return [word];
});

// 清理 Markdown 语法的工具函数
function cleanMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')  // 移除 **
    .replace(/\*/g, '')    // 移除 *
    .replace(/##/g, '')    // 移除 ##
    .replace(/#/g, '')     // 移除 #
    .replace(/`/g, '')     // 移除 `
    .replace(/---/g, '')   // 移除 ---
    .replace(/\n\n+/g, '\n') // 多个换行变单个
    .trim();
}

// 中文文本自动换行处理 - 只在中文字符之间插入零宽空格
function wrapChinese(text: string): string {
  if (!text) return '';
  let cleaned = cleanMarkdown(text);

  // 移除 AI 生成内容中可能存在的多余连字符
  cleaned = cleaned
    .replace(/\s*-\s*$/gm, '')     // 移除行末的连字符
    .replace(/^\s*-\s*/gm, '')     // 移除行首的连字符（除非是列表）
    .replace(/\s+-\s+/g, ' ')      // 移除独立的连字符
    .replace(/([^\s])-([^\s])/g, '$1$2')  // 移除单词中间不必要的连字符

  // 中文字符范围（包括标点）
  const isChinese = (char: string) => /[\u4e00-\u9fff]/.test(char);
  // 中文标点
  const isChinesePunct = (char: string) => /[\u3000-\u303f\uff00-\uffef\u2018\u2019\u201c\u201d]/.test(char);
  // 不应该在其前面换行的字符（右括号、逗号、句号等）
  const noBreakBefore = (char: string) => /[，。！？；：、）】》'"」』\]\),.!?;:\u3002\uff0c]/.test(char);

  let result = '';
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const nextChar = i < cleaned.length - 1 ? cleaned[i + 1] : '';

    result += char;

    // 在中文字符后面插入零宽空格（允许换行点）
    // 但不在标点符号前换行
    if (isChinese(char) && nextChar && !noBreakBefore(nextChar)) {
      result += '\u200B';
    }
  }
  return result;
}

// 配色方案
const colors = {
  primary: '#0c1829',
  primaryLight: '#1a2f4a',
  gold: '#c9a961',
  goldLight: '#d4bc7e',
  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#7a7a7a',
  textLight: '#ffffff',
  bgCream: '#faf8f5',
  bgWarm: '#f5f2ed',
  bgCard: '#ffffff',
  riskLow: '#2d5a4a',
  riskLowBg: '#e8f3ef',
  riskMedium: '#8b6914',
  riskMediumBg: '#fef7e6',
  riskHigh: '#8b2635',
  riskHighBg: '#fce8eb',
  divider: '#e5e0d8',
};

// 样式定义
const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansTC',
    fontSize: 10,
    backgroundColor: colors.bgCream,
    paddingLeft: 50,
    paddingRight: 55,
    paddingVertical: 45,
  },

  // 封面页
  coverPage: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  coverHeader: {
    backgroundColor: colors.primary,
    height: 260,
    paddingHorizontal: 40,
    paddingTop: 50,
  },
  coverBrand: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.gold,
    letterSpacing: 3,
    marginBottom: 30,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.textLight,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 11,
    color: colors.goldLight,
    letterSpacing: 1,
  },
  coverGoldBar: {
    height: 4,
    backgroundColor: colors.gold,
  },
  coverBody: {
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  coverInfoBox: {
    backgroundColor: colors.bgCard,
    padding: 25,
    marginBottom: 30,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  coverInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  coverLabel: {
    width: 80,
    fontSize: 10,
    color: colors.textMuted,
  },
  coverValue: {
    flex: 1,
    fontSize: 11,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  coverRiskBox: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  coverRiskLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 12,
    letterSpacing: 1,
  },
  riskBadge: {
    paddingHorizontal: 35,
    paddingVertical: 12,
  },
  riskBadgeLow: {
    backgroundColor: colors.riskLowBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.riskLow,
  },
  riskBadgeMedium: {
    backgroundColor: colors.riskMediumBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.riskMedium,
  },
  riskBadgeHigh: {
    backgroundColor: colors.riskHighBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.riskHigh,
  },
  riskText: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 2,
  },
  riskTextLow: { color: colors.riskLow },
  riskTextMedium: { color: colors.riskMedium },
  riskTextHigh: { color: colors.riskHigh },
  coverFooter: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 12,
  },
  coverFooterText: {
    fontSize: 8,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // 页眉
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerBrand: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.gold,
  },
  headerTitle: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // 章节
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionNum: {
    width: 22,
    height: 22,
    backgroundColor: colors.primary,
    color: colors.textLight,
    fontSize: 9,
    fontWeight: 700,
    textAlign: 'center',
    marginRight: 10,
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  sectionBar: {
    width: 35,
    height: 2,
    backgroundColor: colors.gold,
    marginTop: 6,
  },

  // 内容卡片
  card: {
    backgroundColor: colors.bgCard,
    padding: 14,
    paddingRight: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    width: '100%',
  },
  cardAlt: {
    backgroundColor: colors.bgWarm,
    padding: 14,
    paddingRight: 16,
    marginBottom: 12,
    width: '100%',
  },
  cardText: {
    fontSize: 8.5,
    color: colors.textSecondary,
    lineHeight: 1.7,
  },

  // 列表
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  listNum: {
    width: 18,
    height: 18,
    backgroundColor: colors.primaryLight,
    color: colors.textLight,
    fontSize: 8,
    fontWeight: 700,
    textAlign: 'center',
    marginRight: 8,
    paddingTop: 4,
    flexShrink: 0,
  },
  listDot: {
    width: 5,
    height: 5,
    backgroundColor: colors.gold,
    marginRight: 8,
    marginTop: 5,
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontSize: 8.5,
    color: colors.textSecondary,
    lineHeight: 1.6,
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  // 科室
  deptCard: {
    backgroundColor: colors.bgCard,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryLight,
  },
  deptName: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  deptDesc: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 6,
  },
  deptTests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  testTag: {
    fontSize: 8,
    color: colors.primaryLight,
    backgroundColor: '#e8eef5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 3,
  },

  // 医院
  hospitalCard: {
    backgroundColor: colors.bgCard,
    padding: 14,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  hospitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  hospitalLoc: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.gold,
  },
  hospitalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hospitalTag: {
    fontSize: 8,
    color: colors.textSecondary,
    backgroundColor: colors.bgWarm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 3,
  },
  hospitalFit: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 6,
  },

  // 症状
  symptomBox: {
    backgroundColor: colors.bgCard,
    padding: 16,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 6,
  },
  symptomDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: colors.riskMedium,
  },
  symptomText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  // 免责声明
  disclaimer: {
    backgroundColor: colors.bgWarm,
    padding: 16,
    marginTop: 15,
    borderTopWidth: 2,
    borderTopColor: colors.gold,
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 8,
    color: colors.textMuted,
    lineHeight: 1.5,
  },

  // CTA
  cta: {
    backgroundColor: colors.primary,
    padding: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.gold,
    marginBottom: 6,
  },
  ctaText: {
    fontSize: 9,
    color: colors.textLight,
    textAlign: 'center',
  },

  // 页脚
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerText: {
    fontSize: 8,
    color: colors.textMuted,
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.gold,
  },
});

interface HealthReportPDFProps {
  reportData: {
    id: string;
    createdAt: string;
    userEmail: string;
    bodyMapData?: BodyMapSelectionData;
    analysisResult: {
      riskLevel: 'low' | 'medium' | 'high';
      riskSummary: string;
      recommendedTests: string[];
      treatmentSuggestions: string[];
      recommendedHospitals: {
        name: string;
        location: string;
        features: string[];
        suitableFor: string;
      }[];
      nextSteps: string[];
      disclaimer: string;
    };
  };
}

const HealthReportDocument: React.FC<HealthReportPDFProps> = ({ reportData }) => {
  const { analysisResult, bodyMapData, createdAt, id } = reportData;

  const riskConfig = {
    low: { badge: styles.riskBadgeLow, text: styles.riskTextLow, label: '低風險' },
    medium: { badge: styles.riskBadgeMedium, text: styles.riskTextMedium, label: '中風險' },
    high: { badge: styles.riskBadgeHigh, text: styles.riskTextHigh, label: '高風險' },
  };


  const getBodyPartNames = () => {
    if (!bodyMapData?.selectedBodyParts) return [];
    return bodyMapData.selectedBodyParts
      .map((partId) => BODY_PARTS.find((p) => p.id === partId)?.name)
      .filter(Boolean) as string[];
  };

  const getDepartments = () => {
    if (!bodyMapData?.recommendedDepartments) return [];
    return bodyMapData.recommendedDepartments
      .map((deptId) => MEDICAL_DEPARTMENTS.find((d) => d.id === deptId))
      .filter(Boolean);
  };

  return (
    <Document>
      {/* 封面 */}
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <View style={styles.coverHeader}>
          <Text style={styles.coverBrand}>新島交通株式会社</Text>
          <Text style={styles.coverTitle}>AI 健康評估報告</Text>
          <Text style={styles.coverSubtitle}>PERSONALIZED HEALTH ASSESSMENT REPORT</Text>
        </View>
        <View style={styles.coverGoldBar} />

        <View style={styles.coverBody}>
          <View style={styles.coverInfoBox}>
            <View style={styles.coverInfoRow}>
              <Text style={styles.coverLabel}>報告編號</Text>
              <Text style={styles.coverValue}>{id.substring(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.coverInfoRow}>
              <Text style={styles.coverLabel}>評估日期</Text>
              <Text style={styles.coverValue}>{formatDateJPKanji(createdAt)}</Text>
            </View>
            <View style={[styles.coverInfoRow, { marginBottom: 0 }]}>
              <Text style={styles.coverLabel}>合作醫療機構</Text>
              <Text style={styles.coverValue}>日本精密健檢中心</Text>
            </View>
          </View>

          <View style={styles.coverRiskBox}>
            <Text style={styles.coverRiskLabel}>健康風險評估</Text>
            <View style={[styles.riskBadge, riskConfig[analysisResult.riskLevel].badge]}>
              <Text style={[styles.riskText, riskConfig[analysisResult.riskLevel].text]}>
                {riskConfig[analysisResult.riskLevel].label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>
            本報告由 AI 智能分析系統生成，僅供健康參考，不構成醫療診斷依據
          </Text>
        </View>
      </Page>

      {/* 第2頁：風險分析 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerBrand}>新島交通</Text>
          <Text style={styles.headerTitle}>AI Health Assessment</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNum}>01</Text>
            <Text style={styles.sectionTitle}>健康風險評估</Text>
          </View>
          <View style={styles.sectionBar} />
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={styles.cardText}>{wrapChinese(analysisResult.riskSummary)}</Text>
          </View>
        </View>

        {bodyMapData && bodyMapData.selectedBodyParts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionNum}>02</Text>
              <Text style={styles.sectionTitle}>症狀部位</Text>
            </View>
            <View style={styles.sectionBar} />
            <View style={[styles.symptomBox, { marginTop: 12 }]}>
              <View style={styles.symptomGrid}>
                {getBodyPartNames().map((name, idx) => (
                  <View key={idx} style={styles.symptomItem}>
                    <View style={styles.symptomDot} />
                    <Text style={styles.symptomText}>{name}</Text>
                  </View>
                ))}
              </View>
              {bodyMapData.selectedSymptoms.length > 0 && (
                <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider }}>
                  <Text style={{ fontSize: 10, fontWeight: 700, marginBottom: 8 }}>具體症狀</Text>
                  <View style={styles.symptomGrid}>
                    {bodyMapData.selectedSymptoms.map((symptom, idx) => (
                      <View key={idx} style={styles.symptomItem}>
                        <View style={styles.symptomDot} />
                        <Text style={styles.symptomText}>{symptom.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNum}>03</Text>
            <Text style={styles.sectionTitle}>推薦就診科室</Text>
          </View>
          <View style={styles.sectionBar} />
          <View style={{ marginTop: 12 }}>
            {getDepartments().slice(0, 3).map((dept: any, idx) => (
              <View key={idx} style={styles.deptCard}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptDesc}>{dept.description}</Text>
                <View style={styles.deptTests}>
                  {dept.recommendedTests.slice(0, 4).map((test: string, i: number) => (
                    <Text key={i} style={styles.testTag}>{test}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{formatDateShort(createdAt)}</Text>
          <Text style={styles.footerBrand}>新島交通株式会社</Text>
          <Text style={styles.footerText}>第 2 頁</Text>
        </View>
      </Page>

      {/* 第3頁：檢查建議 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerBrand}>新島交通</Text>
          <Text style={styles.headerTitle}>AI Health Assessment</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNum}>04</Text>
            <Text style={styles.sectionTitle}>建議檢查項目</Text>
          </View>
          <View style={styles.sectionBar} />
          <View style={[styles.card, { marginTop: 12 }]}>
            {analysisResult.recommendedTests.map((test, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.listNum}>{idx + 1}</Text>
                <Text style={styles.listText}>{wrapChinese(test)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNum}>05</Text>
            <Text style={styles.sectionTitle}>日本先端治療建議</Text>
          </View>
          <View style={styles.sectionBar} />
          <View style={[styles.cardAlt, { marginTop: 12 }]}>
            {analysisResult.treatmentSuggestions.map((item, idx) => (
              <View key={idx} style={styles.listItem}>
                <View style={styles.listDot} />
                <Text style={styles.listText}>{wrapChinese(item)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNum}>06</Text>
            <Text style={styles.sectionTitle}>下一步建議</Text>
          </View>
          <View style={styles.sectionBar} />
          <View style={[styles.card, { marginTop: 12 }]}>
            {analysisResult.nextSteps.map((step, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.listNum}>{idx + 1}</Text>
                <Text style={styles.listText}>{wrapChinese(step)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{formatDateShort(createdAt)}</Text>
          <Text style={styles.footerBrand}>新島交通株式会社</Text>
          <Text style={styles.footerText}>第 3 頁</Text>
        </View>
      </Page>

      {/* 第4頁：推薦醫院 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerBrand}>新島交通</Text>
          <Text style={styles.headerTitle}>AI Health Assessment</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNum}>07</Text>
            <Text style={styles.sectionTitle}>推薦醫療機構</Text>
          </View>
          <View style={styles.sectionBar} />
          <View style={{ marginTop: 12 }}>
            {analysisResult.recommendedHospitals.map((hospital, idx) => (
              <View key={idx} style={styles.hospitalCard}>
                <View style={styles.hospitalRow}>
                  <Text style={styles.hospitalName}>{hospital.name}</Text>
                  <Text style={styles.hospitalLoc}>{hospital.location}</Text>
                </View>
                <View style={styles.hospitalTags}>
                  {hospital.features.map((f, i) => (
                    <Text key={i} style={styles.hospitalTag}>{f}</Text>
                  ))}
                </View>
                {hospital.suitableFor && (
                  <Text style={styles.hospitalFit}>適合：{hospital.suitableFor}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>重要聲明</Text>
          <Text style={styles.disclaimerText}>
            {wrapChinese(analysisResult.disclaimer) ||
              wrapChinese('本報告基於 AI 分析技術生成，旨在提供健康風險參考，不能替代專業醫療診斷。如有任何健康疑慮，請務必諮詢專業醫療人員。')}
          </Text>
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>預約日本精密健檢</Text>
          <Text style={styles.ctaText}>www.niijima-koutsu.jp/?page=medical</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>2025 新島交通株式会社</Text>
          <Text style={styles.footerBrand}>新島交通株式会社</Text>
          <Text style={styles.footerText}>第 4 頁</Text>
        </View>
      </Page>
    </Document>
  );
};

export async function generateHealthReportPDF(
  reportData: HealthReportPDFProps['reportData']
): Promise<Blob> {
  const blob = await pdf(<HealthReportDocument reportData={reportData} />).toBlob();
  return blob;
}

export async function downloadHealthReportPDF(
  reportData: HealthReportPDFProps['reportData'],
  filename?: string
): Promise<void> {
  const blob = await generateHealthReportPDF(reportData);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `Niijima-Health-Report-${reportData.id.substring(0, 8).toUpperCase()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default HealthReportDocument;
