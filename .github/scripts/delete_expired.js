const fs = require("fs");
const path = require("path");

// tracked_files.json 的路径
const TRACKED_FILES_TARGET = path.join(__dirname, "../../Notes/tracked_files.json");
const now = Date.now(); // 当前时间戳

let changed = false; // 标记文件是否有变动

// 检查 tracked_files.json 文件是否存在
if (!fs.existsSync(TRACKED_FILES_TARGET)) {
  console.log("⛔ 没有找到 tracked_files.json 文件，无需处理。");
  process.exit(0); // 不报错，正常退出
}

let allTrackedFiles = [];
try {
  // 读取并解析 tracked_files.json
  allTrackedFiles = JSON.parse(fs.readFileSync(TRACKED_FILES_TARGET, "utf8"));
  if (!Array.isArray(allTrackedFiles)) {
      console.warn("⚠️ tracked_files.json 内容格式不正确（非数组），将初始化为空数组。");
      allTrackedFiles = [];
  }
} catch (e) {
  console.error("❌ 解析 tracked_files.json 失败:", e);
  process.exit(1);
}

// 过滤出未过期且文件仍然存在的文件，并删除已过期文件
const filesToKeep = [];
for (const fileEntry of allTrackedFiles) {
  // 检查是否有 deleteAt 字段，并且是否已过期
  if (fileEntry.deleteAt && now >= new Date(fileEntry.deleteAt).getTime()) {
    const filePath = path.join(__dirname, "../../", fileEntry.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // 删除实际文件
      console.log(`🗑️ 已删除文件：${fileEntry.path}`);
      changed = true;
    } else {
      console.log(`⚠️ 文件路径不存在：${fileEntry.path}，已从记录中移除。`);
      // 即使文件不存在，也应该将其从记录中移除，因为它“过期”了
      changed = true;
    }
  } else {
    // 如果没有 deleteAt 字段，或者未过期，则保留
    filesToKeep.push(fileEntry);
  }
}

// 如果有文件被删除或记录被清理，则更新 tracked_files.json
if (changed || filesToKeep.length !== allTrackedFiles.length) {
  fs.writeFileSync(TRACKED_FILES_TARGET, JSON.stringify(filesToKeep, null, 2));
  console.log("📝 tracked_files.json 已更新。");
  changed = true; // 确认有变动，用于git commit
} else {
  console.log("✅ tracked_files.json 无需更新。");
}

// 你的 GitHub Actions 脚本会处理 git commit 和 push，
// 这里只需要确保脚本以成功状态退出，以便 Actions 继续执行后续步骤。
process.exit(0);
