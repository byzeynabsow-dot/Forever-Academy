/* =========================================================================
   Forever Academy — logique du site
   Aucune dependance externe : tout le 3D repose sur les transformations CSS
   pilotees ici (rotations de vues, carrousel circulaire, panneau pivotant).
   ========================================================================= */
(function () {
  "use strict";

  var PRODUCTS = window.FOREVER_PRODUCTS || [];
  var CATEGORIES = window.FOREVER_CATEGORIES || [];
  var VIEWS = ["accueil", "produits", "apropos", "contact"];
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  function price(v) { return euro.format(v); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) { if (PRODUCTS[i].id === id) return PRODUCTS[i]; } return null; }
  function categoryLabel(id) {
    for (var i = 0; i < CATEGORIES.length; i++) { if (CATEGORIES[i].id === id) return CATEGORIES[i].label; }
    return id;
  }

  /* =======================================================================
     1. Illustrations produits generees en SVG
     ===================================================================== */
  function art(p, key) {
    var uid = p.id + "-" + (key || "x");
    var a = p.colors.a, b = p.colors.b;
    var label = p.name.replace(/^Forever\s+/i, "");
    if (label.length > 15) label = label.split(" ").slice(0, 2).join(" ");

    var defs =
      '<defs>' +
        '<linearGradient id="g-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="' + a + '"/><stop offset="100%" stop-color="' + b + '"/>' +
        '</linearGradient>' +
        '<linearGradient id="s-' + uid + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#ffffff" stop-opacity=".45"/>' +
          '<stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>' +
          '<stop offset="100%" stop-color="#000000" stop-opacity=".28"/>' +
        '</linearGradient>' +
        '<linearGradient id="c-' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#f2f6f1"/><stop offset="100%" stop-color="#b9c6bb"/>' +
        '</linearGradient>' +
      '</defs>';

    var shadow = '<ellipse cx="60" cy="231" rx="40" ry="7" fill="#000" opacity=".38"/>';
    var body = "";

    if (p.shape === "jar") {
      body =
        '<rect x="19" y="92" width="82" height="126" rx="18" fill="url(#g-' + uid + ')"/>' +
        '<rect x="19" y="92" width="82" height="126" rx="18" fill="url(#s-' + uid + ')"/>' +
        '<rect x="13" y="62" width="94" height="36" rx="13" fill="url(#c-' + uid + ')"/>' +
        '<rect x="13" y="62" width="94" height="36" rx="13" fill="url(#s-' + uid + ')" opacity=".5"/>' +
        '<rect x="26" y="126" width="68" height="62" rx="10" fill="#fdfdf8" opacity=".93"/>';
    } else if (p.shape === "tube") {
      body =
        '<path d="M34 76c0-8 4-12 8-16l4-6h28l4 6c4 4 8 8 8 16v134c0 6-4 10-10 10H44c-6 0-10-4-10-10z" fill="url(#g-' + uid + ')"/>' +
        '<path d="M34 76c0-8 4-12 8-16l4-6h28l4 6c4 4 8 8 8 16v134c0 6-4 10-10 10H44c-6 0-10-4-10-10z" fill="url(#s-' + uid + ')"/>' +
        '<rect x="45" y="24" width="30" height="32" rx="8" fill="url(#c-' + uid + ')"/>' +
        '<rect x="41" y="48" width="38" height="9" rx="4" fill="#dfe7de"/>' +
        '<rect x="41" y="104" width="38" height="82" rx="8" fill="#fdfdf8" opacity=".93"/>';
    } else {
      body =
        '<rect x="43" y="16" width="34" height="24" rx="7" fill="url(#c-' + uid + ')"/>' +
        '<rect x="49" y="36" width="22" height="26" fill="#cfd9cf"/>' +
        '<path d="M28 84c0-14 12-18 21-24V60h22v0c9 6 21 10 21 24v122c0 8-6 14-14 14H42c-8 0-14-6-14-14z" fill="url(#g-' + uid + ')"/>' +
        '<path d="M28 84c0-14 12-18 21-24V60h22v0c9 6 21 10 21 24v122c0 8-6 14-14 14H42c-8 0-14-6-14-14z" fill="url(#s-' + uid + ')"/>' +
        '<rect x="31" y="112" width="58" height="76" rx="10" fill="#fdfdf8" opacity=".93"/>';
    }

    var textY = p.shape === "jar" ? 152 : (p.shape === "tube" ? 140 : 148);
    var textX = 60;
    var text =
      '<text x="' + textX + '" y="' + (textY - 16) + '" text-anchor="middle" font-family="Georgia,serif" font-size="8.5" ' +
        'letter-spacing="1.6" fill="' + b + '">FOREVER</text>' +
      '<text x="' + textX + '" y="' + textY + '" text-anchor="middle" font-family="Georgia,serif" font-size="10" ' +
        'fill="#12301f">' + esc(label) + '</text>' +
      '<text x="' + textX + '" y="' + (textY + 16) + '" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="7" ' +
        'letter-spacing="1" fill="#5c6f60">' + esc(p.size) + '</text>' +
      '<circle cx="' + textX + '" cy="' + (textY + 30) + '" r="7" fill="none" stroke="' + a + '" stroke-width="1.5"/>' +
      '<path d="M' + textX + ' ' + (textY + 25) + 'c3 3 3 7 0 10c-3-3-3-7 0-10z" fill="' + a + '"/>';

    return '<svg viewBox="0 0 120 240" role="img" aria-label="' + esc(p.name) + '">' +
      defs + shadow + body + text + '</svg>';
  }

  /* =======================================================================
     2. Decor : feuilles qui tombent en 3D
     ===================================================================== */
  (function leaves() {
    var host = $("#leaves");
    if (!host) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 14; i++) {
      var el = document.createElement("span");
      el.className = "leaf";
      var w = 16 + Math.round(Math.random() * 16);
      el.style.width = w + "px";
      el.style.height = Math.round(w * 2.3) + "px";
      el.style.left = (Math.random() * 100).toFixed(2) + "%";
      el.style.setProperty("--dx", (Math.random() * 260 - 130).toFixed(0) + "px");
      el.style.animationDuration = (16 + Math.random() * 18).toFixed(1) + "s";
      el.style.animationDelay = (-Math.random() * 24).toFixed(1) + "s";
      el.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
      frag.appendChild(el);
    }
    host.appendChild(frag);
  })();

  /* =======================================================================
     3. Routeur : chaque vue pivote autour de l'axe Y
     ===================================================================== */
  var stageInner = $("#stageInner");
  var currentView = "accueil";
  var switching = false;

  function setNavActive(name) {
    $$("#siteNav a").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-nav") === name);
    });
  }

  function goTo(name, opts) {
    opts = opts || {};
    if (VIEWS.indexOf(name) === -1) return;
    var next = document.querySelector('.view[data-view="' + name + '"]');
    if (!next) return;
    if (name === currentView) {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      if (opts.filter) applyFilter(opts.filter);
      return;
    }
    if (switching) return;
    switching = true;

    var prev = document.querySelector('.view[data-view="' + currentView + '"]');
    var forward = VIEWS.indexOf(name) > VIEWS.indexOf(currentView);
    var lowMotion = document.documentElement.getAttribute("data-motion") === "low" || prefersReduced;

    if (prev) {
      prev.classList.add("is-leaving", forward ? "leave-left" : "leave-right");
      var cleanup = function () {
        prev.classList.remove("is-active", "is-leaving", "leave-left", "leave-right");
        prev.removeEventListener("animationend", cleanup);
      };
      prev.addEventListener("animationend", cleanup);
      window.setTimeout(cleanup, lowMotion ? 60 : 700);
    }

    next.classList.add("is-active", forward ? "enter-right" : "enter-left");
    next.addEventListener("animationend", function done() {
      next.classList.remove("enter-right", "enter-left");
      next.removeEventListener("animationend", done);
    });

    currentView = name;
    setNavActive(name);
    if (history.replaceState) history.replaceState(null, "", "#" + name);
    window.scrollTo({ top: 0, behavior: "auto" });
    window.setTimeout(function () {
      switching = false;
      next.focus({ preventScroll: true });
      if (opts.filter) applyFilter(opts.filter);
    }, lowMotion ? 60 : 420);
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-nav]");
    if (!trigger) return;
    e.preventDefault();
    closeNav();
    goTo(trigger.getAttribute("data-nav"), { filter: trigger.getAttribute("data-filter") });
  });

  /* menu mobile */
  var burger = $("#burger"), siteNav = $("#siteNav");
  function closeNav() {
    if (!siteNav) return;
    siteNav.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
  }

  /* =======================================================================
     4. En-tete collant, barre de progression, apparitions
     ===================================================================== */
  var header = $("#siteHeader"), progress = $("#scrollProgress");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var revealObserver = null;
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealObserver.unobserve(en.target); }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8%" });
    $$(".reveal").forEach(function (el) { revealObserver.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* compteurs animes */
  function runCounters() {
    $$("[data-count]").forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (String(target).split(".")[1] || "").length;
      var start = performance.now(), dur = 1400;
      (function step(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        var val = (target * eased).toFixed(decimals).replace(".", ",");
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(step);
      })(start);
    });
  }
  window.setTimeout(runCounters, 400);

  /* =======================================================================
     5. Effets pointeur : tilt 3D et parallaxe
     ===================================================================== */
  function lowMotion() { return document.documentElement.getAttribute("data-motion") === "low" || prefersReduced; }

  $$("[data-tilt]").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      if (lowMotion()) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      el.style.transform = "perspective(900px) rotateY(" + ((px - 0.5) * 10).toFixed(2) +
        "deg) rotateX(" + ((0.5 - py) * 10).toFixed(2) + "deg) translateY(-4px)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  });

  var heroEls = $$("[data-parallax]");
  if (heroEls.length) {
    window.addEventListener("pointermove", function (e) {
      if (lowMotion() || currentView !== "accueil") return;
      var cx = (e.clientX / window.innerWidth - 0.5), cy = (e.clientY / window.innerHeight - 0.5);
      heroEls.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.4;
        el.style.transform = "translate3d(" + (-cx * 26 * f).toFixed(1) + "px," +
          (-cy * 18 * f).toFixed(1) + "px,0) rotateY(" + (cx * 6 * f).toFixed(2) +
          "deg) rotateX(" + (-cy * 5 * f).toFixed(2) + "deg)";
      });
    }, { passive: true });
  }

  /* =======================================================================
     6. Objets 3D pilotes en JS : prisme du heros et cube "engagements"
     ===================================================================== */
  function spin3d(el, options) {
    if (!el) return;
    var rx = options.rx, speed = options.speed, angle = options.start || 0;
    var velocity = 0, dragging = false, lastX = 0, last = performance.now();
    el.style.animation = "none";

    function frame(now) {
      var dt = Math.min(64, now - last); last = now;
      if (!dragging) {
        if (Math.abs(velocity) > 0.002) { angle += velocity * dt; velocity *= 0.94; }
        else if (!lowMotion()) { angle += speed * dt; }
      }
      el.style.transform = "rotateX(" + rx + "deg) rotateY(" + angle.toFixed(2) + "deg)";
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    el.addEventListener("pointerdown", function (e) {
      dragging = true; lastX = e.clientX; velocity = 0;
      el.classList.add("is-dragging");
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      angle += dx * 0.45;
      velocity = dx * 0.02;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (evt) {
      el.addEventListener(evt, function () { dragging = false; el.classList.remove("is-dragging"); });
    });
  }
  spin3d($("#prism"), { rx: -12, speed: 0.018 });
  spin3d($("#cube"), { rx: -22, speed: 0.016, start: 28 });

  var prismBottle = $("#prismBottle");
  if (prismBottle && PRODUCTS.length) prismBottle.innerHTML = art(PRODUCTS[0], "hero");

  /* =======================================================================
     7. Carrousel circulaire 3D
     ===================================================================== */
  var cfRing = $("#cfRing");
  var cfItems = [], cfIndex = 0, cfStep = 0, cfRadius = 0;
  var cfList = PRODUCTS.slice(0, 8);

  function buildCoverflow() {
    if (!cfRing || !cfList.length) return;
    cfStep = 360 / cfList.length;
    cfRadius = Math.round((115) / Math.tan(Math.PI / cfList.length));
    cfRing.innerHTML = "";
    cfList.forEach(function (p, i) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "cf-item";
      item.style.transform = "rotateY(" + (i * cfStep) + "deg) translateZ(" + cfRadius + "px)";
      item.innerHTML =
        '<span class="cf-item__art">' + art(p, "cf") + "</span>" +
        '<span class="cf-item__name">' + esc(p.name) + "</span>" +
        '<span class="cf-item__price">' + price(p.price) + "</span>";
      item.addEventListener("click", function () {
        if (i === cfIndex) openSheet(cfList, i);
        else cfGo(i);
      });
      cfRing.appendChild(item);
      cfItems.push(item);
    });
    cfRender();
  }

  function cfRender() {
    if (!cfRing) return;
    cfRing.style.transform = "translateZ(-" + cfRadius + "px) rotateY(" + (-cfIndex * cfStep) + "deg)";
    cfItems.forEach(function (el, i) { el.classList.toggle("is-front", i === ((cfIndex % cfList.length) + cfList.length) % cfList.length); });
  }
  function cfGo(i) { cfIndex = i; cfRender(); }
  function cfMove(d) { cfIndex = (cfIndex + d + cfList.length) % cfList.length; cfRender(); }

  buildCoverflow();
  var cfPrev = $("#cfPrev"), cfNext = $("#cfNext"), coverflow = $("#coverflow");
  if (cfPrev) cfPrev.addEventListener("click", function () { cfMove(-1); });
  if (cfNext) cfNext.addEventListener("click", function () { cfMove(1); });
  if (coverflow) {
    coverflow.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { cfMove(-1); e.preventDefault(); }
      if (e.key === "ArrowRight") { cfMove(1); e.preventDefault(); }
    });
    var sx = null;
    coverflow.addEventListener("pointerdown", function (e) { sx = e.clientX; });
    coverflow.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 42) cfMove(dx < 0 ? 1 : -1);
    });
  }

  /* =======================================================================
     8. Grille produits, filtres et recherche
     ===================================================================== */
  var grid = $("#grid"), filtersHost = $("#filters"), searchInput = $("#search"), emptyState = $("#emptyState");
  var activeCategory = "tous", searchTerm = "";
  var visibleList = PRODUCTS.slice();

  function buildFilters() {
    if (!filtersHost) return;
    filtersHost.innerHTML = CATEGORIES.map(function (c) {
      return '<button type="button" class="chip' + (c.id === "tous" ? " is-active" : "") +
        '" data-cat="' + c.id + '">' + esc(c.label) + "</button>";
    }).join("");
    filtersHost.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (chip) applyFilter(chip.getAttribute("data-cat"));
    });
  }

  function buildGrid() {
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(function (p, i) {
      return '' +
      '<article class="card" data-id="' + p.id + '" tabindex="0" role="group" aria-label="' + esc(p.name) + '"' +
        ' style="animation-delay:' + (i * 55) + 'ms;--c-a:' + p.colors.a + '">' +
        '<div class="card__inner">' +
          '<div class="card__face card__face--front">' +
            '<span class="card__glow"></span>' +
            (p.badge ? '<span class="card__badge">' + esc(p.badge) + "</span>" : "") +
            '<div class="card__art">' + art(p, "grid") + "</div>" +
            '<div class="card__body">' +
              '<span class="card__cat">' + esc(categoryLabel(p.category)) + "</span>" +
              '<h3 class="card__name">' + esc(p.name) + "</h3>" +
              '<div class="card__row"><span class="card__price">' + price(p.price) + "</span>" +
              '<span class="card__size">' + esc(p.size) + "</span></div>" +
            "</div>" +
          "</div>" +
          '<div class="card__face card__face--back">' +
            "<h3>" + esc(p.name) + "</h3>" +
            "<p>" + esc(p.tagline) + "</p>" +
            '<ul class="card__list">' + p.benefits.slice(0, 4).map(function (bnf) {
              return "<li>" + esc(bnf) + "</li>";
            }).join("") + "</ul>" +
            '<div class="card__actions">' +
              '<button type="button" class="mini-btn mini-btn--solid" data-add="' + p.id + '">Ajouter au panier</button>' +
              '<button type="button" class="mini-btn" data-open="' + p.id + '">Voir la fiche</button>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</article>";
    }).join("");

    grid.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      if (add) { e.stopPropagation(); addToCart(add.getAttribute("data-add")); return; }
      var open = e.target.closest("[data-open]");
      if (open) { e.stopPropagation(); openSheetById(open.getAttribute("data-open")); return; }
      var card = e.target.closest(".card");
      if (card) openSheetById(card.getAttribute("data-id"));
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".card");
      if (card && e.target === card) { e.preventDefault(); openSheetById(card.getAttribute("data-id")); }
    });
  }

  function applyFilter(cat) {
    activeCategory = cat || "tous";
    $$(".chip", filtersHost).forEach(function (c) {
      c.classList.toggle("is-active", c.getAttribute("data-cat") === activeCategory);
    });
    renderGrid();
  }

  function renderGrid() {
    if (!grid) return;
    var term = searchTerm.trim().toLowerCase();
    visibleList = [];
    $$(".card", grid).forEach(function (card) {
      var p = byId(card.getAttribute("data-id"));
      if (!p) return;
      var matchCat = activeCategory === "tous" || p.category === activeCategory;
      var haystack = (p.name + " " + p.tagline + " " + categoryLabel(p.category) + " " + p.benefits.join(" ")).toLowerCase();
      var matchTerm = !term || haystack.indexOf(term) !== -1;
      var show = matchCat && matchTerm;
      card.classList.toggle("is-hidden", !show);
      if (show) {
        visibleList.push(p);
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = "";
        card.style.animationDelay = (visibleList.length * 45) + "ms";
      }
    });
    if (emptyState) emptyState.hidden = visibleList.length > 0;
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () { searchTerm = searchInput.value; renderGrid(); });
  }
  buildFilters();
  buildGrid();
  renderGrid();

  /* =======================================================================
     9. Fiche produit : panneau qui pivote d'un article a l'autre
     ===================================================================== */
  var modal = $("#modal"), flip = $("#flip3d"), faceA = $("#faceA"), faceB = $("#faceB");
  var sheetList = [], sheetIndex = 0, sheetRot = 0, lastFocus = null;

  function sheetHTML(p, index, total) {
    return '' +
      '<div class="sheet" style="--c-a:' + p.colors.a + '">' +
        '<div class="sheet__art">' + art(p, "sheet" + index) + "</div>" +
        '<div class="sheet__body">' +
          '<span class="sheet__cat">' + esc(categoryLabel(p.category)) + "</span>" +
          "<h3>" + esc(p.name) + "</h3>" +
          '<p class="sheet__tag">' + esc(p.tagline) + "</p>" +
          '<p class="sheet__desc">' + esc(p.description) + "</p>" +
          '<ul class="sheet__benefits">' + p.benefits.map(function (b) {
            return "<li>" + esc(b) + "</li>";
          }).join("") + "</ul>" +
          '<p class="sheet__usage"><strong>Conseil d\'utilisation :</strong> ' + esc(p.usage) + "</p>" +
          '<div class="sheet__foot">' +
            '<span class="sheet__price">' + price(p.price) + "</span>" +
            '<span class="sheet__size">' + esc(p.size) + "</span>" +
            '<button type="button" class="btn btn--primary" data-add="' + p.id + '">Ajouter au panier</button>' +
            '<span class="sheet__index">' + (index + 1) + " / " + total + "</span>" +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function openSheet(list, index) {
    if (!modal || !list || !list.length) return;
    sheetList = list;
    sheetIndex = ((index % list.length) + list.length) % list.length;
    sheetRot = 0;
    lastFocus = document.activeElement;
    flip.style.transition = "none";
    flip.style.transform = "rotateY(0deg)";
    faceA.innerHTML = sheetHTML(sheetList[sheetIndex], sheetIndex, sheetList.length);
    faceB.innerHTML = "";
    modal.setAttribute("aria-label", "Fiche produit : " + sheetList[sheetIndex].name);
    void flip.offsetWidth;
    flip.style.transition = "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(function () { $("#modalClose").focus(); }, 60);
  }

  function openSheetById(id) {
    var list = visibleList.length ? visibleList : PRODUCTS;
    var idx = 0;
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { idx = i; break; } }
    openSheet(list, idx);
  }

  function sheetMove(dir) {
    if (!sheetList.length) return;
    sheetIndex = ((sheetIndex + dir) % sheetList.length + sheetList.length) % sheetList.length;
    sheetRot += dir * 180;
    var incoming = (Math.round(sheetRot / 180) % 2 === 0) ? faceA : faceB;
    incoming.innerHTML = sheetHTML(sheetList[sheetIndex], sheetIndex, sheetList.length);
    flip.style.transform = "rotateY(" + sheetRot + "deg)";
    modal.setAttribute("aria-label", "Fiche produit : " + sheetList[sheetIndex].name);
  }

  function closeSheet() {
    if (!modal || modal.hidden) return;
    modal.classList.add("is-closing");
    window.setTimeout(function () {
      modal.hidden = true;
      modal.classList.remove("is-closing");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, lowMotion() ? 10 : 340);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) { closeSheet(); return; }
      var add = e.target.closest("[data-add]");
      if (add) addToCart(add.getAttribute("data-add"));
    });
    $("#modalPrev").addEventListener("click", function () { sheetMove(-1); });
    $("#modalNext").addEventListener("click", function () { sheetMove(1); });
  }

  document.addEventListener("keydown", function (e) {
    if (modal && !modal.hidden) {
      if (e.key === "Escape") closeSheet();
      if (e.key === "ArrowLeft") sheetMove(-1);
      if (e.key === "ArrowRight") sheetMove(1);
      return;
    }
    if (drawer && !drawer.hidden && e.key === "Escape") closeCart();
  });

  /* =======================================================================
     10. Panier (persiste dans le navigateur)
     ===================================================================== */
  var STORE = "forever-academy-cart";
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(STORE)) || []; } catch (err) { cart = []; }
  cart = cart.filter(function (l) { return byId(l.id); });

  var drawer = $("#cartDrawer"), cartList = $("#cartList"), cartEmpty = $("#cartEmpty");
  var cartTotal = $("#cartTotal"), cartCount = $("#cartCount");

  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(cart)); } catch (err) { /* mode prive */ }
  }

  function addToCart(id) {
    var p = byId(id);
    if (!p) return;
    var line = null;
    for (var i = 0; i < cart.length; i++) { if (cart[i].id === id) { line = cart[i]; break; } }
    if (line) line.qty += 1; else cart.push({ id: id, qty: 1 });
    persist();
    renderCart();
    toast(p.name + " ajouté au panier");
    if (cartCount) {
      cartCount.classList.add("pop");
      window.setTimeout(function () { cartCount.classList.remove("pop"); }, 320);
    }
  }

  function changeQty(id, delta) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].qty += delta;
        if (cart[i].qty <= 0) cart.splice(i, 1);
        break;
      }
    }
    persist();
    renderCart();
  }

  function renderCart() {
    var count = 0, total = 0;
    cart.forEach(function (l) {
      var p = byId(l.id);
      if (!p) return;
      count += l.qty;
      total += l.qty * p.price;
    });
    if (cartCount) cartCount.textContent = String(count);
    if (cartTotal) cartTotal.textContent = price(total);
    if (cartEmpty) cartEmpty.hidden = cart.length > 0;
    if (!cartList) return;
    cartList.innerHTML = cart.map(function (l) {
      var p = byId(l.id);
      return '<li class="cart-item">' +
        '<span class="cart-item__art">' + art(p, "cart") + "</span>" +
        "<span><span class=\"cart-item__name\">" + esc(p.name) + "</span><br>" +
        '<span class="cart-item__price">' + price(p.price * l.qty) + "</span></span>" +
        '<span class="qty">' +
          '<button type="button" data-qty="-1" data-id="' + p.id + '" aria-label="Retirer un ' + esc(p.name) + '">−</button>' +
          "<span>" + l.qty + "</span>" +
          '<button type="button" data-qty="1" data-id="' + p.id + '" aria-label="Ajouter un ' + esc(p.name) + '">+</button>' +
        "</span>" +
      "</li>";
    }).join("");
  }

  if (cartList) {
    cartList.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-qty]");
      if (btn) changeQty(btn.getAttribute("data-id"), parseInt(btn.getAttribute("data-qty"), 10));
    });
  }

  function openCart() {
    if (!drawer) return;
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(function () { $(".drawer__panel .modal__close").focus(); }, 60);
  }
  function closeCart() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.add("is-closing");
    window.setTimeout(function () {
      drawer.hidden = true;
      drawer.classList.remove("is-closing");
      document.body.style.overflow = "";
    }, lowMotion() ? 10 : 300);
  }
  var cartBtn = $("#cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (drawer) {
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-cart-close]")) closeCart();
    });
  }
  var checkout = $("#checkout");
  if (checkout) {
    checkout.addEventListener("click", function () {
      if (!cart.length) { toast("Votre panier est encore vide"); return; }
      cart = [];
      persist();
      renderCart();
      toast("Merci ! Commande de démonstration enregistrée");
      closeCart();
    });
  }
  renderCart();

  /* =======================================================================
     11. Notifications, formulaire, preferences d'animation
     ===================================================================== */
  var toastEl = $("#toast"), toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2600);
  }

  var form = $("#contactForm"), formNote = $("#formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      [["cName", function (v) { return v.trim().length > 1; }],
       ["cMail", function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }],
       ["cMsg", function (v) { return v.trim().length > 9; }]].forEach(function (pair) {
        var input = document.getElementById(pair[0]);
        var valid = pair[1](input.value);
        input.parentNode.classList.toggle("is-error", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        formNote.textContent = "Merci de vérifier les champs signalés.";
        formNote.style.color = "#ff8f7a";
        return;
      }
      formNote.textContent = "Message envoyé (démonstration). Nous revenons vers vous sous 24 h.";
      formNote.style.color = "";
      form.reset();
      toast("Message bien reçu, merci !");
    });
  }

  var motionBtn = $("#motionToggle");
  var storedMotion = null;
  try { storedMotion = localStorage.getItem("forever-motion"); } catch (err) { /* ignore */ }
  function setMotion(low) {
    document.documentElement.setAttribute("data-motion", low ? "low" : "full");
    if (motionBtn) {
      motionBtn.setAttribute("aria-pressed", String(low));
      motionBtn.title = low ? "Réactiver les animations" : "Réduire les animations";
    }
    try { localStorage.setItem("forever-motion", low ? "low" : "full"); } catch (err) { /* ignore */ }
  }
  setMotion(storedMotion ? storedMotion === "low" : prefersReduced);
  if (motionBtn) {
    motionBtn.addEventListener("click", function () {
      setMotion(document.documentElement.getAttribute("data-motion") !== "low");
    });
  }

  /* =======================================================================
     12. Demarrage
     ===================================================================== */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var initial = (location.hash || "").replace("#", "");
  if (VIEWS.indexOf(initial) > 0) {
    var target = document.querySelector('.view[data-view="' + initial + '"]');
    var first = document.querySelector('.view[data-view="accueil"]');
    if (target && first) {
      first.classList.remove("is-active");
      target.classList.add("is-active");
      currentView = initial;
      setNavActive(initial);
    }
  }
})();
