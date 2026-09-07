/* Forever Academy — Cours niveau C1 (maîtrise) */
window.COURSES = window.COURSES || {};
window.COURSES.C1 = [

{
  id:'c1-1', title:"Inversion, emphase et mise en relief", icon:'feather', duration:'35 min',
  goal:"Donner du relief à ton anglais avec les structures que les correcteurs d'examen récompensent.",
  sections:[
    {t:'text', h:"L'inversion après un adverbe négatif", p:"Quand une phrase commence par un adverbe négatif ou restrictif, on inverse l'auxiliaire et le sujet, comme dans une question : <i>Never <b>have I</b> seen such a thing.</i>"},
    {t:'table', h:'Les déclencheurs', head:['Expression','Exemple'], rows:[
      ['Never / Rarely / Seldom','Rarely does he complain.'],
      ['Hardly … when / No sooner … than','No sooner had I closed the door than the phone rang.'],
      ['Not only … but also','Not only was he late, but he also forgot the files.'],
      ['Little','Little did she know that she was being watched.'],
      ['Under no circumstances','Under no circumstances should you open it.'],
      ['Only then / Only after','Only then did I understand.'],
      ['Not until','Not until midnight did they arrive.']
    ]},
    {t:'text', h:'Les phrases clivées (cleft sentences)', p:"Pour souligner un élément :<br><b>It is … that/who</b> : <i>It was in 2019 that she moved to London.</i><br><b>What … is</b> : <i>What I need is a break.</i><br><b>The reason why … is</b> : <i>The reason why he left is simple.</i><br><b>All … is</b> : <i>All I want is peace.</i>"},
    {t:'text', h:'Les structures conditionnelles inversées', p:"On peut supprimer <b>if</b> et inverser : <i><b>Had I known</b>, I would have come</i> (= If I had known). <i><b>Should you need</b> help, call me</i> (= If you should need). <i><b>Were I</b> you, I would accept</i> (= If I were you). Registre soutenu, très apprécié à l'écrit."},
    {t:'tip', p:"N'abuse pas de l'inversion : une ou deux par texte suffisent à montrer la maîtrise. Trop, et le texte devient artificiel."}
  ],
  exercises:[
    {t:'qcm', q:'___ had I closed the door than the phone rang.', opts:['No sooner','Hardly when','Not only'], c:0, why:"No sooner … than."},
    {t:'qcm', q:'Little ___ that she was being watched.', opts:['she knew','did she know','knew she'], c:1, why:"Après « Little », inversion obligatoire."},
    {t:'qcm', q:'Not only ___ late, but he also forgot the files.', opts:['he was','was he','he is'], c:1, why:"Not only + inversion."},
    {t:'qcm', q:'It was in 2019 ___ she moved to London.', opts:['when','that','which'], c:1, why:"Phrase clivée : It was … that."},
    {t:'fill', q:"Réécris sans if : « If I had known… » → « ___ I known… »", a:['had'], why:"Had I known…"},
    {t:'qcm', q:'___ you need help, please call me.', opts:['Should','Would','Will'], c:0, why:"Should you need = If you should need."},
    {t:'trad', q:"Ce dont j'ai besoin, c'est de temps.", a:['what i need is time'], why:"What I need is time."},
    {t:'qcm', q:'Under no circumstances ___ the door.', opts:['you should open','should you open','you open'], c:1, why:"Inversion après une expression négative en tête."},
    {t:'order', words:['have','never','such','I','seen','courage'], a:'never have i seen such courage', why:"Never have I seen such courage."},
    {t:'vf', q:"L'inversion après « Rarely » est facultative.", a:false, why:"En tête de phrase, l'adverbe négatif impose l'inversion."},
    {t:'qcm', q:'Only after the meeting ___ the truth.', opts:['I learned','did I learn','I did learn'], c:1, why:"Only after + inversion."},
    {t:'trad', q:"Si j'étais vous, j'accepterais.", a:['were i you i would accept','if i were you i would accept'], why:"Were I you, I would accept."}
  ]
},

{
  id:'c1-2', title:'Subjonctif et structures formelles', icon:'shield', duration:'30 min',
  goal:"Manier les formes que l'anglais réserve au registre administratif, juridique et académique.",
  sections:[
    {t:'text', h:'Le subjonctif présent', p:"Après les verbes et adjectifs d'exigence, on emploie l'<b>infinitif nu</b>, quelle que soit la personne : <i>The committee recommended that he <b>resign</b></i> (pas « resigns »). Négatif : <i>… that he <b>not resign</b></i>."},
    {t:'table', h:'Les déclencheurs', head:['Verbes','Adjectifs','Noms'], rows:[
      ['suggest, recommend, demand','It is essential that…','the demand that…'],
      ['insist, propose, request','It is vital that…','the suggestion that…'],
      ['order, require, urge','It is important that…','the requirement that…']
    ]},
    {t:'text', h:'Le subjonctif passé (were)', p:"<i>If he <b>were</b> here… / I wish it <b>were</b> possible. / He speaks as if he <b>were</b> the boss.</i> Le <b>were</b> à toutes les personnes marque l'irréel, pas le passé."},
    {t:'text', h:'Autres tournures formelles', p:"<b>Should</b> hypothétique : <i>Should any problem arise, contact us.</i><br><b>May</b> de souhait : <i>May you find peace.</i><br><b>Lest</b> (rare, très soutenu) : <i>He spoke softly lest he wake the child.</i>"},
    {t:'tip', p:"En anglais britannique, on rencontre aussi <i>The committee recommended that he <b>should</b> resign</i>. Les deux formes sont correctes ; la forme sans should est la norme américaine et la plus concise."}
  ],
  exercises:[
    {t:'qcm', q:'The committee recommended that he ___ immediately.', opts:['resigns','resign','resigned'], c:1, why:"Subjonctif → infinitif nu."},
    {t:'qcm', q:'It is essential that every student ___ on time.', opts:['is','be','was'], c:1, why:"It is essential that … be."},
    {t:'qcm', q:'She insisted that he ___ the truth.', opts:['tells','tell','told'], c:1, why:"insist that + subjonctif."},
    {t:'qcm', q:'He speaks as if he ___ the manager.', opts:['is','was','were'], c:2, why:"Irréel → were."},
    {t:'fill', q:"« I wish it ___ possible » (subjonctif) :", a:['were'], why:"I wish it were possible."},
    {t:'qcm', q:'___ any problem arise, contact the office.', opts:['Should','Would','Might'], c:0, why:"Should hypothétique en tête de phrase."},
    {t:'trad', q:"Il est vital qu'elle soit informée.", a:['it is vital that she be informed',"it's vital that she be informed"], why:"It is vital that she be informed."},
    {t:'qcm', q:'Forme négative du subjonctif :', opts:["that he doesn't resign",'that he not resign','that he no resign'], c:1, why:"… that he not resign."},
    {t:'vf', q:"Le subjonctif anglais prend un -s à la 3ᵉ personne.", a:false, why:"Non, c'est l'infinitif nu : <i>that he resign</i>."},
    {t:'order', words:['that','demanded','they','be','the','revised','report'], a:'they demanded that the report be revised', why:"They demanded that the report be revised."},
    {t:'qcm', q:'Quel registre correspond au subjonctif ?', opts:['familier','formel / administratif','argotique'], c:1, why:"Registre formel, juridique, académique."},
    {t:'qcm', q:'The law requires that every citizen ___ registered.', opts:['is','be','being'], c:1, why:"require that … be."}
  ]
},

{
  id:'c1-3', title:"Nuances de l'aspect et des temps", icon:'clock', duration:'35 min',
  goal:"Percevoir les différences fines que les temps portent : durée, résultat, distance psychologique.",
  sections:[
    {t:'table', h:'Perfect simple vs perfect continu', head:['Forme','Insiste sur','Exemple'], rows:[
      ['I have read three books.','le résultat, la quantité','(elles sont finies)'],
      ['I have been reading all day.','la durée, l’activité','(peut-être pas fini)'],
      ['She had worked there for years.','le bilan','(fait établi)'],
      ['She had been working when it happened.','le contexte en cours','']
    ]},
    {t:'text', h:'Le passé de distanciation', p:"Le past simple ne marque pas que le passé : il marque aussi la <b>distance</b> — politesse (<i>I was wondering if you could help</i>), irréel (<i>If I had time</i>), doute (<i>It's time we left</i>). Cette valeur explique beaucoup de constructions apparemment illogiques."},
    {t:'text', h:'Le futur vu du passé', p:"<i>He was going to call, but he forgot.</i> (intention non réalisée)<br><i>She was about to leave when I arrived.</i> (imminence)<br><i>The meeting was to be held on Friday.</i> (arrangement officiel)"},
    {t:'text', h:'Used to, would, be used to', p:"<b>used to + infinitif</b> : habitude passée révolue (<i>I used to smoke</i>).<br><b>would + infinitif</b> : habitude passée répétée, dans un récit (<i>Every summer we would go to the coast</i>) — jamais pour un état.<br><b>be used to + -ing</b> : être habitué à (<i>I'm used to working late</i>)."},
    {t:'tip', p:"<i>I used to live there</i> (avant, plus maintenant) ≠ <i>I'm used to living there</i> (j'y suis habitué). La confusion des deux est un marqueur net de niveau."}
  ],
  exercises:[
    {t:'qcm', q:"I've been ___ all morning; I'm exhausted.", opts:['worked','working','work'], c:1, why:"Durée → perfect continu."},
    {t:'qcm', q:"I've ___ three chapters today.", opts:['been reading','read','reading'], c:1, why:"Résultat chiffré → perfect simple."},
    {t:'qcm', q:'I ___ smoke, but I stopped last year.', opts:['used to','use to','am used to'], c:0, why:"Habitude révolue → used to."},
    {t:'qcm', q:"I'm used to ___ late.", opts:['work','working','worked'], c:1, why:"be used to + -ing."},
    {t:'qcm', q:'She ___ leave when the phone rang.', opts:['was about to','used to','would'], c:0, why:"Imminence → be about to."},
    {t:'qcm', q:"I ___ if you could help me. (poli)", opts:['wonder','was wondering','wondered'], c:1, why:"Passé de distanciation = politesse."},
    {t:'vf', q:"« Would » peut exprimer un état passé habituel (« I would be happy then »).", a:false, why:"would ne s'emploie que pour des actions répétées, pas des états : on dit <i>I used to be happy</i>."},
    {t:'trad', q:"J'ai l'habitude de me lever tôt.", a:["i'm used to getting up early",'i am used to getting up early'], why:"be used to + -ing."},
    {t:'qcm', q:"It's time we ___.", opts:['leave','left','will leave'], c:1, why:"It's time + past simple (valeur d'irréel)."},
    {t:'order', words:['to','was','he','call','going'], a:'he was going to call', why:"He was going to call (mais il ne l'a pas fait)."},
    {t:'qcm', q:'Every summer we ___ go to the sea.', opts:['would','are used to','have'], c:0, why:"Habitude passée répétée dans un récit → would."},
    {t:'qcm', q:'The ceremony ___ be held tomorrow.', opts:['is to','was to','will to'], c:0, why:"be to = arrangement officiel."}
  ]
},

{
  id:'c1-4', title:'Registres : formel, neutre, familier', icon:'chat', duration:'32 min',
  goal:"Adapter ton anglais à ton interlocuteur — l'erreur de registre est plus visible qu'une faute de grammaire.",
  sections:[
    {t:'table', h:'Le même message, trois registres', head:['Familier','Neutre','Formel'], rows:[
      ['Sorry, can’t make it.','I’m sorry, I can’t come.','I regret that I shall be unable to attend.'],
      ['What’s up?','How are you?','I trust this email finds you well.'],
      ['I need to sort this out.','I need to solve this.','This matter requires resolution.'],
      ['Give me a call.','Call me.','Please do not hesitate to contact me.'],
      ['Loads of people','Many people','A considerable number of individuals'],
      ['It’s a big deal.','It’s important.','It is of considerable significance.']
    ]},
    {t:'text', h:'Les marqueurs de formalité', p:"Le registre formel préfère les mots d'origine <b>latine</b> (obtain, commence, purchase, require, assist) au verbe à particule d'origine germanique (get, start, buy, need, help). Il évite les contractions, les questions rhétoriques et les points d'exclamation."},
    {t:'text', h:"L'anglais parlé authentique", p:"À l'oral naturel, on emploie des <b>fillers</b> (well, you know, I mean, actually), des <b>hedges</b> (kind of, sort of, a bit), et des <b>tag questions</b> (<i>It's cold, isn't it?</i>). Les maîtriser rend l'oral fluide et naturel — mais ils n'ont pas leur place à l'écrit formel."},
    {t:'text', h:'Les question tags', p:"Affirmatif → tag négatif : <i>You're coming, aren't you?</i> Négatif → tag positif : <i>He isn't ready, is he?</i> Exceptions : <i>I am, aren't I?</i> et <i>Let's go, shall we?</i>"},
    {t:'tip', p:"En entretien ou à l'examen oral, vise le <b>neutre</b> : ni argot ni jargon administratif. Le neutre passe partout."}
  ],
  exercises:[
    {t:'qcm', q:'Version formelle de « buy » :', opts:['get','purchase','pick up'], c:1, why:"purchase = registre formel."},
    {t:'qcm', q:'Version formelle de « help » :', opts:['assist','give a hand','back up'], c:0, why:"assist = formel."},
    {t:'qcm', q:'Formule la plus formelle :', opts:['Give me a call.','Call me.','Please do not hesitate to contact me.'], c:2, why:"Registre administratif."},
    {t:'qcm', q:"Tag correct : « You're coming, ___ ? »", opts:["aren't you",'are you',"don't you"], c:0, why:"Affirmatif → tag négatif."},
    {t:'qcm', q:'Tag correct : « He isn’t ready, ___ ? »', opts:["isn't he",'is he','does he'], c:1, why:"Négatif → tag positif."},
    {t:'qcm', q:'Tag correct : « I am late, ___ ? »', opts:["amn't I","aren't I",'am I'], c:1, why:"Exception figée : aren't I."},
    {t:'vf', q:"Les contractions sont acceptées dans un rapport officiel.", a:false, why:"On les évite en style formel."},
    {t:'trad', q:"Je vous serais reconnaissant de me répondre rapidement.", a:['i would be grateful if you could reply promptly','i would be grateful if you could answer promptly'], why:"I would be grateful if you could reply promptly."},
    {t:'qcm', q:'« Kind of » et « sort of » servent à :', opts:['atténuer','insister','conclure'], c:0, why:"Ce sont des hedges, ils nuancent."},
    {t:'qcm', q:'Registre de « What’s up? » :', opts:['formel','neutre','familier'], c:2, why:"Très familier."},
    {t:'order', words:['shall','go',"let's",'we'], a:"let's go shall we", why:"Let's go, shall we?"},
    {t:'qcm', q:'Version formelle de « start » :', opts:['commence','kick off','get going'], c:0, why:"commence = formel."}
  ]
},

{
  id:'c1-5', title:'Figures de style et anglais littéraire', icon:'feather', duration:'35 min',
  goal:"Reconnaître et employer les procédés qui donnent de la force à un texte : métaphore, ironie, litote, allitération.",
  sections:[
    {t:'table', h:'Les figures essentielles', head:['Figure','Définition','Exemple'], rows:[
      ['Simile','comparaison avec like / as','as brave as a lion'],
      ['Metaphor','identification directe','Time is a thief.'],
      ['Personification','une chose devient humaine','The wind whispered.'],
      ['Hyperbole','exagération volontaire','I’ve told you a million times.'],
      ['Understatement / litotes','atténuation ironique','It’s not bad. (= excellent)'],
      ['Irony','on dit le contraire de ce qu’on pense','What lovely weather! (sous la pluie)'],
      ['Alliteration','répétition de sons','Peter Piper picked a peck…'],
      ['Oxymoron','deux termes contraires','a deafening silence'],
      ['Metonymy','la partie pour le tout','The White House said…']
    ]},
    {t:'text', h:'La litote britannique', p:"L'<b>understatement</b> est une signature culturelle : <i>a bit of a problem</i> pour une catastrophe, <i>not bad at all</i> pour un exploit, <i>I wouldn't say no</i> pour « avec grand plaisir ». Ne prends jamais ces formules au pied de la lettre."},
    {t:'ex', h:'Analyser', items:[
      ["Hope is the thing with feathers. (Dickinson)","Métaphore : l'espoir devient oiseau."],
      ["The stars danced in the sky.","Personnification."],
      ["I could eat a horse.","Hyperbole : j'ai très faim."],
      ["It's only a scratch. (sur une blessure grave)","Understatement ironique."]
    ]},
    {t:'tip', p:"En commentaire de texte, ne te contente pas de nommer la figure : dis toujours <b>quel effet</b> elle produit sur le lecteur. C'est ce qui est noté."}
  ],
  exercises:[
    {t:'qcm', q:'« Time is a thief » est :', opts:['une comparaison','une métaphore','une hyperbole'], c:1, why:"Identification directe, sans like/as → métaphore."},
    {t:'qcm', q:'« As brave as a lion » est :', opts:['a simile','a metaphor','an oxymoron'], c:0, why:"Avec « as » → simile."},
    {t:'qcm', q:'« A deafening silence » est :', opts:['une litote','un oxymore','une métonymie'], c:1, why:"Deux termes contradictoires."},
    {t:'qcm', q:'« The wind whispered » est :', opts:['une personnification','une hyperbole','une ironie'], c:0, why:"Le vent reçoit une action humaine."},
    {t:'qcm', q:"« It's not bad at all » à propos d'un chef-d'œuvre est :", opts:['une hyperbole','un understatement','une métaphore'], c:1, why:"Atténuation typiquement britannique."},
    {t:'qcm', q:'« The White House announced… » est :', opts:['une métonymie','une allitération','un oxymore'], c:0, why:"Le lieu pour l'institution."},
    {t:'qcm', q:"« I've told you a million times » est :", opts:['une litote','une hyperbole','une ironie'], c:1, why:"Exagération volontaire."},
    {t:'fill', q:"Nom anglais de la comparaison avec « like » :", a:['simile','a simile'], why:"simile."},
    {t:'vf', q:"L'ironie consiste à dire le contraire de ce qu'on pense.", a:true, why:"Oui, avec un signal de ton ou de contexte."},
    {t:'qcm', q:"Dans « Peter Piper picked a peck of pickled peppers », le procédé est :", opts:['allitération','assonance','métaphore'], c:0, why:"Répétition de la consonne initiale."},
    {t:'trad', q:"Ce silence était assourdissant.", a:['that silence was deafening','the silence was deafening'], why:"The silence was deafening."},
    {t:'qcm', q:"En commentaire, après avoir nommé une figure, il faut :", opts:['passer à la suivante',"expliquer son effet",'la traduire'], c:1, why:"L'effet produit est ce qui compte."}
  ]
},

{
  id:'c1-6', title:'Expressions idiomatiques avancées', icon:'puzzle', duration:'35 min',
  goal:"Comprendre l'anglais des médias, des séries et des réunions professionnelles.",
  sections:[
    {t:'table', h:'Monde professionnel', head:['Expression','Sens'], rows:[
      ['to touch base','reprendre contact brièvement'],['to think outside the box','sortir des sentiers battus'],
      ['to get the ball rolling','lancer le processus'],['to be on the same page','être d’accord'],
      ['to cut corners','bâcler pour gagner du temps'],['to go the extra mile','faire un effort supplémentaire'],
      ['a ballpark figure','une estimation approximative'],['to put something on the back burner','mettre de côté'],
      ['to bite off more than you can chew','voir trop grand'],['the bottom line','l’essentiel, le résultat final']
    ]},
    {t:'table', h:'Vie quotidienne et médias', head:['Expression','Sens'], rows:[
      ['to jump on the bandwagon','suivre la mode'],['to be a blessing in disguise','un mal pour un bien'],
      ['to add insult to injury','pour couronner le tout'],['to take something with a pinch of salt','ne pas prendre au pied de la lettre'],
      ['to be caught red-handed','être pris la main dans le sac'],['to sit on the fence','ne pas prendre parti'],
      ['to beat around the bush','tourner autour du pot'],['to cost a fortune','coûter une fortune'],
      ['to be under the weather','être patraque'],['to burn the midnight oil','travailler tard dans la nuit'],
      ['to read between the lines','lire entre les lignes'],['to play devil’s advocate','se faire l’avocat du diable']
    ]},
    {t:'tip', p:"Un idiome mal placé fait plus de dégâts qu'un mot simple. Vérifie toujours le registre : <i>touch base</i> passe en réunion, pas dans une lettre officielle."}
  ],
  exercises:[
    {t:'qcm', q:'“To beat around the bush” means to ___.', opts:['aller droit au but','tourner autour du pot','se battre'], c:1, why:"Éviter le sujet."},
    {t:'qcm', q:'“A blessing in disguise” is ___.', opts:['un mal pour un bien','une malédiction','une bénédiction évidente'], c:0, why:"Un événement négatif qui se révèle positif."},
    {t:'qcm', q:'“To cut corners” means to ___.', opts:['faire un détour','bâcler','tourner à l’angle'], c:1, why:"Économiser du temps au détriment de la qualité."},
    {t:'qcm', q:'“To be on the same page” means ___.', opts:['lire le même livre','être d’accord','être en retard'], c:1, why:"Partager la même compréhension."},
    {t:'qcm', q:'“To take it with a pinch of salt” means ___.', opts:['ajouter du sel','douter un peu','y croire fort'], c:1, why:"Ne pas prendre pour argent comptant."},
    {t:'fill', q:"« travailler tard dans la nuit » → « to burn the midnight ___ »", a:['oil'], why:"to burn the midnight oil."},
    {t:'qcm', q:'“To sit on the fence” means to ___.', opts:['choisir un camp','rester neutre','se reposer'], c:1, why:"Refuser de trancher."},
    {t:'qcm', q:'“The bottom line” is ___.', opts:['la dernière ligne','l’essentiel','le bas de page'], c:1, why:"Le point essentiel, le résultat."},
    {t:'trad', q:"Il a été pris la main dans le sac.", a:['he was caught red-handed','he was caught red handed'], why:"caught red-handed."},
    {t:'qcm', q:'“To go the extra mile” means to ___.', opts:['marcher plus loin','en faire plus que demandé','abandonner'], c:1, why:"Faire un effort supplémentaire."},
    {t:'qcm', q:'“To play devil’s advocate” means to ___.', opts:['défendre le mal','soutenir la thèse adverse pour tester','plaider au tribunal'], c:1, why:"Argumenter contre par méthode."},
    {t:'fill', q:"« être patraque » → « to be under the ___ »", a:['weather'], why:"under the weather."}
  ]
},

{
  id:'c1-7', title:'Lecture critique, résumé et synthèse', icon:'book', duration:'40 min',
  goal:"Extraire l'essentiel d'un texte, repérer le point de vue de l'auteur et le reformuler sans le copier.",
  sections:[
    {t:'text', h:'Trois niveaux de lecture', p:"<b>Skimming</b> : parcourir pour saisir l'idée générale (titres, première et dernière phrase de chaque paragraphe).<br><b>Scanning</b> : chercher une information précise (chiffre, nom, date).<br><b>Close reading</b> : analyser le choix des mots, le ton, l'implicite."},
    {t:'text', h:"Repérer le point de vue", p:"Le vocabulaire trahit la position de l'auteur : <i>claim</i> (prétendre) marque le doute, <i>demonstrate</i> l'adhésion ; <i>merely, allegedly, so-called</i> signalent la distance ; <i>undoubtedly, clearly</i> signalent l'engagement."},
    {t:'text', h:"Écrire un résumé", p:"Règles : garder l'ordre des idées, supprimer exemples et répétitions, <b>reformuler</b> (jamais copier plus de trois mots à la suite), rester neutre (pas de « I think »), respecter la longueur demandée (souvent 1/4 du texte)."},
    {t:'table', h:'Verbes pour rapporter une thèse', head:['Verbe','Nuance'], rows:[
      ['argues that','soutient (avec arguments)'],['claims that','prétend (l’auteur doute)'],
      ['points out that','fait remarquer (fait établi)'],['suggests that','suggère (prudent)'],
      ['acknowledges that','reconnaît (concession)'],['warns that','met en garde'],
      ['emphasises that','insiste sur'],['concludes that','conclut']
    ]},
    {t:'tip', p:"Un bon résumé se reconnaît à ceci : quelqu'un qui n'a pas lu le texte original comprend la thèse, la structure et la conclusion en le lisant."}
  ],
  exercises:[
    {t:'qcm', q:'« Skimming » consiste à :', opts:["chercher une info précise","parcourir pour l'idée générale",'analyser chaque mot'], c:1, why:"Lecture rapide de survol."},
    {t:'qcm', q:'« Scanning » consiste à :', opts:['chercher une information précise','lire lentement','résumer'], c:0, why:"Repérage ciblé."},
    {t:'qcm', q:'« The author claims that… » suggère que l’auteur du résumé :', opts:['adhère','doute','ignore'], c:1, why:"claim marque une distance critique."},
    {t:'qcm', q:'Dans un résumé, on doit :', opts:['citer de longues phrases','reformuler','donner son avis'], c:1, why:"La reformulation est la règle."},
    {t:'vf', q:"Un résumé peut commencer par « In my opinion ».", a:false, why:"Le résumé reste neutre : pas d'avis personnel."},
    {t:'qcm', q:'« So-called » indique :', opts:['une approbation','une distance ironique','une définition'], c:1, why:"L'auteur met le terme à distance."},
    {t:'qcm', q:'Quel verbe traduit « fait remarquer » ?', opts:['points out','claims','warns'], c:0, why:"point out = faire remarquer un fait."},
    {t:'trad', q:"L'auteur soutient que l'éducation est la clé.", a:['the author argues that education is the key','the author argues that education is key'], why:"The author argues that education is the key."},
    {t:'qcm', q:'Un résumé fait généralement :', opts:['la même longueur','un quart du texte','le double'], c:1, why:"Environ 1/4, sauf consigne contraire."},
    {t:'qcm', q:'Où trouve-t-on souvent la thèse dans un article ?', opts:['dans le titre et l’introduction','au milieu','nulle part'], c:0, why:"Titre, chapeau et introduction."},
    {t:'fill', q:"Verbe pour « met en garde » :", a:['warns','warn'], why:"The author warns that…"},
    {t:'qcm', q:'« Undoubtedly » marque :', opts:['un doute','un engagement fort','une question'], c:1, why:"L'auteur s'engage."}
  ]
},

{
  id:'c1-8', title:'Prise de parole : débat, présentation, entretien', icon:'ear', duration:'40 min',
  goal:"Structurer une intervention orale, défendre une position et réagir aux objections avec assurance.",
  sections:[
    {t:'text', h:'Structurer une présentation', p:"<b>Ouverture</b> : Good morning everyone. Today I'd like to talk about…<br><b>Annonce du plan</b> : I'll divide my talk into three parts…<br><b>Transitions</b> : Let's move on to… / This brings me to my second point…<br><b>Conclusion</b> : To conclude… / Thank you for your attention. I'm happy to take questions."},
    {t:'table', h:'Débattre', head:['Fonction','Formules'], rows:[
      ['Donner son avis','As I see it… / From where I stand…'],
      ['Approuver','That’s a fair point. / I couldn’t agree more.'],
      ['Nuancer','I see your point, but… / That may be true up to a point.'],
      ['Contredire poliment','I’m afraid I have to disagree. / With respect, that overlooks…'],
      ['Gagner du temps','That’s an interesting question. Let me think…'],
      ['Reformuler','So what you’re saying is… / If I understand correctly…'],
      ['Interrompre','Sorry to interrupt, but… / May I come in here?']
    ]},
    {t:'text', h:"L'entretien d'embauche", p:"Trois questions inévitables : <i>Tell me about yourself</i> (2 minutes : parcours → compétence clé → pourquoi ce poste), <i>What are your strengths and weaknesses?</i> (une faiblesse réelle + ce que tu fais pour la corriger), <i>Where do you see yourself in five years?</i> (ambition alignée avec le poste)."},
    {t:'text', h:'Fluidité', p:"Quatre leviers : la <b>pause</b> (elle vaut mieux que « euh »), l'<b>accent de phrase</b> (souligne le mot porteur de sens), le <b>rythme</b> (l'anglais compresse les mots grammaticaux), et la <b>reformulation</b> (si un mot manque, contourne-le au lieu de bloquer)."},
    {t:'tip', p:"Enregistre-toi deux minutes par jour et réécoute-toi. C'est la méthode la plus rapide pour corriger la prononciation et le débit — bien plus efficace que d'écouter passivement."}
  ],
  exercises:[
    {t:'qcm', q:'Formule pour contredire poliment :', opts:["You're wrong.","I'm afraid I have to disagree.","That's stupid."], c:1, why:"Registre poli et professionnel."},
    {t:'qcm', q:'Formule de transition dans une présentation :', opts:['Let’s move on to…','By the way…','Whatever…'], c:0, why:"Transition claire."},
    {t:'qcm', q:'« I couldn’t agree more » signifie :', opts:['je suis totalement d’accord','je ne suis pas d’accord','je doute'], c:0, why:"Accord total."},
    {t:'qcm', q:'Pour reformuler ce que dit l’autre :', opts:['So what you’re saying is…','Never mind.','Anyway.'], c:0, why:"Reformulation active."},
    {t:'qcm', q:'Pour interrompre poliment :', opts:['May I come in here?','Stop talking.','Listen to me.'], c:0, why:"Formule polie d'interruption."},
    {t:'vf', q:"Faire une pause vaut mieux que dire « euh ».", a:true, why:"La pause est perçue comme de la maîtrise."},
    {t:'trad', q:"Je vois ce que vous voulez dire, mais…", a:['i see your point but','i see what you mean but'], why:"I see your point, but…"},
    {t:'qcm', q:'À « Tell me about yourself », il faut répondre :', opts:['sa biographie complète','parcours, compétence clé, motivation','ses loisirs'], c:1, why:"Réponse structurée en 2 minutes."},
    {t:'qcm', q:'Pour conclure une présentation :', opts:['To conclude…','And so on…','That’s it.'], c:0, why:"Conclusion professionnelle."},
    {t:'order', words:['to','talk','like','about',"I'd",'today'], a:"today i'd like to talk about", why:"Today I'd like to talk about…"},
    {t:'qcm', q:'Quel levier améliore le plus la fluidité ?', opts:['parler plus vite','s’enregistrer et se réécouter','apprendre plus de mots'], c:1, why:"L'auto-écoute corrige ce qu'on n'entend pas en parlant."},
    {t:'qcm', q:'« That may be true up to a point » sert à :', opts:['approuver totalement','nuancer','refuser de répondre'], c:1, why:"Concession partielle."}
  ]
}

];
