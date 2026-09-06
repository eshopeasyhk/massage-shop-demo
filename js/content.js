(function () {
  "use strict";

  var BASE = (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      var m = src.match(/^(.*\/)js\/content\.js(?:\?.*)?$/);
      if (m) return m[1];
    }
    return "./";
  })();

  function waUrl(digits, text) {
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

  function iconSvg(name) {
    var icons = {
      foot:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 6c-4 0-8 3-9 8-1 4 0 8 2 12l2 6c1 2 3 4 5 4s4-2 5-4l2-6c2-4 3-8 2-12-1-5-5-8-9-8zm0 4c2.5 0 4.5 1.8 5 4.5.6 3-.2 6-1.5 9l-1.8 5.5c-.4.8-1 1.5-1.7 1.5s-1.3-.7-1.7-1.5L21 23.5c-1.3-3-2.1-6-1.5-9C20 11.8 22 10 24 10z"/></svg>',
      lotus:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 10c2 4 2 7 0 10 2-1 5-1 8 0-2 3-5 5-8 6 3 1 6 3 8 6-3 1-6 1-8 0 2 3 2 6 0 10-2-4-2-7 0-10-2 1-5 1-8 0 2-3 5-5 8-6-3-1-6-3-8-6 3-1 6-1 8 0-2-3-2-6 0-10z"/></svg>',
      thai:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M14 34V14h4v8.5L24 14h4.5l-7 10 7.5 10H24l-6-8.5V34h-4zm20-20c4.4 0 7 2.8 7 7.2S38.4 28 34 28h-2v6h-4V14h6zm0 10c2 0 3-1.2 3-2.8S36 18 34 18h-2v6h2z"/></svg>',
      oil:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 6c-1 4-6 8-6 14a6 6 0 0 0 12 0c0-6-5-10-6-14zm0 22c-5 0-10 3-10 8v2h4v-2c0-2 2-4 6-4s6 2 6 4v2h4v-2c0-5-5-8-10-8z"/></svg>',
      herb:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M38 8c-12 2-20 8-24 16-2 4-3 8-3 12 4 0 8-1 12-3 8-4 14-12 16-24-4 2-8 4-11 8 4-1 7-3 10-9zM14 34c2-6 6-11 12-15-5 6-8 12-8 18-2-1-3-2-4-3z"/></svg>',
      combo:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M16 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm16 0a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM24 28c6 0 14 3 14 9v3H10v-3c0-6 8-9 14-9z"/></svg>'
    };
    return icons[name] || icons.lotus;
  }

  function applyTheme(theme) {
    if (!theme) return;
    var root = document.documentElement;
    var map = {
      bg: "--bg",
      surface: "--surface",
      surface2: "--surface-2",
      ink: "--ink",
      muted: "--muted",
      sage: "--sage",
      sageDark: "--sage-dark",
      clay: "--clay",
      gold: "--gold",
      whatsapp: "--wa",
      line: "--line"
    };
    Object.keys(map).forEach(function (k) {
      if (theme[k]) root.style.setProperty(map[k], theme[k]);
    });
    if (theme.bg) {
      var tc = document.querySelector('meta[name="theme-color"]');
      if (tc) tc.setAttribute("content", theme.bg);
    }
  }

  function applyMeta(meta) {
    if (!meta) return;
    if (meta.title) {
      document.title = meta.title;
      var ogt = document.querySelector('meta[property="og:title"]');
      if (ogt) ogt.setAttribute("content", meta.title);
    }
    if (meta.description) {
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", meta.description);
      var ogd = document.querySelector('meta[property="og:description"]');
      if (ogd) ogd.setAttribute("content", meta.description);
    }
  }

  function applyWaLinks(contact) {
    if (!contact || !contact.phoneDigits) return;
    document.querySelectorAll("a[data-cms-wa]").forEach(function (a) {
      var text = a.getAttribute("data-cms-wa-text") || contact.waDefaultText || "";
      a.href = waUrl(contact.phoneDigits, text);
    });
    setText("[data-cms='phoneDisplay']", contact.phoneDisplay || contact.phoneDigits);
    setText("[data-cms='demoNote']", contact.demoNote || "");
    setText("[data-cms='hours']", contact.hours || "");
    setText("[data-cms='area']", contact.area || "");
    setText("[data-cms='address']", contact.address || "");
    setText("[data-cms='contactTitle']", contact.title || "");
    setText("[data-cms='contactTagline']", contact.tagline || "");
  }

  function renderPriceBoard(board, contact) {
    var el = document.querySelector("[data-cms='priceBoard']");
    if (!el || !board) return;
    var digits = (contact && contact.phoneDigits) || "85291234568";
    setText("[data-cms='priceBoardHeading']", board.heading || "價錢牌");
    setText("[data-cms='priceBoardLede']", board.lede || "");

    var rows = (board.items || [])
      .map(function (item) {
        var badge = item.badge
          ? '<span class="menu-badge">' + escapeHtml(item.badge) + "</span>"
          : "";
        return (
          '<li class="menu-row">' +
          '<div class="menu-name"><strong>' +
          escapeHtml(item.name || "") +
          "</strong>" +
          badge +
          "</div>" +
          '<div class="menu-dots" aria-hidden="true"></div>' +
          '<div class="menu-opts">' +
          escapeHtml(item.options || "") +
          "</div>" +
          "</li>"
        );
      })
      .join("");

    var href = waUrl(digits, board.waText || "");
    el.innerHTML =
      '<ol class="menu-board">' +
      rows +
      "</ol>" +
      '<div class="menu-board-cta">' +
      '<a class="btn btn-wa" href="' +
      href +
      '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
      escapeAttr(board.waText || "") +
      '">' +
      escapeHtml(board.waLabel || "WhatsApp 查詢價錢牌") +
      "</a>" +
      "</div>";
  }

  function packageCardHtml(p, digits) {
    var featured = p.featured ? " featured" : "";
    var badge = p.badge
      ? '<span class="card-badge">' + escapeHtml(p.badge) + "</span>"
      : "";
    var bullets = (p.bullets || [])
      .map(function (b) {
        return "<li>" + escapeHtml(b) + "</li>";
      })
      .join("");
    var href = waUrl(digits, p.waText || "");
    return (
      '<article class="pkg-card' +
      featured +
      '" id="pkg-' +
      escapeAttr(p.id || "") +
      '">' +
      '<div class="pkg-card-top">' +
      '<div class="pkg-icon">' +
      iconSvg(p.icon || "lotus") +
      "</div>" +
      badge +
      "</div>" +
      '<p class="pkg-cat">' +
      escapeHtml(p.category || p.nameEn || "") +
      "</p>" +
      "<h3>" +
      escapeHtml(p.nameZh || "") +
      "</h3>" +
      '<p class="pkg-summary">' +
      escapeHtml(p.summary || "") +
      "</p>" +
      '<p class="pkg-detail">' +
      escapeHtml(p.detail || "") +
      "</p>" +
      '<div class="pkg-price-block">' +
      '<span class="pkg-price"><span class="currency">HK$</span>' +
      escapeHtml(p.price || "") +
      "</span>" +
      (p.priceNote
        ? '<span class="pkg-price-note">' + escapeHtml(p.priceNote) + "</span>"
        : "") +
      "</div>" +
      (bullets ? '<ul class="pkg-bullets">' + bullets + "</ul>" : "") +
      '<a class="btn btn-wa" href="' +
      href +
      '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
      escapeAttr(p.waText || "") +
      '">預約此套票</a>' +
      "</article>"
    );
  }

  function renderPackages(packages, contact) {
    var el = document.querySelector("[data-cms='packages']");
    if (!el || !packages) return;
    var digits = (contact && contact.phoneDigits) || "85291234568";
    el.innerHTML = packages
      .map(function (p) {
        return packageCardHtml(p, digits);
      })
      .join("");
  }

  function renderTrust(trust) {
    var el = document.querySelector("[data-cms='trust']");
    if (!el || !trust) return;
    el.innerHTML = trust
      .map(function (t) {
        return (
          "<li><strong>" +
          escapeHtml(t.title || "") +
          "</strong><span>" +
          escapeHtml(t.body || "") +
          "</span></li>"
        );
      })
      .join("");
  }

  function renderHighlights(items) {
    var el = document.querySelector("[data-cms='aboutHighlights']");
    if (!el || !items) return;
    el.innerHTML = items
      .map(function (h) {
        return "<li>" + escapeHtml(h) + "</li>";
      })
      .join("");
  }

  function renderChips(chips) {
    var el = document.querySelector("[data-cms='heroChips']");
    if (!el || !chips) return;
    el.innerHTML = chips
      .map(function (c) {
        return "<li>" + escapeHtml(c) + "</li>";
      })
      .join("");
  }

  function apply(data) {
    applyTheme(data.theme);
    applyMeta(data.meta);
    applyWaLinks(data.contact);

    if (data.brand) {
      setText("[data-cms='brandZh']", data.brand.zh);
      setText("[data-cms='brandEn']", data.brand.en);
      setText("[data-cms='brandTagline']", data.brand.tagline);
    }
    setText(
      "[data-cms='starterBadge']",
      data.starterBadge || "電商易 Starter 形象網站樣板"
    );
    if (data.hero) {
      setText("[data-cms='heroEyebrow']", data.hero.eyebrow);
      setText("[data-cms='heroTitle']", data.hero.title);
      setText("[data-cms='heroLede']", data.hero.lede);
      renderChips(data.hero.chips);
    }
    if (data.images && data.images.hero) {
      var photo = document.querySelector(".hero-photo");
      if (photo) {
        photo.style.backgroundImage =
          'linear-gradient(135deg, rgba(42,36,32,0.12), rgba(42,36,32,0.35)), url("' +
          data.images.hero +
          '")';
      }
    }
    renderTrust(data.trust);
    renderPriceBoard(data.priceBoard, data.contact);
    renderPackages(data.packages, data.contact);
    setText("[data-cms='pricingFootnote']", data.pricingFootnote);

    if (data.about) {
      setText("[data-cms='aboutKicker']", data.about.kicker);
      setText("[data-cms='aboutName']", data.about.name);
      setText("[data-cms='aboutRole']", data.about.role);
      setText("[data-cms='aboutBio']", data.about.bio);
      setText("[data-cms='aboutBio2']", data.about.bio2);
      renderHighlights(data.about.highlights);
    }
    if (data.contactSection) {
      setText("[data-cms='contactHeading']", data.contactSection.heading);
      setText("[data-cms='contactBody']", data.contactSection.body);
    }
    setText("[data-cms='footerTag']", data.footerTag);
    setText("[data-cms='templateNote']", data.templateNote || "");

    document.documentElement.classList.add("cms-ready");
  }

  window.MooThaiContent = { apply: apply, waUrl: waUrl, base: BASE };

  fetch(BASE + "data/site.json?_=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("site.json " + r.status);
      return r.json();
    })
    .then(apply)
    .catch(function (err) {
      console.warn("[content.js]", err);
    });
})();
