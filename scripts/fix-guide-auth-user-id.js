/**
 * 修复导游表的 auth_user_id 字段
 *
 * 问题：注册时错误地将 Auth User ID 插入到 id 字段，导致登录时无法找到导游记录
 * 解决：将 guides 表中 auth_user_id 为 null 的记录，使用其 id 值填充 auth_user_id
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误：缺少 Supabase 环境变量');
  console.log('请确保 .env.local 中配置了：');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function fixGuideAuthUserIds() {
  console.log('🔍 开始修复导游 auth_user_id 字段...\n');

  try {
    // 1. 查找所有 auth_user_id 为 null 的导游记录
    const { data: guidesWithNullAuthId, error: fetchError } = await supabase
      .from('guides')
      .select('id, email, name, created_at')
      .is('auth_user_id', null);

    if (fetchError) {
      console.error('❌ 查询失败:', fetchError);
      return;
    }

    if (!guidesWithNullAuthId || guidesWithNullAuthId.length === 0) {
      console.log('✅ 没有需要修复的记录');
      return;
    }

    console.log(`📋 找到 ${guidesWithNullAuthId.length} 条需要修复的记录:\n`);
    guidesWithNullAuthId.forEach((guide, index) => {
      console.log(`${index + 1}. ${guide.name} (${guide.email})`);
      console.log(`   ID: ${guide.id}`);
      console.log(`   注册时间: ${new Date(guide.created_at).toLocaleString('zh-CN')}\n`);
    });

    // 2. 为每条记录生成新的 UUID（因为原 id 可能与 auth.users.id 不匹配）
    console.log('⚠️  警告：这些记录的 id 字段与 auth.users.id 不匹配');
    console.log('需要手动处理这些账户：\n');
    console.log('方法 1（推荐）：让用户重新注册');
    console.log('方法 2：手动在数据库中查找对应的 auth.users.id\n');

    // 3. 检查是否有对应的 auth 用户
    for (const guide of guidesWithNullAuthId) {
      // 尝试通过邮箱查找 auth 用户
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.error(`❌ 无法查询 auth 用户:`, authError);
        continue;
      }

      const matchingAuthUser = authUsers.users.find(u => u.email === guide.email);

      if (matchingAuthUser) {
        console.log(`✅ 找到匹配的 auth 用户: ${guide.email}`);
        console.log(`   Auth User ID: ${matchingAuthUser.id}`);
        console.log(`   正在更新...`);

        // 更新 guides 表
        const { error: updateError } = await supabase
          .from('guides')
          .update({ auth_user_id: matchingAuthUser.id })
          .eq('id', guide.id);

        if (updateError) {
          console.error(`   ❌ 更新失败:`, updateError);
        } else {
          console.log(`   ✅ 更新成功！\n`);
        }
      } else {
        console.log(`⚠️  未找到匹配的 auth 用户: ${guide.email}`);
        console.log(`   建议：让用户使用邮箱 ${guide.email} 重新注册\n`);
      }
    }

    console.log('\n✅ 修复完成！');
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error);
  }
}

// 执行修复
fixGuideAuthUserIds();
