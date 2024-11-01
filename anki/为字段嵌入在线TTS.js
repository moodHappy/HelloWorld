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
    let text = document.querySelector('.kanji').innerText.trim();

    // 如果字段为空，则返回
    if (!text) {
      alert('文本字段为空，无法生成音频');
      return;
    }

    // 解决空格问题，去除所有空格以保证连贯朗读
    text = text.replace(/\s+/g, '');

    // 选择一个语音
    const voice = 'en-US-EricNeural'; // 根据需要调整语音名称，日文语音

    // 生成查询参数
    const queryString = new URLSearchParams({
      text: text,
      voiceName: voice,
      speed: 0, // 正常语速
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
  playButton.style.bottom = '250px'; // 距离底部250px
  playButton.style.left = '50%'; // 水平居中
  playButton.style.transform = 'translateX(-50%)'; // 调整为居中显示
</script>