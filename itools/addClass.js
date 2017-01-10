/**
 * Created by a on 2016/9/17.
 */
function addClass(obj, className) {
    if (obj.className == " ") {
        obj.className = className;
    } else {
        var arrClassName = obj.className.split(" ");//已有className
        var _index = arrIndexOf(arrClassName, className);
        if (_index == -1) {
            obj.className += " " + className;
        }
    }
}

function removeClass(obj,className) {

    if (obj.className !== " ") {
        var arrClassName = obj.className.split(" ");
        var _index = arrIndexOf(arrClassName, className);
        if (_index != -1) {
            arrClassName.splice(_index,1);//删除
            obj.className=arrClassName.join(" ");//拼接

        }

    }
}

function arrIndexOf(arr, v) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == v) {
            return i
        }
    }
    return -1;
}