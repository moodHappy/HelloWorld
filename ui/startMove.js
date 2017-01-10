/**
 * Created by a on 2016/10/9.
 */
//多物体运动框架
function getStyle(obj, attr) {
    return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}
function startMove(obj,attr,iTarget) {

    clearInterval(obj.timer);

    obj.timer=setInterval(function () {
        var iCur=0;
        if(attr=='opacity'){
            iCur=parseInt(parseFloat(getStyle(obj,attr))*100);
        }else {
            iCur=parseInt(getStyle(obj,attr));
        }

        var iSpeed=(iTarget-iCur)/8;
        iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
        if (iCur==iTarget){
            clearInterval(obj.timer);
        }else {
            if(attr=='opacity'){
                obj.style.opacity=(iCur+iSpeed)/100;

            }else {
                obj.style[attr] = iCur + iSpeed + 'px';
            }
        }
    },30)
}