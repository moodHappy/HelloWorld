背面：
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


{{FrontSide}}



{{片假名}}
<div class="definition">{{释义}}</div>
<div class="example">{{例句}}</div>
<div class="translation blurred" onclick="toggleBlur(this)">{{例句翻译}}
</div>


<style>
  .translation {
    display: inline-block; /* 让它更自然地占位 */
    cursor: pointer; /* 鼠标指针变成可点击 */
    transition: filter 0.3s ease-in-out; /* 平滑过渡 */
  }

  .blurred {
    filter: blur(5px); /* 初始模糊 */
  }
</style>

<script>
  // 确保脚本在 Anki 加载完成后执行
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".translation").forEach(el => {
      el.addEventListener("click", function () {
        this.classList.toggle("blurred"); // 切换模糊状态
      });
    });
  });
</script>



<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>
{{#Source-news}}
<div class="source-news">
<div class="news-title">News</div>
<hr style="border: 1px solid grey;">


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
</div>
{{/Source-news}}
<div class="Twitter-header">
<a href="#" onclick="searchTwitter()">Twitter</a>
</div>
<div class="resources">
<div class="resource-header">点击展开/折叠资源链接</div>
<div id="resource1" class="resource-content">




<div class="mammoth-memory">
    <a href="https://mammothmemory.net/search/?q={{单词}}" target="_blank">Mammoth Memory</a>
</div>

<div class="thread">
    <a href="https://www.threads.net/search?q={{单词}}" target="_blank">thread</a>
</div>


<div class="spotify">
    <a href="spotify:search:{{单词}}" target="_blank">Spotify</a>
</div>


<div class="reddit">
<a href="https://www.reddit.com/search/?q={{单词}}" target="_blank">Reddit</a>

<div class="youdao">
    <a href="https://dict.youdao.com/m/result?word={{单词}}&lang=en" target="_blank">有道词典</a>
</div>

<div class="giphy">
<a href="https://giphy.com/search/{{单词}}" target="_blank">GIPHY</a>
</div>

<div class="vocabulary">
<a href="https://www.vocabulary.com/dictionary/{{单词}}" target="_blank">Vocabulary</a>
</div>

<div class="picture">
<a href="https://www.google.com/search?tbm=isch&q={{单词}}" target="_blank">谷歌搜图</a>
</div>

<div class="dictionary">
<a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌新闻</a>
</div>

<a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">YouTube</a>
</div>

<div class="Threads">
<a href="https://www.threads.net/search?q={{单词}}" target="_blank">Threads</a>
</div>


<div class="TwitterWeb">
<a href="#" onclick="searchTwitter()">TwitterWeb</a>
</div>

<div class="TwitterApp">
<a href="twitter://search?query={{单词}}" target="_blank">TwitterApp</a>
</div>


<div class="dictionary">
<a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">Cambridge</a>
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





<!-- 插入本地语音代码开始 -->
<div class="bottom-container">

</div>
<!-- 插入本地语音代码结束 -->







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


<iframe id="youdao_iframe" class="lt-iframe" 
        src="https://dict.youdao.com/m/search?q={{单词}}#bd" 
        style="width:100%; height:500px;"></iframe>

正面：
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
    <!-- 播放按钮，播放单词 -->    
    <button class="btn" id="playWordButton" onclick="playWordTTS()">▶️</button>    
    <!-- 播放按钮，播放例句 -->    
    <button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶️</button>

<script>    
    const word = "{{单词}}";    
    const language = "{{语种}}".trim(); // 语种字段    
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
  
    phoneticContainer.textContent = "{{IPA}}";    
    typeLetter();    

    // 语言映射表    
    const voiceMap = {
        "de": "de-DE-ConradNeural",
        "es": "es-ES-AlvaroNeural",
        "it": "it-IT-DiegoNeural",
        "hi": "hi-IN-MadhurNeural",
        "ko": "ko-KR-SunHiNeural",
        "fr": "fr-FR-DeniseNeural",
        "ru": "ru-RU-DmitryNeural",
        "he": "he-IL-AvriNeural",
        "": "en-US-EricNeural" // 默认英语
    };

    const selectedVoice = voiceMap[language] || "en-US-EricNeural";    

    function playTTS(text, audioId) {    
        const domain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];    

        if (!text) {    
            alert('文本为空，无法生成音频');    
            return;    
        }    

        const queryString = new URLSearchParams({    
            text: text.trim(),    
            voiceName: selectedVoice,    
            speed: 0,    
        }).toString();    

        let existingAudio = document.getElementById(audioId);    
        if (existingAudio) {    
            existingAudio.remove();    
        }    

        const audio = document.createElement('audio');    
        audio.id = audioId;    
        audio.style.display = 'none';    

        for (const url of domain) {    
            const source = document.createElement('source');    
            source.src = `${url}api/aiyue?${queryString}`;    
            source.type = 'audio/mpeg';    
            audio.append(source);    
        }    

        document.body.append(audio);    
        audio.play();    
    }    

    function playWordTTS() {    
        playTTS(word, 'hiddenAudioWord');    
    }    

    function playExampleTTS() {    
        const exampleText = document.querySelector('.example')?.innerText?.trim();    
        playTTS(exampleText, 'hiddenAudioExample');    
    }    

    // 设置播放按钮样式    
    const playWordButton = document.getElementById('playWordButton');    
    const playExampleButton = document.getElementById('playExampleButton');    

    playWordButton.style.position = 'fixed';    
    playWordButton.style.bottom = '260px';    
    playWordButton.style.left = '50%';    
    playWordButton.style.transform = 'translateX(-50%)';    

    playExampleButton.style.position = 'fixed';    
    playExampleButton.style.bottom = '200px';    
    playExampleButton.style.left = '50%';    
    playExampleButton.style.transform = 'translateX(-50%)';    

    window.onload = function() {    
        playWordTTS();    
    };    
</script>  
</body>    
</html>

{{语种}}

