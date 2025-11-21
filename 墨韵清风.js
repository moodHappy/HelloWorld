
css：

/* 基础按钮样式 */
.btn {
    background: transparent !important; /* 背景全透明 */
    border: none;
    padding: 2px 4px;
    text-align: center;
    font-size: 16px; /* 文本的大小 */
    font-family: Arial, sans-serif;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 10px;
    display: inline-block;
    color: #000000; /* 使用黑色作为按钮文字颜色 (白天模式) */
}

.btn-repeat-ten {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: transparent !important; /* 去掉背景色 */
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: red;  /* 红色 ▶ 按钮 */
  font-weight: bold;
  z-index: 1001; /* Ensure it's above potential overlapping elements */
}

/* 不增不减开始 */
#playWordButton, #playExampleButton {
    display: flex;
    justify-content: center; /* 水平居中 */
    font-size: 24px;
    padding: 10px 20px;
    border-radius: 8px;
    opacity: 0.5;
    background-color: transparent !important; /* 去掉背景色 */
    color: #000000; /* 默认黑色 */
}

.repeatWordButton {
    display: flex;
    justify-content: center; /* 水平居中 */
    font-size: 24px;
    padding: 10px 20px;
    border-radius: 8px;
    opacity: 0.5;
    background-color: transparent !important; /* 去掉背景色 */
    color: #000000; /* 默认黑色 */
}

/* 不增不减结束 */

#playWordButton:hover, #playExampleButton:hover {
    opacity: 1;
}

.card {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 采用黑色文字 (白天模式) */
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    padding: 1px;
    text-align: center;
    text-shadow: none; /* 移除阴影 */
}

.word {
    font-family: 'PingFang SC', Arial, sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #000000; /* 黑色文字 (白天模式) */
    display: inline-block;
    cursor: pointer;
}
.word a {
    color: inherit;
    text-decoration: none;
}

.phonetic, .definition, .example, .translation {
    font-family: 'PingFang SC', Arial, sans-serif;
    color: #000000; /* 统一改为黑色 (白天模式) */
}
.phonetic {
    font-size: 24px;
    margin-top: 10px;
    color: #555555; /* 略浅的灰色 (白天模式) */
}
.definition {
    font-size: 20px;
    margin-top: 15px;
}
.example, .translation {
    font-size: 18px;
    margin-top: 10px;
    color: #555555; /* 使用灰色 (白天模式) */
}

.notes {
    font-family: 'Roboto', 'PingFang SC', sans-serif;
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.6;
    text-align: left;
    color: #000000; /* 黑色文字 (白天模式) */
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    padding: 15px;
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
}
.notes span {
    font-size: 20px;
    font-family: 'Lobster';
    color: #333333; /* 深灰色 (白天模式) */
}

.notes img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.notes b, .highlight {
    font-style: italic;
    color: #000000; /* 黑色文字 (白天模式) */
    text-shadow: none; /* 移除阴影 */
}

.source-link {
    color: #000000; /* 黑色链接 (白天模式) */
    text-decoration: none;
    display: block;
    text-align: right;
    font-family: 'cursive';
    font-size: 28px;
    font-weight: bold;
    padding: 0;
}
.source-news {
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    color: #000000; /* 黑色文字 (白天模式) */
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    padding: 15px;
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    margin-top: 10px;
    text-align: left;
}
.source-news a {
    text-decoration: none;
    color: #000000; /* 黑色链接 (白天模式) */
}
.resources {
    margin-top: 10px;
    padding: 0;
}
.resource-header {
    cursor: pointer;
    padding: 10px;
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    color: #000000; /* 黑色文字 (白天模式) */
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    border-radius: 4px 4px 0 0;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}
.resource-content {
    display: none;
    padding: 10px;
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
}
.resource-content a {
    display: block;
    margin-bottom: 5px;
    color: #000000; /* 黑色链接 (白天模式) */
    text-decoration: none;
}
.resource-content a:hover {
    text-decoration: underline;
}
.replay-button {
    margin-top: 10px;
    cursor: pointer;
}
.replay-button svg {
    width: 24px;
    height: 24px;
}
.replay-button svg circle, .replay-button svg path {
    fill: #000000; /* 改为黑色 (白天模式) */
    stroke: #000000;
    opacity: 0.8; /* 调整不透明度 */
}
.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin-top: 10px;
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    overflow: hidden;
    max-width: 100%;
    background: #000000; /* 黑色背景 (白天模式) - 可能需要调整夜间模式 */
}
.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.bottom-container {
    position: fixed;
    bottom: 100px; /* 移动至页面底部 */
    left: 0;
    width: 100%;
    background-color: transparent; /* 透明背景 */
    padding: 0; /* Reduced padding to potentially remove the bar */
    display: flex;
    gap: 10px;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1000; /* Keep it on top */
}
.bottom-container > div {
    display: inline-block;
}
.typing-effect {
    white-space: nowrap;
    overflow: hidden;
    border-right: none !important; /* 移除打字效果的边框 */
    display: inline-block;
    color: #000000; /* 黑色文字 (白天模式) */
}
.news-title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #000000; /* 黑色文字 (白天模式) */
}
.responsive-iframe {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 纵横比 */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    background: #000; /* 黑色背景 (白天模式) - 可能需要调整夜间模式 */
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    margin-top: 10px; /* 上边距 10px */
}
.responsive-iframe iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none; /* 去掉 iframe 自带的边框 */
}
.Twitter-header {
    cursor: pointer;
    padding: 10px;
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    color: #000000; /* 黑色文字 (白天模式) */
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    border-radius: 4px 4px 0 0;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}
.Twitter-header a {
    text-decoration: none;
    color: #000000; /* 黑色链接 (白天模式) */
}
.notes a {
    text-decoration: none; /* 去掉下划线 */
    color: #000000; /* 黑色链接 (白天模式) */
}
.centered-container {
    position: fixed;
    bottom: 200px; /* 上移200px */
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    width: 100%;
}


.note {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50; /* 深蓝色 (白天模式) */
  text-align: left;
  margin-bottom: 15px;
  text-transform: capitalize;
  letter-spacing: 1px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to right, rgba(211, 211, 211, 0.7), rgba(211, 211, 211, 0.2)); /* 浅灰色渐变 (白天模式) */
  padding-bottom: 5px;
}

  .typing-effect {
    /* Ensure the typing effect border is removed */
    border-right: none !important;
  }

/* 夜间模式样式 */
@media (prefers-color-scheme: dark) {
    body {
        color: #FFFFFF; /* 夜间模式文字颜色为白色 */
        background-color: #121212; /* 夜间模式背景颜色为深灰色或黑色 */
    }

    .btn {
        color: #FFFFFF; /* 按钮文字夜间模式白色 */
    }

    #playWordButton, #playExampleButton, .repeatWordButton {
        color: #FFFFFF; /* 夜间模式白色 */
    }

    .card {
        color: #FFFFFF; /* 卡片文字夜间模式白色 */
        background-color: #333333; /* 卡片背景夜间模式深灰色 */
        border-color: #555555; /* 卡片边框夜间模式深灰色 */
    }

    .word {
        color: #FFFFFF; /* 夜间模式白色 */
    }

    .phonetic, .definition, .example, .translation, .notes, .source-link, .source-news, .resource-header, .resource-content a, .replay-button svg circle, .replay-button svg path, .news-title, .note, .typing-effect, .notes span, .notes b, .highlight, .source-news a, .Twitter-header a {
        color: #FFFFFF; /* 其他文本元素在夜间模式下也显示白色 */
    }

    .phonetic {
        color: #AAAAAA; /* 略浅的灰色 (夜间模式) */
    }

    .example, .translation {
        color: #AAAAAA; /* 使用灰色 (夜间模式) */
    }

    .notes {
        background-color: #333333; /* 调整容器背景色 */
        border-color: #555555; /* 调整边框颜色 */
    }

    .source-news {
        background-color: #333333;
        border-color: #555555;
    }

    .resource-header {
        background-color: #333333;
        border-color: #555555;
    }

    .resource-content {
        background-color: #333333;
        border-color: #555555;
    }

    .video-container {
        background: #333333; /* 调整视频容器背景色 */
        border-color: #555555;
    }

    .responsive-iframe {
        background: #333333; /* 调整 iframe 容器背景色 */
        border-color: #555555;
    }

    .Twitter-header {
        background-color: #333333;
        border-color: #555555;
        color: #FFFFFF;
    }

    .note {
        color: #eee; /* 浅灰色 (夜间模式) */
        background: linear-gradient(to right, rgba(51, 51, 51, 0.7), rgba(51, 51, 51, 0.2)); /* 深灰色渐变 (夜间模式) */
    }
}




/* 图片容器样式 */
.image {
    margin-top: 15px; /* 与上方内容的间距 */
    text-align: left; /* 图片居中显示 */
    padding: 10px; /* 内部边距 */
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    border-radius: 8px; /* 圆角边框 */
    overflow: hidden; /* 隐藏超出容器的部分 */
}

.image img {
    max-width: 100%; /* 图片最大宽度为容器的100% */
    height: auto; /* 高度自动调整，保持图片比例 */
    display: block; /* 移除图片底部可能存在的额外空间 */
    margin: 0 auto; /* 确保图片在容器内水平居中 */
    border-radius: 4px; /* 图片本身也带一点圆角 */
}

/* 夜间模式样式 */
@media (prefers-color-scheme: dark) {
    .image {
        border-color: #555555; /* 夜间模式边框颜色 */
        background-color: #333333; /* 夜间模式背景颜色 */
    }
}









/* 新增短语容器样式 */
.phrases-container {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 黑色文字 (白天模式) */
    background-color: #FFFFFF; /* 白色背景 (白天模式) */
    padding: 15px;
    border: 2px solid #CCCCCC; /* 灰色边框 (白天模式) */
    margin-top: 20px; /* 增加与上方内容的间距 */
    text-align: left; /* 左对齐 */
    line-height: 1.8; /* 增加行高以提高可读性 */
    border-radius: 8px; /* 圆角边框 */
}

.phrase {
    margin-bottom: 10px; /* 每个短语之间的间距 */
    font-size: 16px; /* 短语文本大小 */
}

.phrase-label {
    font-weight: bold; /* 短语标签加粗 */
    color: #333333; /* 略深一点的颜色 (白天模式) */
    margin-right: 5px; /* 标签与内容之间的间距 */
}

/* 夜间模式样式 */
@media (prefers-color-scheme: dark) {
    .phrases-container {
        color: #FFFFFF; /* 夜间模式文字颜色为白色 */
        background-color: #333333; /* 夜间模式背景颜色为深灰色 */
        border-color: #555555; /* 夜间模式边框颜色为深灰色 */
    }

    .phrase-label {
        color: #AAAAAA; /* 夜间模式略浅的灰色 */
    }
}