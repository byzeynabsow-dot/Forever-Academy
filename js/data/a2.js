/* Forever Academy — Cours niveau A2 (élémentaire) */
window.COURSES = window.COURSES || {};
window.COURSES.A2 = [

{
  id:'a2-1', title:'Le passé simple (past simple)', icon:'clock', duration:'35 min',
  goal:"Raconter ce que tu as fait hier, la semaine dernière, l'an dernier — avec les verbes réguliers et les 40 irréguliers les plus utiles.",
  sections:[
    {t:'text', h:'Quand l’employer ?', p:"Pour une action <b>terminée</b> à un moment <b>précis</b> du passé. Il y a presque toujours un repère de temps : yesterday, last week, in 2019, two days ago, when I was a child."},
    {t:'table', h:'Construction', head:['Forme','Structure','Exemple'], rows:[
      ['Affirmatif','sujet + verbe-ed / forme irrégulière','I worked. / I went.'],
      ['Négatif',"sujet + didn't + infinitif","I didn't work. / I didn't go."],
      ['Question','Did + sujet + infinitif ?','Did you work? / Did you go?'],
      ['Réponse courte','Yes, I did. / No, I didn’t.','']
    ]},
    {t:'text', h:'Orthographe du -ed', p:"work → worked · like → lik<b>ed</b> (verbe en -e : on ajoute juste -d) · study → stud<b>ied</b> (consonne + y) · stop → stop<b>ped</b> (une voyelle + une consonne finale : on double)."},
    {t:'table', h:'Verbes irréguliers essentiels', head:['Infinitif','Passé','Sens'], rows:[
      ['be','was / were','être'],['have','had','avoir'],['do','did','faire'],['go','went','aller'],
      ['come','came','venir'],['see','saw','voir'],['take','took','prendre'],['make','made','fabriquer'],
      ['get','got','obtenir'],['give','gave','donner'],['say','said','dire'],['tell','told','raconter'],
      ['eat','ate','manger'],['drink','drank','boire'],['buy','bought','acheter'],['bring','brought','apporter'],
      ['think','thought','penser'],['know','knew','savoir'],['write','wrote','écrire'],['read','read (/red/)','lire'],
      ['find','found','trouver'],['leave','left','partir'],['meet','met','rencontrer'],['pay','paid','payer'],
      ['put','put','mettre'],['run','ran','courir'],['sit','sat','s’asseoir'],['sleep','slept','dormir'],
      ['speak','spoke','parler'],['stand','stood','être debout'],['teach','taught','enseigner'],['understand','understood','comprendre'],
      ['wear','wore','porter'],['win','won','gagner'],['lose','lost','perdre'],['send','sent','envoyer'],
      ['feel','felt','ressentir'],['begin','began','commencer'],['break','broke','casser'],['choose','chose','choisir']
    ]},
    {t:'ex', h:'Exemples', items:[
      ["I went to the market yesterday.","Je suis allé au marché hier."],
      ["She didn't come to school last Monday.","Elle n'est pas venue à l'école lundi dernier."],
      ["Did you see the film?","As-tu vu le film ?"],
      ["We were very happy.","Nous étions très heureux."],
      ["He bought a new phone two weeks ago.","Il a acheté un nouveau téléphone il y a deux semaines."]
    ]},
    {t:'tip', p:"Le <b>-ed</b> ne se prononce que rarement /ed/. Il se dit /t/ après un son sourd (worked = workt), /d/ après un son sonore (played = playd), et /ɪd/ seulement après t ou d (wanted, needed)."}
  ],
  exercises:[
    {t:'qcm', q:'I ___ to Dakar last year.', opts:['go','went','gone'], c:1, why:"go → went au passé simple."},
    {t:'qcm', q:"She ___ come yesterday.", opts:["didn't","doesn't","wasn't"], c:0, why:"Passé négatif → didn't + infinitif."},
    {t:'qcm', q:'___ you eat rice yesterday?', opts:['Do','Did','Were'], c:1, why:"Did + sujet + infinitif."},
    {t:'fill', q:"Passé de « buy » :", a:['bought'], why:"buy → bought."},
    {t:'fill', q:"Passé de « teach » :", a:['taught'], why:"teach → taught."},
    {t:'qcm', q:'Which is correct?', opts:["He didn't went.","He didn't go.","He not went."], c:1, why:"Après didn't, le verbe reste à l'infinitif."},
    {t:'qcm', q:'They ___ at home when I called.', opts:['was','were','are'], c:1, why:"they → were."},
    {t:'trad', q:"Je n'ai pas vu ce film.", a:["i didn't see this film","i didn't see that film","i didn't see the film","i did not see this film"], why:"I didn't see that film."},
    {t:'fill', q:"« study » au passé :", a:['studied'], why:"consonne + y → -ied."},
    {t:'fill', q:"« stop » au passé :", a:['stopped'], why:"On double la consonne finale : stopped."},
    {t:'order', words:['ago','she','two','left','days'], a:'she left two days ago', why:"She left two days ago."},
    {t:'qcm', q:'Dans « wanted », le -ed se prononce :', opts:['/t/','/d/','/ɪd/'], c:2, why:"Après un t ou un d, on prononce /ɪd/."},
    {t:'trad', q:"Où es-tu allé hier ?", a:['where did you go yesterday'], why:"Where did you go yesterday?"},
    {t:'qcm', q:'We ___ a great time at the party.', opts:['have','had','has'], c:1, why:"Passé de have = had."}
  ]
},

{
  id:'a2-2', title:'Présent continu vs présent simple', icon:'layers', duration:'30 min',
  goal:"Choisir entre « I work » et « I am working » sans hésiter, et connaître les verbes qui refusent le -ing.",
  sections:[
    {t:'table', h:'Deux présents, deux usages', head:['','Présent simple','Présent continu'], rows:[
      ['Forme','I work / He works','I am working / He is working'],
      ['Sens','habitude, vérité générale','action en cours <b>maintenant</b>'],
      ['Repères','every day, usually, always, never','now, right now, at the moment, look!, listen!'],
      ['Exemple','I work in a bank.','I am working on a project this week.']
    ]},
    {t:'text', h:'Orthographe du -ing', p:"work → working · make → mak<b>ing</b> (le e final disparaît) · run → run<b>ning</b> (on double) · lie → l<b>ying</b>."},
    {t:'text', h:'Les verbes qui ne prennent pas -ing (stative verbs)', p:"Ils décrivent un état, pas une action : <b>be, have (posséder), like, love, hate, want, need, know, understand, believe, remember, seem, prefer, belong, cost, mean</b>. On dit <i>I want a coffee</i>, jamais <i>I am wanting</i>."},
    {t:'ex', h:'Comparer', items:[
      ["She works at the hospital. / She is working late tonight.","Elle travaille à l'hôpital. / Elle travaille tard ce soir."],
      ["It usually rains in July. / Look! It's raining.","Il pleut d'habitude en juillet. / Regarde ! Il pleut."],
      ["I don't understand this word.","Je ne comprends pas ce mot. (jamais « I'm not understanding »)"],
      ["What do you do? / What are you doing?","Que fais-tu dans la vie ? / Que fais-tu (là, maintenant) ?"]
    ]},
    {t:'tip', p:"« What do you do? » demande ton <b>métier</b>. « What are you doing? » demande ton <b>activité en cours</b>. Confondre les deux crée des malentendus amusants."}
  ],
  exercises:[
    {t:'qcm', q:'Listen! The baby ___.', opts:['cries','is crying','cried'], c:1, why:"« Listen! » signale une action en cours → présent continu."},
    {t:'qcm', q:'I ___ coffee every morning.', opts:['drink','am drinking','drinks'], c:0, why:"Habitude → présent simple."},
    {t:'qcm', q:'She ___ this book at the moment.', opts:['reads','is reading','read'], c:1, why:"at the moment → continu."},
    {t:'qcm', q:'I ___ what you mean.', opts:['am understanding','understand','understands'], c:1, why:"understand est un verbe d'état : jamais -ing."},
    {t:'fill', q:"Forme en -ing de « run » :", a:['running'], why:"On double la consonne : running."},
    {t:'fill', q:"Forme en -ing de « write » :", a:['writing'], why:"Le e final disparaît : writing."},
    {t:'qcm', q:'They ___ to Ghana next week (projet déjà décidé).', opts:['travel','are travelling','travelled'], c:1, why:"Le présent continu s'emploie aussi pour un projet planifié."},
    {t:'trad', q:"Qu'est-ce que tu fais en ce moment ?", a:['what are you doing at the moment','what are you doing right now','what are you doing now'], why:"What are you doing at the moment?"},
    {t:'vf', q:"« I am wanting a new phone » est correct.", a:false, why:"want est un verbe d'état : <i>I want a new phone</i>."},
    {t:'qcm', q:'He usually ___ the bus, but today he ___.', opts:['takes / is walking','is taking / walks','take / walk'], c:0, why:"Habitude + exception du jour."},
    {t:'order', words:['is','she','not','now','working'], a:'she is not working now', why:"She is not working now."},
    {t:'qcm', q:'Water ___ at 100 °C.', opts:['is boiling','boils','boil'], c:1, why:"Vérité générale → présent simple."}
  ]
},

{
  id:'a2-3', title:'Parler du futur : will, going to, présent continu', icon:'feather', duration:'30 min',
  goal:"Choisir la bonne forme de futur selon que tu décides sur le moment, que tu as un projet ou un rendez-vous fixé.",
  sections:[
    {t:'table', h:'Trois futurs', head:['Forme','Emploi','Exemple'], rows:[
      ['will + infinitif','décision immédiate, prédiction, promesse','I will help you. / It will rain.'],
      ['be going to + infinitif','intention déjà décidée, preuve visible','I am going to study medicine. / Look at those clouds — it is going to rain.'],
      ['présent continu','rendez-vous fixé avec une autre personne','I am meeting the doctor at 5.'],
      ['présent simple','horaire officiel','The train leaves at 7:40.']
    ]},
    {t:'text', h:'Formes de will', p:"Affirmatif : I'll go. Négatif : I won't go. Question : Will you go? Réponse : Yes, I will. / No, I won't."},
    {t:'ex', h:'Comparer', items:[
      ["The phone is ringing — I'll answer it.","Le téléphone sonne — je réponds. (décision immédiate)"],
      ["I'm going to answer all my emails today.","Je vais répondre à tous mes mails aujourd'hui. (intention)"],
      ["I'm seeing my teacher tomorrow at 9.","Je vois mon professeur demain à 9 h. (rendez-vous)"],
      ["Don't worry, I won't forget.","Ne t'inquiète pas, je n'oublierai pas. (promesse)"],
      ["She'll be 20 next month.","Elle aura 20 ans le mois prochain. (fait futur)"]
    ]},
    {t:'tip', p:"Après <b>when, as soon as, before, after, until, if</b>, on n'emploie jamais will : <i>I'll call you when I <b>arrive</b></i> (pas « when I will arrive »)."}
  ],
  exercises:[
    {t:'qcm', q:"The bag is heavy. — Don't worry, I ___ carry it.", opts:['am going to','will','am carrying'], c:1, why:"Décision prise à l'instant → will."},
    {t:'qcm', q:"I've decided: I ___ buy a car next year.", opts:['will','am going to','am buying'], c:1, why:"Intention déjà décidée → going to."},
    {t:'qcm', q:'I ___ the dentist at 3 p.m. tomorrow.', opts:['will see','am seeing','see'], c:1, why:"Rendez-vous fixé → présent continu."},
    {t:'qcm', q:'The train ___ at 8:15.', opts:['will leave','leaves','is leaving'], c:1, why:"Horaire officiel → présent simple."},
    {t:'fill', q:"Négation de « will » :", a:["won't",'will not'], why:"will not = won't."},
    {t:'qcm', q:"I'll call you when I ___ home.", opts:['will get','get','am getting'], c:1, why:"Pas de will après when."},
    {t:'trad', q:"Il va pleuvoir. (les nuages sont là)", a:["it's going to rain",'it is going to rain'], why:"Preuve visible → going to."},
    {t:'qcm', q:'Look at that boy! He ___ fall.', opts:['will','is going to','falls'], c:1, why:"Preuve visible immédiate → going to."},
    {t:'order', words:['will','I','you','tomorrow','see'], a:'i will see you tomorrow', why:"I will see you tomorrow."},
    {t:'vf', q:"« If it will rain, I stay home » est correct.", a:false, why:"Non : <i>If it rains, I'll stay home.</i>"},
    {t:'qcm', q:'She ___ 18 next week.', opts:['will be','is being','be'], c:0, why:"Fait futur → will be."},
    {t:'trad', q:"Je ne vais pas travailler demain.", a:["i'm not going to work tomorrow",'i am not going to work tomorrow',"i won't work tomorrow"], why:"I'm not going to work tomorrow."}
  ]
},

{
  id:'a2-4', title:'Comparatifs et superlatifs', icon:'blocks', duration:'25 min',
  goal:"Comparer deux choses et désigner le meilleur, avec les adjectifs courts, longs et irréguliers.",
  sections:[
    {t:'table', h:'Les règles', head:['Type d’adjectif','Comparatif','Superlatif'], rows:[
      ['court (1 syllabe) : tall','taller than','the tallest'],
      ['court en -y : happy','happier than','the happiest'],
      ['court à doubler : big','bigger than','the biggest'],
      ['long (2+ syllabes) : expensive','more expensive than','the most expensive'],
      ['irrégulier : good','better than','the best'],
      ['irrégulier : bad','worse than','the worst'],
      ['irrégulier : far','farther / further','the farthest / furthest']
    ]},
    {t:'text', h:'Égalité et infériorité', p:"Égalité : <b>as … as</b> (She is as tall as me). Négative : <b>not as … as</b> (It's not as cold as yesterday). Infériorité : <b>less … than</b> (This is less useful than that)."},
    {t:'ex', h:'Exemples', items:[
      ["Dakar is bigger than Thiès.","Dakar est plus grande que Thiès."],
      ["This is the most interesting book I've read.","C'est le livre le plus intéressant que j'ai lu."],
      ["My English is better than last year.","Mon anglais est meilleur que l'an dernier."],
      ["He is as strong as his brother.","Il est aussi fort que son frère."],
      ["The more you practise, the better you speak.","Plus tu t'entraînes, mieux tu parles."]
    ]},
    {t:'tip', p:"Ne cumule jamais : <i>more bigger</i> est faux. Un adjectif porte une seule marque de comparaison."}
  ],
  exercises:[
    {t:'qcm', q:'This bag is ___ than mine.', opts:['expensive','more expensive','expensiver'], c:1, why:"Adjectif long → more + adjectif."},
    {t:'qcm', q:'She is the ___ student in the class.', opts:['best','better','goodest'], c:0, why:"good → better → the best."},
    {t:'fill', q:"Comparatif de « big » :", a:['bigger'], why:"On double la consonne : bigger."},
    {t:'fill', q:"Superlatif de « happy » :", a:['happiest','the happiest'], why:"happy → the happiest."},
    {t:'qcm', q:'Today is ___ than yesterday.', opts:['hotter','more hot','hottest'], c:0, why:"Adjectif court → -er, avec doublement : hotter."},
    {t:'qcm', q:'It was ___ film of the year.', opts:['the worse','the worst','the baddest'], c:1, why:"bad → worse → the worst."},
    {t:'trad', q:"Il est aussi grand que moi.", a:['he is as tall as me',"he's as tall as me",'he is as tall as i am'], why:"He is as tall as me."},
    {t:'qcm', q:'Which is correct?', opts:['more better','much better','better more'], c:1, why:"On renforce avec much / far / a lot : much better."},
    {t:'order', words:['the','is','this','cheapest','option'], a:'this is the cheapest option', why:"This is the cheapest option."},
    {t:'vf', q:"« She is more taller than him » est correct.", a:false, why:"Non : <i>taller than him</i> — une seule marque."},
    {t:'qcm', q:'My house is ___ from school than yours.', opts:['far','farther','farrer'], c:1, why:"far → farther / further."},
    {t:'trad', q:"C'est la meilleure décision.", a:["it's the best decision",'it is the best decision','this is the best decision'], why:"It's the best decision."}
  ]
},

{
  id:'a2-5', title:'Quantifieurs : much, many, some, any, few, little', icon:'puzzle', duration:'25 min',
  goal:"Exprimer une quantité correctement selon que le nom est comptable ou non.",
  sections:[
    {t:'table', h:'Le tableau de référence', head:['Quantifieur','Comptable (books)','Indénombrable (water)'], rows:[
      ['beaucoup (affirmatif)','a lot of / lots of','a lot of / lots of'],
      ['beaucoup (nég./question)','many','much'],
      ['un peu de','a few','a little'],
      ['peu (négatif)','few','little'],
      ['un peu, du (affirmatif)','some','some'],
      ['question / négation','any','any'],
      ['assez','enough','enough'],
      ['trop','too many','too much']
    ]},
    {t:'text', h:'some ou any ?', p:"<b>some</b> à l'affirmatif et dans une offre polie (Would you like some tea?). <b>any</b> à la négation et à la question (I don't have any money. Have you got any brothers?)."},
    {t:'ex', h:'Exemples', items:[
      ["How much sugar do you need?","Combien de sucre te faut-il ?"],
      ["How many people came?","Combien de personnes sont venues ?"],
      ["There isn't any bread left.","Il ne reste plus de pain."],
      ["I have a few friends here.","J'ai quelques amis ici."],
      ["He has very little time.","Il a très peu de temps."],
      ["There is too much noise.","Il y a trop de bruit."]
    ]},
    {t:'tip', p:"<b>a few</b> = quelques (positif, il y en a). <b>few</b> = peu (négatif, presque rien). La différence change complètement le message : <i>I have a few friends</i> (heureux) vs <i>I have few friends</i> (triste)."}
  ],
  exercises:[
    {t:'qcm', q:'How ___ money do you have?', opts:['many','much','few'], c:1, why:"money est indénombrable → much."},
    {t:'qcm', q:'How ___ students are there?', opts:['many','much','little'], c:0, why:"students est comptable → many."},
    {t:'qcm', q:"I don't have ___ time.", opts:['some','any','a few'], c:1, why:"Négation → any."},
    {t:'qcm', q:'Would you like ___ tea?', opts:['any','some','many'], c:1, why:"Offre polie → some."},
    {t:'fill', q:"« Il y a trop de bruit » → « There is too ___ noise. »", a:['much'], why:"noise indénombrable → too much."},
    {t:'qcm', q:'She has ___ friends — she feels lonely.', opts:['a few','few','a little'], c:1, why:"few = peu, sens négatif."},
    {t:'qcm', q:'Add ___ salt, just a bit.', opts:['a few','a little','many'], c:1, why:"salt indénombrable → a little."},
    {t:'trad', q:"Il ne reste plus de lait.", a:["there isn't any milk left","there is no milk left","there isn't any milk"], why:"There isn't any milk left."},
    {t:'vf', q:"On dit « many informations ».", a:false, why:"information est indénombrable : <i>much information</i>."},
    {t:'order', words:['is','there','enough','not','food'], a:'there is not enough food', why:"There is not enough food."},
    {t:'qcm', q:'We have ___ of work today.', opts:['a lot','much','many'], c:0, why:"a lot of, à l'affirmatif, marche avec tout."},
    {t:'trad', q:"Combien de frères as-tu ?", a:['how many brothers have you got','how many brothers do you have'], why:"How many brothers have you got?"}
  ]
},

{
  id:'a2-6', title:'Formation des mots : préfixes et suffixes', icon:'puzzle', duration:'30 min',
  goal:"Deviner le sens de centaines de mots inconnus en repérant leurs briques de construction.",
  sections:[
    {t:'text', h:'Le principe', p:"Un mot anglais = préfixe (avant) + racine + suffixe (après). <b>un</b> + <b>happi</b> + <b>ness</b> = unhappiness. Si tu connais les briques, tu comprends le mot sans dictionnaire."},
    {t:'table', h:'Préfixes fréquents', head:['Préfixe','Sens','Exemple'], rows:[
      ['un-','contraire','unhappy, unable, unfair'],
      ['in- / im- / il- / ir-','contraire','incorrect, impossible, illegal, irregular'],
      ['dis-','contraire, opposé','disagree, dislike, disappear'],
      ['re-','de nouveau','rewrite, rebuild, return'],
      ['pre-','avant','preview, prepare, prehistoric'],
      ['mis-','mal, de travers','misunderstand, mistake'],
      ['over- / under-','trop / pas assez','overwork, underestimate'],
      ['ex-','ancien','ex-president, ex-wife']
    ]},
    {t:'table', h:'Suffixes fréquents', head:['Suffixe','Crée un…','Exemple'], rows:[
      ['-er / -or','nom de personne','teacher, actor, driver'],
      ['-tion / -sion','nom abstrait','education, decision'],
      ['-ness','nom abstrait','happiness, kindness'],
      ['-ment','nom abstrait','development, agreement'],
      ['-ity','nom abstrait','ability, activity'],
      ['-ful','adjectif « plein de »','careful, useful, beautiful'],
      ['-less','adjectif « sans »','careless, useless, homeless'],
      ['-able / -ible','adjectif « qu’on peut »','readable, possible'],
      ['-ly','adverbe','quickly, carefully'],
      ['-ise / -ize / -en','verbe','modernise, widen']
    ]},
    {t:'ex', h:'Une famille de mots', items:[
      ["care (n./v.) → careful → carefully → careless → carelessness","soin → soigneux → soigneusement → négligent → négligence"],
      ["use → useful → useless → user → usable","utiliser → utile → inutile → utilisateur → utilisable"],
      ["act → action → active → actively → actor","agir → action → actif → activement → acteur"]
    ]},
    {t:'tip', p:"Le suffixe te dit la <b>nature</b> du mot : -ly = adverbe, -ful/-less/-able = adjectif, -tion/-ness/-ment = nom. C'est une aide énorme en compréhension écrite."}
  ],
  exercises:[
    {t:'qcm', q:'un- + happy =', opts:['unhappy','rehappy','happyless'], c:0, why:"unhappy = malheureux."},
    {t:'qcm', q:'re- + write =', opts:['writeless','rewrite','writeful'], c:1, why:"rewrite = réécrire."},
    {t:'qcm', q:'care + -ful =', opts:['careless','careful','carely'], c:1, why:"careful = soigneux."},
    {t:'fill', q:"Contraire de « possible » avec un préfixe :", a:['impossible'], why:"im- devant m/p : impossible."},
    {t:'fill', q:"Contraire de « legal » :", a:['illegal'], why:"il- devant l : illegal."},
    {t:'qcm', q:'Le nom formé sur « happy » est :', opts:['happyness','happiness','happyment'], c:1, why:"y → i + -ness : happiness."},
    {t:'qcm', q:'Une personne qui enseigne est un :', opts:['teachment','teacher','teachful'], c:1, why:"-er = celui qui fait l'action."},
    {t:'qcm', q:'« Homeless » veut dire :', opts:['qui a une maison','sans abri','à la maison'], c:1, why:"-less = sans."},
    {t:'trad', q:"Ce livre est inutile.", a:['this book is useless'], why:"use + -less = useless."},
    {t:'qcm', q:'« Misunderstand » signifie :', opts:['comprendre à nouveau','mal comprendre','comprendre avant'], c:1, why:"mis- = de travers."},
    {t:'fill', q:"Adverbe formé sur « quick » :", a:['quickly'], why:"quick + -ly = quickly."},
    {t:'qcm', q:'« Overwork » signifie :', opts:['trop travailler','sous-travailler','retravailler'], c:0, why:"over- = trop."}
  ]
},

{
  id:'a2-7', title:'Prépositions de temps et de lieu', icon:'link', duration:'28 min',
  goal:"Placer in, on, at et les prépositions de mouvement au bon endroit — la source d'erreurs la plus fréquente à l'écrit.",
  sections:[
    {t:'table', h:'Temps : in / on / at', head:['Préposition','Emploi','Exemples'], rows:[
      ['at','heure précise, moments','at 7 p.m., at night, at noon, at the weekend (UK)'],
      ['on','jour, date','on Monday, on 5 May, on my birthday, on Christmas Day'],
      ['in','mois, saison, année, siècle, durée','in July, in summer, in 2026, in the morning, in two hours']
    ]},
    {t:'table', h:'Lieu : in / on / at', head:['Préposition','Emploi','Exemples'], rows:[
      ['in','à l’intérieur d’un espace','in the room, in Dakar, in a car, in bed'],
      ['on','sur une surface, une ligne','on the table, on the wall, on the bus, on page 5'],
      ['at','un point précis, une adresse','at the door, at home, at school, at 12 Main Street']
    ]},
    {t:'table', h:'Mouvement et position', head:['Préposition','Sens','Exemple'], rows:[
      ['to','vers','I go to school.'],['from','de (origine)','She comes from Mali.'],
      ['into / out of','dans / hors de','He walked into the room.'],
      ['under / over','sous / au-dessus','The cat is under the chair.'],
      ['between / among','entre deux / parmi','between you and me'],
      ['next to / near','à côté de / près de','The bank is next to the school.'],
      ['in front of / behind','devant / derrière','I sat behind him.'],
      ['across / through','à travers','Walk across the street / through the forest.']
    ]},
    {t:'tip', p:"Pièges à mémoriser tels quels : <b>on</b> the bus/train/plane mais <b>in</b> the car ; <b>at</b> home, <b>at</b> work, <b>at</b> school (sans article) ; <b>in</b> the morning mais <b>at</b> night."}
  ],
  exercises:[
    {t:'qcm', q:'The meeting is ___ 3 p.m.', opts:['in','on','at'], c:2, why:"Heure précise → at."},
    {t:'qcm', q:'I was born ___ 1998.', opts:['in','on','at'], c:0, why:"Une année → in."},
    {t:'qcm', q:'See you ___ Monday.', opts:['in','on','at'], c:1, why:"Un jour → on."},
    {t:'qcm', q:'The keys are ___ the table.', opts:['in','on','at'], c:1, why:"Sur une surface → on."},
    {t:'qcm', q:'She lives ___ Dakar.', opts:['in','on','at'], c:0, why:"Une ville → in."},
    {t:'fill', q:"« Je suis à la maison » → « I am ___ home. »", a:['at'], why:"at home, sans article."},
    {t:'qcm', q:'I go ___ school by bus.', opts:['at','to','in'], c:1, why:"Mouvement vers → to."},
    {t:'qcm', q:'He is ___ the bus.', opts:['in','on','at'], c:1, why:"Transports publics → on the bus."},
    {t:'qcm', q:'The bank is ___ the school.', opts:['next to','between','through'], c:0, why:"next to = à côté de."},
    {t:'trad', q:"Le chat est sous la chaise.", a:['the cat is under the chair'], why:"under = sous."},
    {t:'fill', q:"« Je reviens dans deux heures » → « I'll be back ___ two hours. »", a:['in'], why:"in + durée future."},
    {t:'qcm', q:'I study ___ the morning but I work ___ night.', opts:['in / at','at / in','on / at'], c:0, why:"in the morning, at night."}
  ]
},

{
  id:'a2-8', title:'Adverbes de fréquence et routine quotidienne', icon:'ear', duration:'25 min',
  goal:"Décrire ta journée type et placer les adverbes exactement où il faut.",
  sections:[
    {t:'table', h:'Échelle de fréquence', head:['Adverbe','Fréquence','Exemple'], rows:[
      ['always','100 %','I always drink tea.'],['usually','80 %','She usually walks to work.'],
      ['often','60 %','We often meet on Fridays.'],['sometimes','40 %','He sometimes forgets.'],
      ['rarely / seldom','10 %','They rarely eat out.'],['never','0 %','I never smoke.']
    ]},
    {t:'text', h:'Où les placer ?', p:"<b>Avant</b> le verbe principal : <i>I <b>often</b> go out.</i><br><b>Après</b> le verbe to be : <i>She is <b>always</b> late.</i><br><b>Entre</b> l'auxiliaire et le verbe : <i>I have <b>never</b> been to London.</i><br>Les expressions longues (every day, twice a week, once a month) se placent en <b>fin</b> de phrase."},
    {t:'ex', h:'Une journée type', items:[
      ["I get up at 6 and take a shower.","Je me lève à 6 h et je prends une douche."],
      ["I usually have breakfast at 6:30.","Je prends généralement le petit-déjeuner à 6 h 30."],
      ["I leave home at 7 and go to work by bus.","Je pars à 7 h et je vais au travail en bus."],
      ["I have lunch at 1 with my colleagues.","Je déjeune à 13 h avec mes collègues."],
      ["I get back home around 6 p.m.","Je rentre vers 18 h."],
      ["In the evening I study English for an hour.","Le soir j'étudie l'anglais pendant une heure."],
      ["I go to bed at about 11.","Je me couche vers 23 h."]
    ]},
    {t:'tip', p:"<b>never</b> est déjà négatif : on ne dit pas <i>I don't never</i>. Une seule négation par phrase en anglais."}
  ],
  exercises:[
    {t:'qcm', q:'She ___ goes to bed before midnight.', opts:['never','not','no'], c:0, why:"never = jamais, placé avant le verbe."},
    {t:'qcm', q:'Quel ordre est correct ?', opts:['I go always to church.','I always go to church.','Always I go to church.'], c:1, why:"Avant le verbe principal."},
    {t:'qcm', q:'She ___ late for class.', opts:['always is','is always','always'], c:1, why:"Après le verbe be."},
    {t:'fill', q:"« Je ne fume jamais » → « I ___ smoke. »", a:['never'], why:"I never smoke."},
    {t:'order', words:['often','we','meet','Fridays','on'], a:'we often meet on fridays', why:"We often meet on Fridays."},
    {t:'qcm', q:'They go to the gym twice ___ week.', opts:['a','the','in'], c:0, why:"twice a week = deux fois par semaine."},
    {t:'vf', q:"« I don't never eat meat » est correct.", a:false, why:"Double négation interdite : <i>I never eat meat.</i>"},
    {t:'trad', q:"Je me lève généralement à six heures.", a:['i usually get up at six','i usually get up at 6',"i usually wake up at six"], why:"I usually get up at six."},
    {t:'qcm', q:'How ___ do you go to the cinema?', opts:['much','often','many'], c:1, why:"How often = à quelle fréquence."},
    {t:'fill', q:"Le contraire de « always » :", a:['never'], why:"always ↔ never."},
    {t:'qcm', q:'I have ___ been to Europe.', opts:['never','not never','no'], c:0, why:"Entre l'auxiliaire et le participe : have never been."},
    {t:'trad', q:"Elle est toujours en retard.", a:['she is always late',"she's always late"], why:"She is always late."}
  ]
}

];
