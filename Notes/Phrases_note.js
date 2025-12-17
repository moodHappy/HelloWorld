// Notes_Config.js
// 单词/笔记专用配置文件

const NotesConfig = {
    // 1. 默认的基础路径 
    // 注意：根据你的描述，JSON文件在 Notes/Notes/ 目录下
    repoBaseUrl: "https://cdn.jsdelivr.net/gh/moodHappy/HelloWorld@master/Notes/Notes/",
    
    // 2. 文件后缀
    fileExtension: ".json",

    // 3. 辅助函数：生成标准文件名 
    // 你的格式是: Notes_2025-12.json
    getFileName: function(year, month) {
        return `Notes_${year}-${month.toString().padStart(2, '0')}${this.fileExtension}`;
    },

    // 4. 获取最终链接的逻辑
    getUrl: function(year, month) {
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        const manualLink = this.manualOverrides[key];

        if (manualLink && manualLink.trim() !== "") {
            return manualLink;
        }
        return this.repoBaseUrl + this.getFileName(year, month);
    },

    // 5. 手动链接列表 (2025-2054)
    manualOverrides: {
        // --- 2025年 ---
        "2025-01": "", "2025-02": "", "2025-03": "", "2025-04": "",
        "2025-05": "", "2025-06": "", "2025-07": "", "2025-08": "",
        "2025-09": "", "2025-10": "", "2025-11": "", "2025-12": "",
        // ... (此处为了节省篇幅省略中间年份，实际使用时请保留你原来的完整30年列表) ...
        // 建议直接复用你 News.js 里的那个长列表，结构是一样的
    },

    startYear: 2025,
    totalYears: 30
};
