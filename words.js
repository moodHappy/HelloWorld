墨韵清风
背面
//
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">

<style>
    body {
        font-family: 'PingFang SC', PingFang SC;
        background-color: #f5f5f5; 
        color: #000000; 
    }
    .card {
        color: #000000;
        background-color: #ffffff;
        border: 1px solid #000000;
        padding: 20px;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
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
        font-family: 'Roboto', PingFang SC;
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
        font-size: 20px;
        font-family: 'Lobster';  
    }

    .notes b {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
    }

    .highlight {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5); 
    }

    .source-link {
        color: red;
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'cursive';
        font-size: 28px;
        font-weight: bold;
        padding: 0;
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

{{#Source-news}}
<div class="source-news">
    <span style="font-family: 'PingFang SC', sans-serif; font-size: 20px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

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
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

        // Regular expression to match common English word forms
        var wordFormsRegex = new RegExp('\\b(' + 
    wordText + '|' +                               
    wordText + 's?' + '|' +                        
    wordText.replace(/y$/, 'i') + 'es?' + '|' +    
    wordText + 'ed' + '|' +                        
    wordText + 'ing' + '|' +                       
    wordText + 'd' + '|' +                         
    wordText + 'er' + '|' +                        
    wordText + 'est' + '|' +                       
    wordText + 'ly' + '|' +                         
    wordText.replace(/y$/, 'ily') + '|' +           
    wordText.replace(/ic$/, 'ically') + '|' +       
    wordText.replace(/le$/, 'ly') +                
    ')\\b', 'gi');

        // Wrap matching words in <strong class="highlight"> tags
        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;
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

//
正面
//
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
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
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
        <div>{{tts zh_CN voices=Apple_Ava:单词}}</div>
    </div>
</body>
</html>
//

晨光绿意
背面
//
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>

<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">

<style>
    body {
        font-family: 'PingFang SC', PingFang SC;
        background-color: #e0f7fa; /* 鲜艳明亮的蓝绿色背景 */
        color: #000000; /* 黑色文字 */
    }
    .card {
        color: #000000;
        background-color: #fffde7; /* 浅黄色背景 */
        border: 2px solid #00796b; /* 深绿色边框 */
        padding: 20px;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .word {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 36px;
        font-weight: bold;
        color: #00796b; /* 深绿色文字 */
    }

    .word a {
        color: inherit;
        text-decoration: none;
    }

    .phonetic {
        font-family: 'PingFang SC', Arial, sans-serif;
        font-size: 24px;
        margin-top: 10px;
        color: #004d40; /* 更深的绿色 */
    }

    .definition {
        font-size: 20px;
        margin-top: 15px;
        color: #004d40; /* 更深的绿色 */
    }

    .example {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 20px;
        color: #004d40; /* 更深的绿色 */
    }

    .translation {
        font-family: 'PingFang SC', sans-serif;
        font-size: 18px;
        margin-top: 10px;
        color: #004d40; /* 更深的绿色 */
    }

    .notes {
        font-family: 'Roboto', PingFang SC;
        font-size: 16px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: #000000;
        background-color: #c8e6c9; /* 亮绿色背景 */
        padding: 15px;
        border: 2px solid #00796b; /* 深绿色边框 */
    }

    .notes span {
        font-size: 20px;
        font-family: 'Lobster';  
    }

    .notes b {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
    }

    .highlight {
        font-style: italic;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5); 
    }

    .source-link {
        color: #00796b; /* 深绿色 */
        text-decoration: none;
        display: block;
        text-align: right;
        font-family: 'cursive';
        font-size: 28px;
        font-weight: bold;
        padding: 0;
    }

    .source-news {
        font-family: 'PingFang SC', sans-serif;
        font-size: 16px;
        color: #000000;
        background-color: #e0f2f1; /* 亮青绿色背景 */
        padding: 15px;
        border: 2px solid #00796b; /* 深绿色边框 */
        margin-top: 20px;
        text-align: left;
    }

    .source-news a {
        text-decoration: none;
        color: #004d40; /* 更深的绿色 */
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

{{#Source-news}}
<div class="source-news">
    <span style="font-family: 'PingFang SC', sans-serif; font-size: 20px; font-weight: bold;">News</span><br>
    <hr style="border: 1px solid grey;">
    {{Source-news}}
</div>
{{/Source-news}}

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
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.innerHTML.trim();

var wordFormsRegex = new RegExp('\\b(' + 
    wordText + '|' +                               
    wordText + 's?' + '|' +                        
    wordText.replace(/y$/, 'i') + 'es?' + '|' +    
    wordText + 'ed' + '|' +                        
    wordText + 'ing' + '|' +                       
    wordText + 'd' + '|' +                         
    wordText + 'er' + '|' +                        
    wordText + 'est' + '|' +                       
    wordText + 'ly' + '|' +                         
    wordText.replace(/y$/, 'ily') + '|' +           
    wordText.replace(/ic$/, 'ically') + '|' +       
    wordText.replace(/le$/, 'ly') +                
    ')\\b', 'gi');



        var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
            return '<strong class="highlight">' + match + '</strong>';
        });

        notesElement.innerHTML = formattedNotes;
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
//
正面
//
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
            color: #000000; /* 黑色文本 */
            background-color: #fffde7; /* 浅黄色背景 */
            border: 2px solid #00796b; /* 深绿色边框 */
            padding: 20px;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .word {
            font-size: 36px;
            font-weight: bold;
            color: #00796b; /* 深绿色文本 */
            position: relative;
            display: inline-block;
            cursor: pointer;
        }

        .phonetic {
            font-size: 24px;
            margin-top: 10px;
            color: #004d40; /* 更深的绿色 */
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
            fill: #00796b; /* 深绿色 */
            stroke: #00796b; /* 深绿色 */
            opacity: 0.3;
        }

        .replay-button svg path {
            stroke: #00796b; /* 深绿色 */
            fill: #00796b; /* 深绿色 */
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

        if (uURL != "") {
            var para = document.createElement("p");
            para.innerHTML = '<a href="'+uURL+'" style="color: #00796b;">'+tTitle+'</a>';
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