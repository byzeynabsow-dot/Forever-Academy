/* Forever Academy — Salle d'examen B2 */
window.EXAMS = window.EXAMS || {};
window.EXAMS.B2 = {
  name:'Aisance & nuance',
  intro:"La salle B2 teste le past perfect, le conditionnel 3, le gérondif, la causative, les modaux de déduction et l'argumentation écrite.",
  devoirs:[
    { id:'d-b2-1', title:'Devoir n°1 — Récit et regrets', modules:['b2-1','b2-2'], points:10, questions:[
      {t:'qcm', q:'When we arrived, the concert ___.', opts:['started','had started','has started'], c:1, why:"Antériorité."},
      {t:'qcm', q:'He was exhausted because he ___ all night.', opts:['drove','had been driving','drives'], c:1, why:"Durée avant un moment passé."},
      {t:'qcm', q:'If I had known, I ___ differently.', opts:['would act','would have acted','will act'], c:1, why:"Conditionnel 3."},
      {t:'qcm', q:'I wish I ___ that email yesterday.', opts:["didn't send","hadn't sent","won't send"], c:1, why:"Regret passé → wish + past perfect."},
      {t:'fill', q:"« Tu aurais dû m'appeler » → « You ___ have called me. »", a:['should'], why:"should have + participe."},
      {t:'trad', q:"Si seulement je pouvais recommencer.", a:['if only i could start again','if only i could begin again'], why:"If only I could start again."},
      {t:'order', words:['they','left','had','already'], a:'they had already left', why:"They had already left."},
      {t:'vf', q:"« If I would have known » est correct.", a:false, why:"If I had known."},
      {t:'qcm', q:'I wish you ___ complaining.', opts:['stop','stopped','would stop'], c:2, why:"Agacement → wish + would."},
      {t:'qcm', q:'It was the first time she ___ abroad.', opts:['went','had gone','has gone'], c:1, why:"Past perfect après « the first time » au passé."}
    ]},
    { id:'d-b2-2', title:'Devoir n°2 — Gérondif, infinitif et causative', modules:['b2-3','b2-4'], points:10, questions:[
      {t:'qcm', q:'She avoided ___ him.', opts:['to meet','meeting','meet'], c:1, why:"avoid + -ing."},
      {t:'qcm', q:'They agreed ___ the contract.', opts:['signing','to sign','sign'], c:1, why:"agree + to."},
      {t:'qcm', q:'He stopped ___ a cigarette (il s’est arrêté pour fumer).', opts:['smoking','to smoke','smoke'], c:1, why:"stop to = s'arrêter pour."},
      {t:'qcm', q:'Remember ___ the lights before leaving.', opts:['turning off','to turn off','turn off'], c:1, why:"remember to = penser à."},
      {t:'qcm', q:'I had my laptop ___ last week.', opts:['repair','repaired','repairing'], c:1, why:"Causative."},
      {t:'fill', q:"« Je me suis fait couper les cheveux » → « I had my hair ___. »", a:['cut'], why:"cut."},
      {t:'trad', q:"J'ai hâte de recevoir votre réponse.", a:['i look forward to hearing from you',"i'm looking forward to hearing from you"], why:"look forward to + -ing."},
      {t:'order', words:['me','she','laugh','made'], a:'she made me laugh', why:"make + infinitif sans to."},
      {t:'vf', q:"Après une préposition, on emploie l'infinitif.", a:false, why:"Après une préposition → -ing."},
      {t:'qcm', q:'We got the plumber ___ the leak.', opts:['fix','to fix','fixing'], c:1, why:"get + personne + to + infinitif."}
    ]},
    { id:'d-b2-3', title:'Devoir n°3 — Connecteurs et déduction', modules:['b2-5','b2-6'], points:10, questions:[
      {t:'qcm', q:'___ the delay, the event was a success.', opts:['Although','Despite','However'], c:1, why:"Despite + nom."},
      {t:'qcm', q:'___ he was ill, he came to work.', opts:['Despite','Although','In spite of'], c:1, why:"Although + sujet + verbe."},
      {t:'qcm', q:'Sales dropped; ___, we reduced production.', opts:['therefore','whereas','such as'], c:0, why:"Conséquence."},
      {t:'qcm', q:'He ___ have forgotten — he never forgets.', opts:['must',"can't",'should'], c:1, why:"Impossibilité → can't have."},
      {t:'qcm', q:'She ___ be at home; the lights are on.', opts:['must',"can't",'might not'], c:0, why:"Déduction certaine."},
      {t:'fill', q:"Synonyme formel de « also » : ___", a:['moreover','furthermore','in addition'], why:"Moreover."},
      {t:'trad', q:"Ils ont peut-être raté le train.", a:['they might have missed the train','they may have missed the train','they could have missed the train'], why:"might have + participe."},
      {t:'order', words:['have','you','told','should','me'], a:'you should have told me', why:"You should have told me."},
      {t:'vf', q:"« Despite of the rain » est correct.", a:false, why:"despite the rain / in spite of the rain."},
      {t:'qcm', q:'___ the heavy traffic, we arrived late.', opts:['Owing to','Although','Whereas'], c:0, why:"Owing to + nom."}
    ]},
    { id:'d-b2-4', title:'Devoir n°4 — Idiomes et écriture formelle', modules:['b2-7','b2-8'], points:10, questions:[
      {t:'qcm', q:'___ a decision', opts:['do','make','take'], c:1, why:"make a decision."},
      {t:'qcm', q:'___ attention', opts:['pay','do','make'], c:0, why:"pay attention."},
      {t:'qcm', q:'« To cost an arm and a leg » signifie :', opts:['coûter très cher','être blessé','être gratuit'], c:0, why:"Très cher."},
      {t:'qcm', q:'Après « Dear Sir or Madam », on signe :', opts:['Yours sincerely','Yours faithfully','Regards'], c:1, why:"Yours faithfully."},
      {t:'qcm', q:'Version formelle de « ask for » :', opts:['request','look for','get'], c:0, why:"request."},
      {t:'fill', q:"« Je vous écris pour me renseigner sur… » → « I am writing to ___ about… »", a:['enquire','inquire'], why:"enquire about."},
      {t:'trad', q:"Nous devons faire un effort supplémentaire.", a:['we must go the extra mile','we have to go the extra mile'], why:"go the extra mile."},
      {t:'order', words:['forward','hearing','I','to','look','you','from'], a:'i look forward to hearing from you', why:"Formule de clôture."},
      {t:'vf', q:"Un essai formel peut contenir « don't » et « can't ».", a:false, why:"Pas de contractions en registre formel."},
      {t:'qcm', q:'« A piece of cake » signifie :', opts:['très difficile','très facile','très cher'], c:1, why:"Très facile."}
    ]}
  ],
  compositions:[
    { id:'c-b2-1', title:'Composition n°1 — Premier semestre', duration:'2 h', total:20,
      parts:[
        {t:'part', title:'I. Grammaire et structures (6 points)', items:[
          {t:'qcm', q:'By the time she called, I ___ the report.', opts:['finished','had finished','have finished'], c:1, why:"Past perfect."},
          {t:'qcm', q:'He denied ___ the money.', opts:['to take','taking','take'], c:1, why:"deny + -ing."},
          {t:'qcm', q:'I had the car ___ before the trip.', opts:['check','checked','checking'], c:1, why:"Causative."},
          {t:'fill', q:"« Elle n'a pas pu dire ça » → « She ___ have said that. »", a:["can't",'cannot',"couldn't"], why:"can't have said."},
          {t:'qcm', q:'___ working hard, he failed the exam.', opts:['Although','Despite','However'], c:1, why:"Despite + -ing."},
          {t:'fill', q:"« J'aurais aimé étudier davantage » → « I wish I ___ studied more. »", a:['had'], why:"wish + past perfect."}
        ]},
        {t:'part', title:'II. Lexique et registre (4 points)', items:[
          {t:'qcm', q:'Version formelle de « help » :', opts:['assist','back up','give a hand'], c:0, why:"assist."},
          {t:'qcm', q:'« To think outside the box » signifie :', opts:['sortir des sentiers battus','ranger ses affaires','réfléchir lentement'], c:0, why:"Innover."},
          {t:'trad', q:"Cette décision a été prise à contrecœur.", a:['this decision was taken reluctantly','this decision was made reluctantly'], why:"passif + adverbe."},
          {t:'trad', q:"Nous devrions envisager une autre solution.", a:['we should consider another solution','we should consider a different solution'], why:"consider + nom."}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"For decades, students have been told that the best way to learn is to reread their notes. Recent research suggests the opposite. In a study conducted over two years, one group of students reread a text four times, while another group read it once and then tried to recall it from memory three times. A week later, the second group remembered almost twice as much. The reason, researchers argue, is that retrieval strengthens memory far more effectively than recognition. Rereading feels comfortable and creates an illusion of mastery; recalling feels difficult, and that difficulty is precisely what makes it work. The implication for learners is uncomfortable but clear: if a revision method feels easy, it is probably not working.",
          items:[
            {t:'qcm', q:'What did the second group do?', opts:['they reread the text four times','they recalled the text from memory','they wrote a summary'], c:1, why:"« tried to recall it from memory three times »."},
            {t:'qcm', q:'Which group remembered more?', opts:['the first','the second','both equally'], c:1, why:"« the second group remembered almost twice as much »."},
            {t:'qcm', q:'Why does rereading fail?', opts:['it takes too long','it creates an illusion of mastery','it is boring'], c:1, why:"« creates an illusion of mastery »."},
            {t:'vf', q:"According to the text, an easy revision method is usually effective.", a:false, why:"« if a revision method feels easy, it is probably not working »."},
            {t:'qcm', q:'The tone of the last sentence is :', opts:['ironique','direct et sans complaisance','humoristique'], c:1, why:"« uncomfortable but clear »."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:180,
          prompt:"Rédige un essai argumenté : « Should students be allowed to use artificial intelligence for their homework? » Introduis le sujet, donne deux arguments avec exemples, présente une objection, puis conclus. Écris au moins 180 mots en registre formel.",
          criteria:["Le texte fait au moins 180 mots","Structure claire : introduction, deux paragraphes de corps, objection, conclusion","Aucune contraction (do not, cannot…)","Au moins quatre connecteurs logiques différents","La position personnelle est annoncée et maintenue"]}
      ]},
    { id:'c-b2-2', title:'Composition n°2 — Deuxième semestre', duration:'2 h', total:20,
      parts:[
        {t:'part', title:'I. Grammaire et structures (6 points)', items:[
          {t:'qcm', q:'He must ___ the train; he is not here.', opts:['miss','have missed','missing'], c:1, why:"Déduction passée."},
          {t:'qcm', q:'She is used to ___ in public.', opts:['speak','speaking','spoke'], c:1, why:"be used to + -ing."},
          {t:'qcm', q:'If she had left earlier, she ___ the flight.', opts:["wouldn't miss","wouldn't have missed","won't miss"], c:1, why:"Conditionnel 3."},
          {t:'fill', q:"« Je fais repeindre la maison » → « I am ___ the house painted. »", a:['having','getting'], why:"Causative."},
          {t:'qcm', q:'___ he was warned, he continued.', opts:['Despite','Although','In spite of'], c:1, why:"Although + proposition."},
          {t:'fill', q:"« Elle a nié avoir menti » → « She denied ___ (lie). »", a:['lying'], why:"deny + -ing."}
        ]},
        {t:'part', title:'II. Traduction (4 points)', items:[
          {t:'trad', q:"Il a dû oublier notre rendez-vous.", a:['he must have forgotten our appointment','he must have forgotten our meeting'], why:"must have + participe."},
          {t:'trad', q:"Malgré ses efforts, il a échoué.", a:['despite his efforts he failed','in spite of his efforts he failed'], why:"Despite + nom."},
          {t:'trad', q:"J'aurais dû lui en parler plus tôt.", a:['i should have talked to him about it earlier','i should have spoken to him about it earlier','i should have told him about it earlier'], why:"should have + participe."},
          {t:'trad', q:"Nous nous sommes fait voler nos passeports.", a:['we had our passports stolen','we got our passports stolen'], why:"Causative subie."}
        ]},
        {t:'reading', title:'III. Compréhension écrite (5 points)',
          text:"Cities across Africa are growing faster than any others in the world, and planners are divided about what this means. Optimists point out that density lowers the cost of services: it is cheaper to bring water, electricity and transport to a thousand families living close together than to the same families scattered across a region. Critics reply that this argument assumes competent institutions, which are precisely what many fast-growing cities lack. Without planning, density produces not efficiency but congestion, flooding and informal settlements that are almost impossible to upgrade later. Both sides agree on one point: decisions taken in the next ten years will be almost irreversible, because the shape of a city, once built, changes only over generations.",
          items:[
            {t:'qcm', q:'What do optimists argue?', opts:['density lowers the cost of services','cities should stop growing','institutions do not matter'], c:0, why:"« density lowers the cost of services »."},
            {t:'qcm', q:'What do critics say is missing?', opts:['money','competent institutions','population'], c:1, why:"« competent institutions, which … many fast-growing cities lack »."},
            {t:'qcm', q:'What does density produce without planning?', opts:['efficiency','congestion and flooding','lower prices'], c:1, why:"« congestion, flooding and informal settlements »."},
            {t:'vf', q:"The two sides disagree on absolutely everything.", a:false, why:"« Both sides agree on one point »."},
            {t:'qcm', q:'Why are the next ten years decisive?', opts:['because funding ends','because urban form is almost irreversible','because of elections'], c:1, why:"« the shape of a city … changes only over generations »."}
          ]},
        {t:'writing', title:'IV. Expression écrite (5 points)', minWords:200,
          prompt:"Tu écris une lettre formelle au maire de ta ville pour proposer une amélioration concrète (transport, propreté, éclairage, espaces pour les jeunes…). Explique le problème, propose une solution réaliste, anticipe une objection. Respecte les formules d'ouverture et de clôture. Au moins 200 mots.",
          criteria:["Le texte fait au moins 200 mots","Ouverture et clôture formelles correctes (Dear… / Yours faithfully)","Le problème est décrit avec des faits précis","La solution proposée est concrète et réaliste","Une objection est anticipée et traitée","Aucune contraction, registre soutenu tenu du début à la fin"]}
      ]}
  ],
  final:{ title:'Examen final B2', minutes:'~14 min', questions:[
    {t:'qcm', q:'If I had known, I ___ you.', opts:['will tell','would tell','would have told','had told'], c:2, why:"Conditionnel 3."},
    {t:'qcm', q:'By the time we arrived, the film ___.', opts:['started','has started','had started','was starting'], c:2, why:"Past perfect."},
    {t:'qcm', q:'I wish I ___ more time to prepare.', opts:['have','had','would have','will have'], c:1, why:"wish + past simple."},
    {t:'qcm', q:'She avoided ___ the question.', opts:['to answer','answering','answer','answered'], c:1, why:"avoid + -ing."},
    {t:'qcm', q:'___ the traffic, he arrived on time.', opts:['Despite','Although','However','Because'], c:0, why:"Despite + nom."},
    {t:'qcm', q:'He ___ have left already; his coat is gone.', opts:['must','can','should','need'], c:0, why:"must have."},
    {t:'qcm', q:'I had my car ___ yesterday.', opts:['repair','repaired','repairing','to repair'], c:1, why:"Causative."},
    {t:'qcm', q:'Not only ___ late, but he also forgot the files.', opts:['he was','was he','he is','he had'], c:1, why:"Inversion."},
    {t:'qcm', q:'She is used to ___ early.', opts:['get up','getting up','got up','gets up'], c:1, why:"be used to + -ing."},
    {t:'qcm', q:'They ___ have missed the bus — we are not sure.', opts:['must','might','can’t','should'], c:1, why:"Possibilité."},
    {t:'qcm', q:'He denied ___ anything wrong.', opts:['to do','doing','do','done'], c:1, why:"deny + -ing."},
    {t:'qcm', q:'___ being tired, she finished the race.', opts:['Although','Despite','However','Because'], c:1, why:"Despite + -ing."},
    {t:'qcm', q:'You ___ have warned me!', opts:['should','must','can','would'], c:0, why:"Reproche."},
    {t:'qcm', q:'The report ___ by Friday (obligation).', opts:['must finish','must be finished','must finished','must finishing'], c:1, why:"Modal passif."},
    {t:'qcm', q:'I got my brother ___ me with the move.', opts:['help','to help','helping','helped'], c:1, why:"get + to + infinitif."},
    {t:'qcm', q:'Version formelle de « buy » :', opts:['get','purchase','pick up','take'], c:1, why:"purchase."},
    {t:'qcm', q:'He had ___ working there for years when the factory closed.', opts:['be','been','being','was'], c:1, why:"had been working."},
    {t:'qcm', q:'She stopped ___ coffee for health reasons.', opts:['to drink','drinking','drink','drank'], c:1, why:"stop + -ing."},
    {t:'qcm', q:'___, the results were disappointing.', opts:['However','Although','Despite','Whereas'], c:0, why:"However en tête + virgule."},
    {t:'qcm', q:'“To go the extra mile” means to ___.', opts:['travel far','make an extra effort','arrive late','give up'], c:1, why:"Effort supplémentaire."}
  ]}
};
