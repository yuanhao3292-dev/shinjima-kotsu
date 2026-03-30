import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// ============================================
// 品牌色 — 与网站 Tailwind 主题一致
// ============================================
const BRAND = {
  navy: '#102a43',
  gold: '#d4af37',
  text: '#44403c',
  textLight: '#78716c',
  border: '#e5e5e5',
  bgLight: '#f5f5f4',
  white: '#ffffff',
};

// ============================================
// i18n
// ============================================
type Locale = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const i18n = {
  title: { ja: '領収書', 'zh-TW': '收據', 'zh-CN': '收据', en: 'Receipt' },
  invoiceNo: { ja: '発行番号', 'zh-TW': '單號', 'zh-CN': '单号', en: 'Receipt No.' },
  issueDate: { ja: '発行日', 'zh-TW': '開立日期', 'zh-CN': '开立日期', en: 'Issue Date' },
  billTo: { ja: 'ご依頼主', 'zh-TW': '客戶資訊', 'zh-CN': '客户信息', en: 'Bill To' },
  name: { ja: 'お名前', 'zh-TW': '姓名', 'zh-CN': '姓名', en: 'Name' },
  email: { ja: 'メール', 'zh-TW': '電郵', 'zh-CN': '邮箱', en: 'Email' },
  serviceDetails: { ja: 'サービス明細', 'zh-TW': '服務明細', 'zh-CN': '服务明细', en: 'Service Details' },
  description: { ja: '内容', 'zh-TW': '項目', 'zh-CN': '项目', en: 'Description' },
  qty: { ja: '数量', 'zh-TW': '數量', 'zh-CN': '数量', en: 'Qty' },
  unitPrice: { ja: '単価', 'zh-TW': '單價', 'zh-CN': '单价', en: 'Unit Price' },
  amount: { ja: '金額', 'zh-TW': '金額', 'zh-CN': '金额', en: 'Amount' },
  taxRate: { ja: '税率', 'zh-TW': '稅率', 'zh-CN': '税率', en: 'Tax Rate' },
  subtotal: { ja: '小計（税抜）', 'zh-TW': '小計（未稅）', 'zh-CN': '小计（未税）', en: 'Subtotal (excl. tax)' },
  consumptionTax: { ja: '消費税（10%）', 'zh-TW': '消費稅（10%）', 'zh-CN': '消费税（10%）', en: 'Consumption Tax (10%)' },
  total: { ja: '合計（税込）', 'zh-TW': '合計（含稅）', 'zh-CN': '合计（含税）', en: 'Total (Tax Incl.)' },
  paymentMethod: { ja: 'お支払い方法', 'zh-TW': '付款方式', 'zh-CN': '付款方式', en: 'Payment Method' },
  creditCard: { ja: 'クレジットカード', 'zh-TW': '信用卡', 'zh-CN': '信用卡', en: 'Credit Card' },
  paymentStatus: { ja: '支払い状況', 'zh-TW': '付款狀態', 'zh-CN': '付款状态', en: 'Payment Status' },
  paid: { ja: '支払い済み', 'zh-TW': '已付款', 'zh-CN': '已付款', en: 'Paid' },
  registrationNo: { ja: '登録番号', 'zh-TW': '登錄番號', 'zh-CN': '登录番号', en: 'Registration No.' },
  legalNote: {
    ja: '本書は電子発行のため押印を省略しております',
    'zh-TW': '本收據為電子開立，免蓋章',
    'zh-CN': '本收据为电子开立，免盖章',
    en: 'This receipt is electronically generated. No stamp required.',
  },
  companyName: { ja: '新島交通株式会社', 'zh-TW': '新島交通株式會社', 'zh-CN': '新岛交通株式会社', en: 'Niijima Kotsu Co., Ltd.' },
} as const;

function t(key: keyof typeof i18n, locale: Locale): string {
  return i18n[key][locale] || i18n[key]['ja'];
}

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: BRAND.text,
  },
  // Header
  header: {
    backgroundColor: BRAND.navy,
    padding: 24,
    marginBottom: 24,
    marginTop: -48,
    marginLeft: -48,
    marginRight: -48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.white,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 8,
    color: '#94a3b8',
    letterSpacing: 3,
    marginTop: 2,
  },
  receiptTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.white,
    textAlign: 'right',
  },
  goldLine: {
    height: 2,
    backgroundColor: BRAND.gold,
    marginTop: 12,
  },
  // Meta info
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaBlock: {},
  metaLabel: {
    fontSize: 8,
    color: BRAND.textLight,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.navy,
  },
  // Customer info
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.navy,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  customerBlock: {
    backgroundColor: BRAND.bgLight,
    padding: 12,
    marginBottom: 20,
  },
  customerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  customerLabel: {
    fontSize: 9,
    color: BRAND.textLight,
    width: 60,
  },
  customerValue: {
    fontSize: 10,
    color: BRAND.text,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BRAND.navy,
    padding: 8,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  colDesc: { width: '40%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTax: { width: '15%', textAlign: 'center' },
  colAmount: { width: '20%', textAlign: 'right' },
  // Tax breakdown
  taxBreakdownBlock: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
  },
  taxLabel: {
    fontSize: 9,
    color: BRAND.textLight,
    marginRight: 24,
    width: 150,
    textAlign: 'right',
  },
  taxValue: {
    fontSize: 10,
    color: BRAND.text,
    width: 100,
    textAlign: 'right',
  },
  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: BRAND.navy,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.white,
    marginRight: 24,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.gold,
    width: 120,
    textAlign: 'right',
  },
  // Payment info
  paymentBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 12,
    backgroundColor: BRAND.bgLight,
  },
  paymentItem: {
    flexDirection: 'row',
  },
  paymentLabel: {
    fontSize: 9,
    color: BRAND.textLight,
    marginRight: 8,
  },
  paymentValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.text,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
  },
  footerDivider: {
    height: 1,
    backgroundColor: BRAND.border,
    marginBottom: 12,
  },
  footerCompany: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.navy,
    marginBottom: 4,
  },
  footerRegistration: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: BRAND.navy,
    marginBottom: 4,
  },
  footerInfo: {
    fontSize: 7.5,
    color: BRAND.textLight,
    lineHeight: 1.6,
  },
  footerLegal: {
    fontSize: 7.5,
    color: BRAND.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
});

// ============================================
// Component
// ============================================
export interface InvoiceData {
  orderId: string;
  orderNumber?: string;
  paidAt: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  totalAmount: number;
  locale: Locale;
}

// 适格请求书登録番号（环境变量或默认值）
const REGISTRATION_NUMBER = process.env.INVOICE_REGISTRATION_NUMBER || 'T6120001231503';

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  const { locale } = data;
  const invoiceNo = data.orderNumber || `#${data.orderId.slice(-8).toUpperCase()}`;

  // ISO 8601 日期（适格请求书要求）
  const paidDate = new Date(data.paidAt);
  const isoDate = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}-${String(paidDate.getDate()).padStart(2, '0')}`;

  const formattedAmount = `¥${data.totalAmount.toLocaleString()}`;

  // 消費税计算（10% 内税）
  const taxRate = 10;
  const taxExclAmount = Math.floor(data.totalAmount * 100 / (100 + taxRate));
  const taxAmount = data.totalAmount - taxExclAmount;
  const formattedTaxExcl = `¥${taxExclAmount.toLocaleString()}`;
  const formattedTax = `¥${taxAmount.toLocaleString()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brandName}>NIIJIMA KOUTSU</Text>
              <Text style={styles.brandSubtitle}>{t('companyName', locale)}</Text>
            </View>
            <Text style={styles.receiptTitle}>{t('title', locale)}</Text>
          </View>
          <View style={styles.goldLine} />
        </View>

        {/* Meta: Invoice No + Date + Registration No */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>{t('invoiceNo', locale)}</Text>
            <Text style={styles.metaValue}>{invoiceNo}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>{t('issueDate', locale)}</Text>
            <Text style={styles.metaValue}>{isoDate}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>{t('registrationNo', locale)}</Text>
            <Text style={styles.metaValue}>{REGISTRATION_NUMBER}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <Text style={styles.sectionTitle}>{t('billTo', locale)}</Text>
        <View style={styles.customerBlock}>
          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>{t('name', locale)}</Text>
            <Text style={styles.customerValue}>{data.customerName}</Text>
          </View>
          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>{t('email', locale)}</Text>
            <Text style={styles.customerValue}>{data.customerEmail}</Text>
          </View>
        </View>

        {/* Service Details Table */}
        <Text style={styles.sectionTitle}>{t('serviceDetails', locale)}</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>{t('description', locale)}</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>{t('qty', locale)}</Text>
          <Text style={[styles.tableHeaderText, styles.colPrice]}>{t('unitPrice', locale)}</Text>
          <Text style={[styles.tableHeaderText, styles.colTax]}>{t('taxRate', locale)}</Text>
          <Text style={[styles.tableHeaderText, styles.colAmount]}>{t('amount', locale)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[{ fontSize: 10 }, styles.colDesc]}>{data.packageName}</Text>
          <Text style={[{ fontSize: 10, textAlign: 'center' }, styles.colQty]}>1</Text>
          <Text style={[{ fontSize: 10, textAlign: 'right' }, styles.colPrice]}>{formattedAmount}</Text>
          <Text style={[{ fontSize: 10, textAlign: 'center' }, styles.colTax]}>10%</Text>
          <Text style={[{ fontSize: 10, textAlign: 'right', fontFamily: 'Helvetica-Bold' }, styles.colAmount]}>{formattedAmount}</Text>
        </View>

        {/* Tax Breakdown（適格請求書 必須項目） */}
        <View style={styles.taxBreakdownBlock}>
          <View style={styles.taxRow}>
            <Text style={styles.taxLabel}>{t('subtotal', locale)}</Text>
            <Text style={styles.taxValue}>{formattedTaxExcl}</Text>
          </View>
          <View style={styles.taxRow}>
            <Text style={styles.taxLabel}>{t('consumptionTax', locale)}</Text>
            <Text style={styles.taxValue}>{formattedTax}</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('total', locale)}</Text>
          <Text style={styles.totalValue}>{formattedAmount}</Text>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentBlock}>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>{t('paymentMethod', locale)}</Text>
            <Text style={styles.paymentValue}>{t('creditCard', locale)}</Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>{t('paymentStatus', locale)}</Text>
            <Text style={[styles.paymentValue, { color: '#16a34a' }]}>{t('paid', locale)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerCompany}>{t('companyName', locale)}</Text>
          <Text style={styles.footerRegistration}>{t('registrationNo', locale)}: {REGISTRATION_NUMBER}</Text>
          <Text style={styles.footerInfo}>
            {'\u3012530-0001 \u5927\u962A\u5E02\u5317\u533A\u6885\u7530\u4E09\u4E01\u76EE2\u756A2\u53F7 JP TOWER OSAKA\nTEL: 06-7777-3353\n\u5927\u962A\u5E9C\u77E5\u4E8B\u767B\u9332\u65C5\u884C\u696D \u7B2C2-3115\u53F7'}
          </Text>
          <Text style={styles.footerLegal}>{t('legalNote', locale)}</Text>
        </View>
      </Page>
    </Document>
  );
}
