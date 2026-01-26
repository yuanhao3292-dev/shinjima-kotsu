/**
 * 推荐奖励触发器迁移脚本运行器
 *
 * 运行方式:
 * 1. 设置环境变量: export SUPABASE_SERVICE_ROLE_KEY="your-key"
 * 2. 运行: node scripts/run-referral-rewards-migration.js
 *
 * 或者直接在 Supabase Dashboard SQL Editor 中运行:
 * scripts/migration-referral-rewards-trigger.sql
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcpcjfqxxtxlbtvbjduk.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.log('============================================');
  console.log('⚠️  未设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  console.log('');
  console.log('请选择以下方式之一运行迁移:');
  console.log('');
  console.log('方式 1: 通过命令行');
  console.log('  export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.log('  node scripts/run-referral-rewards-migration.js');
  console.log('');
  console.log('方式 2: 通过 Supabase Dashboard SQL Editor');
  console.log('  1. 打开 https://supabase.com/dashboard');
  console.log('  2. 进入项目 → SQL Editor');
  console.log('  3. 复制并运行 scripts/migration-referral-rewards-trigger.sql');
  console.log('============================================');
  process.exit(0);
}

async function runMigration() {
  console.log('🚀 开始运行推荐奖励触发器迁移...\n');

  try {
    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, 'migration-referral-rewards-trigger.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 分割 SQL 语句
    const statements = splitStatements(sql);
    console.log(`📋 共 ${statements.length} 条语句待执行\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;

      try {
        await executeSQL(stmt);
        successCount++;
        const preview = stmt.substring(0, 50).replace(/\n/g, ' ').trim();
        console.log(`✅ [${i + 1}/${statements.length}] ${preview}...`);
      } catch (err) {
        if (err.message && (
          err.message.includes('already exists') ||
          err.message.includes('duplicate') ||
          err.message.includes('does not exist')
        )) {
          console.log(`⏭️  [${i + 1}/${statements.length}] 跳过（已存在或不需要）`);
          successCount++;
        } else {
          errorCount++;
          console.error(`❌ [${i + 1}/${statements.length}] ${err.message || err}`);
        }
      }
    }

    console.log('\n========================================');
    console.log(`✅ 成功: ${successCount}`);
    console.log(`❌ 失败: ${errorCount}`);
    console.log('========================================\n');

    if (errorCount === 0) {
      console.log('🎉 迁移完成！推荐奖励触发器已部署。');
    } else {
      console.log('⚠️  部分迁移失败，请手动在 Supabase SQL Editor 中执行完整脚本。');
    }

  } catch (error) {
    console.error('❌ 迁移失败:', error.message);
    console.log('\n请尝试在 Supabase Dashboard SQL Editor 中手动执行:');
    console.log('scripts/migration-referral-rewards-trigger.sql');
  }
}

function splitStatements(sql) {
  const statements = [];
  let current = '';
  let inBlock = false;

  const lines = sql.split('\n');

  for (const line of lines) {
    // 跳过纯注释行
    if (line.trim().startsWith('--')) continue;

    // 检测 $$ 块
    if (line.includes('$$')) {
      inBlock = !inBlock;
    }

    current += line + '\n';

    // 如果不在块内，且行以分号结尾
    if (!inBlock && line.trim().endsWith(';')) {
      statements.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements.filter(s => s && !s.startsWith('--'));
}

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          // RPC 可能不存在，尝试直接通过 SQL Editor 方式
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ sql_query: sql }));
    req.end();
  });
}

runMigration();
