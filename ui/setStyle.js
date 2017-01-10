/**
 * Created by a on 2016/10/25.
 */
/*function setStyle(obj, attr, value) {
    obj.style[attr]=value;
}*/

//JSON循环的
function setStyle(obj, json) {
    var attr='';
    for(attr in json){
        obj.style[attr]=json[attr];
    }
}