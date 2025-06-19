const fs = require('fs');
const path = require('path');

const deletionFile = path.join(__dirname, '../../Notes/pending_deletion.json');
const now = Date.now();

let changed = false;

if (fs.existsSync(deletionFile)) {
  const items = JSON.parse(fs.readFileSync(deletionFile, 'utf8'));
  const keptItems = [];

  for (const item of items) {
    if (now >= item.deleteAt) {
      const filePath = path.join(__dirname, '../../', item.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Deleted: ${item.path}`);
        changed = true;
      } else {
        console.log(`⚠️ File not found: ${item.path}`);
      }
    } else {
      keptItems.push(item);
    }
  }

  // 更新 JSON 文件
  fs.writeFileSync(deletionFile, JSON.stringify(keptItems, null, 2));
  if (items.length !== keptItems.length) {
    console.log('📝 Updated deletion list');
    changed = true;
  }
}

if (!changed) {
  console.log('🚫 Nothing to delete');
}
