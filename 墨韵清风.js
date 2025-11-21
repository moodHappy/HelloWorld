
正面：

<div id="version-info" style="display: none;">version: 2.1.0 (Nebula)</div>

<script>
// --- 背景色设置 ---
// 设置为 true 开启随机背景色功能 (在浅色模式下排除绿色、蓝色、紫色等)
// 设置为有效的CSS颜色字符串 (在浅色模式下使用)
// 设置为 'auto' 则根据系统深色模式自动切换 (深色模式强制为 #1E1E1E)
// 设置为 false 或其他非字符串/非 true /非 'auto' 的值则不应用特殊背景色 (使用Anki默认或CSS中定义的背景)
// #F0F8FF  爱丽丝蓝
// #FAF9F6  米白色
// #EAF3FB  浅灰蓝
// #EDF6EC  淡抹茶绿
// #F5F5DC  沙色
// #F2F2F2  浅灰
// #FFF8DC  玉米丝色
// #FFFAF0  花白色
// #F4F1EE  烟雾米
// #ECEBE4  砂岩灰
// #F3E5AB  浅奶油黄
// #EDEDED  极淡灰
// #1E1E1E  夜间模式
const backgroundColorSetting = '#F4F1EE'; // <--- 在这里设置 'true'、颜色字符串、'auto' 或 'false'
const darkModeOverrideColor = '#1E1E1E';
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function applyBackgroundColor(color) {
    if (color) {
        const style = document.createElement('style');
        style.innerHTML = `
          body, html, .card, * {
            background-color: ${color} !important;
          }
        `;
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
        style.setAttribute('data-background-changer', 'true');
        document.head.appendChild(style);
    } else {
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
    }
}
function determineBackgroundColor() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return darkModeOverrideColor;
    } else {
        if (typeof backgroundColorSetting === 'string' && backgroundColorSetting) {
            return backgroundColorSetting;
        } else if (backgroundColorSetting === true) {
            let isExcludedHue = true;
            let h, s, l;
            while (isExcludedHue) {
              h = Math.floor(Math.random() * 361);
              isExcludedHue =
                (h >= 90 && h <= 150) ||
                (h >= 210 && h <= 270) ||
                (h >= 270 && h <= 330);
            }
            s = Math.floor(Math.random() * (101 - 40)) + 40;
            l = Math.floor(Math.random() * (81 - 40)) + 40;
            return hslToHex(h, s, l);
        } else {
            return null;
        }
    }
}
applyBackgroundColor(determineBackgroundColor());
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        applyBackgroundColor(determineBackgroundColor());
    });
}
</script>

<div class="card">
  <div class="word typing-effect" id="animated-text"></div>
  <div class="phonetic" id="phonetic-text"></div>
</div>

<button class="btn" id="playWordButton" onclick="playSpellingAndWord()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>
<button class="btn" id="repeatWordButton" onclick="playWordTTSRepeated()">▶</button>

<script>
  let enablePronunciation = false;
  let useAlternativeTTS = false;

  const word = "{{单词}}";
  const language = "{{语种}}".trim();
  const container = document.getElementById("animated-text");
  const phoneticContainer = document.getElementById("phonetic-text");
  const eudicURL = `eudic://dict/${word}`;

  container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
  phoneticContainer.textContent = "{{IPA}}";

  const WORD_LENGTH_THRESHOLD = 15;
  if (word.length > WORD_LENGTH_THRESHOLD) {
    container.style.fontSize = '24px';
  }

  // --- 更新后的随机选择英文语音 ---
  const englishVoices = [
"en-US-AdamNeural",
"en-US-AriaNeural",
"en-US-AnaNeural",
"en-US-AndrewNeural",
"en-US-AvaNeural",
"en-US-BrianNeural",
"en-US-ChristopherNeural",
"en-US-CoraNeural",
"en-US-DavisNeural",
"en-US-ElizabethNeural",
"en-US-EricNeural",
"en-US-GuyNeural",
"en-US-JennyNeural",
"en-US-MichelleNeural",
"en-US-RogerNeural",
"en-US-SteffanNeural",
"en-US-TonyNeural"
  ];

  function getRandomEnglishVoice() {
    return englishVoices[Math.floor(Math.random() * englishVoices.length)];
  }

  const voiceMap = {
    "de": "de-DE-ConradNeural",
    "es": "es-ES-AlvaroNeural",
    "it": "it-IT-DiegoNeural",
    "hi": "hi-IN-MadhurNeural",
    "ko": "ko-KR-SunHiNeural",
    "fr": "fr-FR-DeniseNeural",
    "ru": "ru-RU-DmitryNeural",
    "he": "he-IL-AvriNeural",
    "": getRandomEnglishVoice() // 如果语种为空，则随机选择一个英文语音
  };

  const selectedVoice = voiceMap[language] || getRandomEnglishVoice();
  // --- 结束更新 ---

  function playTTS(text, audioId, callback) {
    if (!text) {
      alert('Text is empty, unable to generate audio');
      return;
    }
    
    const old = document.getElementById(audioId);
    if (old) old.remove();

    const audio = document.createElement('audio');
    audio.id = audioId;
    audio.style.display = 'none';
    
    let src;
    if (useAlternativeTTS) {
      const queryString = new URLSearchParams({
        text: text.trim(),
        voiceName: selectedVoice,
        speed: 0,
      }).toString();
      src = `https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/api/aiyue?${queryString}`;
    } else {
      src = `https://libre-tts-nu.vercel.app/api/tts?t=${encodeURIComponent(text.trim())}&v=${encodeURIComponent(selectedVoice)}&r=0&p=0`;
    }

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

  function playWordTTSRepeated(times = 100) {
    let count = 0;
    const playNext = () => {
      if (++count < times) {
        playTTS(word, 'hiddenAudioWordRepeated', playNext);
      }
    };
    playTTS(word, 'hiddenAudioWordRepeated', playNext);
  }

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
      else if (inCoca)                          a.style.color = '#20B2AA';
      else if (inGoogle)                        a.style.color = 'blue';
      else if (inOxford)                        a.style.color = 'green';
      else                                      a.style.color = 'inherit';
    }
  });
</script>


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