/**
 * Created by a on 2016/9/16.
 */
function getPos(obj) {
    var pos={
        left:0,
        top:0
    };
    while (obj){
        pos.left+=obj.offsetLeft;
        pos.top+=obj.offsetTop;
        obj=obj.offsetParent;
    }
    return pos;
}

/*
function getPos(ev){
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
    var scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;

    return {x:ev.clientX+scrollLeft,y:ev.clientY+scrollTop};
}
*/