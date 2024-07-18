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

    .notes strong {
        font-weight: bold;
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
        var wordElement = document.querySelector(".word");
        var notesElement = document.querySelector(".notes");
        var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
        var notesText = notesElement.textContent.trim();

        // Split notes text into words and wrap matching words in <strong> tags
        var words = notesText.split(/\s+/);
        var formattedNotes = words.map(function(word) {
            var lowerCaseWord = word.toLowerCase().replace(/\s+/g, '');
            if (lowerCaseWord === wordText) {
                return '<strong>' + word + '</strong>';
            } else {
                return word;
            }
        }).join(' ');

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