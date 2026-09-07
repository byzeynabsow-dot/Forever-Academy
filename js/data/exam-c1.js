/* Forever Academy — Salle d'examen C1 */
window.EXAMS = window.EXAMS || {};
window.EXAMS.C1 = {
  name:'Maîtrise',
  intro:"La salle C1 évalue l'inversion, le subjonctif, la finesse des aspects, le registre, le style et la synthèse.",
  devoirs:[
    { id:'d-c1-1', title:'Devoir n°1 — Inversion et subjonctif', modules:['c1-1','c1-2'], points:10, questions:[
      {t:'qcm', q:'Rarely ___ such dedication.', opts:['we see','do we see','we do see'], c:1, why:"Inversion après un adverbe négatif."},
      {t:'qcm', q:'Not until the last minute ___ the truth.', opts:['he told us','did he tell us','he did tell us'], c:1, why:"Inversion."},
      {t:'qcm', q:'The board insisted that the director ___ present.', opts:['is','be','was'], c:1, why:"Subjonctif."},
      {t:'qcm', q:'___ you require assistance, please call.', opts:['Should','Would','Will'], c:0, why:"Should hypothétique."},
      {t:'fill', q:"Réécris sans if : « If I had seen it… » → « ___ I seen it… »", a:['had'], why:"Had I seen it…"},
      {t:'trad', q:"Ce dont nous avons besoin, c'est de temps.", a:['what we need is time'], why:"Phrase clivée."},
      {t:'order', words:['have','never','I','such','seen','patience'], a:'never have i seen such patience', why:"Never have I seen…"},
      {t:'vf', q:"Le subjonctif prend un -s à la 3ᵉ personne.", a:false, why:"Infinitif nu : that he resign."},
      {t:'qcm', q:'It is imperative that every file ___ checked.', opts:['is','be','being'], c:1, why:"Subjonctif après imperative."},
      {t:'qcm', q:'Under no circumstances ___ this document.', opts:['you should share','should you share','you share'], c:1, why:"Inversion obligatoire."}
    ]},
    { id:'d-c1-2', title:'Devoir n°2 — Aspects et registre', modules:['c1-3','c1-4'], points:10, questions:[
      {t:'qcm', q:"I've been ___ this report all afternoon.", opts:['written','writing','wrote'], c:1, why:"Durée → perfect continu."},
      {t:'qcm', q:'She ___ leave when the news broke.', opts:['was about to','used to','would'], c:0, why:"Imminence."},
      {t:'qcm', q:'I am used to ___ under pressure.', opts:['work','working','worked'], c:1, why:"be used to + -ing."},
      {t:'qcm', q:"It's time we ___ a decision.", opts:['make','made','will make'], c:1, why:"It's time + past simple."},
      {t:'qcm', q:'Version formelle de « start » :', opts:['kick off','commence','get going'], c:1, why:"commence."},
      {t:'qcm', q:"Tag correct : « I'm right, ___ ? »", opts:["amn't I","aren't I",'am I'], c:1, why:"Exception : aren't I."},
      {t:'trad', q:"J'étais en train de me demander si vous pouviez m'aider.", a:['i was wondering if you could help me'], why:"Passé de politesse."},
      {t:'order', words:['would','summer','every','we','the','go','to','coast'], a:'every summer we would go to the coast', why:"would = habitude passée."},
      {t:'vf', q:"« Would » convient pour un état passé habituel.", a:false, why:"Pour un état, on emploie used to."},
      {t:'qcm', q:'Registre de « Loads of people » :', opts:['formel','familier','académique'], c:1, why:"Familier."}
    ]},
    { id:'d-c1-3', title:'Devoir n°3 — Style et idiomes avancés', modules:['c1-5','c1-6'], points:10, questions:[
      {t:'qcm', q:'« The wind whispered » est :', opts:['une métaphore','une personnification','une métonymie'], c:1, why:"Personnification."},
      {t:'qcm', q:'« A deafening silence » est :', opts:['un oxymore','une litote','une hyperbole'], c:0, why:"Oxymore."},
      {t:'qcm', q:'« The White House said » est :', opts:['une métonymie','une allitération','une simile'], c:0, why:"Métonymie."},
      {t:'qcm', q:'« To touch base » signifie :', opts:['reprendre contact','changer de base','se cacher'], c:0, why:"Reprendre contact brièvement."},
      {t:'qcm', q:'« To sit on the fence » signifie :', opts:['choisir un camp','rester neutre','se reposer'], c:1, why:"Ne pas trancher."},
      {t:'fill', q:"« lire entre les lignes » → « to read between the ___ »", a:['lines'], why:"read between the lines."},
      {t:'trad', q:"Il faut prendre cette information avec des pincettes.", a:['you should take this information with a pinch of salt','take this information with a pinch of salt','you must take this information with a pinch of salt'], why:"with a pinch of salt."},
      {t:'order', words:['ball','the','rolling','get',"let's"], a:"let's get the ball rolling", why:"Lancer le processus."},
      {t:'vf', q:"Un understatement consiste à exagérer.", a:false, why:"C'est l'inverse : atténuer."},
      {t:'qcm', q:'« A ballpark figure » est :', opts:['une estimation approximative','un chiffre exact','un terrain de sport'], c:0, why:"Estimation."}
    ]},
    { id:'d-c1-4', title:'Devoir n°4 — Synthèse et prise de parole', modules:['c1-7','c1-8'], points:10, questions:[
      {t:'qcm', q:'« Skimming » consiste à :', opts:["parcourir pour l'idée générale",'chercher un chiffre','analyser le style'], c:0, why:"Survol."},
      {t:'qcm', q:'« The author claims that… » indique :', opts:['une adhésion','une distance critique','une neutralité totale'], c:1, why:"claim = distance."},
      {t:'qcm', q:'Dans un résumé, il faut :', opts:['citer longuement','reformuler','donner son avis'], c:1, why:"Reformulation."},
      {t:'qcm', q:'Pour contredire poliment :', opts:["You're wrong.","I'm afraid I have to disagree.",'Nonsense.'], c:1, why:"Registre poli."},
      {t:'qcm', q:'Pour interrompre poliment :', opts:['May I come in here?','Shut up.','Listen.'], c:0, why:"Formule d'interruption."},
      {t:'fill', q:"Verbe pour « met en garde » : the author ___ that…", a:['warns','warn'], why:"warns."},
      {t:'trad', q:"Si je comprends bien, vous proposez de reporter le projet.", a:['if i understand correctly you are proposing to postpone the project','if i understand correctly you propose to postpone the project'], why:"Reformulation."},
      {t:'order', words:['point','see','your','I','but'], a:'i see your point but', why:"Concession."},
      {t:'vf', q:"Une pause vaut mieux qu'un « euh » à l'oral.", a:true, why:"La pause traduit la maîtrise."},
      {t:'qcm', q:'Un résumé fait généralement :', opts:['le quart du texte','la moitié','le double'], c:0, why:"Environ un quart."}
    ]}
  ],
  compositions:[
    { id:'c-c1-1', title:'Composition n°1 — Premier semestre', duration:'2 h 30', total:20,
      parts:[
        {t:'part', title:'I. Structures avancées (6 points)', items:[
          {t:'qcm', q:'Seldom ___ such a clear explanation.', opts:['we hear','do we hear','we do hear'], c:1, why:"Inversion."},
          {t:'qcm', q:'The report recommends that the policy ___ revised.', opts:['is','be','was'], c:1, why:"Subjonctif."},
          {t:'fill', q:"Sans if : « If it had rained… » → « ___ it rained… »", a:['had'], why:"Had it rained…"},
          {t:'qcm', q:'It was her patience ___ impressed the jury.', opts:['what','that','which one'], c:1, why:"Clivée : It was … that."},
          {t:'qcm', q:'He speaks as though he ___ in charge.', opts:['is','was','were'], c:2, why:"Irréel → were."},
          {t:'fill', q:"« Il est temps que nous partions » → « It's time we ___. »", a:['left'], why:"It's time + past simple."}
        ]},
        {t:'part', title:'II. Registre et lexique (4 points)', items:[
          {t:'qcm', q:'Version académique de « a lot of people » :', opts:['loads of people','a considerable number of individuals','tons of folks'], c:1, why:"Registre soutenu."},
          {t:'qcm', q:'« To play devil’s advocate » signifie :', opts:['défendre une thèse par méthode','médire','abandonner'], c:0, why:"Argumenter contre pour tester."},
          {t:'trad', q:"Cette hypothèse mérite d'être examinée de plus près.", a:['this hypothesis deserves closer examination','this hypothesis deserves to be examined more closely'], why:"Registre académique."},
          {t:'trad', q:"Il convient de nuancer cette affirmation.", a:['this claim should be qualified','this statement should be qualified','this claim needs to be qualified'], why:"qualify a claim = nuancer."}
        ]},
        {t:'reading', title:'III. Compréhension et analyse (5 points)',
          text:"It has become fashionable to describe attention as a resource that technology 'steals'. The metaphor is convenient, but it does more harm than good. A resource is finite and passive: coal does not decide whether it is burned. Attention, by contrast, is trained. It is shaped by what we practise, and it recovers when it is exercised deliberately. Framing it as stolen property flatters the user, who becomes an innocent victim, and exaggerates the power of the platforms, which become irresistible forces. Neither is accurate. Platforms are designed to exploit predictable weaknesses, and that design deserves scrutiny and regulation; but the same research that documents those weaknesses also shows that structured practice restores concentration within weeks. To speak only of theft is to describe half of the problem and none of the remedy.",
          items:[
            {t:'qcm', q:"What is the author's attitude to the metaphor of theft?", opts:['approving','critical','neutral'], c:1, why:"« it does more harm than good »."},
            {t:'qcm', q:'Why does the author reject the resource comparison?', opts:['attention is finite','attention is trained and recovers','coal is cheaper'], c:1, why:"« Attention, by contrast, is trained »."},
            {t:'qcm', q:'What does the metaphor do to the user?', opts:['it flatters them as an innocent victim','it blames them entirely','it ignores them'], c:0, why:"« flatters the user, who becomes an innocent victim »."},
            {t:'vf', q:"The author denies that platforms exploit weaknesses.", a:false, why:"« Platforms are designed to exploit predictable weaknesses »."},
            {t:'qcm', q:"The last sentence functions as :", opts:['une concession','une conclusion synthétique','un exemple'], c:1, why:"Elle résume la thèse : la métaphore décrit la moitié du problème."}
          ]},
        {t:'writing', title:'IV. Essai argumenté (5 points)', minWords:250,
          prompt:"« Attention is trained, not stolen. » Discute cette affirmation. Tu dois : reformuler la thèse, l'appuyer par deux arguments, la contester par une objection sérieuse, puis trancher. Emploie au moins une inversion et un subjonctif. Au moins 250 mots, registre académique.",
          criteria:["Le texte fait au moins 250 mots","La thèse de départ est reformulée sans être recopiée","Deux arguments développés, chacun avec une preuve ou un exemple","Une objection sérieuse est présentée puis discutée","Au moins une inversion stylistique correcte","Au moins un subjonctif correct","Aucune contraction, lexique précis et varié"]}
      ]},
    { id:'c-c1-2', title:'Composition n°2 — Deuxième semestre', duration:'2 h 30', total:20,
      parts:[
        {t:'part', title:'I. Structures avancées (6 points)', items:[
          {t:'qcm', q:'Little ___ how difficult it would be.', opts:['they knew','did they know','knew they'], c:1, why:"Inversion après Little."},
          {t:'qcm', q:'No sooner ___ than the storm began.', opts:['we had left','had we left','we left'], c:1, why:"No sooner + inversion."},
          {t:'qcm', q:'It is essential that he ___ informed immediately.', opts:['is','be','was'], c:1, why:"Subjonctif."},
          {t:'fill', q:"« Ce qui compte, c'est le résultat » → « ___ matters is the result. »", a:['what'], why:"What matters is…"},
          {t:'qcm', q:'She would rather we ___ now.', opts:['leave','left','will leave'], c:1, why:"would rather + past simple."},
          {t:'fill', q:"« Il parlait bas de peur de réveiller l'enfant » → « He spoke softly ___ he wake the child. »", a:['lest'], why:"lest (registre très soutenu)."}
        ]},
        {t:'part', title:'II. Analyse stylistique (4 points)', items:[
          {t:'qcm', q:'« Hope is the thing with feathers » est :', opts:['une métaphore','une simile','une litote'], c:0, why:"Métaphore."},
          {t:'qcm', q:'« It’s only a scratch » sur une blessure grave est :', opts:['une hyperbole','un understatement','une métonymie'], c:1, why:"Atténuation ironique."},
          {t:'trad', q:"Le silence qui suivit fut plus éloquent que tout discours.", a:['the silence that followed was more eloquent than any speech'], why:"Comparatif + registre littéraire."},
          {t:'trad', q:"L'auteur insiste sur le fait que rien n'est joué.", a:['the author emphasises that nothing is decided','the author emphasizes that nothing is decided','the author insists that nothing is decided'], why:"emphasise that."}
        ]},
        {t:'reading', title:'III. Compréhension et analyse (5 points)',
          text:"Every generation believes it has invented the crisis of the young. In 1900, reformers warned that cheap novels would ruin the moral sense of adolescents; in 1950, comic books; in 1990, video games. Each panic followed the same grammar: a new medium, a group without power, and a claim that could not easily be tested. What is striking is not that the warnings were wrong — some were partly right — but that they were never revised. When the predicted collapse failed to arrive, the argument simply migrated to the next technology. This pattern should make us cautious today, though caution is not indifference. The proper response to a moral panic is not to dismiss the concern, but to demand from it what it has always lacked: evidence that survives contact with data.",
          items:[
            {t:'qcm', q:'What does the author say each panic shares?', opts:['a new medium and an untestable claim','a scientific method','a political party'], c:0, why:"« a new medium, a group without power, and a claim that could not easily be tested »."},
            {t:'qcm', q:'What strikes the author most?', opts:['the warnings were wrong','they were never revised','they were popular'], c:1, why:"« they were never revised »."},
            {t:'qcm', q:'« caution is not indifference » means :', opts:['on doit ignorer le sujet','être prudent ne veut pas dire s’en désintéresser','il faut paniquer'], c:1, why:"Nuance explicite."},
            {t:'vf', q:"The author asks readers to dismiss every concern about new media.", a:false, why:"« The proper response … is not to dismiss the concern »."},
            {t:'qcm', q:'What does the author demand?', opts:['censorship','evidence that survives contact with data','more novels'], c:1, why:"Dernière phrase."}
          ]},
        {t:'writing', title:'IV. Synthèse et essai (5 points)', minWords:280,
          prompt:"Rédige en deux temps : (1) un résumé neutre du texte ci-dessus en 70 mots environ, sans copier plus de trois mots consécutifs ; (2) un essai d'au moins 200 mots répondant à la question « Are today's fears about technology different from those of the past? ». Emploie au moins deux verbes de rapport (argues, points out, acknowledges…).",
          criteria:["Le résumé fait environ 70 mots et reste neutre","Aucune séquence de plus de trois mots recopiée du texte","L'essai fait au moins 200 mots","Au moins deux verbes de rapport correctement employés","Une thèse claire, deux arguments, une concession, une conclusion","Registre académique tenu, sans contraction"]}
      ]}
  ],
  final:{ title:'Examen final C1', minutes:'~14 min', questions:[
    {t:'qcm', q:'___ had I closed the door than the phone rang.', opts:['No sooner','Hardly','Scarcely','Barely'], c:0, why:"No sooner … than."},
    {t:'qcm', q:'The committee recommended that he ___ immediately.', opts:['resigns','resign','resigned','will resign'], c:1, why:"Subjonctif."},
    {t:'qcm', q:'It was in 2019 ___ she moved to London.', opts:['when','that','which','where'], c:1, why:"Phrase clivée."},
    {t:'qcm', q:'To “bite the bullet” means to ___.', opts:['avoid a problem','face something difficult','speak angrily','waste money'], c:1, why:"Affronter."},
    {t:'qcm', q:'Little ___ that she was being watched.', opts:['she knew','did she know','she did know','knew she'], c:1, why:"Inversion."},
    {t:'qcm', q:'His argument, ___ compelling, lacked evidence.', opts:['while','albeit','despite','whereas'], c:1, why:"albeit + adjectif."},
    {t:'qcm', q:'Under no circumstances ___ the file.', opts:['you should open','should you open','you open','open you'], c:1, why:"Inversion."},
    {t:'qcm', q:'It is vital that every member ___ present.', opts:['is','be','was','being'], c:1, why:"Subjonctif."},
    {t:'qcm', q:'___ you need help, do not hesitate to call.', opts:['Should','Would','Will','Might'], c:0, why:"Should hypothétique."},
    {t:'qcm', q:'I would rather you ___ now.', opts:['leave','left','will leave','leaving'], c:1, why:"would rather + past simple."},
    {t:'qcm', q:'« A deafening silence » is ___.', opts:['a simile','an oxymoron','a metonymy','a hyperbole'], c:1, why:"Oxymore."},
    {t:'qcm', q:'« The White House announced » is ___.', opts:['metonymy','irony','alliteration','simile'], c:0, why:"Métonymie."},
    {t:'qcm', q:'She speaks as if she ___ the owner.', opts:['is','was','were','be'], c:2, why:"Irréel → were."},
    {t:'qcm', q:'Formal equivalent of « ask for » :', opts:['request','look for','get','take'], c:0, why:"request."},
    {t:'qcm', q:'“To sit on the fence” means to ___.', opts:['take a side','remain neutral','climb','rest'], c:1, why:"Rester neutre."},
    {t:'qcm', q:'Only after the meeting ___ the truth.', opts:['I learned','did I learn','I did learn','learned I'], c:1, why:"Only after + inversion."},
    {t:'qcm', q:'The author ___ that the data are incomplete (concession).', opts:['claims','acknowledges','warns','denies'], c:1, why:"acknowledge = reconnaître."},
    {t:'qcm', q:'“Take it with a pinch of salt” means ___.', opts:['believe it fully','doubt it somewhat','add salt','forget it'], c:1, why:"Ne pas prendre au pied de la lettre."},
    {t:'qcm', q:'___ as it may seem, the theory holds.', opts:['Strange','Strangely','However strange','Stranger'], c:0, why:"Strange as it may seem."},
    {t:'qcm', q:'He spoke softly ___ he wake the child.', opts:['lest','unless','although','whereas'], c:0, why:"lest = de peur que."}
  ]}
};
