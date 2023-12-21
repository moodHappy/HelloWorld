// ==UserScript==
// @name         随机颜色关键词
// @namespace    https://greasyfork.org/zh-TW
// @version      1.0
// @description  给网页关键词改变成随机颜色，完整匹配
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义要匹配的关键词，可以修改为您想要的
    var keywords = ["district", "tear", "balance", "cash", "gay", "damage", "entry", "long-term", "myself", "particular", "aim", "nature", "accuse", "plus", "ice", "teacher", "declare", "hurt", "crime", "anyone", "bill", "station", "network", "immediately", "stuff", "useful", "fifteenth", "ally", "gold", "Dr", "wonderful", "independence", "address", "novel", "refugee", "minority", "manager", "notice", "attend", "shape", "interview", "domestic", "basis", "excellent", "inside", "structure", "spirit", "female", "sleep", "note", "horse", "throughout", "presidential", "magazine", "promote", "benefit", "formal", "overall", "spokesman", "bag", "treat", "diet", "facility", "drop", "eastern", "profit", "television", "average", "competition", "reality", "warn", "regional", "ensure", "slip", "shake", "partner", "exchange", "criticism", "reserve", "proposal", "collapse", "shot", "confidence", "attention", "unit", "teach", "arrest", "suffer", "youth", "millionth", "fourteenth", "occur", "writer", "governor", "heat", "involved", "alone", "transfer", "airport", "commitment","scale","abuse","willing","royal","channel","cry","victim","otherwise","image","natural","relief","tonight","explain","route","sea","corner","choice","suppose","dance","obvious","save","skin","daily","expert","deputy","prison","southern","gather","resident","armed","telephone","section","table","simply","appeal","Tory","airline","contact","fair","environment","village","winner","meanwhile","struggle","introduce","album","machine","institute","finger","organization","agent","mouth","window","prospect","model","opposition","college","supporter","nice","recession","sixtieth","religious","message","culture","candidate","ship","annual","card","bridge","possibility","strange","tomorrow","effective","indeed","pink","crowd","championship","impose","energy","jump","negotiate","wild","mountain","representative","seventieth","escape","prize","session","exact","seventh","pack","trust","presence","settlement","flight","hot","pattern","death","okay","investment","baby","equipment","degree","mission","whom","collect","solution","reform","means","threaten","rest","executive","eventually","evening","debt","prove","size","basic","link","purpose","chemical","affair","burn","largely","invite","neither","review","challenge","treaty","responsibility","blame","owner","speech","pull","secure","maintain","traditional","nineteenth","budget","respect","disease","battle","senior","function","document","nor","aircraft","territory","loss","bottom","mention","involve","terrible","recently","poor","orange","length","gas","conduct","reporter","distance","contain","schedule","spot","chairman","obviously","supply","tough","protest","clothes","democracy","original","production","below","conservative","strength","ready","transport","growth","fun","warm","goal","constant","skill","defeat","yard","ride","tree","caption","require","imagine","princess","frequent","video","choose","admit","voter","gone","spring","tenth","wind","wrong","certain","cousin","wonder","discuss","determine","limit","quality","producer","quarter","extend","advance","everybody","fish","camp","principle","wear","evidence","guy","smile","crash","movie","object","tea","vehicle","phone","space","guard","conflict","knowledge","stake","edition","earn","analyst","professional","prisoner","sexual","examine","mile","trouble","type","museum","beyond","unless","worry","narrow","shoot","particularly","arrive","track","search","paint","technology","potential","extra","cool","sorry","doubt","alleged","eleventh","earth","driver","joint","judge","lift","display","band","cabinet","church","elect","popular","shock","appearance","aware","violence","feature","use","critical","farm","shall","environmental","personal","occupy","dinner","civil","print","character","defend","piece","ability","encourage","push","bond","slightly","following","prepare","heavy","occasion","none","dress","incident","heart","favour","tend","colleague","defence","impact","agreement","industrial","impossible","risk","physical","dozen","extremely","reader","rain","establish","fee","recognize","resource","circle","deliver","suit","respond","politician","package","movement","fresh","professor","store","twelfth","poll","wine","taste","indicate","recall","finally","complain","garden","significant","data","straight","stick","ban","guess","eightieth","modern","tour","victory","island","request","language","ninth","usual","replace","worth","present","tape","strategy","bomb","gain","restaurant","motor","picture","estate","separate","eighth","wing","sixth","protect","voice","everyone","federal","surround","scheme","intend","refuse","box","bar","success","similar","serve","finish","divide","scene","reply","listen","recommend","confirm","contract","hole","difference","camera","alternative","dangerous","decade","ticket","summer","reflect","catch","drink","computer","square","subject","powerful","purchase","assume","field","MP","expensive","previous","ninetieth","option","fourth","factory","guarantee","engine","surface","dead","audience","beautiful","rock","resolution","bright","prepared","pain","task","complex","avoid","marriage","housing","shoulder","kick","due","waste","cheap","radical","generation","fat","treatment","apply","stress","perform","danger","screen","refer","date","twentieth","suspect","desire","freedom","weapon","technique","compared","consumer","reporting","organize","withdraw","seventeenth","song","author","publish","clean","regard","adult","hostage","investor","correct","loan","kitchen","whatever","administration","failure","train","ahead","investigate","deficit","wish","coach","champion","sentence","medical","credit","series","absolutely","weather","safe","activity","material","guest","succeed","unlikely","football","travel","exercise","thirteenth","cast","cook","period","division","lunch","bird","prevent","performance","running","latest","various","justice","site","entire","fashion","block","eat","coast","institution","chapter","threat","boat","hang","patient","approve","mistake","necessary","journal","theatre","behaviour","affect","promise","editor","memory","estimate","standard","survey","adopt","desk","management","pretty","opinion","TV","project","practice","strike","dry","achieve","launch","animal","cell","AIDS","Christian","emerge","writing","edge","finance","dream","order","wave","upon","inflation","fruit","difficulty","split","surprise","reveal","sector","usually","majority","payment","legal","depend","deny","festival","represent","flow","perfect","negotiation","insurance","doctor","fast","earlier","leg","brief","Muslim","troop","method","measure","suddenly","discussion","broad","media","somebody","detail","attract","will","no one","hotel","weekend","customer","born","double","cream","dark","simple","commercial","hand","dog","dispute","especially","dramatic","duty","holiday","secret","uncle","lord","set-up","realize","tie","nuclear","favourite","stone","smoke","program","wound","lady","income","prefer","fully","summit","photograph","quiet","fan","border","career","eighteenth","sometimes","reduce","happy","variety","agency","grand","prince","kid","amount","aspect","reject","successful","fill","approach","king","supposed","chair","debate","feed","award","theory","seed","element","thinking","trial","Corp.","collection","floor","plane","score","possibly","politics","afternoon","decline","soft","pair","severe","republican","dominate","scientist","protection","hardly","improve","statement","grey","supreme","yourself","fuel","careful","regular","style","item","mark","queen","mainly","feeling","blood","above","please","lawyer","bottle","classic","interested","artist","hundredth","spread","rich","thirtieth","trip","propose","god","leading","article","fellow","injury","education","status","correspondent","slow","purple","remove","nobody","board","stable","county","considerable","highly","asset","mortgage","sir","association","reaction","increasingly","deep","commit","rival","flat","discover","accepted","rebel","grant","relationship","enter","direction","urge","third","attitude","thus","therefore","instance","leadership","private","focus","huge","volume","speed","copy","journalist","aunt","comment","progress","painting","employee","republic","crisis","ignore","individual","insist","egg","specific","communist","stock","enjoy","welcome","fiftieth","hair","oh","version","marry","express","liberal","advice","file","seat","anyway","soldier","sex","safety","Senate","fifth","science","commission","normal","critic","rapid","settle","ball","truth","identify","target","source","survive","master","destroy","river","mass","farmer","someone","nearly","famous","included","active","maybe","argument","weight","manage","cold","navy","weak","goods","fortieth","sport","quote","gun","brain","delay","league","responsible","mix","factor","lack","forward","import","essential","argue","sanction","except","studio","response","generally","flower","murder","couple","maker","democrat","property","certainly","citizen","democratic","check","handle","boss","glass","wood","UN","addition","sharp","odd","emergency","repeat","roll","title","advantage","ministry","pick","positive","sixteenth","apparently","throw","shop","exist","newspaper","relation","criminal","sterling","forget","Chancellor","captain","population","export","instead","key","opportunity","despite","touch","region","park","sight","male","while","range","influence"];

    // 定义一个函数，生成随机颜色
    function randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;
        var index = -1;
        for (var i = 0; i < keywords.length; i++) {
            var keyword = keywords[i];
            var regex = new RegExp("\\b" + keyword + "\\b", "g"); // 使用正则表达式，完整匹配关键词
            var match = regex.exec(text);
            if (match) {
                index = match.index;
                break;
            }
        }
        if (index > -1) {
            var span = document.createElement("span");
            span.style.color = randomColor(); // 设置随机颜色
            span.textContent = text.slice(index, index + keyword.length);
            var after = node.splitText(index);
            after.textContent = after.textContent.slice(keyword.length);
            parent.insertBefore(span, after);
        }
    }

    // 获取所有的文本节点
    function getTextNodes() {
        var nodes = [];
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        return nodes;
    }

    // 对所有的文本节点执行替换操作
    var textNodes = getTextNodes();
    for (var i = 0; i < textNodes.length; i++) {
        replaceKeywords(textNodes[i]);
    }
})();