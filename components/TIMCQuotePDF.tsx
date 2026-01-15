'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { TIMCQuoteResult, formatPrice } from '@/services/timcQuoteCalculator';

// 注册中文字体 - 使用本地字体文件避免 CSP 问题
// 字体文件位于 public/fonts/ 目录
Font.register({
  family: 'NotoSansSC',
  fonts: [
    {
      src: '/fonts/NotoSansSC-Regular.otf',
      fontWeight: 400,
    },
    {
      src: '/fonts/NotoSansSC-Bold.otf',
      fontWeight: 700,
    },
  ],
});

// PDF 样式
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansSC',
    fontSize: 10,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '2px solid #2563eb',
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  logo: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2563eb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#333',
  },
  headerRight: {
    textAlign: 'right',
  },
  quoteNumber: {
    fontSize: 11,
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: '#f3f4f6',
    padding: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottom: '1px solid #e5e7eb',
  },
  labelCell: {
    width: '30%',
    color: '#666',
  },
  valueCell: {
    width: '70%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  itemCol: {
    width: '50%',
  },
  qtyCol: {
    width: '15%',
    textAlign: 'center',
  },
  priceCol: {
    width: '17.5%',
    textAlign: 'right',
  },
  totalCol: {
    width: '17.5%',
    textAlign: 'right',
  },
  summarySection: {
    marginTop: 20,
    borderTop: '2px solid #2563eb',
    paddingTop: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
  },
  summaryLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
  },
  summaryValue: {
    width: 100,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    marginTop: 8,
    borderTop: '1px solid #e5e7eb',
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 14,
    fontWeight: 700,
  },
  totalValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 700,
    color: '#2563eb',
  },
  perPersonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
  },
  perPersonLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 11,
    color: '#666',
  },
  perPersonValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 11,
    color: '#666',
  },
  notesSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
  },
  noteItem: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
});

interface TIMCQuotePDFProps {
  quote: TIMCQuoteResult;
}

export const TIMCQuotePDF: React.FC<TIMCQuotePDFProps> = ({ quote }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>新島交通 × TIMC</Text>
            <Text style={styles.subtitle}>醫療健檢報價單</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quoteNumber}>報價編號：{quote.quoteNumber}</Text>
            <Text style={styles.quoteNumber}>報價日期：{quote.quoteDate}</Text>
            <Text style={styles.quoteNumber}>有效期限：{quote.validUntil}</Text>
          </View>
        </View>

        {/* 旅行社信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>旅行社資料</Text>
          <View style={styles.row}>
            <Text style={styles.labelCell}>公司名稱</Text>
            <Text style={styles.valueCell}>{quote.agencyInfo.companyName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelCell}>聯繫人</Text>
            <Text style={styles.valueCell}>{quote.agencyInfo.contactName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelCell}>聯繫方式</Text>
            <Text style={styles.valueCell}>{quote.agencyInfo.contactMethod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelCell}>電子郵箱</Text>
            <Text style={styles.valueCell}>{quote.agencyInfo.email}</Text>
          </View>
        </View>

        {/* 预约信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>預約資訊</Text>
          <View style={styles.row}>
            <Text style={styles.labelCell}>客戶人數</Text>
            <Text style={styles.valueCell}>{quote.guestCount} 人</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelCell}>首選日期</Text>
            <Text style={styles.valueCell}>{quote.preferredDate}</Text>
          </View>
          {quote.alternateDate && (
            <View style={styles.row}>
              <Text style={styles.labelCell}>備選日期</Text>
              <Text style={styles.valueCell}>{quote.alternateDate}</Text>
            </View>
          )}
        </View>

        {/* 项目明细 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>項目明細</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.itemCol}>項目</Text>
            <Text style={styles.qtyCol}>數量</Text>
            <Text style={styles.priceCol}>單價</Text>
            <Text style={styles.totalCol}>小計</Text>
          </View>

          {/* 健检套餐 */}
          <View style={styles.tableRow}>
            <Text style={styles.itemCol}>{quote.packageName} {quote.packageNameZh} 套餐</Text>
            <Text style={styles.qtyCol}>{quote.guestCount}人</Text>
            <Text style={styles.priceCol}>{formatPrice(quote.packagePrice)}</Text>
            <Text style={styles.totalCol}>{formatPrice(quote.packageTotal)}</Text>
          </View>

          {/* 机场接送 */}
          {quote.airportTransferPrice > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.itemCol}>機場接送服務（Alphard）</Text>
              <Text style={styles.qtyCol}>{quote.airportTransferPrice === 70000 ? '來回' : '單程'}</Text>
              <Text style={styles.priceCol}>¥35,000</Text>
              <Text style={styles.totalCol}>{formatPrice(quote.airportTransferPrice)}</Text>
            </View>
          )}

          {/* 翻译陪同 */}
          {quote.translatorPrice > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.itemCol}>全程翻譯陪同</Text>
              <Text style={styles.qtyCol}>{quote.translatorDays}天</Text>
              <Text style={styles.priceCol}>¥25,000/天</Text>
              <Text style={styles.totalCol}>{formatPrice(quote.translatorPrice)}</Text>
            </View>
          )}

          {/* 报告翻译 */}
          {quote.reportTranslationPrice > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.itemCol}>報告翻譯加急（5工作日）</Text>
              <Text style={styles.qtyCol}>{quote.guestCount}份</Text>
              <Text style={styles.priceCol}>¥15,000/份</Text>
              <Text style={styles.totalCol}>{formatPrice(quote.reportTranslationPrice)}</Text>
            </View>
          )}

          {/* 酒店 */}
          {quote.hotelDetails && (
            <View style={styles.tableRow}>
              <Text style={styles.itemCol}>
                酒店住宿（{quote.hotelDetails.location} {quote.hotelDetails.stars}星）
              </Text>
              <Text style={styles.qtyCol}>
                {quote.hotelDetails.nights}晚×{quote.hotelDetails.rooms}間
              </Text>
              <Text style={styles.priceCol}>{formatPrice(quote.hotelDetails.pricePerNight)}/晚</Text>
              <Text style={styles.totalCol}>{formatPrice(quote.hotelPrice)}</Text>
            </View>
          )}
        </View>

        {/* 汇总 */}
        <View style={styles.summarySection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>總計</Text>
            <Text style={styles.totalValue}>{formatPrice(quote.finalPrice)}</Text>
          </View>
          <View style={styles.perPersonRow}>
            <Text style={styles.perPersonLabel}>人均</Text>
            <Text style={styles.perPersonValue}>{formatPrice(quote.pricePerPerson)}</Text>
          </View>
        </View>

        {/* 备注 */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>備註</Text>
          <Text style={styles.noteItem}>• 價格為 B2B 淨價（不含稅）</Text>
          <Text style={styles.noteItem}>• 報價有效期 30 天</Text>
          <Text style={styles.noteItem}>• 預約需提前 2 週確認</Text>
          <Text style={styles.noteItem}>• 健檢當日請空腹前往（可飲少量白開水）</Text>
          <Text style={styles.noteItem}>• 如需取消，請於 7 天前通知</Text>
          {quote.notes && (
            <Text style={styles.noteItem}>• 特殊需求：{quote.notes}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>新島交通株式会社 | TIMC 大阪中央高級醫療センター 官方合作夥伴</Text>
          <Text>Email: info@niijima-koutsu.com | TEL: +81-6-XXXX-XXXX</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TIMCQuotePDF;
