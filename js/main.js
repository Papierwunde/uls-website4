/* =============================================================
   ULS Steinhagen – main.js
   Pure vanilla JS, no dependencies, no build step required.
   GitHub Pages compatible.
   ============================================================= */
"use strict";
document.addEventListener("DOMContentLoaded", function () {
    
    // ZUERST: Header laden
    fetch('header.html')
        .then(response => response.text())
        .then(headerData => {
            // Header in den Platzhalter einfügen
            document.getElementById('header-placeholder').innerHTML = headerData;
            
            // DANACH: Footer laden
            return fetch('footer.html');
        })
        .then(response => response.text())
        .then(footerData => {
            // Footer in den Platzhalter einfügen
            document.getElementById('footer-placeholder').innerHTML = footerData;

            // ERST JETZT: Alle Funktionen starten, wenn alles im HTML existiert
            initStickyHeader();
            initMobileNavigation();
            backToTop();
        })
        .catch(error => console.error("Fehler beim Laden der Website-Komponenten:", error));
});

/* ── Auto-update footer year ──────────────────────────────────── */
(function () {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── Sticky header: add .scrolled class on scroll ─────────────── */
function initStickyHeader() {
  const header = document.getElementById("site-header") || document.getElementById("navbar");
  if (!header) return; // Findet den Header jetzt, da er geladen ist

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); /* run once on load */
}

/* ── Mobile navigation toggle ─────────────────────────────────── */
function initMobileNavigation() {
  const toggle = document.getElementById("nav-toggle");
  const menu   = document.getElementById("nav-menu") || document.getElementById("nav-links");
  if (!toggle || !menu) return; // Findet die Elemente jetzt ebenfalls

  function openMenu() {
    menu.classList.add("is-open", "open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("is-active", "open");
  }

  function closeMenu() {
    menu.classList.remove("is-open", "open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("is-active", "open");
  }

  toggle.addEventListener("click", function () {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Close menu when any link inside the nav is clicked */
  menu.querySelectorAll("a, .nav-link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* Close menu on Escape key */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
}

/* ── Hero background zoom-in on load ──────────────────────────── */
(function () {
  const bg = document.querySelector(".hero-bg");
  if (!bg) return;
  window.addEventListener("load", function () {
    bg.classList.add("loaded");
  }, { once: true });
})();

/* Scroll-reveal animations | The CSS handles the initial hidden state; JS adds .is-visible. */
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    /* Fallback for very old browsers: just show everything */
    els.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); /* animate only once */
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  els.forEach(function (el) { observer.observe(el); });
})();

/* Back-to-top button */
function backToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    btn.classList.toggle("is-visible", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* ── Smooth scroll for in-page anchor links (#section-id) ─────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      /* 72 px offset accounts for the sticky header height */
      var top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();

/* Counter animation for stats */
(function () {
  var counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el       = entry.target;
      var target   = parseInt(el.dataset.target, 10);
      var suffix   = el.dataset.suffix || "";
      var prefix   = el.dataset.prefix || "";
      var duration = 1600;
      var start    = performance.now();

      (function tick(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      })(start);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
})();
/* Presseecho 
(function () {
  const lb    = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose = document.getElementById("lightbox-close");
  if (!lb || !lbImg) return;

  document.querySelectorAll("article.press-card").forEach(function (card) {
    
    // Wir machen die Karte für Tastatur-Nutzer barrierefrei (fokussierbar)
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    // Funktion zum Öffnen der Lightbox
    function openPressLightbox() {
      // Suche das Bild INNERHALB der geklickten Karte
      const img = card.querySelector("img");
      if (!img) return; // Falls kein Bild existiert, mach nichts

      lbImg.src = img.dataset.full || img.src;
      lbImg.alt = img.alt;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }

    // Klick auf die gesamte Karte
    card.addEventListener("click", openPressLightbox);

    // Öffnen mit der Enter-Taste für Barrierefreiheit
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPressLightbox();
      }
    });
  });

  function closeLightbox() {
    lb.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  lbClose.addEventListener("click", closeLightbox);

  // Click backdrop (not the image) to close
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });

  // Escape key to close
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox();
  });
})();
*/

/* ── Tab panel system (used on themen.html) ───────────────────── */
/*
   HOW IT WORKS:
     – .tabs-wrapper wraps one .tabs-nav and one .tabs-panels.
     – .tabs-nav contains <button class="tab-btn" data-tab="PANEL-ID"> elements.
     – .tabs-panels contains <div class="tab-panel" id="PANEL-ID"> elements.
     – Clicking a button shows the matching panel, hides all others.

   HOW TO ADD A TAB:
     1. Add a <button class="tab-btn" data-tab="your-id"> in .tabs-nav.
     2. Add a <div class="tab-panel" id="your-id"> in .tabs-panels.
     That's it – no JS changes needed.

   HOW TO REMOVE A TAB:
     Delete the matching <button> and <div id="..."> pair.
*/
(function () {
  var wrappers = document.querySelectorAll(".tabs-wrapper");
  if (!wrappers.length) return;

  wrappers.forEach(function (wrapper) {
    var buttons = wrapper.querySelectorAll(".tab-btn");
    var panels  = wrapper.querySelectorAll(".tab-panel");
    if (!buttons.length || !panels.length) return;

    function activate(targetId) {
      buttons.forEach(function (btn) {
        var active = btn.dataset.tab === targetId;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
        btn.setAttribute("tabindex",      active ? "0" : "-1");
      });
      panels.forEach(function (panel) {
        var active = panel.id === targetId;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    }

    /* Activate first tab on load */
    activate(buttons[0].dataset.tab);

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activate(btn.dataset.tab);
      });

      /* Arrow-key keyboard navigation between tabs */
      btn.addEventListener("keydown", function (e) {
        var all = Array.from(buttons);
        var idx = all.indexOf(btn);
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          var next = all[(idx + 1) % all.length];
          next.focus();
          activate(next.dataset.tab);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          var prev = all[(idx - 1 + all.length) % all.length];
          prev.focus();
          activate(prev.dataset.tab);
        }
      });
    });
  });
})();
