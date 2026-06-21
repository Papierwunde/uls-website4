/* =============================================================
   ULS Steinhagen – main.js
   Pure vanilla JS, no dependencies, no build step required.
   GitHub Pages compatible.
   ============================================================= */

"use strict";

/* ── Auto-update footer year ──────────────────────────────────── */
(function () {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Sticky header: add .scrolled class on scroll ─────────────── */
(function () {
  /* Support both id="site-header" and id="navbar" */
  const header = document.getElementById("site-header") || document.getElementById("navbar");
  if (!header) return;

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); /* run once on load */
})();

/* ── Mobile navigation toggle ─────────────────────────────────── */
(function () {
  const toggle = document.getElementById("nav-toggle");
  /* Support both id="nav-menu" (new pages) and id="nav-links" (index.html) */
  const menu   = document.getElementById("nav-menu") || document.getElementById("nav-links");
  if (!toggle || !menu) return;

  function openMenu() {
    /* Add both class names: "open" for the legacy CSS rule,
       "is-open" for the newer CSS rule – both are in style.css */
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
})();

/* ── Hero background zoom-in on load ──────────────────────────── */
(function () {
  const bg = document.querySelector(".hero-bg");
  if (!bg) return;
  window.addEventListener("load", function () {
    bg.classList.add("loaded");
  }, { once: true });
})();

/* ── Scroll-reveal animations ─────────────────────────────────── */
/*
   HOW TO USE: add class="reveal" to any element you want to
   animate in when it enters the viewport.
   The CSS handles the initial hidden state; JS adds .is-visible.
*/
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

/* ── Back-to-top button ───────────────────────────────────────── */
(function () {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    btn.classList.toggle("is-visible", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

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

/* ── Counter animation for stats ──────────────────────────────── */
/*
   HOW TO USE: add data-target="33" data-suffix="+" to a .stat-number element.
   The counter will animate from 0 to the target value on scroll.
*/
(function () {
  var counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el       = entry.target;
      var target   = parseInt(el.dataset.target, 10);
      var suffix   = el.dataset.suffix || "";
      var duration = 1600;
      var start    = performance.now();

      (function tick(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      })(start);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
})();

/* ── Contact form – mailto fallback ───────────────────────────── */
/*
   The form collects name, email, phone, and message, then opens
   the user's mail client with a pre-filled mailto: link.
   No server or backend needed – works on GitHub Pages.
   EDIT: change the recipient address in the mailto string below.
*/
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data    = Object.fromEntries(new FormData(form));
    var body    = encodeURIComponent(
      "Name: "    + (data.name    || "") + "\n" +
      "E-Mail: "  + (data.email   || "") + "\n" +
      "Telefon: " + (data.phone   || "") + "\n\n" +
                    (data.message || "")
    );
    var subject = encodeURIComponent("Nachricht von der Website");
    /* EDIT: replace with your actual contact address */
    var mailto  = "mailto:info@uls-steinhagen.de?subject=" + subject + "&body=" + body;
    window.location.href = mailto;

    /* Visual feedback on the submit button */
    var btn          = form.querySelector(".form-submit");
    var originalText = btn.textContent;
    btn.textContent  = "E-Mail-Programm wird geöffnet …";
    btn.disabled     = true;
    setTimeout(function () {
      btn.textContent = originalText;
      btn.disabled    = false;
    }, 4000);
  });
})();

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
