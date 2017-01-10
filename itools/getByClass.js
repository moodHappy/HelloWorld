/**
 * Created by a on 2016/11/7.
 */
//完美版
function getByClass(oParent, sClass) {
    var aEle=oParent.getElementsByTagName("*");
    var aResult=[];
    var re=new RegExp('\\b'+sClass+'\\b','i');
    var i=0;

    for(i=0;i<aEle.length;i++){
        if(re.test(aEle[i].className)){
            aResult.push(aEle[i])
        }
    }
    return aResult;
}