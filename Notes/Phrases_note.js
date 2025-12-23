// Phrases_note.js
// 单词/笔记专用配置文件
// 适用范围：2025 - 2054 (30年)

const NotesConfig = {
    // 1. 默认的基础路径 
    // 指向 Notes 根目录，以便后续拼接 "年份/文件名"
    repoBaseUrl: "https://cdn.jsdelivr.net/gh/moodHappy/HelloWorld@master/Notes/",

    // 2. 文件后缀
    fileExtension: ".json",

    // 3. 核心配置：起始年份与跨度
    startYear: 2025,
    totalYears: 30,

    // 4. 生成文件名的逻辑 (关键修改)
    // 目标结构: [Year]/Note_[Year]-[Month].json
    getFileName: function(year, month) {
        // 确保月份是两位数 (1 -> 01)
        const mm = month.toString().padStart(2, '0');
        
        // 修改点：
        // 1. 增加了 `${year}/` 目录前缀
        // 2. 将 'Notes_' 改为了单数 'Note_'
        return `${year}/Note_${year}-${mm}${this.fileExtension}`;
    },

    // 5. 获取最终链接的逻辑
    getUrl: function(year, month) {
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        
        // 优先检查是否有手动覆盖的链接
        if (this.manualOverrides && this.manualOverrides[key]) {
            const manualLink = this.manualOverrides[key];
            if (manualLink.trim() !== "") {
                return manualLink;
            }
        }
        
        // 否则使用自动生成的 GitHub/CDN 链接
        return this.repoBaseUrl + this.getFileName(year, month);
    },

    // 6. 手动链接占位符
    // (下方的循环代码会自动填充满30年，无需手动列出)
    manualOverrides: {
        // 示例：如果某个月份不走 GitHub，想走自己的服务器，可以在这里填
        // "2025-01": "https://example.com/special-file.json",
    }
};

// ==========================================
// 自动初始化 30 年的空配置 (2025 - 2054)
// 避免手动写 360 行代码
// ==========================================
(function initYears() {
    const start = NotesConfig.startYear;
    const end = start + NotesConfig.totalYears;

    for (let y = start; y < end; y++) {
        for (let m = 1; m <= 12; m++) {
            const key = `${y}-${m.toString().padStart(2, '0')}`;
            // 只有当该 key 不存在时才初始化为空字符串
            if (!NotesConfig.manualOverrides.hasOwnProperty(key)) {
                NotesConfig.manualOverrides[key] = "";
            }
        }
    }
    // console.log("Phrases_note.js: 30年配置已就绪");
})();
