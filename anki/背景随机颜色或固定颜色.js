// 二版：背景随机颜色、自定义颜色、夜间模式

<script>
// --- 背景色设置 ---
// 设置为 true 开启随机背景色功能 (在浅色模式下排除绿色、蓝色、紫色等)
// 设置为有效的CSS颜色字符串 (在浅色模式下使用)
// 设置为 'auto' 则根据系统深色模式自动切换 (深色模式强制为 #1E1E1E)
// 设置为 false 或其他非字符串/非 true /非 'auto' 的值则不应用特殊背景色 (使用Anki默认或CSS中定义的背景)

// #F0F8FF  爱丽丝蓝  
// #FAF9F6  米白色  
// #EAF3FB  浅灰蓝  
// #EDF6EC  淡抹茶绿  
// #F5F5DC  沙色  
// #F2F2F2  浅灰  
// #FFF8DC  玉米丝色  
// #FFFAF0  花白色  
// #F4F1EE  烟雾米  
// #ECEBE4  砂岩灰  
// #F3F3E8  米灰色  
// #FAFAD2  淡金黄  
// #FFFACD  柠檬绸  
// #FFDAB9  桃仁色  
// #FFEBCD  白杏仁色  
// #FAF0E6  亚麻色  
// #FDF5E6  旧花边色  
// #F0FFF0  蜜露绿  
// #FFF5EE  海贝壳色  
// #F8F8FF  幽灵白  
// #E0FFFF  淡青色  
// #F0FFFF  蔚蓝  
// #FFF0F5  薰衣草绯红  
// #FFFAFA  雪白  
// #F5FFFA  薄荷奶油  
// #E6E6FA  淡紫罗兰  
// #FBEEC1  奶油杏  
// #F3E5AB  浅奶油黄  
// #EDEDED  极淡灰
// #1E1E1E  夜间模式



const backgroundColorSetting = '#F3E5AB'; // <--- 在这里设置 'true'、颜色字符串、'auto' 或 'false'





// 深色模式强制背景色
const darkModeOverrideColor = '#1E1E1E';

// ---------------------

let finalBackgroundColor = null; // 存储最终需要应用的背景色

// --- HSL到Hex颜色转换函数 (标准实现) ---
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
// --- 结束 HSL到Hex颜色转换函数 ---

// 应用背景色的函数
function applyBackgroundColor(color) {
    if (color) {
        const style = document.createElement('style');
        style.innerHTML = `
          body, html, .card, * {
            background-color: ${color} !important;
          }
        `;
        // 移除之前可能存在的 style 标签，避免叠加
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
        style.setAttribute('data-background-changer', 'true'); // 添加标记，方便后续查找和移除
        document.head.appendChild(style);
    } else {
        // 如果 finalBackgroundColor 为 null，移除我们添加的 style 标签，恢复默认或 CSS 样式
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
    }
}

function determineBackgroundColor() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return darkModeOverrideColor; // 强制返回深色模式颜色
    } else {
        // 浅色模式下，根据 backgroundColorSetting 决定颜色
        if (typeof backgroundColorSetting === 'string' && backgroundColorSetting) {
            return backgroundColorSetting; // 使用自定义颜色
        } else if (backgroundColorSetting === true) {
            let isExcludedHue = true;
            let h, s, l;
            while (isExcludedHue) {
              h = Math.floor(Math.random() * 361);
              isExcludedHue =
                (h >= 90 && h <= 150) ||
                (h >= 210 && h <= 270) ||
                (h >= 270 && h <= 330);
            }
            s = Math.floor(Math.random() * (101 - 40)) + 40;
            l = Math.floor(Math.random() * (81 - 40)) + 40;
            return hslToHex(h, s, l); // 返回随机颜色
        } else {
            return null; // 不应用特殊背景色
        }
    }
}

// 初始应用背景色
applyBackgroundColor(determineBackgroundColor());

// 监听系统颜色模式的变化
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        applyBackgroundColor(determineBackgroundColor());
    });
}

</script>

// 初版：背景随机颜色或固定颜色，通用代码

<script>
// --- 背景色设置 ---
// 设置为 true 开启随机背景色功能 (排除绿色、蓝色、紫色等)
// 设置为有效的CSS颜色字符串 (例如: '#f0f8ff', 'lightblue', 'rgb(255, 0, 0)') 使用固定背景色
// 设置为 false 或其他非字符串/非 true 的值则不应用特殊背景色 (使用Anki默认或CSS中定义的背景)


const backgroundColorSetting = 'lightblue'; // <--- 在这里设置 'true' 或颜色字符串，或者 'false'



// 示例：使用固定颜色 (请取消下方行的注释，并注释掉上面一行来测试)
// const backgroundColorSetting = '#e6ffe6'; // 例如：浅绿色

// 示例：关闭特殊背景色 (请取消下方行的注释，并注释掉上面两行来测试)
// const backgroundColorSetting = false;

// ---------------------

let finalBackgroundColor = null; // 存储最终需要应用的背景色

// 根据设置决定背景色
if (typeof backgroundColorSetting === 'string' && backgroundColorSetting) {
    // 如果是有效的非空字符串，则使用这个字符串作为固定颜色
    finalBackgroundColor = backgroundColorSetting;
} else if (backgroundColorSetting === true) {
    // 如果设置为 true，则生成随机颜色

    // --- HSL到Hex颜色转换函数 (标准实现) ---
    function hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }
    // --- 结束 HSL到Hex颜色转换函数 ---

    let isExcludedHue = true;
    let h, s, l;

    // 循环生成颜色，直到找到一个不在排除范围内的色相
    while (isExcludedHue) {
      // 随机生成色相 (Hue, 0-360)
      h = Math.floor(Math.random() * 361);

      // 检查生成的色相是否落在排除的范围内：绿色(90-150), 蓝色(210-270), 紫色(270-330)
      // 你可以根据需要调整这些范围
      isExcludedHue =
        (h >= 90 && h <= 150) ||  // 排除绿色范围
        (h >= 210 && h <= 270) || // 排除蓝色范围
        (h >= 270 && h <= 330);   // 排除紫色范围
    }

    // 如果找到了有效的色相，则生成饱和度(S)和亮度(L)，并转换为Hex
    // S: 40-100 (避免灰色), L: 40-80 (避免黑色和白色)
    s = Math.floor(Math.random() * (101 - 40)) + 40; // S between 40 and 100
    l = Math.floor(Math.random() * (81 - 40)) + 40;  // L between 40 and 80
    finalBackgroundColor = hslToHex(h, s, l);

}
// 如果 backgroundColorSetting 是 false 或其他值，finalBackgroundColor 将保持 null，
// 这样就不会应用特殊的背景色，从而使用Anki的默认设置或CSS。


// 如果确定了要应用的背景色，则创建并注入样式
if (finalBackgroundColor) {
    // 创建一个 <style> 元素
    const style = document.createElement('style');

    // 设置其内容，应用颜色并使用 !important 覆盖现有样式。
    // 目标元素包括 body, html, .card 以及所有元素 (*)。
    // 使用 * 确保覆盖嵌套元素可能设置的背景色。
    style.innerHTML = `
      body, html, .card, * {
        background-color: ${finalBackgroundColor} !important;
      }
    `;

    // 将 <style> 元素添加到文档的 <head> 部分，使其生效
    document.head.appendChild(style);
}

</script>