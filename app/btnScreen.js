/**
 * Created by a on 2016/10/23.
 */
window.onload=function () {
    lh.app.toSel();
};

var lh={};//命名空间

lh.app={};
lh.app.toSel=function () {
    var oSel=document.getElementById("sel1");
    var aDd=oSel.getElementsByTagName("dd");
    var aUl=oSel.getElementsByTagName("ul");
    var aH2=oSel.getElementsByTagName("h2");

    for (var i=0;i<aDd.length;i++){
        aDd[i].index=i;
        aDd[i].onclick=function (ev) {

            var This=this;

            for (var i=0;i<aUl.length;i++){
                aUl[i].style.display='none';
            }
            aUl[this.index].style.display='block';

            document.onclick=function () { //点击屏幕任意位置隐藏
                aUl[This.index].style.display='none';
            };
            ev.cancelBubble=true;//阻止冒泡
        }
    }

    for(var i=0;i<aUl.length;i++){
        aUl[i].index=i;
        (function (ul) {
            var aLi=ul.getElementsByTagName("li");

            for (var i=0;i<aLi.length;i++){
                aLi[i].onmouseover=function () {
                    this.className='active';
                };
                aLi[i].onmouseout=function () {
                    this.className='';
                };

                aLi[i].onclick=function (ev) {
                    var ev=event;
                    aH2[this.parentNode.index].innerHTML=this.innerHTML;
                    ev.cancelBubble=true;
                    this.parentNode.style.display='none';
                }
            }
        })(aUl[i]);
    }
};