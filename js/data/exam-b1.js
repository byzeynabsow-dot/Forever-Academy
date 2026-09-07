/* Forever Academy — Salle d'examen B1 */
window.EXAMS = window.EXAMS || {};
window.EXAMS.B1 = {
  name:'Conversation réelle',
  intro:"La salle B1 évalue le present perfect, les conditionnels, les modaux, le passif, les relatives et le discours indirect.",
  devoirs:[
    { id:'d-b1-1', title:'Devoir n°1 — Present perfect et temps', modules:['b1-1','b1-2'], points:10, questions:[
      {t:'qcm', q:'I ___ him since 2018.', opts:['know','knew','have known'], c:2, why:"since → present perfect."},
      {t:'qcm', q:'She ___ to Nigeria last year.', opts:['has gone','went','has been'], c:1, why:"Date → past simple."},
      {t:'fill', q:"« depuis deux heures » → « ___ two hours »", a:['for'], why:"for + durée."},
      {t:'qcm', q:'They ___ for an hour and they are still waiting.', opts:['waited','have been waiting','wait'], c:1, why:"Durée jusqu'à maintenant."},
      {t:'qcm', q:'The train ___ when we got to the station.', opts:['left','had left','has left'], c:1, why:"Antériorité → past perfect."},
      {t:'trad', q:"As-tu déjà visité Londres ?", a:['have you ever visited london','have you ever been to london'], why:"Have you ever been to London?"},
      {t:'order', words:['finished','just','she','has'], a:'she has just finished', why:"She has just finished."},
      {t:'vf', q:"« I have seen him yesterday » est correct.", a:false, why:"yesterday → past simple."},
      {t:'qcm', q:'Participe passé de « take » :', opts:['took','taken','taked'], c:1, why:"take-took-taken."},
      {t:'qcm', q:"He has ___ to the bank (il y est encore).", opts:['been','gone','went'], c:1, why:"gone = parti."}
    ]},
    { id:'d-b1-2', title:'Devoir n°2 — Conditionnels et modaux', modules:['b1-3','b1-4'], points:10, questions:[
      {t:'qcm', q:'If I ___ you, I would apologise.', opts:['am','were','will be'], c:1, why:"If I were you."},
      {t:'qcm', q:'If you heat water, it ___.', opts:['boils','will boil','would boil'], c:0, why:"Conditionnel 0."},
      {t:'qcm', q:'You ___ smoke in the classroom.', opts:["don't have to","mustn't",'might not'], c:1, why:"Interdiction."},
      {t:'qcm', q:"It's free, you ___ pay.", opts:["mustn't","don't have to",'may not'], c:1, why:"Absence d'obligation."},
      {t:'fill', q:"Passé de « must » :", a:['had to'], why:"had to."},
      {t:'qcm', q:'She ___ speak three languages.', opts:['can','cans','is can'], c:0, why:"Un modal ne prend pas de -s."},
      {t:'trad', q:"Tu devrais te reposer.", a:['you should rest','you should have a rest','you should take a rest'], why:"You should rest."},
      {t:'order', words:['would','I','if','travel','had','money','I'], a:'if i had money i would travel', why:"If I had money, I would travel."},
      {t:'vf', q:"« If it will rain, I stay home » est correct.", a:false, why:"If it rains, I'll stay home."},
      {t:'qcm', q:'___ I use your phone?', opts:['May','Must','Should'], c:0, why:"Permission polie."}
    ]},
    { id:'d-b1-3', title:'Devoir n°3 — Passif et relatives', modules:['b1-5','b1-6'], points:10, questions:[
      {t:'qcm', q:'This bridge ___ in 1975.', opts:['built','was built','has built'], c:1, why:"Passé passif."},
      {t:'qcm', q:'The room ___ at the moment.', opts:['is cleaning','is being cleaned','cleans'], c:1, why:"Passif continu."},
      {t:'fill', q:"Passif : « They will send the letter » → « The letter ___ sent. »", a:['will be'], why:"will be sent."},
      {t:'qcm', q:'The man ___ lives next door is a doctor.', opts:['which','who','whose'], c:1, why:"Personne sujet → who."},
      {t:'qcm', q:"That's the woman ___ son won the prize.", opts:['who','whose','which'], c:1, why:"Possession → whose."},
      {t:'qcm', q:'This is the town ___ I grew up.', opts:['which','where','who'], c:1, why:"Lieu → where."},
      {t:'trad', q:"Ce livre a été écrit par mon oncle.", a:['this book was written by my uncle'], why:"was written by."},
      {t:'order', words:['must','it','be','tomorrow','finished'], a:'it must be finished tomorrow', why:"Modal + be + participe."},
      {t:'vf', q:"Dans une relative entre virgules, on peut employer « that ».", a:false, why:"Relative explicative → who / which seulement."},
      {t:'qcm', q:'English ___ all over the world.', opts:['speaks','is spoken','is speaking'], c:1, why:"Passif présent."}
    ]},
    { id:'d-b1-4', title:'Devoir n°4 — Discours indirect et phrasal verbs', modules:['b1-7','b1-8'], points:10, questions:[
      {t:'qcm', q:'"I am tired." → He said he ___ tired.', opts:['is','was','has'], c:1, why:"Recul des temps."},
      {t:'qcm', q:'"I will come." → She said she ___ come.', opts:['will','would','can'], c:1, why:"will → would."},
      {t:'qcm', q:'"Are you ready?" → He asked ___ I was ready.', opts:['that','if','what'], c:1, why:"Question fermée → if."},
      {t:'qcm', q:'"Sit down." → She told me ___ down.', opts:['sit','to sit','sitting'], c:1, why:"Ordre → to + infinitif."},
      {t:'qcm', q:"I'm ___ my glasses, I can't find them.", opts:['looking after','looking for','looking up'], c:1, why:"look for = chercher."},
      {t:'qcm', q:'They had to ___ the wedding because of the rain.', opts:['put on','put off','put up'], c:1, why:"put off = reporter."},
      {t:'fill', q:"« nous sommes à court de » → « we have run ___ of »", a:['out'], why:"run out of."},
      {t:'trad', q:"Il m'a dit de ne pas partir.", a:['he told me not to leave','he told me not to go'], why:"not to + infinitif."},
      {t:'order', words:['up','give',"don't"], a:"don't give up", why:"Don't give up!"},
      {t:'vf', q:"On dit « turn off it ».", a:false, why:"Avec un pronom : turn it off."}
    ]}
  ],
  compositions:[
    { id:'c-b1-1', title:'Composition n°1 — Premier semestre', duration:'1 h 30', total:20,
      parts:[
        {t:'part', title:'I. Grammaire (6 points)', items:[
          {t:'qcm', q:'I ___ in this city since 2019.', opts:['live','lived','have lived'], c:2, why:"since → present perfect."},
          {t:'qcm', q:'If I had a car, I ___ to work.', opts:['drive','would drive','will drive'], c:1, why:"Conditionnel 2."},
          {t:'qcm', q:'The results ___ tomorrow.', opts:['announce','will be announced','are announcing'], c:1, why:"Passif futur."},
          {t:'fill', q:'Participe passé de « write » :', a:['written'], why:"written."},
          {t:'qcm', q:'She said she ___ busy.', opts:['is','was','will be'], c:1, why:"Discours indirect."},
          {t:'fill', q:"« Tu ne dois pas fumer ici » → « You ___ smoke here. »", a:["mustn't",'must not'], why:"Interdiction."}
        ]},
        {t:'part', title:'II. Vocabulaire et phrasal verbs (4 points)', items:[
          {t:'qcm', q:'« To find out » signifie :', opts:['découvrir','sortir','chercher'], c:0, why:"find out = découvrir."},
          {t:'qcm', q:'« To get on with someone » signifie :', opts:["s'entendre avec",'monter','continuer'], c:0, why:"bien s'entendre."},
          {t:'trad', q:"Je m'occupe de ma petite sœur.", a:['i look after my little sister','i take care of my little sister'], why:"look after."},
          {t:'trad', q:"Ils ont annulé la réunion.", a:['they cancelled the meeting','they called off the meeting'], why:"call off = annuler."}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"When Aminata finished secondary school, she wanted to become a nurse, but her family could not pay for her studies. Instead of giving up, she found a job in a pharmacy in Dakar. For three years she worked during the day and studied at night. It was exhausting, and several times she thought about stopping. Her employer, who had noticed how hard she worked, decided to help her: he paid part of her registration fee at the nursing school. Aminata has now been a nurse for two years. She says that if she had not met that man, her life would have been very different. She adds that patience and work matter more than luck.",
          items:[
            {t:'qcm', q:'Why could Aminata not study immediately?', opts:['she was not interested','her family could not pay','the school was closed'], c:1, why:"« her family could not pay for her studies »."},
            {t:'qcm', q:'Where did she work?', opts:['in a hospital','in a pharmacy','in a school'], c:1, why:"« a job in a pharmacy »."},
            {t:'qcm', q:'Who helped her?', opts:['her employer','her brother','a teacher'], c:0, why:"« Her employer … decided to help her »."},
            {t:'vf', q:"Aminata has been a nurse for five years.", a:false, why:"« for two years »."},
            {t:'qcm', q:'What is the message of the text?', opts:['luck decides everything','work and patience matter most','studies are useless'], c:1, why:"Dernière phrase du texte."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:130,
          prompt:"Raconte une difficulté que tu as rencontrée et comment tu l'as surmontée. Utilise le past simple, le past continuous et au moins un present perfect, ainsi qu'un conditionnel (« If I had…, I would… »). Écris au moins 130 mots.",
          criteria:["Le texte fait au moins 130 mots","Past simple et past continuous sont employés correctement","Au moins un present perfect justifié","Au moins une phrase conditionnelle bien construite","Le récit est organisé : situation, difficulté, solution, leçon"]}
      ]},
    { id:'c-b1-2', title:'Composition n°2 — Deuxième semestre', duration:'1 h 30', total:20,
      parts:[
        {t:'part', title:'I. Grammaire (6 points)', items:[
          {t:'qcm', q:'The house ___ last year.', opts:['sold','was sold','has sold'], c:1, why:"Passif passé."},
          {t:'qcm', q:'He asked me where I ___.', opts:['live','lived','do live'], c:1, why:"Recul des temps, pas d'inversion."},
          {t:'qcm', q:'I ___ get up early tomorrow (obligation extérieure).', opts:['must','have to','should'], c:1, why:"have to."},
          {t:'fill', q:"« Le film que j'ai vu » → « The film ___ I saw »", a:['that','which'], why:"that / which."},
          {t:'qcm', q:'She has been studying ___ three hours.', opts:['since','for','from'], c:1, why:"for + durée."},
          {t:'fill', q:"Passif : « Someone stole my bag » → « My bag ___ stolen. »", a:['was'], why:"was stolen."}
        ]},
        {t:'part', title:'II. Traduction (4 points)', items:[
          {t:'trad', q:"Si j'avais le temps, je viendrais.", a:['if i had time i would come','if i had the time i would come'], why:"Conditionnel 2."},
          {t:'trad', q:"On m'a dit d'attendre ici.", a:['i was told to wait here'], why:"Passif + to + infinitif."},
          {t:'trad', q:"Elle habite ici depuis cinq ans.", a:['she has lived here for five years',"she's lived here for five years",'she has been living here for five years'], why:"for + present perfect."},
          {t:'trad', q:"Nous devons reporter la réunion.", a:['we must put off the meeting','we have to put off the meeting','we must postpone the meeting','we have to postpone the meeting'], why:"put off = postpone."}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"Mobile money has changed daily life in West Africa. Ten years ago, sending money to a relative in a village meant travelling for hours or trusting a stranger with an envelope. Today a transfer takes thirty seconds on a basic phone. Small traders, who were often refused loans by banks, can now build a record of transactions and borrow small amounts. However, the system is not perfect. Fees remain high for very small transfers, and people who cannot read sometimes depend on an agent, which creates a risk of fraud. Experts say the next step is not more technology, but better protection for users and clearer prices.",
          items:[
            {t:'qcm', q:'What did sending money mean ten years ago?', opts:['a thirty-second transfer','hours of travelling','using a bank card'], c:1, why:"« travelling for hours »."},
            {t:'qcm', q:'Why is mobile money useful for small traders?', opts:['it builds a record of transactions','it is free','it replaces phones'], c:0, why:"« build a record of transactions and borrow »."},
            {t:'qcm', q:'What problem is mentioned?', opts:['high fees on small transfers','lack of phones','no agents'], c:0, why:"« Fees remain high for very small transfers »."},
            {t:'vf', q:"According to experts, the priority is more technology.", a:false, why:"« not more technology, but better protection »."},
            {t:'qcm', q:'Who may depend on an agent?', opts:['bank managers','people who cannot read','experts'], c:1, why:"« people who cannot read sometimes depend on an agent »."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:150,
          prompt:"« La technologie améliore-t-elle vraiment la vie quotidienne ? » Donne ton opinion en anglais, avec au moins deux arguments et un exemple concret tiré de ton pays. Emploie le passif au moins une fois et des connecteurs logiques. Écris au moins 150 mots.",
          criteria:["Le texte fait au moins 150 mots","La position est annoncée clairement dès l'introduction","Deux arguments distincts, chacun avec un exemple","Au moins une phrase au passif","Des connecteurs structurent le texte (however, moreover, therefore)"]}
      ]}
  ],
  final:{ title:'Examen final B1', minutes:'~14 min', questions:[
    {t:'qcm', q:'I ___ in Dakar for five years.', opts:['live','am living','have lived','lived'], c:2, why:"for → present perfect."},
    {t:'qcm', q:'If it rains, we ___ at home.', opts:['stay','will stay','stayed','would stay'], c:1, why:"Conditionnel 1."},
    {t:'qcm', q:"That's the woman ___ car was stolen.", opts:['who','which','whose','whom'], c:2, why:"whose."},
    {t:'qcm', q:'I ___ smoke, but I stopped last year.', opts:['used to','use to','am used to','would used'], c:0, why:"used to."},
    {t:'qcm', q:'English ___ in more than 50 countries.', opts:['speaks','is spoken','is speaking','spoke'], c:1, why:"Passif."},
    {t:'qcm', q:'You ___ see a doctor about that cough.', opts:['should','must not','can','would'], c:0, why:"Conseil."},
    {t:'qcm', q:'She said she ___ tired.', opts:['is','was','has','were'], c:1, why:"Discours indirect."},
    {t:'qcm', q:'We need to ___ the meeting until Friday.', opts:['put off','put on','put up','put down'], c:0, why:"put off."},
    {t:'qcm', q:'The film ___ when we arrived.', opts:['started','had started','has started','starts'], c:1, why:"Past perfect."},
    {t:'qcm', q:'He asked me where I ___.', opts:['live','lived','do live','am living'], c:1, why:"Pas d'inversion."},
    {t:'qcm', q:'This report must ___ before Monday.', opts:['finish','be finished','finished','being finished'], c:1, why:"Modal + be + participe."},
    {t:'qcm', q:'I have ___ finished my homework.', opts:['yet','just','since','ago'], c:1, why:"just entre have et le participe."},
    {t:'qcm', q:'If I ___ rich, I would help my village.', opts:['am','were','will be','have been'], c:1, why:"Conditionnel 2."},
    {t:'qcm', q:'The book ___ I bought is excellent.', opts:['who','that','whose','where'], c:1, why:"Chose → that."},
    {t:'qcm', q:'They ___ here since Monday.', opts:['are','have been','were','had been'], c:1, why:"since → present perfect."},
    {t:'qcm', q:'You ___ pay — it’s free.', opts:["mustn't","don't have to","should",'may not'], c:1, why:"Absence d'obligation."},
    {t:'qcm', q:'"Don\'t move." → He told me ___ move.', opts:['not to','to not',"don't",'no'], c:0, why:"not to move."},
    {t:'qcm', q:'The letter ___ yesterday.', opts:['sent','was sent','has sent','is sending'], c:1, why:"Passif passé."},
    {t:'qcm', q:'I ran ___ of money before the end of the month.', opts:['out','off','away','over'], c:0, why:"run out of."},
    {t:'qcm', q:'She has been waiting ___ two hours.', opts:['since','for','during','from'], c:1, why:"for + durée."}
  ]}
};
