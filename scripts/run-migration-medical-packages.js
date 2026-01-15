/**
 * 运行医疗套餐数据库迁移脚本
 * 用法: node scripts/run-migration-medical-packages.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从环境变量加载配置
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误: 缺少 Supabase 配置');
  console.error('请确保 .env.local 包含:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 开始运行医疗套餐数据库迁移...\n');

  // 读取 SQL 文件
  const migrationPath = path.join(__dirname, '../supabase/migrations/001_create_medical_packages_schema.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ 迁移文件不存在: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log(`📄 读取迁移文件: ${migrationPath}`);
  console.log(`📏 SQL 长度: ${sql.length} 字符\n`);

  try {
    // 执行迁移
    console.log('⚙️  执行 SQL 迁移...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      // 如果 RPC 函数不存在，尝试直接执行（需要分段）
      console.log('⚠️  RPC 函数不可用，尝试分段执行...\n');

      // 分割 SQL 语句
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        console.log(`  [${i + 1}/${statements.length}] 执行语句...`);

        const { error: execError } = await supabase.rpc('exec', { sql: statement });

        if (execError) {
          console.error(`  ❌ 语句 ${i + 1} 执行失败:`, execError.message);
          // 某些错误可以忽略（如表已存在）
          if (!execError.message.includes('already exists')) {
            throw execError;
          } else {
            console.log(`  ⚠️  跳过（已存在）`);
          }
        } else {
          console.log(`  ✅ 成功`);
        }
      }
    } else {
      console.log('✅ 迁移执行成功!\n');
    }

    // 验证表是否创建成功
    console.log('🔍 验证表创建...\n');

    const tables = ['medical_packages', 'customers', 'orders', 'payments'];

    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ 表 "${table}" 不存在或无法访问`);
      } else {
        console.log(`  ✅ 表 "${table}" 创建成功 (${count || 0} 行)`);
      }
    }

    // 检查套餐数据
    console.log('\n📦 检查预填充的套餐数据...\n');
    const { data: packages, error: packagesError } = await supabase
      .from('medical_packages')
      .select('*');

    if (packagesError) {
      console.error('  ❌ 无法读取套餐:', packagesError.message);
    } else if (packages && packages.length > 0) {
      console.log(`  ✅ 发现 ${packages.length} 个套餐:`);
      packages.forEach(pkg => {
        console.log(`     - ${pkg.name_zh_tw} (¥${pkg.price_jpy.toLocaleString()})`);
      });
    } else {
      console.log('  ⚠️  没有找到套餐数据');
    }

    console.log('\n🎉 迁移完成！\n');
    console.log('📝 下一步:');
    console.log('  1. 在 Stripe Dashboard 创建对应的产品和价格');
    console.log('  2. 更新数据库中的 stripe_product_id 和 stripe_price_id');
    console.log('  3. 配置 Stripe Webhook');
    console.log('  4. 测试支付流程\n');

  } catch (error) {
    console.error('\n❌ 迁移失败:', error.message);
    console.error('详细错误:', error);
    process.exit(1);
  }
}

// 运行迁移
runMigration();
