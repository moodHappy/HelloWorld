# z-4k-样式：
## 正面：
```
<div class="header">
  {{Front}}
</div>
<div class="pronunciation">
  {{音标}}
</div>
<div class="footer">
  <div class="sound-btn">
    {{Sound}}
  </div>
</div>
```

## 背面：
```
{{FrontSide}}
{{中文}}
<hr>
{{Image}}
<hr>

<div class="content">
  <div class="meaning">
    → Meaning:{{Meaning}}
  </div>
  <div class="example">
    → Example:{{Example}}
  </div>
</div>

<hr>
{{Sound_Meaning}}
[sound:_1sec.mp3]
{{Sound_Example}}
```
## CSS样式：
```
.card {
  font-family: "Georgia", serif;
  font-size: 20px;
  text-align: center;
  color: #333333; /* 深灰色 */
  background-color: #fafafa; /* 非常浅的灰色 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
  padding: 15px;
  line-height: 1.6; /* 增加行间距 */
}

img {
  max-width: 100%;
  height: auto;
  width: 100px;
  border-radius: 0; /* 移除圆角 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
}

body {
  margin: 0;
  background-color: #f9f9f9; /* 非常浅的灰色背景 */
}

.header {
  font-family: 'EB Garamond', serif;
  font-size: 50px;
  color: #6b8e23; /* 橄榄绿 */
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 3px solid #6b8e23; /* 橄榄绿底边 */
}

.pronunciation {
  font-family: "Georgia", serif;
  font-size: 18px;
  color: #333333; /* 深灰色 */
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.6; /* 增加行间距 */
}

.footer {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
  background-color: #f9f9f9; /* 背景颜色与主体一致 */
  padding: 5px;
  left: calc(50% - 100px); /* 向左偏移 100 像素 */
  transform: translateX(-26%); /* 确保元素居中 */
}

.sound-btn {
  display: inline-block;
  background-color: #6b8e23; /* 橄榄绿按钮 */
  color: white;
  padding: 8px 16px;
  border-radius: 0; /* 移除圆角 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
}

.content {
  text-align: left;
  font-family: "Georgia", serif;
  font-size: 18px;
  color: #333333; /* 深灰色 */
  line-height: 1.6; /* 增加行间距 */
}
```

