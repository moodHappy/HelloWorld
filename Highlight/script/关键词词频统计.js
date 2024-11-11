// ==UserScript==
// @name         关键词词频统计
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Count the frequency of specified keywords on a webpage (mobile-friendly).
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isPanelVisible = false; // Track the visibility of the panel
    let wordCountBox = null; // Store the result panel element

    // Define keyword arrays
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

    // Combine all keywords into one array
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // Helper function to create a floating UI for results
    function createResultsBox() {
        const box = document.createElement('div');
        box.id = 'wordFrequencyBox';
        box.style.position = 'fixed';
        box.style.bottom = '60px'; // Leave space for the toggle button
        box.style.left = '10px';
        box.style.right = '10px';
        box.style.maxHeight = '50%';
        box.style.overflowY = 'auto';
        box.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        box.style.border = '2px solid #000';
        box.style.padding = '10px';
        box.style.zIndex = '10000';
        box.style.fontSize = '16px';
        box.style.lineHeight = '1.5';
        box.style.fontFamily = 'Arial, sans-serif';
        box.style.borderRadius = '10px';
        box.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
        box.style.color = '#333';
        box.style.display = 'none'; // Hidden by default
        return box;
    }

    // Function to count keyword frequencies
    function countWords(text) {
        const words = text.match(/\b\w+\b/g);
        const wordCount = {};

        words.forEach(word => {
            word = word.toLowerCase();
            if (allKeywords.includes(word)) { // Only count if it's a keyword
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });

        // Filter out words with frequency less than 2
        for (const word in wordCount) {
            if (wordCount[word] < 2) {
                delete wordCount[word];
            }
        }

        return wordCount;
    }

    // Function to format the word frequency result
    function displayWordCount(wordCount) {
        if (!wordCountBox) {
            wordCountBox = createResultsBox();
            document.body.appendChild(wordCountBox);
        }

        wordCountBox.innerHTML = ''; // Clear previous results
        const sortedWords = Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]);

        sortedWords.forEach(word => {
            const count = wordCount[word];
            const p = document.createElement('p');
            p.textContent = `${word}: ${count}`;
            wordCountBox.appendChild(p);
        });
    }

    // Function to extract visible text from the page
    function extractVisibleText() {
        const bodyText = document.body.innerText;
        return bodyText;
    }

    // Toggle visibility of the result panel
    function toggleWordCountPanel() {
        isPanelVisible = !isPanelVisible;
        wordCountBox.style.display = isPanelVisible ? 'block' : 'none';
    }

    // Add a button to toggle the panel
    function createToggleButton() {
        const button = document.createElement('button');
        button.innerText = 'Toggle Keyword Frequency';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10001';

        button.onclick = toggleWordCountPanel;
        document.body.appendChild(button);
    }

    // Main logic
    const text = extractVisibleText();
    const wordCount = countWords(text);
    displayWordCount(wordCount);
    createToggleButton(); // Add the toggle button to the page

})();