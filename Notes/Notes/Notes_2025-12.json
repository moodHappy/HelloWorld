// Notes_Config.js

const NotesConfig = {
    // 1. 基础路径：指向 Notes/Notes/ 文件夹
    // 配合 index.html 的 CDN 加速逻辑
    repoBaseUrl: "https://cdn.jsdelivr.net/gh/moodHappy/HelloWorld@master/Notes/Notes/",
    
    // 2. 文件后缀
    fileExtension: ".json",

    // 3. 【关键】文件名生成逻辑
    // 你的格式是: Notes_2025-12.json
    getFileName: function(year, month) {
        return `Notes_${year}-${month.toString().padStart(2, '0')}${this.fileExtension}`;
    },

    // 4. 获取最终链接
    getUrl: function(year, month) {
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        // 检查是否有手动覆盖的链接
        if (this.manualOverrides && this.manualOverrides[key]) {
            return this.manualOverrides[key];
        }
        return this.repoBaseUrl + this.getFileName(year, month);
    },

    // 5. 手动链接配置 (在此填入链接可覆盖默认逻辑)
    manualOverrides: {
        "2025-12": "", 
        // ... 其他月份保留为空即可
    },

    // 6. 下拉框范围设置
    startYear: 2025,
    totalYears: 30
};
