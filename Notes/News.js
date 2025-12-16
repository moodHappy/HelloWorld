// News.js
const NewsConfig = {
    // 1. 基础路径：请仔细检查最后有没有 "/"
    repoBaseUrl: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/News/",
    fileExtension: ".md",

    // 2. 文件名生成规则
    // 注意：这里强制补全两位数。例如 8月 -> "08"
    // 如果你的GitHub文件是 "2025-8.md" (没有0)，请把 .padStart(2, '0') 删掉
    getFileName: function(year, month) {
        return `${year}-${month.toString().padStart(2, '0')}${this.fileExtension}`;
    },

    // 3. 获取链接逻辑 (增强版)
    getUrl: function(year, month) {
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        
        // 获取你填写的链接
        const manualLink = this.manualOverrides[key];

        // 逻辑：只有当你填了东西，且长度大于5（防止误填空格）时，才用你的链接
        // 否则，一律使用默认路径
        if (manualLink && typeof manualLink === 'string' && manualLink.length > 5) {
            return manualLink;
        }
        
        // 自动生成: 基础路径 + 2025-08.md
        return this.repoBaseUrl + this.getFileName(year, month);
    },

    // 4. 手动链接配置
    manualOverrides: {
        // 2025年 (留空 = 自动模式)
        "2025-01": "", "2025-02": "", "2025-03": "", "2025-04": "",
        "2025-05": "", "2025-06": "", "2025-07": "", "2025-08": "",
        "2025-09": "", "2025-10": "", "2025-11": "", "2025-12": "",
        
        // 2026年
        "2026-01": "", "2026-02": "", "2026-03": "", "2026-04": "",
        "2026-05": "", "2026-06": "", "2026-07": "", "2026-08": "",
        "2026-09": "", "2026-10": "", "2026-11": "", "2026-12": "",

        // ... 后续年份请自行保留 ...
        
        "2054-12": "" 
    },

    startYear: 2025,
    totalYears: 30
};
