(function () {
  "use strict";
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.getElementById("drawer");
  var sticky = document.querySelector(".sticky-wa");
  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  function closeDrawer() {
    if (!drawer || !toggle) return;
    drawer.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }
  function openDrawer() {
    if (!drawer || !toggle) return;
    drawer.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      if (drawer.hidden) openDrawer();
      else closeDrawer();
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
  }
  window.addEventListener("scroll", function () {
    setScrolled();
    if (sticky) sticky.classList.toggle("is-visible", window.scrollY > 280);
  }, { passive: true });
  setScrolled();
  if (sticky) sticky.classList.add("is-visible");
})();
