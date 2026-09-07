/* Forever Academy — Cours niveau A1 (débutant) */
window.COURSES = window.COURSES || {};
window.COURSES.A1 = [

/* ---------------------------------------------------------- 1 */
{
  id:'a1-1', title:"L'alphabet et les sons de l'anglais", icon:'ear', duration:'25 min',
  goal:"Prononcer les 26 lettres, reconnaître les sons anglais qui n'existent pas en français et éviter les 6 erreurs classiques des francophones.",
  sections:[
    {t:'text', h:"Pourquoi commencer par les sons ?", p:"En anglais, on n'écrit pas ce qu'on entend. Le mot <b>through</b> a 7 lettres et seulement 3 sons. Si tu apprends d'abord les sons, tu liras plus vite, tu comprendras mieux à l'oral et surtout on te comprendra. Écoute chaque exemple avec le bouton 🔊 puis répète à voix haute."},
    {t:'table', h:"L'alphabet et sa prononciation", head:['Lettre','Se dit','Lettre','Se dit'], rows:[
      ['A','eï','N','ène'],['B','bi','O','ow'],['C','si','P','pi'],['D','di','Q','kyou'],
      ['E','i','R','ar'],['F','èf','S','èss'],['G','dji','T','ti'],['H','eïtch','U','you'],
      ['I','aï','V','vi'],['J','djeï','W','dabeul-you'],['K','keï','X','èks'],['L','èl','Y','waï'],
      ['M','èm','Z','zèd / zi']
    ]},
    {t:'text', h:"Les 6 sons qui posent problème aux francophones", p:"Ces sons n'existent pas en français. Travaille-les une minute par jour, la différence s'entend en une semaine."},
    {t:'table', h:'', head:['Son','Comment le faire','Exemples'], rows:[
      ['/θ/ (th sourd)','Langue entre les dents, on souffle','think, three, mouth'],
      ['/ð/ (th sonore)','Même position, la voix vibre','this, that, mother'],
      ['/h/','Un souffle réel (jamais muet)','house, happy, behind'],
      ['/r/','Langue reculée, ne roule pas','red, car, sorry'],
      ['/ɪ/ vs /iː/','Court et relâché vs long et tendu','ship / sheep, live / leave'],
      ['/ŋ/ (-ing)','Le son passe par le nez, pas de « g » final','singing, morning']
    ]},
    {t:'ex', h:'Écoute et répète', items:[
      ['Think about three things.',"Pense à trois choses."],
      ['This is my mother.',"Voici ma mère."],
      ['I live in a big house.',"J'habite dans une grande maison."],
      ['The ship is a sheep? No!',"Le bateau est un mouton ? Non !"],
      ['Good morning, I am happy.',"Bonjour, je suis content."]
    ]},
    {t:'tip', p:"Le <b>-s</b> final se prononce /s/ après un son sourd (books), /z/ après un son sonore (dogs) et /ɪz/ après s, ch, sh, x (buses, watches)."},
    {t:'vocab', h:'Vocabulaire de la leçon', items:[
      ['hello','bonjour'],['goodbye','au revoir'],['please',"s'il te plaît"],['thank you','merci'],
      ['sorry','désolé'],['yes / no','oui / non'],['my name is…','je m’appelle…'],['nice to meet you','enchanté']
    ]}
  ],
  exercises:[
    {t:'qcm', q:"Dans « think », le son <b>th</b> est…", opts:['sourd (on souffle)','sonore (la voix vibre)','muet'], c:0, why:"think, three, thank : th sourd /θ/. La voix ne vibre pas."},
    {t:'qcm', q:"Dans « mother », le son <b>th</b> est…", opts:['sourd','sonore','prononcé comme un t'], c:1, why:"mother, this, that : th sonore /ð/, la gorge vibre."},
    {t:'qcm', q:"Comment se prononce la lettre <b>H</b> dans « house » ?", opts:["Elle est muette comme en français","On souffle réellement","Comme un k"], c:1, why:"Le h anglais est toujours soufflé : <i>house, hat, happy</i>. Sauf rares exceptions (hour, honest)."},
    {t:'vf', q:"En anglais, on prononce toutes les lettres qu'on écrit.", a:false, why:"Non : <i>know</i> (le k est muet), <i>write</i> (le w est muet), <i>island</i> (le s est muet)."},
    {t:'qcm', q:"Quel mot a une voyelle <b>longue</b> /iː/ ?", opts:['ship','sheep','sit'], c:1, why:"sheep = /ʃiːp/ (long). ship et sit ont la voyelle courte /ɪ/."},
    {t:'fill', q:"Complète : « ___ you very much » (merci beaucoup).", a:['thank'], why:"Thank you very much."},
    {t:'qcm', q:"La lettre <b>W</b> se dit :", opts:['vé','dabeul-you','doubl-vé'], c:1, why:"W = « double-u » /ˈdʌbəl.juː/."},
    {t:'qcm', q:"Dans « books », le <b>-s</b> se prononce :", opts:['/s/','/z/','/ɪz/'], c:0, why:"Après le son sourd /k/, le -s se prononce /s/."},
    {t:'qcm', q:"Dans « dogs », le <b>-s</b> se prononce :", opts:['/s/','/z/','/ɪz/'], c:1, why:"Après le son sonore /g/, le -s se prononce /z/."},
    {t:'trad', q:"Bonjour, je m'appelle Amina.", a:['hello my name is amina','hi my name is amina','hello i am amina',"hello i'm amina"], why:"« Hello, my name is Amina. » ou « Hi, I'm Amina. »"},
    {t:'order', words:['nice','to','meet','you'], a:'nice to meet you', why:"« Nice to meet you. » = Enchanté."},
    {t:'fill', q:"« Good ___ » se dit le matin.", a:['morning'], why:"Good morning (matin), good afternoon (après-midi), good evening (soir)."}
  ]
},

/* ---------------------------------------------------------- 2 */
{
  id:'a1-2', title:'Les pronoms et le verbe TO BE', icon:'book', duration:'30 min',
  goal:"Utiliser I, you, he, she, it, we, they et conjuguer <b>to be</b> à l'affirmatif, au négatif et à la question — la base de 80 % de tes premières phrases.",
  sections:[
    {t:'text', h:'Les pronoms personnels sujets', p:"Un pronom remplace un nom. En anglais, le sujet n'est <b>jamais</b> omis : on dit toujours <i>It is raining</i>, jamais <i>Is raining</i>."},
    {t:'table', h:'', head:['Anglais','Français','Emploi'], rows:[
      ['I','je','toujours une majuscule, partout dans la phrase'],
      ['you','tu / vous','même mot au singulier et au pluriel'],
      ['he','il','une personne de sexe masculin'],
      ['she','elle','une personne de sexe féminin'],
      ['it','il / elle','une chose, un animal, la météo, une idée'],
      ['we','nous',''],
      ['they','ils / elles','personnes ou choses, sans distinction de genre']
    ]},
    {t:'text', h:'Le verbe TO BE (être)', p:"C'est le verbe le plus utilisé de la langue. Retiens la forme <b>contractée</b> : c'est celle qu'on emploie à l'oral."},
    {t:'table', h:'', head:['Affirmatif','Contracté','Négatif','Question'], rows:[
      ['I am',"I'm","I'm not",'Am I?'],
      ['You are',"You're","You aren't",'Are you?'],
      ['He / She / It is',"He's","He isn't",'Is he?'],
      ['We are',"We're","We aren't",'Are we?'],
      ['They are',"They're","They aren't",'Are they?']
    ]},
    {t:'ex', h:'Exemples', items:[
      ["I'm a student.","Je suis étudiant(e)."],
      ["She's from Senegal.","Elle vient du Sénégal."],
      ["It's very hot today.","Il fait très chaud aujourd'hui."],
      ["We aren't tired.","Nous ne sommes pas fatigués."],
      ["Are you ready?","Es-tu prêt ?"],
      ["They're my friends.","Ce sont mes amis."]
    ]},
    {t:'tip', p:"En anglais on <b>est</b> un âge : <i>I am 20 years old</i> (jamais « I have 20 years »). Idem pour la faim et la soif : <i>I am hungry / thirsty</i>."},
    {t:'vocab', h:'Adjectifs utiles avec to be', items:[
      ['tired','fatigué'],['happy','content'],['hungry','affamé'],['thirsty','assoiffé'],
      ['ready','prêt'],['late','en retard'],['busy','occupé'],['married','marié'],
      ['young / old','jeune / vieux'],['tall / short','grand / petit']
    ]}
  ],
  exercises:[
    {t:'qcm', q:'She ___ a doctor.', opts:['am','is','are'], c:1, why:"he / she / it → <b>is</b>."},
    {t:'qcm', q:'My parents ___ in Dakar.', opts:['is','am','are'], c:2, why:"Un sujet pluriel (parents = they) prend <b>are</b>."},
    {t:'fill', q:"Complète : « I ___ 20 years old. »", a:['am',"'m"], why:"I am 20 years old. On <i>est</i> un âge en anglais."},
    {t:'qcm', q:'Forme correcte de la question :', opts:['You are ready?','Are you ready?','Do you are ready?'], c:1, why:"Avec to be, on inverse simplement le verbe et le sujet : <b>Are you</b> ready?"},
    {t:'qcm', q:'It ___ cold today.', opts:['is','are','has'], c:0, why:"La météo utilise <b>it is</b> : It's cold / hot / windy."},
    {t:'trad', q:"Je ne suis pas fatigué.", a:["i am not tired","i'm not tired"], why:"I'm not tired."},
    {t:'qcm', q:"Quel pronom remplace « Fatou and I » ?", opts:['they','we','you'], c:1, why:"« Fatou et moi » = <b>we</b> (nous)."},
    {t:'qcm', q:"Quel pronom remplace « the table » ?", opts:['he','she','it'], c:2, why:"Une chose = <b>it</b>."},
    {t:'order', words:['is','my','this','brother'], a:'this is my brother', why:"This is my brother."},
    {t:'vf', q:"En anglais, « you » sert pour tu ET vous.", a:true, why:"Un seul mot pour les deux."},
    {t:'fill', q:"« ___ they students? » (question)", a:['are'], why:"Are they students?"},
    {t:'trad', q:"Elle vient du Mali.", a:['she is from mali',"she's from mali"], why:"She's from Mali. On dit <i>be from</i> pour l'origine."}
  ]
},

/* ---------------------------------------------------------- 3 */
{
  id:'a1-3', title:'Les articles : a, an, the', icon:'layers', duration:'20 min',
  goal:"Savoir quand mettre a, an, the — ou rien du tout. C'est l'erreur numéro un des francophones débutants.",
  sections:[
    {t:'text', h:"a / an : l'article indéfini", p:"On l'emploie devant un nom <b>singulier comptable</b> dont on parle pour la première fois. Le choix entre a et an dépend du <b>son</b>, pas de la lettre."},
    {t:'table', h:'', head:['Règle','Exemples'], rows:[
      ['a + son consonne','a book, a car, a university (/ju/), a European'],
      ['an + son voyelle','an apple, an orange, an hour (h muet), an MP3 (/em/)']
    ]},
    {t:'text', h:'the : l’article défini', p:"On l'emploie quand l'interlocuteur sait de quoi on parle : chose déjà mentionnée, unique, ou précisée par un complément."},
    {t:'ex', h:'Comparer', items:[
      ["I bought a book. The book is great.","J'ai acheté un livre. Le livre est génial."],
      ["Close the door, please.","Ferme la porte, s'il te plaît. (celle qu'on voit)"],
      ["The sun is hot.","Le soleil est chaud. (unique)"],
      ["The capital of Senegal is Dakar.","La capitale du Sénégal est Dakar."]
    ]},
    {t:'text', h:"Zéro article : le piège français", p:"On ne met <b>aucun article</b> devant : les généralités au pluriel, les noms indénombrables, les langues, les repas, les jours et mois, les sports et la plupart des noms de pays."},
    {t:'ex', h:'Attention', items:[
      ["I like music. (pas: I like the music)","J'aime la musique."],
      ["Cats are independent.","Les chats sont indépendants."],
      ["She speaks English.","Elle parle anglais."],
      ["We have lunch at 1 p.m.","Nous déjeunons à 13 h."],
      ["I play football on Sunday.","Je joue au football le dimanche."]
    ]},
    {t:'tip', p:"Exceptions de pays avec <b>the</b> : the United States, the UK, the Netherlands, the Philippines, the Gambia — en général les noms pluriels ou composés."},
    {t:'vocab', h:'Vocabulaire', items:[
      ['a book','un livre'],['an apple','une pomme'],['an hour','une heure'],['the world','le monde'],
      ['water','eau (indénombrable)'],['money','argent (indénombrable)'],['advice','conseil (indénombrable)'],['news','nouvelles (singulier !)']
    ]}
  ],
  exercises:[
    {t:'qcm', q:'I need ___ umbrella.', opts:['a','an','the'], c:1, why:"« umbrella » commence par un son voyelle → <b>an</b>."},
    {t:'qcm', q:'She is ___ university student.', opts:['a','an','—'], c:0, why:"university se prononce /juːnɪ/ : son consonne → <b>a</b>."},
    {t:'qcm', q:'I waited for ___ hour.', opts:['a','an','the'], c:1, why:"Le h de hour est muet, on entend /aʊə/ → <b>an</b>."},
    {t:'qcm', q:'___ Everest is the highest mountain.', opts:['The','A','—'], c:2, why:"Pas d'article devant un nom de montagne isolé : <i>Everest is…</i> (mais <i>the Himalayas</i>, pluriel)."},
    {t:'qcm', q:'I love ___ music.', opts:['the','a','—'], c:2, why:"Généralité → pas d'article. <i>I love music.</i>"},
    {t:'fill', q:"Complète : « Please close ___ window. »", a:['the'], why:"On parle d'une fenêtre précise, connue des deux → the."},
    {t:'trad', q:"Elle parle français et anglais.", a:['she speaks french and english'], why:"Pas d'article devant les langues."},
    {t:'qcm', q:'My father is ___ engineer.', opts:['a','an','the'], c:1, why:"engineer commence par un son voyelle /e/ → an. (Et en anglais, on met un article devant un métier.)"},
    {t:'vf', q:"On dit « I have the breakfast at 7 ».", a:false, why:"Non : <i>I have breakfast at 7</i>. Pas d'article devant les repas."},
    {t:'qcm', q:'___ United States is a big country.', opts:['A','The','—'], c:1, why:"the United States : exception, nom pluriel."},
    {t:'order', words:['is','the','on','book','table','the'], a:'the book is on the table', why:"The book is on the table."},
    {t:'fill', q:"« I bought ___ car. ___ car is red. »", a:['a the','a, the'], why:"Première mention : a car. Ensuite on sait de quelle voiture il s'agit : the car."}
  ]
},

/* ---------------------------------------------------------- 4 */
{
  id:'a1-4', title:'Le pluriel des noms', icon:'puzzle', duration:'20 min',
  goal:"Former le pluriel régulier, connaître les 10 pluriels irréguliers les plus fréquents et repérer les noms indénombrables.",
  sections:[
    {t:'table', h:'Pluriel régulier', head:['Fin du mot','On ajoute','Exemples'], rows:[
      ['cas général','-s','book → books, girl → girls'],
      ['-s, -ss, -sh, -ch, -x, -o','-es','bus → buses, box → boxes, watch → watches, potato → potatoes'],
      ['consonne + y','-ies','city → cities, baby → babies'],
      ['voyelle + y','-s','day → days, boy → boys'],
      ['-f / -fe','-ves','knife → knives, leaf → leaves, wife → wives']
    ]},
    {t:'table', h:'Les irréguliers à connaître par cœur', head:['Singulier','Pluriel','Sens'], rows:[
      ['man','men','homme'],['woman','women','femme'],['child','children','enfant'],
      ['person','people','personne'],['foot','feet','pied'],['tooth','teeth','dent'],
      ['mouse','mice','souris'],['fish','fish','poisson'],['sheep','sheep','mouton'],['goose','geese','oie']
    ]},
    {t:'text', h:'Les noms indénombrables', p:"On ne peut pas les compter directement, ils n'ont pas de pluriel et prennent un verbe au singulier : <b>water, money, bread, rice, information, advice, furniture, homework, luggage, news</b>. Pour les compter, on ajoute un contenant : <i>a glass of water, a piece of advice, two pieces of information</i>."},
    {t:'ex', h:'Exemples', items:[
      ["There are three children in the garden.","Il y a trois enfants dans le jardin."],
      ["The news is good today.","Les nouvelles sont bonnes aujourd'hui."],
      ["I need some information.","J'ai besoin d'informations."],
      ["She gave me two pieces of advice.","Elle m'a donné deux conseils."]
    ]},
    {t:'tip', p:"<b>People</b> est déjà pluriel : <i>People are…</i> jamais <i>peoples</i> (sauf pour parler de plusieurs peuples)."}
  ],
  exercises:[
    {t:'qcm', q:'Pluriel de « city » :', opts:['citys','cities','cityes'], c:1, why:"consonne + y → -ies."},
    {t:'qcm', q:'Pluriel de « boy » :', opts:['boies','boys','boyes'], c:1, why:"voyelle + y → simplement -s."},
    {t:'fill', q:'Pluriel de « child » :', a:['children'], why:"child → children (irrégulier)."},
    {t:'fill', q:'Pluriel de « woman » :', a:['women'], why:"woman → women (prononcé /ˈwɪmɪn/)."},
    {t:'qcm', q:'Pluriel de « knife » :', opts:['knifes','knives','knifies'], c:1, why:"-fe → -ves."},
    {t:'qcm', q:'The news ___ good.', opts:['is','are','were'], c:0, why:"news est singulier malgré le -s."},
    {t:'vf', q:"« Two informations » est correct.", a:false, why:"information est indénombrable : <i>two pieces of information</i>."},
    {t:'qcm', q:'Pluriel de « sheep » :', opts:['sheeps','sheep','sheepes'], c:1, why:"Invariable : one sheep, ten sheep."},
    {t:'qcm', q:'There ___ many people here.', opts:['is','are','was'], c:1, why:"people est pluriel → are."},
    {t:'trad', q:"Il y a cinq enfants.", a:['there are five children'], why:"There are five children."},
    {t:'fill', q:'Pluriel de « tooth » :', a:['teeth'], why:"tooth → teeth."},
    {t:'qcm', q:"Combien de bagages ? On dit :", opts:['three luggages','three pieces of luggage','three luggage'], c:1, why:"luggage est indénombrable → pieces of luggage."}
  ]
},

/* ---------------------------------------------------------- 5 */
{
  id:'a1-5', title:'Le présent simple : parler de ses habitudes', icon:'clock', duration:'30 min',
  goal:"Construire l'affirmatif, le négatif et la question au présent simple, et ne plus jamais oublier le -s de la 3ᵉ personne.",
  sections:[
    {t:'text', h:'Quand l’employer ?', p:"Le présent simple sert pour : une <b>habitude</b> (I work every day), une <b>vérité générale</b> (Water boils at 100°C), un <b>goût</b> (I like tea), un <b>programme fixe</b> (The train leaves at 8)."},
    {t:'table', h:'Construction', head:['Forme','Structure','Exemple'], rows:[
      ['Affirmatif','sujet + verbe (+s à he/she/it)','She works in a bank.'],
      ['Négatif',"sujet + don't / doesn't + verbe","She doesn't work on Sunday."],
      ['Question','Do / Does + sujet + verbe ?','Does she work here?'],
      ['Réponse courte','Yes, she does. / No, she doesn’t.','']
    ]},
    {t:'text', h:'Le -s de la 3ᵉ personne', p:"Avec <b>he, she, it</b> on ajoute -s au verbe : work → works. Après -o, -s, -ch, -sh, -x on ajoute -es : go → goes, watch → watches. Consonne + y → -ies : study → studies."},
    {t:'tip', p:"Règle d'or : le -s se met <b>une seule fois</b>. Si <i>does</i> ou <i>doesn't</i> est là, le verbe reste nu : <i>She doesn't <s>works</s> work</i>."},
    {t:'ex', h:'Exemples', items:[
      ["I get up at six every day.","Je me lève à six heures tous les jours."],
      ["He watches TV in the evening.","Il regarde la télé le soir."],
      ["We don't eat meat.","Nous ne mangeons pas de viande."],
      ["Does your brother speak English?","Ton frère parle-t-il anglais ?"],
      ["The shop opens at 9 a.m.","Le magasin ouvre à 9 h."]
    ]},
    {t:'vocab', h:'Verbes du quotidien', items:[
      ['get up','se lever'],['have breakfast','prendre le petit-déjeuner'],['go to work','aller au travail'],
      ['study','étudier'],['work','travailler'],['live','habiter'],['like','aimer bien'],
      ['want','vouloir'],['need','avoir besoin de'],['come back','rentrer'],['sleep','dormir'],['cook','cuisiner']
    ]}
  ],
  exercises:[
    {t:'qcm', q:'He ___ football every weekend.', opts:['play','plays','playes'], c:1, why:"he → verbe + s : plays."},
    {t:'qcm', q:'She ___ like coffee.', opts:["don't","doesn't",'not'], c:1, why:"he/she/it → doesn't."},
    {t:'qcm', q:'___ you live in Dakar?', opts:['Do','Does','Are'], c:0, why:"you → Do you live…?"},
    {t:'fill', q:"Complète : « My sister ___ (study) medicine. »", a:['studies'], why:"consonne + y → studies."},
    {t:'qcm', q:'Which sentence is correct?', opts:["He doesn't works here.","He doesn't work here.","He don't work here."], c:1, why:"Après doesn't, le verbe reste à l'infinitif nu."},
    {t:'trad', q:"Je ne travaille pas le dimanche.", a:["i don't work on sunday","i do not work on sunday","i don't work on sundays"], why:"I don't work on Sunday(s)."},
    {t:'qcm', q:'Water ___ at 100 degrees.', opts:['boil','boils','is boiling'], c:1, why:"Vérité générale au présent simple, 3ᵉ personne → boils."},
    {t:'fill', q:"Réponse courte : « Does he speak French? » — « Yes, he ___. »", a:['does'], why:"Yes, he does."},
    {t:'order', words:['always','she','early','gets','up'], a:'she always gets up early', why:"L'adverbe de fréquence se place avant le verbe principal."},
    {t:'qcm', q:'They ___ in a small village.', opts:['lives','live','living'], c:1, why:"they → pas de -s."},
    {t:'vf', q:"« Does she works? » est correct.", a:false, why:"Non : <i>Does she work?</i>"},
    {t:'trad', q:"Il regarde la télévision le soir.", a:['he watches tv in the evening','he watches television in the evening'], why:"watch → watches (après -ch)."}
  ]
},

/* ---------------------------------------------------------- 6 */
{
  id:'a1-6', title:'HAVE GOT et la possession', icon:'shield', duration:'22 min',
  goal:"Dire ce que tu possèdes, décrire ta famille et utiliser le génitif ’s comme un natif.",
  sections:[
    {t:'table', h:'have got / have', head:['Forme','Britannique','Américain'], rows:[
      ['Affirmatif',"I've got a car",'I have a car'],
      ['3ᵉ personne',"She's got a car",'She has a car'],
      ['Négatif',"I haven't got a car","I don't have a car"],
      ['Question','Have you got a car?','Do you have a car?']
    ]},
    {t:'text', h:'Le génitif ’s', p:"Pour dire « le livre de Marie », l'anglais met le <b>possesseur d'abord</b> : <i>Marie's book</i>. Avec un pluriel en -s, on met seulement l'apostrophe : <i>my parents' house</i>."},
    {t:'table', h:'Adjectifs possessifs', head:['Pronom','Possessif','Exemple'], rows:[
      ['I','my','my brother'],['you','your','your bag'],['he','his','his phone'],
      ['she','her','her sister'],['it','its','its color'],['we','our','our school'],['they','their','their car']
    ]},
    {t:'ex', h:'Exemples', items:[
      ["I've got two brothers and one sister.","J'ai deux frères et une sœur."],
      ["Has she got a phone?","A-t-elle un téléphone ?"],
      ["This is Amadou's bike.","C'est le vélo d'Amadou."],
      ["The children's toys are here.","Les jouets des enfants sont ici."],
      ["Their house is very big.","Leur maison est très grande."]
    ]},
    {t:'tip', p:"Ne confonds pas <b>its</b> (son, sa — possessif) et <b>it's</b> (it is). <i>The dog wags its tail. It's late.</i>"},
    {t:'vocab', h:'La famille', items:[
      ['father / dad','père / papa'],['mother / mum','mère / maman'],['brother','frère'],['sister','sœur'],
      ['son / daughter','fils / fille'],['uncle / aunt','oncle / tante'],['cousin','cousin(e)'],
      ['grandfather','grand-père'],['grandmother','grand-mère'],['husband / wife','mari / femme'],['parents','parents'],['child','enfant']
    ]}
  ],
  exercises:[
    {t:'qcm', q:'She ___ got two cats.', opts:['have','has','is'], c:1, why:"he/she/it → has got."},
    {t:'qcm', q:'___ you got a pen?', opts:['Have','Has','Do'], c:0, why:"Have you got…?"},
    {t:'fill', q:"« C'est le sac de Fatou » → « This is ___ bag. »", a:["fatou's"], why:"Génitif : Fatou's bag."},
    {t:'qcm', q:'The ___ room (la chambre des filles, plusieurs filles)', opts:["girl's","girls'","girls's"], c:1, why:"Pluriel déjà en -s → apostrophe seule : girls'."},
    {t:'qcm', q:"Choisis : « ___ a beautiful day. »", opts:['Its','It’s','Its’'], c:1, why:"It's = it is."},
    {t:'trad', q:"Je n'ai pas de voiture.", a:["i haven't got a car","i don't have a car","i have not got a car"], why:"I haven't got a car. / I don't have a car."},
    {t:'qcm', q:'This is ___ book (le livre de mon frère, un seul frère).', opts:["my brother's","my brothers'","my brothers"], c:0, why:"Un frère → brother's."},
    {t:'fill', q:"Complète : « ___ name is Ousmane. » (son nom à lui)", a:['his'], why:"his = son/sa (à lui)."},
    {t:'qcm', q:'She loves ___ job.', opts:['his','her','their'], c:1, why:"she → her."},
    {t:'order', words:['got','have','I','sisters','two'], a:'i have got two sisters', why:"I have got two sisters."},
    {t:'vf', q:"En anglais, l'adjectif possessif s'accorde avec le possesseur, pas avec l'objet.", a:true, why:"<i>her brother</i> = le frère d'une femme, quel que soit le genre du mot « frère »."},
    {t:'trad', q:"As-tu des frères et sœurs ?", a:['have you got any brothers and sisters','do you have any brothers and sisters','have you got brothers and sisters','do you have brothers and sisters'], why:"Have you got any brothers and sisters?"}
  ]
},

/* ---------------------------------------------------------- 7 */
{
  id:'a1-7', title:"Nombres, heure, date et prix", icon:'blocks', duration:'25 min',
  goal:"Compter, donner l'heure, dire une date et un prix sans hésiter — les situations les plus concrètes du quotidien.",
  sections:[
    {t:'table', h:'Les nombres', head:['Chiffre','Cardinal','Ordinal'], rows:[
      ['1','one','first (1st)'],['2','two','second (2nd)'],['3','three','third (3rd)'],
      ['5','five','fifth (5th)'],['8','eight','eighth (8th)'],['12','twelve','twelfth (12th)'],
      ['20','twenty','twentieth (20th)'],['21','twenty-one','twenty-first'],
      ['100','a hundred','hundredth'],['1000','a thousand','thousandth']
    ]},
    {t:'text', h:"Dire l'heure", p:"Deux façons : la façon <b>simple</b> (it's seven forty-five) et la façon <b>traditionnelle</b> (it's a quarter to eight). Après l'heure on utilise <b>past</b>, avant l'heure <b>to</b>."},
    {t:'table', h:'', head:['Heure','Traditionnel','Simple'], rows:[
      ['7:00',"seven o'clock",'seven'],['7:15','a quarter past seven','seven fifteen'],
      ['7:30','half past seven','seven thirty'],['7:45','a quarter to eight','seven forty-five'],
      ['7:10','ten past seven','seven ten'],['7:50','ten to eight','seven fifty']
    ]},
    {t:'text', h:'La date', p:"Britannique : <i>the 5th of September, 2026</i>. Américain : <i>September 5th, 2026</i>. On lit les années par paires : 1998 = nineteen ninety-eight ; 2026 = twenty twenty-six."},
    {t:'ex', h:'Exemples', items:[
      ["What time is it? — It's half past nine.","Quelle heure est-il ? — Neuf heures et demie."],
      ["My birthday is on the 12th of June.","Mon anniversaire est le 12 juin."],
      ["The class starts at 8 a.m.","Le cours commence à 8 h."],
      ["How much is it? — It's 5,000 francs.","Combien ça coûte ? — 5 000 francs."],
      ["It costs twenty dollars.","Ça coûte vingt dollars."]
    ]},
    {t:'tip', p:"On dit <b>at</b> pour une heure (at 7), <b>on</b> pour un jour ou une date (on Monday, on 5 May), <b>in</b> pour un mois, une saison, une année (in June, in 2026)."}
  ],
  exercises:[
    {t:'qcm', q:'7:30 se dit :', opts:['half past seven','half to seven','seven and half'], c:0, why:"half past seven."},
    {t:'qcm', q:'8:45 se dit :', opts:['a quarter past nine','a quarter to nine','nine quarter'], c:1, why:"Avant l'heure → to : a quarter to nine."},
    {t:'qcm', q:'My birthday is ___ July.', opts:['at','on','in'], c:2, why:"Un mois → in July."},
    {t:'qcm', q:'The meeting is ___ Monday.', opts:['at','on','in'], c:1, why:"Un jour → on Monday."},
    {t:'fill', q:"Ordinal de 3 :", a:['third','3rd'], why:"three → third."},
    {t:'qcm', q:'1998 se lit :', opts:['one thousand nine hundred ninety-eight','nineteen ninety-eight','one nine nine eight'], c:1, why:"On lit par paires : nineteen ninety-eight."},
    {t:'trad', q:"Quelle heure est-il ?", a:['what time is it',"what's the time",'what is the time'], why:"What time is it?"},
    {t:'qcm', q:'The train leaves ___ 6 p.m.', opts:['at','on','in'], c:0, why:"Une heure précise → at."},
    {t:'fill', q:"Combien ça coûte ? → « How ___ is it? »", a:['much'], why:"How much is it?"},
    {t:'order', words:['is','it','ten','to','five'], a:'it is five to ten', why:"It is five to ten = 9 h 55."},
    {t:'qcm', q:'2026 se lit :', opts:['twenty twenty-six','two thousand twenty six','two zero two six'], c:0, why:"twenty twenty-six (ou two thousand and twenty-six)."},
    {t:'trad', q:"Mon anniversaire est le 12 juin.", a:['my birthday is on the 12th of june','my birthday is on june 12th','my birthday is on the twelfth of june'], why:"My birthday is on the 12th of June."}
  ]
},

/* ---------------------------------------------------------- 8 */
{
  id:'a1-8', title:'Questions, négations et premières conversations', icon:'chat', duration:'30 min',
  goal:"Poser les 7 questions essentielles (what, where, when, who, why, how, which) et tenir ta toute première conversation en anglais.",
  sections:[
    {t:'table', h:'Les mots interrogatifs', head:['Mot','Sens','Exemple'], rows:[
      ['What','Quoi / Quel','What is your name?'],
      ['Where','Où','Where do you live?'],
      ['When','Quand','When do you start?'],
      ['Who','Qui','Who is that man?'],
      ['Why','Pourquoi','Why are you late?'],
      ['How','Comment','How are you?'],
      ['Which','Lequel','Which one do you want?'],
      ['How much / many','Combien','How many brothers have you got?']
    ]},
    {t:'text', h:'Ordre des mots dans une question', p:"Retiens la formule <b>Q A S V</b> : mot <u>Q</u>uestion + <u>A</u>uxiliaire + <u>S</u>ujet + <u>V</u>erbe. <i>Where <b>do</b> you live?</i> — <i>Why <b>is</b> she happy?</i> Contrairement au français, on n'inverse jamais sujet et verbe principal."},
    {t:'ex', h:'Une conversation complète', items:[
      ["Hello! What's your name?","Bonjour ! Comment t'appelles-tu ?"],
      ["My name's Awa. Nice to meet you.","Je m'appelle Awa. Enchantée."],
      ["Where are you from?","D'où viens-tu ?"],
      ["I'm from Senegal. And you?","Je viens du Sénégal. Et toi ?"],
      ["What do you do?","Que fais-tu dans la vie ?"],
      ["I'm a student. I study English.","Je suis étudiante. J'étudie l'anglais."],
      ["How old are you?","Quel âge as-tu ?"],
      ["I'm nineteen.","J'ai dix-neuf ans."],
      ["See you soon!","À bientôt !"]
    ]},
    {t:'tip', p:"« How are you? » attend une vraie réponse courte : <i>I'm fine, thanks. And you?</i> C'est une politesse, pas une question médicale."},
    {t:'vocab', h:'Formules de survie', items:[
      ["Excuse me","Excusez-moi"],["I don't understand","Je ne comprends pas"],
      ["Can you repeat, please?","Pouvez-vous répéter ?"],["How do you say… in English?","Comment dit-on… en anglais ?"],
      ["What does it mean?","Qu'est-ce que ça veut dire ?"],["Speak slowly, please","Parlez lentement, s'il vous plaît"],
      ["I'm learning English","J'apprends l'anglais"],["Could you help me?","Pourriez-vous m'aider ?"]
    ]}
  ],
  exercises:[
    {t:'qcm', q:'___ do you live?', opts:['What','Where','Who'], c:1, why:"Where = où."},
    {t:'qcm', q:'___ are you late?', opts:['Why','Which','When'], c:0, why:"Why = pourquoi."},
    {t:'qcm', q:'Quel ordre est correct ?', opts:['Where you do live?','Where do you live?','Where live you?'], c:1, why:"Q + auxiliaire + sujet + verbe."},
    {t:'fill', q:"« ___ old are you? »", a:['how'], why:"How old are you?"},
    {t:'qcm', q:'___ many brothers have you got?', opts:['How','What','Which'], c:0, why:"How many + nom comptable."},
    {t:'trad', q:"Je ne comprends pas.", a:["i don't understand",'i do not understand'], why:"I don't understand."},
    {t:'order', words:['is','what','name','your'], a:'what is your name', why:"What is your name?"},
    {t:'qcm', q:'___ is that woman?', opts:['What','Who','Where'], c:1, why:"Who = qui (une personne)."},
    {t:'trad', q:"Pouvez-vous répéter, s'il vous plaît ?", a:['can you repeat please','could you repeat please','can you repeat it please'], why:"Can you repeat, please?"},
    {t:'vf', q:"En anglais on peut dire « Live you in Dakar? »", a:false, why:"Non, il faut l'auxiliaire : <i>Do you live in Dakar?</i>"},
    {t:'fill', q:"Réponse à « How are you? » → « I'm ___, thanks. »", a:['fine','good','ok','okay'], why:"I'm fine, thanks. And you?"},
    {t:'qcm', q:'___ colour do you prefer, red or blue?', opts:['What','Which','How'], c:1, why:"Which quand le choix est limité (rouge ou bleu)."}
  ]
}

];
