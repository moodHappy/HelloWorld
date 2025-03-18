中日：
正面：
<script>
    // 监听点击事件，当点击屏幕下半部分时清晰化
    document.addEventListener('click', function(event) {
        var card = document.querySelector('.card');
        var screenHeight = window.innerHeight; // 获取屏幕高度
        var clickY = event.clientY; // 获取点击位置的Y坐标

        // 判断是否点击在屏幕下半区域
        if (clickY > screenHeight / 2) {
            card.style.filter = 'blur(0)'; // 设置为清晰
        }
    });
</script>

<style>
    .card {
        filter: blur(10px); /* 初始状态为模糊 */
        transition: filter 0.1s ease; /* 添加过渡效果 */
    }
</style>

背面：
<style>
.card {
    filter: none !important; /* 使用 !important 强制取消背面的模糊效果 */
}
</style>




日中：
正面：

<script>
    // 监听点击事件，当点击屏幕下半部分时清晰化
    document.addEventListener('click', function(event) {
        var card = document.querySelector('.card');
        var screenHeight = window.innerHeight; // 获取屏幕高度
        var clickY = event.clientY; // 获取点击位置的Y坐标

        // 判断是否点击在屏幕下半区域
        if (clickY > screenHeight / 2) {
            card.style.filter = 'blur(0)'; // 设置为清晰
        }
    });
</script>

<style>
    .card {
        filter: blur(10px); /* 初始状态为模糊 */
        transition: filter 0.1s ease; /* 添加过渡效果 */
    }
</style>

背面：
<style>
.card {
    filter: none !important; /* 使用 !important 强制取消背面的模糊效果 */
}
</style>
