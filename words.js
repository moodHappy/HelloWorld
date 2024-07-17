// 示例单词列表，实际使用时根据需求更改
const wordsToHighlight = ['apple', 'banana'];

// 获取整个 body 内的文本内容
const bodyContent = document.body.innerHTML;

// 替换文本中的目标单词为红色文本
wordsToHighlight.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    bodyContent = bodyContent.replace(regex, `<span class="highlight">${word}</span>`);
});

// 将替换后的文本重新插入到 body 中
document.body.innerHTML = bodyContent;