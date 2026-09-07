/* Forever Academy — Cours niveau B2 (avancé) */
window.COURSES = window.COURSES || {};
window.COURSES.B2 = [

{
  id:'b2-1', title:'Past perfect et art de la narration', icon:'clock', duration:'32 min',
  goal:"Raconter une histoire à plusieurs niveaux de passé sans perdre ton auditeur.",
  sections:[
    {t:'text', h:'Le principe', p:"Le <b>past perfect</b> (had + participe passé) marque ce qui s'est passé <b>avant</b> un autre moment passé. C'est le « passé du passé ». Sans lui, l'ordre des événements devient ambigu."},
    {t:'table', h:'Les trois outils du récit', head:['Temps','Rôle','Exemple'], rows:[
      ['Past simple','les actions successives','I woke up, got dressed and left.'],
      ['Past continuous','le décor, l’action interrompue','It was raining when I left.'],
      ['Past perfect','ce qui précède','The train had already left when I arrived.']
    ]},
    {t:'ex', h:'Comparer', items:[
      ["When I arrived, she left.","Quand je suis arrivé, elle est partie. (elle part après)"],
      ["When I arrived, she had left.","Quand je suis arrivé, elle était déjà partie. (avant)"],
      ["I had been working there for two years when they closed the office.","Je travaillais là depuis deux ans quand ils ont fermé le bureau."],
      ["He couldn't get in because he had forgotten his key.","Il ne pouvait pas entrer car il avait oublié sa clé."]
    ]},
    {t:'text', h:'Past perfect continuous', p:"<b>had been + -ing</b> insiste sur la <b>durée</b> avant le moment passé : <i>She was tired because she had been studying all night.</i>"},
    {t:'tip', p:"Après <b>before</b> et <b>after</b>, l'ordre est déjà clair : le past perfect devient facultatif. <i>After he finished / had finished, he left.</i>"}
  ],
  exercises:[
    {t:'qcm', q:'By the time we arrived, the film ___.', opts:['started','has started','had started'], c:2, why:"Antériorité → past perfect."},
    {t:'qcm', q:'She was tired because she ___ all night.', opts:['worked','had been working','works'], c:1, why:"Durée avant un moment passé → past perfect continuous."},
    {t:'qcm', q:"I couldn't pay because I ___ my wallet.", opts:['forgot','had forgotten','have forgotten'], c:1, why:"L'oubli précède le moment de payer."},
    {t:'fill', q:"Past perfect de « leave » (he) :", a:['had left'], why:"had + participe passé."},
    {t:'qcm', q:'When I got home, my brother ___ dinner (il était en train).', opts:['cooked','was cooking','had cooked'], c:1, why:"Décor en cours → past continuous."},
    {t:'trad', q:"Elle était déjà partie quand je suis arrivé.", a:['she had already left when i arrived'], why:"She had already left when I arrived."},
    {t:'qcm', q:'It was the first time he ___ on a plane.', opts:['was','had been','has been'], c:1, why:"« It was the first time » + past perfect."},
    {t:'order', words:['had','they','when','eaten','we','arrived'], a:'they had eaten when we arrived', why:"They had eaten when we arrived."},
    {t:'vf', q:"Le past perfect sert à situer une action après une autre action passée.", a:false, why:"Il situe l'action <b>avant</b> une autre action passée."},
    {t:'qcm', q:'After she ___ the letter, she went out.', opts:['had written','was writing','writes'], c:0, why:"L'écriture précède la sortie."},
    {t:'trad', q:"Je n'avais jamais vu la mer avant ce jour-là.", a:['i had never seen the sea before that day'], why:"I had never seen the sea before that day."},
    {t:'qcm', q:'He said he ___ the film twice.', opts:['saw','had seen','has seen'], c:1, why:"Discours indirect d'un passé → past perfect."}
  ]
},

{
  id:'b2-2', title:'Conditionnel 3, regrets et souhaits', icon:'feather', duration:'32 min',
  goal:"Exprimer le regret, le reproche et l'hypothèse impossible : « si j'avais su… ».",
  sections:[
    {t:'table', h:'Conditionnel 3 et mixte', head:['Type','Structure','Exemple'], rows:[
      ['3','If + past perfect, would have + participe','If I had known, I would have told you.'],
      ['mixte (passé → présent)','If + past perfect, would + infinitif','If I had studied, I would be a doctor now.'],
      ['mixte (présent → passé)','If + past simple, would have + participe','If I were richer, I would have bought it.']
    ]},
    {t:'text', h:'wish et if only', p:"<b>wish + past simple</b> = regret sur le présent (<i>I wish I had more time</i> — je n'en ai pas).<br><b>wish + past perfect</b> = regret sur le passé (<i>I wish I had studied harder</i>).<br><b>wish + would</b> = agacement, on veut que ça change (<i>I wish you would stop shouting</i>).<br><b>If only</b> est plus fort, plus émotionnel."},
    {t:'text', h:'should have', p:"<b>should have + participe</b> = reproche ou regret : <i>You should have called me.</i> Négation : <i>I shouldn't have said that.</i>"},
    {t:'ex', h:'Exemples', items:[
      ["If I had left earlier, I wouldn't have missed the train.","Si j'étais parti plus tôt, je n'aurais pas raté le train."],
      ["I wish I spoke Chinese.","J'aimerais parler chinois. (je ne le parle pas)"],
      ["I wish I had listened to my parents.","J'aurais aimé écouter mes parents."],
      ["If only I could start again.","Si seulement je pouvais recommencer."],
      ["You should have told me the truth.","Tu aurais dû me dire la vérité."]
    ]},
    {t:'tip', p:"Erreur fréquente : <i>If I <s>would have</s> had known</i>. Après <b>if</b>, jamais de would — c'est <b>had</b> + participe."}
  ],
  exercises:[
    {t:'qcm', q:'If I had known, I ___ you.', opts:['will tell','would tell','would have told'], c:2, why:"Conditionnel 3 : would have + participe."},
    {t:'qcm', q:'I wish I ___ more time to prepare.', opts:['have','had','would have'], c:1, why:"Regret sur le présent → wish + past simple."},
    {t:'qcm', q:'I wish I ___ harder at school.', opts:['studied','had studied','study'], c:1, why:"Regret sur le passé → wish + past perfect."},
    {t:'qcm', q:'You ___ me — I was worried.', opts:['should call','should have called','would call'], c:1, why:"Reproche sur le passé → should have + participe."},
    {t:'vf', q:"« If I would have known » est correct.", a:false, why:"Non : <i>If I had known</i>."},
    {t:'trad', q:"Si j'avais su, je ne serais pas venu.", a:["if i had known i wouldn't have come",'if i had known i would not have come'], why:"If I had known, I wouldn't have come."},
    {t:'qcm', q:'If I had studied medicine, I ___ a doctor now.', opts:['would have been','would be','will be'], c:1, why:"Conditionnel mixte : conséquence présente."},
    {t:'qcm', q:'I wish you ___ making that noise.', opts:['stop','stopped','would stop'], c:2, why:"Agacement, demande de changement → wish + would."},
    {t:'order', words:['have','I','said',"shouldn't",'that'], a:"i shouldn't have said that", why:"I shouldn't have said that."},
    {t:'fill', q:"« Si seulement j'étais plus grand » → « If only I ___ taller. »", a:['were','was'], why:"If only I were taller."},
    {t:'qcm', q:'He ___ have passed if he had revised.', opts:['will','would','should'], c:1, why:"Conditionnel 3 : would have passed."},
    {t:'trad', q:"J'aurais aimé te le dire plus tôt.", a:['i wish i had told you earlier','i wish i had told you sooner'], why:"I wish I had told you earlier."}
  ]
},

{
  id:'b2-3', title:'Gérondif ou infinitif ?', icon:'puzzle', duration:'30 min',
  goal:"Savoir si un verbe est suivi de -ing ou de to + infinitif : une décision que tu prends dix fois par phrase.",
  sections:[
    {t:'table', h:'Verbes + -ing', head:['Verbe','Exemple'], rows:[
      ['enjoy','I enjoy reading.'],['avoid','She avoided answering.'],['finish','He finished eating.'],
      ['mind','Do you mind waiting?'],['suggest','They suggested going out.'],['practise','I practise speaking.'],
      ['keep','Keep trying!'],['imagine','Imagine living there.'],['risk','Don’t risk losing it.'],['can’t stand','I can’t stand waiting.']
    ]},
    {t:'table', h:'Verbes + to + infinitif', head:['Verbe','Exemple'], rows:[
      ['want','I want to leave.'],['decide','We decided to stay.'],['hope','I hope to see you.'],
      ['promise','He promised to help.'],['refuse','She refused to sign.'],['manage','I managed to finish.'],
      ['afford','I can’t afford to buy it.'],['agree','They agreed to meet.'],['learn','I learnt to drive.'],['offer','He offered to drive.']
    ]},
    {t:'text', h:'Ceux qui changent de sens', p:"<b>stop</b> + -ing = arrêter de faire / <b>stop to</b> = s'arrêter pour faire.<br><b>remember</b> + -ing = se souvenir d'avoir fait / <b>remember to</b> = penser à faire.<br><b>try</b> + -ing = essayer une méthode / <b>try to</b> = s'efforcer de.<br><b>forget</b> + -ing = oublier un souvenir / <b>forget to</b> = oublier de faire."},
    {t:'text', h:'Après une préposition', p:"Toujours -ing : <i>interested <b>in</b> learning, good <b>at</b> cooking, instead <b>of</b> waiting, before <b>leaving</b>, look forward <b>to</b> seeing</i>."},
    {t:'tip', p:"Après <b>make</b> et <b>let</b>, l'infinitif est <b>sans to</b> : <i>She made me laugh. Let me help you.</i>"}
  ],
  exercises:[
    {t:'qcm', q:'She avoided ___ the question.', opts:['to answer','answering','answer'], c:1, why:"avoid + -ing."},
    {t:'qcm', q:'They decided ___ early.', opts:['leaving','to leave','leave'], c:1, why:"decide + to."},
    {t:'qcm', q:'I stopped ___ coffee — it was bad for me.', opts:['drinking','to drink','drink'], c:0, why:"stop + -ing = arrêter de."},
    {t:'qcm', q:"On the way home he stopped ___ some bread.", opts:['buying','to buy','buy'], c:1, why:"stop to = s'arrêter pour."},
    {t:'qcm', q:"Remember ___ the door when you leave.", opts:['locking','to lock','lock'], c:1, why:"remember to = penser à faire."},
    {t:'fill', q:"« Je suis doué pour cuisiner » → « I'm good at ___ (cook). »", a:['cooking'], why:"Après une préposition → -ing."},
    {t:'qcm', q:'She made me ___.', opts:['to laugh','laugh','laughing'], c:1, why:"make + infinitif sans to."},
    {t:'trad', q:"J'ai hâte de te voir.", a:['i look forward to seeing you',"i'm looking forward to seeing you"], why:"look forward to + -ing."},
    {t:'qcm', q:"I can't afford ___ a new car.", opts:['buying','to buy','buy'], c:1, why:"afford + to."},
    {t:'order', words:['mind','you','do','waiting'], a:'do you mind waiting', why:"Do you mind waiting?"},
    {t:'qcm', q:'He suggested ___ to the beach.', opts:['to go','going','go'], c:1, why:"suggest + -ing."},
    {t:'vf', q:"Après « let », on emploie to + infinitif.", a:false, why:"let + infinitif sans to : <i>Let me help.</i>"}
  ]
},

{
  id:'b2-4', title:'La causative : have / get something done', icon:'blocks', duration:'25 min',
  goal:"Dire que tu fais faire quelque chose par quelqu'un d'autre — une structure sans équivalent direct en français.",
  sections:[
    {t:'text', h:'La structure', p:"<b>have / get + objet + participe passé</b>. On ne dit pas qui fait l'action, seulement qu'on la fait faire. <i>I had my car repaired</i> = j'ai fait réparer ma voiture (par un garagiste)."},
    {t:'table', h:'Comparer', head:['Phrase','Sens'], rows:[
      ['I repaired my car.','Je l’ai réparée moi-même.'],
      ['I had my car repaired.','Je l’ai fait réparer.'],
      ['I got my hair cut.','Je me suis fait couper les cheveux.'],
      ['She had her phone stolen.','On lui a volé son téléphone. (événement subi)'],
      ['We are having the house painted.','Nous faisons repeindre la maison.']
    ]},
    {t:'text', h:'have somebody do vs have something done', p:"<b>have + personne + infinitif sans to</b> : <i>I had the plumber fix the pipe</i> (on nomme l'exécutant).<br><b>get + personne + to + infinitif</b> : <i>I got my brother to help me</i> (avec une nuance de persuasion)."},
    {t:'tip', p:"<b>get</b> est plus familier que <b>have</b>, et <b>have something done</b> peut aussi décrire quelque chose de subi, souvent désagréable : <i>He had his wallet stolen.</i>"}
  ],
  exercises:[
    {t:'qcm', q:'I had my car ___ yesterday.', opts:['repair','repaired','repairing'], c:1, why:"have + objet + participe passé."},
    {t:'qcm', q:'She ___ her hair cut every month.', opts:['gets','get','getting'], c:0, why:"gets her hair cut."},
    {t:'trad', q:"Je fais repeindre ma maison.", a:['i am having my house painted',"i'm having my house painted",'i am getting my house painted'], why:"I'm having my house painted."},
    {t:'qcm', q:'He had his wallet ___ on the bus.', opts:['stole','stolen','stealing'], c:1, why:"Participe passé : stolen (événement subi)."},
    {t:'qcm', q:'I got my brother ___ me.', opts:['help','to help','helping'], c:1, why:"get + personne + to + infinitif."},
    {t:'qcm', q:'I had the mechanic ___ the engine.', opts:['check','to check','checked'], c:0, why:"have + personne + infinitif sans to."},
    {t:'fill', q:"« Je me suis fait couper les cheveux » → « I had my hair ___. »", a:['cut'], why:"cut - cut - cut : participe identique."},
    {t:'order', words:['had','we','the','painted','house'], a:'we had the house painted', why:"We had the house painted."},
    {t:'vf', q:"« I had repaired my car » signifie « je l'ai fait réparer ».", a:false, why:"Non, c'est un past perfect : je l'avais réparée moi-même. La causative est <i>I had my car repaired</i>."},
    {t:'qcm', q:'You should ___ your eyes tested.', opts:['have','having','had'], c:0, why:"should + have + objet + participe."},
    {t:'trad', q:"Elle s'est fait voler son téléphone.", a:['she had her phone stolen','she got her phone stolen'], why:"She had her phone stolen."},
    {t:'qcm', q:'Where do you ___ your suits made?', opts:['have','be','get to'], c:0, why:"Where do you have your suits made?"}
  ]
},

{
  id:'b2-5', title:'Connecteurs logiques et argumentation', icon:'link', duration:'35 min',
  goal:"Structurer un raisonnement écrit ou oral : ajouter, opposer, expliquer, conclure.",
  sections:[
    {t:'table', h:'La boîte à outils', head:['Fonction','Connecteurs','Exemple'], rows:[
      ['Ajouter','moreover, furthermore, in addition, besides','Moreover, it is cheaper.'],
      ['Opposer','however, nevertheless, on the other hand, whereas, although','However, the risk remains.'],
      ['Cause','because, since, as, due to, owing to','Due to the rain, we stayed in.'],
      ['Conséquence','therefore, thus, consequently, as a result, so','Therefore, we cancelled it.'],
      ['Illustrer','for example, for instance, such as, namely','Some cities, such as Dakar, are growing fast.'],
      ['Reformuler','in other words, that is to say','In other words, it failed.'],
      ['Conclure','in conclusion, to sum up, all in all, overall','To sum up, the plan works.']
    ]},
    {t:'text', h:'Le piège grammatical', p:"<b>although / though / even though</b> + <u>sujet + verbe</u> : <i>Although it was late, we continued.</i><br><b>despite / in spite of</b> + <u>nom ou -ing</u> : <i>Despite the rain / Despite being tired…</i><br>Confondre les deux est la faute la plus repérée en correction d'examen."},
    {t:'text', h:'Structure d’un paragraphe argumenté', p:"1. Idée principale (topic sentence). 2. Explication. 3. Exemple concret. 4. Conséquence ou lien avec la thèse. Un paragraphe = une idée."},
    {t:'ex', h:'Exemples', items:[
      ["Although he was tired, he finished the work.","Bien qu'il fût fatigué, il a terminé le travail."],
      ["Despite the traffic, she arrived on time.","Malgré la circulation, elle est arrivée à l'heure."],
      ["The costs rose; therefore, prices increased.","Les coûts ont augmenté ; par conséquent, les prix ont monté."],
      ["On the one hand it is cheap; on the other hand it is slow.","D'un côté c'est bon marché ; de l'autre c'est lent."]
    ]},
    {t:'tip', p:"À l'écrit, un connecteur en tête de phrase est suivi d'une <b>virgule</b> : <i>However, …</i> — jamais <i>However …</i> sans virgule."}
  ],
  exercises:[
    {t:'qcm', q:'___ the traffic, he arrived on time.', opts:['Although','Despite','However'], c:1, why:"Despite + nom."},
    {t:'qcm', q:'___ it was raining, we went out.', opts:['Despite','In spite of','Although'], c:2, why:"Although + sujet + verbe."},
    {t:'qcm', q:'The train was late; ___, we missed the meeting.', opts:['therefore','although','whereas'], c:0, why:"Conséquence → therefore."},
    {t:'qcm', q:'He likes tea ___ his brother prefers coffee.', opts:['whereas','due to','moreover'], c:0, why:"whereas = tandis que (contraste)."},
    {t:'fill', q:"Synonyme formel de « also » en début de phrase :", a:['moreover','furthermore','in addition'], why:"Moreover / Furthermore / In addition."},
    {t:'qcm', q:'___ being ill, she went to work.', opts:['Although','Despite','Because'], c:1, why:"Despite + -ing."},
    {t:'trad', q:"Par conséquent, nous avons annulé la réunion.", a:['therefore we cancelled the meeting','as a result we cancelled the meeting','consequently we cancelled the meeting'], why:"Therefore, we cancelled the meeting."},
    {t:'qcm', q:'___, I would like to thank everyone.', opts:['To sum up','Such as','Whereas'], c:0, why:"Conclusion → To sum up."},
    {t:'vf', q:"« Despite of the rain » est correct.", a:false, why:"Soit <i>despite the rain</i>, soit <i>in spite of the rain</i>. Jamais « despite of »."},
    {t:'order', words:['however','the','remains','problem'], a:'however the problem remains', why:"However, the problem remains."},
    {t:'qcm', q:'Many countries, ___ Senegal and Ghana, are growing.', opts:['such as','so that','due to'], c:0, why:"such as = tel que."},
    {t:'qcm', q:'___ the heavy rain, the match was cancelled.', opts:['Owing to','Although','Whereas'], c:0, why:"Owing to + nom = en raison de."}
  ]
},

{
  id:'b2-6', title:'Modaux de déduction et de probabilité', icon:'shield', duration:'28 min',
  goal:"Exprimer ce dont tu es sûr, ce que tu supposes et ce que tu écartes — au présent comme au passé.",
  sections:[
    {t:'table', h:'Degrés de certitude', head:['Modal','Certitude','Exemple'], rows:[
      ['must','presque certain que oui','He must be at home — his car is there.'],
      ['may / might / could','possible','She might know the answer.'],
      ["can't",'presque certain que non',"He can't be serious."],
      ["couldn't",'impossible (passé)',"She couldn't have known."]
    ]},
    {t:'text', h:'Au passé : modal + have + participe', p:"<b>must have</b> + participe = ça a dû arriver (<i>He must have forgotten</i>).<br><b>might/may/could have</b> = c'est peut-être arrivé.<br><b>can't have</b> = ça n'a pas pu arriver.<br><b>should have</b> = ça aurait dû arriver (mais non)."},
    {t:'ex', h:'Exemples', items:[
      ["He must have left already — the lights are off.","Il a dû partir — les lumières sont éteintes."],
      ["She can't have finished so fast.","Elle n'a pas pu finir si vite."],
      ["They might have missed the bus.","Ils ont peut-être raté le bus."],
      ["You should have warned me.","Tu aurais dû me prévenir."],
      ["It could be true, but I doubt it.","Ça pourrait être vrai, mais j'en doute."]
    ]},
    {t:'tip', p:"À l'oral, <i>must have</i> se prononce « must've » /mʌstəv/ et <i>could have</i> « could've ». C'est pourquoi on entend parfois écrit à tort « must of » — c'est une faute."}
  ],
  exercises:[
    {t:'qcm', q:"He's not answering — he ___ be asleep.", opts:['must','can’t','should'], c:0, why:"Déduction quasi certaine → must."},
    {t:'qcm', q:"That ___ be John — he's in Paris.", opts:['must','can’t','might'], c:1, why:"Impossibilité → can't."},
    {t:'qcm', q:'She ___ have left already; her coat is gone.', opts:['must','can’t','should'], c:0, why:"must have = déduction sur le passé."},
    {t:'qcm', q:'They ___ have missed the train — we are not sure.', opts:['must','might','can’t'], c:1, why:"Possibilité → might have."},
    {t:'trad', q:"Il a dû oublier.", a:['he must have forgotten'], why:"He must have forgotten."},
    {t:'qcm', q:"You ___ have told me! I was waiting for hours.", opts:['should','must','could'], c:0, why:"Reproche → should have."},
    {t:'vf', q:"« He must of gone » est correct à l'écrit.", a:false, why:"C'est <b>must have</b> gone. « must of » est une faute d'orthographe phonétique."},
    {t:'qcm', q:"She ___ have known — nobody told her.", opts:["couldn't",'must','should'], c:0, why:"Impossible → couldn't have."},
    {t:'order', words:['have','they','left','might','already'], a:'they might have already left', why:"They might have already left."},
    {t:'fill', q:"« Ça pourrait être vrai » → « It ___ be true. »", a:['could','might','may'], why:"could / might / may be true."},
    {t:'qcm', q:'The keys ___ be in the car; I saw them there.', opts:['must','can’t','shouldn’t'], c:0, why:"Preuve visuelle → must be."},
    {t:'trad', q:"Elle n'a pas pu dire ça.", a:["she can't have said that",'she cannot have said that'], why:"She can't have said that."}
  ]
},

{
  id:'b2-7', title:'Idiomes, collocations et anglais naturel', icon:'chat', duration:'35 min',
  goal:"Passer d'un anglais correct à un anglais qui sonne juste, grâce aux associations de mots que les natifs emploient.",
  sections:[
    {t:'text', h:'Les collocations', p:"Certains mots vont ensemble : on dit <b>make</b> a decision (pas « do a decision »), <b>do</b> homework, <b>take</b> a photo, <b>have</b> a shower, <b>pay</b> attention, <b>keep</b> a promise. Apprends les mots par groupes, pas isolément."},
    {t:'table', h:'make / do / take / have', head:['make','do','take','have'], rows:[
      ['a decision','homework','a photo','breakfast'],
      ['a mistake','the washing','a break','a shower'],
      ['progress','business','a taxi','fun'],
      ['an effort','someone a favour','a seat','a look'],
      ['money','your best','care of','a rest']
    ]},
    {t:'table', h:'Idiomes très fréquents', head:['Idiome','Sens'], rows:[
      ['to bite the bullet','affronter une épreuve'],['to break the ice','briser la glace'],
      ['once in a blue moon','très rarement'],['to be over the moon','être aux anges'],
      ['to cost an arm and a leg','coûter les yeux de la tête'],['to hit the books','se mettre à réviser'],
      ['to be in the same boat','être dans la même situation'],['to call it a day','en rester là'],
      ['to get the hang of it','prendre le coup de main'],['to keep your fingers crossed','croiser les doigts'],
      ['a piece of cake','très facile'],['to let the cat out of the bag','vendre la mèche']
    ]},
    {t:'tip', p:"N'invente jamais un idiome par traduction littérale du français. « Il pleut des cordes » n'est pas <i>it rains ropes</i> mais <b>it's raining cats and dogs</b> (ou, plus courant aujourd'hui, <i>it's pouring</i>)."}
  ],
  exercises:[
    {t:'qcm', q:'To “bite the bullet” means to ___.', opts:['avoid a problem','face something difficult','waste money'], c:1, why:"Affronter une situation pénible."},
    {t:'qcm', q:'___ a decision', opts:['do','make','take'], c:1, why:"make a decision."},
    {t:'qcm', q:'___ your homework', opts:['make','do','take'], c:1, why:"do homework."},
    {t:'qcm', q:'___ a photo', opts:['make','do','take'], c:2, why:"take a photo."},
    {t:'qcm', q:'“Once in a blue moon” means :', opts:['souvent','très rarement','chaque mois'], c:1, why:"Très rarement."},
    {t:'fill', q:"« faire une erreur » → « to ___ a mistake »", a:['make'], why:"make a mistake."},
    {t:'qcm', q:'“It costs an arm and a leg” means it is ___.', opts:['very cheap','very expensive','free'], c:1, why:"Très cher."},
    {t:'trad', q:"C'est du gâteau. (c'est très facile)", a:["it's a piece of cake",'it is a piece of cake'], why:"It's a piece of cake."},
    {t:'qcm', q:'“To be over the moon” means to be ___.', opts:['très heureux','perdu','fatigué'], c:0, why:"Aux anges."},
    {t:'qcm', q:'___ attention, please.', opts:['Make','Pay','Do'], c:1, why:"pay attention."},
    {t:'qcm', q:'“Let’s call it a day” means :', opts:['on arrête là','on recommence','on fixe une date'], c:0, why:"On arrête pour aujourd'hui."},
    {t:'fill', q:"« prendre une douche » → « to ___ a shower »", a:['have','take'], why:"have a shower (UK) / take a shower (US)."}
  ]
},

{
  id:'b2-8', title:'Écrire un essai et une lettre formelle', icon:'book', duration:'40 min',
  goal:"Produire un texte structuré de 200-250 mots, avec l'ouverture, le plan et les formules attendus à l'examen.",
  sections:[
    {t:'text', h:"Le plan d'un essai (opinion essay)", p:"<b>Introduction</b> : reformule le sujet + annonce ta position.<br><b>Corps 1</b> : premier argument + exemple.<br><b>Corps 2</b> : deuxième argument + exemple.<br><b>Corps 3</b> : objection ou nuance (<i>Some people argue that… However…</i>).<br><b>Conclusion</b> : bilan, sans idée nouvelle."},
    {t:'table', h:'Formules utiles', head:['Fonction','Formules'], rows:[
      ['Introduire','It is often argued that… / In recent years, … has become a major issue.'],
      ['Donner son avis','In my view, … / I firmly believe that… / From my point of view,…'],
      ['Nuancer','It is true that… but… / To a certain extent,…'],
      ['Exemplifier','A good example of this is… / For instance,…'],
      ['Conclure','All things considered,… / In conclusion, it seems clear that…']
    ]},
    {t:'text', h:'La lettre / le mail formel', p:"Ouverture : <i>Dear Sir or Madam,</i> (destinataire inconnu) ou <i>Dear Mr Diop,</i> (connu).<br>Objet clair dès la première phrase : <i>I am writing to enquire about…</i> / <i>I am writing to complain about…</i><br>Clôture : <i>Yours faithfully,</i> après « Dear Sir or Madam » ; <i>Yours sincerely,</i> après un nom. Formule d'attente : <i>I look forward to hearing from you.</i>"},
    {t:'text', h:'Registre', p:"En style formel : pas de contractions (<i>do not</i> et non <i>don't</i>), pas de phrasal verbs familiers (<i>request</i> plutôt que <i>ask for</i>), pas de « a lot of » (préfère <i>a considerable number of</i>)."},
    {t:'tip', p:"Compte tes mots. Un correcteur pénalise un texte trop court, mais aussi un texte hors sujet. Mieux vaut 220 mots bien structurés que 320 mots confus."}
  ],
  exercises:[
    {t:'qcm', q:'Après « Dear Sir or Madam », on termine par :', opts:['Yours sincerely','Yours faithfully','Best'], c:1, why:"Destinataire inconnu → Yours faithfully."},
    {t:'qcm', q:'Après « Dear Mr Diop », on termine par :', opts:['Yours sincerely','Yours faithfully','Cheers'], c:0, why:"Nom connu → Yours sincerely."},
    {t:'qcm', q:'Formule la plus formelle :', opts:["I wanna know…","I'd like to know…",'I am writing to enquire about…'], c:2, why:"Registre formel."},
    {t:'vf', q:"Dans un essai formel, on peut écrire « don't » et « can't ».", a:false, why:"On évite les contractions en style formel."},
    {t:'qcm', q:'Où place-t-on la thèse dans un essai ?', opts:["à la fin de l'introduction",'au milieu du corps','nulle part'], c:0, why:"L'introduction annonce la position."},
    {t:'fill', q:"Formule d'attente à la fin d'un mail : « I look forward to ___ from you. »", a:['hearing'], why:"look forward to + -ing."},
    {t:'qcm', q:'Quel connecteur ouvre une objection ?', opts:['Moreover','Some people argue that','For instance'], c:1, why:"On introduit l'avis adverse avant de le nuancer."},
    {t:'trad', q:"Je vous écris pour me plaindre du service.", a:['i am writing to complain about the service',"i'm writing to complain about the service"], why:"I am writing to complain about the service."},
    {t:'qcm', q:'Une conclusion doit :', opts:['ajouter un nouvel argument','résumer et trancher','poser une question au lecteur'], c:1, why:"Pas d'idée nouvelle en conclusion."},
    {t:'qcm', q:'Version formelle de « ask for » :', opts:['request','look for','get'], c:0, why:"request est le registre formel."},
    {t:'order', words:['view','my','in','is','it','necessary'], a:'in my view it is necessary', why:"In my view, it is necessary."},
    {t:'qcm', q:'Un paragraphe de corps contient idéalement :', opts:['une seule idée développée','toutes les idées','uniquement des exemples'], c:0, why:"Un paragraphe = une idée + son développement."}
  ]
}

];
