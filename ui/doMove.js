/**
 * Created by a on 2016/9/12.
 */
//运动框架
//标签、属性、方向（速度）、目标点,回调函数
//此函数要有定位
//direction 方向
function doMove(obj,attr,dir,target,endFn) {
    dir=parseInt(getStyle(obj,attr))<target?dir:-dir;
    clearInterval(obj.timer);
    obj.timer=setInterval(function () {
        var speed=parseInt(getStyle(obj,attr))+dir;
        if(speed>target&&dir>0||speed<target&&dir<0){
            speed=target;
        }
        obj.style[attr]=speed+'px';

        if(speed==target){
            clearInterval(obj.timer);

            /*if(endFn){
                endFn();
            }
            */
            endFn&&endFn();
        }
    },50)
}
function getStyle(obj, attr) {
    return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}