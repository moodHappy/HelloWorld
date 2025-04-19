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