function ajax(url,fnSucc,fnFaild){
//1、创建Ajax对象
    if(window.XMLHttpRequest){
       var oAjax=new XMLHttpRequest();
   }else{
    var oAjax=new ActiveXObject("Microsoft.XMLHTTP");
   }
//2、连接服务器
    oAjax.open('GET',url,true);
//3、发送请求
    oAjax.send();
//4、接收返回
    oAjax.onreadystatechange=function (){
        //oAjax.readyState 浏览器和服务器，进行到哪一步了
        if(oAjax.readyState==4){ //读取完成
            if(oAjax.status==200){ //读取成功
                fnSucc(oAjax.responseText);
            }else{
                if(fnFaild){
                    fnFaild(oAjax.status);
                }
            }
        }
    }
}















