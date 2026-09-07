/* Forever Academy — Salle d'examen A1 */
window.EXAMS = window.EXAMS || {};
window.EXAMS.A1 = {
  name:'Premiers pas',
  intro:"La salle A1 vérifie les fondations : to be, articles, pluriels, présent simple, questions.",
  devoirs:[
    { id:'d-a1-1', title:'Devoir n°1 — Sons, pronoms et TO BE', modules:['a1-1','a1-2'], points:10, questions:[
      {t:'qcm', q:'I ___ a student.', opts:['am','is','are'], c:0, why:"I → am."},
      {t:'qcm', q:'They ___ from Mali.', opts:['is','are','am'], c:1, why:"they → are."},
      {t:'qcm', q:'Dans « three », le th est :', opts:['sourd','sonore','muet'], c:0, why:"th sourd /θ/."},
      {t:'fill', q:"« Elle n'est pas fatiguée » → « She ___ tired. » (contraction)", a:["isn't","is not"], why:"She isn't tired."},
      {t:'qcm', q:'___ she your sister?', opts:['Do','Is','Does'], c:1, why:"Avec to be, on inverse : Is she…?"},
      {t:'trad', q:"J'ai vingt ans.", a:['i am twenty years old',"i'm twenty years old",'i am 20 years old',"i'm 20 years old"], why:"On est un âge : I am twenty years old."},
      {t:'order', words:['is','it','hot','today'], a:'it is hot today', why:"It is hot today."},
      {t:'qcm', q:'Quel pronom pour « the book » ?', opts:['he','she','it'], c:2, why:"Une chose → it."},
      {t:'vf', q:"« I am » se contracte en « I'm ».", a:true, why:"I am → I'm."},
      {t:'trad', q:"Nous sommes prêts.", a:['we are ready',"we're ready"], why:"We are ready."}
    ]},
    { id:'d-a1-2', title:'Devoir n°2 — Articles et pluriels', modules:['a1-3','a1-4'], points:10, questions:[
      {t:'qcm', q:'She has ___ apple.', opts:['a','an','the'], c:1, why:"Son voyelle → an."},
      {t:'qcm', q:'I love ___ children.', opts:['the','a','—'], c:2, why:"Généralité au pluriel → pas d'article."},
      {t:'fill', q:'Pluriel de « box » :', a:['boxes'], why:"box → boxes."},
      {t:'fill', q:'Pluriel de « man » :', a:['men'], why:"man → men."},
      {t:'qcm', q:'There ___ a lot of people here.', opts:['is','are','was'], c:1, why:"people est pluriel."},
      {t:'qcm', q:'I need ___ information.', opts:['an','some','a'], c:1, why:"information est indénombrable → some."},
      {t:'trad', q:"J'ai deux enfants.", a:['i have two children',"i've got two children",'i have got two children'], why:"I have two children."},
      {t:'qcm', q:'He is ___ honest man.', opts:['a','an','the'], c:1, why:"Le h de honest est muet → an."},
      {t:'order', words:['the','on','is','wall','picture','the'], a:'the picture is on the wall', why:"The picture is on the wall."},
      {t:'vf', q:"Le pluriel de « city » est « citys ».", a:false, why:"consonne + y → cities."}
    ]},
    { id:'d-a1-3', title:'Devoir n°3 — Présent simple et possession', modules:['a1-5','a1-6'], points:10, questions:[
      {t:'qcm', q:'She ___ English every day.', opts:['study','studies','studys'], c:1, why:"consonne + y → studies."},
      {t:'qcm', q:'He ___ like fish.', opts:["don't","doesn't",'not'], c:1, why:"he → doesn't."},
      {t:'fill', q:"« Est-ce qu'ils travaillent ici ? » → « ___ they work here? »", a:['do'], why:"Do they work here?"},
      {t:'qcm', q:'This is ___ car (la voiture de mes parents).', opts:["my parent's","my parents'","my parents"], c:1, why:"Pluriel en -s → apostrophe seule."},
      {t:'qcm', q:'She loves ___ job.', opts:['his','her','their'], c:1, why:"she → her."},
      {t:'trad', q:"Il regarde la télé le soir.", a:['he watches tv in the evening','he watches television in the evening'], why:"watch → watches."},
      {t:'qcm', q:'___ she got a phone?', opts:['Have','Has','Do'], c:1, why:"she → Has she got…?"},
      {t:'order', words:['never','they','meat','eat'], a:'they never eat meat', why:"They never eat meat."},
      {t:'vf', q:"« Does he works? » est correct.", a:false, why:"Does he work?"},
      {t:'trad', q:"Je n'ai pas de frères.", a:["i haven't got any brothers","i don't have any brothers","i have no brothers"], why:"I haven't got any brothers."}
    ]},
    { id:'d-a1-4', title:'Devoir n°4 — Heure, dates et questions', modules:['a1-7','a1-8'], points:10, questions:[
      {t:'qcm', q:'The class starts ___ 8 a.m.', opts:['in','on','at'], c:2, why:"Heure → at."},
      {t:'qcm', q:'My birthday is ___ March.', opts:['in','on','at'], c:0, why:"Mois → in."},
      {t:'qcm', q:'9:45 se dit :', opts:['a quarter to ten','a quarter past ten','half past nine'], c:0, why:"Avant l'heure → to."},
      {t:'fill', q:"« ___ do you live? » (où)", a:['where'], why:"Where do you live?"},
      {t:'qcm', q:'___ many books do you have?', opts:['How','What','Which'], c:0, why:"How many + comptable."},
      {t:'trad', q:"Quel âge as-tu ?", a:['how old are you'], why:"How old are you?"},
      {t:'order', words:['name','what','your','is'], a:'what is your name', why:"What is your name?"},
      {t:'qcm', q:'See you ___ Friday.', opts:['in','on','at'], c:1, why:"Jour → on."},
      {t:'vf', q:"« Live you here? » est une question correcte.", a:false, why:"Do you live here?"},
      {t:'trad', q:"Je ne comprends pas, pouvez-vous répéter ?", a:["i don't understand can you repeat","i don't understand could you repeat"], why:"I don't understand. Can you repeat?"}
    ]}
  ],
  compositions:[
    { id:'c-a1-1', title:'Composition n°1 — Premier trimestre', duration:'45 min', total:20,
      parts:[
        {t:'part', title:'I. Grammaire (6 points)', items:[
          {t:'qcm', q:'My sister ___ a nurse.', opts:['am','is','are'], c:1, why:"she → is."},
          {t:'qcm', q:'We ___ got two dogs.', opts:['has','have','is'], c:1, why:"we → have got."},
          {t:'fill', q:"Pluriel de « child » :", a:['children'], why:"children."},
          {t:'qcm', q:'He ___ to school by bus.', opts:['go','goes','going'], c:1, why:"he → goes."},
          {t:'qcm', q:'There is ___ orange on the table.', opts:['a','an','the'], c:1, why:"an orange."},
          {t:'fill', q:"« Elle ne travaille pas » → « She ___ work. »", a:["doesn't",'does not'], why:"She doesn't work."}
        ]},
        {t:'part', title:'II. Vocabulaire et traduction (4 points)', items:[
          {t:'trad', q:"Bonjour, comment vas-tu ?", a:['hello how are you','hi how are you'], why:"Hello, how are you?"},
          {t:'trad', q:"J'habite à Dakar.", a:['i live in dakar'], why:"I live in Dakar."},
          {t:'trad', q:"Elle a trois frères.", a:['she has three brothers',"she's got three brothers",'she has got three brothers'], why:"She has three brothers."},
          {t:'trad', q:"Quelle heure est-il ?", a:['what time is it',"what's the time"], why:"What time is it?"}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"My name is Awa. I am seventeen years old and I live in Thiès with my family. I have one brother and two sisters. My father is a teacher and my mother works in a shop. Every morning I get up at six o'clock. I have breakfast with my sisters, then I take the bus to school at seven. My favourite subject is English because I want to travel. After school I do my homework and I help my mother in the kitchen. On Sunday we visit my grandmother. She lives near the market and she always cooks rice for us. I am very happy with my family.",
          items:[
            {t:'qcm', q:'How old is Awa?', opts:['six','seventeen','seven'], c:1, why:"« I am seventeen years old »."},
            {t:'qcm', q:'Where does Awa live?', opts:['Dakar','Thiès','Saint-Louis'], c:1, why:"« I live in Thiès »."},
            {t:'qcm', q:'How many sisters has she got?', opts:['one','two','three'], c:1, why:"« two sisters »."},
            {t:'vf', q:"Awa's mother is a teacher.", a:false, why:"Le père est enseignant ; la mère travaille dans un magasin."},
            {t:'qcm', q:'Why does she like English?', opts:['because she wants to travel','because it is easy','because of her brother'], c:0, why:"« because I want to travel »."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:60,
          prompt:"Présente-toi en anglais : ton nom, ton âge, où tu habites, ta famille, ce que tu fais chaque jour et ce que tu aimes. Écris au moins 60 mots au présent simple.",
          criteria:["Le texte fait au moins 60 mots","Le verbe to be est correctement conjugué","Le -s de la 3ᵉ personne est présent","Au moins 4 phrases complètes avec un sujet exprimé","Le vocabulaire de la famille et du quotidien est utilisé"]}
      ]},
    { id:'c-a1-2', title:'Composition n°2 — Deuxième trimestre', duration:'45 min', total:20,
      parts:[
        {t:'part', title:'I. Grammaire (6 points)', items:[
          {t:'qcm', q:'___ you got any money?', opts:['Do','Have','Are'], c:1, why:"Have you got…?"},
          {t:'qcm', q:'The keys are ___ the bag.', opts:['in','on','at'], c:0, why:"À l'intérieur → in."},
          {t:'fill', q:"« Ils ne sont pas là » → « They ___ here. »", a:["aren't",'are not'], why:"They aren't here."},
          {t:'qcm', q:'She ___ TV every evening.', opts:['watch','watches','watching'], c:1, why:"watches."},
          {t:'qcm', q:'How ___ water do you drink?', opts:['many','much','some'], c:1, why:"water indénombrable → much."},
          {t:'fill', q:"Pluriel de « woman » :", a:['women'], why:"women."}
        ]},
        {t:'part', title:'II. Traduction (4 points)', items:[
          {t:'trad', q:"Mon père travaille dans une banque.", a:['my father works in a bank'], why:"My father works in a bank."},
          {t:'trad', q:"Nous n'avons pas de voiture.", a:["we haven't got a car","we don't have a car"], why:"We haven't got a car."},
          {t:'trad', q:"Est-ce que tu parles anglais ?", a:['do you speak english'], why:"Do you speak English?"},
          {t:'trad', q:"Il fait froid aujourd'hui.", a:['it is cold today',"it's cold today"], why:"It's cold today."}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"Moussa is a young mechanic. He works in a small garage in Kaolack from Monday to Saturday. He starts at eight in the morning and finishes at six in the evening. He repairs cars and motorbikes. He likes his job because he meets many people, but he does not like working when it is very hot. On Sunday the garage is closed. Moussa plays football with his friends in the afternoon and in the evening he studies English on his phone. He wants to open his own garage in three years.",
          items:[
            {t:'qcm', q:"What is Moussa's job?", opts:['teacher','mechanic','driver'], c:1, why:"« a young mechanic »."},
            {t:'qcm', q:'When does he start work?', opts:['at six','at eight','at ten'], c:1, why:"« He starts at eight »."},
            {t:'vf', q:"Moussa works on Sunday.", a:false, why:"« On Sunday the garage is closed »."},
            {t:'qcm', q:'What does he do on Sunday evening?', opts:['he plays football','he studies English','he repairs cars'], c:1, why:"« in the evening he studies English »."},
            {t:'qcm', q:'What does he want?', opts:['to travel','to open his own garage','to buy a car'], c:1, why:"« He wants to open his own garage »."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:70,
          prompt:"Décris ta journée type, du matin au soir. Utilise le présent simple, les heures et au moins trois adverbes de fréquence (always, usually, often, sometimes, never). Écris au moins 70 mots.",
          criteria:["Le texte fait au moins 70 mots","Les heures sont exprimées correctement (at 7, in the morning…)","Au moins trois adverbes de fréquence bien placés","Le -s de la 3ᵉ personne est respecté quand nécessaire","Les actions sont dans un ordre chronologique clair"]}
      ]}
  ],
  final:{ title:'Examen final A1', minutes:'~14 min', questions:[
    {t:'qcm', q:'___ name is Amina.', opts:['My','I','Me','Mine'], c:0, why:"Adjectif possessif : My name."},
    {t:'qcm', q:'There ___ two books on the table.', opts:['is','are','am','be'], c:1, why:"Pluriel → are."},
    {t:'qcm', q:'The plural of “box” is ___.', opts:['boxs','boxes','boxen','box’s'], c:1, why:"-x → -es."},
    {t:'qcm', q:'She ___ coffee every morning.', opts:['drink','drinks','drinking','is drink'], c:1, why:"she → drinks."},
    {t:'qcm', q:'The keys are ___ the bag.', opts:['in','of','at','from'], c:0, why:"in the bag."},
    {t:'qcm', q:'___ you from Senegal?', opts:['Do','Is','Are','Am'], c:2, why:"you → Are you…?"},
    {t:'qcm', q:'I have ___ orange.', opts:['a','an','the','some'], c:1, why:"Son voyelle → an."},
    {t:'qcm', q:'What time ___ the class start?', opts:['do','does','is','are'], c:1, why:"the class = it → does."},
    {t:'qcm', q:'My brother ___ got a bike.', opts:['have','has','is','are'], c:1, why:"he → has got."},
    {t:'qcm', q:'They ___ not at home.', opts:['is','am','are','be'], c:2, why:"they → are not."},
    {t:'qcm', q:'I get up ___ 6 o’clock.', opts:['in','on','at','of'], c:2, why:"Heure → at."},
    {t:'qcm', q:'Plural of “child”:', opts:['childs','childrens','children','childes'], c:2, why:"children."},
    {t:'qcm', q:'She ___ like fish.', opts:['don’t','doesn’t','isn’t','not'], c:1, why:"she → doesn't."},
    {t:'qcm', q:'This is ___ book (le livre de Awa).', opts:['Awa book','Awa’s','the Awa','of Awa'], c:1, why:"Génitif : Awa's book."},
    {t:'qcm', q:'___ old are you?', opts:['What','How','Which','Who'], c:1, why:"How old are you?"},
    {t:'qcm', q:'We ___ students.', opts:['is','am','are','be'], c:2, why:"we → are."},
    {t:'qcm', q:'He ___ to work by bus.', opts:['go','goes','going','gone'], c:1, why:"he → goes."},
    {t:'qcm', q:'There isn’t ___ milk.', opts:['some','any','many','a'], c:1, why:"Négation → any."},
    {t:'qcm', q:'My birthday is ___ 12 June.', opts:['in','on','at','to'], c:1, why:"Date précise → on."},
    {t:'qcm', q:'___ they your friends?', opts:['Do','Does','Are','Is'], c:2, why:"they + to be → Are they…?"}
  ]}
};
