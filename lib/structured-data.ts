/**
 * JSON-LD 结构化数据
 *
 * 全站此前一处结构化数据都没有。医疗旅游这个垂直里，Organization /
 * BreadcrumbList / FAQPage 都能直接影响搜索结果的呈现形式。
 *
 * ⚠️ 这里的每一项都必须与站上可见内容一致 —— 结构化数据与页面内容不符
 * 属于 Google 明令的作弊（structured data spam），会招致人工处罚。
 * 公司信息取自 /legal/tokushoho（特定商取引法标注页，是法定披露内容）
 * 与 /company/about 的沿革，不要在这里凭空添加未在站上披露的字段。
 */

import { SITE_URL, SITE_NAME } from './seo';

/** 法定披露信息，与 app/legal/tokushoho 保持一致 */
const COMPANY = {
  legalNameJa: '新島交通株式会社',
  legalNameEn: 'Niijima Kotsu Co., Ltd.',
  foundingDate: '2020-02',
  postalCode: '556-0014',
  addressRegion: '大阪府',
  addressLocality: '大阪市浪速区',
  streetAddress: '大国1-2-21-602',
  telephone: '+81-6-6632-8807',
  faxNumber: '+81-6-6632-8826',
  email: 'info@niijima-koutsu.jp',
  /** 大阪府知事登録旅行業 第2-3115号 */
  travelAgencyLicense: '大阪府知事登録旅行業 第2-3115号',
} as const;

/**
 * 组织信息。用 TravelAgency（Organization 的子类型）而非 MedicalBusiness：
 * 本公司是持大阪府知事登録的旅行业者，负责预约代办与随行，医疗行为由
 * 合作医疗机构实施 —— 声明成 MedicalBusiness 与事实不符。
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: COMPANY.legalNameJa,
    alternateName: [COMPANY.legalNameEn, '新岛交通株式会社'],
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    image: `${SITE_URL}/opengraph-image`,
    foundingDate: COMPANY.foundingDate,
    email: COMPANY.email,
    telephone: COMPANY.telephone,
    faxNumber: COMPANY.faxNumber,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      postalCode: COMPANY.postalCode,
      addressRegion: COMPANY.addressRegion,
      addressLocality: COMPANY.addressLocality,
      streetAddress: COMPANY.streetAddress,
    },
    hasCredential: COMPANY.travelAgencyLicense,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: COMPANY.telephone,
        email: COMPANY.email,
        // 与 /legal/tokushoho 上标注的受付时间一致
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          opens: '10:00',
          closes: '18:00',
        },
        availableLanguage: ['ja', 'zh-Hant', 'zh-Hans', 'en', 'ko'],
      },
    ],
  };
}

/** 站点实体，供 Google 关联品牌名与域名 */
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: ['zh-Hant', 'ja', 'zh-Hans', 'en', 'ko'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/**
 * 面包屑。传入从上级到当前页的层级（不含首页，首页由函数自动补在最前）。
 * 只在页面确实存在对应导航层级时使用 —— 造一条页面上不存在的路径同样算不符。
 */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: SITE_NAME, path: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/**
 * FAQ。question/answer 必须是页面上用户可见的原文，
 * answer 里的 HTML 标签要先剥掉。
 */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
