# 多语版注释版
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
    <!-- 引入 PingFang SC 中文字体 -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
</head>
<body>
    <div class="card">
        <!-- 逐步打字效果的单词显示区域 -->
        <div class="word typing-effect" id="animated-text"></div>
        <!-- 显示音标的区域 -->
        <div class="phonetic" id="phonetic-text"></div>
    </div>

    <!-- 播放单词发音按钮 -->
    <button class="btn" id="playWordButton" onclick="playWordTTS()">▶️</button>
    <!-- 播放例句发音按钮 -->
    <button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶️</button>

    <script>
        // 获取单词和音标
        const word = "{{单词}}";
        const phonetic = "{{音标}}";

        // 获取 HTML 容器
        const container = document.getElementById("animated-text");
        const phoneticContainer = document.getElementById("phonetic-text");

        // 生成欧路词典查询链接
        const eudicURL = `eudic://dict/${word}`;
        let index = 0;

        // 逐步打字效果
        function typeLetter() {
            if (index < word.length) {
                // 逐个字母显示，并生成超链接
                container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;
                index++;
                setTimeout(typeLetter, 500); // 每 500ms 显示一个字母
            } else {
                container.style.borderRight = 'none'; // 结束后去掉光标样式
            }
        }

        // 显示音标
        phoneticContainer.textContent = phonetic;

        // 启动打字动画
        typeLetter();

        // 播放单词发音
        function playWordTTS() {
            const domain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];
            let text = word.trim();

            if (!text) {
                alert('单词字段为空，无法生成音频');
                return;
            }

            let voice = 'fr-FR-DeniseNeural'; // 默认法语发音

            // **语言检测：如果是希伯来语，则切换语音**
            const hebrewRegex = /[\u0590-\u05FF]/;
            if (hebrewRegex.test(text)) {
                voice = 'he-IL-HilaNeural'; // 以色列希伯来语
            }

            // 生成 TTS API 请求
            const queryString = new URLSearchParams({ text, voiceName: voice, speed: 0 }).toString();

            // **防止重复音频标签**
            let existingAudio = document.getElementById('hiddenAudioWord');
            if (existingAudio) existingAudio.remove();

            // 创建隐藏的 audio 元素
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

        // 播放例句发音
        function playExampleTTS() {
            const domain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];
            let exampleText = document.querySelector('.example')?.innerText.trim();

            if (!exampleText) {
                alert('例句字段为空，无法生成音频');
                return;
            }

            const voice = 'en-US-EricNeural'; // 美式英语发音
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

        // **固定播放按钮的位置**
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

        // **页面加载后自动播放单词 TTS**
        window.onload = function() {
            playWordTTS();
        };
    </script>
</body>
</html>

# 单一语言版本

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

        function playWordTTS() {
            const domain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];
            let text = word.trim();

            if (!text) {
                alert('单词字段为空，无法生成音频');
                return;
            }

            const voice = 'fr-FR-DeniseNeural';
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
            let exampleText = document.querySelector('.example').innerText.trim();

            if (!exampleText) {
                alert('例句字段为空，无法生成音频');
                return;
            }

            const voice = 'en-US-EricNeural';
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