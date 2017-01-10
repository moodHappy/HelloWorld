/**
 * Created by a on 2016/10/6.
 */
function getCookie(key) {
    var arr1=document.cookie.split('; ');

    for(var i=0;i<arr1.length;i++){
        var arr2=arr1[i].split('=');
        if (arr2[0]==key){
            return decodeURI(arr2[1]);
        }
    }
}