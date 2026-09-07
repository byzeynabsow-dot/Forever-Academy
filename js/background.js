/* =========================================================
   Forever Academy — fond vidéo animé + transitions de vue
   Les trois clips s'enchaînent en fondu avec un lent zoom.
   ========================================================= */
(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var host = document.getElementById('videoBg');
  if(!host) return;
  var clips = Array.prototype.slice.call(host.querySelectorAll('video'));
  if(!clips.length){ document.body.classList.add('no-video'); return; }

  var index = 0, timer = null, HOLD = 9000, broken = 0;

  clips.forEach(function(v){
    v.addEventListener('error', function(){
      broken++;
      if(broken >= clips.length) document.body.classList.add('no-video');
    });
  });

  function play(v){
    try{
      var p = v.play();
      if(p && p.catch) p.catch(function(){ /* autoplay bloqué : on retentera au 1er geste */ });
    }catch(e){}
  }

  function show(i){
    clips.forEach(function(v, k){
      if(k === i){
        v.classList.add('is-live');
        try{ v.currentTime = 0; }catch(e){}
        play(v);
      }else{
        v.classList.remove('is-live');
        if(k !== i) { try{ v.pause(); }catch(e){} }
      }
    });
  }

  function next(){
    index = (index + 1) % clips.length;
    show(index);
  }

  function start(){
    show(0);
    if(reduced || clips.length < 2) return;
    clearInterval(timer);
    timer = setInterval(next, HOLD);
  }

  /* relance si l'autoplay a été bloqué jusqu'au premier geste */
  function kick(){
    var live = clips[index];
    if(live && live.paused) play(live);
  }
  ['click','touchstart','keydown','scroll'].forEach(function(ev){
    window.addEventListener(ev, kick, { passive:true });
  });
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){ clearInterval(timer); }
    else { kick(); if(!reduced && clips.length > 1){ clearInterval(timer); timer = setInterval(next, HOLD); } }
  });

  /* balayage doré au changement de vue */
  var curtain = document.getElementById('viewCurtain');
  window.TS_sweep = function(){
    if(!curtain || reduced) return;
    curtain.classList.remove('sweep');
    void curtain.offsetWidth;
    curtain.classList.add('sweep');
  };

  start();
})();
