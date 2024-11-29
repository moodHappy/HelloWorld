中日：
正面：
<script>
function forceClear() {
    var card = document.querySelector('.card');
    // 强制清除模糊效果
    card.style.filter = 'blur(0)'; // 设置为清晰
}
</script>

<style>
.card {
    filter: blur(10px); /* 初始状态为模糊 */
    transition: filter 0.1s ease; /* 添加过渡效果 */
}
</style>


<button onclick="forceClear()">强制清晰</button>

背面：
<style>
.card {
    filter: none !important; /* 使用 !important 强制取消背面的模糊效果 */
}
</style>




日中：
正面：
<script>
function forceClear() {
    var card = document.querySelector('.card');
    // 强制清除模糊效果
    card.style.filter = 'blur(0)'; // 设置为清晰
}
</script>

<style>
.card {
    filter: blur(10px); /* 初始状态为模糊 */
    transition: filter 0.1s ease; /* 添加过渡效果 */
}
</style>


<button onclick="forceClear()">强制清晰</button>

背面：
<style>
.card {
    filter: none !important; /* 使用 !important 强制取消背面的模糊效果 */
}
</style>
