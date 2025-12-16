// config.js
// 全局配置文件

const NewsConfig = {
    // 1. 默认的基础路径 (改为使用 jsDelivr CDN 加速，稳定且无需代理)
    // 格式: https://cdn.jsdelivr.net/gh/用户名/仓库名@分支名/路径/
    repoBaseUrl: "https://cdn.jsdelivr.net/gh/moodHappy/HelloWorld@master/Notes/News/",
    fileExtension: ".md",

    // 2. 辅助函数：生成标准文件名 (如 2025-12.md)
    getFileName: function(year, month) {
        return `${year}-${month.toString().padStart(2, '0')}${this.fileExtension}`;
    },

    // 3. 获取最终链接的逻辑
    getUrl: function(year, month) {
        const key = `${year}-${month.toString().padStart(2, '0')}`;

        // 检查 manualOverrides 是否有填内容
        const manualLink = this.manualOverrides[key];

        // 如果填了链接，就用填的；如果没填，就用默认的 CDN 路径
        if (manualLink && manualLink.trim() !== "") {
            return manualLink;
        }
        return this.repoBaseUrl + this.getFileName(year, month);
    },

    // 4. 手动链接列表 (保持不变)
    manualOverrides: {
        // --- 2025年 ---
        "2025-01": "",
        "2025-02": "",
        "2025-03": "",
        "2025-04": "",
        "2025-05": "",
        "2025-06": "",
        "2025-07": "",
        "2025-08": "",
        "2025-09": "",
        "2025-10": "",
        "2025-11": "",
        "2025-12": "", // 2025年 12月

        // ... (你可以保留后面所有的年份配置，这里省略以节省空间) ...
        // 请保留你原来代码中 2026-2054 的所有部分
    },

    // 全局设置
    startYear: 2025,
    totalYears: 30
};
