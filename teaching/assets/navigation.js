"use strict";

(() => {
  const details = document.getElementById("book-contents");
  if (!details) return;
  const summary = details.querySelector("summary");
  const desktop = window.matchMedia("(min-width: 1100px)");
  let mobileOpen = false;

  function setContentsMode() {
    if (desktop.matches) {
      details.open = true;
      if (summary) summary.setAttribute("aria-disabled", "true");
    } else {
      // Resizing must not hide a link that currently has keyboard focus.
      if (details.contains(document.activeElement) && document.activeElement !== summary) {
        mobileOpen = true;
      }
      details.open = mobileOpen;
      if (summary) summary.removeAttribute("aria-disabled");
    }
  }
  setContentsMode();
  if (desktop.addEventListener) desktop.addEventListener("change", setContentsMode);
  else desktop.addListener(setContentsMode);
  if (summary) summary.addEventListener("click", event => {
    if (desktop.matches) event.preventDefault();
  });
  details.addEventListener("toggle", () => {
    if (desktop.matches) {
      if (!details.open) details.open = true;
    } else mobileOpen = details.open;
  });

  // A contents anchor opens the native disclosure before moving keyboard focus.
  document.querySelectorAll('a[href="#book-contents"]').forEach(link => {
    link.addEventListener("click", () => {
      mobileOpen = true;
      details.open = true;
      window.requestAnimationFrame(() => {
        if (summary) summary.focus({ preventScroll: true });
      });
    });
  });

  const sectionLinks = [...details.querySelectorAll(".section-links a[href^='#']")];
  const sections = sectionLinks.map(link => {
    let id;
    try { id = decodeURIComponent(link.getAttribute("href").slice(1)); }
    catch (_) { return null; }
    const target = document.getElementById(id);
    return target ? { link, target } : null;
  }).filter(Boolean);
  let scheduled = false;
  function updateCurrentSection() {
    scheduled = false;
    if (!sections.length) return;
    const threshold = Math.min(140, window.innerHeight * .2);
    let current = sections[0];
    for (const section of sections) {
      if (section.target.getBoundingClientRect().top <= threshold) current = section;
    }
    // A short final section may never reach the threshold above the page's end.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    for (const section of sections) {
      if (section === current) section.link.setAttribute("aria-current", "location");
      else section.link.removeAttribute("aria-current");
    }
  }
  function scheduleCurrentSection() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateCurrentSection);
    }
  }
  window.addEventListener("scroll", scheduleCurrentSection, { passive: true });
  window.addEventListener("resize", scheduleCurrentSection, { passive: true });
  window.addEventListener("hashchange", scheduleCurrentSection);
  updateCurrentSection();

  for (const { link, target } of sections) {
    link.addEventListener("click", () => {
      if (desktop.matches) return;
      // Native anchors handle position and history; focus follows the selected section.
      window.requestAnimationFrame(() => {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        mobileOpen = false;
        details.open = false;
        scheduleCurrentSection();
      });
    });
  }

  // Only add tab stops for overflowing objects that have no authored focus behavior.
  const scrollables = [...document.querySelectorAll(".book-main .equation, .book-main .inline-equation, .book-main .table-scroll, .book-main pre")];
  function updateScrollAccess() {
    for (const element of scrollables) {
      const managed = element.dataset.navigationTabstop === "true";
      if (!managed && element.hasAttribute("tabindex")) continue;
      if (element.scrollWidth > element.clientWidth + 1) {
        element.setAttribute("tabindex", "0");
        element.dataset.navigationTabstop = "true";
        if (!element.hasAttribute("aria-label")) {
          element.setAttribute("aria-label", element.matches("pre") ? "Code or output; scroll horizontally if needed" : "Mathematical expression or table; scroll horizontally if needed");
        }
      } else if (managed && document.activeElement !== element) {
        element.removeAttribute("tabindex");
      }
    }
  }
  updateScrollAccess();
  document.querySelectorAll(".book-main details").forEach(element => {
    element.addEventListener("toggle", updateScrollAccess);
  });
  window.addEventListener("resize", updateScrollAccess, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
    updateScrollAccess();
    scheduleCurrentSection();
  });
})();
