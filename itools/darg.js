/**
 * Created by a on 2016/9/24.
 */
function drag(obj) {
    obj.onmousedown = function(ev) {
        var ev = ev || event;

        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;

        document.onmousemove = function(ev) {
            var ev = ev || event;
            var L=ev.clientX - disX;
            var T=ev.clientY - disY;
            if(L<10){
                L=0;
            }else if(L>document.documentElement.clientWidth-obj.offsetWidth-10){//磁性吸附
                L=document.documentElement.clientWidth-obj.offsetWidth;
            }
            if(T<10){
                T=0;
            }else if(T>document.documentElement.clientHeight-obj.offsetHeight-10){
                T=document.documentElement.clientHeight-obj.offsetHeight;
            }


            obj.style.left = L + 'px';
            obj.style.top = T + 'px';

        };

        document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null;
        };
        return false;
    }
}