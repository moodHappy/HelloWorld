<div class="kanji">
  {{kanji:日文}}
</div>

<!-- 播放按钮，使用Anki默认的按钮样式，并显示播放符号 -->
<button class="btn" id="playAudioButton" onclick="playTTS()">▶</button>

<script>
  function playTTS() {
    // 配置两个域名
    const domain = [
      'https://anki.0w0.live/',
      'https://ms-ra-forwarder-for-ifreetime-v9q1.vercel.app/',
    ];

    // 从Anki字段获取文本内容
    const text = document.querySelector('.kanji').innerText.trim();

    // 如果字段为空，则返回
    if (!text) {
      alert('文本字段为空，无法生成音频');
      return;
    }

    // 选择一个语音
    const voice = 'ja-JP-KeitaNeural'; // 根据需要调整语音名称

    // 生成查询参数
    const queryString = new URLSearchParams({
      text: text,
      voiceName: voice,
      speed: -4, // 调整语速
    }).toString();

    // 检查是否已存在音频元素，防止重复创建
    let existingAudio = document.getElementById('hiddenAudio');
    if (existingAudio) {
      existingAudio.remove(); // 如果存在，先移除旧的音频元素
    }

    // 创建音频元素但不显示
    const audio = document.createElement('audio');
    audio.id = 'hiddenAudio'; // 设置ID以便于后续控制
    audio.style.display = 'none'; // 隐藏音频条

    // 为每个域名生成音频源
    for (const url of domain) {
      const source = document.createElement('source');
      source.src = `${url}api/aiyue?${queryString}`;
      source.type = 'audio/mpeg';
      audio.append(source);
    }

    // 将音频元素插入页面
    document.body.append(audio);

    // 播放音频
    audio.play();
  }

  // 设置播放按钮的位置
  const playButton = document.getElementById('playAudioButton');
  playButton.style.position = 'fixed';
  playButton.style.bottom = '250px'; // 距离底部200px
  playButton.style.left = '50%'; // 水平居中
  playButton.style.transform = 'translateX(-50%)'; // 调整为居中显示
</script>