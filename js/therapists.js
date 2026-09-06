(function () {
  "use strict";

  function waUrl(digits, text) {
    if (window.MooThaiContent && window.MooThaiContent.waUrl) {
      return window.MooThaiContent.waUrl(digits, text);
    }
    var d = String(digits || "").replace(/\D/g, "");
    if (d.length === 8) d = "852" + d;
    var q = text ? "?text=" + encodeURIComponent(text) : "";
    return "https://wa.me/" + d + q;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function setText(sel, text) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (text != null) el.textContent = text;
    });
  }

  function therapistCardHtml(t, digits) {
    var nameZh = t.nameZh || "";
    var nameEn = t.nameEn || "";
    var displayName = nameZh + (nameEn ? " " + nameEn : "");
    var specialties = (t.specialties || [])
      .map(function (s) {
        return '<li class="therapist-chip">' + escapeHtml(s) + "</li>";
      })
      .join("");
    var bioLines = String(t.bio || "")
      .split(/\n+/)
      .filter(Boolean)
      .map(function (line) {
        return "<p>" + escapeHtml(line) + "</p>";
      })
      .join("");
    var waText =
      t.waText ||
      "您好，想預約虛構技師【" + displayName + "】——樣板示範";
    var href = waUrl(digits, waText);
    var img = t.image
      ? '<div class="therapist-photo" style="background-image:url(\'' +
        escapeAttr(t.image) +
        "')\" role=\"img\" aria-label=\"" +
        escapeAttr(t.imageAlt || displayName) +
        '"></div>'
      : '<div class="therapist-photo therapist-photo--placeholder" aria-hidden="true"></div>';
    return (
      '<article class="therapist-card pkg-card" id="therapist-' +
      escapeAttr(t.id || "") +
      '">' +
      img +
      '<div class="therapist-body">' +
      '<p class="pkg-cat therapist-role">' +
      escapeHtml(t.role || "") +
      "</p>" +
      "<h3>" +
      escapeHtml(displayName) +
      "</h3>" +
      (specialties
        ? '<ul class="therapist-chips">' + specialties + "</ul>"
        : "") +
      '<div class="therapist-bio">' +
      bioLines +
      "</div>" +
      '<a class="btn btn-wa" href="' +
      href +
      '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
      escapeAttr(waText) +
      '">預約此技師</a>' +
      "</div>" +
      "</article>"
    );
  }

  function renderTherapists(data) {
    var el = document.querySelector("[data-cms='therapists']");
    if (!el) return;
    var section = data.therapistsSection || {};
    var therapists = data.therapists || [];
    var contact = data.contact || {};
    var images = data.images || {};

    setText(
      "[data-cms='therapistsEyebrow']",
      section.eyebrow || "虛構技師 · 樣板示範"
    );
    setText("[data-cms='therapistsHeading']", section.heading || "技師介紹");
    setText("[data-cms='therapistsLede']", section.lede || "");
    setText(
      "[data-cms='shopAmbientNote']",
      section.shopNote || "店內氛圍示意（燭光／精油）· 樣板示範"
    );

    if (!therapists.length) {
      el.innerHTML = "";
      return;
    }

    var digits = contact.phoneDigits || "85291234568";
    el.innerHTML = therapists
      .map(function (t) {
        return therapistCardHtml(t, digits);
      })
      .join("");

    var ambient = document.querySelector(".shop-ambient-photo");
    if (ambient && images.shopAmbient) {
      ambient.style.backgroundImage =
        'linear-gradient(160deg, rgba(13,10,8,0.25), rgba(13,10,8,0.55)), url("' +
        images.shopAmbient +
        '")';
      if (images.shopAmbientAlt) {
        ambient.setAttribute("aria-label", images.shopAmbientAlt);
      }
    }
  }

  var base =
    (window.MooThaiContent && window.MooThaiContent.base) ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src || "";
        var m = src.match(/^(.*\/)js\/therapists\.js(?:\?.*)?$/);
        if (m) return m[1];
      }
      return "./";
    })();

  fetch(base + "data/site.json?_=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("site.json " + r.status);
      return r.json();
    })
    .then(renderTherapists)
    .catch(function (err) {
      console.warn("[therapists.js]", err);
    });
})();
