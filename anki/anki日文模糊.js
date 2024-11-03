正面：

<script>
// 在页面最上方调用 toggleBlur 函数
toggleBlur(true); // 打开模糊
// toggleBlur(false); // 关闭模糊

function toggleBlur(isBlurred) {
    document.addEventListener('DOMContentLoaded', function () {
        var card = document.querySelector('.card');
        if (isBlurred) {
            card.classList.add('blurred'); // 添加模糊
        } else {
            card.classList.remove('blurred'); // 移除模糊
        }
    });
}
</script>

<style>
.card {
    /* 去掉过渡效果 */
}

.card.blurred {
    filter: blur(10px); /* 模糊效果 */
}
</style>

<div class="card">
    <!-- 卡片内容 -->
</div>

背面：

<style>
.card {
    filter: none !important; /* 使用 !important 强制取消背面的模糊效果 */
}
</style>