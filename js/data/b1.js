/* Forever Academy — Cours niveau B1 (intermédiaire) */
window.COURSES = window.COURSES || {};
window.COURSES.B1 = [

{
  id:'b1-1', title:'Present perfect vs past simple', icon:'clock', duration:'35 min',
  goal:"Choisir entre « I did » et « I have done » — la frontière la plus délicate de l'anglais pour un francophone.",
  sections:[
    {t:'text', h:'Le principe', p:"Le <b>past simple</b> parle d'un moment terminé et daté. Le <b>present perfect</b> relie le passé au présent : le moment n'est pas précisé, ou la période n'est pas finie, ou le résultat compte encore aujourd'hui."},
    {t:'table', h:'Comparer', head:['Past simple','Present perfect'], rows:[
      ['I saw him yesterday.','I have seen him. (quand ? peu importe)'],
      ['She lived in Paris in 2010.','She has lived in Paris for ten years. (elle y vit encore)'],
      ['Did you eat?','Have you ever eaten sushi?'],
      ['He lost his keys this morning.','He has lost his keys. (il ne les a toujours pas)'],
      ['Repères : yesterday, ago, last week, in 2019, when','Repères : ever, never, just, already, yet, since, for, so far, recently']
    ]},
    {t:'text', h:'Construction', p:"have / has + participe passé. Régulier : -ed (worked). Irrégulier : 3ᵉ colonne (go-went-<b>gone</b>, see-saw-<b>seen</b>, do-did-<b>done</b>, write-wrote-<b>written</b>, take-took-<b>taken</b>, eat-ate-<b>eaten</b>, speak-spoke-<b>spoken</b>, break-broke-<b>broken</b>)."},
    {t:'text', h:'since et for', p:"<b>since</b> + point de départ (since 2015, since Monday, since I was a child). <b>for</b> + durée (for three years, for a long time, for ten minutes)."},
    {t:'ex', h:'Exemples', items:[
      ["I have lived in Dakar for five years.","J'habite à Dakar depuis cinq ans."],
      ["Have you ever been to London?","Es-tu déjà allé à Londres ?"],
      ["She has just finished her homework.","Elle vient de finir ses devoirs."],
      ["I haven't seen him yet.","Je ne l'ai pas encore vu."],
      ["We have already eaten.","Nous avons déjà mangé."],
      ["He went to London in 2019.","Il est allé à Londres en 2019. (daté → past simple)"]
    ]},
    {t:'tip', p:"<b>gone to</b> = parti (il n'est pas là). <b>been to</b> = y est allé et revenu. <i>He has gone to Paris</i> (il y est encore) ≠ <i>He has been to Paris</i> (il connaît Paris)."}
  ],
  exercises:[
    {t:'qcm', q:'I ___ in Dakar for five years.', opts:['live','am living','have lived'], c:2, why:"for + durée qui continue → present perfect."},
    {t:'qcm', q:'She ___ to Ghana in 2018.', opts:['has gone','went','has been'], c:1, why:"Date précise → past simple."},
    {t:'qcm', q:'___ you ever eaten sushi?', opts:['Did','Have','Do'], c:1, why:"ever → present perfect."},
    {t:'fill', q:"« Je le connais depuis 2015 » → « I have known him ___ 2015. »", a:['since'], why:"since + point de départ."},
    {t:'fill', q:"« depuis trois ans » → « ___ three years »", a:['for'], why:"for + durée."},
    {t:'qcm', q:"I ___ my keys — I can't open the door.", opts:['lost','have lost','was losing'], c:1, why:"Le résultat compte maintenant → present perfect."},
    {t:'qcm', q:'When ___ you arrive?', opts:['have','did','has'], c:1, why:"When exige une date → past simple."},
    {t:'trad', q:"Je n'ai pas encore mangé.", a:["i haven't eaten yet",'i have not eaten yet'], why:"yet en fin de phrase négative."},
    {t:'qcm', q:'He has ___ to the market (il y est encore).', opts:['been','gone','went'], c:1, why:"gone = parti et pas revenu."},
    {t:'order', words:['just','she','has','arrived'], a:'she has just arrived', why:"just se place entre have et le participe."},
    {t:'vf', q:"« I have seen him yesterday » est correct.", a:false, why:"yesterday exige le past simple : <i>I saw him yesterday.</i>"},
    {t:'qcm', q:'Participe passé de « write » :', opts:['wrote','written','writed'], c:1, why:"write - wrote - written."},
    {t:'trad', q:"As-tu déjà travaillé à l'étranger ?", a:['have you ever worked abroad'], why:"Have you ever worked abroad?"},
    {t:'qcm', q:"It's the first time I ___ this.", opts:['do','have done','did'], c:1, why:"Après « It's the first time », on emploie le present perfect."}
  ]
},

{
  id:'b1-2', title:"Les 12 temps de l'anglais : la carte complète", icon:'layers', duration:'40 min',
  goal:"Voir enfin le système des temps en entier et savoir instantanément lequel choisir.",
  sections:[
    {t:'text', h:'La logique', p:"3 époques (présent, passé, futur) × 4 aspects (simple, continu, perfect, perfect continu) = 12 temps. L'aspect <b>simple</b> = fait. <b>Continu</b> = en cours. <b>Perfect</b> = bilan avant un point. <b>Perfect continu</b> = durée jusqu'à un point."},
    {t:'table', h:'Les 12 temps avec « work »', head:['','Simple','Continu','Perfect','Perfect continu'], rows:[
      ['Présent','I work','I am working','I have worked','I have been working'],
      ['Passé','I worked','I was working','I had worked','I had been working'],
      ['Futur','I will work','I will be working','I will have worked','I will have been working']
    ]},
    {t:'table', h:'Quand utiliser quoi', head:['Temps','Emploi typique','Exemple'], rows:[
      ['Present simple','habitude, vérité','I take the bus every day.'],
      ['Present continuous','maintenant, projet proche','I am taking the bus now.'],
      ['Present perfect','bilan lié au présent','I have taken the bus twice today.'],
      ['Present perfect cont.','durée jusqu’à maintenant','I have been waiting for an hour.'],
      ['Past simple','fait daté et fini','I took the bus at 8.'],
      ['Past continuous','décor, action interrompue','I was taking the bus when it happened.'],
      ['Past perfect','antériorité dans le passé','The bus had left when I arrived.'],
      ['Past perfect cont.','durée avant un moment passé','I had been waiting for an hour when it came.'],
      ['Future simple','prédiction, décision','I will take the bus.'],
      ['Future continuous','en cours à un moment futur','At 8 I will be taking the bus.'],
      ['Future perfect','achevé avant un moment futur','By 9 I will have arrived.'],
      ['Future perfect cont.','durée à un moment futur','By June I will have been working here for a year.']
    ]},
    {t:'tip', p:"Le duo le plus utile au quotidien : <b>past simple</b> pour l'action principale, <b>past continuous</b> pour le décor. <i>I <b>was cooking</b> when the phone <b>rang</b>.</i>"}
  ],
  exercises:[
    {t:'qcm', q:'I ___ dinner when you called.', opts:['cooked','was cooking','have cooked'], c:1, why:"Action en cours interrompue → past continuous."},
    {t:'qcm', q:'By 2030 she ___ her degree.', opts:['will finish','will have finished','finishes'], c:1, why:"Achevé avant un moment futur → future perfect."},
    {t:'qcm', q:'I ___ for two hours and I am tired.', opts:['work','have been working','worked'], c:1, why:"Durée jusqu'à maintenant → present perfect continuous."},
    {t:'qcm', q:'The film ___ when we arrived.', opts:['started','had started','has started'], c:1, why:"Antériorité dans le passé → past perfect."},
    {t:'fill', q:"Present perfect continuous de « wait » (I) :", a:['i have been waiting','have been waiting'], why:"I have been waiting."},
    {t:'qcm', q:'This time tomorrow I ___ on the plane.', opts:['will sit','will be sitting','sit'], c:1, why:"En cours à un moment futur → future continuous."},
    {t:'qcm', q:'Combien de temps compte l’anglais ?', opts:['6','12','16'], c:1, why:"3 époques × 4 aspects = 12."},
    {t:'trad', q:"Je lisais quand il est entré.", a:['i was reading when he came in','i was reading when he entered'], why:"I was reading when he came in."},
    {t:'order', words:['had','left','she','I','when','arrived'], a:'she had left when i arrived', why:"She had left when I arrived."},
    {t:'qcm', q:'They ___ here since 2010.', opts:['work','have worked','worked'], c:1, why:"since → present perfect."},
    {t:'vf', q:"L'aspect « continu » exprime une action en cours.", a:true, why:"be + -ing = action en déroulement."},
    {t:'qcm', q:'When I got home, my brother ___ TV.', opts:['watched','was watching','has watched'], c:1, why:"Décor en cours → past continuous."}
  ]
},

{
  id:'b1-3', title:'Les conditionnels 0, 1 et 2', icon:'shield', duration:'32 min',
  goal:"Exprimer une condition réelle, probable ou imaginaire sans mélanger les temps.",
  sections:[
    {t:'table', h:'Les trois premiers types', head:['Type','Structure','Sens','Exemple'], rows:[
      ['0','If + présent, présent','vérité générale','If you heat water, it boils.'],
      ['1','If + présent, will + infinitif','futur probable','If it rains, I will stay home.'],
      ['2','If + past simple, would + infinitif','imaginaire, irréel','If I had more money, I would travel.']
    ]},
    {t:'text', h:'Règle absolue', p:"Jamais de <b>will</b> ni de <b>would</b> après <b>if</b>. <i>If I <s>would have</s> had time…</i> est une faute classique. Le if porte le temps « reculé », l'autre moitié porte le modal."},
    {t:'text', h:'Le cas « were »', p:"Au conditionnel 2, on emploie souvent <b>were</b> à toutes les personnes : <i>If I <b>were</b> you, I would apologise.</i> C'est la formule figée du conseil."},
    {t:'ex', h:'Exemples', items:[
      ["If you study hard, you will pass the exam.","Si tu travailles dur, tu réussiras l'examen."],
      ["If I were rich, I would build a school.","Si j'étais riche, je construirais une école."],
      ["I'll call you if I need help.","Je t'appellerai si j'ai besoin d'aide."],
      ["Unless you hurry, you will miss the bus.","À moins que tu te dépêches, tu rateras le bus."],
      ["If I knew the answer, I would tell you.","Si je connaissais la réponse, je te le dirais."]
    ]},
    {t:'tip', p:"<b>unless</b> = if … not. <i>Unless you leave now</i> = <i>If you don't leave now</i>. Ne mets pas de deuxième négation derrière."}
  ],
  exercises:[
    {t:'qcm', q:'If it rains, we ___ at home.', opts:['stay','will stay','would stay'], c:1, why:"Conditionnel 1 : if + présent, will + infinitif."},
    {t:'qcm', q:'If I ___ more time, I would travel more.', opts:['have','had','will have'], c:1, why:"Conditionnel 2 : if + past simple."},
    {t:'qcm', q:'If you heat ice, it ___.', opts:['melts','will melt','would melt'], c:0, why:"Vérité générale → conditionnel 0."},
    {t:'qcm', q:'If I ___ you, I would accept the offer.', opts:['am','was','were'], c:2, why:"Formule figée : If I were you."},
    {t:'vf', q:"« If I will have time, I will call you » est correct.", a:false, why:"Jamais will après if : <i>If I have time…</i>"},
    {t:'trad', q:"Si j'étais riche, j'achèterais une maison.", a:['if i were rich i would buy a house','if i was rich i would buy a house'], why:"If I were rich, I would buy a house."},
    {t:'qcm', q:'___ you hurry, you will be late.', opts:['If','Unless','Because'], c:1, why:"Unless = si tu ne… pas."},
    {t:'order', words:['would','I','if','tell','knew','you','I'], a:'if i knew i would tell you', why:"If I knew, I would tell you."},
    {t:'qcm', q:'She would help you if she ___ here.', opts:['is','were','will be'], c:1, why:"Conditionnel 2 → were."},
    {t:'fill', q:"Complète (type 1) : « If you ___ (call) me, I'll come. »", a:['call'], why:"if + présent simple."},
    {t:'qcm', q:'What ___ you do if you won the lottery?', opts:['will','would','do'], c:1, why:"Situation imaginaire → would."},
    {t:'trad', q:"Si tu étudies, tu réussiras.", a:['if you study you will pass',"if you study you'll pass",'if you study you will succeed'], why:"If you study, you will pass."}
  ]
},

{
  id:'b1-4', title:'Les modaux : obligation, permission, conseil', icon:'shield', duration:'30 min',
  goal:"Nuancer ce que tu dis : devoir, pouvoir, falloir, valoir mieux — sans jamais conjuguer le modal.",
  sections:[
    {t:'text', h:'Règles communes', p:"Un modal ne prend <b>jamais</b> de -s, il est suivi de l'<b>infinitif sans to</b>, et il forme la négation et la question <b>tout seul</b> : <i>She can swim. She can't swim. Can she swim?</i>"},
    {t:'table', h:'Le sens de chaque modal', head:['Modal','Sens','Exemple'], rows:[
      ['can','capacité, permission informelle','I can swim. Can I come in?'],
      ['could','capacité passée, demande polie','I could read at four. Could you help me?'],
      ['may / might','permission formelle, possibilité','May I leave? It might rain.'],
      ['must','obligation forte (venue de soi)','I must finish this tonight.'],
      ['have to','obligation extérieure (règle)','I have to wear a uniform.'],
      ["mustn't",'interdiction',"You mustn't smoke here."],
      ["don't have to",'absence d’obligation',"You don't have to come."],
      ['should / ought to','conseil','You should see a doctor.'],
      ["had better",'conseil urgent',"You'd better hurry."],
      ['shall','proposition (UK)','Shall we start?']
    ]},
    {t:'text', h:'Le piège mustn’t / don’t have to', p:"<b>You mustn't go</b> = il est interdit d'y aller. <b>You don't have to go</b> = tu peux y aller ou non, ce n'est pas obligatoire. Les deux se traduisent souvent par « tu ne dois pas », d'où la confusion."},
    {t:'ex', h:'Exemples', items:[
      ["You should drink more water.","Tu devrais boire plus d'eau."],
      ["Students must arrive before 8.","Les élèves doivent arriver avant 8 h."],
      ["You mustn't use your phone during the exam.","Tu ne dois pas utiliser ton téléphone pendant l'examen."],
      ["We don't have to pay — it's free.","Nous n'avons pas à payer — c'est gratuit."],
      ["Could you speak more slowly, please?","Pourriez-vous parler plus lentement ?"]
    ]},
    {t:'tip', p:"Au passé, <b>must</b> devient <b>had to</b> : <i>I had to leave early.</i> Les modaux n'ont pas de passé propre, on utilise un équivalent."}
  ],
  exercises:[
    {t:'qcm', q:'You ___ see a doctor about that cough.', opts:['should','must not','can'], c:0, why:"Conseil → should."},
    {t:'qcm', q:"You ___ smoke in the hospital.", opts:["don't have to","mustn't",'should'], c:1, why:"Interdiction → mustn't."},
    {t:'qcm', q:"It's free — you ___ pay.", opts:["mustn't","don't have to",'may not'], c:1, why:"Absence d'obligation → don't have to."},
    {t:'qcm', q:'She ___ swim when she was four.', opts:['can','could','must'], c:1, why:"Capacité passée → could."},
    {t:'vf', q:"« She cans swim » est correct.", a:false, why:"Un modal ne prend jamais de -s : <i>She can swim.</i>"},
    {t:'fill', q:"Passé de « must » (obligation) :", a:['had to'], why:"I had to leave."},
    {t:'qcm', q:'___ I ask you a question?', opts:['May','Must','Should'], c:0, why:"Permission polie → May I…?"},
    {t:'trad', q:"Tu devrais te reposer.", a:['you should rest','you should take a rest','you should have a rest'], why:"You should rest."},
    {t:'qcm', q:'It ___ rain later — take an umbrella.', opts:['must','might','should'], c:1, why:"Possibilité → might."},
    {t:'order', words:['you','help','could','me'], a:'could you help me', why:"Could you help me?"},
    {t:'qcm', q:'Employees ___ wear a badge (règle de l’entreprise).', opts:['have to','might','could'], c:0, why:"Obligation extérieure → have to."},
    {t:'trad', q:"Nous devons partir maintenant.", a:['we must leave now','we have to leave now'], why:"We must / have to leave now."}
  ]
},

{
  id:'b1-5', title:'La voix passive', icon:'blocks', duration:'30 min',
  goal:"Transformer une phrase active en passive et comprendre pourquoi l'anglais l'utilise beaucoup plus que le français.",
  sections:[
    {t:'text', h:'Construction', p:"<b>be</b> (au temps voulu) + <b>participe passé</b>. L'objet de la phrase active devient le sujet. L'auteur, s'il est utile, arrive avec <b>by</b>."},
    {t:'table', h:'Le passif à tous les temps', head:['Temps','Actif','Passif'], rows:[
      ['Présent','They make cars here.','Cars are made here.'],
      ['Passé','They built it in 1990.','It was built in 1990.'],
      ['Present perfect','They have sold the house.','The house has been sold.'],
      ['Futur','They will announce it.','It will be announced.'],
      ['Modal','They must repair it.','It must be repaired.'],
      ['Continu','They are cleaning the room.','The room is being cleaned.']
    ]},
    {t:'text', h:'Quand l’employer ?', p:"Quand l'auteur est inconnu (<i>My phone was stolen</i>), évident (<i>He was arrested</i>), sans importance (<i>English is spoken here</i>), ou dans un style formel/scientifique (<i>The samples were analysed</i>)."},
    {t:'ex', h:'Exemples', items:[
      ["English is spoken in more than 50 countries.","L'anglais est parlé dans plus de 50 pays."],
      ["The letter was written by my grandfather.","La lettre a été écrite par mon grand-père."],
      ["This bridge was built in 1932.","Ce pont a été construit en 1932."],
      ["Your order will be delivered tomorrow.","Votre commande sera livrée demain."],
      ["The room is being cleaned right now.","La chambre est en train d'être nettoyée."]
    ]},
    {t:'tip', p:"Avec deux compléments (give, send, tell, offer), l'anglais préfère mettre la <b>personne</b> en sujet : <i>I was given a book</i> plutôt que <i>A book was given to me</i>."}
  ],
  exercises:[
    {t:'qcm', q:'English ___ in more than 50 countries.', opts:['speaks','is spoken','is speaking'], c:1, why:"be + participe passé."},
    {t:'qcm', q:'This house ___ in 1990.', opts:['built','was built','has built'], c:1, why:"Passé passif : was built."},
    {t:'qcm', q:'The work ___ finished yet.', opts:["hasn't been",'has not','was not been'], c:0, why:"Present perfect passif : has not been finished."},
    {t:'fill', q:"Passif de « They will repair the car » → « The car ___ repaired. »", a:['will be'], why:"will be + participe passé."},
    {t:'qcm', q:'Le passif de « Someone stole my phone » est :', opts:['My phone stole.','My phone was stolen.','My phone is stealing.'], c:1, why:"L'auteur est inconnu, on l'omet."},
    {t:'trad', q:"Ce livre a été écrit en 1950.", a:['this book was written in 1950'], why:"This book was written in 1950."},
    {t:'qcm', q:'The room ___ at the moment.', opts:['is cleaning','is being cleaned','is cleaned'], c:1, why:"Passif continu : is being cleaned."},
    {t:'order', words:['was','the','by','letter','sent','Fatou'], a:'the letter was sent by fatou', why:"The letter was sent by Fatou."},
    {t:'qcm', q:'It must ___ before Friday.', opts:['be done','do','been done'], c:0, why:"Modal + be + participe passé."},
    {t:'vf', q:"Le complément d'agent s'introduit par « from ».", a:false, why:"C'est <b>by</b> : written by Shakespeare."},
    {t:'fill', q:"« On m'a donné un cadeau » → « I ___ given a present. »", a:['was'], why:"I was given a present."},
    {t:'qcm', q:'Rice ___ in Asia.', opts:['grows','is grown','is growing'], c:1, why:"Le riz est cultivé (par quelqu'un) → passif."}
  ]
},

{
  id:'b1-6', title:'Les propositions relatives', icon:'link', duration:'28 min',
  goal:"Relier deux idées en une phrase fluide avec who, which, that, whose, where.",
  sections:[
    {t:'table', h:'Les pronoms relatifs', head:['Pronom','Antécédent','Exemple'], rows:[
      ['who','personne','The man who called you is here.'],
      ['which','chose / animal','The book which I bought is great.'],
      ['that','personne ou chose (informel)','The car that I want is red.'],
      ['whose','possession','The woman whose car was stolen.'],
      ['where','lieu','The school where I studied.'],
      ['when','moment','The day when we met.']
    ]},
    {t:'text', h:'Relatives déterminatives vs explicatives', p:"<b>Déterminative</b> (essentielle, sans virgule) : <i>The students who passed can leave.</i> On peut y employer that et souvent supprimer le pronom s'il est complément : <i>The book (that) I bought.</i><br><b>Explicative</b> (entre virgules, information ajoutée) : <i>My brother, who lives in Paris, is a doctor.</i> Ici <b>that</b> est interdit et le pronom ne s'omet jamais."},
    {t:'ex', h:'Exemples', items:[
      ["That's the woman whose car was stolen.","C'est la femme dont la voiture a été volée."],
      ["This is the village where I grew up.","C'est le village où j'ai grandi."],
      ["The film that we watched was boring.","Le film que nous avons regardé était ennuyeux."],
      ["My friend, who studies medicine, helped me.","Mon ami, qui étudie la médecine, m'a aidé."]
    ]},
    {t:'tip', p:"Le français « dont » se traduit par <b>whose</b> (possession) ou par <b>of which / that … of</b> selon le cas. Ne le traduis jamais par <i>that of</i> automatiquement."}
  ],
  exercises:[
    {t:'qcm', q:"That's the woman ___ car was stolen.", opts:['who','which','whose'], c:2, why:"Possession → whose."},
    {t:'qcm', q:'The man ___ called you is my uncle.', opts:['who','which','whose'], c:0, why:"Personne, sujet → who."},
    {t:'qcm', q:'This is the house ___ I was born.', opts:['which','where','who'], c:1, why:"Lieu → where."},
    {t:'qcm', q:'The book ___ I read was excellent.', opts:['who','which','whose'], c:1, why:"Chose → which (ou that)."},
    {t:'vf', q:"Dans « My mother, that lives in Thiès, is a nurse », that est correct.", a:false, why:"Dans une relative explicative (entre virgules), on emploie who, jamais that."},
    {t:'fill', q:"Complète : « The phone ___ I bought is broken. »", a:['that','which'], why:"that ou which, tous deux acceptés ici."},
    {t:'trad', q:"C'est l'homme qui m'a aidé.", a:["that's the man who helped me",'this is the man who helped me','he is the man who helped me'], why:"That's the man who helped me."},
    {t:'order', words:['who','helped','the','man','me'], a:'the man who helped me', why:"The man who helped me…"},
    {t:'qcm', q:'Dans quelle phrase peut-on supprimer le pronom relatif ?', opts:['The man who called me.','The book that I read.','The woman whose car…'], c:1, why:"Quand le relatif est complément d'objet : <i>The book I read.</i>"},
    {t:'qcm', q:'2019 was the year ___ I moved to Dakar.', opts:['where','when','which'], c:1, why:"Un moment → when."},
    {t:'fill', q:"« La fille dont le père est médecin » → « The girl ___ father is a doctor. »", a:['whose'], why:"whose = dont (possession)."},
    {t:'qcm', q:'Everything ___ he said was true.', opts:['which','that','who'], c:1, why:"Après everything, all, something, on emploie that."}
  ]
},

{
  id:'b1-7', title:'Le discours indirect (reported speech)', icon:'chat', duration:'32 min',
  goal:"Rapporter les paroles de quelqu'un en appliquant correctement le recul des temps.",
  sections:[
    {t:'table', h:'Le recul des temps', head:['Discours direct','Discours indirect'], rows:[
      ['present simple → ','past simple : "I am tired" → He said he was tired.'],
      ['present continuous → ','past continuous : "I am working" → She said she was working.'],
      ['past simple → ','past perfect : "I saw him" → He said he had seen him.'],
      ['present perfect → ','past perfect : "I have finished" → She said she had finished.'],
      ['will → ','would : "I will come" → He said he would come.'],
      ['can → ','could : "I can help" → She said she could help.'],
      ['must → ','had to : "I must go" → He said he had to go.']
    ]},
    {t:'text', h:'Les autres changements', p:"Les repères bougent aussi : now → then, today → that day, tomorrow → the next day, yesterday → the day before, here → there, this → that. Et les pronoms s'ajustent au nouveau locuteur."},
    {t:'text', h:'Questions et ordres', p:"Question ouverte : <i>He asked <b>where I lived</b></i> (pas d'inversion, pas de do). Question fermée : <i>She asked <b>if/whether</b> I was ready.</i> Ordre : <i>He told me <b>to wait</b></i> / <i>He told me <b>not to wait</b></i>."},
    {t:'ex', h:'Exemples', items:[
      ['"I am busy." → He said he was busy.',"« Je suis occupé. » → Il a dit qu'il était occupé."],
      ['"Where do you live?" → She asked where I lived.',"« Où habites-tu ? » → Elle m'a demandé où j'habitais."],
      ['"Close the door." → He told me to close the door.',"« Ferme la porte. » → Il m'a dit de fermer la porte."],
      ['"Are you coming?" → She asked if I was coming.',"« Viens-tu ? » → Elle a demandé si je venais."]
    ]},
    {t:'tip', p:"Pas de recul des temps si le verbe introducteur est au présent (<i>He says he is tired</i>) ou si le fait reste vrai (<i>She said the Earth is round</i>)."}
  ],
  exercises:[
    {t:'qcm', q:'She said she ___ tired.', opts:['is','was','has'], c:1, why:"present → past au discours indirect."},
    {t:'qcm', q:'He said he ___ come the next day.', opts:['will','would','can'], c:1, why:"will → would."},
    {t:'qcm', q:'"I have finished." → She said she ___ finished.', opts:['has','had','have'], c:1, why:"present perfect → past perfect."},
    {t:'qcm', q:'Quelle forme est correcte ?', opts:['He asked where did I live.','He asked where I lived.','He asked where do I live.'], c:1, why:"Pas d'inversion en discours indirect."},
    {t:'fill', q:'"Are you ready?" → She asked ___ I was ready.', a:['if','whether'], why:"Question fermée → if / whether."},
    {t:'qcm', q:'"Wait here." → He told me ___ there.', opts:['wait','to wait','waiting'], c:1, why:"Ordre → tell somebody to + infinitif."},
    {t:'qcm', q:'"Don\'t move." → She told me ___ move.', opts:['not to','to not',"don't"], c:0, why:"not to + infinitif."},
    {t:'trad', q:"Il a dit qu'il était fatigué.", a:['he said he was tired','he said that he was tired'], why:"He said (that) he was tired."},
    {t:'qcm', q:'"I saw him yesterday." → He said he ___ him the day before.', opts:['saw','had seen','has seen'], c:1, why:"past simple → past perfect."},
    {t:'vf', q:"« tomorrow » devient « the next day » en discours indirect.", a:true, why:"Les repères de temps se décalent."},
    {t:'order', words:['she','me','told','leave','to'], a:'she told me to leave', why:"She told me to leave."},
    {t:'qcm', q:'"I can swim." → He said he ___ swim.', opts:['can','could','would'], c:1, why:"can → could."}
  ]
},

{
  id:'b1-8', title:'Phrasal verbs essentiels', icon:'feather', duration:'35 min',
  goal:"Comprendre et utiliser les 40 verbes à particule qui reviennent tout le temps à l'oral.",
  sections:[
    {t:'text', h:"Qu'est-ce qu'un phrasal verb ?", p:"Un verbe + une particule qui change complètement le sens : <i>look</i> (regarder), <i>look for</i> (chercher), <i>look after</i> (s'occuper de), <i>look up</i> (chercher dans un dictionnaire), <i>look forward to</i> (attendre avec impatience). Impossible de deviner : il faut les apprendre comme du vocabulaire."},
    {t:'table', h:'Les incontournables', head:['Phrasal verb','Sens','Exemple'], rows:[
      ['get up','se lever','I get up at 6.'],['get on with','bien s’entendre avec','I get on with my colleagues.'],
      ['give up','abandonner','Don’t give up!'],['find out','découvrir','I found out the truth.'],
      ['look for','chercher','I’m looking for my keys.'],['look after','s’occuper de','She looks after her sister.'],
      ['look forward to','attendre avec impatience','I look forward to seeing you.'],
      ['put off','reporter','They put off the meeting.'],['put on','mettre (un vêtement)','Put on your coat.'],
      ['take off','décoller / enlever','The plane took off.'],['turn on / off','allumer / éteindre','Turn off the light.'],
      ['turn up','arriver, se pointer','He turned up late.'],['carry on','continuer','Carry on working.'],
      ['run out of','être à court de','We ran out of petrol.'],['come across','tomber sur','I came across an old photo.'],
      ['bring up','élever (un enfant)','She brought up three children.'],
      ['break down','tomber en panne','My car broke down.'],['work out','faire du sport / résoudre','It worked out well.'],
      ['set up','créer, monter','They set up a company.'],['deal with','gérer','I deal with complaints.']
    ]},
    {t:'text', h:'Séparable ou non ?', p:"Beaucoup acceptent le complément au milieu : <i>Turn the light off</i> = <i>Turn off the light</i>. Mais avec un <b>pronom</b>, il doit se placer au milieu : <i>Turn <b>it</b> off</i> (jamais <i>turn off it</i>). Les verbes avec deux particules (look forward to, run out of) ne se séparent jamais."},
    {t:'tip', p:"Après <b>look forward to</b>, le verbe se met en -ing : <i>I look forward to <b>hearing</b> from you.</i> C'est la formule qui termine la plupart des mails professionnels."}
  ],
  exercises:[
    {t:'qcm', q:'We need to ___ the meeting until Friday.', opts:['put off','put on','put up'], c:0, why:"put off = reporter."},
    {t:'qcm', q:"I'm ___ my keys, I can't find them.", opts:['looking after','looking for','looking up'], c:1, why:"look for = chercher."},
    {t:'qcm', q:'She ___ her little brother every evening.', opts:['looks for','looks after','looks up'], c:1, why:"look after = s'occuper de."},
    {t:'qcm', q:"Don't ___ ! You're almost there.", opts:['give up','give in','give out'], c:0, why:"give up = abandonner."},
    {t:'fill', q:"« Nous sommes tombés en panne » → « Our car broke ___. »", a:['down'], why:"break down = tomber en panne."},
    {t:'qcm', q:'Which is correct with a pronoun?', opts:['Turn off it.','Turn it off.','Off turn it.'], c:1, why:"Le pronom se place entre le verbe et la particule."},
    {t:'qcm', q:'I look forward to ___ from you.', opts:['hear','hearing','heard'], c:1, why:"to est ici une préposition → -ing."},
    {t:'trad', q:"Nous sommes à court d'eau.", a:['we ran out of water',"we've run out of water",'we have run out of water'], why:"run out of = être à court de."},
    {t:'qcm', q:'He ___ late for the meeting.', opts:['turned up','turned on','turned off'], c:0, why:"turn up = arriver, se pointer."},
    {t:'qcm', q:'I ___ that he had lied.', opts:['found out','looked for','put off'], c:0, why:"find out = découvrir."},
    {t:'order', words:['on','your','put','coat'], a:'put on your coat', why:"Put on your coat / Put your coat on."},
    {t:'qcm', q:'They ___ a new company last year.', opts:['set up','set off','set in'], c:0, why:"set up = créer, monter."}
  ]
}

];
