    // --- 修改点：_injectModalHTML 方法更新 ---
    _injectModalHTML() {
        if(document.getElementById('arResultModal')) return;
        const div = document.createElement('div');
        div.innerHTML = `
            <div id="arResultModal" class="ar-modal-overlay">
                <div class="ar-modal-card">
                    <div class="ar-modal-header">
                        <div class="ar-modal-title">AI 分析</div>
                        <button class="ar-close-btn" onclick="document.getElementById('arResultModal').classList.remove('active')">✕</button>
                    </div>
                    <div class="ar-modal-body">
                        <div id="arOriginalSentence" class="ar-original-sentence"></div>
                        <div id="arResultContent" class="ar-result-content"></div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(div);

        const modal = document.getElementById('arResultModal');

        // 1. 单击遮罩背景关闭 (原有逻辑)
        modal.onclick = (e) => {
            if(e.target.id === 'arResultModal') e.target.classList.remove('active');
        };

        // 2. 桌面端标准双击关闭
        modal.ondblclick = () => modal.classList.remove('active');

        // 3. 【移动端专用】自定义双击检测逻辑
        // 解决 Pixel Chrome 等浏览器 dblclick 不触发或触发缩放的问题
        let lastTapTime = 0;
        let isMoving = false;

        modal.addEventListener('touchstart', () => {
            isMoving = false; // 手指按下，重置滑动标记
        }, { passive: true });

        modal.addEventListener('touchmove', () => {
            isMoving = true; // 发生移动，标记为滑动操作
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            // 如果刚刚发生了滑动（比如在滚动内容），则不视为点击，直接返回
            if (isMoving) return;

            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;

            // 如果两次点击间隔小于 300ms，且大于 0，视为双击
            if (tapLength < 300 && tapLength > 0) {
                // 阻止默认行为（防止触发浏览器缩放或选词）
                if(e.cancelable) e.preventDefault(); 
                
                modal.classList.remove('active');
                
                // 重置时间，防止三连击触发两次
                lastTapTime = 0; 
            } else {
                lastTapTime = currentTime;
            }
        });
    }
