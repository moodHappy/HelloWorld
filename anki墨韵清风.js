正面2：拼读连读结合，false状态点击按钮是拼读

<div class="card">
  <div class="word typing-effect" id="animated-text"></div>
  <div class="phonetic" id="phonetic-text"></div>
</div>

<button class="btn" id="playWordButton" onclick="playSpellingAndWord()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>
<button class="btn" id="repeatWordButton" onclick="playWordTTSRepeated()">▶</button>

<script>
  // 全局开关变量，true 为开启自动拼读，false 为关闭
  let enablePronunciation = false; // 默认设置为 false，关闭自动拼读

  const word = "{{单词}}";
  const language = "{{语种}}".trim();
  const container = document.getElementById("animated-text");
  const phoneticContainer = document.getElementById("phonetic-text");
  const eudicURL = `eudic://dict/${word}`;

  container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
  phoneticContainer.textContent = "{{IPA}}";

  const voiceMap = {
    "de": "de-DE-ConradNeural",
    "es": "es-ES-AlvaroNeural",
    "it": "it-IT-DiegoNeural",
    "hi": "hi-IN-MadhurNeural",
    "ko": "ko-KR-SunHiNeural",
    "fr": "fr-FR-DeniseNeural",
    "ru": "ru-RU-DmitryNeural",
    "he": "he-IL-AvriNeural",
    "": "en-US-EricNeural"
  };

  const selectedVoice = voiceMap[language] || "en-US-EricNeural";

  function playTTS(text, audioId, callback) {
    if (!text) {
      alert('Text is empty, unable to generate audio');
      return;
    }
    const queryString = new URLSearchParams({
      text: text.trim(),
      voiceName: selectedVoice,
      speed: 0,
    }).toString();

    const old = document.getElementById(audioId);
    if (old) old.remove();

    const audio = document.createElement('audio');
    audio.id = audioId;
    audio.style.display = 'none';
    const src = `https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/api/aiyue?${queryString}`;
    audio.innerHTML = `<source src="${src}" type="audio/mpeg">`;
    document.body.append(audio);

    audio.onended = () => callback?.();
    audio.play();
  }

  function playSpellingAndWord() {
    const letters = word.toLowerCase().split('').join(', ');
    playTTS(letters, 'audioSpell', () => {
      playTTS(word, 'audioFullWord');
    });
  }

  function playWordTTS() {
    playTTS(word, 'audioFullWord');
  }

  function playExampleTTS() {
    const exampleText = document.querySelector('.example')?.innerText?.trim() || '';
    playTTS(exampleText, 'hiddenAudioExample');
  }

  function playWordTTSRepeated(times = 10) {
    let count = 0;
    const playNext = () => {
      if (++count < times) {
        playTTS(word, 'hiddenAudioWordRepeated', playNext);
      }
    };
    playTTS(word, 'hiddenAudioWordRepeated', playNext);
  }

  // 按钮定位样式
  const buttonStyle = `
    position: fixed;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  `;

  document.getElementById("playWordButton").style = `${buttonStyle} bottom: 200px;`;
  document.getElementById("playExampleButton").style = `${buttonStyle} bottom: 150px;`;
  const repeatBtn = document.getElementById("repeatWordButton");
  repeatBtn.style = `${buttonStyle} bottom: 100px; color: red; font-weight: bold;`;

  window.onload = function() {
    if (enablePronunciation) {
      playSpellingAndWord();
    } else {
      playWordTTS();
    }
  };
</script>

<div style="text-align: right;">
  <button onclick="copyAndGo('{{单词}}')" style="
    background: #f0f0f0;
    color: #999;
    font-size: 80%;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    opacity: 0.4;
    cursor: pointer;">
    JTWord
  </button>
</div>

<script>
  function copyAndGo(word) {
    navigator.clipboard.writeText(word).finally(() => {
      window.open('https://www.just-the-word.com', '_blank');
    });
  }
</script>

<div style="display: flex; justify-content: center; gap: 10px; margin-top: 5px;">
  <div id="frequency-coca">COCA：加载中...</div>
  <div id="frequency-google">Google：加载中...</div>
  <div id="frequency-oxford">Oxford：加载中...</div>
</div>

<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const currentWord = document.getElementById("word-data").textContent.trim().toLowerCase();
    const anchor = document.querySelector('#animated-text a');
    let foundInCoca = false, foundInGoogle = false, foundInOxford = false;

    fetch("./_COCA.json")
      .then(res => res.json())
      .then(cocaList => {
        const rank = cocaList[currentWord];
        document.getElementById("frequency-coca").textContent = rank ? `COCA：${rank}` : `COCA：未找到`;
        foundInCoca = !!rank;
      })
      .catch(() => {
        document.getElementById("frequency-coca").textContent = `COCA：加载失败`;
      })
      .then(() => fetch("./_Google.json"))
      .then(res => res.json())
      .then(googleList => {
        const rank = googleList[currentWord];
        document.getElementById("frequency-google").textContent = rank ? `Google：${rank}` : `Google：未找到`;
        foundInGoogle = !!rank;
      })
      .catch(() => {
        document.getElementById("frequency-google").textContent = `Google：加载失败`;
      })
      .then(() => fetch("./_OxfordLevels.json"))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(oxfordList => {
        const rank = oxfordList[currentWord];
        document.getElementById("frequency-oxford").textContent = rank ? `Oxford：${rank}` : `Oxford：未找到`;
        foundInOxford = !!rank;
      })
      .catch(error => {
        console.error("Error fetching Oxford data:", error);
        document.getElementById("frequency-oxford").textContent = `Oxford：加载失败`;
      })
      .finally(() => updateWordColor(foundInCoca, foundInGoogle, foundInOxford, anchor));

    function updateWordColor(inCoca, inGoogle, inOxford, a) {
      if (!a) return;
      if (inCoca && inGoogle && inOxford)       a.style.color = '#8A2BE2';
      else if (inCoca && inGoogle)              a.style.color = 'pink';
      else if (inCoca && inOxford)              a.style.color = 'red';
      else if (inGoogle && inOxford)            a.style.color = 'blue';
      else if (inCoca)                          a.style.color = 'black';
      else if (inGoogle)                        a.style.color = 'blue';
      else if (inOxford)                        a.style.color = 'green';
      else                                      a.style.color = 'inherit';
    }
  });
</script>


正面1：// 拼读连读隔离版

<div class="card">
  <div class="word typing-effect" id="animated-text"></div>
  <div class="phonetic" id="phonetic-text"></div>
</div>

<button class="btn" id="playWordButton" onclick="playSpellingAndWord()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>
<button class="btn" id="repeatWordButton" onclick="playWordTTSRepeated()">▶</button>

<script>
  // 全局开关变量，true 为开启自动拼读，false 为关闭
  let enablePronunciation = false; // 默认设置为 false，关闭自动拼读

  const word = "{{单词}}";
  const language = "{{语种}}".trim();
  const container = document.getElementById("animated-text");
  const phoneticContainer = document.getElementById("phonetic-text");
  const eudicURL = `eudic://dict/${word}`;

  container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
  phoneticContainer.textContent = "{{IPA}}";

  const voiceMap = {
    "de": "de-DE-ConradNeural",
    "es": "es-ES-AlvaroNeural",
    "it": "it-IT-DiegoNeural",
    "hi": "hi-IN-MadhurNeural",
    "ko": "ko-KR-SunHiNeural",
    "fr": "fr-FR-DeniseNeural",
    "ru": "ru-RU-DmitryNeural",
    "he": "he-IL-AvriNeural",
    "": "en-US-EricNeural"
  };

  const selectedVoice = voiceMap[language] || "en-US-EricNeural";

  function playTTS(text, audioId, callback) {
    if (!text) {
      alert('Text is empty, unable to generate audio');
      return;
    }
    const queryString = new URLSearchParams({
      text: text.trim(),
      voiceName: selectedVoice,
      speed: 0,
    }).toString();

    const old = document.getElementById(audioId);
    if (old) old.remove();

    const audio = document.createElement('audio');
    audio.id = audioId;
    audio.style.display = 'none';
    const src = `https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/api/aiyue?${queryString}`;
    audio.innerHTML = `<source src="${src}" type="audio/mpeg">`;
    document.body.append(audio);

    audio.onended = () => callback?.();
    audio.play();
  }

  function playSpellingAndWord() {
    if (enablePronunciation) {
      const letters = word.toLowerCase().split('').join(', ');
      playTTS(letters, 'audioSpell', () => {
        playTTS(word, 'audioFullWord');
      });
    } else {
      playTTS(word, 'audioFullWord');
    }
  }

  function playWordTTS() {
    playTTS(word, 'audioFullWord');
  }

  function playExampleTTS() {
    const exampleText = document.querySelector('.example')?.innerText?.trim() || '';
    playTTS(exampleText, 'hiddenAudioExample');
  }

  function playWordTTSRepeated(times = 10) {
    let count = 0;
    const playNext = () => {
      if (++count < times) {
        playTTS(word, 'hiddenAudioWordRepeated', playNext);
      }
    };
    playTTS(word, 'hiddenAudioWordRepeated', playNext);
  }

  // 按钮定位样式
  const buttonStyle = `
    position: fixed;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  `;

  document.getElementById("playWordButton").style = `${buttonStyle} bottom: 200px;`;
  document.getElementById("playExampleButton").style = `${buttonStyle} bottom: 150px;`;
  const repeatBtn = document.getElementById("repeatWordButton");
  repeatBtn.style = `${buttonStyle} bottom: 100px; color: red; font-weight: bold;`;

  window.onload = function() {
    if (enablePronunciation) {
      playSpellingAndWord();
    } else {
      playWordTTS();
    }
  };
</script>

<div style="text-align: right;">
  <button onclick="copyAndGo('{{单词}}')" style="
    background: #f0f0f0;
    color: #999;
    font-size: 80%;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    opacity: 0.4;
    cursor: pointer;">
    JTWord
  </button>
</div>

<script>
  function copyAndGo(word) {
    navigator.clipboard.writeText(word).finally(() => {
      window.open('https://www.just-the-word.com', '_blank');
    });
  }
</script>

<div style="display: flex; justify-content: center; gap: 10px; margin-top: 5px;">
  <div id="frequency-coca">COCA：加载中...</div>
  <div id="frequency-google">Google：加载中...</div>
  <div id="frequency-oxford">Oxford：加载中...</div>
</div>

<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const currentWord = document.getElementById("word-data").textContent.trim().toLowerCase();
    const anchor = document.querySelector('#animated-text a');
    let foundInCoca = false, foundInGoogle = false, foundInOxford = false;

    fetch("./_COCA.json")
      .then(res => res.json())
      .then(cocaList => {
        const rank = cocaList[currentWord];
        document.getElementById("frequency-coca").textContent = rank ? `COCA：${rank}` : `COCA：未找到`;
        foundInCoca = !!rank;
      })
      .catch(() => {
        document.getElementById("frequency-coca").textContent = `COCA：加载失败`;
      })
      .then(() => fetch("./_Google.json"))
      .then(res => res.json())
      .then(googleList => {
        const rank = googleList[currentWord];
        document.getElementById("frequency-google").textContent = rank ? `Google：${rank}` : `Google：未找到`;
        foundInGoogle = !!rank;
      })
      .catch(() => {
        document.getElementById("frequency-google").textContent = `Google：加载失败`;
      })
      .then(() => fetch("./_OxfordLevels.json"))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(oxfordList => {
        const rank = oxfordList[currentWord];
        document.getElementById("frequency-oxford").textContent = rank ? `Oxford：${rank}` : `Oxford：未找到`;
        foundInOxford = !!rank;
      })
      .catch(error => {
        console.error("Error fetching Oxford data:", error);
        document.getElementById("frequency-oxford").textContent = `Oxford：加载失败`;
      })
      .finally(() => updateWordColor(foundInCoca, foundInGoogle, foundInOxford, anchor));

    function updateWordColor(inCoca, inGoogle, inOxford, a) {
      if (!a) return;
      if (inCoca && inGoogle && inOxford)       a.style.color = '#8A2BE2';
      else if (inCoca && inGoogle)              a.style.color = 'pink';
      else if (inCoca && inOxford)              a.style.color = 'red';
      else if (inGoogle && inOxford)            a.style.color = 'blue';
      else if (inCoca)                          a.style.color = 'black';
      else if (inGoogle)                        a.style.color = 'blue';
      else if (inOxford)                        a.style.color = 'green';
      else                                      a.style.color = 'inherit';
    }
  });
</script>


背面：

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

{{image}}

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

<div class="notes">
{{笔记}}<br>
</div>

<div class="bottom-container">

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

<script>
document.addEventListener("DOMContentLoaded", function() {
  const frontText = document.querySelector('.typing-effect') ? document.querySelector('.typing-effect').textContent.trim() : '';
  if (!frontText) return;

  let notesElement = document.querySelector('.notes');
  if (!notesElement) {
    notesElement = document.createElement('div');
    notesElement.classList.add('notes');
    const backElement = document.querySelector('.back');
    backElement ? backElement.insertAdjacentElement('afterend', notesElement) : document.body.appendChild(notesElement);
  }

  const noteTitle = document.createElement('div');
  noteTitle.classList.add('note');
  noteTitle.textContent = '笔记';
  noteTitle.style.margin = '20px 0';
  notesElement.insertAdjacentElement('beforebegin', noteTitle);

  if (notesElement.textContent.trim()) return;

  const cacheKey = `analysis_cache_${frontText}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return insertAnalysis(cached, '来源：Sambanova');

  const sambanovaApi = {
    url: 'https://api.sambanova.ai/v1/chat/completions',
    key: '1fbf3ed7-a429-4938-89b1-06a99a654ab6',
    model: 'Meta-Llama-3.1-405B-Instruct'
  };

  const backupApi = {
    url: 'https://free.v36.cm/v1/chat/completions',
    key: 'sk-7NEyEPLHDfmprWdPEb3036Ec568b40Ab9b444eD37fAeE436',
    model: 'gpt-3.5-turbo'
  };

  const anotherBackupApi = { // New backup API
    url: 'https://api.chatanywhere.org/v1/chat/completions', // Assuming /v1/chat/completions endpoint
    key: 'sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh',
    model: 'gpt-3.5-turbo'
  };

  async function fetchFromAPI(api, sourceName) {
    const response = await fetch(api.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api.key}`,
      },
      body: JSON.stringify({
        model: api.model,
        messages: [
          {
            role: "system",
            content: "你是一个智能助手，请用中文分析下面的单词，按照以下要求：\n1. 提供一个典型英文例句附中文。\n2.辨析同义词。\n3. 列出常用的固定搭配，简要说明它们的用法，并例句附中文。"
          },
          {
            role: "user",
            content: frontText
          }
        ]
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0].message) {
      localStorage.setItem(cacheKey, data.choices[0].message.content);
      insertAnalysis(data.choices[0].message.content, sourceName);
    } else {
      throw new Error('返回数据格式错误');
    }
  }

  fetchFromAPI(sambanovaApi, '<br><br>**来源**：Sambanova')
  .catch(() => fetchFromAPI(backupApi, '<br><br>**来源**：ChatGPT')
      .catch(() => fetchFromAPI(anotherBackupApi, '<br><br>**来源**：ChatAnywhere') // Added new API call
          .catch(() => alert('主服务器和所有备用服务器都无法连接。')))); // Updated alert message

  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  Object.assign(copyButton.style, {
    position: 'fixed',
    left: '0',
    bottom: '0',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    opacity: '0.5'
  });
  document.body.appendChild(copyButton);

  copyButton.addEventListener('click', () => {
    const text = notesElement.textContent.trim();
    if (text) {
      navigator.clipboard.writeText(text).then(() => alert('分析内容已复制！'));
    } else {
      alert('没有可复制的分析内容！');
    }
  });
});

function insertAnalysis(analysis, sourceText) {
  const notesElement = document.querySelector('.notes');
  if (notesElement) {
    notesElement.innerHTML = '';
    const analysisDiv = document.createElement('div');
    analysisDiv.textContent = analysis;
    const sourceDiv = document.createElement('div');
    sourceDiv.style.marginTop = '10px';
    sourceDiv.style.fontStyle = 'italic';
    sourceDiv.textContent = sourceText;
    notesElement.appendChild(analysisDiv);
    notesElement.appendChild(sourceDiv);
  }
}
</script>

<style>
.table-container {
    max-height: 300px; /* 根据需要调整高度 */
    overflow: auto;
}
/* 文本容器，保留纯文本的换行 */
.notes {
    overflow: auto;
    white-space: pre-wrap;
}
/* 表格基本样式 */
table {
    border-collapse: collapse;
    width: 100%;
}
th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
}
th {
    background-color: #f2f2f2;
}
</style>

<script>
// 辅助函数：处理内联格式（加粗）
function processInlineFormatting(text) {
    // 处理 **加粗** 和 __加粗__
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/__(.*?)__/g, '<strong>$1</strong>');
}

// Markdown 转换函数
function markdownToHTML(markdown) {
    // 按行拆分文本
    const lines = markdown.split('\n');
    let resultLines = [];
    let i = 0;
    while (i < lines.length) {
        let line = lines[i];
        // 处理表格块：行以 | 开头和结尾
        if (/^\s*\|.*\|\s*$/.test(line)) {
            let tableLines = [];
            while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
                tableLines.push(lines[i]);
                i++;
            }
            const tableHTML = processTableBlock(tableLines);
            resultLines.push(tableHTML);
            continue;
        }
        // 处理列表块：行以 *、- 或 + 开头
        if (/^\s*[\*\-\+]\s+/.test(line)) {
            let listLines = [];
            while (i < lines.length && /^\s*[\*\-\+]\s+/.test(lines[i])) {
                listLines.push(lines[i]);
                i++;
            }
            const listHTML = processListBlock(listLines);
            resultLines.push(listHTML);
            continue;
        }
        // 处理标题（1-6级标题）
        if (/^(#{1,6})\s*(.*)$/.test(line)) {
            line = line.replace(/^(#{1,6})\s*(.*)$/, (match, hashes, content) => {
                const level = hashes.length;
                // 同时处理内联格式
                return `<h${level}>${processInlineFormatting(content)}</h${level}>`;
            });
            resultLines.push(line);
            i++;
            continue;
        }
        // 处理引用
        if (/^>\s*(.*)$/.test(line)) {
            line = line.replace(/^>\s*(.*)$/, (match, content) => {
                return `<blockquote>${processInlineFormatting(content)}</blockquote>`;
            });
            resultLines.push(line);
            i++;
            continue;
        }
        // 处理内联格式（加粗）
        line = processInlineFormatting(line);
        resultLines.push(line);
        i++;
    }
    let html = resultLines.join('\n');
    // 处理以 $ 包裹的内容变红色
    html = html.replace(/\$(.*?)\$/g, '<span style="color: red;">$1</span>');
    // 如果转换结果中没有 HTML 标签（即纯文本），则替换换行符为 <br>
    if (!/<[^>]+>/.test(html)) {
        html = html.replace(/\n/g, '<br>');
    }
    return html;
}

// 处理表格块，将表格内容包裹在滚动容器中
function processTableBlock(lines) {
    if (lines.length < 2) {
        return lines.join('<br>');
    }
    // 处理表头：去掉首尾的 | 后按 | 分割
    let headerLine = lines[0].trim();
    headerLine = headerLine.substring(1, headerLine.length - 1);
    const headers = headerLine.split('|').map(cell => processInlineFormatting(cell.trim()));
    // 表体行（从第三行开始）
    const bodyRows = [];
    for (let j = 2; j < lines.length; j++) {
        let rowLine = lines[j].trim();
        if (rowLine.startsWith('|') && rowLine.endsWith('|')) {
            rowLine = rowLine.substring(1, rowLine.length - 1);
        }
        const cells = rowLine.split('|').map(cell => processInlineFormatting(cell.trim()));
        bodyRows.push(cells);
    }
    // 构造表格 HTML
    let tableHTML = '<div class="table-container"><table>';
    tableHTML += '<thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead>';
    tableHTML += '<tbody>';
    bodyRows.forEach(row => {
        tableHTML += '<tr>';
        for (let i = 0; i < headers.length; i++) {
            const cellContent = row[i] !== undefined ? row[i] : '';
            tableHTML += `<td>${cellContent}</td>`;
        }
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table></div>';
    return tableHTML;
}

// 处理列表块，将连续的列表项合并为一个 <ul>
function processListBlock(lines) {
    let listHTML = '<ul>';
    lines.forEach(line => {
        // 移除列表标记（*、-、+）及多余空白
        const item = line.replace(/^\s*[\*\-\+]\s+/, '');
        listHTML += `<li>${processInlineFormatting(item)}</li>`;
    });
    listHTML += '</ul>';
    return listHTML;
}

// Anki 渲染时执行转换
document.addEventListener("DOMContentLoaded", function() {
    const notesDiv = document.querySelector('.notes');
    if (notesDiv) {
        const originalMarkdown = notesDiv.innerText;
        const convertedHTML = markdownToHTML(originalMarkdown);
        notesDiv.innerHTML = convertedHTML;
    }
});
</script>


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