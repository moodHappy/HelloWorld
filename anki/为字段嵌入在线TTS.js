<div class="kanji">
  {{kanji:日文}}
</div>

<!-- 播放日文按钮 -->
<button class="btn" id="playKanjiButton" onclick="playTTS('kanji')">播放单词</button>

<!-- 播放课号按钮 -->
<button class="btn" id="playLessonButton" onclick="playTTS('lesson')">播放例句</button>

<script>
  function playTTS(type) {
    // 配置域名
    const domain = [
      'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    let textToRead = '';

    // 根据不同类型，获取不同的文本
    if (type === 'lesson') {
      let lessonNumberText = document.querySelector('.lesson-number').innerText.trim();
      if (!lessonNumberText) {
        alert('课号字段为空，无法生成音频');
        return;
      }
      textToRead = lessonNumberText.replace(/\s+/g, ''); // 去除空格
    } else if (type === 'kanji') {
      let kanjiText = document.querySelector('.kanji').innerText.trim();
      if (!kanjiText) {
        alert('日文字段为空，无法生成音频');
        return;
      }
      textToRead = kanjiText.replace(/\s+/g, ''); // 去除空格
    }

    // 保持原来的Eric语音
    const voice = 'en-US-EricNeural'; // 保持为Eric语音

    // 生成查询参数
    const queryString = new URLSearchParams({
      text: textToRead,
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

    // 为域名生成音频源
    const source = document.createElement('source');
    source.src = `${domain[0]}api/aiyue?${queryString}`; // 使用新的域名
    source.type = 'audio/mpeg';
    audio.append(source);

    // 将音频元素插入页面
    document.body.append(audio);

    // 播放音频
    audio.play();
  }

  // 设置播放按钮的位置
  const playLessonButton = document.getElementById('playLessonButton');
  const playKanjiButton = document.getElementById('playKanjiButton');

  // 交换两个按钮的位置
  playLessonButton.style.position = 'fixed';
  playLessonButton.style.bottom = '150px'; // 将playLessonButton距离底部150px
  playLessonButton.style.left = '50%'; // 水平居中
  playLessonButton.style.transform = 'translateX(-50%)'; // 调整为居中显示

  playKanjiButton.style.position = 'fixed';
  playKanjiButton.style.bottom = '200px'; // 将playKanjiButton距离底部200px
  playKanjiButton.style.left = '50%'; // 水平居中
  playKanjiButton.style.transform = 'translateX(-50%)'; // 调整为居中显示

  // 页面加载时自动播放日文
  window.onload = function() {
    playTTS('kanji');
  };
</script>