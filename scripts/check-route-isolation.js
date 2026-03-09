#!/usr/bin/env node
/**
 * 路由隔离检查脚本
 * ─────────────────
 * 防止公共官网页面意外链接到导游合伙人内部页面。
 *
 * 规则：
 *   1. 公共页面（components/*, app/非guide-partner/*, lib/config/*）
 *      不得包含指向 /guide-partner/ 内部路径的 href / Link / router.push
 *   2. 允许的例外：
 *      - /guide-partner           （招募落地页）
 *      - /guide-partner/login     （登录入口）
 *      - /guide-partner/register  （注册入口）
 *      - /guide-partner/terms     （合伙人条款）
 *      - import 语句中的代码引用路径（非用户可见链接）
 *
 * 用法：
 *   node scripts/check-route-isolation.js           # 扫描全部公共文件
 *   node scripts/check-route-isolation.js -- file1 file2  # 仅扫描指定文件
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ━━━ 允许链接到的 guide-partner 公开路径（精确匹配） ━━━
const ALLOWED_GP_PATHS = [
  '/guide-partner',
  '/guide-partner/login',
  '/guide-partner/register',
  '/guide-partner/terms',
];

// ━━━ 需要扫描的公共文件目录/模式 ━━━
const PUBLIC_SCAN_DIRS = [
  'components',           // 公共布局、UI 组件
  'app/payment',          // 支付成功/取消
  'app/my-orders',        // 我的订单
  'app/my-account',       // 我的账户
  'app/package-recommender', // 套餐推荐
  'app/health-checkup',   // 精密健检
  'app/health-screening', // AI 健康筛查
  'app/medical-packages', // 体检套餐详情
  'app/cancer-treatment', // 综合治疗 - 癌症
  'app/hyogo-medical',    // 综合治疗 - �的兵库
  'app/kindai-hospital',  // 综合治疗 - 近大
  'app/osaka-himak',      // 综合治疗 - 大阪 HIMAK
  'app/igtc',             // 综合治疗 - IGTC
  'app/sai-clinic',       // 医美 - SAI
  'app/helene-clinic',    // 干细胞 - Helene
  'app/ginza-phoenix',    // 干细胞 - 银座凤凰
  'app/wclinic-mens',     // 医美 - W Clinic
  'app/cell-medicine',    // 干细胞 - Cell Medicine
  'app/ac-plus',          // 干细胞 - AC Plus
  'app/business',         // 商务考察 / 同业合作
  'app/golf',             // 名门高尔夫（如果存在）
  'app/login',            // 会员登录
  'app/register',         // 会员注册
  'app/forgot-password',
  'app/reset-password',
  'app/order-lookup',
  'app/company',
  'app/news',
  'app/faq',
  'app/legal',
  'app/sustainability',
  'lib/config',           // 路由配置
  'lib/constants',        // 常量定义
];

// ━━━ 排除的目录（guide-partner 内部、admin 内部） ━━━
const EXCLUDED_PATTERNS = [
  /[/\\]guide-partner[/\\]/,
  /[/\\]admin[/\\]/,
  /[/\\]node_modules[/\\]/,
  /[/\\]\.next[/\\]/,
  /[/\\]\.git[/\\]/,
];

// ━━━ 匹配所有包含 /guide-partner/ 路径的字符串 ━━━
// 捕获形如：
//   href="/guide-partner/product-center/timc"
//   href={`/guide-partner/dashboard`}
//   router.push('/guide-partner/bookings')
//   sai_clinic: '/guide-partner/product-center/sai-clinic'
//   任何 '...' "..." `...` 中出现的 /guide-partner/xxx 路径
const ROUTE_STRING_PATTERN = /['"`](\/?guide-partner\/[^'"`\s)]+)['"`]/g;

// ━━━ 应跳过的行模式 ━━━
const IMPORT_PATTERN = /^(?:import\s|.*\sfrom\s+['"]@?\/|.*require\s*\(\s*['"]@?\/)/;

function isExcluded(filePath) {
  return EXCLUDED_PATTERNS.some((p) => p.test(filePath));
}

function collectFiles(dir, ext = ['.tsx', '.ts', '.jsx', '.js']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (isExcluded(fullPath)) continue;

    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, ext));
    } else if (ext.some((e) => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 跳过 import / require 语句（代码组织引用，非用户可见链接）
    if (IMPORT_PATTERN.test(line.trim())) continue;

    // 跳过注释行
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

    let match;
    ROUTE_STRING_PATTERN.lastIndex = 0;
    while ((match = ROUTE_STRING_PATTERN.exec(line)) !== null) {
      const linkedPath = '/' + match[1].replace(/^\//, '');

      // 检查是否为允许的公开路径
      const isAllowed = ALLOWED_GP_PATHS.some(
        (allowed) => linkedPath === allowed || linkedPath === allowed + '/'
      );

      if (!isAllowed) {
        violations.push({
          line: i + 1,
          path: linkedPath,
          context: line.trim(),
        });
      }
    }
  }

  return violations;
}

// ━━━ 主程序 ━━━
function main() {
  const args = process.argv.slice(2);
  let filesToCheck = [];

  if (args.includes('--') ) {
    // 仅检查指定文件（lint-staged 模式）
    const fileArgs = args.slice(args.indexOf('--') + 1);
    filesToCheck = fileArgs
      .map((f) => path.resolve(f))
      .filter((f) => !isExcluded(f) && /\.(tsx?|jsx?|js)$/.test(f));
  } else if (args.length > 0 && !args[0].startsWith('-')) {
    // 直接传文件路径
    filesToCheck = args
      .map((f) => path.resolve(f))
      .filter((f) => !isExcluded(f) && /\.(tsx?|jsx?|js)$/.test(f));
  } else {
    // 全量扫描
    for (const dir of PUBLIC_SCAN_DIRS) {
      const fullDir = path.join(ROOT, dir);
      filesToCheck.push(...collectFiles(fullDir));
    }
    // 也检查根级 app/page.tsx
    const rootPage = path.join(ROOT, 'app', 'page.tsx');
    if (fs.existsSync(rootPage)) filesToCheck.push(rootPage);
  }

  if (filesToCheck.length === 0) {
    console.log('✓ 路由隔离检查：无需检查的文件');
    process.exit(0);
  }

  let totalViolations = 0;
  const report = [];

  for (const file of filesToCheck) {
    const violations = checkFile(file);
    if (violations.length > 0) {
      totalViolations += violations.length;
      const relPath = path.relative(ROOT, file).replace(/\\/g, '/');
      report.push({ file: relPath, violations });
    }
  }

  if (totalViolations === 0) {
    console.log(`✓ 路由隔离检查通过（扫描 ${filesToCheck.length} 个文件）`);
    process.exit(0);
  }

  // ━━━ 输出违规报告 ━━━
  console.error('');
  console.error('╔══════════════════════════════════════════════════════════════╗');
  console.error('║  ✗ 路由隔离检查失败 — 公共页面包含导游合伙人内部链接！    ║');
  console.error('╚══════════════════════════════════════════════════════════════╝');
  console.error('');

  for (const { file, violations } of report) {
    console.error(`  📄 ${file}`);
    for (const v of violations) {
      console.error(`     L${v.line}: ${v.path}`);
      console.error(`           ${v.context.substring(0, 120)}`);
    }
    console.error('');
  }

  console.error('─────────────────────────────────────────────────────────────');
  console.error(`  共 ${totalViolations} 处违规，${report.length} 个文件受影响`);
  console.error('');
  console.error('  允许的 guide-partner 链接：');
  for (const p of ALLOWED_GP_PATHS) {
    console.error(`    ✓ ${p}`);
  }
  console.error('');
  console.error('  如需添加新的公开路径例外，请编辑：');
  console.error('    scripts/check-route-isolation.js → ALLOWED_GP_PATHS');
  console.error('─────────────────────────────────────────────────────────────');
  process.exit(1);
}

main();
