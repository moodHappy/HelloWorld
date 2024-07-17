# anki 调整playphrase位置版
## 背面
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap">

<style>
    body {
        font-family: 'PingFang SC', sans-serif;
        background-color: #f5f5f5; /* Kindle-like background color */
        color: #000000; /* Text color */
    }
    .card {
        color: #000000;
        background-color: #ffffff;
        border: 1px solid #000000;
        padding: 20px;
        text-align: center;
    }

    .word {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 20px;
    }

    .translation {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 10px;
        color: #000000;
    }

    .notes {
        font-family: 'PingFang SC', sans-serif;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
    }

    .notes span {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px !important;
        font-weight: bold;
    }

    .source-link {
        color: red;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'cursive', sans-serif;
        font-size: 28px;
        font-weight: bold;
        padding: 5px 0;
    }

    .source-news {
        font-family: 'PingFang SC', sans-serif;
        font-size: 16px;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
        margin-top: 20px;
        text-align: left;
    }

    .source-news a {
        text-decoration: none;
        color: black;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>

</div>

<div class="source-news"> 
<span style="font-family: 'PingFang SC', sans-serif; font-size: 18px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px;
    height: 24px;
  }

  .replay-button svg circle {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }

  .replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) {
            sourceNewsDiv.style.display = "none";
        }
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
```
# anki 统一字体版
## 正面：
```
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
    <style>
        .card {
            font-family: 'PingFang SC', sans-serif;
            color: #000000;
            background-color: #ffffff;
            border: 1px solid #000000;
            padding: 20px;
            text-align: center;
        }

        .word {
            font-size: 36px;
            font-weight: bold;
            position: relative;
            display: inline-block;
            cursor: pointer;
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
        }

        .replay-button {
            margin-top: 10px;
            cursor: pointer;
        }

        .replay-button svg {
            width: 24px;
            height: 24px;
        }

        .replay-button svg circle {
            fill: #000000;
            stroke: #000000;
            opacity: 0.3;
        }

        .replay-button svg path {
            stroke: #000000;
            fill: #000000;
            opacity: 0.3;
        }

        .typing-effect {
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

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
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if(uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:}}</div>
    </div>
</body>
</html>
```
## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap">

<style>
    body {
        font-family: 'PingFang SC', sans-serif;
        background-color: #f5f5f5; /* Kindle-like background color */
        color: #000000; /* Text color */
    }
    .card {
        color: #000000;
        background-color: #ffffff;
        border: 1px solid #000000;
        padding: 20px;
        text-align: center;
    }

    .word {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 20px;
    }

    .translation {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 10px;
        color: #000000;
    }

    .notes {
        font-family: 'PingFang SC', sans-serif;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
    }

    .notes span {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px !important;
        font-weight: bold;
    }

    .source-link {
        color: red;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'cursive', sans-serif;
        font-size: 28px;
        font-weight: bold;
        padding: 5px 0;
    }

    .source-news {
        font-family: 'PingFang SC', sans-serif;
        font-size: 16px;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
        margin-top: 20px;
        text-align: left;
    }

    .source-news a {
        text-decoration: none;
        color: black;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
<span style="font-family: 'PingFang SC', sans-serif; font-size: 18px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px;
    height: 24px;
  }

  .replay-button svg circle {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }

  .replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) {
            sourceNewsDiv.style.display = "none";
        }
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
```
# anki 最终版本
## 正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth Writing Animation</title>
    <style>
        .card {
            font-family: Arial, sans-serif;
            color: #000000;
            background-color: #ffffff;
            border: 1px solid #000000;
            padding: 20px;
            text-align: center;
        }

        .word {
            font-size: 36px;
            font-weight: bold;
            position: relative;
            display: inline-block;
            cursor: pointer;
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
        }

        .replay-button {
            margin-top: 10px;
            cursor: pointer;
        }

        .replay-button svg {
            width: 24px;
            height: 24px;
        }

        .replay-button svg circle {
            fill: #000000;
            stroke: #000000;
            opacity: 0.3;
        }

        .replay-button svg path {
            stroke: #000000;
            fill: #000000;
            opacity: 0.3;
        }

        .typing-effect {
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic" id="phonetic-text"></div>
    </div>

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
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence');
        document.getElementById('sentence').innerText = sentence;

        if(uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:}}</div>
    </div>
</body>
</html>
```
## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap">

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5; /* Kindle-like background color */
        color: #000000; /* Text color */
    }
    .card {
        color: #000000;
        background-color: #ffffff;
        border: 1px solid #000000;
        padding: 20px;
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-family: 'Roboto Condensed', cursive;
        font-size: 18px;
        margin-top: 20px;
    }

    .translation {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 10px;
        color: #000000;
    }

    .notes {
        font-family: 'Roboto Condensed', PingFang SC;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
    }

.notes span {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 18px !important;
    font-weight: bold;
}

    .source-link {
        color: red;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'Brush Script MT', cursive;
        font-size: 28px;
        font-weight: bold;
        padding: 5px 0;
    }

    .source-news {
        font-family: 'Roboto Condensed', PingFang SC;
        font-size: 16px;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
        margin-top: 20px;
        text-align: left;
    }

.source-news a {
    text-decoration: none;
    color: black;
}

</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
<span style="font-family: Georgia; font-size: 18px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px;
    height: 24px;
  }

  .replay-button svg circle {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }

  .replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) {
            sourceNewsDiv.style.display = "none";
        }
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
```

# anki 打字机效果：
## 正面：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smooth Writing Animation</title>
    <style>
        .card {
            font-family: Arial, sans-serif;
            color: #000000;
            background-color: #ffffff;
            border: 1px solid #000000;
            padding: 20px;
            text-align: center;
        }

        .word {
            font-size: 36px;
            font-weight: bold;
            position: relative;
            display: inline-block;
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
        }

        /* Replay Button Styling */
        .replay-button {
            margin-top: 10px;
            cursor: pointer;
        }

        .replay-button svg {
            width: 24px; /* Adjust size as needed */
            height: 24px; /* Adjust size as needed */
        }

        /* 设置重播按钮图标中圆形 */
        .replay-button svg circle {
            fill: #000000;
            stroke: #000000;
            opacity: 0.3; /* 设置半透明 */
        }

        /* 设置重播按钮图标三角形 */
        .replay-button svg path {
            stroke: #000000;
            fill: #000000;
            opacity: 0.3; /* 设置半透明 */
        }

        .typing-effect {
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="word typing-effect" id="animated-text"></div>
        <div class="phonetic">{{音标}}</div>
    </div>

    <script>
        const text = `{{单词}}`; // 动态获取 Anki 单词字段
        const container = document.getElementById("animated-text");

        let index = 0;

        function typeLetter() {
            if (index < text.length) {
                container.textContent += text[index];
                index++;
                setTimeout(typeLetter, 500); // Adjusted the delay to 500ms for a slower animation
            } else {
                container.style.borderRight = 'none'; // Remove cursor at the end
            }
        }

        typeLetter();
    </script>

    <script>
        var tTitle = document.getElementById("s6").innerHTML;
        var uURL = document.getElementById("s5").innerHTML;
        var sentence = localStorage.getItem('sentence'); // 从 localStorage 中获取句子
        document.getElementById('sentence').innerText = sentence; // 显示句子

        if(uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        } else {
            var para = document.createElement("p");
            para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
            var node = document.createTextNode("");
            para.appendChild(node);

            var element = document.getElementById("div1");
            var child = document.getElementById("answer");
            element.insertBefore(para, child);
        }
    </script>

    <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>
```
## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5; /* Kindle-like background color */
        color: #000000; /* Text color */
    }
    .card {
        color: #000000;
        background-color: #ffffff;
        border: 1px solid #000000;
        padding: 20px;
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #000000;
    }

    .notes {
        font-family: 'Patrick Hand', cursive;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
    }

    .source-link {
        color: #000000;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'Brush Script MT', cursive;
        font-size: 28px;
        font-weight: bold;
        padding: 5px 0;
    }

    .source-news {
        font-family: 'Patrick Hand', cursive;
        font-size: 16px;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
        margin-top: 20px;
        text-align: left;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
    <span style="font-family: Patrick Hand; font-size: 16px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px;
    height: 24px;
  }

  .replay-button svg circle {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }

  .replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) {
            sourceNewsDiv.style.display = "none";
        }
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
```

## anki 墨水屏：
## 正面：
```
<style>
.card {
    font-family: Arial, sans-serif;
    color: #000000;
    background-color: #ffffff;
    border: 1px solid #000000;
    padding: 20px;
    text-align: center;
}

.word {
    font-size: 36px;
    font-weight: bold;
}

.word a {
    color: inherit; /* 保持父元素颜色 */
    text-decoration: none; /* 去掉下划线 */
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
}

/* Replay Button Styling */
.replay-button {
    margin-top: 10px;
    cursor: pointer;
}

.replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
}
/* 设置重播按钮图标中圆形 */
.replay-button svg circle {
    fill: #000000;
    stroke: #000000;
    opacity: 0.3; /* 设置半透明 */
}

/* 设置重播按钮图标三角形 */
.replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3; /* 设置半透明 */
}
</style>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
</div>

<script>
var tTitle = document.getElementById("s6").innerHTML;
var uURL = document.getElementById("s5").innerHTML;
var sentence = localStorage.getItem('sentence'); // 从 localStorage 中获取句子
document.getElementById('sentence').innerText = sentence; // 显示句子

if(uURL != "") {
    var para = document.createElement("p");
    para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
} else {
    var para = document.createElement("p");
    para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
}
</script>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
</div>
```

## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5; /* Kindle-like background color */
        color: #000000; /* Text color */
    }
    .card {
        color: #000000;
        background-color: #ffffff;
        border: 1px solid #000000;
        padding: 20px;
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #000000;
    }

    .notes {
        font-family: 'Patrick Hand', cursive;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
    }

    .source-link {
        color: #000000;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'Brush Script MT', cursive;
        font-size: 28px;
        font-weight: bold;
        padding: 5px 0;
    }

    .source-news {
        font-family: 'Patrick Hand', cursive;
        font-size: 16px;
        color: #000000;
        background-color: #ffffff;
        padding: 15px;
        border: 1px solid #000000;
        margin-top: 20px;
        text-align: left;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
    <span style="font-family: Patrick Hand; font-size: 16px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px;
    height: 24px;
  }

  .replay-button svg circle {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }

  .replay-button svg path {
    stroke: #000000;
    fill: #000000;
    opacity: 0.3;
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) {
            sourceNewsDiv.style.display = "none";
        }
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
```

# anki 更新字体：
## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">
<style>
    body {
        font-family: Arial, sans-serif;
    }
    .card {
        color: #ffffff;
        background-color: #64b5f6;
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #ffeb3b;
    }

    .notes {
        font-family: 'Patrick Hand', cursive;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        opacity: 0.9;
        color: #000000;
        background-color: #FFD700;
        padding: 15px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .source-link {
        color: red;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'Brush Script MT', cursive;
        font-size: 28px;
        font-weight: bold;
        padding: 5px 0;
    }

    .source-news {
        font-family: 'Patrick Hand', cursive;
        font-size: 16px;
        color: #333333;
        background-color: #FFD700;
        padding: 15px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin-top: 20px;
        text-align: left;
        opacity: 0.9;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
    <span style="font-family: Patrick Hand; font-size: 16px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px;
    height: 24px;
  }

  .replay-button svg circle {
    stroke: #64b5f6;
    fill: #64b5f6;
    opacity: 0.3;
  }

  .replay-button svg path {
    stroke: yellow;
    fill: yellow;
    opacity: 0.3;
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) {
            sourceNewsDiv.style.display = "none";
        }
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
```
# anki 代码优化：
## 正面：
```
<style>
.card {
    font-family: Arial, sans-serif;
    color: #ffffff;
    background-color: #ff8a65; /* 柔和的橙色 */
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.word {
    font-size: 36px;
    font-weight: bold;
}

.word a {
    color: inherit; /* 保持父元素颜色 */
    text-decoration: none; /* 去掉下划线 */
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
}

/* Replay Button Styling */
.replay-button {
    margin-top: 10px;
    cursor: pointer;
}

.replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
}
/* 设置重播按钮图标中圆形 */
.replay-button svg circle {
    fill: #ff8a65;
    stroke: #ff8a65;
    opacity: 0.3; /* 设置半透明 */
}

/* 设置重播按钮图标三角形 */
.replay-button svg path {
    stroke: yellow;
    fill: yellow;
    opacity: 0.3; /* 设置半透明 */
}
</style>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
</div>

<script>
var tTitle = document.getElementById("s6").innerHTML;
var uURL = document.getElementById("s5").innerHTML;
var sentence = localStorage.getItem('sentence'); // 从 localStorage 中获取句子
document.getElementById('sentence').innerText = sentence; // 显示句子

if(uURL != "") {
    var para = document.createElement("p");
    para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
} else {
    var para = document.createElement("p");
    para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
}
</script>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
</div>
```

## 背面
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<style>
    .card {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #64b5f6;
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #ffeb3b;
    }

    .notes {
        font-size: 12px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        opacity: 0.9;
        color: #333333;
        background-color: #FFD700;
        padding: 15px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .source-link {
        color: red;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'Brush Script MT', cursive;
        font-size: 28px;
        font-weight: bold;
        padding: 5px 0;
    }

    .source-news {
        font-size: 12px;
        color: #333333;
        background-color: #FFD700;
        padding: 15px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin-top: 20px;
        text-align: left;
        opacity: 0.9;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px;
    height: 24px;
  }

  .replay-button svg circle {
    stroke: #64b5f6;
    fill: #64b5f6;
    opacity: 0.3;
  }

  .replay-button svg path {
    stroke: yellow;
    fill: yellow;
    opacity: 0.3;
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) {
            sourceNewsDiv.style.display = "none";
        }
    });
</script>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>

</body>
</html>
```

## anki 创建工具栏项
```
换行：
文本前：<br>
文本后：


颜色：
文本前：<span style="color: red;">
文本后：</span>

链接：
文本前：<a href="
文本后：">来源</a>

分割线：
文本前：<hr>
文本后：

居中：
文本前：<center>
文本后：</center>

YouTube 内嵌视频
文本前：?start=
文本后：

例句：
文本前：<span>Example
文本后：</span>

区分：
文本前：<span>Discriminate
文本后：</span>

解析：
文本前：<span>Parse
文本后：</span>

助记：
文本前：<span>Mnemonic
文本后：</span>


文本前：
文本后：


文本前：
文本后：


文本前：
文本后：


文本前：
文本后：


文本前：
文本后：
```

# update 修复YouTube 不显示
## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<style>
    /* Existing styles for card */
    .card {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #64b5f6; /* 柔和的蓝色 */
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit; /* 保持父元素颜色 */
        text-decoration: none; /* 去掉下划线 */
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #ffeb3b;
    }

    /* Styling for notes */
    .notes {
        font-size: 12px; /* Further reduced to smaller size */
        margin-top: 10px; /* Keep consistent with card spacing */
        line-height: 1.6; /* Slightly increased line height for easier reading */
        text-align: left; /* Left align the content */
        opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
        color: #333333; /* Darker text color for better contrast */
        background-color: #FFD700; /* Dark yellow background color */
        padding: 15px; /* Add padding for better spacing */
        border-radius: 15px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
    }

    .source-link {
        color: red; /* Red text color */
        text-decoration: none; /* Remove underline */
        display: block; /* Makes the link take up the full width */
        text-align: right; /* Aligns text to the left */
        font-family: 'Brush Script MT', cursive; /* Changes font to a cursive style */
        font-size: 28px; /* Sets font size */
        font-weight: bold; /* Makes the font bold */
        padding: 5px 0; /* Adds vertical padding */
    }

    /* Styling for Source-news */
    .source-news {
        font-size: 12px; /* Set font size to match notes */
        color: #333333; /* Set text color */
        background-color: #FFD700; /* Match background color with notes */
        padding: 15px; /* Add padding */
        border-radius: 15px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
        margin-top: 20px; /* Add top margin for spacing */
        text-align: left; /* Align text to the left */
        opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
        
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>

<div class="notes">
    {{笔记}}<br>
    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<!-- Card Styling -->
<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
  }

  /* 设置重播按钮图标中圆形 */
  .replay-button svg circle {
    stroke: #64b5f6;
    fill: #64b5f6;
    opacity: 0.3; /* 设置半透明 */
  }

  /* 设置重播按钮图标三角形 */
  .replay-button svg path {
    stroke: yellow;
    fill: yellow;
    opacity: 0.3; /* 设置半透明 */
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) { // Check if Source-news is empty or only whitespace
            sourceNewsDiv.style.display = "none"; // Hide the .source-news div
        }
    });
</script>

</body>
</html>


<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>

<style>
    .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>
```

# update 添加source-news，正面不变

## 背面：
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<style>
    /* Existing styles for card */
    .card {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #64b5f6; /* 柔和的蓝色 */
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit; /* 保持父元素颜色 */
        text-decoration: none; /* 去掉下划线 */
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #ffeb3b;
    }

    /* Styling for notes */
    .notes {
        font-size: 12px; /* Further reduced to smaller size */
        margin-top: 10px; /* Keep consistent with card spacing */
        line-height: 1.6; /* Slightly increased line height for easier reading */
        text-align: left; /* Left align the content */
        opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
        color: #333333; /* Darker text color for better contrast */
        background-color: #FFD700; /* Dark yellow background color */
        padding: 15px; /* Add padding for better spacing */
        border-radius: 15px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
    }

    .video-container {
        display: none; /* Initially hide the video container */
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
        margin-top: 20px; /* Adjust margin as needed */
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .source-link {
        color: red; /* Red text color */
        text-decoration: none; /* Remove underline */
        display: block; /* Makes the link take up the full width */
        text-align: right; /* Aligns text to the left */
        font-family: 'Brush Script MT', cursive; /* Changes font to a cursive style */
        font-size: 28px; /* Sets font size */
        font-weight: bold; /* Makes the font bold */
        padding: 5px 0; /* Adds vertical padding */
    }


    /* Styling for Source-news */
    .source-news {
        font-size: 12px; /* Set font size to match notes */
        color: #333333; /* Set text color */
        background-color: #FFD700; /* Match background color with notes */
        padding: 15px; /* Add padding */
        border-radius: 15px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
        margin-top: 20px; /* Add top margin for spacing */
        text-align: left; /* Align text to the left */
        opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
        
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="source-news"> 
    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>


<div class="video-container">
    <iframe id="sourceVideoFrame" frameborder="0" allowfullscreen></iframe>
</div>

<div class="notes">
    {{笔记}}<br>

    <a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:Source-news}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<!-- Card Styling -->
<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
  }

  /* 设置重播按钮图标中圆形 */
  .replay-button svg circle {
    stroke: #64b5f6;
    fill: #64b5f6;
    opacity: 0.3; /* 设置半透明 */
  }

  /* 设置重播按钮图标三角形 */
  .replay-button svg path {
    stroke: yellow;
    fill: yellow;
    opacity: 0.3; /* 设置半透明 */
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var sourceVideo = "{{Source-Video}}";
        var videoContainer = document.querySelector(".video-container");
        var sourceVideoFrame = document.getElementById("sourceVideoFrame");

        if (sourceVideo && sourceVideo.trim() !== "") { // Check if Source-Video is provided
            sourceVideoFrame.src = "https://www.youtube.com/embed/" + sourceVideo;
            videoContainer.style.display = "block"; // Show the video container
        } else {
            videoContainer.style.display = "none"; // Hide the video container if Source-Video is not provided
        }

        var sourceNews = "{{Source-news}}";
        var sourceNewsDiv = document.querySelector(".source-news");

        if (!sourceNews.trim()) { // Check if Source-news is empty or only whitespace
            sourceNewsDiv.style.display = "none"; // Hide the .source-news div
        }
    });
</script>

</body>
</html>
```

# update 添加嵌入YouTube视频功能
## 正面：
```
<style>
.card {
    font-family: Arial, sans-serif;
    color: #ffffff;
    background-color: #ff8a65; /* 柔和的橙色 */
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.word {
    font-size: 36px;
    font-weight: bold;
}

.word a {
    color: inherit; /* 保持父元素颜色 */
    text-decoration: none; /* 去掉下划线 */
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
}

/* Replay Button Styling */
.replay-button {
    margin-top: 10px;
    cursor: pointer;
}

.replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
}
/* 设置重播按钮图标中圆形 */
.replay-button svg circle {
    fill: #ff8a65;
    stroke: #ff8a65;
    opacity: 0.3; /* 设置半透明 */
}

/* 设置重播按钮图标三角形 */
.replay-button svg path {
    stroke: yellow;
    fill: yellow;
    opacity: 0.3; /* 设置半透明 */
}
</style>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
</div>

<script>
var tTitle = document.getElementById("s6").innerHTML;
var uURL = document.getElementById("s5").innerHTML;
var sentence = localStorage.getItem('sentence'); // 从 localStorage 中获取句子
document.getElementById('sentence').innerText = sentence; // 显示句子

if(uURL != "") {
    var para = document.createElement("p");
    para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
} else {
    var para = document.createElement("p");
    para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
}
</script>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
</div>


```
## 背面：
```
<style>
    /* Existing styles for card */
    .card {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #64b5f6; /* 柔和的蓝色 */
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit; /* 保持父元素颜色 */
        text-decoration: none; /* 去掉下划线 */
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #ffeb3b;
    }

    /* Styling for notes */
    .notes {
        font-size: 12px; /* Further reduced to smaller size */
        margin-top: 10px; /* Keep consistent with card spacing */
        line-height: 1.6; /* Slightly increased line height for easier reading */
        text-align: left; /* Left align the content */
        opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
        color: #333333; /* Darker text color for better contrast */
        background-color: #FFD700; /* Dark yellow background color */
        padding: 15px; /* Add padding for better spacing */
        border-radius: 15px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
    }

    .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        max-width: 100%;
        background: #000;
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div id="video-container" class="video-container">
    <iframe src="https://www.youtube.com/embed/{{Source-Video}}" frameborder="0" allowfullscreen></iframe>
</div>





<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en">来源</a>




<div class="notes">
    {{笔记}}
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:笔记}}</div>
</div>

<!-- Card Styling -->
<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
  }

  /* 设置重播按钮图标中圆形 */
  .replay-button svg circle {
    stroke: #64b5f6;
    fill: #64b5f6;
    opacity: 0.3; /* 设置半透明 */
  }

  /* 设置重播按钮图标三角形 */
  .replay-button svg path {
    stroke: yellow;
    fill: yellow;
    opacity: 0.3; /* 设置半透明 */
  }
</style>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var videoContainer = document.getElementById("video-container");
        var sourceURL = "{{Source-Video}}";
        
        if (!sourceURL) {
            videoContainer.style.display = "none";
        }
    });
</script>
```

# YouTube 嵌入式链接转换

```
请注意，这里将链接格式从https://m.youtube.com/watch?v=1mU-1mRECjw&feature=youtu.be更改为https://www.youtube.com/embed/1mU-1mRECjw。这样才能确保iframe可以正确显示视频。
```

# anki创建快捷选项
## 嵌入视频

```
?start=
```

# 炫彩版
## 正面
```
同炫彩版-Markdown 正面
```
## 背面
```
<style>
    /* Existing styles for card */
    .card {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #64b5f6; /* 柔和的蓝色 */
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit; /* 保持父元素颜色 */
        text-decoration: none; /* 去掉下划线 */
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #ffeb3b;
    }

    /* Styling for notes */
    .notes {
        font-size: 12px; /* Further reduced to smaller size */
        margin-top: 10px; /* Keep consistent with card spacing */
        line-height: 1.6; /* Slightly increased line height for easier reading */
        text-align: left; /* Left align the content */
        opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
        color: #333333; /* Darker text color for better contrast */
        background-color: #FFD700; /* Dark yellow background color */
        padding: 15px; /* Add padding for better spacing */
        border-radius: 15px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="notes">
    {{笔记}}
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
</div>

<!-- Card Styling -->
<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
  }


/* 设置重播按钮图标中圆形*/
.replay-button svg circle {
    stroke: #64b5f6;
    fill: #64b5f6;
}

/* 设置重播按钮图标三角形*/
.replay-button svg path {
    stroke: yellow;
    fill: yellow;
}
  }
</style>
```

# 炫彩版-Markdown

## 正面
```
<style>
.card {
    font-family: Arial, sans-serif;
    color: #ffffff;
    background-color: #ff8a65; /* 柔和的橙色 */
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.word {
    font-size: 36px;
    font-weight: bold;
}

.word a {
    color: inherit; /* 保持父元素颜色 */
    text-decoration: none; /* 去掉下划线 */
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
}

/* Replay Button Styling */
.replay-button {
    margin-top: 10px;
    cursor: pointer;
}

.replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
}
/* 设置重播按钮图标中圆形 */
.replay-button svg circle {
    fill: #ff8a65;
    stroke: #ff8a65;
}

/* 设置重播按钮图标三角形 */
.replay-button svg path {
    stroke: yellow;
    fill: yellow;
}
</style>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
</div>

<script>
var tTitle = document.getElementById("s6").innerHTML;
var uURL = document.getElementById("s5").innerHTML;
var sentence = localStorage.getItem('sentence'); // 从 localStorage 中获取句子
document.getElementById('sentence').innerText = sentence; // 显示句子

if(uURL != "") {
    var para = document.createElement("p");
    para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
} else {
    var para = document.createElement("p");
    para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
}
</script>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
</div>
```
## 背面
```
改动说明笔记部分的间距：增加了 .notes 的 margin-top 为 20px，确保笔记和上方内容之间有足够的间距。Markdown 渲染后的间距：在 .markdown-body 中增加了 margin-top: 20px;，确保 Markdown 内容和上方元素之间有适当的间距。
```
```
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Existing styles for card */
        .card {
            font-family: Arial, sans-serif;
            color: #ffffff;
            background-color: #64b5f6; /* 柔和的蓝色 */
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }

        .word {
            font-size: 36px;
            font-weight: bold;
        }

        .word a {
            color: inherit; /* 保持父元素颜色 */
            text-decoration: none; /* 去掉下划线 */
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
        }

        .definition {
            font-size: 20px;
            margin-top: 15px;
        }

        .example {
            font-size: 18px;
            margin-top: 20px;
            font-style: italic;
        }

        .translation {
            font-size: 18px;
            margin-top: 10px;
            color: #ffeb3b;
        }

        /* Styling for notes */
        .notes {
            font-size: 12px; /* Further reduced to smaller size */
            margin-top: 20px; /* Increased margin to create more space */
            line-height: 1.6; /* Slightly increased line height for easier reading */
            text-align: left; /* Left align the content */
            opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
            color: #333333; /* Darker text color for better contrast */
            background-color: #FFD700; /* Dark yellow background color */
            padding: 15px; /* Add padding for better spacing */
            border-radius: 15px; /* Rounded corners */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
        }

        /* Styles for Markdown rendering */
        .markdown-body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            background-color: #FFD700; /* Dark yellow background color */
            padding: 15px; /* Match the padding of .notes */
            border-radius: 15px; /* Match the border radius of .notes */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Match the shadow of .notes */
            margin-top: 20px; /* Create space above the markdown content */
        }
    </style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="notes md-content">
    {{笔记}}
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
</div>

<!-- Card Styling -->
<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
  }

  /* 设置重播按钮图标中圆形 */
  .replay-button svg circle {
      stroke: #64b5f6;
      fill: #64b5f6;
  }

  /* 设置重播按钮图标三角形 */
  .replay-button svg path {
      stroke: yellow;
      fill: yellow;
  }
</style>

<!-- Scripts for Markdown support and syntax highlighting -->
<script>
  'use strict'

  function consoleLog(str) {
    var div = document.createElement('div')
    div.innerHTML = str
    document.body.appendChild(div)
  }

  var MARKDOWN_IT_CDN = 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/markdown-it/12.3.2/markdown-it.min.js'
  var HIGHLIGHT_JS_CDN = 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/highlight.min.js'
  var HIGHLIGHT_CSS_CDN = 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/base16/onedark.min.css'
  var GITHUB_MARKDOWN_CSS_CDN = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/github-markdown-css/5.1.0/github-markdown.min.css'

  var createScript = (src) => {
    var scriptElement = document.createElement('script')
    scriptElement.src = src
    scriptElement.async = true
    scriptElement.type = 'text/javascript'
    document.head.appendChild(scriptElement)
    return new Promise((resolve) => {
      scriptElement.onload = function () {
        resolve(src)
      }
    })
  }

  var createLink = (url) => {
    var linkElement = document.createElement('link')
    linkElement.rel = 'stylesheet'
    linkElement.href = url
    linkElement.onload = () => {}
    document.head.appendChild(linkElement)
  }
  createLink(GITHUB_MARKDOWN_CSS_CDN)
  createLink(HIGHLIGHT_CSS_CDN)

  var clearBR = (str) => {
    str = str.replace(/<br>/g, '\r\n')
    return str
  }

  var clearBlankNbsp = (str) => {
    str = str.replace(/&nbsp;/g, ' ')
    return str
  }

  var unescapeHTMLEntities = (innerHTML) =>
    Object.assign(document.createElement('textarea'), { innerHTML }).value

  var parseMarkDownFn = () => {
    const md = markdownit({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value
          } catch (__) {}
        }
        return ''
      },
    })
    document.querySelectorAll('.md-content').forEach((div, index) => {
      console.log('查找到的容器元素', div)
      var text = unescapeHTMLEntities(div.innerHTML).trim()
      console.log('text', text)
      text = clearBR(text)
      var html = md.render(text)
      var newDiv = document.createElement('div')
      var hr = document.createElement('hr')
      newDiv.innerHTML = html
      newDiv.className = 'markdown-body'
      div.parentNode.insertBefore(newDiv, div.nextSibling)
      index === 1 ? div.parentNode.insertBefore(hr, div.nextSibling) : null
      div.className = `x-${index}`
      div.style.display = 'none'
    })
  }

  createScript(HIGHLIGHT_JS_CDN)
    .then(() => {
      return createScript(MARKDOWN_IT_CDN)
    })
    .then(() => {
      parseMarkDownFn()
    })
    .then(() => {
      var repeatEl = document.querySelectorAll('.x-0')
      repeatEl.forEach((el, i) => {
        if (i === repeatEl.length - 1) {
          return
        }
        document.body.removeChild(el)
      })
    })
</script>
</body>
</html>
```

# anki搭配tts
```
系统自带，把zh_CN变成en_US
```
## 正面：
```
<style>
.card {
    font-family: Arial, sans-serif;
    color: #ffffff;
    background-color: #ff8a65; /* 柔和的橙色 */
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.word {
    font-size: 36px;
    font-weight: bold;
}

.word a {
    color: inherit; /* 保持父元素颜色 */
    text-decoration: none; /* 去掉下划线 */
}

.phonetic {
    font-size: 24px;
    margin-top: 10px;
}

/* Replay Button Styling */
.replay-button {
    margin-top: 10px;
    cursor: pointer;
}

.replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
}
/* 设置重播按钮图标中圆形 */
.replay-button svg circle {
    fill: #ff8a65;
    stroke: #ff8a65;
}

/* 设置重播按钮图标三角形 */
.replay-button svg path {
    stroke: yellow;
    fill: yellow;
}
</style>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
</div>

<script>
var tTitle = document.getElementById("s6").innerHTML;
var uURL = document.getElementById("s5").innerHTML;
var sentence = localStorage.getItem('sentence'); // 从 localStorage 中获取句子
document.getElementById('sentence').innerText = sentence; // 显示句子

if(uURL != "") {
    var para = document.createElement("p");
    para.innerHTML = '<a href="'+uURL+'">'+tTitle+'</a>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
} else {
    var para = document.createElement("p");
    para.innerHTML = '<p><font color="grey" size="3">'+tTitle+'</font></p>';
    var node = document.createTextNode("");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var child = document.getElementById("answer");
    element.insertBefore(para, child);
}
</script>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
</div>
```
## 背面：
```
<style>
    /* Existing styles for card */
    .card {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #64b5f6; /* 柔和的蓝色 */
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .word {
        font-size: 36px;
        font-weight: bold;
    }

    .word a {
        color: inherit; /* 保持父元素颜色 */
        text-decoration: none; /* 去掉下划线 */
    }

    .phonetic {
        font-size: 24px;
        margin-top: 10px;
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
    }

    .example {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
    }

    .translation {
        font-size: 18px;
        margin-top: 10px;
        color: #ffeb3b;
    }

    /* Styling for notes */
    .notes {
        font-size: 12px; /* Further reduced to smaller size */
        margin-top: 10px; /* Keep consistent with card spacing */
        line-height: 1.6; /* Slightly increased line height for easier reading */
        text-align: left; /* Left align the content */
        opacity: 0.9; /* Slightly reduce opacity for lighter appearance */
        color: #333333; /* Darker text color for better contrast */
        background-color: #FFD700; /* Dark yellow background color */
        padding: 15px; /* Add padding for better spacing */
        border-radius: 15px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
    }
</style>
</head>
<body>

<div class="card">
    <div class="word"><a href="eudic://dict/{{单词}}">{{单词}}</a></div>
    <div class="phonetic">{{音标}}</div>
    <div class="definition">{{释义}}</div>
    <div class="example">{{例句}}</div>
    <div class="translation">{{例句翻译}}</div>
</div>

<div class="notes">
    {{笔记}}
</div>

<div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); text-align: center; width: 100%;">
  <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
  <div>{{tts zh_CN voices=Apple_Ava:例句}}</div>
</div>

<!-- Card Styling -->
<style>
  .replay-button {
    margin-top: 10px;
    cursor: pointer;
  }

  .replay-button svg {
    width: 24px; /* Adjust size as needed */
    height: 24px; /* Adjust size as needed */
  }


/* 设置重播按钮图标中圆形*/
.replay-button svg circle {
    stroke: #64b5f6;
    fill: #64b5f6;
}

/* 设置重播按钮图标三角形*/
.replay-button svg path {
    stroke: yellow;
    fill: yellow;
}
  }
</style>
```
## css样式：
```
无
```
# anki不搭配tts
```
将以上代码中：zh_CN换成en_US
```

---


# relingo新拟物样式表，最完美版本蓝色系

## 正面：
```
<div class="card front">
  <div class="word"><a href="eudic://dict/{{word}}" class="link">{{word}}</a></div>
  <div class="phonetic">{{phonetic}}</div>
</div>


<div id="mastered">{{mastered}}</div>

<style>
  #mastered {
    position: absolute;
    bottom: 0;
    bottom: 150px;
    right: 184px;
  }
</style>

<style>
.card {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #e0f7fa; /* 浅蓝色背景 */
  padding: 10px;
  border-radius: 10px;
  box-shadow: 8px 8px 16px #b0bec5, -8px -8px 16px #ffffff; /* 浅灰色阴影 */
}

.front .word {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #0277bd; /* 深蓝色字体 */
}

.front .link {
  color: inherit; /* 继承父元素颜色 */
  text-decoration: none; /* 移除下划线 */
}

.front .phonetic {
  font-size: 16px;
  color: #4fc3f7; /* 浅蓝色字体 */
}
</style>
```

## 背面：
```
{{FrontSide}}
<div class="card back">
  <div class="translation">{{translation}}</div>
  <div class="sentences" id="sentences">{{sentences}}</div>
  <div class="image-container">
    {{image}}
  </div>
</div>

<style>
.card {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #e0f7fa;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 8px 8px 16px #b0bec5, -8px -8px 16px #ffffff;
}

.back .translation {
  margin-top: 20px;
  font-size: 18px;
  color: #01579b;
}

.back .sentences {
  margin-top: 20px;
  font-size: 16px;
  color: #0277bd;
  text-align: left;
}

.back .sentences p {
  margin: 5px 0;
}

.back .image-container {
  margin-top: 20px;
}

.back .image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 4px 4px 8px #b0bec5, -4px -4px 8px #ffffff;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var sentencesDiv = document.getElementById('sentences');
  var sentences = sentencesDiv.innerHTML.split(';');
  sentencesDiv.innerHTML = sentences.map(function(sentence) {
    return '<p>' + sentence.trim() + '</p>';
  }).join('');
});
</script>
```

## CSS样式：
```
.card {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #e0f7fa;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 8px 8px 16px #b0bec5, -8px -8px 16px #ffffff;
}

.front .word {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #0277bd;
}

.front .phonetic {
  font-size: 16px;
  color: #4fc3f7;
}

.back {
  margin-top: 20px;
}

.back .translation {
  margin-top: 20px;
  font-size: 18px;
  color: #01579b;
}

.back .sentences {
  margin-top: 20px;
  font-size: 16px;
  color: #0277bd;
  text-align: left;
}

.back .image-container {
  margin-top: 20px;
}

.back .image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 4px 4px 8px #b0bec5, -4px -4px 8px #ffffff;
}
```




# relingo新拟物样式表，最完美版本白色系
## 正面：
```
<div class="card front">
  <div class="word"><a href="eudic://dict/{{word}}" class="link">{{word}}</a></div>
  <div class="phonetic">{{phonetic}}</div>
</div>

<style>
.card {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #f0f0f3;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff;
}

.front .word {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.front .link {
  color: inherit; /* Inherit the color from the parent element */
  text-decoration: none; /* Remove underline */
}

.front .phonetic {
  font-size: 14px;
  color: #888;
}
</style>
```

## 背面：
```
{{FrontSide}}
<div class="card back">
  <div class="translation">{{translation}}</div>
  <div class="sentences" id="sentences">{{sentences}}</div>
  <div class="image-container">
    {{image}}
  </div>
</div>

<div class="centered">
    {{mastered}}
</div>

<style>
.centered {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    height: 100%; /* 占满父元素高度 */
}

.card {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #f0f0f3;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff;
}

.back .translation {
  margin-top: 20px;
  font-size: 18px;
  color: #0a74da;
}

.back .sentences {
  margin-top: 20px;
  font-size: 14px;
  color: #555;
  text-align: left;
}

.back .sentences p {
  margin: 5px 0; /* Reduce the margin to decrease line spacing */
}

.back .image-container {
  margin-top: 20px;
}

.back .image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 4px 4px 8px #d1d1d4, -4px -4px 8px #ffffff;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var sentencesDiv = document.getElementById('sentences');
  var sentences = sentencesDiv.innerHTML.split(';');
  sentencesDiv.innerHTML = sentences.map(function(sentence) {
    return '<p>' + sentence.trim() + '</p>';
  }).join('');
});
</script>
```

## CSS样式：
```
.card {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #f0f0f3;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff;
}

.front .word {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.front .phonetic {
  font-size: 14px;
  color: #888;
}

.back {
  margin-top: 20px; /* Add margin at the top to separate from FrontSide */
}

.back .translation {
  margin-top: 20px;
  font-size: 18px;
  color: #0a74da;
}

.back .sentences {
  margin-top: 20px;
  font-size: 14px;
  color: #555;
  text-align: left;
}

.back .image-container {
  margin-top: 20px;
}

.back .image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 4px 4px 8px #d1d1d4, -4px -4px 8px #ffffff;
}
```




# z-4k-样式：
## 正面：
```
<div class="header">
  {{Front}}
</div>
<div class="pronunciation">
  {{音标}}
</div>
<div class="footer">
  <div class="sound-btn">
    {{Sound}}
  </div>
</div>
```

## 背面：
```
{{FrontSide}}
{{中文}}
<hr>
{{Image}}
<hr>
<div class="content">
  <div class="meaning">
    → Meaning:{{Meaning}}
  </div>
  <div class="example">
    → Example:{{Example}}
  </div>
</div>
<hr>
{{Sound_Meaning}}
[sound:_1sec.mp3]
{{Sound_Example}}
```
## CSS样式：
```
.card {
  font-family: "Georgia", serif;
  font-size: 16px;
  text-align: center;
  color: #333333; /* 深灰色 */
  background-color: #fafafa; /* 非常浅的灰色 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
  padding: 0; /* 将 padding 设为零 */
  margin: 0; /* 将 margin 设为零 */
  line-height: 1.6; /* 增加行间距 */
}
img {
  max-width: 100%;
  height: 240px;
  width: 400px;
  border-radius: 0; /* 移除圆角 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
  margin: 0; /* 将 margin 设为零 */
}

body {
  margin: 0;
  background-color: #f9f9f9; /* 非常浅的灰色背景 */
}
.header {
  font-family: 'EB Garamond', serif;
  font-size: 35px;
  font-weight: bold;
  color: #6b8e23; /* 橄榄绿 */
  text-align: center;
  border-bottom: 3px solid #6b8e23; /* 橄榄绿底边 */
  margin: 0;
  padding: 0;
}


.pronunciation {
  font-family: "Georgia", serif;
  font-size: 16px;
  color: #333333; /* 深灰色 */
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.6; /* 增加行间距 */
}

.footer {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
  background-color: #f9f9f9; /* 背景颜色与主体一致 */
  padding: 5px;
  left: calc(50% - 100px); /* 向左偏移 100 像素 */
  transform: translateX(-26%); /* 确保元素居中 */
}

.sound-btn {
  background-color: #6b8e23; /* 橄榄绿按钮 */
  color: white;
  border-radius: 0; /* 移除圆角 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
}

.content {
  text-align: left;
  font-family: "Georgia", serif;
  font-size: 16px;
  color: #333333; /* 深灰色 */
  line-height: 1.6; /* 增加行间距 */
}
```

# z-7k-麦克米伦样式：
## 正面：
```
<div class="custom-div">{{单词}}</div>
```
## 背面：
```
<div class="card">
  {{图片}}
  <br>
  {{例句}}
  <br>
  {{例句翻译}}
  <br>
  <br>
  {{基本释义}}
  <br>
  <br>
  <div class="centered">
    {{音标}}
  </div>
</div>
{{FrontSide}}
```

## CSS样式：
```
.custom-div {
  font-family: "Times New Roman", serif;
  font-size: 24px;
  position: fixed;
  bottom: 150px;
  left: 0;
  width: 100%;
  text-align: center;
  background-color: #f5f5dc; /* 浅米色 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  box-sizing: border-box;
  border: 2px solid #d2b48c; /* 黄褐色边框 */
}

.card {
  font-family: "Georgia", serif;
  font-size: 18px;
  text-align: left;
  background-color: #fffaf0; /* 花色白 */
  padding: 20px;
  border: 1px solid #d2b48c; /* 黄褐色边框 */
  border-radius: 0; /* 移除圆角 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.card img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  border: 1px solid #d2b48c; /* 为图片添加边框 */
}

.card p {
  margin-bottom: 10px;
  line-height: 1.6; /* 增加行间距 */
}

.centered {
  text-align: center;
}
```

# 百词斩样式：
## 正面：
```
<div class="card" style="position: relative; min-height: 100vh;">
    <!-- 这里放你的卡片内容 -->
    <div style="position: absolute; bottom: 280px; width: 100%; text-align: center;">🙈🤔🫣
        {{hint:.}}{{单词发音}}
    </div>
</div>
```
## 背面：
```
<div style="text-align:center;">{{单词配图}}

<div style="font-size: 40px;text-align:center; color: green">{{.}}
<div style="font-size: 20px;text-align:center; color: OrangeRed">{{edit:音标}}
<hr id=answer>
<div style="font-size: 16px;text-align:left; color:Olive ">{{例句}}<br>{{例句翻译}}

<hr id=answer>

<div style="font-size: 16px;text-align:left; color: Olive">{{英文释义}}
<hr id=answer>

<div style="font-size: 16px;text-align:left; color: red">{{edit:中文释义}}

<hr id=answer>

<div style="font-size: 16px; text-align: left; color: black; margin-top: 150px;">
    <a href="eudic://dict/{{.}}" style="font-size: 20px; text-decoration: none;">📖</a>
    {{例句发音}}
    {{单词发音}}
```
## CSS样式：
```
.card {
 font-family: arial;
 font-size: 24px;
 color: black;
 background-color: rgb(199,237,204);
}
#danci, #yinbiao
{
text-align:center;
font-family:serif;
font-size:30px;
}

.back {
 text-align: left;
line-height:80%;
}

.back img {
	width:720px;
}

.example
{
	font-size:20px;
	text-align:left;
       line-height:95%;
}
```

# 自建新闻生词卡片

## 正面：
```
<div class="card front">
  <a href="eudic://dict/{{单词}}" class="word">{{单词}}</a>
  <br>
  <div class="definition">{{释义}}</div>
</div>

<div style="text-align: center;">
    {{发音}}
</div>
```

## 背面：
```
{{图片}}
<div class="card back">
  <div class="content">
    <div class="example">{{例句和笔记一}}</div>
    <hr>
    <div class="notes">{{例句和笔记二}}</div>
    <hr>
    <div class="source">{{例句和笔记三}}</div>
  </div>
  <div class="front-side">{{FrontSide}}</div>
</div>
```

## CSS样式：
```
.card {
  font-family: Arial, sans-serif;
  padding: 5px; /* 调整卡片内边距 */
  margin: 2px; /* 调整卡片外边距 */
  border-radius: 3px; /* 调整边框圆角 */
  background-color: #e0f7fa; /* 淡红色 */
  color: #333333; /* 深灰色 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.card.front, .card.back {
  padding: 5px; /* 调整正面和背面的内边距 */
  border-top: 1px solid #999999; /* 淡灰色 */
  background-color: #c3e6cb; /* 淡绿色 */
}

.word {
  font-size: 20px; /* 调整单词字体大小 */
  font-weight: bold;
  color: #333333; /* 深灰色 */
}

.definition, .example, .notes, .source {
  font-size: 14px; /* 调整内容字体大小 */
  color: #333333; /* 深灰色 */
  margin-top: 3px; /* 调整内容上边距 */
}

hr {
  border: none;
  border-top: 1px solid #999999; /* 淡灰色 */
  margin: 5px 0; /* 调整水平线的上下边距 */
}

.content {
  padding: 5px; /* 调整内容区域的内边距 */
}

b {
  color: #333333; /* 深灰色 */
}
```
# Anki-Relingo模板拟物化设计

## 正面：
```
<div class="card-front">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
</div>
```

## 背面：
```
<div class="card-back">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
  <div class="translation-section">
    <p><strong>Translation:</strong></p>
    <p>{{translation}}</p>
  </div>
  <div class="sentences-section">
    <p><strong>Example Sentences:</strong></p>
    <div id="sentences-container"></div>
  </div>
  <div class="mastered-section">
    <p><strong>Mastered:</strong> {{mastered}}</p>
  </div>
</div>

<script>
  function renderSentences() {
    var sentences = `{{sentences}}`;
    var container = document.getElementById('sentences-container');

    if (sentences.includes(';')) {
      var sentencesArray = sentences.split(';');
      var ul = document.createElement('ul');
      sentencesArray.forEach(function(sentence) {
        var li = document.createElement('li');
        li.textContent = sentence.trim();
        ul.appendChild(li);
      });
      container.appendChild(ul);
    } else {
      var p = document.createElement('p');
      p.textContent = sentences;
      container.appendChild(p);
    }
  }

  renderSentences();
</script>
```

## CSS样式：
```
.card {
  font-family: 'Georgia', serif;
  text-align: left;
  margin: 0;
  padding: 10px;
  background-color: #eae3d2;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
}

.card-front, .card-back {
  padding: 10px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 3px 5px rgba(0, 0, 0, 0.15);
}

h1 {
  font-size: 20px;
  color: #4b4b4b;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

p {
  font-size: 16px;
  color: #5a5a5a;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.phonetic {
  font-size: 14px;
  color: #7a7a7a;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.translation-section, .sentences-section, .mastered-section {
  margin-top: 10px;
  background: #fafafa;
  padding: 10px;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

ul {
  list-style-type: disc;
  margin: 5px 0 0 15px;
  padding: 0;
}

li {
  font-size: 16px;
  color: #5a5a5a;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
```

# Anki-Relingo模板扁平化设计

## 正面：
```
<div class="card-front">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
</div>
```

## 背面：
```
<div class="card-back">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
  <div class="translation-section">
    <p><strong>Translation:</strong></p>
    <p>{{translation}}</p>
  </div>
  <div class="sentences-section">
    <p><strong>Example Sentences:</strong></p>
    <div id="sentences-container"></div>
  </div>
  <div class="mastered-section">
    <p><strong>Mastered:</strong> {{mastered}}</p>
  </div>
</div>

<script>
  function renderSentences() {
    var sentences = `{{sentences}}`;
    var container = document.getElementById('sentences-container');

    if (sentences.includes(';')) {
      var sentencesArray = sentences.split(';');
      var ul = document.createElement('ul');
      sentencesArray.forEach(function(sentence) {
        var li = document.createElement('li');
        li.textContent = sentence.trim();
        ul.appendChild(li);
      });
      container.appendChild(ul);
    } else {
      var p = document.createElement('p');
      p.textContent = sentences;
      container.appendChild(p);
    }
  }

  renderSentences();
</script>
```

## CSS样式：
```
.card {
  font-family: 'Arial', sans-serif;
  text-align: left;
  margin: 0;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.card-front, .card-back {
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 18px;
  color: #333333;
}

p {
  font-size: 14px;
  color: #555555;
}

.phonetic {
  font-size: 12px;
  color: #777777;
}

.translation-section, .sentences-section, .mastered-section {
  margin-top: 10px;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

ul {
  list-style-type: disc;
  margin: 5px 0 0 15px;
  padding: 0;
}

li {
  font-size: 14px;
  color: #555555;
}
```

# Anki-Relingo材质设计

## 正面：
```
<div class="card-front">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
</div>
```

## 背面：
```
<div class="card-back">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
  <div class="translation-section">
    <p><strong>Translation:</strong></p>
    <p>{{translation}}</p>
  </div>
  <div class="sentences-section">
    <p><strong>Example Sentences:</strong></p>
    <div id="sentences-container"></div>
  </div>
  <div class="mastered-section">
    <p><strong>Mastered:</strong> {{mastered}}</p>
  </div>
</div>

<script>
  function renderSentences() {
    var sentences = `{{sentences}}`;
    var container = document.getElementById('sentences-container');

    if (sentences.includes(';')) {
      var sentencesArray = sentences.split(';');
      var ul = document.createElement('ul');
      sentencesArray.forEach(function(sentence) {
        var li = document.createElement('li');
        li.textContent = sentence.trim();
        ul.appendChild(li);
      });
      container.appendChild(ul);
    } else {
      var p = document.createElement('p');
      p.textContent = sentences;
      container.appendChild(p);
    }
  }

  renderSentences();
</script>
```

## CSS样式：
```
.card {
  font-family: 'Roboto', sans-serif;
  text-align: left;
  margin: 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

.card-front, .card-back {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 22px;
  color: #333333;
}

p {
  font-size: 16px;
  color: #555555;
}

.phonetic {
  font-size: 14px;
  color: #777777;
}

.translation-section, .sentences-section, .mastered-section {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: disc;
  margin: 5px 0 0 20px;
  padding: 0;
}

li {
  font-size: 16px;
  color: #555555;
}
```

# Anki-Relingo新拟物化设计

## 正面：
```
<div class="card-front">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
</div>
```

## 背面：
```
<div class="card-back">
  <h1>{{word}}</h1>
  <p class="phonetic">{{phonetic}}</p>
  <div class="translation-section">
    <p><strong>Translation:</strong></p>
    <p>{{translation}}</p>
  </div>
  <div class="sentences-section">
    <p><strong>Example Sentences:</strong></p>
    <div id="sentences-container"></div>
  </div>
  <div class="mastered-section">
    <p><strong>Mastered:</strong> {{mastered}}</p>
  </div>
</div>

<script>
  function renderSentences() {
    var sentences = `{{sentences}}`;
    var container = document.getElementById('sentences-container');

    if (sentences.includes(';')) {
      var sentencesArray = sentences.split(';');
      var ul = document.createElement('ul');
      sentencesArray.forEach(function(sentence) {
        var li = document.createElement('li');
        li.textContent = sentence.trim();
        ul.appendChild(li);
      });
      container.appendChild(ul);
    } else {
      var p = document.createElement('p');
      p.textContent = sentences;
      container.appendChild(p);
    }
  }

  renderSentences();
</script>
```

## CSS样式：
```
.card {
  font-family: 'Georgia', serif;
  text-align: left;
  margin: 0;
  padding: 10px;
  background-color: #eae3d2;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
}

.card-front, .card-back {
  padding: 12px;
  background: linear-gradient(145deg, #f0f0f0, #d9d9d9);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 3px 5px rgba(0, 0, 0, 0.15);
}

h1 {
  font-size: 20px;
  color: #4b4b4b;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

p {
  font-size: 16px;
  color: #5a5a5a;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.phonetic {
  font-size: 14px;
  color: #7a7a7a;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.translation-section, .sentences-section, .mastered-section {
  margin-top: 10px;
  background: #ffffff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: disc;
  margin: 5px 0 0 15px;
  padding: 0;
}

li {
  font-size: 16px;
  color: #5a5a5a;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
```

