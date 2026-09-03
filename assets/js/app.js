/* =========================================================================
   Forever Academy — logique du site
   Le relief est obtenu par les transformations CSS pilotées ici : rotation
   des vues, anneau photographique, panneau de fiche qui pivote, reflets
   spéculaires qui suivent le pointeur.
   ========================================================================= */
(function () {
  "use strict";

  var PRODUCTS = window.FOREVER_PRODUCTS || [];
  var CATEGORIES = window.FOREVER_CATEGORIES || [];
  var TRIOS = window.FOREVER_TRIOS || [];
  var VIEWS = ["accueil", "produits", "procede", "contact"];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

  function price(v) { return euro.format(v); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function rangeLabel(p) { return p.range || ""; }
  function lowMotion() { return document.documentElement.getAttribute("data-motion") === "low" || prefersReduced; }
  function shot(p, cls, lazy) {
    return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '"' +
      (cls ? ' class="' + cls + '"' : "") +
      (lazy ? ' loading="lazy" decoding="async"' : "") + ">";
  }

  /* ---------------------------------------------------------------- décor */
  (function sparks() {
    var host = $("#sparks");
    if (!host) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 16; i++) {
      var el = document.createElement("span");
      el.className = "spark";
      el.style.left = (Math.random() * 100).toFixed(2) + "%";
      el.style.setProperty("--dx", (Math.random() * 200 - 100).toFixed(0) + "px");
      el.style.animationDuration = (14 + Math.random() * 16).toFixed(1) + "s";
      el.style.animationDelay = (-Math.random() * 22).toFixed(1) + "s";
      el.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
      frag.appendChild(el);
    }
    host.appendChild(frag);
  })();

  /* ------------------------------------------------- routeur : vues en 3D */
  var currentView = "accueil", switching = false;

  function setNavActive(name) {
    $$("#siteNav a").forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-nav") === name); });
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
    var quick = lowMotion();

    if (prev) {
      prev.classList.add("is-leaving", forward ? "leave-left" : "leave-right");
      var cleanup = function () {
        prev.classList.remove("is-active", "is-leaving", "leave-left", "leave-right");
        prev.removeEventListener("animationend", cleanup);
      };
      prev.addEventListener("animationend", cleanup);
      window.setTimeout(cleanup, quick ? 60 : 700);
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
    }, quick ? 60 : 430);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-nav]");
    if (!t) return;
    e.preventDefault();
    closeNav();
    goTo(t.getAttribute("data-nav"), { filter: t.getAttribute("data-filter") });
  });

  var burger = $("#burger"), siteNav = $("#siteNav");
  function closeNav() {
    if (!siteNav) return;
    siteNav.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", function () {
    burger.setAttribute("aria-expanded", String(siteNav.classList.toggle("is-open")));
  });

  /* ------------------------------------- en-tête, progression, apparitions */
  var header = $("#siteHeader"), progress = $("#progress");
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

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6%" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  window.setTimeout(function counters() {
    $$("[data-count]").forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var dec = (String(target).split(".")[1] || "").length;
      var t0 = performance.now();
      (function step(now) {
        var t = Math.min(1, (now - t0) / 1400);
        var v = (target * (1 - Math.pow(1 - t, 3))).toFixed(dec).replace(".", ",");
        el.textContent = v + suffix;
        if (t < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, 350);

  /* --------------------------------- reflets spéculaires suivant la souris */
  function trackGloss(el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
    });
  }

  var heroSlab = $("#heroSlab"), heroInner = $("#heroSlabInner");
  if (heroSlab && heroInner) {
    trackGloss(heroSlab);
    heroSlab.addEventListener("pointermove", function (e) {
      if (lowMotion()) return;
      var r = heroSlab.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      heroInner.style.transform = "rotateY(" + (-9 + px * 14).toFixed(2) + "deg) rotateX(" + (4 - py * 12).toFixed(2) + "deg)";
    });
    heroSlab.addEventListener("pointerleave", function () { heroInner.style.transform = ""; });
  }
  $$(".slab").forEach(function (s) { if (s !== heroSlab) trackGloss(s); });

  /* ------------------------------------------------------ formats trio */
  (function buildTrios() {
    var host = $("#trios");
    if (!host || !TRIOS.length) return;
    host.innerHTML = TRIOS.map(function (t) {
      var p = byId(t.id);
      return '<button type="button" class="trio" data-open="' + esc(t.id) + '">' +
        '<img src="' + esc(t.image) + '" loading="lazy" decoding="async" width="590" height="593"' +
        ' alt="Trois bouteilles de ' + esc(t.label) + '">' +
        '<span class="trio__cap"><b>' + esc(t.label) + '</b>' +
        '<span>Trio — ' + (p ? esc(price(p.price * 3)) : "") + "</span></span></button>";
    }).join("");
    host.addEventListener("click", function (e) {
      var b = e.target.closest("[data-open]");
      if (b) openSheetById(b.getAttribute("data-open"));
    });
  })();

  /* ------------------------------------------------ galerie en anneau 3D */
  var ring = $("#ring"), ringItems = [], ringIndex = 0, ringStep = 0, ringRadius = 0;
  var ringList = PRODUCTS.slice(0, 8);

  function buildRing() {
    if (!ring || !ringList.length) return;
    ringStep = 360 / ringList.length;
    ringRadius = Math.round(125 / Math.tan(Math.PI / ringList.length) * 1.34);
    ring.innerHTML = "";
    ringList.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ring__item";
      b.style.transform = "rotateY(" + (i * ringStep) + "deg) translateZ(" + ringRadius + "px)";
      b.innerHTML = shot(p, "", true) +
        '<span class="ring__cap"><b>' + esc(p.name) + "</b><span>" + price(p.price) + "</span></span>";
      b.querySelector("img").style.objectPosition = p.focus || "50% 50%";
      b.addEventListener("click", function () {
        if (i === ringIndex) openSheet(ringList, i); else ringGo(i);
      });
      ring.appendChild(b);
      ringItems.push(b);
    });
    ringRender();
  }
  function ringRender() {
    ring.style.transform = "translateZ(-" + ringRadius + "px) rotateY(" + (-ringIndex * ringStep) + "deg)";
    ringItems.forEach(function (el, i) { el.classList.toggle("is-front", i === ringIndex); });
  }
  function ringGo(i) { ringIndex = ((i % ringList.length) + ringList.length) % ringList.length; ringRender(); }
  function ringMove(d) { ringGo(ringIndex + d); }

  buildRing();
  if ($("#ringPrev")) $("#ringPrev").addEventListener("click", function () { ringMove(-1); });
  if ($("#ringNext")) $("#ringNext").addEventListener("click", function () { ringMove(1); });
  var ringWrap = $("#ringWrap");
  if (ringWrap) {
    ringWrap.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { ringMove(-1); e.preventDefault(); }
      if (e.key === "ArrowRight") { ringMove(1); e.preventDefault(); }
    });
    var sx = null;
    ringWrap.addEventListener("pointerdown", function (e) { sx = e.clientX; });
    ringWrap.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 42) ringMove(dx < 0 ? 1 : -1);
    });
  }

  /* --------------------------------------------- catalogue, filtres, tri */
  var grid = $("#grid"), filtersHost = $("#filters"), searchInput = $("#search"), emptyState = $("#emptyState");
  var activeCategory = "tous", searchTerm = "", visibleList = PRODUCTS.slice();

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
      return '<article class="card" data-id="' + p.id + '" tabindex="0" role="group" aria-label="' + esc(p.name) + '"' +
        ' style="animation-delay:' + (i * 55) + "ms;--accent:" + p.accent + ";--focus:" + (p.focus || "50% 50%") + '">' +
        '<div class="card__inner">' +
          '<div class="card__face">' +
            '<div class="card__shot">' + shot(p, "", i > 3) + '<span class="card__gloss"></span></div>' +
            (p.badge ? '<span class="card__badge">' + esc(p.badge) + "</span>" : "") +
            '<div class="card__body">' +
              '<span class="card__range">' + esc(rangeLabel(p)) + "</span>" +
              '<h3 class="card__name">' + esc(p.name) + "</h3>" +
              '<div class="card__row"><span class="card__price">' + price(p.price) + "</span>" +
              '<span class="card__size">' + esc(p.size) + "</span></div>" +
            "</div>" +
          "</div>" +
          '<div class="card__face card__face--back">' +
            "<h3>" + esc(p.name) + "</h3><p>" + esc(p.tagline) + "</p>" +
            '<ul class="card__facts">' + p.facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
            '<div class="card__actions">' +
              '<button type="button" class="mini-btn mini-btn--solid" data-add="' + p.id + '">Ajouter au panier</button>' +
              '<button type="button" class="mini-btn" data-open="' + p.id + '">Voir la fiche</button>' +
            "</div>" +
          "</div>" +
        "</div></article>";
    }).join("");

    $$(".card", grid).forEach(function (card) { trackGloss(card); });

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
      var hay = (p.name + " " + p.tagline + " " + p.range + " " + p.facts.join(" ")).toLowerCase();
      var show = (activeCategory === "tous" || p.category === activeCategory) && (!term || hay.indexOf(term) !== -1);
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

  if (searchInput) searchInput.addEventListener("input", function () { searchTerm = searchInput.value; renderGrid(); });
  buildFilters();
  buildGrid();
  renderGrid();

  /* ------------------------------- fiche produit : le panneau qui pivote */
  var modal = $("#modal"), flip = $("#flip3d"), faceA = $("#faceA"), faceB = $("#faceB");
  var sheetList = [], sheetIndex = 0, sheetRot = 0, lastFocus = null;

  function sheetHTML(p, index, total) {
    return '<div class="sheet" style="--focus:' + (p.focus || "50% 50%") + '">' +
      '<div class="sheet__shot">' + shot(p) + "</div>" +
      '<div class="sheet__body">' +
        '<span class="sheet__range">' + esc(rangeLabel(p)) + "</span>" +
        "<h3>" + esc(p.name) + "</h3>" +
        '<p class="sheet__tag">' + esc(p.tagline) + "</p>" +
        '<p class="sheet__desc">' + esc(p.description) + "</p>" +
        '<ul class="sheet__facts">' + p.facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
        '<p class="sheet__usage"><strong>Mode d\'emploi :</strong> ' + esc(p.usage) + "</p>" +
        '<div class="sheet__foot">' +
          '<span class="sheet__price">' + price(p.price) + "</span>" +
          '<span class="sheet__size">' + esc(p.size) + "</span>" +
          '<button type="button" class="btn btn--primary" data-add="' + p.id + '">Ajouter au panier</button>' +
          '<span class="sheet__index">' + (index + 1) + " / " + total + "</span>" +
        "</div></div></div>";
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
    void flip.offsetWidth;
    flip.style.transition = "";
    modal.setAttribute("aria-label", "Fiche produit : " + sheetList[sheetIndex].name);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(function () { $("#modalClose").focus(); }, 60);
  }

  function openSheetById(id) {
    var list = visibleList.length ? visibleList : PRODUCTS;
    var idx = 0;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) { idx = i; break; }
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

  /* ------------------------------------------------------------- panier */
  var STORE = "forever-academy-cart";
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(STORE)) || []; } catch (err) { cart = []; }
  cart = cart.filter(function (l) { return byId(l.id); });

  var drawer = $("#cartDrawer"), cartList = $("#cartList"), cartEmpty = $("#cartEmpty");
  var cartTotal = $("#cartTotal"), cartCount = $("#cartCount");

  function persist() { try { localStorage.setItem(STORE, JSON.stringify(cart)); } catch (err) { /* navigation privée */ } }

  function addToCart(id) {
    var p = byId(id);
    if (!p) return;
    var line = null;
    for (var i = 0; i < cart.length; i++) if (cart[i].id === id) { line = cart[i]; break; }
    if (line) line.qty += 1; else cart.push({ id: id, qty: 1 });
    persist(); renderCart();
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
    persist(); renderCart();
  }

  function renderCart() {
    var count = 0, total = 0;
    cart.forEach(function (l) {
      var p = byId(l.id);
      if (!p) return;
      count += l.qty; total += l.qty * p.price;
    });
    if (cartCount) cartCount.textContent = String(count);
    if (cartTotal) cartTotal.textContent = price(total);
    if (cartEmpty) cartEmpty.hidden = cart.length > 0;
    if (!cartList) return;
    cartList.innerHTML = cart.map(function (l) {
      var p = byId(l.id);
      return '<li class="cart-item" style="--focus:' + (p.focus || "50% 50%") + '">' +
        '<img src="' + esc(p.image) + '" alt="" loading="lazy">' +
        '<span><span class="cart-item__name">' + esc(p.name) + "</span><br>" +
        '<span class="cart-item__price">' + price(p.price * l.qty) + "</span></span>" +
        '<span class="qty">' +
          '<button type="button" data-qty="-1" data-id="' + p.id + '" aria-label="Retirer un ' + esc(p.name) + '">−</button>' +
          "<span>" + l.qty + "</span>" +
          '<button type="button" data-qty="1" data-id="' + p.id + '" aria-label="Ajouter un ' + esc(p.name) + '">+</button>' +
        "</span></li>";
    }).join("");
  }

  if (cartList) cartList.addEventListener("click", function (e) {
    var b = e.target.closest("[data-qty]");
    if (b) changeQty(b.getAttribute("data-id"), parseInt(b.getAttribute("data-qty"), 10));
  });

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
  if ($("#cartBtn")) $("#cartBtn").addEventListener("click", openCart);
  if (drawer) drawer.addEventListener("click", function (e) {
    if (e.target.closest("[data-cart-close]")) closeCart();
  });
  if ($("#checkout")) $("#checkout").addEventListener("click", function () {
    if (!cart.length) { toast("Votre panier est encore vide"); return; }
    cart = []; persist(); renderCart();
    toast("Merci ! Commande de démonstration enregistrée");
    closeCart();
  });
  renderCart();

  /* ------------------------------ notifications, formulaire, préférences */
  var toastEl = $("#toast"), toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2600);
  }

  var form = $("#contactForm"), formNote = $("#formNote");
  if (form) form.addEventListener("submit", function (e) {
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

  var motionBtn = $("#motionToggle"), stored = null;
  try { stored = localStorage.getItem("forever-motion"); } catch (err) { /* ignore */ }
  function setMotion(low) {
    document.documentElement.setAttribute("data-motion", low ? "low" : "full");
    if (motionBtn) {
      motionBtn.setAttribute("aria-pressed", String(low));
      motionBtn.title = low ? "Réactiver les animations" : "Réduire les animations";
    }
    try { localStorage.setItem("forever-motion", low ? "low" : "full"); } catch (err) { /* ignore */ }
  }
  setMotion(stored ? stored === "low" : prefersReduced);
  if (motionBtn) motionBtn.addEventListener("click", function () {
    setMotion(document.documentElement.getAttribute("data-motion") !== "low");
  });

  /* ---------------------------------------------------------- démarrage */
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

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
