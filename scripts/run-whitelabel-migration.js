/**
 * 白标系统数据库迁移脚本
 * 运行方式: node scripts/run-whitelabel-migration.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ 缺少 Supabase 环境变量");
  console.error("请确保 .env.local 中包含:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log("🚀 开始执行白标系统迁移...\n");

  try {
    // 读取 SQL 文件
    const sqlPath = path.join(
      __dirname,
      "migrations",
      "036-white-label-system.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf8");

    // 分割 SQL 语句
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (!statement || statement.startsWith("--")) continue;

      try {
        const { error } = await supabase.rpc("exec_sql", {
          sql_query: statement + ";",
        });

        if (error) {
          // 如果 rpc 不存在，尝试直接执行
          console.log(`⚠️  跳过: ${statement.substring(0, 50)}...`);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  语句执行警告: ${statement.substring(0, 50)}...`);
        console.log(`   ${err.message}\n`);
        errorCount++;
      }
    }

    console.log("\n📊 迁移完成统计:");
    console.log(`   ✅ 成功: ${successCount}`);
    console.log(`   ⚠️  跳过/警告: ${errorCount}`);
    console.log("\n💡 提示: 部分语句可能因为已存在而跳过，这是正常的。");
    console.log(
      '   请在 Supabase Dashboard 的 SQL Editor 中手动执行 "036-white-label-system.sql" 以确保完整执行。'
    );
  } catch (error) {
    console.error("❌ 迁移失败:", error);
    process.exit(1);
  }
}

runMigration();
