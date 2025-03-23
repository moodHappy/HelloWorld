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

