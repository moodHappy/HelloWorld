/**
 * Created by a on 2016/9/17.
 */
function getElementsByClassName(parent,tagName,className) {
    var aEls=parent.getElementsByTagName(tagName);
    var arr=[];

    for(var i=0;i<aEls.length;i++){
//                    if(aEls[i].className==className){
//                        arr.push(aEls[i]);
//                    }
        var aClassName=aEls[i].className.split(" ");

        for (var j=0;j<aClassName.length;j++){
            if (aClassName[j]==className){
                arr.push(aEls[i]);
                break;
            }
        }
    }
    return arr;
}