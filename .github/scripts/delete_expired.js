const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "../../Notes/pending_deletion.json");
const now = Date.now();

let changed = false;

if (!fs.existsSync(target)) {
  console.log("⛔ 没有找到 pending_deletion.json 文件");
  process.exit(0); // 不报错，正常退出
}

let data = [];
try {
  data = JSON.parse(fs.readFileSync(target, "utf8"));
} catch (e) {
  console.error("❌ 解析 JSON 失败:", e);
  process.exit(1);
}

const keep = [];
for (const item of data) {
  if (now >= item.deleteAt) {
    const filePath = path.join(__dirname, "../../", item.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ 已删除：${item.path}`);
      changed = true;
    } else {
      console.log(`⚠️ 路径不存在：${item.path}`);
    }
  } else {
    keep.push(item);
  }
}

// 更新 JSON
if (changed || keep.length !== data.length) {
  fs.writeFileSync(target, JSON.stringify(keep, null, 2));
  console.log("📝 更新 pending_deletion.json");
  changed = true;
}

process.exit(0);
