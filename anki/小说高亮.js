
小说高亮CSS 二版：

@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap'); /* 确保 Roboto 也可用作备用 */

/* --- 核心卡片样式 (保留优化) --- */
.card {
    font-family: 'Merriweather', 'Roboto', Arial, sans-serif;
    background-color: #ffffff; /* 纯白背景，更清爽 */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 15px; /* 增加内边距 */
    position: relative;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* 柔和阴影 */
    border-radius: 12px; /* 圆角 */
    box-sizing: border-box;
    height: auto;
    max-height: 100%;
    overflow: visible;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* --- 单词和释义 (保留优化) --- */
.word {
    font-size: 2.8rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 15px;
    text-align: center;
    letter-spacing: 0.5px;
    font-family: 'Roboto', sans-serif;
}

.definition, .phonetics {
    font-size: 1.4rem;
    color: #6a6a6a;
    margin-bottom: 25px;
    text-align: center;
    cursor: pointer;
    transition: filter 0.5s ease, color 0.3s ease;
    filter: blur(6px);
    font-family: 'Merriweather', serif;
}

/* --- 正面/背面/来源区块 (保留优化) --- */
.front, .source, .back, .url {
    font-size: 1.1rem;
    color: #333333;
    margin-bottom: 15px;
    padding: 12px 15px;
    box-sizing: border-box;
    width: 100%;
    border-radius: 6px;
    line-height: 1.6;
}

.front, .source {
    background-color: #fff8f8;
    border: 1px solid #e74c3c;
    text-align: left;
}

.back, .url {
    background-color: #f8f8f8;
    border: 1px solid #cccccc;
    text-align: center;
}

.url a, .source a {
    text-decoration: none;
    color: #2980b9;
    font-weight: normal;
    transition: color 0.3s ease;
}

.url a:hover, .source a:hover {
    color: #3498db;
    text-decoration: underline;
}

/* --- 按钮样式 (还原至原始版本) --- */
button.tts-button {
    color: #007bff; /* 设置文本颜色 */
    padding: 10px 20px;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    background: none; /* 去掉背景色 */
    border: none; /* 去掉边框 */
    outline: none; /* 去掉点击时的轮廓 */
    margin: 5px 0;
}

/* 调整两个按钮的位置，居中且底部向上200px (还原至原始定位) */
button#ttsButton,
button#exampleTTSButton {
    position: fixed;
    bottom: 260px; /* 距离底部向上200px */
    left: 50%;
    transform: translateX(-50%); /* 水平居中 */
    opacity: 0.3;
}

/* 调整两个按钮之间的间距 (还原至原始定位) */
button#exampleTTSButton {
    bottom: 200px; /* 第二个按钮距离底部260px */
    opacity: 0.3;
}

/* 隐藏音频元素 */
audio {
    display: none;
}

/* --- 笔记字段样式 (保留优化) --- */
.notes {
    font-size: 0.95rem;
    color: #4a4a4a;
    background-color: #eef5fa;
    border-left: 5px solid #2980b9;
    padding: 15px;
    margin-top: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    line-height: 1.7;
    word-wrap: break-word;
    text-align: left !important;
    display: block;
    height: auto;
    overflow: visible;
    width: 100%;
    font-family: 'Roboto', sans-serif;
}

/* --- 笔记标题样式 (保留优化) --- */
.note {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a1a;
    text-align: left;
    margin-bottom: 15px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-shadow: none;
    border-bottom: 2px solid #2980b9;
    padding: 5px 0;
    background-color: transparent;
    border-radius: 0;
    display: block;
    width: 100%;
    margin: 0 0 15px 0;
    font-family: 'Roboto', sans-serif;
}

/* 确保父容器不限制高度 */
.parent-container {
    height: auto;
    overflow: visible;
}

/* --- 标题样式 (保留优化) --- */
.title {
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 10px 0 25px 0;
    border-bottom: 3px double #3498db;
    padding-bottom: 8px;
    width: 80%;
    max-width: 400px;
}

/* --- 夜间模式 (保留优化) --- */
.nightMode .card {
    background-color: #2c3e50;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

.nightMode .word {
    color: #ecf0f1;
}

.nightMode .definition, .nightMode .phonetics {
    color: #bdc3c7;
}

.nightMode .front, .nightMode .source {
    color: #ecf0f1;
    background-color: #34495e;
    border-color: #c0392b;
}

.nightMode .back, .nightMode .url {
    color: #ecf0f1;
    background-color: #34495e;
    border-color: #7f8c8d;
}

.nightMode .url a, .nightMode .source a {
    color: #5dade2;
}

.nightMode button.tts-button {
    color: #a7c9ff; /* 还原夜间模式的按钮颜色 */
    background: none; /* 还原背景 */
    border: none; /* 还原边框 */
    opacity: 0.3;
}

.nightMode .notes {
    color: #d0d0d0;
    background-color: #34495e;
    border-left-color: #5dade2;
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.05);
}

.nightMode .note {
    color: #ecf0f1;
    border-bottom-color: #5dade2;
}

.nightMode .title {
    color: #ecf0f1;
    border-bottom-color: #5dade2;
}

小说高亮一版：

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

.card {
    font-family: 'Roboto', Arial, sans-serif; /* 使用 Playfair Display 字体 */
    background-color: #f4f4f4; /* 浅灰色背景 */
    display: flex;
    flex-direction: column; /* 垂直布局 */
    justify-content: flex-start; /* 顶部对齐 */
    align-items: center; /* 水平居中 */
    padding: 5px; /* 增加内边距 */
    position: relative; /* 定位调整 */
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3); /* 增强阴影效果 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加卡片阴影 */
    border-radius: 10px; /* 卡片圆角 */
    box-sizing: border-box; /* 避免 padding 影响整体宽高 */
    height: auto; /* 让高度自适应内容 */
    max-height: 100%; /* 不超出容器高度 */
    overflow: visible; /* 禁止滚动 */
}

/* 单词显示 */
.word {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
    text-align: center;
}

.definition, .phonetics {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 20px;
    text-align: center;
    cursor: pointer;
    transition: filter 0.3s ease;
    filter: blur(8px); /* 初始模糊 */
}

/* 正面显示 */
.front, .source {
    font-size: 18px; /* 设置字号为18px */
    color: #444; /* 文字黑色 */
    margin-bottom: 20px;
    text-align: left;
    border: 2px solid red; /* 红色边框 */
    padding: 10px; /* 添加内边距 */
    box-sizing: border-box; /* 确保 padding 不影响元素的宽度和高度 */
    background-color: #fff; /* 背景色设置为白色，确保边框清晰可见 */
}

/* 增强红色边框的可见度 */
.front {
    border: 2px solid #e74c3c; /* 更深的红色边框 */
}

.source {
    border: 2px solid #e74c3c; /* 同样的深红色边框 */
}

/* 正面显示 */
.back, .url {
    font-size: 18px; /* 设置字号为18px */
    color: #444; /* 文字黑色 */
    margin-bottom: 20px;
    text-align: center;
    border: 2px solid black; /* 黑色边框 */
    padding: 10px; /* 添加内边距 */
}

/* 去掉URL下划线 */
.url a {
    text-decoration: none; /* 去掉下划线 */
    color: #444; /* 确保文字颜色为黑色 */
}

/* 按钮样式 */
button.tts-button {
    color: #007bff; /* 设置文本颜色 */
    padding: 10px 20px;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    background: none; /* 去掉背景色 */
    border: none; /* 去掉边框 */
    outline: none; /* 去掉点击时的轮廓 */
    margin: 5px 0;
}

/* 调整两个按钮的位置，居中且底部向上200px */
button#ttsButton,
button#exampleTTSButton {
    position: fixed;
    bottom: 260px; /* 距离底部向上200px */
    left: 50%;
    transform: translateX(-50%); /* 水平居中 */
    opacity: 0.3;
}

/* 调整两个按钮之间的间距 */
button#exampleTTSButton {
    bottom: 200px; /* 第二个按钮距离底部260px */
    opacity: 0.3;
}

/* 隐藏音频元素 */
audio {
    display: none;
}

/* 笔记字段样式 */
.notes {
    font-size: 14px;
    color: #34495e; /* 笔记文字颜色 */
    background-color: #ecf0f1; /* 柔和背景色 */
    border-left: 4px solid #2980b9; /* 左侧彩色边框 */
    padding: 10px; /* 调整内边距，确保文本有足够的空白 */
    margin-top: 10px;
    border-radius: 6px; /* 圆角边框 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
    line-height: 1.6; /* 行高调整 */
    word-wrap: break-word; /* 防止长词溢出 */
    text-align: left !important; /* 使用 !important 强制左对齐 */
    display: block; /* 使元素呈现为块级元素，确保高度自适应 */
    height: auto; /* 高度自适应 */
    overflow: visible; /* 确保不发生溢出 */
}

/* 确保父容器不限制高度 */
.parent-container {
    height: auto; /* 允许父容器高度自适应 */
    overflow: visible; /* 不限制子元素的溢出 */
}

/* .source 字段中的链接样式 */
.source a {
    text-decoration: none;  /* 去掉下划线 */
    color: #444;            /* 设置文本颜色为黑色 */
}

/* 标题样式 */
.note {
    font-size: 24px;               /* 字体更大 */
    font-weight: bold;             /* 字体加粗 */
    color: #222;                   /* 字体颜色稍深 */
    text-align: left;              /* 左对齐 */
    margin-bottom: 15px;           /* 底部间距 */
    letter-spacing: 1px;           /* 字母间距 */
    text-transform: capitalize;    /* 首字母大写 */
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2); /* 轻微文字阴影 */
    border-bottom: 2px solid #2980b9; /* 底部下划线边框 */
    padding: 10px 10px 5px 10px;   /* 内边距，底部间距小一些 */
    background-color: #e0e0e0;     /* 背景色略深 */
    border-radius: 8px;            /* 圆角 */
    display: block;                /* 改为 block，使背景宽度占满屏幕 */
    width: calc(100% - 20px);       /* 背景宽度占满屏幕，左右边距各10px */
    margin: 15 30px;                /* 左右边距10px */
}

/* 夜间模式 */
.nightMode .card {
    background-color: #222; /* 深灰色背景 */
    color: #fff; /* 白色文字 */
    text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.1); /* 调整阴影 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* 更深的阴影 */
}

.nightMode .word {
    color: #fff; /* 白色文字 */
}

.nightMode .definition, .nightMode .phonetics {
    color: #ddd; /* 浅灰色文字 */
}

.nightMode .front, .nightMode .source {
    color: #fff; /* 白色文字 */
    background-color: #333; /* 深灰色背景 */
    border-color: #e74c3c; /* 红色边框保持不变 */
}

.nightMode .back, .nightMode .url {
    color: #fff; /* 白色文字 */
    background-color: #333; /* 深灰色背景 */
    border-color: #555; /* 黑色边框调整为深灰色 */
}

.nightMode .url a {
    color: #fff; /* 白色文字 */
}

.nightMode button.tts-button {
    color: #a7c9ff; /* 调整按钮文字颜色 */
}

.nightMode .notes {
    color: #d0d0d0; /* 调整笔记文字颜色 */
    background-color: #333; /* 深灰色背景 */
    border-left-color: #4ab0ff; /* 调整左侧边框颜色 */
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1); /* 调整阴影 */
}

.nightMode .source a {
    color: #fff; /* 白色文字 */
}

.nightMode .note {
    color: #fff;                   /* 白色字体 */
    background-color: #3a3a3a;     /* 背景色略深 */
    border-bottom-color: #4ab0ff; /* 底部下划线边框 */
    text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.1); /* 轻微文字阴影 */
}


.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;   /* 加粗 */
  margin: 20px 0;
}