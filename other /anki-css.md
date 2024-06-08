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
  font-size: 16px;
  text-align: center;
  color: #333333; /* 深灰色 */
  background-color: #fafafa; /* 非常浅的灰色 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
  padding: 0; /* 将 padding 设为零 */
  margin: 0; /* 将 margin 设为零 */
  line-height: 1.6; /* 增加行间距 */
}
img {
  max-width: 100%;
  height: 240px;
  width: 400px;
  border-radius: 0; /* 移除圆角 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
  margin: 0; /* 将 margin 设为零 */
}

body {
  margin: 0;
  background-color: #f9f9f9; /* 非常浅的灰色背景 */
}
.header {
  font-family: 'EB Garamond', serif;
  font-size: 35px;
  font-weight: bold;
  color: #6b8e23; /* 橄榄绿 */
  text-align: center;
  border-bottom: 3px solid #6b8e23; /* 橄榄绿底边 */
  margin: 0;
  padding: 0;
}


.pronunciation {
  font-family: "Georgia", serif;
  font-size: 16px;
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
  background-color: #6b8e23; /* 橄榄绿按钮 */
  color: white;
  border-radius: 0; /* 移除圆角 */
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
}

.content {
  text-align: left;
  font-family: "Georgia", serif;
  font-size: 16px;
  color: #333333; /* 深灰色 */
  line-height: 1.6; /* 增加行间距 */
}
```

# z-7k-麦克米伦样式：
## 正面：
```
<div class="custom-div">{{单词}}</div>
```
## 背面：
```
<div class="card">
  {{图片}}
  <br>
  {{例句}}
  <br>
  {{例句翻译}}
  <br>
  <br>
  {{基本释义}}
  <br>
  <br>
  <div class="centered">
    {{音标}}
  </div>
</div>
{{FrontSide}}
```

## CSS样式：
```
.custom-div {
  font-family: "Times New Roman", serif;
  font-size: 24px;
  position: fixed;
  bottom: 150px;
  left: 0;
  width: 100%;
  text-align: center;
  background-color: #f5f5dc; /* 浅米色 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  box-sizing: border-box;
  border: 2px solid #d2b48c; /* 黄褐色边框 */
}

.card {
  font-family: "Georgia", serif;
  font-size: 18px;
  text-align: left;
  background-color: #fffaf0; /* 花色白 */
  padding: 20px;
  border: 1px solid #d2b48c; /* 黄褐色边框 */
  border-radius: 0; /* 移除圆角 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.card img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  border: 1px solid #d2b48c; /* 为图片添加边框 */
}

.card p {
  margin-bottom: 10px;
  line-height: 1.6; /* 增加行间距 */
}

.centered {
  text-align: center;
}
```
