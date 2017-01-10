/**
 * Created by a on 2016/9/12.
 */
//抖动框架
function shake(obj,attr,endFn) {
    var pos=parseInt(getStyle(obj,attr));//有隐患的
    var num=0;
    var arr=[];
    for (var i=8;i>0;i-=2){
        arr.push(i,-i)
    }
    arr.push(0);

    clearInterval(obj.shake);
    obj.shake=setInterval(function () {
        obj.style[attr]=pos+arr[num]+'px';
        num++;
        if (num==arr.length){
            clearInterval(obj.shake);
            endFn&&endFn();
        }
    },50)
}