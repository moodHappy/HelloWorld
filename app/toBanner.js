/**
 * Created by a on 2016/10/22.
 */
window.onload=function () {
    lh.app.toBanner();
};

var lh={};//命名空间

lh.tools={};//工具
lh.tools.getByClass=function (oParent,sClass) {
    var aEle=oParent.getElementsByTagName("*");
    var arr=[];

    for(var i=0;i<aEle.length;i++){
        if(aEle[i].className==sClass){
            arr.push(aEle[i])
        }
    }
    return arr;
}


lh.tools.getStyle=function(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }
    else{
        return getComputedStyle(obj,false)[attr];
    }
};

lh.ui={};//UI

lh.ui.fadeIn=function (obj) {
    
    var iCur=lh.tools.getStyle(obj,'opacity');
    if(iCur==1){return false;}

    var value=0;
    clearInterval(obj.timer);

    obj.timer=setInterval(function () {
        var iSpeed=5;

        if(value==100){
            clearInterval(obj.timer)
        }else {
            value+=iSpeed;
            obj.style.opacity=value/100;
        }
    },30);
};

lh.ui.fadeOut=function (obj) {
    
    var iCur=lh.tools.getStyle(obj,'opacity');
    if(iCur==0){return false;}
    
    var value=100;
    clearInterval(obj.timer);

    obj.timer=setInterval(function () {
        var iSpeed=-5;

        if(value==0){
            clearInterval(obj.timer)
        }else {
            value+=iSpeed;
            obj.style.opacity=value/100;
        }
    },30)
};


lh.app={};//应用
lh.app.toBanner=function () {
    var oDiv=document.getElementById("div1");
    var aLi=oDiv.getElementsByTagName("li");

    var oPrevBg=lh.tools.getByClass(oDiv,'prev_bg')[0];
    var oNextBg=lh.tools.getByClass(oDiv,'next_bg')[0];

    var oPrev=lh.tools.getByClass(oDiv,'prev')[0];
    var oNext=lh.tools.getByClass(oDiv,'next')[0];


    var iNow=0;
    var timer=setInterval(auto,3000);

    function auto() {
        if(iNow==aLi.length-1){
            iNow=0;
        }else {
            iNow++;
        }
        for(var i=0;i<aLi.length;i++){
            lh.ui.fadeOut(aLi[i]);
        }
        lh.ui.fadeIn(aLi[iNow]);
    }
    function autoPrev() {
        if(iNow==0){
            iNow=aLi.length-1;
        }else {
            iNow--;
        }
        for(var i=0;i<aLi.length;i++){
            lh.ui.fadeOut(aLi[i]);
        }
        lh.ui.fadeIn(aLi[iNow]);
    }

    oPrevBg.onmouseover=oPrev.onmouseover=function () {
        oPrev.style.display='block';
        clearInterval(timer)
    }
    oNextBg.onmouseover=oNext.onmouseover=function () {
        oNext.style.display='block';
        clearInterval(timer)
    }

    oPrevBg.onmouseout=oPrev.onmouseout=function () {
        oPrev.style.display='none';
        timer=setInterval(auto,3000);
    }
    oNextBg.onmouseout=oNext.onmouseout=function () {
        oNext.style.display='none';
        timer=setInterval(auto,3000);
    }

    oPrev.onclick=function () {
        autoPrev();
    }
    oNext.onclick=function () {
        auto();
    }
};