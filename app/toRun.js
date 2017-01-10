/**
 * Created by a on 2016/10/24.
 */
window.onload=function () {
    lh.app.toRun();
};
var lh={};

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

lh.ui={};

lh.ui.moveLeft = function(obj,old,now){

    clearInterval(obj.timer);
    obj.timer = setInterval(function(){

        var iSpeed = (now - old)/10;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

        if(now == old){
            clearInterval(obj.timer);
        }
        else{
            old += iSpeed;
            obj.style.left = old + 'px';
        }

    },30);

};

lh.app={};

lh.app.toRun=function () {
    var oRun=document.getElementById("run1");
    var oUl=oRun.getElementsByTagName("ul")[0];
    var oLi=oUl.getElementsByTagName("li");

    var oPrev=lh.tools.getByClass(oRun,'prev')[0];
    var oNext=lh.tools.getByClass(oRun,'next')[0];

    var iNow=0;

    oUl.innerHTML+=oUl.innerHTML;

    oUl.style.width=oLi.length*oLi[0].offsetWidth+'px';

    oPrev.onclick=function () {

        if(iNow==0){
            iNow=oLi.length/2;
            oUl.style.left=-oUl.offsetWidth/2+'px';
        }
        lh.ui.moveLeft(oUl,-iNow*oLi[0].offsetWidth,-(iNow-1)*oLi[0].offsetWidth);
        iNow--;
    };

    oNext.onclick = function(){

        if(iNow==oLi.length/2){
            iNow=0;
            oUl.style.left=0;
        }
        lh.ui.moveLeft(oUl,-iNow*oLi[0].offsetWidth,-(iNow+1)*oLi[0].offsetWidth);
        iNow++;
    };
};