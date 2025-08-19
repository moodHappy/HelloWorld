## 九版，双TTS域名

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
// #F3F3E8  米灰色
// #FAFAD2  淡金黄
// #FFFACD  柠檬绸
// #FFDAB9  桃仁色
// #FFEBCD  白杏仁色
// #FAF0E6  亚麻色
// #FDF5E6  旧花边色
// #F0FFF0  蜜露绿
// #FFF5EE  海贝壳色
// #F8F8FF  幽灵白
// #E0FFFF  淡青色
// #F0FFFF  蔚蓝
// #FFF0F5  薰衣草绯红
// #FFFAFA  雪白
// #F5FFFA  薄荷奶油
// #E6E6FA  淡紫罗兰
// #FBEEC1  奶油杏
// #F3E5AB  浅奶油黄
// #EDEDED  极淡灰
// #1E1E1E  夜间模式



const backgroundColorSetting = '#EAF3FB'; // <--- 在这里设置 'true'、颜色字符串、'auto' 或 'false'





// 深色模式强制背景色
const darkModeOverrideColor = '#1E1E1E';

// ---------------------

let finalBackgroundColor = null; // 存储最终需要应用的背景色

// --- HSL到Hex颜色转换函数 (标准实现) ---
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
// --- 结束 HSL到Hex颜色转换函数 ---

// 应用背景色的函数
function applyBackgroundColor(color) {
    if (color) {
        const style = document.createElement('style');
        style.innerHTML = `
          body, html, .card, * {
            background-color: ${color} !important;
          }
        `;
        // 移除之前可能存在的 style 标签，避免叠加
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
        style.setAttribute('data-background-changer', 'true'); // 添加标记，方便后续查找和移除
        document.head.appendChild(style);
    } else {
        // 如果 finalBackgroundColor 为 null，移除我们添加的 style 标签，恢复默认或 CSS 样式
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
    }
}

function determineBackgroundColor() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return darkModeOverrideColor; // 强制返回深色模式颜色
    } else {
        // 浅色模式下，根据 backgroundColorSetting 决定颜色
        if (typeof backgroundColorSetting === 'string' && backgroundColorSetting) {
            return backgroundColorSetting; // 使用自定义颜色
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
            return hslToHex(h, s, l); // 返回随机颜色
        } else {
            return null; // 不应用特殊背景色
        }
    }
}

// 初始应用背景色
applyBackgroundColor(determineBackgroundColor());

// 监听系统颜色模式的变化
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
  // 全局开关变量，true 为开启自动拼读，false 为关闭
  let enablePronunciation = false; // 默认设置为 false，关闭自动拼读
  
  // 主 TTS 服务选择开关
  let useAlternativeTTS = false; // 设置为 false 使用 LibreTTS，设置为 true 使用 Aiyue 服务

  const word = "{{单词}}";
  const language = "{{语种}}".trim();
  const container = document.getElementById("animated-text");
  const phoneticContainer = document.getElementById("phonetic-text");
  const eudicURL = `eudic://dict/${word}`;

  container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
  phoneticContainer.textContent = "{{IPA}}";

  // --- Start: Font size adjustment for long words ---
  const WORD_LENGTH_THRESHOLD = 15; // Adjust this value as needed
  if (word.length > WORD_LENGTH_THRESHOLD) {
    container.style.fontSize = '24px';
  }
  // --- End: Font size adjustment for long words ---

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

  // --- 整合后的 TTS 播放函数 ---
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
      // 使用备用 TTS 服务 (Aiyue)
      const queryString = new URLSearchParams({
        text: text.trim(),
        voiceName: selectedVoice,
        speed: 0,
      }).toString();
      src = `https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/api/aiyue?${queryString}`;
    } else {
      // 使用主要 TTS 服务 (LibreTTS)
      src = `https://libre-tts-nu.vercel.app/api/tts?t=${encodeURIComponent(text.trim())}&v=${encodeURIComponent(selectedVoice)}&r=0&p=0`;
    }

    audio.innerHTML = `<source src="${src}" type="audio/mpeg">`;
    document.body.append(audio);

    audio.onended = () => callback?.();
    audio.play();
  }
  // --- 结束 整合后的 TTS 播放函数 ---

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
      else if (inCoca)                          a.style.color = '#A9A9A9';
      else if (inGoogle)                        a.style.color = 'blue';
      else if (inOxford)                        a.style.color = 'green';
      else                                      a.style.color = 'inherit';
    }
  });
</script>


## 八版，JSON文件存储到anki媒体文件

<div class="card">
  <div class="word typing-effect" id="animated-text"></div>
  <div class="phonetic" id="phonetic-text"></div>
</div>
<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>
<script>
  // Define word and language (template variables)
  const word = "{{单词}}";
  const language = "{{语种}}".trim();
  const container = document.getElementById("animated-text");
  const phoneticContainer = document.getElementById("phonetic-text");
  const eudicURL = `eudic://dict/${word}`;

  // Display the full word directly
  container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
  phoneticContainer.textContent = "{{IPA}}";

  // Language mapping table
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

  // Common function to play TTS
  function playTTS(text, audioId) {
    if (!text) {
      alert('Text is empty, unable to generate audio');
      return;
    }
    const queryString = new URLSearchParams({
      text: text.trim(),
      voiceName: selectedVoice,
      speed: 0,
    }).toString();

    // Remove old <audio> element
    const old = document.getElementById(audioId);
    if (old) old.remove();

    const audio = document.createElement('audio');
    audio.id = audioId;
    audio.style.display = 'none';
    // IMPORTANT: This URL points to a service that may not be available or stable.
    // Replace with your own TTS service endpoint if needed.
    const src = `https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/api/aiyue?${queryString}`;
    audio.innerHTML = `<source src="${src}" type="audio/mpeg">`;
    document.body.append(audio);
    audio.play();
  }

  function playWordTTS() {
    playTTS(word, 'hiddenAudioWord');
  }
  function playExampleTTS() {
    const exampleText = document.querySelector('.example')?.innerText?.trim() || '';
    playTTS(exampleText, 'hiddenAudioExample');
  }

  // Button positioning
  ['Word','Example'].forEach(type => {
    const btn = document.getElementById(`play${type}Button`);
    btn.style.position = 'fixed';
    btn.style.bottom = type === 'Word' ? '200px' : '150px';
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
  });

  // Auto play word TTS on load
  window.onload = playWordTTS;
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

    // COCA - Change to local path
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

      // Google - Change to local path
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

      // Oxford - Loading from local file
      .then(() => fetch("./_OxfordLevels.json")) // Changed to local path
      .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(oxfordList => {
        const rank = oxfordList[currentWord];
        document.getElementById("frequency-oxford").textContent = rank ? `Oxford：${rank}` : `Oxford：未找到`;
        foundInOxford = !!rank;
      })
      .catch((error) => {
        console.error("Error fetching Oxford data:", error);
        document.getElementById("frequency-oxford").textContent = `Oxford：加载失败`;
      })

      // Update word color based on presence in the lists
      .finally(() => updateWordColor(foundInCoca, foundInGoogle, foundInOxford, anchor));

    function updateWordColor(inCoca, inGoogle, inOxford, a) {
      if (!a) return;
      if (inCoca && inGoogle && inOxford)       a.style.color = '#800080'; // Purple
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

## 七版

<div class="card">    
  <div class="word typing-effect" id="animated-text"></div>    
  <div class="phonetic" id="phonetic-text"></div>    
</div>    

<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>    
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>  

<script>    
  // 定义单词和语种（模板变量）    
  const word = "{{单词}}";    
  const language = "{{语种}}".trim();    
  const container = document.getElementById("animated-text");    
  const phoneticContainer = document.getElementById("phonetic-text");    
  const eudicURL = `eudic://dict/${word}`;    

  // 直接显示完整单词    
  container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;    
  phoneticContainer.textContent = "{{IPA}}";    

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
    "": "en-US-EricNeural"    
  };    

  const selectedVoice = voiceMap[language] || "en-US-EricNeural";    

  // 播放 TTS 的公共函数    
  function playTTS(text, audioId) {    
    if (!text) {    
      alert('文本为空，无法生成音频');    
      return;    
    }    
    const queryString = new URLSearchParams({    
      text: text.trim(),    
      voiceName: selectedVoice,    
      speed: 0,    
    }).toString();    

    // 清除旧的 <audio>    
    const old = document.getElementById(audioId);    
    if (old) old.remove();    

    const audio = document.createElement('audio');    
    audio.id = audioId;    
    audio.style.display = 'none';    
    const src = `https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/api/aiyue?${queryString}`;    
    audio.innerHTML = `<source src="${src}" type="audio/mpeg">`;    
    document.body.append(audio);    
    audio.play();    
  }    

  function playWordTTS() {    
    playTTS(word, 'hiddenAudioWord');    
  }    
  function playExampleTTS() {    
    const exampleText = document.querySelector('.example')?.innerText?.trim() || '';    
    playTTS(exampleText, 'hiddenAudioExample');    
  }    

  // 按钮定位    
  ['Word','Example'].forEach(type => {    
    const btn = document.getElementById(`play${type}Button`);    
    btn.style.position = 'fixed';    
    btn.style.bottom = type === 'Word' ? '200px' : '150px';    
    btn.style.left = '50%';    
    btn.style.transform = 'translateX(-50%)';    
  });    

  window.onload = playWordTTS;    
</script>  

<!-- 右下角 JTWord 按钮 -->  
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

<!-- 词频显示 -->  
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

    // COCA    
    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/COCA.json")  
      .then(res => res.json())  
      .then(cocaList => {    
        const rank = cocaList[currentWord];    
        document.getElementById("frequency-coca").textContent = rank ? `COCA：${rank}` : `COCA：未找到`;    
        foundInCoca = !!rank;    
      })  

    // Google    
      .then(() => fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Google.json"))  
      .then(res => res.json())  
      .then(googleList => {    
        const rank = googleList[currentWord];    
        document.getElementById("frequency-google").textContent = rank ? `Google：${rank}` : `Google：未找到`;    
        foundInGoogle = !!rank;    
      })  

    // Oxford    
      .then(() => fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Oxford.json"))  
      .then(res => res.json())  
      .then(oxfordList => {    
        const info = oxfordList[currentWord];    
        document.getElementById("frequency-oxford").textContent = info ? `Oxford：${currentWord}` : `Oxford：未找到`;    
        foundInOxford = !!info;    
      })  

    // 后续统一更新颜色    
      .catch(() => { /* 加载失败时保持默认 */ })  
      .finally(() => updateWordColor(foundInCoca, foundInGoogle, foundInOxford, anchor));    

    function updateWordColor(inCoca, inGoogle, inOxford, a) {    
      if (!a) return;    
      if (inCoca && inGoogle && inOxford)       a.style.color = '#800080';    
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


## 六版

<div class="card">
    <div class="word typing-effect" id="animated-text"></div>
    <div class="phonetic" id="phonetic-text"></div>
</div>
<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>

<script>
    // 定义单词和语种（模板变量）
    const word = "{{单词}}";
    const language = "{{语种}}".trim(); // 语种字段
    const container = document.getElementById("animated-text");
    const phoneticContainer = document.getElementById("phonetic-text");

    const eudicURL = `eudic://dict/${word}`;
    let index = 0;

    // 直接显示完整单词
    container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
    phoneticContainer.textContent = "{{IPA}}";

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

    // 播放 TTS 的公共函数
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
    playWordButton.style.bottom = '200px';
    playWordButton.style.left = '50%';
    playWordButton.style.transform = 'translateX(-50%)';

    playExampleButton.style.position = 'fixed';
    playExampleButton.style.bottom = '150px';
    playExampleButton.style.left = '50%';
    playExampleButton.style.transform = 'translateX(-50%)';

    window.onload = function() {
        playWordTTS();
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
    box-shadow: none;
    opacity: 0.4;
    cursor: pointer;
  ">
    JTWord
  </button>
</div>

<script>
function copyAndGo(word) {
  navigator.clipboard.writeText(word).then(function() {
    window.open('https://www.just-the-word.com', '_blank');
  }, function() {
    alert('复制失败，请手动复制 "' + word + '"');
    window.open('https://www.just-the-word.com', '_blank');
  });
}
</script>

<div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 5px;">
  <div id="frequency-coca">COCA：加载中...</div>
  <div id="frequency-oxford">Oxford：加载中...</div>
</div>
<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const wordDiv = document.getElementById("word-data");
    if (!wordDiv) return;

    const currentWord = wordDiv.textContent.trim().toLowerCase();
    const wordElement = document.getElementById("animated-text");
    const anchor = wordElement.querySelector('a');
    let foundInCoca = false;
    let foundInOxford = false;

    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/COCA.json")
      .then(res => res.json())
      .then(cocaList => {
        const cocaRank = cocaList[currentWord];
        const cocaOutput = cocaRank ? `COCA：${cocaRank}` : `COCA：未找到`;
        document.getElementById("frequency-coca").textContent = cocaOutput;
        foundInCoca = !!cocaRank;
        updateWordColor(foundInCoca, foundInOxford, anchor);

        return fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Oxford.json");
      })
      .then(res => res.json())
      .then(oxfordList => {
        const oxfordInfo = oxfordList[currentWord];
        const oxfordOutput = oxfordInfo ? `Oxford：${currentWord}` : `Oxford：未找到`;
        document.getElementById("frequency-oxford").textContent = oxfordOutput;
        foundInOxford = !!oxfordInfo;
        updateWordColor(foundInCoca, foundInOxford, anchor);
      })
      .catch(error => {
        console.error("词频加载失败：", error);
        document.getElementById("frequency-coca").textContent = "COCA：加载失败";
        document.getElementById("frequency-oxford").textContent = "Oxford：加载失败";
        updateWordColor(foundInCoca, foundInOxford, anchor);
      });

    function updateWordColor(inCoca, inOxford, anchorElement) {
      if (!anchorElement) return;
      if (inCoca && inOxford) {
        anchorElement.style.color = '#800080'; // Purple
      } else if (inCoca) {
        anchorElement.style.color = 'black'; // Blue
      } else if (inOxford) {
        anchorElement.style.color = 'black'; // Light Brown (Sienna)
      } else {
        anchorElement.style.color = 'inherit'; // Black (default from CSS)
      }
    }
  });
</script>

## 五版

<div class="card">
    <div class="word typing-effect" id="animated-text"></div>
    <div class="phonetic" id="phonetic-text"></div>
</div>
<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>

<script>
    // 定义单词和语种（模板变量）
    const word = "{{单词}}";
    const language = "{{语种}}".trim(); // 语种字段
    const container = document.getElementById("animated-text");
    const phoneticContainer = document.getElementById("phonetic-text");

    const eudicURL = `eudic://dict/${word}`;
    let index = 0;

    // 直接显示完整单词
    container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
    phoneticContainer.textContent = "{{IPA}}";

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

    // 播放 TTS 的公共函数
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
    playWordButton.style.bottom = '200px';
    playWordButton.style.left = '50%';
    playWordButton.style.transform = 'translateX(-50%)';

    playExampleButton.style.position = 'fixed';
    playExampleButton.style.bottom = '150px';
    playExampleButton.style.left = '50%';
    playExampleButton.style.transform = 'translateX(-50%)';

    window.onload = function() {
        playWordTTS();
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
    box-shadow: none;
    opacity: 0.4;
    cursor: pointer;
  ">
    JTWord
  </button>
</div>

<script>
function copyAndGo(word) {
  navigator.clipboard.writeText(word).then(function() {
    window.open('https://www.just-the-word.com', '_blank');
  }, function() {
    alert('复制失败，请手动复制 "' + word + '"');
    window.open('https://www.just-the-word.com', '_blank');
  });
}
</script>

<div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 5px;">
  <div id="frequency-coca">COCA：加载中...</div>
  <div id="frequency-bnc">BNC：加载中...</div>
  <div id="frequency-oxford">Oxford：加载中...</div>
</div>
<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const wordDiv = document.getElementById("word-data");
    if (!wordDiv) return;

    const currentWord = wordDiv.textContent.trim().toLowerCase();
    const wordElement = document.getElementById("animated-text");
    const anchor = wordElement.querySelector('a');
    let foundInCoca = false;
    let foundInBnc = false;
    let foundInOxford = false;

    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/COCA.json")
      .then(res => res.json())
      .then(cocaList => {
        const cocaRank = cocaList[currentWord];
        const cocaOutput = cocaRank ? `COCA：${cocaRank}` : `COCA：未找到`;
        document.getElementById("frequency-coca").textContent = cocaOutput;
        foundInCoca = !!cocaRank;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);

        return fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/BNC.json");
      })
      .then(res => res.json())
      .then(bncList => {
        const bncRank = bncList[currentWord];
        const bncOutput = bncRank ? `BNC：${bncRank}` : `BNC：未找到`;
        document.getElementById("frequency-bnc").textContent = bncOutput;
        foundInBnc = !!bncRank;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);

        return fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Oxford.json");
      })
      .then(res => res.json())
      .then(oxfordList => {
        const oxfordInfo = oxfordList[currentWord];
        const oxfordOutput = oxfordInfo ? `Oxford：${currentWord}` : `Oxford：未找到`;
        document.getElementById("frequency-oxford").textContent = oxfordOutput;
        foundInOxford = !!oxfordInfo;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);
      })
      .catch(error => {
        console.error("词频加载失败：", error);
        document.getElementById("frequency-coca").textContent = "COCA：加载失败";
        document.getElementById("frequency-bnc").textContent = "BNC：加载失败";
        document.getElementById("frequency-oxford").textContent = "Oxford：加载失败";
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);
      });

    function updateWordColor(inCoca, inBnc, inOxford, anchorElement) {
      if (!anchorElement) return;
      if (inCoca && inBnc && inOxford) {
        anchorElement.style.color = '#800080'; // Purple
      } else if (inCoca && inBnc) {
        anchorElement.style.color = 'black'; // Blue
      } else if (inCoca && inOxford) {
        anchorElement.style.color = '#008000'; // Light Brown (Sienna)
      } else if (inBnc && inOxford) {
        anchorElement.style.color = 'black'; // Dark Turquoise
      } else if (inCoca) {
        anchorElement.style.color = 'black'; // Orange
      } else if (inBnc) {
        anchorElement.style.color = '#008000'; // Dodger Blue
      } else if (inOxford) {
        anchorElement.style.color = 'black'; // Green
      } else {
        anchorElement.style.color = 'inherit'; // Black (default from CSS)
      }
    }
  });
</script>

## 四版

<div class="card">
    <div class="word typing-effect" id="animated-text"></div>
    <div class="phonetic" id="phonetic-text"></div>
</div>
<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>

<script>
    // 定义单词和语种（模板变量）
    const word = "{{单词}}";
    const language = "{{语种}}".trim(); // 语种字段
    const container = document.getElementById("animated-text");
    const phoneticContainer = document.getElementById("phonetic-text");

    const eudicURL = `eudic://dict/${word}`;
    let index = 0;

    // 直接显示完整单词
    container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
    phoneticContainer.textContent = "{{IPA}}";

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

    // 播放 TTS 的公共函数
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
    playWordButton.style.bottom = '200px';
    playWordButton.style.left = '50%';
    playWordButton.style.transform = 'translateX(-50%)';

    playExampleButton.style.position = 'fixed';
    playExampleButton.style.bottom = '150px';
    playExampleButton.style.left = '50%';
    playExampleButton.style.transform = 'translateX(-50%)';

    window.onload = function() {
        playWordTTS();
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
    box-shadow: none;
    opacity: 0.4;
    cursor: pointer;
  ">
    JTWord
  </button>
</div>

<script>
function copyAndGo(word) {
  navigator.clipboard.writeText(word).then(function() {
    window.open('https://www.just-the-word.com', '_blank');
  }, function() {
    alert('复制失败，请手动复制 "' + word + '"');
    window.open('https://www.just-the-word.com', '_blank');
  });
}
</script>

<div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 5px;">
  <div id="frequency-coca">COCA：加载中...</div>
  <div id="frequency-bnc">BNC：加载中...</div>
  <div id="frequency-oxford">Oxford：加载中...</div>
</div>
<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const wordDiv = document.getElementById("word-data");
    if (!wordDiv) return;

    const currentWord = wordDiv.textContent.trim().toLowerCase();
    const wordElement = document.getElementById("animated-text");
    const anchor = wordElement.querySelector('a');
    let foundInCoca = false;
    let foundInBnc = false;
    let foundInOxford = false;

    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/COCA.json")
      .then(res => res.json())
      .then(cocaList => {
        const cocaRank = cocaList[currentWord];
        const cocaOutput = cocaRank ? `COCA：${cocaRank}` : `COCA：未找到`;
        document.getElementById("frequency-coca").textContent = cocaOutput;
        foundInCoca = !!cocaRank;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);

        return fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/BNC.json");
      })
      .then(res => res.json())
      .then(bncList => {
        const bncRank = bncList[currentWord];
        const bncOutput = bncRank ? `BNC：${bncRank}` : `BNC：未找到`;
        document.getElementById("frequency-bnc").textContent = bncOutput;
        foundInBnc = !!bncRank;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);

        return fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Oxford.json");
      })
      .then(res => res.json())
      .then(oxfordList => {
        const oxfordInfo = oxfordList[currentWord];
        const oxfordOutput = oxfordInfo ? `Oxford：${currentWord}` : `Oxford：未找到`;
        document.getElementById("frequency-oxford").textContent = oxfordOutput;
        foundInOxford = !!oxfordInfo;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);
      })
      .catch(error => {
        console.error("词频加载失败：", error);
        document.getElementById("frequency-coca").textContent = "COCA：加载失败";
        document.getElementById("frequency-bnc").textContent = "BNC：加载失败";
        document.getElementById("frequency-oxford").textContent = "Oxford：加载失败";
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);
      });

    function updateWordColor(inCoca, inBnc, inOxford, anchorElement) {
      if (!anchorElement) return;
      if (inCoca && inBnc && inOxford) {
        anchorElement.style.color = '#800080'; // Purple
      } else if (inCoca && inBnc) {
        anchorElement.style.color = 'black'; // Blue
      } else if (inCoca && inOxford) {
        anchorElement.style.color = '#008000'; // Light Brown (Sienna)
      } else if (inBnc && inOxford) {
        anchorElement.style.color = 'black'; // Dark Turquoise
      } else if (inCoca) {
        anchorElement.style.color = 'black'; // Orange
      } else if (inBnc) {
        anchorElement.style.color = '#008000'; // Dodger Blue
      } else if (inOxford) {
        anchorElement.style.color = 'black'; // Green
      } else {
        anchorElement.style.color = 'inherit'; // Black (default from CSS)
      }
    }
  });
</script>

# 三版

<div class="card">
    <div class="word typing-effect" id="animated-text"></div>
    <div class="phonetic" id="phonetic-text"></div>
</div>
<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>

<script>
    // 定义单词和语种（模板变量）
    const word = "{{单词}}";
    const language = "{{语种}}".trim(); // 语种字段
    const container = document.getElementById("animated-text");
    const phoneticContainer = document.getElementById("phonetic-text");

    const eudicURL = `eudic://dict/${word}`;
    let index = 0;

    // 直接显示完整单词
    container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
    phoneticContainer.textContent = "{{IPA}}";

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

    // 播放 TTS 的公共函数
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
    playWordButton.style.bottom = '200px';
    playWordButton.style.left = '50%';
    playWordButton.style.transform = 'translateX(-50%)';

    playExampleButton.style.position = 'fixed';
    playExampleButton.style.bottom = '150px';
    playExampleButton.style.left = '50%';
    playExampleButton.style.transform = 'translateX(-50%)';

    window.onload = function() {
        playWordTTS();
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
    box-shadow: none;
    opacity: 0.4;
    cursor: pointer;
  ">
    JTWord
  </button>
</div>

<script>
function copyAndGo(word) {
  navigator.clipboard.writeText(word).then(function() {
    window.open('https://www.just-the-word.com', '_blank');
  }, function() {
    alert('复制失败，请手动复制 "' + word + '"');
    window.open('https://www.just-the-word.com', '_blank');
  });
}
</script>

<div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 5px;">
  <div id="frequency-coca">COCA：加载中...</div>
  <div id="frequency-bnc">BNC：加载中...</div>
  <div id="frequency-oxford">Oxford：加载中...</div>
</div>
<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const wordDiv = document.getElementById("word-data");
    if (!wordDiv) return;

    const currentWord = wordDiv.textContent.trim().toLowerCase();
    const wordElement = document.getElementById("animated-text");
    const anchor = wordElement.querySelector('a');
    let foundInCoca = false;
    let foundInBnc = false;
    let foundInOxford = false;

    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/COCA.json")
      .then(res => res.json())
      .then(cocaList => {
        const cocaRank = cocaList[currentWord];
        const cocaOutput = cocaRank ? `COCA：${cocaRank}` : `COCA：未找到`;
        document.getElementById("frequency-coca").textContent = cocaOutput;
        foundInCoca = !!cocaRank;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);

        return fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/BNC.json");
      })
      .then(res => res.json())
      .then(bncList => {
        const bncRank = bncList[currentWord];
        const bncOutput = bncRank ? `BNC：${bncRank}` : `BNC：未找到`;
        document.getElementById("frequency-bnc").textContent = bncOutput;
        foundInBnc = !!bncRank;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);

        return fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Oxford.json");
      })
      .then(res => res.json())
      .then(oxfordList => {
        const oxfordInfo = oxfordList[currentWord];
        const oxfordOutput = oxfordInfo ? `Oxford：${currentWord}` : `Oxford：未找到`;
        document.getElementById("frequency-oxford").textContent = oxfordOutput;
        foundInOxford = !!oxfordInfo;
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);
      })
      .catch(error => {
        console.error("词频加载失败：", error);
        document.getElementById("frequency-coca").textContent = "COCA：加载失败";
        document.getElementById("frequency-bnc").textContent = "BNC：加载失败";
        document.getElementById("frequency-oxford").textContent = "Oxford：加载失败";
        updateWordColor(foundInCoca, foundInBnc, foundInOxford, anchor);
      });

    function updateWordColor(inCoca, inBnc, inOxford, anchorElement) {
      if (!anchorElement) return;
      if (inCoca && inBnc && inOxford) {
        anchorElement.style.color = '#800080'; // Purple
      } else if (inCoca && inBnc) {
        anchorElement.style.color = '#008000'; // Blue
      } else if (inCoca && inOxford) {
        anchorElement.style.color = 'black'; // Light Brown (Sienna)
      } else if (inBnc && inOxford) {
        anchorElement.style.color = 'black'; // Dark Turquoise
      } else if (inCoca) {
        anchorElement.style.color = 'black'; // Orange
      } else if (inBnc) {
        anchorElement.style.color = 'black'; // Dodger Blue
      } else if (inOxford) {
        anchorElement.style.color = 'black'; // Green
      } else {
        anchorElement.style.color = 'inherit'; // Black (default from CSS)
      }
    }
  });
</script>

## 二版

<div class="card">
    <div class="word typing-effect" id="animated-text"></div>
    <div class="phonetic" id="phonetic-text"></div>
</div>
<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>

<script>
    // 定义单词和语种（模板变量）
    const word = "{{单词}}";
    const language = "{{语种}}".trim(); // 语种字段
    const container = document.getElementById("animated-text");
    const phoneticContainer = document.getElementById("phonetic-text");

    const eudicURL = `eudic://dict/${word}`;
    let index = 0;

    // 直接显示完整单词
    container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
    phoneticContainer.textContent = "{{IPA}}";

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

    // 播放 TTS 的公共函数
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
    playWordButton.style.bottom = '200px';
    playWordButton.style.left = '50%';
    playWordButton.style.transform = 'translateX(-50%)';

    playExampleButton.style.position = 'fixed';
    playExampleButton.style.bottom = '150px';
    playExampleButton.style.left = '50%';
    playExampleButton.style.transform = 'translateX(-50%)';

    window.onload = function() {
        playWordTTS();
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
    box-shadow: none;
    opacity: 0.4;
    cursor: pointer;
  ">
    JTWord
  </button>
</div>

<script>
function copyAndGo(word) {
  navigator.clipboard.writeText(word).then(function() {
    window.open('https://www.just-the-word.com', '_blank');
  }, function() {
    alert('复制失败，请手动复制 "' + word + '"');
    window.open('https://www.just-the-word.com', '_blank');
  });
}
</script>

<div id="frequency-info">词频加载中...</div>
<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const wordDiv = document.getElementById("word-data");
    if (!wordDiv) return;

    // 获取并转换为小写以匹配 JSON 文件中的键
    const currentWord = wordDiv.textContent.trim().toLowerCase();
    const wordElement = document.getElementById("animated-text");
    const anchor = wordElement.querySelector('a');
    let foundInCoca = false;
    let foundInOxford = false;

    // 只加载 COCA 词频 JSON 文件
    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/coca.json")
      .then(res => res.json())
      .then(cocaList => {
        const cocaRank = cocaList[currentWord];
        const cocaOutput = cocaRank ? `COCA 排名：${cocaRank}` : `COCA：未找到`;
        document.getElementById("frequency-info").innerHTML = cocaOutput;
        foundInCoca = !!cocaRank;
        updateWordColor(foundInCoca, foundInOxford, anchor);
      })
      .catch(error => {
        console.error("词频加载失败：", error);
        document.getElementById("frequency-info").textContent = "词频加载失败";
        updateWordColor(foundInCoca, foundInOxford, anchor); // Still update color based on Oxford
      });

    // 加载牛津词典数据并显示
    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Oxford.json")
      .then(res => res.json())
      .then(oxfordList => {
        const oxfordInfo = oxfordList[currentWord];
        const oxfordOutput = oxfordInfo ? `牛津词典定义：${currentWord}` : `牛津：未找到定义`;
        document.getElementById("frequency-info").innerHTML += `<br/>${oxfordOutput}`;
        foundInOxford = !!oxfordInfo;
        updateWordColor(foundInCoca, foundInOxford, anchor);
      })
      .catch(error => {
        console.error("牛津词典加载失败：", error);
        document.getElementById("frequency-info").textContent += "<br/>牛津词典加载失败";
        updateWordColor(foundInCoca, foundInOxford, anchor); // Still update color based on COCA
      });

    function updateWordColor(inCoca, inOxford, anchorElement) {
      if (!anchorElement) return;
      if (inCoca && inOxford) {
        anchorElement.style.color = '#800080'; // Purple
      } else if (inCoca) {
        anchorElement.style.color = '#A0522D'; // Light Brown (Sienna)
      } else if (inOxford) {
        anchorElement.style.color = '#008000'; // Green
      } else {
        anchorElement.style.color = 'inherit'; // Black (default from CSS)
      }
    }
  });
</script>


# 一版
<div class="card">
    <div class="word typing-effect" id="animated-text"></div>
    <div class="phonetic" id="phonetic-text"></div>
</div>
<button class="btn" id="playWordButton" onclick="playWordTTS()">▶</button>
<button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶</button>

<script>
    // 定义单词和语种（模板变量）
    const word = "{{单词}}";
    const language = "{{语种}}".trim(); // 语种字段
    const container = document.getElementById("animated-text");
    const phoneticContainer = document.getElementById("phonetic-text");

    const eudicURL = `eudic://dict/${word}`;
    let index = 0;

    // 直接显示完整单词
    container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word}</a>`;
    phoneticContainer.textContent = "{{IPA}}";

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

    // 播放 TTS 的公共函数
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
    playWordButton.style.bottom = '200px';
    playWordButton.style.left = '50%';
    playWordButton.style.transform = 'translateX(-50%)';

    playExampleButton.style.position = 'fixed';
    playExampleButton.style.bottom = '150px';
    playExampleButton.style.left = '50%';
    playExampleButton.style.transform = 'translateX(-50%)';

    window.onload = function() {
        playWordTTS();
    };
</script>

<!-- 极不显眼的右侧按钮 -->
<div style="text-align: right;">
  <button onclick="copyAndGo('{{单词}}')" style="
    background: #f0f0f0;
    color: #999;
    font-size: 80%;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: none;
    opacity: 0.4;
    cursor: pointer;
  ">
    JTWord
  </button>
</div>

<script>
function copyAndGo(word) {
  navigator.clipboard.writeText(word).then(function() {
    window.open('https://www.just-the-word.com', '_blank');
  }, function() {
    alert('复制失败，请手动复制 "' + word + '"');
    window.open('https://www.just-the-word.com', '_blank');
  });
}
</script>

<div id="frequency-info">词频加载中...</div>
<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const wordDiv = document.getElementById("word-data");
    if (!wordDiv) return;

    // 获取并转换为小写以匹配 JSON 文件中的键
    const currentWord = wordDiv.textContent.trim().toLowerCase();

    // 只加载 COCA 词频 JSON 文件
    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/coca.json")
      .then(res => res.json())
      .then(cocaList => {
        const cocaRank = cocaList[currentWord];
        const output = cocaRank ? `COCA 排名：${cocaRank}` : `COCA：未找到`;
        document.getElementById("frequency-info").innerHTML = output;

        // 若单词存在于 JSON 中，则将单词显示为红色
        if (cocaRank) {
          const wordElement = document.getElementById("animated-text");
          // 取出内部的 <a> 标签，然后设置样式
          const anchor = wordElement.querySelector('a');
          if (anchor) {
            anchor.style.color = '#800080';
          }
        }
      })
      .catch(error => {
        console.error("词频加载失败：", error);
        document.getElementById("frequency-info").textContent = "词频加载失败";
      });

    // 加载牛津词典数据并显示
    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/Oxford.json")
      .then(res => res.json())
      .then(oxfordList => {
        const oxfordInfo = oxfordList[currentWord];
        const oxfordOutput = oxfordInfo ? `牛津词典定义：${currentWord}` : `牛津：未找到定义`;
        document.getElementById("frequency-info").innerHTML += `<br/>${oxfordOutput}`;

        // 若单词存在于 JSON 中，则将单词显示为红色
        if (oxfordInfo) {
          const wordElement = document.getElementById("animated-text");
          const anchor = wordElement.querySelector('a');
          if (anchor) {
            anchor.style.color = '#800080';
          }
        }
      })
      .catch(error => {
        console.error("牛津词典加载失败：", error);
        document.getElementById("frequency-info").textContent += "<br/>牛津词典加载失败";
      });
  });
</script>