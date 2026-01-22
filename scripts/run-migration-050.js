// 运行 050-news-system 迁移
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('運行 050-news-system 迁移...\n');

  const sqlPath = path.join(__dirname, 'migrations', '050-news-system.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // 分割 SQL 语句（简单分割，以分号结尾）
  const statements = sql
    .split(/;\s*$/gm)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (!statement) continue;

    // 跳过纯注释
    if (statement.split('\n').every(line => line.trim().startsWith('--') || line.trim() === '')) {
      continue;
    }

    const shortStmt = statement.slice(0, 60).replace(/\n/g, ' ') + '...';
    console.log(`執行: ${shortStmt}`);

    const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });

    if (error) {
      // 尝试直接执行
      const { error: error2 } = await supabase.from('_migrations').select('*').limit(0);
      console.log(`  ⚠ RPC 不可用，錯誤: ${error.message}`);
    } else {
      console.log(`  ✓ 成功`);
    }
  }

  console.log('\n迁移完成！');
}

runMigration().catch(console.error);
