const axios = require("axios");

const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const taskPath = "Notes/pending_deletion.json";
const apiBase = `https://api.github.com/repos/${repo}/contents`;

async function getFile(path) {
  const res = await axios.get(`${apiBase}/${encodeURIComponent(path)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

async function deleteFile(path, sha) {
  console.log(`🗑️ 删除 ${path}`);
  await axios.delete(`${apiBase}/${encodeURIComponent(path)}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      message: `Auto delete expired file ${path}`,
      sha: sha
    }
  });
}

async function updateTasks(tasks, fileSha) {
  const content = Buffer.from(JSON.stringify(tasks, null, 2)).toString("base64");
  await axios.put(`${apiBase}/${encodeURIComponent(taskPath)}`, {
    message: `Update pending_deletion.json after cleanup`,
    content: content,
    sha: fileSha
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

(async () => {
  try {
    const now = Date.now();
    const file = await getFile(taskPath);
    const content = JSON.parse(Buffer.from(file.content, 'base64').toString());
    const originalTasks = Array.isArray(content) ? content : [];
    const remainingTasks = [];

    for (const task of originalTasks) {
      if (now >= task.deleteAt) {
        try {
          await deleteFile(task.path, task.sha);
        } catch (err) {
          console.warn(`⚠️ 删除失败：${task.path} - ${err.message}`);
          remainingTasks.push(task); // 保留以便下次重试
        }
      } else {
        remainingTasks.push(task);
      }
    }

    await updateTasks(remainingTasks, file.sha);
    console.log("✅ 清理完成");

  } catch (err) {
    console.error("❌ 出错了", err.message);
    process.exit(1);
  }
})();