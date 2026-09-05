/* Forever Academy — Salle d'examen A2 */
window.EXAMS = window.EXAMS || {};
window.EXAMS.A2 = {
  name:'Bases solides',
  intro:"La salle A2 contrôle le passé simple, les deux présents, le futur, les comparatifs et les quantifieurs.",
  devoirs:[
    { id:'d-a2-1', title:'Devoir n°1 — Passé simple', modules:['a2-1'], points:10, questions:[
      {t:'qcm', q:'Yesterday I ___ to the market.', opts:['go','went','gone'], c:1, why:"go → went."},
      {t:'fill', q:'Passé de « think » :', a:['thought'], why:"think → thought."},
      {t:'fill', q:'Passé de « bring » :', a:['brought'], why:"bring → brought."},
      {t:'qcm', q:'She ___ answer the phone.', opts:["didn't","doesn't","wasn't"], c:0, why:"Passé négatif → didn't."},
      {t:'qcm', q:'___ they enjoy the party?', opts:['Do','Did','Were'], c:1, why:"Did they enjoy…?"},
      {t:'fill', q:'« plan » au passé :', a:['planned'], why:"On double le n : planned."},
      {t:'trad', q:"Il a acheté une nouvelle voiture l'an dernier.", a:['he bought a new car last year'], why:"He bought a new car last year."},
      {t:'order', words:['left','she','morning','this'], a:'she left this morning', why:"She left this morning."},
      {t:'vf', q:"« They didn't went » est correct.", a:false, why:"didn't + infinitif : didn't go."},
      {t:'qcm', q:'We ___ at home all day.', opts:['was','were','are'], c:1, why:"we → were."}
    ]},
    { id:'d-a2-2', title:'Devoir n°2 — Présents et futur', modules:['a2-2','a2-3'], points:10, questions:[
      {t:'qcm', q:'Look! It ___.', opts:['rains','is raining','rained'], c:1, why:"Look! → action en cours."},
      {t:'qcm', q:'I ___ tea every morning.', opts:['drink','am drinking','drank'], c:0, why:"Habitude → présent simple."},
      {t:'qcm', q:'I ___ my aunt tomorrow at 4 (rendez-vous).', opts:['will see','am seeing','see'], c:1, why:"Rendez-vous fixé → présent continu."},
      {t:'qcm', q:"The bag is heavy — I ___ help you.", opts:['am going to','will','am helping'], c:1, why:"Décision immédiate → will."},
      {t:'fill', q:"Négation de will :", a:["won't",'will not'], why:"won't."},
      {t:'qcm', q:"I'll phone you when I ___ there.", opts:['will arrive','arrive','arrived'], c:1, why:"Pas de will après when."},
      {t:'trad', q:"Elle va étudier la médecine.", a:['she is going to study medicine',"she's going to study medicine"], why:"Intention → going to."},
      {t:'qcm', q:'I ___ this book at the moment.', opts:['read','am reading','have read'], c:1, why:"at the moment → continu."},
      {t:'vf', q:"« I am knowing the answer » est correct.", a:false, why:"know est un verbe d'état : I know."},
      {t:'order', words:['is','the','at','train','leaving','six'], a:'the train is leaving at six', why:"The train is leaving at six."}
    ]},
    { id:'d-a2-3', title:'Devoir n°3 — Comparaisons et quantités', modules:['a2-4','a2-5'], points:10, questions:[
      {t:'qcm', q:'This road is ___ than that one.', opts:['long','longer','longest'], c:1, why:"Comparatif court → -er."},
      {t:'qcm', q:'It was the ___ day of my life.', opts:['best','better','goodest'], c:0, why:"the best."},
      {t:'fill', q:'Superlatif de « expensive » :', a:['most expensive','the most expensive'], why:"the most expensive."},
      {t:'qcm', q:'How ___ people were there?', opts:['much','many','little'], c:1, why:"people comptable → many."},
      {t:'qcm', q:"There isn't ___ sugar left.", opts:['some','any','many'], c:1, why:"Négation → any."},
      {t:'qcm', q:'She has ___ friends and feels lonely.', opts:['a few','few','a little'], c:1, why:"few = peu (négatif)."},
      {t:'trad', q:"Il y a trop de bruit ici.", a:['there is too much noise here',"there's too much noise here"], why:"too much noise."},
      {t:'order', words:['as','she','me','tall','as','is'], a:'she is as tall as me', why:"She is as tall as me."},
      {t:'vf', q:"« more cheaper » est correct.", a:false, why:"cheaper suffit."},
      {t:'qcm', q:'Would you like ___ tea?', opts:['any','some','many'], c:1, why:"Offre polie → some."}
    ]},
    { id:'d-a2-4', title:'Devoir n°4 — Mots, prépositions et routine', modules:['a2-6','a2-7','a2-8'], points:10, questions:[
      {t:'fill', q:'Contraire de « regular » avec un préfixe :', a:['irregular'], why:"ir- devant r."},
      {t:'qcm', q:'« Useless » signifie :', opts:['utile','inutile','utilisable'], c:1, why:"-less = sans."},
      {t:'qcm', q:'The meeting is ___ Tuesday.', opts:['in','on','at'], c:1, why:"Jour → on."},
      {t:'qcm', q:'I was born ___ 2003.', opts:['in','on','at'], c:0, why:"Année → in."},
      {t:'qcm', q:'She is ___ home now.', opts:['in','on','at'], c:2, why:"at home."},
      {t:'qcm', q:'He ___ arrives late.', opts:['never','not','no'], c:0, why:"never avant le verbe."},
      {t:'fill', q:"Nom formé sur « happy » :", a:['happiness'], why:"happiness."},
      {t:'trad', q:"Je vais à la salle de sport deux fois par semaine.", a:['i go to the gym twice a week'], why:"twice a week."},
      {t:'order', words:['always','is','late','she'], a:'she is always late', why:"Après to be."},
      {t:'qcm', q:'« Misunderstand » signifie :', opts:['mal comprendre','comprendre','recomprendre'], c:0, why:"mis- = de travers."}
    ]}
  ],
  compositions:[
    { id:'c-a2-1', title:'Composition n°1 — Premier semestre', duration:'1 h', total:20,
      parts:[
        {t:'part', title:'I. Grammaire (6 points)', items:[
          {t:'qcm', q:'Last night we ___ a film.', opts:['watch','watched','have watched'], c:1, why:"last night → past simple."},
          {t:'qcm', q:'She ___ to Ghana next month.', opts:['goes','is going','went'], c:1, why:"Projet → présent continu / going to."},
          {t:'fill', q:'Passé de « teach » :', a:['taught'], why:"taught."},
          {t:'qcm', q:'This exercise is ___ than the last one.', opts:['easy','easier','easiest'], c:1, why:"easier than."},
          {t:'qcm', q:'How ___ bread do we need?', opts:['many','much','few'], c:1, why:"bread indénombrable."},
          {t:'fill', q:"« Je ne suis pas allé » → « I ___ go. »", a:["didn't",'did not'], why:"I didn't go."}
        ]},
        {t:'part', title:'II. Vocabulaire et formation des mots (4 points)', items:[
          {t:'fill', q:'Adjectif formé sur « care » avec -ful :', a:['careful'], why:"careful."},
          {t:'fill', q:'Contraire de « possible » :', a:['impossible'], why:"impossible."},
          {t:'qcm', q:'« To put off » signifie :', opts:['reporter','allumer','enlever'], c:0, why:"put off = reporter."},
          {t:'trad', q:"J'ai besoin de conseils.", a:['i need advice','i need some advice'], why:"advice est indénombrable."}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"Last summer, Fatou travelled to Saint-Louis for the first time. She left Dakar early in the morning and arrived at midday. The journey was long but the bus was comfortable. She stayed with her cousin Mariama, who works at a hotel near the river. On the first day they visited the old bridge and took a lot of photos. The next day they went to the beach, but the weather was windy and they came back early. Fatou did not want to leave: she says it was the best holiday of her life and she is going to return next year with her brother.",
          items:[
            {t:'qcm', q:'When did Fatou travel?', opts:['last summer','next summer','last week'], c:0, why:"« Last summer »."},
            {t:'qcm', q:'Who did she stay with?', opts:['her brother','her cousin','her mother'], c:1, why:"« with her cousin Mariama »."},
            {t:'vf', q:"The weather at the beach was perfect.", a:false, why:"« the weather was windy »."},
            {t:'qcm', q:'What did they do on the first day?', opts:['they went to the beach','they visited the old bridge','they stayed at the hotel'], c:1, why:"« they visited the old bridge »."},
            {t:'qcm', q:'What is she going to do next year?', opts:['stay in Dakar','return with her brother','move to Saint-Louis'], c:1, why:"« she is going to return next year with her brother »."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:90,
          prompt:"Raconte un voyage ou une sortie que tu as faits. Où es-tu allé ? Quand ? Avec qui ? Qu'as-tu fait ? Emploie le passé simple (verbes réguliers et irréguliers) et au moins deux comparatifs. Écris au moins 90 mots.",
          criteria:["Le texte fait au moins 90 mots","Le passé simple est utilisé et correctement formé","Au moins deux verbes irréguliers apparaissent","Au moins deux comparatifs (bigger, more interesting…)","Le récit suit un ordre chronologique avec des connecteurs (first, then, after that, finally)"]}
      ]},
    { id:'c-a2-2', title:'Composition n°2 — Deuxième semestre', duration:'1 h', total:20,
      parts:[
        {t:'part', title:'I. Grammaire (6 points)', items:[
          {t:'qcm', q:'If it rains tomorrow, I ___ at home.', opts:['stay','will stay','stayed'], c:1, why:"Futur probable → will."},
          {t:'qcm', q:'She ___ the guitar when I called.', opts:['played','was playing','plays'], c:1, why:"Action en cours → past continuous."},
          {t:'fill', q:'Comparatif de « good » :', a:['better'], why:"better."},
          {t:'qcm', q:'We ___ enough time.', opts:["haven't",'have not got any','both are possible'], c:2, why:"Les deux formes se disent."},
          {t:'qcm', q:'I ___ him yesterday.', opts:['have seen','saw','see'], c:1, why:"yesterday → past simple."},
          {t:'fill', q:"« Elle va acheter une maison » → « She is ___ to buy a house. »", a:['going'], why:"going to."}
        ]},
        {t:'part', title:'II. Traduction (4 points)', items:[
          {t:'trad', q:"Je travaillais quand tu as appelé.", a:['i was working when you called'], why:"past continuous + past simple."},
          {t:'trad', q:"Il n'y a pas assez de chaises.", a:["there aren't enough chairs",'there are not enough chairs'], why:"not enough chairs."},
          {t:'trad', q:"C'est le meilleur restaurant de la ville.", a:['it is the best restaurant in town',"it's the best restaurant in town","it's the best restaurant in the city"], why:"the best restaurant in town."},
          {t:'trad', q:"Elle se lève toujours tôt.", a:['she always gets up early'], why:"always avant le verbe."}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"Ibrahima is nineteen and he is looking for his first job. Every morning he goes to a cybercafé near his house and sends emails to companies. It is not easy: he has already written more than forty letters and he has only had two interviews. His mother tells him to be patient, but he is worried because his friends are working. Last week a small company called him. They need someone who can speak English and use a computer. The interview is next Monday, so Ibrahima is practising his English every evening. He is nervous but he is going to do his best.",
          items:[
            {t:'qcm', q:'What is Ibrahima looking for?', opts:['a house','his first job','a computer'], c:1, why:"« looking for his first job »."},
            {t:'qcm', q:'How many interviews has he had?', opts:['forty','two','none'], c:1, why:"« only had two interviews »."},
            {t:'qcm', q:'What does the company need?', opts:['someone who speaks English','someone who drives','someone who cooks'], c:0, why:"« someone who can speak English »."},
            {t:'vf', q:"The interview is next Monday.", a:true, why:"« The interview is next Monday »."},
            {t:'qcm', q:'How does Ibrahima feel?', opts:['angry','nervous but determined','bored'], c:1, why:"« He is nervous but he is going to do his best »."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:100,
          prompt:"Écris un message à un ami pour lui raconter ce que tu vas faire le mois prochain et pourquoi. Utilise le futur (will, going to, présent continu), au moins deux quantifieurs (a lot of, some, a few…) et des connecteurs. Écris au moins 100 mots.",
          criteria:["Le texte fait au moins 100 mots","Les trois formes de futur sont employées à bon escient","Au moins deux quantifieurs corrects","Des connecteurs organisent le message (first, because, so, after that)","Le ton correspond à un message amical"]}
      ]}
  ],
  final:{ title:'Examen final A2', minutes:'~14 min', questions:[
    {t:'qcm', q:'Yesterday I ___ to the market.', opts:['go','went','gone','going'], c:1, why:"past simple."},
    {t:'qcm', q:'This bag is ___ than mine.', opts:['expensive','more expensive','expensiver','most expensive'], c:1, why:"Adjectif long → more."},
    {t:'qcm', q:'We ___ visit my aunt next weekend.', opts:['are going to','go to','went','has'], c:0, why:"Intention → going to."},
    {t:'qcm', q:'How ___ sugar do you need?', opts:['many','much','lot','few'], c:1, why:"Indénombrable → much."},
    {t:'qcm', q:'She ___ goes to bed before midnight.', opts:['never','not','no','none'], c:0, why:"never."},
    {t:'qcm', q:'Listen! The baby ___.', opts:['cries','cry','is crying','cried'], c:2, why:"Action en cours."},
    {t:'qcm', q:"I didn't buy ___ bread.", opts:['some','any','a','much'], c:1, why:"Négation → any."},
    {t:'qcm', q:'He ___ his keys this morning.', opts:['losed','lost','loosed','has lose'], c:1, why:"lose → lost."},
    {t:'qcm', q:'If it rains, we ___ at home.', opts:['stay','will stay','stayed','would stay'], c:1, why:"Conditionnel 1."},
    {t:'qcm', q:'The film ___ at 8 p.m. (horaire officiel)', opts:['will start','starts','is starting','started'], c:1, why:"Horaire → présent simple."},
    {t:'qcm', q:'Contraire de « legal » :', opts:['unlegal','illegal','inlegal','dislegal'], c:1, why:"illegal."},
    {t:'qcm', q:'I was born ___ 5 May.', opts:['in','on','at','of'], c:1, why:"Date → on."},
    {t:'qcm', q:'She ___ TV when the phone rang.', opts:['watched','was watching','watches','has watched'], c:1, why:"past continuous."},
    {t:'qcm', q:'It’s the ___ film I have ever seen.', opts:['worse','worst','baddest','more bad'], c:1, why:"the worst."},
    {t:'qcm', q:'There are ___ people in the street.', opts:['much','a lot of','a little','any'], c:1, why:"a lot of."},
    {t:'qcm', q:'He is good ___ playing football.', opts:['in','at','on','for'], c:1, why:"good at."},
    {t:'qcm', q:'She ___ to work by bus every day.', opts:['go','goes','is going','went'], c:1, why:"Habitude → goes."},
    {t:'qcm', q:'Nom formé sur « develop » :', opts:['developness','development','develoption','developity'], c:1, why:"development."},
    {t:'qcm', q:'I ___ my homework yesterday evening.', opts:['make','made','did','done'], c:2, why:"do homework → did."},
    {t:'qcm', q:'We ___ enough chairs for everybody.', opts:["haven't got","hasn't got","don't got",'not have'], c:0, why:"we → haven't got."}
  ]}
};
