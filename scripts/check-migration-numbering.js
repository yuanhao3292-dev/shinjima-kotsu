#!/usr/bin/env node
/**
 * 迁移编号冲突检查
 *
 * 这个项目没有用 Supabase CLI 托管迁移状态，文件名编号是唯一的顺序线索。
 * 一旦两个迁移抢同一个编号，"该按什么顺序应用"就无从判断了。
 *
 * 历史上已经发生过的冲突无法再修（重命名会让文件与已执行的历史对不上），
 * 因此登记在 KNOWN_CONFLICTS 里放行；新增的冲突一律拦截。
 *
 * 用法：node scripts/check-migration-numbering.js
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

/** 已登记的历史冲突，详见 supabase/migrations/README.md */
const KNOWN_CONFLICTS = new Set(['062', '063']);

function main() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'));

  const byNumber = new Map();
  const malformed = [];

  for (const file of files) {
    const match = file.match(/^(\d{3})[_-]/);
    if (!match) {
      malformed.push(file);
      continue;
    }
    const number = match[1];
    if (!byNumber.has(number)) byNumber.set(number, []);
    byNumber.get(number).push(file);
  }

  const errors = [];

  for (const [number, group] of byNumber) {
    if (group.length > 1 && !KNOWN_CONFLICTS.has(number)) {
      errors.push(
        `编号 ${number} 被 ${group.length} 个迁移占用：\n    ${group.join('\n    ')}`
      );
    }
  }

  if (malformed.length > 0) {
    errors.push(
      `以下文件不符合 NNN_描述.sql 命名：\n    ${malformed.join('\n    ')}`
    );
  }

  if (errors.length > 0) {
    console.error('✗ 迁移编号检查未通过：\n');
    for (const error of errors) console.error(`  ${error}\n`);
    console.error('  新迁移请取当前最大编号 +1；历史冲突见 supabase/migrations/README.md');
    process.exit(1);
  }

  const max = [...byNumber.keys()].sort().pop();
  console.log(
    `✓ 迁移编号检查通过（${files.length} 个迁移，当前最大编号 ${max}，` +
      `已登记历史冲突 ${[...KNOWN_CONFLICTS].join('、')}）`
  );
}

main();
