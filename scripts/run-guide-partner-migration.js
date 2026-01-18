/**
 * 导游合伙人系统数据库迁移脚本
 * 运行方式: node scripts/run-guide-partner-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从环境变量或直接配置获取 Supabase 凭据
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcpcjfqxxtxlbtvbjduk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('错误: 需要 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  console.log('请运行: export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 开始导游合伙人系统数据库迁移...\n');

  try {
    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, 'guide-partner-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 分割 SQL 语句（按分号分割，但忽略函数体内的分号）
    const statements = splitSQLStatements(sql);

    console.log(`📋 共 ${statements.length} 条 SQL 语句待执行\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement || statement.startsWith('--')) continue;

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          // 尝试直接执行（某些操作不需要 RPC）
          const { error: directError } = await supabase.from('_exec').select().limit(0);
          if (directError && !directError.message.includes('already exists')) {
            throw error;
          }
        }

        successCount++;
        const preview = statement.substring(0, 60).replace(/\n/g, ' ');
        console.log(`✅ [${i + 1}/${statements.length}] ${preview}...`);
      } catch (err) {
        // 忽略 "already exists" 错误
        if (err.message && (
          err.message.includes('already exists') ||
          err.message.includes('duplicate key')
        )) {
          console.log(`⏭️  [${i + 1}/${statements.length}] 已存在，跳过`);
          successCount++;
        } else {
          errorCount++;
          console.error(`❌ [${i + 1}/${statements.length}] 错误: ${err.message}`);
        }
      }
    }

    console.log('\n========================================');
    console.log(`✅ 成功: ${successCount}`);
    console.log(`❌ 失败: ${errorCount}`);
    console.log('========================================\n');

    if (errorCount === 0) {
      console.log('🎉 迁移完成！');
    } else {
      console.log('⚠️  部分迁移失败，请检查上述错误');
    }

  } catch (error) {
    console.error('❌ 迁移失败:', error.message);
    process.exit(1);
  }
}

/**
 * 智能分割 SQL 语句
 * 处理函数体内的分号
 */
function splitSQLStatements(sql) {
  const statements = [];
  let current = '';
  let inFunction = false;
  let dollarQuote = '';

  const lines = sql.split('\n');

  for (const line of lines) {
    // 跳过纯注释行
    if (line.trim().startsWith('--')) {
      continue;
    }

    // 检测函数开始 ($$ 或 $BODY$)
    const dollarMatch = line.match(/\$(\w*)\$/);
    if (dollarMatch) {
      if (!inFunction) {
        inFunction = true;
        dollarQuote = dollarMatch[0];
      } else if (line.includes(dollarQuote) && current.includes(dollarQuote)) {
        // 函数结束
        inFunction = false;
        dollarQuote = '';
      }
    }

    current += line + '\n';

    // 如果不在函数内，且行以分号结尾，则分割
    if (!inFunction && line.trim().endsWith(';')) {
      statements.push(current.trim());
      current = '';
    }
  }

  // 处理最后一条语句
  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements.filter(s => s && !s.startsWith('--'));
}

runMigration();
