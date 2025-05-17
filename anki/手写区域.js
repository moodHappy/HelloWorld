<!-- 手写区域 -->

<div class="handwriting-area">
    <canvas id="handwritingCanvas" width="300" height="230"></canvas>
    <button id="clearButton">清除</button>
</div>

<style>
    .handwriting-area {
        text-align: center;
        margin-top: 20px;
    }
    canvas {
        border: 1px solid #000; /* 默认边框颜色 */
        border-radius: 8px;
    }
    #clearButton {
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #f76c6c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    #clearButton:hover {
        background-color: #e55a5a;
    }

    /* 夜间模式样式 */
    .night-mode canvas {
        border-color: #ddd; /* 夜间模式下的边框颜色 */
    }
    .night-mode #handwritingCanvas {
        /* 如果需要更明显的对比，可以考虑浅灰色背景 */
        /* background-color: #333; */
    }
</style>

<script>
    const canvas = document.getElementById('handwritingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#000'; // 默认颜色

    // 检查是否处于夜间模式 (你需要根据你的 Anki 夜间模式实现来判断)
    function isNightMode() {
        // 这只是一个示例，你需要根据你的 Anki 配置来判断
        const body = document.body;
        return body.classList.contains('nightMode') || body.classList.contains('night');
    }

    // 设置当前的颜色
    function setCurrentColor() {
        currentColor = isNightMode() ? '#ddd' : '#000';
    }

    // 开始绘图
    function startDrawing(e) {
        e.preventDefault();
        e.stopPropagation();
        isDrawing = true;
        ctx.beginPath();
        const { clientX, clientY } = e.touches[0];
        ctx.moveTo(clientX - canvas.getBoundingClientRect().left, clientY - canvas.getBoundingClientRect().top);
        setCurrentColor(); // 设置当前颜色
    }

    // 绘制轨迹
    function draw(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!isDrawing) return;
        const { clientX, clientY } = e.touches[0];
        ctx.lineTo(clientX - canvas.getBoundingClientRect().left, clientY - canvas.getBoundingClientRect().top);
        ctx.strokeStyle = currentColor; // 使用当前颜色
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // 结束绘图
    function stopDrawing(e) {
        e.preventDefault();
        e.stopPropagation();
        isDrawing = false;
        ctx.closePath();
    }

    // 清除画布
    document.getElementById('clearButton').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // 监听触摸事件
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // 在页面加载时和夜间模式切换时更新颜色 (你需要根据你的 Anki 事件来监听夜间模式的切换)
    document.addEventListener('DOMContentLoaded', setCurrentColor);
    // 示例：假设你的 Anki 在 body 元素上切换 'nightMode' class
    const body = document.body;
    if (body) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    setCurrentColor();
                }
            });
        });
        observer.observe(body, { attributes: true });
    }
</script>