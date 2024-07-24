## 简化news代码：

## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">
<div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
<div class="phonetic">{{音标}}</div>
<div class="definition">{{释义}}</div>
<div class="example">{{例句}}</div>
<div class="translation">{{例句翻译}}</div>
<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>
{{#Source-news}}
<div class="source-news">
<div class="news-title">News</div>
<hr style="border: 1px solid grey;">
// 若TTS失效则用{{Source-news}}，从此处开始：
<script>
function createLink() {
var field = "{{Source-news}}"; // 确保字段名称与实际一致
var parts = field.split('|');
if (parts.length === 2) {
document.getElementById('link').innerHTML = '<a href="' + parts[0] + '" target="_blank">' + parts[1] + '</a>';
} else {
document.getElementById('link').innerHTML = field; // 如果格式不正确，则直接显示内容
}
}
window.onload = createLink;
</script>
<div id="link"></div>
// 到此处替换结束{{Source-news}}
</div>
{{/Source-news}}
<div class="Twitter-header">
<a href="#" onclick="searchTwitter()">Twitter网页搜索</a>
</div>
<div class="resources">
<div class="resource-header">点击展开/折叠资源链接</div>
<div id="resource1" class="resource-content">
<div class="video">
<a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
</div>
<div class="Twitter">
<a href="#" onclick="searchTwitter()">Twitter网页</a>
</div>
<div class="Twitter">
<a href="twitter://search?query={{单词}}" target="_blank">Twitter客户端</a>
</div>
<div class="Threads">
<a href="https://www.threads.net/search?q={{单词}}" target="_blank">搜索 Threads</a>
</div>
<div class="giphy">
<a href="https://giphy.com/search/{{单词}}" target="_blank">Gif查</a>
</div>
<div class="dictionary">
<a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
</div>
<div class="dictionary">
<a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌查</a>
</div>
<div class="dictionary">
<a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
</div>
<div class="dictionary">
<a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
</div>
<div class="dictionary">
<a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
</div>
<div class="dictionary">
<a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
</div>
<div class="dictionary">
<a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
</div>
</div>
</div>
<div class="notes">
{{笔记}}<br>
</div>
<div id="video-container" class="video-container">
<iframe src="https://www.youtube.com/embed/{{YouTube-Video}}" frameborder="0" allowfullscreen></iframe>
</div>
<script>
document.addEventListener("DOMContentLoaded", function() {
// Toggle content display
function toggleContent(id) {
var content = document.getElementById(id);
if (content.style.display === "none" || content.style.display === "") {
content.style.display = "block";
} else {
content.style.display = "none";
}
}
// Attach click event to resource header
var resourceHeader = document.querySelector(".resource-header");
resourceHeader.addEventListener("click", function() {
toggleContent('resource1');
});
// Highlight word forms in notes
var wordElement = document.querySelector(".word");
var notesElement = document.querySelector(".notes");
var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
var notesText = notesElement.innerHTML.trim();
var wordFormsRegex = new RegExp('\\b(' +
wordText + '|' +
wordText + 's?' + '|' +
wordText.replace(/y$/, 'i') + 'es?' + '|' +
wordText + 'ed' + '|' +
wordText + 'ing' + '|' +
wordText + 'd' + '|' +
wordText + 'er' + '|' +
wordText + 'est' + '|' +
wordText + 'ly' + '|' +
wordText.replace(/y$/, 'ily') + '|' +
wordText.replace(/ic$/, 'ically') + '|' +
wordText.replace(/le$/, 'ly') +
')\\b', 'gi');
var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
return '<strong class="highlight">' + match + '</strong>';
});
notesElement.innerHTML = formattedNotes;
// Hide video container if no source URL
var videoContainer = document.getElementById("video-container");
var sourceURL = "{{YouTube-Video}}";
if (!sourceURL) {
videoContainer.style.display = "none";
}
});
</script>
<script>
document.addEventListener('DOMContentLoaded', function() {
const iframe = document.querySelector('#video-container iframe');
if (iframe) {
let src = iframe.src;
src = src.replace('https://youtu.be/', '');
iframe.src = src;
}
});
</script>
<div class="bottom-container">
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:单词}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:例句}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:Source-news}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:笔记}}
</div>
</div>
<div class="responsive-iframe">
<iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{Dailymotion-Video}}" allowfullscreen></iframe>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
// 获取 dailymotion-Video 字段的值
var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整
// 如果视频 ID 为空，则移除包含 iframe 的 div
if (!dailymotionVideoId) {
var videoContainer = document.querySelector('.responsive-iframe');
if (videoContainer) {
videoContainer.parentNode.removeChild(videoContainer);
}
}
});
</script>
<script>
function getVideoId(url) {
// 匹配 dailymotion 视频 URL 并提取视频 ID
const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
return match ? match[1] : '';
}
document.addEventListener('DOMContentLoaded', () => {
const dailymotionVideo = '{{Dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
const videoId = getVideoId(dailymotionVideo); // 提取视频 ID
if (videoId) {
// 将 iframe 的 src 属性设置为提取到的视频 ID
document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
}
});
</script>
<script>
function searchTwitter() {
window.open("https://twitter.com/search?q=" + encodeURIComponent("{{单词}}"), "_blank");
}
</script>
</body>
</html>
```

## 正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smooth</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
</head>
<body>
<div class="card">
<div class="word typing-effect" id="animated-text"></div>
<div class="phonetic" id="phonetic-text"></div>
</div>
<script>
const word = "{{单词}}";
const container = document.getElementById("animated-text");
const phoneticContainer = document.getElementById("phonetic-text");
const eudicURL = `eudic://dict/${word}`;
let index = 0;
function typeLetter() {
if (index < word.length) {
container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
index++;
setTimeout(typeLetter, 500);
} else {
container.style.borderRight = 'none';
}
}
phoneticContainer.textContent = "{{音标}}";
typeLetter();
</script>
<script>
var tTitle = document.getElementById("s6").innerHTML;
var uURL = document.getElementById("s5").innerHTML;
var sentence = localStorage.getItem('sentence');
document.getElementById('sentence').innerText = sentence;
if (uURL != "") {
var para = document.createElement("p");
para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
var node = document.createTextNode("");
para.appendChild(node);
var element = document.getElementById("div1");
var child = document.getElementById("answer");
element.insertBefore(para, child);
} else {
var para = document.createElement("p");
para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
var node = document.createTextNode("");
para.appendChild(node);
var element = document.getElementById("div1");
var child = document.getElementById("answer");
element.insertBefore(para, child);
}
</script>
<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
<div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
</div>
</body>
```







🥰🥰🥰
# 剥离出Twitter
# 正面不变
# css：
```
.card {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 黑色文本 */
    background-color: #fffde7; /* 浅黄色背景 */
    border: 2px solid #00796b; /* 深绿色边框 */
    padding: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}



.word {
    font-family: 'PingFang SC', Arial, sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #00796b; /* 深绿色文字 */
    display: inline-block;
    cursor: pointer;
}

.word a {
    color: inherit;
    text-decoration: none;
}

.phonetic, .definition, .example, .translation {
    font-family: 'PingFang SC', Arial, sans-serif;
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.definition {
    font-size: 20px;
    margin-top: 15px;
    color: #004d40; /* 更深的绿色 */
}

.example, .translation {
    font-size: 18px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.notes {
    font-family: 'Roboto', 'PingFang SC', sans-serif;
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.6;
    text-align: left;
    color: #000000;
    background-color: #c8e6c9; /* 亮绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
}

.notes span {
    font-size: 20px;
    font-family: 'Lobster';  
}

.notes b, .highlight {
    font-style: italic;
    text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
}

.source-link {
    color: #00796b; /* 深绿色 */
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
    color: #000000;
    background-color: #e0f2f1; /* 亮青绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
    margin-top: 10px;
    text-align: left;
}

.source-news a {
    text-decoration: none;
    color: #004d40; /* 更深的绿色 */
}

.resources {
    margin-top: 10px;
    padding: 0;
}




.resource-header {
    cursor: pointer;
    padding: 10px;
    background-color: #e0f2f1;
    color: #004d40;
    border: 2px solid #00796b;
    border-radius: 4px 4px 0 0;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}

.resource-content {
    display: none;
    padding: 10px;
    background-color: #e0f2f1;
    border: 2px solid #00796b;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
}

.resource-content a {
    display: block;
    margin-bottom: 5px;
    color: #007bff;
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
    fill: #00796b; /* 深绿色 */
    stroke: #00796b; /* 深绿色 */
    opacity: 0.3;
}

.replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin-top: 10px;
    border: 2px solid #00796b;
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
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Set background to transparent */
    padding: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1000; /* Ensure it stays on top of other content */
}

.bottom-container > div {
    display: inline-block;
}

.typing-effect {
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid;
    display: inline-block;
}

.news-title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #004d40; /* 深绿色文字颜色 */
}










    .responsive-iframe {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
        border: 2px solid #00796b; /* 深绿色边框 */
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
    background-color: #e0f2f1;
    color: #004d40;
    border: 2px solid #00796b;
    border-radius: 4px 4px 0 0;
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}

.Twitter-header a {
  text-decoration: none;
  color: #004d40;
}
```
#背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">
<div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
<div class="phonetic">{{音标}}</div>
<div class="definition">{{释义}}</div>
<div class="example">{{例句}}</div>
<div class="translation">{{例句翻译}}</div>
<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">


<div class="news-title">News</div>




<hr style="border: 1px solid grey;">
{{Source-news}}
</div>
{{/Source-news}}




<div class="Twitter-header">
<a href="#" onclick="searchTwitter()">Twitter网页搜索</a>
</div>




<div class="resources">
<div class="resource-header">点击展开/折叠资源链接</div>

<div id="resource1" class="resource-content">


<div class="video">
<a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
</div>

<div class="Twitter">
<a href="#" onclick="searchTwitter()">Twitter网页</a>
</div>


<div class="Twitter">
<a href="twitter://search?query={{单词}}" target="_blank">Twitter客户端</a>
</div>

<div class="Threads">
<a href="https://www.threads.net/search?q={{单词}}" target="_blank">搜索 Threads</a>
</div>


<div class="giphy">
<a href="https://giphy.com/search/{{单词}}" target="_blank">Gif查</a>
</div>
<div class="dictionary">
<a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
</div>

<div class="dictionary">
<a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌查</a>
</div>


<div class="dictionary">
<a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
</div>
<div class="dictionary">
<a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
</div>
<div class="dictionary">
<a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
</div>
<div class="dictionary">
<a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
</div>
<div class="dictionary">
<a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
</div>
</div>
</div>

<div class="notes">
{{笔记}}<br>
</div>

<div id="video-container" class="video-container">
<iframe src="https://www.youtube.com/embed/{{YouTube-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
// Toggle content display
function toggleContent(id) {
var content = document.getElementById(id);
if (content.style.display === "none" || content.style.display === "") {
content.style.display = "block";
} else {
content.style.display = "none";
}
}

// Attach click event to resource header
var resourceHeader = document.querySelector(".resource-header");
resourceHeader.addEventListener("click", function() {
toggleContent('resource1');
});

// Highlight word forms in notes
var wordElement = document.querySelector(".word");
var notesElement = document.querySelector(".notes");
var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
var notesText = notesElement.innerHTML.trim();

var wordFormsRegex = new RegExp('\\b(' +
wordText + '|' +
wordText + 's?' + '|' +
wordText.replace(/y$/, 'i') + 'es?' + '|' +
wordText + 'ed' + '|' +
wordText + 'ing' + '|' +
wordText + 'd' + '|' +
wordText + 'er' + '|' +
wordText + 'est' + '|' +
wordText + 'ly' + '|' +
wordText.replace(/y$/, 'ily') + '|' +
wordText.replace(/ic$/, 'ically') + '|' +
wordText.replace(/le$/, 'ly') +
')\\b', 'gi');

var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
return '<strong class="highlight">' + match + '</strong>';
});

notesElement.innerHTML = formattedNotes;

// Hide video container if no source URL
var videoContainer = document.getElementById("video-container");
var sourceURL = "{{YouTube-Video}}";

if (!sourceURL) {
videoContainer.style.display = "none";
}
});
</script>

<script>
document.addEventListener('DOMContentLoaded', function() {
const iframe = document.querySelector('#video-container iframe');
if (iframe) {
let src = iframe.src;
src = src.replace('https://youtu.be/', '');
iframe.src = src;
}
});
</script>

<div class="bottom-container">
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:单词}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:例句}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:Source-news}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:笔记}}
</div>
</div>









<div class="responsive-iframe">
<iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{Dailymotion-Video}}" allowfullscreen></iframe>
</div>


<script>


document.addEventListener('DOMContentLoaded', function() {
// 获取 dailymotion-Video 字段的值
var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整

// 如果视频 ID 为空，则移除包含 iframe 的 div
if (!dailymotionVideoId) {
var videoContainer = document.querySelector('.responsive-iframe');
if (videoContainer) {
videoContainer.parentNode.removeChild(videoContainer);
}
}
});

</script>


<script>

function getVideoId(url) {
// 匹配 dailymotion 视频 URL 并提取视频 ID
const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
return match ? match[1] : '';
}

document.addEventListener('DOMContentLoaded', () => {
const dailymotionVideo = '{{Dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
const videoId = getVideoId(dailymotionVideo); // 提取视频 ID

if (videoId) {
// 将 iframe 的 src 属性设置为提取到的视频 ID
document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
}
});

</script>


<script>
function searchTwitter() {
window.open("https://twitter.com/search?q=" + encodeURIComponent("{{单词}}"), "_blank");
}
</script>



</body>
</html>
```


# 新增Twitter 搜索

CSS：
```
.card {
font-family: 'PingFang SC', sans-serif;
color: #000000; /* 黑色文本 */
background-color: #fffde7; /* 浅黄色背景 */
border: 2px solid #00796b; /* 深绿色边框 */
padding: 20px;
text-align: center;
text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.word {
font-family: 'PingFang SC', Arial, sans-serif;
font-size: 36px;
font-weight: bold;
color: #00796b; /* 深绿色文字 */
display: inline-block;
cursor: pointer;
}

.word a {
color: inherit;
text-decoration: none;
}

.phonetic, .definition, .example, .translation {
font-family: 'PingFang SC', Arial, sans-serif;
}

.phonetic {
font-size: 24px;
margin-top: 10px;
color: #004d40; /* 更深的绿色 */
}

.definition {
font-size: 20px;
margin-top: 15px;
color: #004d40; /* 更深的绿色 */
}

.example, .translation {
font-size: 18px;
margin-top: 10px;
color: #004d40; /* 更深的绿色 */
}

.notes {
font-family: 'Roboto', 'PingFang SC', sans-serif;
font-size: 16px;
margin-top: 10px;
line-height: 1.6;
text-align: left;
color: #000000;
background-color: #c8e6c9; /* 亮绿色背景 */
padding: 15px;
border: 2px solid #00796b; /* 深绿色边框 */
}

.notes span {
font-size: 20px;
font-family: 'Lobster';
}

.notes b, .highlight {
font-style: italic;
text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
}

.source-link {
color: #00796b; /* 深绿色 */
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
color: #000000;
background-color: #e0f2f1; /* 亮青绿色背景 */
padding: 15px;
border: 2px solid #00796b; /* 深绿色边框 */
margin-top: 10px;
text-align: left;
}

.source-news a {
text-decoration: none;
color: #004d40; /* 更深的绿色 */
}

.resources {
margin-top: 10px;
padding: 0;
}

.resource-header {
cursor: pointer;
padding: 10px;
background-color: #e0f2f1;
color: #004d40;
border: 2px solid #00796b;
border-radius: 4px 4px 0 0;
margin: 0;
font-weight: bold;
text-align: center;
box-sizing: border-box;
}

.resource-content {
display: none;
padding: 10px;
background-color: #e0f2f1;
border: 2px solid #00796b;
border-top: none;
border-radius: 0 0 4px 4px;
box-sizing: border-box;
}

.resource-content a {
display: block;
margin-bottom: 5px;
color: #007bff;
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
fill: #00796b; /* 深绿色 */
stroke: #00796b; /* 深绿色 */
opacity: 0.3;
}

.replay-button svg path {
stroke: #000000;
fill: #000000;
opacity: 0.3;
}

.video-container {
position: relative;
padding-bottom: 56.25%;
height: 0;
margin-top: 10px;
border: 2px solid #00796b;
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
bottom: 0;
left: 0;
width: 100%;
background-color: transparent; /* Set background to transparent */
padding: 10px;
display: flex;
gap: 10px;
justify-content: center;
box-sizing: border-box;
z-index: 1000; /* Ensure it stays on top of other content */
}

.bottom-container > div {
display: inline-block;
}

.typing-effect {
white-space: nowrap;
overflow: hidden;
border-right: 2px solid;
display: inline-block;
}

.news-title {
font-family: 'PingFang SC', sans-serif;
font-size: 20px;
font-weight: bold;
color: #004d40; /* 深绿色文字颜色 */
}


.responsive-iframe {
position: relative;
padding-bottom: 56.25%; /* 16:9 aspect ratio */
height: 0;
overflow: hidden;
max-width: 100%;
background: #000;
border: 2px solid #00796b; /* 深绿色边框 */
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
```

背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">
<div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
<div class="phonetic">{{音标}}</div>
<div class="definition">{{释义}}</div>
<div class="example">{{例句}}</div>
<div class="translation">{{例句翻译}}</div>
<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">


<div class="news-title">News</div>




<hr style="border: 1px solid grey;">
{{Source-news}}
</div>
{{/Source-news}}

<div class="resources">
<div class="resource-header">点击展开/折叠资源链接</div>

<div id="resource1" class="resource-content">


<div class="video">
<a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
</div>

<div class="Twitter">

<a href="#" onclick="searchTwitter()">Twitter网页</a>
</div>


<div class="Twitter">
<a href="twitter://search?query={{单词}}" target="_blank">Twitter客户端</a>
</div>



<div class="giphy">
<a href="https://giphy.com/search/{{单词}}" target="_blank">Gif查</a>
</div>
<div class="dictionary">
<a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
</div>

<div class="dictionary">
<a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌查</a>
</div>


<div class="dictionary">
<a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
</div>
<div class="dictionary">
<a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
</div>
<div class="dictionary">
<a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
</div>
<div class="dictionary">
<a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
</div>
<div class="dictionary">
<a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
</div>
</div>
</div>

<div class="notes">
{{笔记}}<br>
</div>

<div id="video-container" class="video-container">
<iframe src="https://www.youtube.com/embed/{{YouTube-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
// Toggle content display
function toggleContent(id) {
var content = document.getElementById(id);
if (content.style.display === "none" || content.style.display === "") {
content.style.display = "block";
} else {
content.style.display = "none";
}
}

// Attach click event to resource header
var resourceHeader = document.querySelector(".resource-header");
resourceHeader.addEventListener("click", function() {
toggleContent('resource1');
});

// Highlight word forms in notes
var wordElement = document.querySelector(".word");
var notesElement = document.querySelector(".notes");
var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
var notesText = notesElement.innerHTML.trim();

var wordFormsRegex = new RegExp('\\b(' +
wordText + '|' +
wordText + 's?' + '|' +
wordText.replace(/y$/, 'i') + 'es?' + '|' +
wordText + 'ed' + '|' +
wordText + 'ing' + '|' +
wordText + 'd' + '|' +
wordText + 'er' + '|' +
wordText + 'est' + '|' +
wordText + 'ly' + '|' +
wordText.replace(/y$/, 'ily') + '|' +
wordText.replace(/ic$/, 'ically') + '|' +
wordText.replace(/le$/, 'ly') +
')\\b', 'gi');

var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
return '<strong class="highlight">' + match + '</strong>';
});

notesElement.innerHTML = formattedNotes;

// Hide video container if no source URL
var videoContainer = document.getElementById("video-container");
var sourceURL = "{{YouTube-Video}}";

if (!sourceURL) {
videoContainer.style.display = "none";
}
});
</script>

<script>
document.addEventListener('DOMContentLoaded', function() {
const iframe = document.querySelector('#video-container iframe');
if (iframe) {
let src = iframe.src;
src = src.replace('https://youtu.be/', '');
iframe.src = src;
}
});
</script>

<div class="bottom-container">
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:单词}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:例句}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:Source-news}}
</div>
<div style="display: inline-block;">
{{tts zh_CN voices=Apple_Ava:笔记}}
</div>
</div>









<div class="responsive-iframe">
<iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{Dailymotion-Video}}" allowfullscreen></iframe>
</div>


<script>


document.addEventListener('DOMContentLoaded', function() {
// 获取 dailymotion-Video 字段的值
var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整

// 如果视频 ID 为空，则移除包含 iframe 的 div
if (!dailymotionVideoId) {
var videoContainer = document.querySelector('.responsive-iframe');
if (videoContainer) {
videoContainer.parentNode.removeChild(videoContainer);
}
}
});

</script>


<script>

function getVideoId(url) {
// 匹配 dailymotion 视频 URL 并提取视频 ID
const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
return match ? match[1] : '';
}

document.addEventListener('DOMContentLoaded', () => {
const dailymotionVideo = '{{Dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
const videoId = getVideoId(dailymotionVideo); // 提取视频 ID

if (videoId) {
// 将 iframe 的 src 属性设置为提取到的视频 ID
document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
}
});

</script>


<script>
function searchTwitter() {
window.open("https://twitter.com/search?q=" + encodeURIComponent("{{单词}}"), "_blank");
}
</script>



</body>
</html>
```
正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Smooth</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
</head>
<body>
<div class="card">
<div class="word typing-effect" id="animated-text"></div>
<div class="phonetic" id="phonetic-text"></div>
</div>

<script>
const word = "{{单词}}";
const container = document.getElementById("animated-text");
const phoneticContainer = document.getElementById("phonetic-text");

const eudicURL = `eudic://dict/${word}`;

let index = 0;

function typeLetter() {
if (index < word.length) {
container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
index++;
setTimeout(typeLetter, 500);
} else {
container.style.borderRight = 'none';
}
}

phoneticContainer.textContent = "{{音标}}";

typeLetter();
</script>

<script>
var tTitle = document.getElementById("s6").innerHTML;
var uURL = document.getElementById("s5").innerHTML;
var sentence = localStorage.getItem('sentence');
document.getElementById('sentence').innerText = sentence;

if (uURL != "") {
var para = document.createElement("p");
para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
var node = document.createTextNode("");
para.appendChild(node);

var element = document.getElementById("div1");
var child = document.getElementById("answer");
element.insertBefore(para, child);
} else {
var para = document.createElement("p");
para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
var node = document.createTextNode("");
para.appendChild(node);

var element = document.getElementById("div1");
var child = document.getElementById("answer");
element.insertBefore(para, child);
}
</script>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
<div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
</div>
</body>
```


# 调整字段名称：
# CSS：
```
.card {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 黑色文本 */
    background-color: #fffde7; /* 浅黄色背景 */
    border: 2px solid #00796b; /* 深绿色边框 */
    padding: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.word {
    font-family: 'PingFang SC', Arial, sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #00796b; /* 深绿色文字 */
    display: inline-block;
    cursor: pointer;
}

.word a {
    color: inherit;
    text-decoration: none;
}

.phonetic, .definition, .example, .translation {
    font-family: 'PingFang SC', Arial, sans-serif;
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.definition {
    font-size: 20px;
    margin-top: 15px;
    color: #004d40; /* 更深的绿色 */
}

.example, .translation {
    font-size: 18px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.notes {
    font-family: 'Roboto', 'PingFang SC', sans-serif;
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.6;
    text-align: left;
    color: #000000;
    background-color: #c8e6c9; /* 亮绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
}

.notes span {
    font-size: 20px;
    font-family: 'Lobster';  
}

.notes b, .highlight {
    font-style: italic;
    text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
}

.source-link {
    color: #00796b; /* 深绿色 */
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
    color: #000000;
    background-color: #e0f2f1; /* 亮青绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
    margin-top: 10px;
    text-align: left;
}

.source-news a {
    text-decoration: none;
    color: #004d40; /* 更深的绿色 */
}

.resources {
    margin-top: 10px;
    padding: 0;
}

.resource-header {
    cursor: pointer;
    padding: 10px;
    background-color: #e0f2f1;
    color: #004d40;
    border: 2px solid #00796b;
    border-radius: 4px 4px 0 0;
    margin: 0;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}

.resource-content {
    display: none;
    padding: 10px;
    background-color: #e0f2f1;
    border: 2px solid #00796b;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
}

.resource-content a {
    display: block;
    margin-bottom: 5px;
    color: #007bff;
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
    fill: #00796b; /* 深绿色 */
    stroke: #00796b; /* 深绿色 */
    opacity: 0.3;
}

.replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin-top: 10px;
    border: 2px solid #00796b;
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
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Set background to transparent */
    padding: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1000; /* Ensure it stays on top of other content */
}

.bottom-container > div {
    display: inline-block;
}

.typing-effect {
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid;
    display: inline-block;
}

.news-title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #004d40; /* 深绿色文字颜色 */
}










    .responsive-iframe {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
        border: 2px solid #00796b; /* 深绿色边框 */
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
```
# 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">


<div class="news-title">News</div>




    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

<div class="resources">
    <div class="resource-header">点击展开/折叠资源链接</div>
    
    <div id="resource1" class="resource-content">
        <div class="video">
            <a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
        </div>
<div class="giphy">
    <a href="https://giphy.com/search/{{单词}}" target="_blank">Gif查</a>
</div>
        <div class="dictionary">
            <a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
        </div>
        <div class="dictionary">
            <a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌查</a>
        </div>
        <div class="dictionary">
            <a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
        </div>
        <div class="dictionary">
            <a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
        </div>
        <div class="dictionary">
            <a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
        </div>
        <div class="dictionary">
            <a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
        </div>
        <div class="dictionary">
            <a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
        </div>
    </div>
</div>

<div class="notes">
    {{笔记}}<br>
</div>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{YouTube-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Toggle content display
        function toggleContent(id) {
            var content = document.getElementById(id);
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        }

        // Attach click event to resource header
        var resourceHeader = document.querySelector(".resource-header");
        resourceHeader.addEventListener("click", function() {
            toggleContent('resource1');
        });

        // Highlight word forms in notes
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

        var wordFormsRegex = new RegExp('\\b(' + 
            wordText + '|' +                               
            wordText + 's?' + '|' +                        
            wordText.replace(/y$/, 'i') + 'es?' + '|' +    
            wordText + 'ed' + '|' +                        
            wordText + 'ing' + '|' +                       
            wordText + 'd' + '|' +                         
            wordText + 'er' + '|' +                        
            wordText + 'est' + '|' +                       
            wordText + 'ly' + '|' +                         
            wordText.replace(/y$/, 'ily') + '|' +           
            wordText.replace(/ic$/, 'ically') + '|' +       
            wordText.replace(/le$/, 'ly') +                
            ')\\b', 'gi');

        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;

        // Hide video container if no source URL
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{YouTube-Video}}";

        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('#video-container iframe');
    if (iframe) {
      let src = iframe.src;
      src = src.replace('https://youtu.be/', '');
      iframe.src = src;
    }
  });
</script>

<div class="bottom-container">
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:单词}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:例句}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:Source-news}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:笔记}}
    </div>
</div>









 <div class="responsive-iframe">
    <iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{Dailymotion-Video}}" allowfullscreen></iframe>
</div>


<script>


document.addEventListener('DOMContentLoaded', function() {
    // 获取 dailymotion-Video 字段的值
    var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整

    // 如果视频 ID 为空，则移除包含 iframe 的 div
    if (!dailymotionVideoId) {
        var videoContainer = document.querySelector('.responsive-iframe');
        if (videoContainer) {
            videoContainer.parentNode.removeChild(videoContainer);
        }
    }
});

</script>


<script>

  function getVideoId(url) {
    // 匹配 dailymotion 视频 URL 并提取视频 ID
    const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dailymotionVideo = '{{Dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
    const videoId = getVideoId(dailymotionVideo); // 提取视频 ID

    if (videoId) {
      // 将 iframe 的 src 属性设置为提取到的视频 ID
      document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
    }
  });

</script>





</body>
</html>
```
# 正面：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <script>
        const word = "{{单词}}";
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        const eudicURL = `eudic://dict/${word}`;

        let index = 0;

        function typeLetter() {
            if (index < word.length) {
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500);
            } else {
                container.style.borderRight = 'none';
            }
        }

        phoneticContainer.textContent = "{{音标}}";

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if (uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>
```


## 更新，卡片浏览器字段正常显示，dailymotion-Video字段调整到背面：

css：
```
.card {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 黑色文本 */
    background-color: #fffde7; /* 浅黄色背景 */
    border: 2px solid #00796b; /* 深绿色边框 */
    padding: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.word {
    font-family: 'PingFang SC', Arial, sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #00796b; /* 深绿色文字 */
    display: inline-block;
    cursor: pointer;
}

.word a {
    color: inherit;
    text-decoration: none;
}

.phonetic, .definition, .example, .translation {
    font-family: 'PingFang SC', Arial, sans-serif;
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.definition {
    font-size: 20px;
    margin-top: 15px;
    color: #004d40; /* 更深的绿色 */
}

.example, .translation {
    font-size: 18px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.notes {
    font-family: 'Roboto', 'PingFang SC', sans-serif;
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.6;
    text-align: left;
    color: #000000;
    background-color: #c8e6c9; /* 亮绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
}

.notes span {
    font-size: 20px;
    font-family: 'Lobster';  
}

.notes b, .highlight {
    font-style: italic;
    text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
}

.source-link {
    color: #00796b; /* 深绿色 */
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
    color: #000000;
    background-color: #e0f2f1; /* 亮青绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
    margin-top: 10px;
    text-align: left;
}

.source-news a {
    text-decoration: none;
    color: #004d40; /* 更深的绿色 */
}

.resources {
    margin-top: 10px;
    padding: 0;
}

.resource-header {
    cursor: pointer;
    padding: 10px;
    background-color: #e0f2f1;
    color: #004d40;
    border: 2px solid #00796b;
    border-radius: 4px 4px 0 0;
    margin: 0;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}

.resource-content {
    display: none;
    padding: 10px;
    background-color: #e0f2f1;
    border: 2px solid #00796b;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
}

.resource-content a {
    display: block;
    margin-bottom: 5px;
    color: #007bff;
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
    fill: #00796b; /* 深绿色 */
    stroke: #00796b; /* 深绿色 */
    opacity: 0.3;
}

.replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin-top: 10px;
    border: 2px solid #00796b;
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
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Set background to transparent */
    padding: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1000; /* Ensure it stays on top of other content */
}

.bottom-container > div {
    display: inline-block;
}

.typing-effect {
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid;
    display: inline-block;
}

.news-title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #004d40; /* 深绿色文字颜色 */
}










    .responsive-iframe {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
        border: 2px solid #00796b; /* 深绿色边框 */
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
```
背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">


<div class="news-title">News</div>




    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

<div class="resources">
    <div class="resource-header">点击展开/折叠资源链接</div>
    
    <div id="resource1" class="resource-content">
        <div class="video">
            <a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
        </div>
<div class="giphy">
    <a href="https://giphy.com/search/{{单词}}" target="_blank">Gif查</a>
</div>
        <div class="dictionary">
            <a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
        </div>
        <div class="dictionary">
            <a href="https://news.google.com/search?q={{单词}}" target="_blank">谷歌查</a>
        </div>
        <div class="dictionary">
            <a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
        </div>
        <div class="dictionary">
            <a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
        </div>
        <div class="dictionary">
            <a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
        </div>
        <div class="dictionary">
            <a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
        </div>
        <div class="dictionary">
            <a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
        </div>
    </div>
</div>

<div class="notes">
    {{笔记}}<br>
</div>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Toggle content display
        function toggleContent(id) {
            var content = document.getElementById(id);
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        }

        // Attach click event to resource header
        var resourceHeader = document.querySelector(".resource-header");
        resourceHeader.addEventListener("click", function() {
            toggleContent('resource1');
        });

        // Highlight word forms in notes
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

        var wordFormsRegex = new RegExp('\\b(' + 
            wordText + '|' +                               
            wordText + 's?' + '|' +                        
            wordText.replace(/y$/, 'i') + 'es?' + '|' +    
            wordText + 'ed' + '|' +                        
            wordText + 'ing' + '|' +                       
            wordText + 'd' + '|' +                         
            wordText + 'er' + '|' +                        
            wordText + 'est' + '|' +                       
            wordText + 'ly' + '|' +                         
            wordText.replace(/y$/, 'ily') + '|' +           
            wordText.replace(/ic$/, 'ically') + '|' +       
            wordText.replace(/le$/, 'ly') +                
            ')\\b', 'gi');

        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;

        // Hide video container if no source URL
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";

        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('#video-container iframe');
    if (iframe) {
      let src = iframe.src;
      src = src.replace('https://youtu.be/', '');
      iframe.src = src;
    }
  });
</script>

<div class="bottom-container">
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:单词}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:例句}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:Source-news}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:笔记}}
    </div>
</div>









 <div class="responsive-iframe">
    <iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{dailymotion-Video}}" allowfullscreen></iframe>
</div>


<script>


document.addEventListener('DOMContentLoaded', function() {
    // 获取 dailymotion-Video 字段的值
    var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整

    // 如果视频 ID 为空，则移除包含 iframe 的 div
    if (!dailymotionVideoId) {
        var videoContainer = document.querySelector('.responsive-iframe');
        if (videoContainer) {
            videoContainer.parentNode.removeChild(videoContainer);
        }
    }
});

</script>


<script>

  function getVideoId(url) {
    // 匹配 dailymotion 视频 URL 并提取视频 ID
    const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dailymotionVideo = '{{dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
    const videoId = getVideoId(dailymotionVideo); // 提取视频 ID

    if (videoId) {
      // 将 iframe 的 src 属性设置为提取到的视频 ID
      document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
    }
  });

</script>





</body>
</html>







```
正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <script>
        const word = "{{单词}}";
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        const eudicURL = `eudic://dict/${word}`;

        let index = 0;

        function typeLetter() {
            if (index < word.length) {
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500);
            } else {
                container.style.borderRight = 'none';
            }
        }

        phoneticContainer.textContent = "{{音标}}";

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if (uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>
```



## 新增字段：dailymotion-Video，正面添加视频嵌入dailymotion

# 正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <script>
        const word = "{{单词}}";
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        const eudicURL = `eudic://dict/${word}`;

        let index = 0;

        function typeLetter() {
            if (index < word.length) {
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500);
            } else {
                container.style.borderRight = 'none';
            }
        }

        phoneticContainer.textContent = "{{音标}}";

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if (uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>




 <div class="responsive-iframe">
    <iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{dailymotion-Video}}" allowfullscreen></iframe>
</div>


<script>


document.addEventListener('DOMContentLoaded', function() {
    // 获取 dailymotion-Video 字段的值
    var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整

    // 如果视频 ID 为空，则移除包含 iframe 的 div
    if (!dailymotionVideoId) {
        var videoContainer = document.querySelector('.responsive-iframe');
        if (videoContainer) {
            videoContainer.parentNode.removeChild(videoContainer);
        }
    }
});

</script>


<script>

  function getVideoId(url) {
    // 匹配 dailymotion 视频 URL 并提取视频 ID
    const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dailymotionVideo = '{{dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
    const videoId = getVideoId(dailymotionVideo); // 提取视频 ID

    if (videoId) {
      // 将 iframe 的 src 属性设置为提取到的视频 ID
      document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
    }
  });

</script>
```

# 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">


<div class="news-title">News</div>




    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

<div class="resources">
    <div class="resource-header">点击展开/折叠资源链接</div>
    
    <div id="resource1" class="resource-content">
        <div class="video">
            <a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
        </div>
<div class="giphy">
    <a href="https://giphy.com/search/{{单词}}" target="_blank">Gif查</a>
</div>
        <div class="dictionary">
            <a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
        </div>
        <div class="dictionary">
            <a href="https://news.google.com/search?q={{单词}}" target="_blank">谷歌查</a>
        </div>
        <div class="dictionary">
            <a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
        </div>
        <div class="dictionary">
            <a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
        </div>
        <div class="dictionary">
            <a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
        </div>
        <div class="dictionary">
            <a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
        </div>
        <div class="dictionary">
            <a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
        </div>
    </div>
</div>

<div class="notes">
    {{笔记}}<br>
</div>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Toggle content display
        function toggleContent(id) {
            var content = document.getElementById(id);
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        }

        // Attach click event to resource header
        var resourceHeader = document.querySelector(".resource-header");
        resourceHeader.addEventListener("click", function() {
            toggleContent('resource1');
        });

        // Highlight word forms in notes
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

        var wordFormsRegex = new RegExp('\\b(' + 
            wordText + '|' +                               
            wordText + 's?' + '|' +                        
            wordText.replace(/y$/, 'i') + 'es?' + '|' +    
            wordText + 'ed' + '|' +                        
            wordText + 'ing' + '|' +                       
            wordText + 'd' + '|' +                         
            wordText + 'er' + '|' +                        
            wordText + 'est' + '|' +                       
            wordText + 'ly' + '|' +                         
            wordText.replace(/y$/, 'ily') + '|' +           
            wordText.replace(/ic$/, 'ically') + '|' +       
            wordText.replace(/le$/, 'ly') +                
            ')\\b', 'gi');

        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;

        // Hide video container if no source URL
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";

        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('#video-container iframe');
    if (iframe) {
      let src = iframe.src;
      src = src.replace('https://youtu.be/', '');
      iframe.src = src;
    }
  });
</script>

<div class="bottom-container">
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:单词}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:例句}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:Source-news}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:笔记}}
    </div>
</div>
</body>
</html>
```

# CSS：
```
.card {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 黑色文本 */
    background-color: #fffde7; /* 浅黄色背景 */
    border: 2px solid #00796b; /* 深绿色边框 */
    padding: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.word {
    font-family: 'PingFang SC', Arial, sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #00796b; /* 深绿色文字 */
    display: inline-block;
    cursor: pointer;
}

.word a {
    color: inherit;
    text-decoration: none;
}

.phonetic, .definition, .example, .translation {
    font-family: 'PingFang SC', Arial, sans-serif;
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.definition {
    font-size: 20px;
    margin-top: 15px;
    color: #004d40; /* 更深的绿色 */
}

.example, .translation {
    font-size: 18px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.notes {
    font-family: 'Roboto', 'PingFang SC', sans-serif;
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.6;
    text-align: left;
    color: #000000;
    background-color: #c8e6c9; /* 亮绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
}

.notes span {
    font-size: 20px;
    font-family: 'Lobster';  
}

.notes b, .highlight {
    font-style: italic;
    text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
}

.source-link {
    color: #00796b; /* 深绿色 */
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
    color: #000000;
    background-color: #e0f2f1; /* 亮青绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
    margin-top: 10px;
    text-align: left;
}

.source-news a {
    text-decoration: none;
    color: #004d40; /* 更深的绿色 */
}

.resources {
    margin-top: 10px;
    padding: 0;
}

.resource-header {
    cursor: pointer;
    padding: 10px;
    background-color: #e0f2f1;
    color: #004d40;
    border: 2px solid #00796b;
    border-radius: 4px 4px 0 0;
    margin: 0;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}

.resource-content {
    display: none;
    padding: 10px;
    background-color: #e0f2f1;
    border: 2px solid #00796b;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
}

.resource-content a {
    display: block;
    margin-bottom: 5px;
    color: #007bff;
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
    fill: #00796b; /* 深绿色 */
    stroke: #00796b; /* 深绿色 */
    opacity: 0.3;
}

.replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin-top: 10px;
    border: 2px solid #00796b;
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
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Set background to transparent */
    padding: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1000; /* Ensure it stays on top of other content */
}

.bottom-container > div {
    display: inline-block;
}

.typing-effect {
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid;
    display: inline-block;
}

.news-title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #004d40; /* 深绿色文字颜色 */
}










    .responsive-iframe {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
        border: 2px solid #00796b; /* 深绿色边框 */
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
```





## anki html、css分离合并版
# CSS：
```
.card {
    font-family: 'PingFang SC', sans-serif;
    color: #000000; /* 黑色文本 */
    background-color: #fffde7; /* 浅黄色背景 */
    border: 2px solid #00796b; /* 深绿色边框 */
    padding: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.word {
    font-family: 'PingFang SC', Arial, sans-serif;
    font-size: 36px;
    font-weight: bold;
    color: #00796b; /* 深绿色文字 */
    display: inline-block;
    cursor: pointer;
}

.word a {
    color: inherit;
    text-decoration: none;
}

.phonetic, .definition, .example, .translation {
    font-family: 'PingFang SC', Arial, sans-serif;
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.definition {
    font-size: 20px;
    margin-top: 15px;
    color: #004d40; /* 更深的绿色 */
}

.example, .translation {
    font-size: 18px;
    margin-top: 10px;
    color: #004d40; /* 更深的绿色 */
}

.notes {
    font-family: 'Roboto', 'PingFang SC', sans-serif;
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.6;
    text-align: left;
    color: #000000;
    background-color: #c8e6c9; /* 亮绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
}

.notes span {
    font-size: 20px;
    font-family: 'Lobster';  
}

.notes b, .highlight {
    font-style: italic;
    text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
}

.source-link {
    color: #00796b; /* 深绿色 */
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
    color: #000000;
    background-color: #e0f2f1; /* 亮青绿色背景 */
    padding: 15px;
    border: 2px solid #00796b; /* 深绿色边框 */
    margin-top: 10px;
    text-align: left;
}

.source-news a {
    text-decoration: none;
    color: #004d40; /* 更深的绿色 */
}

.resources {
    margin-top: 10px;
    padding: 0;
}

.resource-header {
    cursor: pointer;
    padding: 10px;
    background-color: #e0f2f1;
    color: #004d40;
    border: 2px solid #00796b;
    border-radius: 4px 4px 0 0;
    margin: 0;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
}

.resource-content {
    display: none;
    padding: 10px;
    background-color: #e0f2f1;
    border: 2px solid #00796b;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-sizing: border-box;
}

.resource-content a {
    display: block;
    margin-bottom: 5px;
    color: #007bff;
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
    fill: #00796b; /* 深绿色 */
    stroke: #00796b; /* 深绿色 */
    opacity: 0.3;
}

.replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin-top: 10px;
    border: 2px solid #00796b;
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
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Set background to transparent */
    padding: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    box-sizing: border-box;
    z-index: 1000; /* Ensure it stays on top of other content */
}

.bottom-container > div {
    display: inline-block;
}

.typing-effect {
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid;
    display: inline-block;
}

.news-title {
    font-family: 'PingFang SC', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #004d40; /* 深绿色文字颜色 */
}
```
# 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">


<div class="news-title">News</div>




    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

<div class="resources">
    <div class="resource-header">点击展开/折叠资源链接</div>
    
    <div id="resource1" class="resource-content">
        <div class="video">
            <a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
        </div>
<div class="giphy">
    <a href="https://giphy.com/search/{{单词}}" target="_blank">Gif查</a>
</div>
        <div class="dictionary">
            <a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
        </div>
        <div class="dictionary">
            <a href="https://news.google.com/search?q={{单词}}" target="_blank">谷歌查</a>
        </div>
        <div class="dictionary">
            <a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
        </div>
        <div class="dictionary">
            <a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
        </div>
        <div class="dictionary">
            <a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
        </div>
        <div class="dictionary">
            <a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
        </div>
        <div class="dictionary">
            <a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
        </div>
    </div>
</div>

<div class="notes">
    {{笔记}}<br>
</div>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Toggle content display
        function toggleContent(id) {
            var content = document.getElementById(id);
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        }

        // Attach click event to resource header
        var resourceHeader = document.querySelector(".resource-header");
        resourceHeader.addEventListener("click", function() {
            toggleContent('resource1');
        });

        // Highlight word forms in notes
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

        var wordFormsRegex = new RegExp('\\b(' + 
            wordText + '|' +                               
            wordText + 's?' + '|' +                        
            wordText.replace(/y$/, 'i') + 'es?' + '|' +    
            wordText + 'ed' + '|' +                        
            wordText + 'ing' + '|' +                       
            wordText + 'd' + '|' +                         
            wordText + 'er' + '|' +                        
            wordText + 'est' + '|' +                       
            wordText + 'ly' + '|' +                         
            wordText.replace(/y$/, 'ily') + '|' +           
            wordText.replace(/ic$/, 'ically') + '|' +       
            wordText.replace(/le$/, 'ly') +                
            ')\\b', 'gi');

        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;

        // Hide video container if no source URL
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";

        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

<div class="bottom-container">
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:单词}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:例句}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:Source-news}}
    </div>
    <div style="display: inline-block;">
        {{tts zh_CN voices=Apple_Ava:笔记}}
    </div>
</div>
</body>
</html>
```

# 正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <script>
        const word = "{{单词}}";
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        const eudicURL = `eudic://dict/${word}`;

        let index = 0;

        function typeLetter() {
            if (index < word.length) {
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500);
            } else {
                container.style.borderRight = 'none';
            }
        }

        phoneticContainer.textContent = "{{音标}}";

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if (uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>
```

















##anki 调整发音按钮到底部，添加集成查询
背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">

<style>
    body {
        font-family: 'PingFang SC', PingFang SC;
        background-color: #e0f7fa; /* 鲜艳明亮的蓝绿色背景 */
        color: #000000; /* 黑色文字 */
    }
    .card {
        color: #000000;
        background-color: #fffde7; /* 浅黄色背景 */
        border: 2px solid #00796b; /* 深绿色边框 */
        padding: 20px;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .word {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 36px;
        font-weight: bold;
        color: #00796b; /* 深绿色文字 */
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 24px;
        margin-top: 10px;
        color: #004d40; /* 更深的绿色 */
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
        color: #004d40; /* 更深的绿色 */
    }

    .example {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 20px;
        color: #004d40; /* 更深的绿色 */
    }

    .translation {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 10px;
        color: #004d40; /* 更深的绿色 */
    }

    .notes {
        font-family: 'Roboto', PingFang SC;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #c8e6c9; /* 亮绿色背景 */
        padding: 15px;
        border: 2px solid #00796b; /* 深绿色边框 */
    }

    .notes span {
        font-size: 20px;
        font-family: 'Lobster';  
    }

    .notes b {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
    }

    .highlight {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5); 
    }

    .source-link {
        color: #00796b; /* 深绿色 */
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
        color: #000000;
        background-color: #e0f2f1; /* 亮青绿色背景 */
        padding: 15px;
        border: 2px solid #00796b; /* 深绿色边框 */
        margin-top: 20px;
        text-align: left;
    }

    .source-news a {
        text-decoration: none;
        color: #004d40; /* 更深的绿色 */
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">
    <span style="font-family: 'PingFang SC', sans-serif; font-size: 20px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

<br>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>折叠效果示例</title>
    <style>
        .resources {
            margin: 0;
            padding: 0;
        }
        .resource-header {
            cursor: pointer;
            padding: 10px;
            background-color: #e0f2f1;
            color: #004d40;
            border: 2px solid #00796b;
            border-radius: 4px 4px 0 0;
            margin: 0;
            font-weight: bold;
            text-align: center;
            box-sizing: border-box;
        }
        .resource-content {
            display: none;
            padding: 10px;
            background-color: #e0f2f1;
            border: 2px solid #00796b;
            border-top: none;
            border-radius: 0 0 4px 4px;
            box-sizing: border-box;
        }
        .resource-content a {
            display: block;
            margin-bottom: 5px;
            color: #007bff;
            text-decoration: none;
        }
        .resource-content a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="resources">
        <div class="resource-header" onclick="toggleContent('resource1')">点击展开/折叠资源链接</div>
        
        <div id="resource1" class="resource-content">
            <div class="video">
                <a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">油管查</a>
            </div>
            <div class="dictionary">
                <a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">剑桥查</a>
            </div>
            <div class="dictionary">
                <a href="https://news.google.com/search?q={{单词}}" target="_blank">谷歌查</a>
            </div>
            <div class="dictionary">
                <a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
            </div>
            <div class="dictionary">
                <a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
            </div>
            <div class="dictionary">
                <a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
            </div>
            <div class="dictionary">
                <a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
            </div>
            <div class="dictionary">
                <a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
            </div>
        </div>
    </div>

    <script>
        function toggleContent(id) {
            var content = document.getElementById(id);
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
        }
    </script>
</body>
</html>






<div class="notes">
    {{笔记}}<br>
</div>



<style>
    .replay-button {
        margin-top: 10px;
        cursor: pointer;
    }

    .replay-button svg {
        width: 24px;
        height: 24px;
    }

        .replay-button svg circle {
            fill: #00796b; /* 深绿色 */
            stroke: #00796b; /* 深绿色 */
            opacity: 0.3;
        }

    .replay-button svg path {
        stroke: #000000;
        fill: #000000;
        opacity: 0.3;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

var wordFormsRegex = new RegExp('\\b(' + 
    wordText + '|' +                               
    wordText + 's?' + '|' +                        
    wordText.replace(/y$/, 'i') + 'es?' + '|' +    
    wordText + 'ed' + '|' +                        
    wordText + 'ing' + '|' +                       
    wordText + 'd' + '|' +                         
    wordText + 'er' + '|' +                        
    wordText + 'est' + '|' +                       
    wordText + 'ly' + '|' +                         
    wordText.replace(/y$/, 'ily') + '|' +           
    wordText.replace(/ic$/, 'ically') + '|' +       
    wordText.replace(/le$/, 'ly') +                
    ')\\b', 'gi');



        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
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
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";

        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page with TTS</title>
    <style>
        .bottom-container {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: transparent; /* Set background to transparent */
            padding: 10px;
            display: flex;
            gap: 10px;
            justify-content: center;
            box-sizing: border-box;
            z-index: 1000; /* Ensure it stays on top of other content */
        }

        .bottom-container > div {
            display: inline-block;
        }
    </style>
</head>
<body>
    <!-- Your page content -->

    <div class="bottom-container">
        <div style="display: inline-block;">
            {{tts zh_CN voices=Apple_Ava:单词}}
        </div>
        <div style="display: inline-block;">
            {{tts zh_CN voices=Apple_Ava:例句}}
        </div>
        <div style="display: inline-block;">
            {{tts zh_CN voices=Apple_Ava:Source-news}}
        </div>
        <div style="display: inline-block;">
            {{tts zh_CN voices=Apple_Ava:笔记}}
        </div>
    </div>
</body>
</html>
```
正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
    <style>
        .card {
            font-family: 'PingFang SC', sans-serif;
            color: #000000; /* 黑色文本 */
            background-color: #fffde7; /* 浅黄色背景 */
            border: 2px solid #00796b; /* 深绿色边框 */
            padding: 20px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .word {
            font-size: 36px;
            font-weight: bold;
            color: #00796b; /* 深绿色文本 */
            position: relative;
            display: inline-block;
            cursor: pointer;
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
            color: #004d40; /* 更深的绿色 */
        }

        .replay-button {
            margin-top: 10px;
            cursor: pointer;
        }

        .replay-button svg {
            width: 24px;
            height: 24px;
        }

        .replay-button svg circle {
            fill: #00796b; /* 深绿色 */
            stroke: #00796b; /* 深绿色 */
            opacity: 0.3;
        }

        .replay-button svg path {
            stroke: #00796b; /* 深绿色 */
            fill: #00796b; /* 深绿色 */
            opacity: 0.3;
        }

        .typing-effect {
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <script>
        const word = "{{单词}}";
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        const eudicURL = `eudic://dict/${word}`;

        let index = 0;

        function typeLetter() {
            if (index < word.length) {
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500);
            } else {
                container.style.borderRight = 'none';
            }
        }

        phoneticContainer.textContent = "{{音标}}";

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if (uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>
```

墨韵清风
背面
//
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">

<style>
    body {
        font-family: 'PingFang SC', PingFang SC;
        background-color: #f5f5f5; 
        color: #000000; 
    }
    .card {
        color: #000000;
        background-color: #ffffff;
        border: 1px solid #000000;
        padding: 20px;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .word {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 20px;
    }

    .translation {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 10px;
        color: #000000;
    }

    .notes {
        font-family: 'Roboto', PingFang SC;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
    }

    .notes span {
        font-size: 20px;
        font-family: 'Lobster';  
    }

    .notes b {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
    }

    .highlight {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5); 
    }

    .source-link {
        color: red;
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
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
        margin-top: 20px;
        text-align: left;
    }

    .source-news a {
        text-decoration: none;
        color: black;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">
    <span style="font-family: 'PingFang SC', sans-serif; font-size: 20px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

<div class="notes">
    {{笔记}}<br>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
    <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
    <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
    <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
    .replay-button {
        margin-top: 10px;
        cursor: pointer;
    }

    .replay-button svg {
        width: 24px;
        height: 24px;
    }

    .replay-button svg circle {
        stroke: #000000;
        fill: #000000;
        opacity: 0.3;
    }

    .replay-button svg path {
        stroke: #000000;
        fill: #000000;
        opacity: 0.3;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

        // Regular expression to match common English word forms
        var wordFormsRegex = new RegExp('\\b(' + 
    wordText + '|' +                               
    wordText + 's?' + '|' +                        
    wordText.replace(/y$/, 'i') + 'es?' + '|' +    
    wordText + 'ed' + '|' +                        
    wordText + 'ing' + '|' +                       
    wordText + 'd' + '|' +                         
    wordText + 'er' + '|' +                        
    wordText + 'est' + '|' +                       
    wordText + 'ly' + '|' +                         
    wordText.replace(/y$/, 'ily') + '|' +           
    wordText.replace(/ic$/, 'ically') + '|' +       
    wordText.replace(/le$/, 'ly') +                
    ')\\b', 'gi');

        // Wrap matching words in <strong class="highlight"> tags
        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
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
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";

        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>

//
正面
//
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
    <style>
        .card {
            font-family: 'PingFang SC', sans-serif;
            color: #000000;
            background-color: #ffffff;
            border: 1px solid #000000;
            padding: 20px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .word {
            font-size: 36px;
            font-weight: bold;
            position: relative;
            display: inline-block;
            cursor: pointer;
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
        }

        .replay-button {
            margin-top: 10px;
            cursor: pointer;
        }

        .replay-button svg {
            width: 24px;
            height: 24px;
        }

        .replay-button svg circle {
            fill: #000000;
            stroke: #000000;
            opacity: 0.3;
        }

        .replay-button svg path {
            stroke: #000000;
            fill: #000000;
            opacity: 0.3;
        }

        .typing-effect {
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <script>
        const word = "{{单词}}";
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        const eudicURL = `eudic://dict/${word}`;

        let index = 0;

        function typeLetter() {
            if (index < word.length) {
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500);
            } else {
                container.style.borderRight = 'none';
            }
        }

        phoneticContainer.textContent = "{{音标}}";

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if(uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>
//

晨光绿意
背面
//
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">

<style>
    body {
        font-family: 'PingFang SC', PingFang SC;
        background-color: #e0f7fa; /* 鲜艳明亮的蓝绿色背景 */
        color: #000000; /* 黑色文字 */
    }
    .card {
        color: #000000;
        background-color: #fffde7; /* 浅黄色背景 */
        border: 2px solid #00796b; /* 深绿色边框 */
        padding: 20px;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .word {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 36px;
        font-weight: bold;
        color: #00796b; /* 深绿色文字 */
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 24px;
        margin-top: 10px;
        color: #004d40; /* 更深的绿色 */
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
        color: #004d40; /* 更深的绿色 */
    }

    .example {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 20px;
        color: #004d40; /* 更深的绿色 */
    }

    .translation {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 10px;
        color: #004d40; /* 更深的绿色 */
    }

    .notes {
        font-family: 'Roboto', PingFang SC;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #c8e6c9; /* 亮绿色背景 */
        padding: 15px;
        border: 2px solid #00796b; /* 深绿色边框 */
    }

    .notes span {
        font-size: 20px;
        font-family: 'Lobster';  
    }

    .notes b {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
    }

    .highlight {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5); 
    }

    .source-link {
        color: #00796b; /* 深绿色 */
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
        color: #000000;
        background-color: #e0f2f1; /* 亮青绿色背景 */
        padding: 15px;
        border: 2px solid #00796b; /* 深绿色边框 */
        margin-top: 20px;
        text-align: left;
    }

    .source-news a {
        text-decoration: none;
        color: #004d40; /* 更深的绿色 */
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

{{#Source-news}}
<div class="source-news">
    <span style="font-family: 'PingFang SC', sans-serif; font-size: 20px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

<div class="notes">
    {{笔记}}<br>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
    <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
    <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
    <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
    .replay-button {
        margin-top: 10px;
        cursor: pointer;
    }

    .replay-button svg {
        width: 24px;
        height: 24px;
    }

        .replay-button svg circle {
            fill: #00796b; /* 深绿色 */
            stroke: #00796b; /* 深绿色 */
            opacity: 0.3;
        }

    .replay-button svg path {
        stroke: #000000;
        fill: #000000;
        opacity: 0.3;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

var wordFormsRegex = new RegExp('\\b(' + 
    wordText + '|' +                               
    wordText + 's?' + '|' +                        
    wordText.replace(/y$/, 'i') + 'es?' + '|' +    
    wordText + 'ed' + '|' +                        
    wordText + 'ing' + '|' +                       
    wordText + 'd' + '|' +                         
    wordText + 'er' + '|' +                        
    wordText + 'est' + '|' +                       
    wordText + 'ly' + '|' +                         
    wordText.replace(/y$/, 'ily') + '|' +           
    wordText.replace(/ic$/, 'ically') + '|' +       
    wordText.replace(/le$/, 'ly') +                
    ')\\b', 'gi');



        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
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
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";

        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
//
正面
//
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
    <style>
        .card {
            font-family: 'PingFang SC', sans-serif;
            color: #000000; /* 黑色文本 */
            background-color: #fffde7; /* 浅黄色背景 */
            border: 2px solid #00796b; /* 深绿色边框 */
            padding: 20px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .word {
            font-size: 36px;
            font-weight: bold;
            color: #00796b; /* 深绿色文本 */
            position: relative;
            display: inline-block;
            cursor: pointer;
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
            color: #004d40; /* 更深的绿色 */
        }

        .replay-button {
            margin-top: 10px;
            cursor: pointer;
        }

        .replay-button svg {
            width: 24px;
            height: 24px;
        }

        .replay-button svg circle {
            fill: #00796b; /* 深绿色 */
            stroke: #00796b; /* 深绿色 */
            opacity: 0.3;
        }

        .replay-button svg path {
            stroke: #00796b; /* 深绿色 */
            fill: #00796b; /* 深绿色 */
            opacity: 0.3;
        }

        .typing-effect {
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <script>
        const word = "{{单词}}";
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        const eudicURL = `eudic://dict/${word}`;

        let index = 0;

        function typeLetter() {
            if (index < word.length) {
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500);
            } else {
                container.style.borderRight = 'none';
            }
        }

        phoneticContainer.textContent = "{{音标}}";

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if (uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>