/**
 * Created by a on 2016/10/6.
 */
function setCookie(key, value, t) {
    var oDate = new Date();
    oDate.setDate( oDate.getDate() + t );
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}

function removeCookie(key) {
    setCookie(key,'',-1);
}
