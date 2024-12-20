// 带导入导出

// ==UserScript==
// @name         蓝色（支持词形变化）并标记已掌握单词
// @namespace    https://greasyfork.org/zh-TW
// @version      6.0
// @description  给网页关键词及其词形变化改变成蓝色，支持导出和导入已掌握的单词
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 从 localStorage 中加载已掌握的关键词
    var masteredKeywords = JSON.parse(localStorage.getItem('masteredKeywords')) || ['run', 'write', 'study', 'read'];

    // 定义十个关键词数组
          var keywords1 = [
  'mate', 'raid', 'hint', 'pool', 'neat', 'done', 'fold', 'spur', 'cope', 
  'tone', 'pile', 'gift', 'amid', 'roof', 'peak', 'ease', 'crop', 'edit', 
  'tool', 'trap', 'hunt', 'poem', 'auto', 'stem', 'myth', 'task', 'sand', 
  'tide', 'heal', 'pipe', 'rose', 'ruin', 'peer', 'echo', 'gate', 'tiny', 
  'rare', 'pour', 'rush', 'busy', 'vice', 'riot', 'golf', 'jail', 'reel', 
  'pump', 'hire', 'wake', 'leaf', 'bell', 'part', 'root', 'mild', 'fool', 
  'soul', 'harm', 'sick', 'cure', 'Wall', 'salt', 'bake', 'hero', 'vast', 
  'path', 'chat', 'tune', 'dust', 'luck', 'pale', 'holy', 'crew', 'tall', 
  'live', 'dare', 'kiss', 'till', 'plot', 'shut', 'fate', 'stir', 'wrap', 
  'beer', 'lane', 'chip', 'coal', 'user', 'wash', 'hate', 'gene', 'mail', 
  'aged', 'rape', 'slim', 'bone', 'vol.', 'thin', 'mask', 'cake', 'rank', 
  'leap', 'swim', 'ring', 'bare', 'mess', 'boom', 'jury', 'rear', 'mood', 
  'quit', 'NATO', 'lock', 'chop', 'grip', 'drum', 'code', 'lend', 'self', 
  'folk', 'flee', 'pure', 'pact', 'boot', 'twin', 'shoe', 'load', 'leak', 
  'dear', 'soil', 'hill', 'wire', 'boil', 'belt', 'halt', 'lama', 'calm', 
  'dump', 'bend', 'tail', 'text', 'ibid', 'hook', 'sigh', 'lost', 'poet', 
  'moon', 'pace', 'gang', 'iron', 'core', 'knee', 'snow', 'Nazi', 'joke', 
  'spin', 'onto', 'snap', 'bass', 'hide', 'rely', 'meal', 'keen', 'fine', 
  'lake', 'mill', 'rice', 'dish', 'news', 'bean', 'sack', 'lean', 'rent', 
  'bore', 'bowl', 'lens', 'cave', 'tank', 'mere', 'inch', 'zone', 'rail', 
  'sink', 'rage', 'nose', 'acid', 'cite', 'deck', 'pose', 'meat', 'evil', 
  'mind', 'hall', 'jazz', 'sake', 'blow', 'gear', 'bury', 'flag', 'tale', 
  'loud', 'grab', 'bath', 'sail', 'port', 'coat', 'fare', 'wage', 'whip', 
  'glad', 'neck', 'bike', 'milk', 'seek', 'wise', 'pill', 'wipe', 'vary', 
  'tube', 'acre', 'fade', 'pole', 'drag', 'steam', 'yours', 'steel', 'drift', 
  'solve', 'apple', 'noted', 'trail', 'one\'s', 'Latin', 'apart', 'spray', 
  'angry', 'equal', 'upper', 'being', 'sugar', 'storm', 'brush', 'strip', 
  'grain', 'cough', 'habit', 'diary', 'imply', 'anger', 'alarm', 'punch', 
  'truly', 'metal', 'brand', 'point', 'trend', 'White', 'sauce', 'stamp', 
  'tight', 'spell', 'hello', 'sweep', 'flood', 'trick', 'rough', 'swing', 
  'chaos', 'juice', 'burst', 'plain', 'shore', 'boost', 'cheer', 'pause', 
  'miner', 'phase', 'eager', 'buyer', 'tower', 'medal', 'proof', 'drama', 
  'virus', 'await', 'fraud', 'spark', 'actor', 'inner', 'Bible', 'nurse', 
  'frame', 'yacht', 'State', 'worse', 'thick', 'weigh', 'prior', 'lover', 
  'grass', 'renew', 'stock'
];
    var keywords2 = [
  'cable', 'shift', 'penny', 'bound', 'ocean', 'clock', 'opera', 'solid', 
  'empty', 'steal', 'ought', 'smash', 'smell', 'local', 'spite', 'shame', 
  'crazy', 'proud', 'relax', 'index', 'grave', 'funny', 'yield', 'exile', 
  'squad', 'fence', 'cloud', 'newly', 'mixed', 'draft', 'angle', 'mayor', 
  'bunch', 'noise', 'error', 'awful', 'nerve', 'blind', 'pilot', 'pitch', 
  'giant', 'wheel', 'layer', 'faith', 'knock', 'debut', 'lease', 'moral', 
  'fixed', 'prime', 'panic', 'lucky', 'beach', 'found', 'rally', 'magic', 
  'worst', 'shirt', 'smart', 'saint', 'tired', 'lobby', 'theme', 'watch', 
  'ideal', 'pride', 'rider', 'twist', 'unity', 'react', 'chase', 'naval', 
  'minor', 'drain', 'truck', 'shade', 'arise', 'vital', 'trace', 'tooth', 
  'fault', 'alert', 'grade', 'sheet', 'brave', 'panel', 'upset', 'cease', 
  'enemy', 'pupil', 'slide', 'shout', 'lower', 'loose', 'spare', 'rugby', 
  'float', 'birth', 'given', 'breed', 'forth', 'light', 'urban', 'clash', 
  'depth', 'fleet', 'super', 'chest', 'sweet', 'climb', 'rural', 'bread', 
  'knife', 'chart', 'craft', 'mount', 'dirty', 'slice', 'blast', 'gross', 
  'alive', 'seize', 'badly', 'plate', 'aside', 'stare', 'cycle', 'flash', 
  'metre', 'chain', 'venue', 'label', 'crown', 'alter', 'stupid', 'inning', 
  'rhythm', 'enable', 'script', 'allied', 'guitar', 'reward', 'merely', 
  'admire', 'regime', 'racing', 'agenda', 'valley', 'marked', 'strict', 
  'weekly', 'jacket', 'bother', 'repair', 'silent', 'CD-ROM', 'ruling', 
  'empire', 'retain', 'regret', 'forest', 'beaten', 'native', 'poetry', 
  'immune', 'obtain', 'excess', 'assess', 'higher', 'height', 'heaven', 
  'marine', 'desert', 'pledge', 'tunnel', 'horror', 'fulfil', 'excuse', 
  'behalf', 'rating', 'killer', 'branch', 'temple', 'wicket', 'notion', 
  'select', 'rescue', 'freeze', 'output', 'pocket', 'rocket', 'vessel', 
  'plenty', 'remark', 'scream', 'symbol', 'sample', 'palace', 'mobile', 
  'tactic', 'honest', 'ballot', 'fabric', 'mirror', 'steady', 'nearby', 
  'resign', 'lovely', 'barrel', 'cruise', 'tissue', 'employ', 'stroke', 
  'sudden', 'client', 'luxury', 'junior', 'wealth', 'lesson', 'caring', 
  'invest', 'adjust', 'merger', 'tennis', 'urgent'
];
    var keywords3 = [
  'unlike', 'saving', 'partly', 'origin', 'smooth', 'wooden', 'afraid', 'margin', 
  'shadow', 'surely', 'golden', 'trader', 'permit', 'prompt', 'modest', 'priest', 
  'resort', 'plunge', 'honour', 'retail', 'cheese', 'potato', 'engage', 'unfair', 
  'viewer', 'racial', 'access', 'guilty', 'muscle', 'whilst', 'superb', 'actual', 
  'weaken', 'pepper', 'cancel', 'butter', 'remote', 'bitter', 'belief', 'gentle', 
  'barely', 'manner', 'medium', 'vision', 'clever', 'column', 'cinema', 'easily', 
  'remind', 'breast', 'signal', 'define', 'stream', 'assist', 'equity', 'holder', 
  'extent', 'banker', 'praise', 'retire', 'living', 'police', 'autumn', 'united', 
  'device', 'expand', 'silver', 'runner', 'abroad', 'govern', 'ethnic', 'borrow', 
  'belong', 'breath', 'bloody', 'fierce', 'proper', 'resume', 'rumour', 'dealer', 
  'fiscal', 'slight', 'tackle', 'mental', 'shaped', 'soccer', 'humour', 'throat', 
  'button', 'string', 'hunter', 'combat', 'titled', 'global', 'motion', 'salary', 
  'infect', 'expose', 'coffee', 'comedy', 'rarely', 'oppose', 'unable', 'pursue', 
  'phrase', 'relate', 'switch', 'latter', 'locked', 'advise', 'talent', 'inform', 
  'glance', 'planet', 'cotton', 'fairly', 'reckon', 'mostly', 'mutual', 'afford', 
  'castle', 'burden', 'resist', 'beside', 'clinic', 'beauty', 'singer', 'strain', 
  'broker', 'unique', 'winter', 'carbon', 'behave', 'mystery', 'crucial', 'formula', 
  'suicide', 'colonel', 'embassy', 'charity', 'predict', 'assault', 'instant', 
  'enhance', 'bargain', 'counsel', 'silence', 'passage', 'deposit', 'library', 
  'winning', 'interim', 'genuine', 'execute', 'premier', 'shortly', 'chamber', 
  'expense', 'maximum', 'penalty', 'meaning', 'whereas', 'elderly', 'pleased', 
  'intense', 'explore', 'speaker', 'tension', 'provoke', 'concept', 'married', 
  'mixture', 'vitamin', 'musical', 'unhappy', 'delight', 'dismiss', 'condemn', 
  'wedding', 'athlete', 'barrier', 'qualify', 'railway', 'veteran', 'sustain', 
  'o\'clock', 'revenue', 'premium', 'impress', 'triumph', 'violent', 'absence', 
  'cutting', 'sponsor', 'verdict', 'initial', 'Kremlin', 'venture', 'unknown', 
  'restore'
];
    var keywords4 = [
  'profile', 'opposed', 'senator', 'cooking', 'courage', 'antique', 'stretch', 
  'abandon', 'welfare', 'fortune', 'appoint', 'inquiry', 'written', 'witness', 
  'consist', 'scandal', 'squeeze', 'elegant', 'whisper', 'tourist', 'harbour', 
  'painful', 'faction', 'routine', 'pick-up', 'recruit', 'compete', 'liberty', 
  'opening', 'stadium', 'outcome', 'worried', 'nowhere', 'killing', 'visitor', 
  'fantasy', 'surplus', 'limited', 'founder', 'charter', 'symptom', 'monitor', 
  'capable', 'reading', 'monthly', 'banking', 'ancient', 'outline', 'command', 
  'healthy', 'breathe', 'anybody', 'funding', 'uniform', 'shelter', 'actress', 
  'missing', 'massive', 'subsidy', 'exhaust', 'dancing', 'adviser', 'curtain', 
  'dressed', 'convert', 'anxious', 'injured', 'acquire', 'therapy', 'traffic', 
  'gesture', 'offence', 'make-up', 'warning', 'somehow', 'unusual', 'arrange', 
  'install', 'made-up', 'digital', 'species', 'exactly', 'resolve', 'journey', 
  'gallery', 'protein', 'suspend', 'consult', 'retreat', 'lecture', 'circuit', 
  'minimum', 'live-in', 'curious', 'bedroom', 'counter', 'primary', 'cottage', 
  'backing', 'visible', 'assured', 'typical', 'passion', 'trigger', 'torture', 
  'ranking', 'inspect', 'justify', 'bearing', 'contest', 'observe', 'stomach', 
  'poverty', 'pension', 'surgery', 'excerpt', 'combine', 'besides', 'amateur', 
  'concede', 'anxiety', 'crystal', 'convict', 'amazing', 'capture', 'beneath', 
  'beating', 'hearing', 'segment', 'smoking', 'tragedy', 'emotion', 'illegal', 
  'testing', 'missile', 'licence', 'alcohol', 'chicken', 'exploit', 'flavour', 
  'auction', 'explode', 'recover', 'deserve', 'equally', 'comfort', 'extreme', 
  'arrival', 'proceed', 'reverse', 'cricket', 'illness', 'violate', 'nervous', 
  'fishing', 'concert', 'carrier', 'lesbian', 'fighter', 'compare', 'entitle', 
  'related', 'context', 'plastic', 'leather', 'servant', 'climate', 'register', 
  'exposure', 'merchant', 'casualty', 'pleasure', 'laughter', 'invasion', 
  'category', 'abortion', 'academic', 'alliance', 'whenever', 'capacity', 
  'superior', 'interior', 'decorate', 'moderate', 'persuade', 'valuable', 
  'medicine', 'motivate', 'concrete', 'absolute', 'delegate', 'clothing', 
  'reliable', 'takeover', 'platform', 'liberate', 'province', 'preserve', 
  'teaching', 'monetary'
];
    var keywords5 = [
  'dialogue', 'judgment', 'relative', 'romantic', 'diplomat', 'universe', 'anywhere', 
  'pregnant', 'treasury', 'striking', 'ambition', 'somewhat', 'identity', 'advanced', 
  'religion', 'apparent', 'sympathy', 'headline', 'planning', 'shortage', 'creative', 
  'approval', 'offering', 'portrait', 'negative', 'baseball', 'survival', 'deadline', 
  'accident', 'adequate', 'internal', 'Catholic', 'thorough', 'cultural', 'quantity', 
  'Security', 'overseas', 'civilian', 'enormous', 'midnight', 'priority', 'accurate', 
  'overcome', 'activist', 'dividend', 'properly', 'assembly', 'ordinary', 'birthday', 
  'discount', 'historic', 'operator', 'tendency', 'generate', 'delivery', 'attorney', 
  'generous', 'shopping', 'musician', 'designer', 'moreover', 'contrast', 'earnings', 
  'know-how', 'detailed', 'engineer', 'commerce', 'opponent', 'literary', 'innocent', 
  'exciting', 'ultimate', 'teenager', 'analysis', 'currency', 'ceremony', 'familiar', 
  'homeless', 'militant', 'location', 'entirely', 'flexible', 'advocate', 'confront', 
  'coverage', 'right-on', 'employer', 'existing', 'opposite', 'coloured', 'conclude', 
  'normally', 'suitable', 'sensible', 'recovery', 'disaster', 'numerous', 'friendly', 
  'pleasant', 'cautious', 'convince', 'forecast', 'training', 'electric', 'software', 
  'emphasis', 'bathroom', 'Algerian', 'graduate', 'peaceful', 'observer', 'somewhere', 
  'technical', 'exception', 'beginning', 'so-called', 'offensive', 'brilliant', 
  'inspector', 'basically', 'coalition', 'alongside', 'explosion', 'perfectly', 
  'solicitor', 'traveller', 'sensitive', 'organized', 'passenger', 'surrender', 
  'childhood', 'complaint', 'qualified', 'emphasize', 'gradually', 'component', 
  'electoral', 'selection', 'ceasefire', 'associate', 'landscape', 'accompany', 
  'confident', 'intention', 'terrorist', 'advertise', 'socialist', 'pregnancy', 
  'nightmare', 'integrate', 'departure', 'abandoned', 'seriously', 'reference', 
  'chocolate', 'victimize', 'expansion', 'strategic', 'procedure', 'disappear', 
  'immediate', 'boyfriend', 'publicity', 'precisely', 'personnel', 'stimulate', 
  'principal', 'promotion', 'surprised', 'hardliner', 'conscious', 'automatic', 
  'policeman', 'tradition', 'youngster', 'assistant', 'classical', 'cigarette', 
  'pollution', 'celebrate', 'frustrate', 'detective', 'editorial', 'neighbour', 
  'efficient', 'immigrant', 'virtually', 'undermine', 'amendment', 'infection', 
  'reluctant', 'organizer', 'furniture', 'entertain', 'privatize', 'volunteer', 
  'criticize', 'Secretary', 'permanent', 'sacrifice'
];
    var keywords6 = [
  'substance', 'practical', 'delighted', 'elsewhere', 'apartment', 'existence', 
  'transform', 'vegetable', 'breakfast', 'marketing', 'regulator', 'encounter', 
  'voluntary', 'remaining', 'ownership', 'prominent', 'guerrilla', 'economist', 
  'speculate', 'mechanism', 'broadcast', 'objective', 'worldwide', 'discovery', 
  'concerned', 'foreigner', 'desperate', 'ourselves', 'naturally', 'recording', 
  'overnight', 'household', 'provision', 'publisher', 'implement', 'highlight', 
  'kilometre', 'initially', 'long-time', 'temporary', 'convinced', 'emotional', 
  'corporate', 'gentleman', 'suspicion', 'extensive', 'spiritual', 'statistic', 
  'continent', 'reduction', 'Whitehall', 'satellite', 'commander', 'economics', 
  'eliminate', 'definitely', 'laboratory', 'occasional', 'literature', 'aggressive', 
  'convention', 'retirement', 'competitor', 'permission', 'collective', 'right-wing', 
  'optimistic', 'background', 'transition', 'unexpected', 'reasonable', 'helicopter', 
  'previously', 'enterprise', 'concession', 'short-term', 'enthusiasm', 'scientific', 
  'altogether', 'contribute', 'initiative', 'membership', 'diplomatic', 'vulnerable', 
  'suggestion', 'everywhere', 'allegation', 'definition', 'strengthen', 'subsequent'
];
    var keywords7 = [
  'inevitable', 'acceptable', 'sufficient', 'deliberate', 'conviction', 'relatively',
  'resistance', 'originally', 'substitute', 'assessment', 'reputation', 'atmosphere',
  'presidency', 'illustrate', 'withdrawal', 'conclusion', 'invitation', 'incredible',
  'exhibition', 'associated', 'publishing', 'referendum', 'friendship', 'expression',
  'historical', 'attractive', 'delegation', 'compromise', 'federation', 'depression',
  'determined', 'additional', 'widespread', 'remarkable', 'specialize', 'assumption',
  'regulation', 'connection', 'corruption', 'specialist', 'ambassador', 'assistance',
  'surprising', 'importance', 'indication', 'ingredient', 'comparison', 'proportion',
  'homosexual', 'presumably', 'percentage', 'appreciate', 'afterwards', 'instrument',
  'revolution', 'experiment', 'equivalent', 'foundation', 'co-operate', 'consistent',
  'electronic', 'tremendous', 'consultant', 'tournament', 'philosophy', 'discipline',
  'impressive', 'girlfriend', 'well-known', 'profession', 'occupation', 'impression',
  'ultimately', 'personally', 'employment', 'destruction', 'resignation', 'partnership',
  'nationalist', 'explanation', 'manufacture', 'personality', 'comfortable', 'competitive',
  'recognition', 'agriculture', 'threatening', 'requirement', 'replacement', 'commentator',
  'implication', 'complicated', 'supermarket', 'expectation', 'shareholder', 'concentrate',
  'educational', 'appointment', 'substantial', 'temperature', 'necessarily', 'acquisition',
  'immigration', 'interesting', 'communicate', 'examination', 'preparation', 'achievement',
  'celebration', 'fundamental'
];
    var keywords8 = [
  'Restoration', 'involvement', 'underground', 'participate', 'perspective', 'considering',
  'transaction', 'essentially', 'legislation', 'counterpart', 'demonstrate', 'instruction',
  'acknowledge', 'electricity', 'businessman', 'declaration', 'consequence', 'imagination',
  'intelligent', 'combination', 'description', 'countryside', 'outstanding', 'application',
  'anniversary', 'improvement', 'controversy', 'spectacular', 'publication', 'appropriate',
  'engineering', 'restriction', 'prosecution', 'corporation', 'arrangement', 'construction',
  'conversation', 'illustration', 'unidentified', 'contemporary', 'demonstrator', 'broadcasting',
  'intellectual', 'contribution', 'circumstance', 'headquarters', 'distribution', 'announcement',
  'agricultural', 'intelligence', 'constitution', 'disappointed', 'conventional', 'compensation',
  'photographer', 'intervention', 'unemployment', 'specifically', 'overwhelming', 'manufacturer',
  'nevertheless', 'communication', 'sophisticated', 'consideration', 'understanding',
  'demonstration', 'unfortunately', 'comprehensive', 'establishment', 'revolutionary',
  'consciousness', 'accommodation', 'parliamentary', 'controversial', 'psychological',
  'extraordinary', 'entertainment', 'confrontation', 'concentration', 'characteristic',
  'recommendation', 'constitutional', 'industrialized', 'secretary-general'
];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 将所有关键词数组合并为一个数组
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 排除已掌握的关键词
    allKeywords = allKeywords.filter(function(keyword) {
        return !masteredKeywords.includes(keyword);
    });

    // 生成蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 添加输入框功能以手动标记单词为已掌握
    function addKeywordManually() {
        var word = prompt("请输入要标记为已掌握的单词：");
        if (word && !masteredKeywords.includes(word)) {
            masteredKeywords.push(word);
            localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
            alert(`已将 "${word}" 加入已掌握单词列表`);
        } else if (masteredKeywords.includes(word)) {
            alert(`"${word}" 已经在已掌握单词列表中`);
        } else {
            alert('输入无效');
        }
    }

    // 导出已掌握单词为JSON格式
    function exportMasteredKeywords() {
        var dataStr = JSON.stringify(masteredKeywords);
        var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        var exportFileDefaultName = 'masteredKeywords.json';

        var linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // 导入已掌握单词
    function importMasteredKeywords() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var importedKeywords = JSON.parse(e.target.result);
                    if (Array.isArray(importedKeywords)) {
                        masteredKeywords = [...new Set([...masteredKeywords, ...importedKeywords])]; // 合并且去重
                        localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
                        alert('成功导入已掌握单词!');
                    } else {
                        alert('导入的文件格式不正确');
                    }
                } catch (error) {
                    alert('导入失败，请检查文件格式');
                }
            };
            reader.readAsText(file);
        };

        input.click(); // 触发文件选择对话框
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase();
            var wordFormsRegex = new RegExp('\\b(' +
                wordText + '|' +
                wordText + 's?' + '|' +
                wordText.replace(/y$/, 'i') + 'es?' + '|' +
                wordText + 'ed' + '|' +
                wordText + 'ing' + '|' +
                wordText + 'd' + '|' +
                wordText + 'er' + '|' +
                wordText + 'est' + '|' +
                wordText + 'ly' + '|' +
                wordText.replace(/y$/, 'ily') + '|' +
                wordText.replace(/ic$/, 'ically') + '|' +
                wordText.replace(/le$/, 'ly') +
            ')\\b', 'gi'); // 构建词形变化的正则表达式

            // 替换匹配的关键词及词形变化为带有颜色的 span
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()};">${match}</span>`;
            });
        }

        // 如果文本发生改变，替换为新的带有颜色的节点
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text;
            parent.replaceChild(span, node);
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

    // 将导入导出和手动添加功能暴露到全局作用域
    window.addKeywordManually = addKeywordManually;
    window.exportMasteredKeywords = exportMasteredKeywords;
    window.importMasteredKeywords = importMasteredKeywords;

    // 添加导出导入和手动添加按钮到页面上
    var exportButton = document.createElement('button');
    exportButton.innerText = '导出已掌握单词';
    exportButton.style.position = 'fixed';
    exportButton.style.bottom = '10px';
    exportButton.style.left = '10px';
    exportButton.onclick = exportMasteredKeywords;
    document.body.appendChild(exportButton);

    var importButton = document.createElement('button');
    importButton.innerText = '导入已掌握单词';
    importButton.style.position = 'fixed';
    importButton.style.bottom = '10px';
    importButton.style.left = '150px';
    importButton.onclick = importMasteredKeywords;
    document.body.appendChild(importButton);

    var addButton = document.createElement('button');
    addButton.innerText = '手动添加已掌握单词';
    addButton.style.position = 'fixed';
    addButton.style.bottom = '10px';
    addButton.style.left = '300px';
    addButton.onclick = addKeywordManually;
    document.body.appendChild(addButton);

})();








// 排除已掌握数组置于前

// ==UserScript==
// @name         蓝色（支持词形变化）-排除已掌握
// @namespace    https://greasyfork.org/zh-TW
// @version      5.0
// @description  给网页关键词及其词形变化改变成蓝色，完整匹配
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义已掌握的关键词数组
    var masteredKeywords = ['run', 'write', 'study', 'read'];

    // 定义十个关键词数组
      var keywords1 = [
  'mate', 'raid', 'hint', 'pool', 'neat', 'done', 'fold', 'spur', 'cope', 
  'tone', 'pile', 'gift', 'amid', 'roof', 'peak', 'ease', 'crop', 'edit', 
  'tool', 'trap', 'hunt', 'poem', 'auto', 'stem', 'myth', 'task', 'sand', 
  'tide', 'heal', 'pipe', 'rose', 'ruin', 'peer', 'echo', 'gate', 'tiny', 
  'rare', 'pour', 'rush', 'busy', 'vice', 'riot', 'golf', 'jail', 'reel', 
  'pump', 'hire', 'wake', 'leaf', 'bell', 'part', 'root', 'mild', 'fool', 
  'soul', 'harm', 'sick', 'cure', 'Wall', 'salt', 'bake', 'hero', 'vast', 
  'path', 'chat', 'tune', 'dust', 'luck', 'pale', 'holy', 'crew', 'tall', 
  'live', 'dare', 'kiss', 'till', 'plot', 'shut', 'fate', 'stir', 'wrap', 
  'beer', 'lane', 'chip', 'coal', 'user', 'wash', 'hate', 'gene', 'mail', 
  'aged', 'rape', 'slim', 'bone', 'vol.', 'thin', 'mask', 'cake', 'rank', 
  'leap', 'swim', 'ring', 'bare', 'mess', 'boom', 'jury', 'rear', 'mood', 
  'quit', 'NATO', 'lock', 'chop', 'grip', 'drum', 'code', 'lend', 'self', 
  'folk', 'flee', 'pure', 'pact', 'boot', 'twin', 'shoe', 'load', 'leak', 
  'dear', 'soil', 'hill', 'wire', 'boil', 'belt', 'halt', 'lama', 'calm', 
  'dump', 'bend', 'tail', 'text', 'ibid', 'hook', 'sigh', 'lost', 'poet', 
  'moon', 'pace', 'gang', 'iron', 'core', 'knee', 'snow', 'Nazi', 'joke', 
  'spin', 'onto', 'snap', 'bass', 'hide', 'rely', 'meal', 'keen', 'fine', 
  'lake', 'mill', 'rice', 'dish', 'news', 'bean', 'sack', 'lean', 'rent', 
  'bore', 'bowl', 'lens', 'cave', 'tank', 'mere', 'inch', 'zone', 'rail', 
  'sink', 'rage', 'nose', 'acid', 'cite', 'deck', 'pose', 'meat', 'evil', 
  'mind', 'hall', 'jazz', 'sake', 'blow', 'gear', 'bury', 'flag', 'tale', 
  'loud', 'grab', 'bath', 'sail', 'port', 'coat', 'fare', 'wage', 'whip', 
  'glad', 'neck', 'bike', 'milk', 'seek', 'wise', 'pill', 'wipe', 'vary', 
  'tube', 'acre', 'fade', 'pole', 'drag', 'steam', 'yours', 'steel', 'drift', 
  'solve', 'apple', 'noted', 'trail', 'one\'s', 'Latin', 'apart', 'spray', 
  'angry', 'equal', 'upper', 'being', 'sugar', 'storm', 'brush', 'strip', 
  'grain', 'cough', 'habit', 'diary', 'imply', 'anger', 'alarm', 'punch', 
  'truly', 'metal', 'brand', 'point', 'trend', 'White', 'sauce', 'stamp', 
  'tight', 'spell', 'hello', 'sweep', 'flood', 'trick', 'rough', 'swing', 
  'chaos', 'juice', 'burst', 'plain', 'shore', 'boost', 'cheer', 'pause', 
  'miner', 'phase', 'eager', 'buyer', 'tower', 'medal', 'proof', 'drama', 
  'virus', 'await', 'fraud', 'spark', 'actor', 'inner', 'Bible', 'nurse', 
  'frame', 'yacht', 'State', 'worse', 'thick', 'weigh', 'prior', 'lover', 
  'grass', 'renew', 'stock'
];
    var keywords2 = [
  'cable', 'shift', 'penny', 'bound', 'ocean', 'clock', 'opera', 'solid', 
  'empty', 'steal', 'ought', 'smash', 'smell', 'local', 'spite', 'shame', 
  'crazy', 'proud', 'relax', 'index', 'grave', 'funny', 'yield', 'exile', 
  'squad', 'fence', 'cloud', 'newly', 'mixed', 'draft', 'angle', 'mayor', 
  'bunch', 'noise', 'error', 'awful', 'nerve', 'blind', 'pilot', 'pitch', 
  'giant', 'wheel', 'layer', 'faith', 'knock', 'debut', 'lease', 'moral', 
  'fixed', 'prime', 'panic', 'lucky', 'beach', 'found', 'rally', 'magic', 
  'worst', 'shirt', 'smart', 'saint', 'tired', 'lobby', 'theme', 'watch', 
  'ideal', 'pride', 'rider', 'twist', 'unity', 'react', 'chase', 'naval', 
  'minor', 'drain', 'truck', 'shade', 'arise', 'vital', 'trace', 'tooth', 
  'fault', 'alert', 'grade', 'sheet', 'brave', 'panel', 'upset', 'cease', 
  'enemy', 'pupil', 'slide', 'shout', 'lower', 'loose', 'spare', 'rugby', 
  'float', 'birth', 'given', 'breed', 'forth', 'light', 'urban', 'clash', 
  'depth', 'fleet', 'super', 'chest', 'sweet', 'climb', 'rural', 'bread', 
  'knife', 'chart', 'craft', 'mount', 'dirty', 'slice', 'blast', 'gross', 
  'alive', 'seize', 'badly', 'plate', 'aside', 'stare', 'cycle', 'flash', 
  'metre', 'chain', 'venue', 'label', 'crown', 'alter', 'stupid', 'inning', 
  'rhythm', 'enable', 'script', 'allied', 'guitar', 'reward', 'merely', 
  'admire', 'regime', 'racing', 'agenda', 'valley', 'marked', 'strict', 
  'weekly', 'jacket', 'bother', 'repair', 'silent', 'CD-ROM', 'ruling', 
  'empire', 'retain', 'regret', 'forest', 'beaten', 'native', 'poetry', 
  'immune', 'obtain', 'excess', 'assess', 'higher', 'height', 'heaven', 
  'marine', 'desert', 'pledge', 'tunnel', 'horror', 'fulfil', 'excuse', 
  'behalf', 'rating', 'killer', 'branch', 'temple', 'wicket', 'notion', 
  'select', 'rescue', 'freeze', 'output', 'pocket', 'rocket', 'vessel', 
  'plenty', 'remark', 'scream', 'symbol', 'sample', 'palace', 'mobile', 
  'tactic', 'honest', 'ballot', 'fabric', 'mirror', 'steady', 'nearby', 
  'resign', 'lovely', 'barrel', 'cruise', 'tissue', 'employ', 'stroke', 
  'sudden', 'client', 'luxury', 'junior', 'wealth', 'lesson', 'caring', 
  'invest', 'adjust', 'merger', 'tennis', 'urgent'
];
    var keywords3 = [
  'unlike', 'saving', 'partly', 'origin', 'smooth', 'wooden', 'afraid', 'margin', 
  'shadow', 'surely', 'golden', 'trader', 'permit', 'prompt', 'modest', 'priest', 
  'resort', 'plunge', 'honour', 'retail', 'cheese', 'potato', 'engage', 'unfair', 
  'viewer', 'racial', 'access', 'guilty', 'muscle', 'whilst', 'superb', 'actual', 
  'weaken', 'pepper', 'cancel', 'butter', 'remote', 'bitter', 'belief', 'gentle', 
  'barely', 'manner', 'medium', 'vision', 'clever', 'column', 'cinema', 'easily', 
  'remind', 'breast', 'signal', 'define', 'stream', 'assist', 'equity', 'holder', 
  'extent', 'banker', 'praise', 'retire', 'living', 'police', 'autumn', 'united', 
  'device', 'expand', 'silver', 'runner', 'abroad', 'govern', 'ethnic', 'borrow', 
  'belong', 'breath', 'bloody', 'fierce', 'proper', 'resume', 'rumour', 'dealer', 
  'fiscal', 'slight', 'tackle', 'mental', 'shaped', 'soccer', 'humour', 'throat', 
  'button', 'string', 'hunter', 'combat', 'titled', 'global', 'motion', 'salary', 
  'infect', 'expose', 'coffee', 'comedy', 'rarely', 'oppose', 'unable', 'pursue', 
  'phrase', 'relate', 'switch', 'latter', 'locked', 'advise', 'talent', 'inform', 
  'glance', 'planet', 'cotton', 'fairly', 'reckon', 'mostly', 'mutual', 'afford', 
  'castle', 'burden', 'resist', 'beside', 'clinic', 'beauty', 'singer', 'strain', 
  'broker', 'unique', 'winter', 'carbon', 'behave', 'mystery', 'crucial', 'formula', 
  'suicide', 'colonel', 'embassy', 'charity', 'predict', 'assault', 'instant', 
  'enhance', 'bargain', 'counsel', 'silence', 'passage', 'deposit', 'library', 
  'winning', 'interim', 'genuine', 'execute', 'premier', 'shortly', 'chamber', 
  'expense', 'maximum', 'penalty', 'meaning', 'whereas', 'elderly', 'pleased', 
  'intense', 'explore', 'speaker', 'tension', 'provoke', 'concept', 'married', 
  'mixture', 'vitamin', 'musical', 'unhappy', 'delight', 'dismiss', 'condemn', 
  'wedding', 'athlete', 'barrier', 'qualify', 'railway', 'veteran', 'sustain', 
  'o\'clock', 'revenue', 'premium', 'impress', 'triumph', 'violent', 'absence', 
  'cutting', 'sponsor', 'verdict', 'initial', 'Kremlin', 'venture', 'unknown', 
  'restore'
];
    var keywords4 = [
  'profile', 'opposed', 'senator', 'cooking', 'courage', 'antique', 'stretch', 
  'abandon', 'welfare', 'fortune', 'appoint', 'inquiry', 'written', 'witness', 
  'consist', 'scandal', 'squeeze', 'elegant', 'whisper', 'tourist', 'harbour', 
  'painful', 'faction', 'routine', 'pick-up', 'recruit', 'compete', 'liberty', 
  'opening', 'stadium', 'outcome', 'worried', 'nowhere', 'killing', 'visitor', 
  'fantasy', 'surplus', 'limited', 'founder', 'charter', 'symptom', 'monitor', 
  'capable', 'reading', 'monthly', 'banking', 'ancient', 'outline', 'command', 
  'healthy', 'breathe', 'anybody', 'funding', 'uniform', 'shelter', 'actress', 
  'missing', 'massive', 'subsidy', 'exhaust', 'dancing', 'adviser', 'curtain', 
  'dressed', 'convert', 'anxious', 'injured', 'acquire', 'therapy', 'traffic', 
  'gesture', 'offence', 'make-up', 'warning', 'somehow', 'unusual', 'arrange', 
  'install', 'made-up', 'digital', 'species', 'exactly', 'resolve', 'journey', 
  'gallery', 'protein', 'suspend', 'consult', 'retreat', 'lecture', 'circuit', 
  'minimum', 'live-in', 'curious', 'bedroom', 'counter', 'primary', 'cottage', 
  'backing', 'visible', 'assured', 'typical', 'passion', 'trigger', 'torture', 
  'ranking', 'inspect', 'justify', 'bearing', 'contest', 'observe', 'stomach', 
  'poverty', 'pension', 'surgery', 'excerpt', 'combine', 'besides', 'amateur', 
  'concede', 'anxiety', 'crystal', 'convict', 'amazing', 'capture', 'beneath', 
  'beating', 'hearing', 'segment', 'smoking', 'tragedy', 'emotion', 'illegal', 
  'testing', 'missile', 'licence', 'alcohol', 'chicken', 'exploit', 'flavour', 
  'auction', 'explode', 'recover', 'deserve', 'equally', 'comfort', 'extreme', 
  'arrival', 'proceed', 'reverse', 'cricket', 'illness', 'violate', 'nervous', 
  'fishing', 'concert', 'carrier', 'lesbian', 'fighter', 'compare', 'entitle', 
  'related', 'context', 'plastic', 'leather', 'servant', 'climate', 'register', 
  'exposure', 'merchant', 'casualty', 'pleasure', 'laughter', 'invasion', 
  'category', 'abortion', 'academic', 'alliance', 'whenever', 'capacity', 
  'superior', 'interior', 'decorate', 'moderate', 'persuade', 'valuable', 
  'medicine', 'motivate', 'concrete', 'absolute', 'delegate', 'clothing', 
  'reliable', 'takeover', 'platform', 'liberate', 'province', 'preserve', 
  'teaching', 'monetary'
];
    var keywords5 = [
  'dialogue', 'judgment', 'relative', 'romantic', 'diplomat', 'universe', 'anywhere', 
  'pregnant', 'treasury', 'striking', 'ambition', 'somewhat', 'identity', 'advanced', 
  'religion', 'apparent', 'sympathy', 'headline', 'planning', 'shortage', 'creative', 
  'approval', 'offering', 'portrait', 'negative', 'baseball', 'survival', 'deadline', 
  'accident', 'adequate', 'internal', 'Catholic', 'thorough', 'cultural', 'quantity', 
  'Security', 'overseas', 'civilian', 'enormous', 'midnight', 'priority', 'accurate', 
  'overcome', 'activist', 'dividend', 'properly', 'assembly', 'ordinary', 'birthday', 
  'discount', 'historic', 'operator', 'tendency', 'generate', 'delivery', 'attorney', 
  'generous', 'shopping', 'musician', 'designer', 'moreover', 'contrast', 'earnings', 
  'know-how', 'detailed', 'engineer', 'commerce', 'opponent', 'literary', 'innocent', 
  'exciting', 'ultimate', 'teenager', 'analysis', 'currency', 'ceremony', 'familiar', 
  'homeless', 'militant', 'location', 'entirely', 'flexible', 'advocate', 'confront', 
  'coverage', 'right-on', 'employer', 'existing', 'opposite', 'coloured', 'conclude', 
  'normally', 'suitable', 'sensible', 'recovery', 'disaster', 'numerous', 'friendly', 
  'pleasant', 'cautious', 'convince', 'forecast', 'training', 'electric', 'software', 
  'emphasis', 'bathroom', 'Algerian', 'graduate', 'peaceful', 'observer', 'somewhere', 
  'technical', 'exception', 'beginning', 'so-called', 'offensive', 'brilliant', 
  'inspector', 'basically', 'coalition', 'alongside', 'explosion', 'perfectly', 
  'solicitor', 'traveller', 'sensitive', 'organized', 'passenger', 'surrender', 
  'childhood', 'complaint', 'qualified', 'emphasize', 'gradually', 'component', 
  'electoral', 'selection', 'ceasefire', 'associate', 'landscape', 'accompany', 
  'confident', 'intention', 'terrorist', 'advertise', 'socialist', 'pregnancy', 
  'nightmare', 'integrate', 'departure', 'abandoned', 'seriously', 'reference', 
  'chocolate', 'victimize', 'expansion', 'strategic', 'procedure', 'disappear', 
  'immediate', 'boyfriend', 'publicity', 'precisely', 'personnel', 'stimulate', 
  'principal', 'promotion', 'surprised', 'hardliner', 'conscious', 'automatic', 
  'policeman', 'tradition', 'youngster', 'assistant', 'classical', 'cigarette', 
  'pollution', 'celebrate', 'frustrate', 'detective', 'editorial', 'neighbour', 
  'efficient', 'immigrant', 'virtually', 'undermine', 'amendment', 'infection', 
  'reluctant', 'organizer', 'furniture', 'entertain', 'privatize', 'volunteer', 
  'criticize', 'Secretary', 'permanent', 'sacrifice'
];
    var keywords6 = [
  'substance', 'practical', 'delighted', 'elsewhere', 'apartment', 'existence', 
  'transform', 'vegetable', 'breakfast', 'marketing', 'regulator', 'encounter', 
  'voluntary', 'remaining', 'ownership', 'prominent', 'guerrilla', 'economist', 
  'speculate', 'mechanism', 'broadcast', 'objective', 'worldwide', 'discovery', 
  'concerned', 'foreigner', 'desperate', 'ourselves', 'naturally', 'recording', 
  'overnight', 'household', 'provision', 'publisher', 'implement', 'highlight', 
  'kilometre', 'initially', 'long-time', 'temporary', 'convinced', 'emotional', 
  'corporate', 'gentleman', 'suspicion', 'extensive', 'spiritual', 'statistic', 
  'continent', 'reduction', 'Whitehall', 'satellite', 'commander', 'economics', 
  'eliminate', 'definitely', 'laboratory', 'occasional', 'literature', 'aggressive', 
  'convention', 'retirement', 'competitor', 'permission', 'collective', 'right-wing', 
  'optimistic', 'background', 'transition', 'unexpected', 'reasonable', 'helicopter', 
  'previously', 'enterprise', 'concession', 'short-term', 'enthusiasm', 'scientific', 
  'altogether', 'contribute', 'initiative', 'membership', 'diplomatic', 'vulnerable', 
  'suggestion', 'everywhere', 'allegation', 'definition', 'strengthen', 'subsequent'
];
    var keywords7 = [
  'inevitable', 'acceptable', 'sufficient', 'deliberate', 'conviction', 'relatively',
  'resistance', 'originally', 'substitute', 'assessment', 'reputation', 'atmosphere',
  'presidency', 'illustrate', 'withdrawal', 'conclusion', 'invitation', 'incredible',
  'exhibition', 'associated', 'publishing', 'referendum', 'friendship', 'expression',
  'historical', 'attractive', 'delegation', 'compromise', 'federation', 'depression',
  'determined', 'additional', 'widespread', 'remarkable', 'specialize', 'assumption',
  'regulation', 'connection', 'corruption', 'specialist', 'ambassador', 'assistance',
  'surprising', 'importance', 'indication', 'ingredient', 'comparison', 'proportion',
  'homosexual', 'presumably', 'percentage', 'appreciate', 'afterwards', 'instrument',
  'revolution', 'experiment', 'equivalent', 'foundation', 'co-operate', 'consistent',
  'electronic', 'tremendous', 'consultant', 'tournament', 'philosophy', 'discipline',
  'impressive', 'girlfriend', 'well-known', 'profession', 'occupation', 'impression',
  'ultimately', 'personally', 'employment', 'destruction', 'resignation', 'partnership',
  'nationalist', 'explanation', 'manufacture', 'personality', 'comfortable', 'competitive',
  'recognition', 'agriculture', 'threatening', 'requirement', 'replacement', 'commentator',
  'implication', 'complicated', 'supermarket', 'expectation', 'shareholder', 'concentrate',
  'educational', 'appointment', 'substantial', 'temperature', 'necessarily', 'acquisition',
  'immigration', 'interesting', 'communicate', 'examination', 'preparation', 'achievement',
  'celebration', 'fundamental'
];
    var keywords8 = [
  'Restoration', 'involvement', 'underground', 'participate', 'perspective', 'considering',
  'transaction', 'essentially', 'legislation', 'counterpart', 'demonstrate', 'instruction',
  'acknowledge', 'electricity', 'businessman', 'declaration', 'consequence', 'imagination',
  'intelligent', 'combination', 'description', 'countryside', 'outstanding', 'application',
  'anniversary', 'improvement', 'controversy', 'spectacular', 'publication', 'appropriate',
  'engineering', 'restriction', 'prosecution', 'corporation', 'arrangement', 'construction',
  'conversation', 'illustration', 'unidentified', 'contemporary', 'demonstrator', 'broadcasting',
  'intellectual', 'contribution', 'circumstance', 'headquarters', 'distribution', 'announcement',
  'agricultural', 'intelligence', 'constitution', 'disappointed', 'conventional', 'compensation',
  'photographer', 'intervention', 'unemployment', 'specifically', 'overwhelming', 'manufacturer',
  'nevertheless', 'communication', 'sophisticated', 'consideration', 'understanding',
  'demonstration', 'unfortunately', 'comprehensive', 'establishment', 'revolutionary',
  'consciousness', 'accommodation', 'parliamentary', 'controversial', 'psychological',
  'extraordinary', 'entertainment', 'confrontation', 'concentration', 'characteristic',
  'recommendation', 'constitutional', 'industrialized', 'secretary-general'
];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 将所有关键词数组合并为一个数组
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 排除已掌握的关键词
    allKeywords = allKeywords.filter(function(keyword) {
        return !masteredKeywords.includes(keyword);
    });

    // 直接返回蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase(); // 将关键词转换为小写
            var wordFormsRegex = new RegExp('\\b(' +
                wordText + '|' +
                wordText + 's?' + '|' +
                wordText.replace(/y$/, 'i') + 'es?' + '|' +
                wordText + 'ed' + '|' +
                wordText + 'ing' + '|' +
                wordText + 'd' + '|' +
                wordText + 'er' + '|' +
                wordText + 'est' + '|' +
                wordText + 'ly' + '|' +
                wordText.replace(/y$/, 'ily') + '|' +
                wordText.replace(/ic$/, 'ically') + '|' +
                wordText.replace(/le$/, 'ly') +
            ')\\b', 'gi'); // 构建词形变化的正则表达式，忽略大小写

            // 替换匹配的关键词及词形变化为蓝色
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}">${match}</span>`; // 替换为带有蓝色的 span
            });
        }

        // 只有当文本发生改变时才进行替换
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text; // 使用 innerHTML 来插入带有颜色的 span
            parent.replaceChild(span, node); // 替换原始文本节点
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

// 排除已掌握数组版

// ==UserScript==
// @name         蓝色（支持词形变化）-排除已掌握
// @namespace    https://greasyfork.org/zh-TW
// @version      5.0
// @description  给网页关键词及其词形变化改变成蓝色，完整匹配
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义十个关键词数组
  var keywords1 = [
  'mate', 'raid', 'hint', 'pool', 'neat', 'done', 'fold', 'spur', 'cope', 
  'tone', 'pile', 'gift', 'amid', 'roof', 'peak', 'ease', 'crop', 'edit', 
  'tool', 'trap', 'hunt', 'poem', 'auto', 'stem', 'myth', 'task', 'sand', 
  'tide', 'heal', 'pipe', 'rose', 'ruin', 'peer', 'echo', 'gate', 'tiny', 
  'rare', 'pour', 'rush', 'busy', 'vice', 'riot', 'golf', 'jail', 'reel', 
  'pump', 'hire', 'wake', 'leaf', 'bell', 'part', 'root', 'mild', 'fool', 
  'soul', 'harm', 'sick', 'cure', 'Wall', 'salt', 'bake', 'hero', 'vast', 
  'path', 'chat', 'tune', 'dust', 'luck', 'pale', 'holy', 'crew', 'tall', 
  'live', 'dare', 'kiss', 'till', 'plot', 'shut', 'fate', 'stir', 'wrap', 
  'beer', 'lane', 'chip', 'coal', 'user', 'wash', 'hate', 'gene', 'mail', 
  'aged', 'rape', 'slim', 'bone', 'vol.', 'thin', 'mask', 'cake', 'rank', 
  'leap', 'swim', 'ring', 'bare', 'mess', 'boom', 'jury', 'rear', 'mood', 
  'quit', 'NATO', 'lock', 'chop', 'grip', 'drum', 'code', 'lend', 'self', 
  'folk', 'flee', 'pure', 'pact', 'boot', 'twin', 'shoe', 'load', 'leak', 
  'dear', 'soil', 'hill', 'wire', 'boil', 'belt', 'halt', 'lama', 'calm', 
  'dump', 'bend', 'tail', 'text', 'ibid', 'hook', 'sigh', 'lost', 'poet', 
  'moon', 'pace', 'gang', 'iron', 'core', 'knee', 'snow', 'Nazi', 'joke', 
  'spin', 'onto', 'snap', 'bass', 'hide', 'rely', 'meal', 'keen', 'fine', 
  'lake', 'mill', 'rice', 'dish', 'news', 'bean', 'sack', 'lean', 'rent', 
  'bore', 'bowl', 'lens', 'cave', 'tank', 'mere', 'inch', 'zone', 'rail', 
  'sink', 'rage', 'nose', 'acid', 'cite', 'deck', 'pose', 'meat', 'evil', 
  'mind', 'hall', 'jazz', 'sake', 'blow', 'gear', 'bury', 'flag', 'tale', 
  'loud', 'grab', 'bath', 'sail', 'port', 'coat', 'fare', 'wage', 'whip', 
  'glad', 'neck', 'bike', 'milk', 'seek', 'wise', 'pill', 'wipe', 'vary', 
  'tube', 'acre', 'fade', 'pole', 'drag', 'steam', 'yours', 'steel', 'drift', 
  'solve', 'apple', 'noted', 'trail', 'one\'s', 'Latin', 'apart', 'spray', 
  'angry', 'equal', 'upper', 'being', 'sugar', 'storm', 'brush', 'strip', 
  'grain', 'cough', 'habit', 'diary', 'imply', 'anger', 'alarm', 'punch', 
  'truly', 'metal', 'brand', 'point', 'trend', 'White', 'sauce', 'stamp', 
  'tight', 'spell', 'hello', 'sweep', 'flood', 'trick', 'rough', 'swing', 
  'chaos', 'juice', 'burst', 'plain', 'shore', 'boost', 'cheer', 'pause', 
  'miner', 'phase', 'eager', 'buyer', 'tower', 'medal', 'proof', 'drama', 
  'virus', 'await', 'fraud', 'spark', 'actor', 'inner', 'Bible', 'nurse', 
  'frame', 'yacht', 'State', 'worse', 'thick', 'weigh', 'prior', 'lover', 
  'grass', 'renew', 'stock'
];
    var keywords2 = [
  'cable', 'shift', 'penny', 'bound', 'ocean', 'clock', 'opera', 'solid', 
  'empty', 'steal', 'ought', 'smash', 'smell', 'local', 'spite', 'shame', 
  'crazy', 'proud', 'relax', 'index', 'grave', 'funny', 'yield', 'exile', 
  'squad', 'fence', 'cloud', 'newly', 'mixed', 'draft', 'angle', 'mayor', 
  'bunch', 'noise', 'error', 'awful', 'nerve', 'blind', 'pilot', 'pitch', 
  'giant', 'wheel', 'layer', 'faith', 'knock', 'debut', 'lease', 'moral', 
  'fixed', 'prime', 'panic', 'lucky', 'beach', 'found', 'rally', 'magic', 
  'worst', 'shirt', 'smart', 'saint', 'tired', 'lobby', 'theme', 'watch', 
  'ideal', 'pride', 'rider', 'twist', 'unity', 'react', 'chase', 'naval', 
  'minor', 'drain', 'truck', 'shade', 'arise', 'vital', 'trace', 'tooth', 
  'fault', 'alert', 'grade', 'sheet', 'brave', 'panel', 'upset', 'cease', 
  'enemy', 'pupil', 'slide', 'shout', 'lower', 'loose', 'spare', 'rugby', 
  'float', 'birth', 'given', 'breed', 'forth', 'light', 'urban', 'clash', 
  'depth', 'fleet', 'super', 'chest', 'sweet', 'climb', 'rural', 'bread', 
  'knife', 'chart', 'craft', 'mount', 'dirty', 'slice', 'blast', 'gross', 
  'alive', 'seize', 'badly', 'plate', 'aside', 'stare', 'cycle', 'flash', 
  'metre', 'chain', 'venue', 'label', 'crown', 'alter', 'stupid', 'inning', 
  'rhythm', 'enable', 'script', 'allied', 'guitar', 'reward', 'merely', 
  'admire', 'regime', 'racing', 'agenda', 'valley', 'marked', 'strict', 
  'weekly', 'jacket', 'bother', 'repair', 'silent', 'CD-ROM', 'ruling', 
  'empire', 'retain', 'regret', 'forest', 'beaten', 'native', 'poetry', 
  'immune', 'obtain', 'excess', 'assess', 'higher', 'height', 'heaven', 
  'marine', 'desert', 'pledge', 'tunnel', 'horror', 'fulfil', 'excuse', 
  'behalf', 'rating', 'killer', 'branch', 'temple', 'wicket', 'notion', 
  'select', 'rescue', 'freeze', 'output', 'pocket', 'rocket', 'vessel', 
  'plenty', 'remark', 'scream', 'symbol', 'sample', 'palace', 'mobile', 
  'tactic', 'honest', 'ballot', 'fabric', 'mirror', 'steady', 'nearby', 
  'resign', 'lovely', 'barrel', 'cruise', 'tissue', 'employ', 'stroke', 
  'sudden', 'client', 'luxury', 'junior', 'wealth', 'lesson', 'caring', 
  'invest', 'adjust', 'merger', 'tennis', 'urgent'
];
    var keywords3 = [
  'unlike', 'saving', 'partly', 'origin', 'smooth', 'wooden', 'afraid', 'margin', 
  'shadow', 'surely', 'golden', 'trader', 'permit', 'prompt', 'modest', 'priest', 
  'resort', 'plunge', 'honour', 'retail', 'cheese', 'potato', 'engage', 'unfair', 
  'viewer', 'racial', 'access', 'guilty', 'muscle', 'whilst', 'superb', 'actual', 
  'weaken', 'pepper', 'cancel', 'butter', 'remote', 'bitter', 'belief', 'gentle', 
  'barely', 'manner', 'medium', 'vision', 'clever', 'column', 'cinema', 'easily', 
  'remind', 'breast', 'signal', 'define', 'stream', 'assist', 'equity', 'holder', 
  'extent', 'banker', 'praise', 'retire', 'living', 'police', 'autumn', 'united', 
  'device', 'expand', 'silver', 'runner', 'abroad', 'govern', 'ethnic', 'borrow', 
  'belong', 'breath', 'bloody', 'fierce', 'proper', 'resume', 'rumour', 'dealer', 
  'fiscal', 'slight', 'tackle', 'mental', 'shaped', 'soccer', 'humour', 'throat', 
  'button', 'string', 'hunter', 'combat', 'titled', 'global', 'motion', 'salary', 
  'infect', 'expose', 'coffee', 'comedy', 'rarely', 'oppose', 'unable', 'pursue', 
  'phrase', 'relate', 'switch', 'latter', 'locked', 'advise', 'talent', 'inform', 
  'glance', 'planet', 'cotton', 'fairly', 'reckon', 'mostly', 'mutual', 'afford', 
  'castle', 'burden', 'resist', 'beside', 'clinic', 'beauty', 'singer', 'strain', 
  'broker', 'unique', 'winter', 'carbon', 'behave', 'mystery', 'crucial', 'formula', 
  'suicide', 'colonel', 'embassy', 'charity', 'predict', 'assault', 'instant', 
  'enhance', 'bargain', 'counsel', 'silence', 'passage', 'deposit', 'library', 
  'winning', 'interim', 'genuine', 'execute', 'premier', 'shortly', 'chamber', 
  'expense', 'maximum', 'penalty', 'meaning', 'whereas', 'elderly', 'pleased', 
  'intense', 'explore', 'speaker', 'tension', 'provoke', 'concept', 'married', 
  'mixture', 'vitamin', 'musical', 'unhappy', 'delight', 'dismiss', 'condemn', 
  'wedding', 'athlete', 'barrier', 'qualify', 'railway', 'veteran', 'sustain', 
  'o\'clock', 'revenue', 'premium', 'impress', 'triumph', 'violent', 'absence', 
  'cutting', 'sponsor', 'verdict', 'initial', 'Kremlin', 'venture', 'unknown', 
  'restore'
];
    var keywords4 = [
  'profile', 'opposed', 'senator', 'cooking', 'courage', 'antique', 'stretch', 
  'abandon', 'welfare', 'fortune', 'appoint', 'inquiry', 'written', 'witness', 
  'consist', 'scandal', 'squeeze', 'elegant', 'whisper', 'tourist', 'harbour', 
  'painful', 'faction', 'routine', 'pick-up', 'recruit', 'compete', 'liberty', 
  'opening', 'stadium', 'outcome', 'worried', 'nowhere', 'killing', 'visitor', 
  'fantasy', 'surplus', 'limited', 'founder', 'charter', 'symptom', 'monitor', 
  'capable', 'reading', 'monthly', 'banking', 'ancient', 'outline', 'command', 
  'healthy', 'breathe', 'anybody', 'funding', 'uniform', 'shelter', 'actress', 
  'missing', 'massive', 'subsidy', 'exhaust', 'dancing', 'adviser', 'curtain', 
  'dressed', 'convert', 'anxious', 'injured', 'acquire', 'therapy', 'traffic', 
  'gesture', 'offence', 'make-up', 'warning', 'somehow', 'unusual', 'arrange', 
  'install', 'made-up', 'digital', 'species', 'exactly', 'resolve', 'journey', 
  'gallery', 'protein', 'suspend', 'consult', 'retreat', 'lecture', 'circuit', 
  'minimum', 'live-in', 'curious', 'bedroom', 'counter', 'primary', 'cottage', 
  'backing', 'visible', 'assured', 'typical', 'passion', 'trigger', 'torture', 
  'ranking', 'inspect', 'justify', 'bearing', 'contest', 'observe', 'stomach', 
  'poverty', 'pension', 'surgery', 'excerpt', 'combine', 'besides', 'amateur', 
  'concede', 'anxiety', 'crystal', 'convict', 'amazing', 'capture', 'beneath', 
  'beating', 'hearing', 'segment', 'smoking', 'tragedy', 'emotion', 'illegal', 
  'testing', 'missile', 'licence', 'alcohol', 'chicken', 'exploit', 'flavour', 
  'auction', 'explode', 'recover', 'deserve', 'equally', 'comfort', 'extreme', 
  'arrival', 'proceed', 'reverse', 'cricket', 'illness', 'violate', 'nervous', 
  'fishing', 'concert', 'carrier', 'lesbian', 'fighter', 'compare', 'entitle', 
  'related', 'context', 'plastic', 'leather', 'servant', 'climate', 'register', 
  'exposure', 'merchant', 'casualty', 'pleasure', 'laughter', 'invasion', 
  'category', 'abortion', 'academic', 'alliance', 'whenever', 'capacity', 
  'superior', 'interior', 'decorate', 'moderate', 'persuade', 'valuable', 
  'medicine', 'motivate', 'concrete', 'absolute', 'delegate', 'clothing', 
  'reliable', 'takeover', 'platform', 'liberate', 'province', 'preserve', 
  'teaching', 'monetary'
];
    var keywords5 = [
  'dialogue', 'judgment', 'relative', 'romantic', 'diplomat', 'universe', 'anywhere', 
  'pregnant', 'treasury', 'striking', 'ambition', 'somewhat', 'identity', 'advanced', 
  'religion', 'apparent', 'sympathy', 'headline', 'planning', 'shortage', 'creative', 
  'approval', 'offering', 'portrait', 'negative', 'baseball', 'survival', 'deadline', 
  'accident', 'adequate', 'internal', 'Catholic', 'thorough', 'cultural', 'quantity', 
  'Security', 'overseas', 'civilian', 'enormous', 'midnight', 'priority', 'accurate', 
  'overcome', 'activist', 'dividend', 'properly', 'assembly', 'ordinary', 'birthday', 
  'discount', 'historic', 'operator', 'tendency', 'generate', 'delivery', 'attorney', 
  'generous', 'shopping', 'musician', 'designer', 'moreover', 'contrast', 'earnings', 
  'know-how', 'detailed', 'engineer', 'commerce', 'opponent', 'literary', 'innocent', 
  'exciting', 'ultimate', 'teenager', 'analysis', 'currency', 'ceremony', 'familiar', 
  'homeless', 'militant', 'location', 'entirely', 'flexible', 'advocate', 'confront', 
  'coverage', 'right-on', 'employer', 'existing', 'opposite', 'coloured', 'conclude', 
  'normally', 'suitable', 'sensible', 'recovery', 'disaster', 'numerous', 'friendly', 
  'pleasant', 'cautious', 'convince', 'forecast', 'training', 'electric', 'software', 
  'emphasis', 'bathroom', 'Algerian', 'graduate', 'peaceful', 'observer', 'somewhere', 
  'technical', 'exception', 'beginning', 'so-called', 'offensive', 'brilliant', 
  'inspector', 'basically', 'coalition', 'alongside', 'explosion', 'perfectly', 
  'solicitor', 'traveller', 'sensitive', 'organized', 'passenger', 'surrender', 
  'childhood', 'complaint', 'qualified', 'emphasize', 'gradually', 'component', 
  'electoral', 'selection', 'ceasefire', 'associate', 'landscape', 'accompany', 
  'confident', 'intention', 'terrorist', 'advertise', 'socialist', 'pregnancy', 
  'nightmare', 'integrate', 'departure', 'abandoned', 'seriously', 'reference', 
  'chocolate', 'victimize', 'expansion', 'strategic', 'procedure', 'disappear', 
  'immediate', 'boyfriend', 'publicity', 'precisely', 'personnel', 'stimulate', 
  'principal', 'promotion', 'surprised', 'hardliner', 'conscious', 'automatic', 
  'policeman', 'tradition', 'youngster', 'assistant', 'classical', 'cigarette', 
  'pollution', 'celebrate', 'frustrate', 'detective', 'editorial', 'neighbour', 
  'efficient', 'immigrant', 'virtually', 'undermine', 'amendment', 'infection', 
  'reluctant', 'organizer', 'furniture', 'entertain', 'privatize', 'volunteer', 
  'criticize', 'Secretary', 'permanent', 'sacrifice'
];
    var keywords6 = [
  'substance', 'practical', 'delighted', 'elsewhere', 'apartment', 'existence', 
  'transform', 'vegetable', 'breakfast', 'marketing', 'regulator', 'encounter', 
  'voluntary', 'remaining', 'ownership', 'prominent', 'guerrilla', 'economist', 
  'speculate', 'mechanism', 'broadcast', 'objective', 'worldwide', 'discovery', 
  'concerned', 'foreigner', 'desperate', 'ourselves', 'naturally', 'recording', 
  'overnight', 'household', 'provision', 'publisher', 'implement', 'highlight', 
  'kilometre', 'initially', 'long-time', 'temporary', 'convinced', 'emotional', 
  'corporate', 'gentleman', 'suspicion', 'extensive', 'spiritual', 'statistic', 
  'continent', 'reduction', 'Whitehall', 'satellite', 'commander', 'economics', 
  'eliminate', 'definitely', 'laboratory', 'occasional', 'literature', 'aggressive', 
  'convention', 'retirement', 'competitor', 'permission', 'collective', 'right-wing', 
  'optimistic', 'background', 'transition', 'unexpected', 'reasonable', 'helicopter', 
  'previously', 'enterprise', 'concession', 'short-term', 'enthusiasm', 'scientific', 
  'altogether', 'contribute', 'initiative', 'membership', 'diplomatic', 'vulnerable', 
  'suggestion', 'everywhere', 'allegation', 'definition', 'strengthen', 'subsequent'
];
    var keywords7 = [
  'inevitable', 'acceptable', 'sufficient', 'deliberate', 'conviction', 'relatively',
  'resistance', 'originally', 'substitute', 'assessment', 'reputation', 'atmosphere',
  'presidency', 'illustrate', 'withdrawal', 'conclusion', 'invitation', 'incredible',
  'exhibition', 'associated', 'publishing', 'referendum', 'friendship', 'expression',
  'historical', 'attractive', 'delegation', 'compromise', 'federation', 'depression',
  'determined', 'additional', 'widespread', 'remarkable', 'specialize', 'assumption',
  'regulation', 'connection', 'corruption', 'specialist', 'ambassador', 'assistance',
  'surprising', 'importance', 'indication', 'ingredient', 'comparison', 'proportion',
  'homosexual', 'presumably', 'percentage', 'appreciate', 'afterwards', 'instrument',
  'revolution', 'experiment', 'equivalent', 'foundation', 'co-operate', 'consistent',
  'electronic', 'tremendous', 'consultant', 'tournament', 'philosophy', 'discipline',
  'impressive', 'girlfriend', 'well-known', 'profession', 'occupation', 'impression',
  'ultimately', 'personally', 'employment', 'destruction', 'resignation', 'partnership',
  'nationalist', 'explanation', 'manufacture', 'personality', 'comfortable', 'competitive',
  'recognition', 'agriculture', 'threatening', 'requirement', 'replacement', 'commentator',
  'implication', 'complicated', 'supermarket', 'expectation', 'shareholder', 'concentrate',
  'educational', 'appointment', 'substantial', 'temperature', 'necessarily', 'acquisition',
  'immigration', 'interesting', 'communicate', 'examination', 'preparation', 'achievement',
  'celebration', 'fundamental'
];
    var keywords8 = [
  'Restoration', 'involvement', 'underground', 'participate', 'perspective', 'considering',
  'transaction', 'essentially', 'legislation', 'counterpart', 'demonstrate', 'instruction',
  'acknowledge', 'electricity', 'businessman', 'declaration', 'consequence', 'imagination',
  'intelligent', 'combination', 'description', 'countryside', 'outstanding', 'application',
  'anniversary', 'improvement', 'controversy', 'spectacular', 'publication', 'appropriate',
  'engineering', 'restriction', 'prosecution', 'corporation', 'arrangement', 'construction',
  'conversation', 'illustration', 'unidentified', 'contemporary', 'demonstrator', 'broadcasting',
  'intellectual', 'contribution', 'circumstance', 'headquarters', 'distribution', 'announcement',
  'agricultural', 'intelligence', 'constitution', 'disappointed', 'conventional', 'compensation',
  'photographer', 'intervention', 'unemployment', 'specifically', 'overwhelming', 'manufacturer',
  'nevertheless', 'communication', 'sophisticated', 'consideration', 'understanding',
  'demonstration', 'unfortunately', 'comprehensive', 'establishment', 'revolutionary',
  'consciousness', 'accommodation', 'parliamentary', 'controversial', 'psychological',
  'extraordinary', 'entertainment', 'confrontation', 'concentration', 'characteristic',
  'recommendation', 'constitutional', 'industrialized', 'secretary-general'
];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 将所有关键词数组合并为一个数组
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 定义已掌握的关键词数组
    var masteredKeywords = ['run', 'write', 'study', 'read'];

    // 排除已掌握的关键词
    allKeywords = allKeywords.filter(function(keyword) {
        return !masteredKeywords.includes(keyword);
    });

    // 直接返回蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase(); // 将关键词转换为小写
            var wordFormsRegex = new RegExp('\\b(' +
                wordText + '|' +
                wordText + 's?' + '|' +
                wordText.replace(/y$/, 'i') + 'es?' + '|' +
                wordText + 'ed' + '|' +
                wordText + 'ing' + '|' +
                wordText + 'd' + '|' +
                wordText + 'er' + '|' +
                wordText + 'est' + '|' +
                wordText + 'ly' + '|' +
                wordText.replace(/y$/, 'ily') + '|' +
                wordText.replace(/ic$/, 'ically') + '|' +
                wordText.replace(/le$/, 'ly') +
            ')\\b', 'gi'); // 构建词形变化的正则表达式，忽略大小写

            // 替换匹配的关键词及词形变化为蓝色
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}">${match}</span>`; // 替换为带有蓝色的 span
            });
        }

        // 只有当文本发生改变时才进行替换
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text; // 使用 innerHTML 来插入带有颜色的 span
            parent.replaceChild(span, node); // 替换原始文本节点
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


// 可取消高亮版

// ==UserScript==
// @name         蓝色（支持词形变化） - 可取消高亮
// @namespace    https://greasyfork.org/zh-TW
// @version      3.1
// @description  给网页关键词及其词形变化改变成蓝色，并可永久取消某些单词的高亮
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义关键词数组
        var keywords1 = [
  'mate', 'raid', 'hint', 'pool', 'neat', 'done', 'fold', 'spur', 'cope', 
  'tone', 'pile', 'gift', 'amid', 'roof', 'peak', 'ease', 'crop', 'edit', 
  'tool', 'trap', 'hunt', 'poem', 'auto', 'stem', 'myth', 'task', 'sand', 
  'tide', 'heal', 'pipe', 'rose', 'ruin', 'peer', 'echo', 'gate', 'tiny', 
  'rare', 'pour', 'rush', 'busy', 'vice', 'riot', 'golf', 'jail', 'reel', 
  'pump', 'hire', 'wake', 'leaf', 'bell', 'part', 'root', 'mild', 'fool', 
  'soul', 'harm', 'sick', 'cure', 'Wall', 'salt', 'bake', 'hero', 'vast', 
  'path', 'chat', 'tune', 'dust', 'luck', 'pale', 'holy', 'crew', 'tall', 
  'live', 'dare', 'kiss', 'till', 'plot', 'shut', 'fate', 'stir', 'wrap', 
  'beer', 'lane', 'chip', 'coal', 'user', 'wash', 'hate', 'gene', 'mail', 
  'aged', 'rape', 'slim', 'bone', 'vol.', 'thin', 'mask', 'cake', 'rank', 
  'leap', 'swim', 'ring', 'bare', 'mess', 'boom', 'jury', 'rear', 'mood', 
  'quit', 'NATO', 'lock', 'chop', 'grip', 'drum', 'code', 'lend', 'self', 
  'folk', 'flee', 'pure', 'pact', 'boot', 'twin', 'shoe', 'load', 'leak', 
  'dear', 'soil', 'hill', 'wire', 'boil', 'belt', 'halt', 'lama', 'calm', 
  'dump', 'bend', 'tail', 'text', 'ibid', 'hook', 'sigh', 'lost', 'poet', 
  'moon', 'pace', 'gang', 'iron', 'core', 'knee', 'snow', 'Nazi', 'joke', 
  'spin', 'onto', 'snap', 'bass', 'hide', 'rely', 'meal', 'keen', 'fine', 
  'lake', 'mill', 'rice', 'dish', 'news', 'bean', 'sack', 'lean', 'rent', 
  'bore', 'bowl', 'lens', 'cave', 'tank', 'mere', 'inch', 'zone', 'rail', 
  'sink', 'rage', 'nose', 'acid', 'cite', 'deck', 'pose', 'meat', 'evil', 
  'mind', 'hall', 'jazz', 'sake', 'blow', 'gear', 'bury', 'flag', 'tale', 
  'loud', 'grab', 'bath', 'sail', 'port', 'coat', 'fare', 'wage', 'whip', 
  'glad', 'neck', 'bike', 'milk', 'seek', 'wise', 'pill', 'wipe', 'vary', 
  'tube', 'acre', 'fade', 'pole', 'drag', 'steam', 'yours', 'steel', 'drift', 
  'solve', 'apple', 'noted', 'trail', 'one\'s', 'Latin', 'apart', 'spray', 
  'angry', 'equal', 'upper', 'being', 'sugar', 'storm', 'brush', 'strip', 
  'grain', 'cough', 'habit', 'diary', 'imply', 'anger', 'alarm', 'punch', 
  'truly', 'metal', 'brand', 'point', 'trend', 'White', 'sauce', 'stamp', 
  'tight', 'spell', 'hello', 'sweep', 'flood', 'trick', 'rough', 'swing', 
  'chaos', 'juice', 'burst', 'plain', 'shore', 'boost', 'cheer', 'pause', 
  'miner', 'phase', 'eager', 'buyer', 'tower', 'medal', 'proof', 'drama', 
  'virus', 'await', 'fraud', 'spark', 'actor', 'inner', 'Bible', 'nurse', 
  'frame', 'yacht', 'State', 'worse', 'thick', 'weigh', 'prior', 'lover', 
  'grass', 'renew', 'stock'
];
    var keywords2 = [
  'cable', 'shift', 'penny', 'bound', 'ocean', 'clock', 'opera', 'solid', 
  'empty', 'steal', 'ought', 'smash', 'smell', 'local', 'spite', 'shame', 
  'crazy', 'proud', 'relax', 'index', 'grave', 'funny', 'yield', 'exile', 
  'squad', 'fence', 'cloud', 'newly', 'mixed', 'draft', 'angle', 'mayor', 
  'bunch', 'noise', 'error', 'awful', 'nerve', 'blind', 'pilot', 'pitch', 
  'giant', 'wheel', 'layer', 'faith', 'knock', 'debut', 'lease', 'moral', 
  'fixed', 'prime', 'panic', 'lucky', 'beach', 'found', 'rally', 'magic', 
  'worst', 'shirt', 'smart', 'saint', 'tired', 'lobby', 'theme', 'watch', 
  'ideal', 'pride', 'rider', 'twist', 'unity', 'react', 'chase', 'naval', 
  'minor', 'drain', 'truck', 'shade', 'arise', 'vital', 'trace', 'tooth', 
  'fault', 'alert', 'grade', 'sheet', 'brave', 'panel', 'upset', 'cease', 
  'enemy', 'pupil', 'slide', 'shout', 'lower', 'loose', 'spare', 'rugby', 
  'float', 'birth', 'given', 'breed', 'forth', 'light', 'urban', 'clash', 
  'depth', 'fleet', 'super', 'chest', 'sweet', 'climb', 'rural', 'bread', 
  'knife', 'chart', 'craft', 'mount', 'dirty', 'slice', 'blast', 'gross', 
  'alive', 'seize', 'badly', 'plate', 'aside', 'stare', 'cycle', 'flash', 
  'metre', 'chain', 'venue', 'label', 'crown', 'alter', 'stupid', 'inning', 
  'rhythm', 'enable', 'script', 'allied', 'guitar', 'reward', 'merely', 
  'admire', 'regime', 'racing', 'agenda', 'valley', 'marked', 'strict', 
  'weekly', 'jacket', 'bother', 'repair', 'silent', 'CD-ROM', 'ruling', 
  'empire', 'retain', 'regret', 'forest', 'beaten', 'native', 'poetry', 
  'immune', 'obtain', 'excess', 'assess', 'higher', 'height', 'heaven', 
  'marine', 'desert', 'pledge', 'tunnel', 'horror', 'fulfil', 'excuse', 
  'behalf', 'rating', 'killer', 'branch', 'temple', 'wicket', 'notion', 
  'select', 'rescue', 'freeze', 'output', 'pocket', 'rocket', 'vessel', 
  'plenty', 'remark', 'scream', 'symbol', 'sample', 'palace', 'mobile', 
  'tactic', 'honest', 'ballot', 'fabric', 'mirror', 'steady', 'nearby', 
  'resign', 'lovely', 'barrel', 'cruise', 'tissue', 'employ', 'stroke', 
  'sudden', 'client', 'luxury', 'junior', 'wealth', 'lesson', 'caring', 
  'invest', 'adjust', 'merger', 'tennis', 'urgent'
];
    var keywords3 = [
  'unlike', 'saving', 'partly', 'origin', 'smooth', 'wooden', 'afraid', 'margin', 
  'shadow', 'surely', 'golden', 'trader', 'permit', 'prompt', 'modest', 'priest', 
  'resort', 'plunge', 'honour', 'retail', 'cheese', 'potato', 'engage', 'unfair', 
  'viewer', 'racial', 'access', 'guilty', 'muscle', 'whilst', 'superb', 'actual', 
  'weaken', 'pepper', 'cancel', 'butter', 'remote', 'bitter', 'belief', 'gentle', 
  'barely', 'manner', 'medium', 'vision', 'clever', 'column', 'cinema', 'easily', 
  'remind', 'breast', 'signal', 'define', 'stream', 'assist', 'equity', 'holder', 
  'extent', 'banker', 'praise', 'retire', 'living', 'police', 'autumn', 'united', 
  'device', 'expand', 'silver', 'runner', 'abroad', 'govern', 'ethnic', 'borrow', 
  'belong', 'breath', 'bloody', 'fierce', 'proper', 'resume', 'rumour', 'dealer', 
  'fiscal', 'slight', 'tackle', 'mental', 'shaped', 'soccer', 'humour', 'throat', 
  'button', 'string', 'hunter', 'combat', 'titled', 'global', 'motion', 'salary', 
  'infect', 'expose', 'coffee', 'comedy', 'rarely', 'oppose', 'unable', 'pursue', 
  'phrase', 'relate', 'switch', 'latter', 'locked', 'advise', 'talent', 'inform', 
  'glance', 'planet', 'cotton', 'fairly', 'reckon', 'mostly', 'mutual', 'afford', 
  'castle', 'burden', 'resist', 'beside', 'clinic', 'beauty', 'singer', 'strain', 
  'broker', 'unique', 'winter', 'carbon', 'behave', 'mystery', 'crucial', 'formula', 
  'suicide', 'colonel', 'embassy', 'charity', 'predict', 'assault', 'instant', 
  'enhance', 'bargain', 'counsel', 'silence', 'passage', 'deposit', 'library', 
  'winning', 'interim', 'genuine', 'execute', 'premier', 'shortly', 'chamber', 
  'expense', 'maximum', 'penalty', 'meaning', 'whereas', 'elderly', 'pleased', 
  'intense', 'explore', 'speaker', 'tension', 'provoke', 'concept', 'married', 
  'mixture', 'vitamin', 'musical', 'unhappy', 'delight', 'dismiss', 'condemn', 
  'wedding', 'athlete', 'barrier', 'qualify', 'railway', 'veteran', 'sustain', 
  'o\'clock', 'revenue', 'premium', 'impress', 'triumph', 'violent', 'absence', 
  'cutting', 'sponsor', 'verdict', 'initial', 'Kremlin', 'venture', 'unknown', 
  'restore'
];
    var keywords4 = [
  'profile', 'opposed', 'senator', 'cooking', 'courage', 'antique', 'stretch', 
  'abandon', 'welfare', 'fortune', 'appoint', 'inquiry', 'written', 'witness', 
  'consist', 'scandal', 'squeeze', 'elegant', 'whisper', 'tourist', 'harbour', 
  'painful', 'faction', 'routine', 'pick-up', 'recruit', 'compete', 'liberty', 
  'opening', 'stadium', 'outcome', 'worried', 'nowhere', 'killing', 'visitor', 
  'fantasy', 'surplus', 'limited', 'founder', 'charter', 'symptom', 'monitor', 
  'capable', 'reading', 'monthly', 'banking', 'ancient', 'outline', 'command', 
  'healthy', 'breathe', 'anybody', 'funding', 'uniform', 'shelter', 'actress', 
  'missing', 'massive', 'subsidy', 'exhaust', 'dancing', 'adviser', 'curtain', 
  'dressed', 'convert', 'anxious', 'injured', 'acquire', 'therapy', 'traffic', 
  'gesture', 'offence', 'make-up', 'warning', 'somehow', 'unusual', 'arrange', 
  'install', 'made-up', 'digital', 'species', 'exactly', 'resolve', 'journey', 
  'gallery', 'protein', 'suspend', 'consult', 'retreat', 'lecture', 'circuit', 
  'minimum', 'live-in', 'curious', 'bedroom', 'counter', 'primary', 'cottage', 
  'backing', 'visible', 'assured', 'typical', 'passion', 'trigger', 'torture', 
  'ranking', 'inspect', 'justify', 'bearing', 'contest', 'observe', 'stomach', 
  'poverty', 'pension', 'surgery', 'excerpt', 'combine', 'besides', 'amateur', 
  'concede', 'anxiety', 'crystal', 'convict', 'amazing', 'capture', 'beneath', 
  'beating', 'hearing', 'segment', 'smoking', 'tragedy', 'emotion', 'illegal', 
  'testing', 'missile', 'licence', 'alcohol', 'chicken', 'exploit', 'flavour', 
  'auction', 'explode', 'recover', 'deserve', 'equally', 'comfort', 'extreme', 
  'arrival', 'proceed', 'reverse', 'cricket', 'illness', 'violate', 'nervous', 
  'fishing', 'concert', 'carrier', 'lesbian', 'fighter', 'compare', 'entitle', 
  'related', 'context', 'plastic', 'leather', 'servant', 'climate', 'register', 
  'exposure', 'merchant', 'casualty', 'pleasure', 'laughter', 'invasion', 
  'category', 'abortion', 'academic', 'alliance', 'whenever', 'capacity', 
  'superior', 'interior', 'decorate', 'moderate', 'persuade', 'valuable', 
  'medicine', 'motivate', 'concrete', 'absolute', 'delegate', 'clothing', 
  'reliable', 'takeover', 'platform', 'liberate', 'province', 'preserve', 
  'teaching', 'monetary'
];
    var keywords5 = [
  'dialogue', 'judgment', 'relative', 'romantic', 'diplomat', 'universe', 'anywhere', 
  'pregnant', 'treasury', 'striking', 'ambition', 'somewhat', 'identity', 'advanced', 
  'religion', 'apparent', 'sympathy', 'headline', 'planning', 'shortage', 'creative', 
  'approval', 'offering', 'portrait', 'negative', 'baseball', 'survival', 'deadline', 
  'accident', 'adequate', 'internal', 'Catholic', 'thorough', 'cultural', 'quantity', 
  'Security', 'overseas', 'civilian', 'enormous', 'midnight', 'priority', 'accurate', 
  'overcome', 'activist', 'dividend', 'properly', 'assembly', 'ordinary', 'birthday', 
  'discount', 'historic', 'operator', 'tendency', 'generate', 'delivery', 'attorney', 
  'generous', 'shopping', 'musician', 'designer', 'moreover', 'contrast', 'earnings', 
  'know-how', 'detailed', 'engineer', 'commerce', 'opponent', 'literary', 'innocent', 
  'exciting', 'ultimate', 'teenager', 'analysis', 'currency', 'ceremony', 'familiar', 
  'homeless', 'militant', 'location', 'entirely', 'flexible', 'advocate', 'confront', 
  'coverage', 'right-on', 'employer', 'existing', 'opposite', 'coloured', 'conclude', 
  'normally', 'suitable', 'sensible', 'recovery', 'disaster', 'numerous', 'friendly', 
  'pleasant', 'cautious', 'convince', 'forecast', 'training', 'electric', 'software', 
  'emphasis', 'bathroom', 'Algerian', 'graduate', 'peaceful', 'observer', 'somewhere', 
  'technical', 'exception', 'beginning', 'so-called', 'offensive', 'brilliant', 
  'inspector', 'basically', 'coalition', 'alongside', 'explosion', 'perfectly', 
  'solicitor', 'traveller', 'sensitive', 'organized', 'passenger', 'surrender', 
  'childhood', 'complaint', 'qualified', 'emphasize', 'gradually', 'component', 
  'electoral', 'selection', 'ceasefire', 'associate', 'landscape', 'accompany', 
  'confident', 'intention', 'terrorist', 'advertise', 'socialist', 'pregnancy', 
  'nightmare', 'integrate', 'departure', 'abandoned', 'seriously', 'reference', 
  'chocolate', 'victimize', 'expansion', 'strategic', 'procedure', 'disappear', 
  'immediate', 'boyfriend', 'publicity', 'precisely', 'personnel', 'stimulate', 
  'principal', 'promotion', 'surprised', 'hardliner', 'conscious', 'automatic', 
  'policeman', 'tradition', 'youngster', 'assistant', 'classical', 'cigarette', 
  'pollution', 'celebrate', 'frustrate', 'detective', 'editorial', 'neighbour', 
  'efficient', 'immigrant', 'virtually', 'undermine', 'amendment', 'infection', 
  'reluctant', 'organizer', 'furniture', 'entertain', 'privatize', 'volunteer', 
  'criticize', 'Secretary', 'permanent', 'sacrifice'
];
    var keywords6 = [
  'substance', 'practical', 'delighted', 'elsewhere', 'apartment', 'existence', 
  'transform', 'vegetable', 'breakfast', 'marketing', 'regulator', 'encounter', 
  'voluntary', 'remaining', 'ownership', 'prominent', 'guerrilla', 'economist', 
  'speculate', 'mechanism', 'broadcast', 'objective', 'worldwide', 'discovery', 
  'concerned', 'foreigner', 'desperate', 'ourselves', 'naturally', 'recording', 
  'overnight', 'household', 'provision', 'publisher', 'implement', 'highlight', 
  'kilometre', 'initially', 'long-time', 'temporary', 'convinced', 'emotional', 
  'corporate', 'gentleman', 'suspicion', 'extensive', 'spiritual', 'statistic', 
  'continent', 'reduction', 'Whitehall', 'satellite', 'commander', 'economics', 
  'eliminate', 'definitely', 'laboratory', 'occasional', 'literature', 'aggressive', 
  'convention', 'retirement', 'competitor', 'permission', 'collective', 'right-wing', 
  'optimistic', 'background', 'transition', 'unexpected', 'reasonable', 'helicopter', 
  'previously', 'enterprise', 'concession', 'short-term', 'enthusiasm', 'scientific', 
  'altogether', 'contribute', 'initiative', 'membership', 'diplomatic', 'vulnerable', 
  'suggestion', 'everywhere', 'allegation', 'definition', 'strengthen', 'subsequent'
];
    var keywords7 = [
  'inevitable', 'acceptable', 'sufficient', 'deliberate', 'conviction', 'relatively',
  'resistance', 'originally', 'substitute', 'assessment', 'reputation', 'atmosphere',
  'presidency', 'illustrate', 'withdrawal', 'conclusion', 'invitation', 'incredible',
  'exhibition', 'associated', 'publishing', 'referendum', 'friendship', 'expression',
  'historical', 'attractive', 'delegation', 'compromise', 'federation', 'depression',
  'determined', 'additional', 'widespread', 'remarkable', 'specialize', 'assumption',
  'regulation', 'connection', 'corruption', 'specialist', 'ambassador', 'assistance',
  'surprising', 'importance', 'indication', 'ingredient', 'comparison', 'proportion',
  'homosexual', 'presumably', 'percentage', 'appreciate', 'afterwards', 'instrument',
  'revolution', 'experiment', 'equivalent', 'foundation', 'co-operate', 'consistent',
  'electronic', 'tremendous', 'consultant', 'tournament', 'philosophy', 'discipline',
  'impressive', 'girlfriend', 'well-known', 'profession', 'occupation', 'impression',
  'ultimately', 'personally', 'employment', 'destruction', 'resignation', 'partnership',
  'nationalist', 'explanation', 'manufacture', 'personality', 'comfortable', 'competitive',
  'recognition', 'agriculture', 'threatening', 'requirement', 'replacement', 'commentator',
  'implication', 'complicated', 'supermarket', 'expectation', 'shareholder', 'concentrate',
  'educational', 'appointment', 'substantial', 'temperature', 'necessarily', 'acquisition',
  'immigration', 'interesting', 'communicate', 'examination', 'preparation', 'achievement',
  'celebration', 'fundamental'
];
    var keywords8 = [
  'Restoration', 'involvement', 'underground', 'participate', 'perspective', 'considering',
  'transaction', 'essentially', 'legislation', 'counterpart', 'demonstrate', 'instruction',
  'acknowledge', 'electricity', 'businessman', 'declaration', 'consequence', 'imagination',
  'intelligent', 'combination', 'description', 'countryside', 'outstanding', 'application',
  'anniversary', 'improvement', 'controversy', 'spectacular', 'publication', 'appropriate',
  'engineering', 'restriction', 'prosecution', 'corporation', 'arrangement', 'construction',
  'conversation', 'illustration', 'unidentified', 'contemporary', 'demonstrator', 'broadcasting',
  'intellectual', 'contribution', 'circumstance', 'headquarters', 'distribution', 'announcement',
  'agricultural', 'intelligence', 'constitution', 'disappointed', 'conventional', 'compensation',
  'photographer', 'intervention', 'unemployment', 'specifically', 'overwhelming', 'manufacturer',
  'nevertheless', 'communication', 'sophisticated', 'consideration', 'understanding',
  'demonstration', 'unfortunately', 'comprehensive', 'establishment', 'revolutionary',
  'consciousness', 'accommodation', 'parliamentary', 'controversial', 'psychological',
  'extraordinary', 'entertainment', 'confrontation', 'concentration', 'characteristic',
  'recommendation', 'constitutional', 'industrialized', 'secretary-general'
];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 合并所有关键词
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 从localStorage获取已取消高亮的单词列表
    var canceledKeywords = JSON.parse(localStorage.getItem('canceledKeywords')) || [];

    // 定义蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase(); 

            // 如果单词在取消高亮的列表中，则跳过
            if (canceledKeywords.includes(wordText)) {
                continue;
            }

            var wordFormsRegex = new RegExp('\\b(' +
                wordText + '|' +
                wordText + 's?' + '|' +
                wordText.replace(/y$/, 'i') + 'es?' + '|' +
                wordText + 'ed' + '|' +
                wordText + 'ing' + '|' +
                wordText + 'd' + '|' +
                wordText + 'er' + '|' +
                wordText + 'est' + '|' +
                wordText + 'ly' + '|' +
                wordText.replace(/y$/, 'ily') + '|' +
                wordText.replace(/ic$/, 'ically') + '|' +
                wordText.replace(/le$/, 'ly') +
            ')\\b', 'gi');

            // 替换匹配的关键词为蓝色
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}">${match}</span>`;
            });
        }

        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text;
            parent.replaceChild(span, node);
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

    // 对所有文本节点执行替换操作
    var textNodes = getTextNodes();
    for (var i = 0; i < textNodes.length; i++) {
        replaceKeywords(textNodes[i]);
    }

    // 创建按钮并插入页面
    var button = document.createElement('button');
    button.textContent = '取消单词高亮';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    // 按钮点击事件
    button.addEventListener('click', function() {
        var wordToCancel = prompt('输入要取消高亮的单词：');
        if (wordToCancel) {
            wordToCancel = wordToCancel.toLowerCase();
            if (!canceledKeywords.includes(wordToCancel)) {
                canceledKeywords.push(wordToCancel);
                localStorage.setItem('canceledKeywords', JSON.stringify(canceledKeywords));
                alert('单词 "' + wordToCancel + '" 已取消高亮。');
                location.reload(); // 刷新页面以应用更改
            } else {
                alert('该单词已经被取消高亮。');
            }
        }
    });
})();

// ==UserScript==
// @name         蓝色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      3.0
// @description  给网页关键词及其词形变化改变成蓝色，完整匹配
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义十个关键词数组
        var keywords1 = [
  'mate', 'raid', 'hint', 'pool', 'neat', 'done', 'fold', 'spur', 'cope', 
  'tone', 'pile', 'gift', 'amid', 'roof', 'peak', 'ease', 'crop', 'edit', 
  'tool', 'trap', 'hunt', 'poem', 'auto', 'stem', 'myth', 'task', 'sand', 
  'tide', 'heal', 'pipe', 'rose', 'ruin', 'peer', 'echo', 'gate', 'tiny', 
  'rare', 'pour', 'rush', 'busy', 'vice', 'riot', 'golf', 'jail', 'reel', 
  'pump', 'hire', 'wake', 'leaf', 'bell', 'part', 'root', 'mild', 'fool', 
  'soul', 'harm', 'sick', 'cure', 'Wall', 'salt', 'bake', 'hero', 'vast', 
  'path', 'chat', 'tune', 'dust', 'luck', 'pale', 'holy', 'crew', 'tall', 
  'live', 'dare', 'kiss', 'till', 'plot', 'shut', 'fate', 'stir', 'wrap', 
  'beer', 'lane', 'chip', 'coal', 'user', 'wash', 'hate', 'gene', 'mail', 
  'aged', 'rape', 'slim', 'bone', 'vol.', 'thin', 'mask', 'cake', 'rank', 
  'leap', 'swim', 'ring', 'bare', 'mess', 'boom', 'jury', 'rear', 'mood', 
  'quit', 'NATO', 'lock', 'chop', 'grip', 'drum', 'code', 'lend', 'self', 
  'folk', 'flee', 'pure', 'pact', 'boot', 'twin', 'shoe', 'load', 'leak', 
  'dear', 'soil', 'hill', 'wire', 'boil', 'belt', 'halt', 'lama', 'calm', 
  'dump', 'bend', 'tail', 'text', 'ibid', 'hook', 'sigh', 'lost', 'poet', 
  'moon', 'pace', 'gang', 'iron', 'core', 'knee', 'snow', 'Nazi', 'joke', 
  'spin', 'onto', 'snap', 'bass', 'hide', 'rely', 'meal', 'keen', 'fine', 
  'lake', 'mill', 'rice', 'dish', 'news', 'bean', 'sack', 'lean', 'rent', 
  'bore', 'bowl', 'lens', 'cave', 'tank', 'mere', 'inch', 'zone', 'rail', 
  'sink', 'rage', 'nose', 'acid', 'cite', 'deck', 'pose', 'meat', 'evil', 
  'mind', 'hall', 'jazz', 'sake', 'blow', 'gear', 'bury', 'flag', 'tale', 
  'loud', 'grab', 'bath', 'sail', 'port', 'coat', 'fare', 'wage', 'whip', 
  'glad', 'neck', 'bike', 'milk', 'seek', 'wise', 'pill', 'wipe', 'vary', 
  'tube', 'acre', 'fade', 'pole', 'drag', 'steam', 'yours', 'steel', 'drift', 
  'solve', 'apple', 'noted', 'trail', 'one\'s', 'Latin', 'apart', 'spray', 
  'angry', 'equal', 'upper', 'being', 'sugar', 'storm', 'brush', 'strip', 
  'grain', 'cough', 'habit', 'diary', 'imply', 'anger', 'alarm', 'punch', 
  'truly', 'metal', 'brand', 'point', 'trend', 'White', 'sauce', 'stamp', 
  'tight', 'spell', 'hello', 'sweep', 'flood', 'trick', 'rough', 'swing', 
  'chaos', 'juice', 'burst', 'plain', 'shore', 'boost', 'cheer', 'pause', 
  'miner', 'phase', 'eager', 'buyer', 'tower', 'medal', 'proof', 'drama', 
  'virus', 'await', 'fraud', 'spark', 'actor', 'inner', 'Bible', 'nurse', 
  'frame', 'yacht', 'State', 'worse', 'thick', 'weigh', 'prior', 'lover', 
  'grass', 'renew', 'stock'
];
    var keywords2 = [
  'cable', 'shift', 'penny', 'bound', 'ocean', 'clock', 'opera', 'solid', 
  'empty', 'steal', 'ought', 'smash', 'smell', 'local', 'spite', 'shame', 
  'crazy', 'proud', 'relax', 'index', 'grave', 'funny', 'yield', 'exile', 
  'squad', 'fence', 'cloud', 'newly', 'mixed', 'draft', 'angle', 'mayor', 
  'bunch', 'noise', 'error', 'awful', 'nerve', 'blind', 'pilot', 'pitch', 
  'giant', 'wheel', 'layer', 'faith', 'knock', 'debut', 'lease', 'moral', 
  'fixed', 'prime', 'panic', 'lucky', 'beach', 'found', 'rally', 'magic', 
  'worst', 'shirt', 'smart', 'saint', 'tired', 'lobby', 'theme', 'watch', 
  'ideal', 'pride', 'rider', 'twist', 'unity', 'react', 'chase', 'naval', 
  'minor', 'drain', 'truck', 'shade', 'arise', 'vital', 'trace', 'tooth', 
  'fault', 'alert', 'grade', 'sheet', 'brave', 'panel', 'upset', 'cease', 
  'enemy', 'pupil', 'slide', 'shout', 'lower', 'loose', 'spare', 'rugby', 
  'float', 'birth', 'given', 'breed', 'forth', 'light', 'urban', 'clash', 
  'depth', 'fleet', 'super', 'chest', 'sweet', 'climb', 'rural', 'bread', 
  'knife', 'chart', 'craft', 'mount', 'dirty', 'slice', 'blast', 'gross', 
  'alive', 'seize', 'badly', 'plate', 'aside', 'stare', 'cycle', 'flash', 
  'metre', 'chain', 'venue', 'label', 'crown', 'alter', 'stupid', 'inning', 
  'rhythm', 'enable', 'script', 'allied', 'guitar', 'reward', 'merely', 
  'admire', 'regime', 'racing', 'agenda', 'valley', 'marked', 'strict', 
  'weekly', 'jacket', 'bother', 'repair', 'silent', 'CD-ROM', 'ruling', 
  'empire', 'retain', 'regret', 'forest', 'beaten', 'native', 'poetry', 
  'immune', 'obtain', 'excess', 'assess', 'higher', 'height', 'heaven', 
  'marine', 'desert', 'pledge', 'tunnel', 'horror', 'fulfil', 'excuse', 
  'behalf', 'rating', 'killer', 'branch', 'temple', 'wicket', 'notion', 
  'select', 'rescue', 'freeze', 'output', 'pocket', 'rocket', 'vessel', 
  'plenty', 'remark', 'scream', 'symbol', 'sample', 'palace', 'mobile', 
  'tactic', 'honest', 'ballot', 'fabric', 'mirror', 'steady', 'nearby', 
  'resign', 'lovely', 'barrel', 'cruise', 'tissue', 'employ', 'stroke', 
  'sudden', 'client', 'luxury', 'junior', 'wealth', 'lesson', 'caring', 
  'invest', 'adjust', 'merger', 'tennis', 'urgent'
];
    var keywords3 = [
  'unlike', 'saving', 'partly', 'origin', 'smooth', 'wooden', 'afraid', 'margin', 
  'shadow', 'surely', 'golden', 'trader', 'permit', 'prompt', 'modest', 'priest', 
  'resort', 'plunge', 'honour', 'retail', 'cheese', 'potato', 'engage', 'unfair', 
  'viewer', 'racial', 'access', 'guilty', 'muscle', 'whilst', 'superb', 'actual', 
  'weaken', 'pepper', 'cancel', 'butter', 'remote', 'bitter', 'belief', 'gentle', 
  'barely', 'manner', 'medium', 'vision', 'clever', 'column', 'cinema', 'easily', 
  'remind', 'breast', 'signal', 'define', 'stream', 'assist', 'equity', 'holder', 
  'extent', 'banker', 'praise', 'retire', 'living', 'police', 'autumn', 'united', 
  'device', 'expand', 'silver', 'runner', 'abroad', 'govern', 'ethnic', 'borrow', 
  'belong', 'breath', 'bloody', 'fierce', 'proper', 'resume', 'rumour', 'dealer', 
  'fiscal', 'slight', 'tackle', 'mental', 'shaped', 'soccer', 'humour', 'throat', 
  'button', 'string', 'hunter', 'combat', 'titled', 'global', 'motion', 'salary', 
  'infect', 'expose', 'coffee', 'comedy', 'rarely', 'oppose', 'unable', 'pursue', 
  'phrase', 'relate', 'switch', 'latter', 'locked', 'advise', 'talent', 'inform', 
  'glance', 'planet', 'cotton', 'fairly', 'reckon', 'mostly', 'mutual', 'afford', 
  'castle', 'burden', 'resist', 'beside', 'clinic', 'beauty', 'singer', 'strain', 
  'broker', 'unique', 'winter', 'carbon', 'behave', 'mystery', 'crucial', 'formula', 
  'suicide', 'colonel', 'embassy', 'charity', 'predict', 'assault', 'instant', 
  'enhance', 'bargain', 'counsel', 'silence', 'passage', 'deposit', 'library', 
  'winning', 'interim', 'genuine', 'execute', 'premier', 'shortly', 'chamber', 
  'expense', 'maximum', 'penalty', 'meaning', 'whereas', 'elderly', 'pleased', 
  'intense', 'explore', 'speaker', 'tension', 'provoke', 'concept', 'married', 
  'mixture', 'vitamin', 'musical', 'unhappy', 'delight', 'dismiss', 'condemn', 
  'wedding', 'athlete', 'barrier', 'qualify', 'railway', 'veteran', 'sustain', 
  'o\'clock', 'revenue', 'premium', 'impress', 'triumph', 'violent', 'absence', 
  'cutting', 'sponsor', 'verdict', 'initial', 'Kremlin', 'venture', 'unknown', 
  'restore'
];
    var keywords4 = [
  'profile', 'opposed', 'senator', 'cooking', 'courage', 'antique', 'stretch', 
  'abandon', 'welfare', 'fortune', 'appoint', 'inquiry', 'written', 'witness', 
  'consist', 'scandal', 'squeeze', 'elegant', 'whisper', 'tourist', 'harbour', 
  'painful', 'faction', 'routine', 'pick-up', 'recruit', 'compete', 'liberty', 
  'opening', 'stadium', 'outcome', 'worried', 'nowhere', 'killing', 'visitor', 
  'fantasy', 'surplus', 'limited', 'founder', 'charter', 'symptom', 'monitor', 
  'capable', 'reading', 'monthly', 'banking', 'ancient', 'outline', 'command', 
  'healthy', 'breathe', 'anybody', 'funding', 'uniform', 'shelter', 'actress', 
  'missing', 'massive', 'subsidy', 'exhaust', 'dancing', 'adviser', 'curtain', 
  'dressed', 'convert', 'anxious', 'injured', 'acquire', 'therapy', 'traffic', 
  'gesture', 'offence', 'make-up', 'warning', 'somehow', 'unusual', 'arrange', 
  'install', 'made-up', 'digital', 'species', 'exactly', 'resolve', 'journey', 
  'gallery', 'protein', 'suspend', 'consult', 'retreat', 'lecture', 'circuit', 
  'minimum', 'live-in', 'curious', 'bedroom', 'counter', 'primary', 'cottage', 
  'backing', 'visible', 'assured', 'typical', 'passion', 'trigger', 'torture', 
  'ranking', 'inspect', 'justify', 'bearing', 'contest', 'observe', 'stomach', 
  'poverty', 'pension', 'surgery', 'excerpt', 'combine', 'besides', 'amateur', 
  'concede', 'anxiety', 'crystal', 'convict', 'amazing', 'capture', 'beneath', 
  'beating', 'hearing', 'segment', 'smoking', 'tragedy', 'emotion', 'illegal', 
  'testing', 'missile', 'licence', 'alcohol', 'chicken', 'exploit', 'flavour', 
  'auction', 'explode', 'recover', 'deserve', 'equally', 'comfort', 'extreme', 
  'arrival', 'proceed', 'reverse', 'cricket', 'illness', 'violate', 'nervous', 
  'fishing', 'concert', 'carrier', 'lesbian', 'fighter', 'compare', 'entitle', 
  'related', 'context', 'plastic', 'leather', 'servant', 'climate', 'register', 
  'exposure', 'merchant', 'casualty', 'pleasure', 'laughter', 'invasion', 
  'category', 'abortion', 'academic', 'alliance', 'whenever', 'capacity', 
  'superior', 'interior', 'decorate', 'moderate', 'persuade', 'valuable', 
  'medicine', 'motivate', 'concrete', 'absolute', 'delegate', 'clothing', 
  'reliable', 'takeover', 'platform', 'liberate', 'province', 'preserve', 
  'teaching', 'monetary'
];
    var keywords5 = [
  'dialogue', 'judgment', 'relative', 'romantic', 'diplomat', 'universe', 'anywhere', 
  'pregnant', 'treasury', 'striking', 'ambition', 'somewhat', 'identity', 'advanced', 
  'religion', 'apparent', 'sympathy', 'headline', 'planning', 'shortage', 'creative', 
  'approval', 'offering', 'portrait', 'negative', 'baseball', 'survival', 'deadline', 
  'accident', 'adequate', 'internal', 'Catholic', 'thorough', 'cultural', 'quantity', 
  'Security', 'overseas', 'civilian', 'enormous', 'midnight', 'priority', 'accurate', 
  'overcome', 'activist', 'dividend', 'properly', 'assembly', 'ordinary', 'birthday', 
  'discount', 'historic', 'operator', 'tendency', 'generate', 'delivery', 'attorney', 
  'generous', 'shopping', 'musician', 'designer', 'moreover', 'contrast', 'earnings', 
  'know-how', 'detailed', 'engineer', 'commerce', 'opponent', 'literary', 'innocent', 
  'exciting', 'ultimate', 'teenager', 'analysis', 'currency', 'ceremony', 'familiar', 
  'homeless', 'militant', 'location', 'entirely', 'flexible', 'advocate', 'confront', 
  'coverage', 'right-on', 'employer', 'existing', 'opposite', 'coloured', 'conclude', 
  'normally', 'suitable', 'sensible', 'recovery', 'disaster', 'numerous', 'friendly', 
  'pleasant', 'cautious', 'convince', 'forecast', 'training', 'electric', 'software', 
  'emphasis', 'bathroom', 'Algerian', 'graduate', 'peaceful', 'observer', 'somewhere', 
  'technical', 'exception', 'beginning', 'so-called', 'offensive', 'brilliant', 
  'inspector', 'basically', 'coalition', 'alongside', 'explosion', 'perfectly', 
  'solicitor', 'traveller', 'sensitive', 'organized', 'passenger', 'surrender', 
  'childhood', 'complaint', 'qualified', 'emphasize', 'gradually', 'component', 
  'electoral', 'selection', 'ceasefire', 'associate', 'landscape', 'accompany', 
  'confident', 'intention', 'terrorist', 'advertise', 'socialist', 'pregnancy', 
  'nightmare', 'integrate', 'departure', 'abandoned', 'seriously', 'reference', 
  'chocolate', 'victimize', 'expansion', 'strategic', 'procedure', 'disappear', 
  'immediate', 'boyfriend', 'publicity', 'precisely', 'personnel', 'stimulate', 
  'principal', 'promotion', 'surprised', 'hardliner', 'conscious', 'automatic', 
  'policeman', 'tradition', 'youngster', 'assistant', 'classical', 'cigarette', 
  'pollution', 'celebrate', 'frustrate', 'detective', 'editorial', 'neighbour', 
  'efficient', 'immigrant', 'virtually', 'undermine', 'amendment', 'infection', 
  'reluctant', 'organizer', 'furniture', 'entertain', 'privatize', 'volunteer', 
  'criticize', 'Secretary', 'permanent', 'sacrifice'
];
    var keywords6 = [
  'substance', 'practical', 'delighted', 'elsewhere', 'apartment', 'existence', 
  'transform', 'vegetable', 'breakfast', 'marketing', 'regulator', 'encounter', 
  'voluntary', 'remaining', 'ownership', 'prominent', 'guerrilla', 'economist', 
  'speculate', 'mechanism', 'broadcast', 'objective', 'worldwide', 'discovery', 
  'concerned', 'foreigner', 'desperate', 'ourselves', 'naturally', 'recording', 
  'overnight', 'household', 'provision', 'publisher', 'implement', 'highlight', 
  'kilometre', 'initially', 'long-time', 'temporary', 'convinced', 'emotional', 
  'corporate', 'gentleman', 'suspicion', 'extensive', 'spiritual', 'statistic', 
  'continent', 'reduction', 'Whitehall', 'satellite', 'commander', 'economics', 
  'eliminate', 'definitely', 'laboratory', 'occasional', 'literature', 'aggressive', 
  'convention', 'retirement', 'competitor', 'permission', 'collective', 'right-wing', 
  'optimistic', 'background', 'transition', 'unexpected', 'reasonable', 'helicopter', 
  'previously', 'enterprise', 'concession', 'short-term', 'enthusiasm', 'scientific', 
  'altogether', 'contribute', 'initiative', 'membership', 'diplomatic', 'vulnerable', 
  'suggestion', 'everywhere', 'allegation', 'definition', 'strengthen', 'subsequent'
];
    var keywords7 = [
  'inevitable', 'acceptable', 'sufficient', 'deliberate', 'conviction', 'relatively',
  'resistance', 'originally', 'substitute', 'assessment', 'reputation', 'atmosphere',
  'presidency', 'illustrate', 'withdrawal', 'conclusion', 'invitation', 'incredible',
  'exhibition', 'associated', 'publishing', 'referendum', 'friendship', 'expression',
  'historical', 'attractive', 'delegation', 'compromise', 'federation', 'depression',
  'determined', 'additional', 'widespread', 'remarkable', 'specialize', 'assumption',
  'regulation', 'connection', 'corruption', 'specialist', 'ambassador', 'assistance',
  'surprising', 'importance', 'indication', 'ingredient', 'comparison', 'proportion',
  'homosexual', 'presumably', 'percentage', 'appreciate', 'afterwards', 'instrument',
  'revolution', 'experiment', 'equivalent', 'foundation', 'co-operate', 'consistent',
  'electronic', 'tremendous', 'consultant', 'tournament', 'philosophy', 'discipline',
  'impressive', 'girlfriend', 'well-known', 'profession', 'occupation', 'impression',
  'ultimately', 'personally', 'employment', 'destruction', 'resignation', 'partnership',
  'nationalist', 'explanation', 'manufacture', 'personality', 'comfortable', 'competitive',
  'recognition', 'agriculture', 'threatening', 'requirement', 'replacement', 'commentator',
  'implication', 'complicated', 'supermarket', 'expectation', 'shareholder', 'concentrate',
  'educational', 'appointment', 'substantial', 'temperature', 'necessarily', 'acquisition',
  'immigration', 'interesting', 'communicate', 'examination', 'preparation', 'achievement',
  'celebration', 'fundamental'
];
    var keywords8 = [
  'Restoration', 'involvement', 'underground', 'participate', 'perspective', 'considering',
  'transaction', 'essentially', 'legislation', 'counterpart', 'demonstrate', 'instruction',
  'acknowledge', 'electricity', 'businessman', 'declaration', 'consequence', 'imagination',
  'intelligent', 'combination', 'description', 'countryside', 'outstanding', 'application',
  'anniversary', 'improvement', 'controversy', 'spectacular', 'publication', 'appropriate',
  'engineering', 'restriction', 'prosecution', 'corporation', 'arrangement', 'construction',
  'conversation', 'illustration', 'unidentified', 'contemporary', 'demonstrator', 'broadcasting',
  'intellectual', 'contribution', 'circumstance', 'headquarters', 'distribution', 'announcement',
  'agricultural', 'intelligence', 'constitution', 'disappointed', 'conventional', 'compensation',
  'photographer', 'intervention', 'unemployment', 'specifically', 'overwhelming', 'manufacturer',
  'nevertheless', 'communication', 'sophisticated', 'consideration', 'understanding',
  'demonstration', 'unfortunately', 'comprehensive', 'establishment', 'revolutionary',
  'consciousness', 'accommodation', 'parliamentary', 'controversial', 'psychological',
  'extraordinary', 'entertainment', 'confrontation', 'concentration', 'characteristic',
  'recommendation', 'constitutional', 'industrialized', 'secretary-general'
];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 将所有关键词数组合并为一个数组
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 直接返回蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase(); // 将关键词转换为小写
            var wordFormsRegex = new RegExp('\\b(' +
                wordText + '|' +
                wordText + 's?' + '|' +
                wordText.replace(/y$/, 'i') + 'es?' + '|' +
                wordText + 'ed' + '|' +
                wordText + 'ing' + '|' +
                wordText + 'd' + '|' +
                wordText + 'er' + '|' +
                wordText + 'est' + '|' +
                wordText + 'ly' + '|' +
                wordText.replace(/y$/, 'ily') + '|' +
                wordText.replace(/ic$/, 'ically') + '|' +
                wordText.replace(/le$/, 'ly') +
            ')\\b', 'gi'); // 构建词形变化的正则表达式，忽略大小写

            // 替换匹配的关键词及词形变化为蓝色
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}">${match}</span>`; // 替换为带有蓝色的 span
            });
        }

        // 只有当文本发生改变时才进行替换
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text; // 使用 innerHTML 来插入带有颜色的 span
            parent.replaceChild(span, node); // 替换原始文本节点
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