// 示例单词列表，实际使用时根据需求更改
const wordsToHighlight = ['apple', 'banana'];

// 获取页面中所有文本内容
const contentElement = document.getElementById('content');
const contentText = contentElement.textContent;

// 替换文本中的目标单词为红色文本
wordsToHighlight.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    contentText = contentText.replace(regex, `<span class="highlight">${word}</span>`);
});

// 将替换后的文本重新插入到页面中
contentElement.innerHTML = contentText;