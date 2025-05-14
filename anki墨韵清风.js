css：



/* 基础按钮样式 */
.btn {
    background: transparent; /* 背景全透明 */
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
    color: #000000; /* 使用黑色作为按钮文字颜色 */
}

.btn-repeat-ten {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: red;  /* 红色 ▶ 按钮 */
  font-weight: bold;
}

/* 不增不减开始 */
#playWordButton, #playExampleButton {
    display: flex;
    justify-content: center; /* 水平居中 */
    font-size: 24px;
    padding: 10px 20px;
    border-radius: 8px;
    opacity: 0.5;
}

.repeatWordButton {
    display: flex;
    justify-content: center; /* 水平居中 */
    font-size: 24px;
    padding: 10px 20px;
    border-radius: 8px;
    opacity: 0.5;
}



/* 不增不减结束 */

#playWordButton:hover, #playExampleButton:hover {
    opacity: 1;
}

.card {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 采用黑色文字 */
    background-color: #FFFFFF; /* 白色背景 */
    border: 2px solid #CCCCCC; /* 灰色边框 */
    padding: 1px;
    text-align: center;
    text-shadow: none; /* 移除阴影 */
}

.word {
    font-family: 'PingFang SC', Arial, sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #000000; /* 黑色文字 */
    display: inline-block;
    cursor: pointer;
}
.word a {
    color: inherit;
    text-decoration: none;
}

.phonetic, .definition, .example, .translation {
    font-family: 'PingFang SC', Arial, sans-serif;
    color: #000000; /* 统一改为黑色 */
}
.phonetic {
    font-size: 24px;
    margin-top: 10px;
    color: #555555; /* 略浅的灰色 */
}
.definition {
    font-size: 20px;
    margin-top: 15px;
}
.example, .translation {
    font-size: 18px;
    margin-top: 10px;
    color: #555555; /* 使用灰色 */
}

.notes {
    font-family: 'Roboto', 'PingFang SC', sans-serif;
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.6;
    text-align: left;
    color: #000000; /* 黑色文字 */
    background-color: #FFFFFF; /* 白色背景 */
    padding: 15px;
    border: 2px solid #CCCCCC; /* 灰色边框 */
}
.notes span {
    font-size: 20px;
    font-family: 'Lobster';
    color: #333333; /* 深灰色 */
}

.notes img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.notes b, .highlight {
    font-style: italic;
    color: #000000; /* 黑色文字 */
    text-shadow: none; /* 移除阴影 */
}

.source-link {
    color: #000000; /* 黑色链接 */
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
    color: #000000; /* 黑色文字 */
    background-color: #FFFFFF; /* 白色背景 */
    padding: 15px;
    border: 2px solid #CCCCCC; /* 灰色边框 */
    margin-top: 10px;
    text-align: left;
}
.source-news a {
    text-decoration: none;
    color: #000000; /* 黑色链接 */
}
.resources {
    margin-top: 10px;
    padding: 0;
}
.resource-header {
    cursor: pointer;
    padding: 10px;
    background-color: #FFFFFF; /* 白色背景 */
    color: #000000; /* 黑色文字 */
    border: 2px solid #CCCCCC; /* 灰色边框 */
    border-radius: 4px 4px 0 0;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}
.resource-content {
    display: none;
    padding: 10px;
    background-color: #FFFFFF; /* 白色背景 */
    border: 2px solid #CCCCCC; /* 灰色边框 */
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
}
.resource-content a {
    display: block;
    margin-bottom: 5px;
    color: #000000; /* 黑色链接 */
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
    fill: #000000; /* 改为黑色 */
    stroke: #000000;
    opacity: 0.8; /* 调整不透明度 */
}
.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin-top: 10px;
    border: 2px solid #CCCCCC; /* 灰色边框 */
    overflow: hidden;
    max-width: 100%;
    background: #000000;
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
    padding: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1000; /* 保持在最上层 */
}
.bottom-container > div {
    display: inline-block;
}
.typing-effect {
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid #000000; /* 黑色边框 */
    display: inline-block;
    color: #000000; /* 黑色文字 */
}
.news-title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #000000; /* 黑色文字 */
}
.responsive-iframe {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 纵横比 */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    background: #000;
    border: 2px solid #CCCCCC; /* 灰色边框 */
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
    background-color: #FFFFFF; /* 白色背景 */
    color: #000000; /* 黑色文字 */
    border: 2px solid #CCCCCC; /* 灰色边框 */
    border-radius: 4px 4px 0 0;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}
.Twitter-header a {
    text-decoration: none;
    color: #000000; /* 黑色链接 */
}
.notes a {
    text-decoration: none; /* 去掉下划线 */
    color: #000000; /* 黑色链接 */
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
  color: #2c3e50;
  text-align: left;
  margin-bottom: 15px;
  text-transform: capitalize;
  letter-spacing: 1px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to right, rgba(211, 211, 211, 0.7), rgba(211, 211, 211, 0.2)); /* 浅灰色渐变 */
  padding-bottom: 5px;
}