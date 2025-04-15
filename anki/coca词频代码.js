<div id="frequency-info">词频加载中...</div>
<div id="word-data" style="display: none;">{{单词}}</div>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const wordDiv = document.getElementById("word-data");
    if (!wordDiv) return;

    const word = wordDiv.textContent.trim().toLowerCase();

    // 只加载 COCA 词频 JSON 文件
    fetch("https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/anki/coca.json")
      .then(res => res.json())
      .then(cocaList => {
        const cocaRank = cocaList[word];

        const output = cocaRank
          ? `COCA 排名：${cocaRank}`
          : `COCA：未找到`;

        document.getElementById("frequency-info").innerHTML = output;
      })
      .catch(error => {
        console.error("词频加载失败：", error);
        document.getElementById("frequency-info").textContent = "词频加载失败";
      });
  });
</script>