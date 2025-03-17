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
    <button class="btn" id="playWordButton" onclick="playWordTTS()">▶️</button>  
    <button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶️</button>  

<script>  
    const word = "{{单词}}";  
    const phonetic = "{{音标}}";  
    const language = "{{语种}}";  // 获取语种字段
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
    phoneticContainer.textContent = phonetic;  
    typeLetter();  

    function playWordTTS() {  
        const domain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];  
        let text = word.trim();  
        if (!text) {  
            alert('单词字段为空，无法生成音频');  
            return;  
        }  

        let voice = 'en-US-EricNeural';  // 默认英语男声

        // 根据语种字段选择语音
        const languageVoices = {
            "de": "de-DE-ConradNeural",  // 德语
            "fr": "fr-FR-DeniseNeural",  // 法语
            "es": "es-ES-AlvaroNeural",  // 西班牙语
            "it": "it-IT-DiegoNeural",   // 意大利语
            "hi": "hi-IN-SwaraNeural",   // 印地语
            "ko": "ko-KR-SunHiNeural",   // 韩语
            "ru": "ru-RU-DmitryNeural",  // 俄语
            "he": "he-IL-HilaNeural"     // 希伯来语
        };

        if (languageVoices[language]) {
            voice = languageVoices[language];
        }

        const queryString = new URLSearchParams({ text, voiceName: voice, speed: 0 }).toString();  

        let existingAudio = document.getElementById('hiddenAudioWord');  
        if (existingAudio) existingAudio.remove();  

        const audio = document.createElement('audio');  
        audio.id = 'hiddenAudioWord';  
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

    function playExampleTTS() {  
        const domain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];  
        let exampleText = document.querySelector('.example')?.innerText.trim();  

        if (!exampleText) {  
            alert('例句字段为空，无法生成音频');  
            return;  
        }  

        const voice = languageVoices[language] || "en-US-EricNeural";  
        const queryString = new URLSearchParams({ text: exampleText, voiceName: voice, speed: 0 }).toString();  

        let existingAudio = document.getElementById('hiddenAudioExample');  
        if (existingAudio) existingAudio.remove();  

        const audio = document.createElement('audio');  
        audio.id = 'hiddenAudioExample';  
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