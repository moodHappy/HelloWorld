/**
 * Created by a on 2016/10/9.
 */
//json运动框架
function getStyle(obj, attr) {
    return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}
function startMove(obj,json,fn) {

    clearInterval(obj.timer);

    obj.timer=setInterval(function () {
        for(var attr in json){
            var iCur=0;
            if(attr=='opacity'){
                iCur=parseInt(parseFloat(getStyle(obj,attr))*100);
            }else {
                iCur=parseInt(getStyle(obj,attr));
            }

            var iSpeed=(json[attr]-iCur)/8;
            iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
            if (iCur==json[attr]){
                clearInterval(obj.timer);
                if(fn){
                    fn();
                }

            }else {
                if(attr=='opacity'){
                    obj.style.opacity=(iCur+iSpeed)/100;

                }else {
                    obj.style[attr] = iCur + iSpeed + 'px';
                }
            }
        }
    },30)
}