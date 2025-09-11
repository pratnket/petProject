#!/usr/bin/env node

/**
 * 安全區域遷移腳本
 * 自動將現有的 SafeAreaView 替換為統一的 PageWrapper 或 ModalWrapper
 */

const fs = require('fs');
const path = require('path');

// 需要遷移的檔案列表
const filesToMigrate = [
  'src/screens/MemberScreen.tsx',
  'src/screens/AuthScreen.tsx',
  'src/modals/LocationModal.tsx',
  'src/modals/DateModal.tsx',
  'src/modals/AnimalModal.tsx',
];

// 遷移規則
const migrationRules = [
  // 替換 SafeAreaView 導入
  {
    pattern:
      /import\s*{\s*SafeAreaView\s*}\s*from\s*['"]react-native-safe-area-context['"];?\s*\n/g,
    replacement:
      "import PageWrapper from '../components/common/PageWrapper';\n",
  },
  // 替換 SafeAreaView 使用
  {
    pattern: /<SafeAreaView\s+style={[^}]+}\s+edges={[^}]+}>\s*\n/g,
    replacement: '<PageWrapper style={styles.container}>\n',
  },
  // 替換 SafeAreaView 結束標籤
  {
    pattern: /<\/SafeAreaView>/g,
    replacement: '</PageWrapper>',
  },
];

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    migrationRules.forEach(rule => {
      const newContent = content.replace(rule.pattern, rule.replacement);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已遷移: ${filePath}`);
    } else {
      console.log(`⏭️  跳過: ${filePath} (無需遷移)`);
    }
  } catch (error) {
    console.error(`❌ 遷移失敗: ${filePath}`, error.message);
  }
}

function main() {
  console.log('🚀 開始安全區域遷移...\n');

  filesToMigrate.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      migrateFile(fullPath);
    } else {
      console.log(`⚠️  檔案不存在: ${filePath}`);
    }
  });

  console.log('\n✨ 遷移完成！');
  console.log('\n📝 注意事項:');
  console.log('1. 請檢查遷移後的檔案是否正確');
  console.log('2. 可能需要手動調整一些樣式');
  console.log('3. 建議執行 yarn lint 檢查語法錯誤');
}

if (require.main === module) {
  main();
}

module.exports = {migrateFile, migrationRules};
