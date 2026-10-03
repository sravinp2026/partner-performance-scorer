/* Partner Desk guided tour. Vanilla JS, no dependencies. Steps move across pages with ?tour=N and sessionStorage. */
(function () {
  "use strict";
  var KEY = "pd_tour_step", SEEN = "pd_tour_seen", TOTAL = 7;
  var PAGE = (location.pathname.split("/").pop() || "index.html");
  function ls(op, k, v) { try { if (op === "get") return localStorage.getItem(k); if (op === "set") localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { } return null; }
  function ss(op, k, v) { try { if (op === "get") return sessionStorage.getItem(k); if (op === "set") sessionStorage.setItem(k, v); else sessionStorage.removeItem(k); } catch (e) { } return null; }
  function $(s) { return document.querySelector(s); }
  function visible(el) { return el && el.getClientRects().length > 0 ? el : null; }

  // The flagged row on the Scorer: prefer a row with an unscored/stale flag, else any flag.
  function flaggedRow() {
    var rows = document.querySelectorAll("#tbl tbody tr"), any = null;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].querySelector(".flag.red")) return rows[i];
      if (!any && rows[i].querySelector(".flag")) any = rows[i];
    }
    return any;
  }

  var STEPS = [
    { page: "index.html", title: "Every partner, scored 0–100",
      text: "Every partner scored 0–100 from five signals; the tier decides the service model.",
      find: function () { return visible($("#kpis")); } },
    { page: "index.html", title: "Missing data is flagged, not zeroed",
      text: "A missing or stale figure is flagged and left unscored, never shown as 0.",
      find: function () { return visible(flaggedRow()) || visible($("#tbl thead th:nth-child(5)")); } },
    { page: "index.html", title: "Open any score",
      text: "Every number shows its inputs and the rule behind each action.",
      before: function () {
        var row = flaggedRow(), sel = $("#whyPick"), b = row && row.querySelector("[data-del]");
        if (sel && b && sel.value !== b.dataset.del && [].some.call(sel.options, function (o) { return o.value === b.dataset.del; })) {
          sel.value = b.dataset.del; sel.dispatchEvent(new Event("change", { bubbles: true }));
        }
      },
      find: function () { var w = $("#why"); return visible(w && w.closest(".card")); } },
    { page: "jbps.html", title: "Attainment against the agreed plan",
      text: "Attainment is measured against the agreed JBP, by holding group and market. Where a variance is outside the band, the partner manager picks a reason code here.",
      find: function () { return visible($("select[data-reason]")) || visible($("#tbl")); } },
    { page: "pipeline.html", title: "Coverage, and what stays unknown",
      text: "Coverage = open pipeline ÷ next quarter’s commitment; unknown stays unknown.",
      find: function () { var f = $("#cov .fig.na"); return visible(f && f.closest("tr")) || visible($("#cov")); } },
    { page: "qbrs.html", title: "The QBR pack writes itself",
      text: "The QBR pack writes itself from the record; a model writes the words, never the figures.",
      find: function () { return visible($("#printBtn")); } },
    { page: "method.html", title: "That is the tour", last: true,
      text: "Built as a working proposal. Invented data. Not affiliated with Careem. You can go back to the Scorer, or reset any edits you made while exploring.",
      find: function () { return visible($("header p")) || visible($("header")); } }
  ];

  var ui = null, cur = 0, curEl = null, opener = null, raf = 0;

  function build() {
    if (ui) return ui;
    var blocker = document.createElement("div"); blocker.className = "pd-tour-block";
    var spot = document.createElement("div"); spot.className = "pd-tour-spot";
    var card = document.createElement("div"); card.className = "pd-tour-card";
    card.setAttribute("role", "dialog"); card.setAttribute("aria-labelledby", "pd-tour-title"); card.setAttribute("aria-modal", "true");
    card.innerHTML = '<div class="pd-tour-count" id="pd-tour-count"></div><h2 id="pd-tour-title"></h2><p id="pd-tour-text"></p>' +
      '<div class="pd-tour-extra" id="pd-tour-extra"></div>' +
      '<div class="pd-tour-btns"><button type="button" class="sec" id="pd-tour-back">Back</button><button type="button" id="pd-tour-next">Next</button><button type="button" class="sec pd-tour-skip" id="pd-tour-skip">Skip tour</button></div>';
    document.body.appendChild(blocker); document.body.appendChild(spot); document.body.appendChild(card);
    ui = { blocker: blocker, spot: spot, card: card, back: card.querySelector("#pd-tour-back"), next: card.querySelector("#pd-tour-next"), skip: card.querySelector("#pd-tour-skip"),
      count: card.querySelector("#pd-tour-count"), title: card.querySelector("#pd-tour-title"), text: card.querySelector("#pd-tour-text"), extra: card.querySelector("#pd-tour-extra") };
    ui.back.onclick = function () { show(cur - 1, -1); };
    ui.next.onclick = function () { if (STEPS[cur - 1].last) end(); else show(cur + 1, 1); };
    ui.skip.onclick = function () { end(); };
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", schedule); window.addEventListener("scroll", schedule, true);
    return ui;
  }

  function onKey(e) {
    if (!ui) return;
    if (e.key === "Escape") { e.preventDefault(); end(); return; }
    var t = e.target, tag = t && t.tagName;
    if (e.key === "Tab") {
      var f = [].filter.call(ui.card.querySelectorAll("button"), function (b) { return !b.disabled; });
      if (!f.length) return;
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
      return;
    }
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); ui.next.click(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); if (!ui.back.disabled) ui.back.click(); }
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; place(); }); }

  function place() {
    if (!ui || !curEl) return;
    var r = curEl.getBoundingClientRect(), pad = 6, vw = document.documentElement.clientWidth, vh = window.innerHeight;
    ui.spot.style.left = (r.left - pad) + "px"; ui.spot.style.top = (r.top - pad) + "px";
    ui.spot.style.width = (r.width + pad * 2) + "px"; ui.spot.style.height = (r.height + pad * 2) + "px";
    var c = ui.card, narrow = vw <= 600;
    c.style.right = c.style.bottom = c.style.left = c.style.top = "";
    if (narrow) return; // CSS pins the card to the bottom
    var cw = c.offsetWidth, ch = c.offsetHeight, g = 14, x, y;
    var cl = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
    if (r.bottom + g + ch <= vh - 8) { y = r.bottom + g; x = cl(r.left, 12, vw - cw - 12); }
    else if (r.top - g - ch >= 8) { y = r.top - g - ch; x = cl(r.left, 12, vw - cw - 12); }
    else if (r.right + g + cw <= vw - 8) { x = r.right + g; y = cl(r.top, 12, vh - ch - 12); }
    else if (r.left - g - cw >= 8) { x = r.left - g - cw; y = cl(r.top, 12, vh - ch - 12); }
    else { x = vw - cw - 16; y = vh - ch - 16; }
    c.style.left = x + "px"; c.style.top = y + "px";
  }

  function reveal(el) {
    try { el.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (e) { }
    var r = el.getBoundingClientRect(), vh = window.innerHeight, narrow = document.documentElement.clientWidth <= 600;
    var want = (narrow || r.height > vh * 0.45) ? 70 : Math.max(70, (vh - r.height) / 3);
    if (!narrow && r.height <= vh * 0.45 && r.top >= 60 && r.bottom <= vh - 60) return;
    window.scrollBy(0, r.top - want);
  }

  function go(n) { ss("set", KEY, String(n)); location.href = STEPS[n - 1].page + "?tour=" + n; }

  function show(n, dir) {
    dir = dir || 1;
    if (n > TOTAL) { end(); return; }
    if (n < 1) { end(); return; }
    var s = STEPS[n - 1];
    if (s.page !== PAGE) { go(n); return; }
    if (s.before) { try { s.before(); } catch (e) { } }
    var el = null; try { el = s.find(); } catch (e) { el = null; }
    if (!el) { show(n + dir, dir); return; } // target missing (data changed): skip gracefully
    build(); cur = n; curEl = el; ss("set", KEY, String(n));
    if (ls("get", SEEN) !== "1") ls("set", SEEN, "1");
    removeChip();
    ui.count.textContent = "Step " + n + " of " + TOTAL;
    ui.title.textContent = s.title; ui.text.textContent = s.text;
    ui.back.disabled = n === 1; ui.next.textContent = s.last ? "Finish" : "Next";
    ui.extra.innerHTML = "";
    if (s.last) {
      var b1 = document.createElement("a"); b1.className = "btn"; b1.href = "index.html"; b1.textContent = "Back to the Scorer";
      b1.onclick = function () { clearState(); };
      var b2 = document.createElement("button"); b2.type = "button"; b2.className = "sec"; b2.textContent = "Reset the demo data";
      b2.onclick = function () {
        if (!confirm("Reset the demo data? This clears your edits on every page and restores the invented sample.")) return;
        ls("del", "pps3"); ls("del", "pd1"); clearState(); location.href = "index.html";
      };
      ui.extra.appendChild(b1); ui.extra.appendChild(b2);
    }
    document.documentElement.classList.add("pd-touring");
    reveal(el); place();
    ui.next.focus({ preventScroll: true });
    setTimeout(place, 60);
  }

  function clearState() {
    ss("del", KEY);
    try { var u = new URL(location.href); if (u.searchParams.has("tour")) { u.searchParams.delete("tour"); history.replaceState(null, "", u.pathname + u.search + u.hash); } } catch (e) { }
  }

  function end() {
    clearState(); ls("set", SEEN, "1");
    if (ui) {
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", schedule); window.removeEventListener("scroll", schedule, true);
      ui.blocker.remove(); ui.spot.remove(); ui.card.remove(); ui = null;
    }
    curEl = null; document.documentElement.classList.remove("pd-touring");
    var f = (opener && document.contains(opener)) ? opener : $(".pd-tour-nav");
    if (f) { try { f.focus(); } catch (e) { } }
    opener = null;
  }

  function start() {
    opener = document.activeElement;
    if (PAGE !== "index.html") { go(1); return; }
    show(1, 1);
  }

  function removeChip() { var c = $(".pd-tour-chip"); if (c) c.remove(); }

  function mount() {
    var themeBtn = document.getElementById("themeBtn"), nav = document.getElementById("nav");
    if (nav) {
      var b = document.createElement("button"); b.type = "button"; b.className = "sec pd-tour-nav"; b.textContent = "Take the 2-minute tour";
      b.onclick = start;
      if (themeBtn) nav.insertBefore(b, themeBtn); else nav.appendChild(b);
    }
    if (PAGE === "index.html") {
      var hd = $("header > div");
      if (hd) {
        var h = document.createElement("button"); h.type = "button"; h.className = "pd-tour-hero"; h.textContent = "Take the 2-minute tour";
        h.onclick = start; hd.appendChild(h);
      }
    }
    var m = /[?&]tour=(\d+)/.exec(location.search), n = m ? parseInt(m[1], 10) : parseInt(ss("get", KEY) || "", 10);
    if (n >= 1 && n <= TOTAL && STEPS[n - 1].page === PAGE) { show(n, 1); return; }
    if (m) clearState();
    if (PAGE === "index.html" && ls("get", SEEN) !== "1") {
      var chip = document.createElement("div"); chip.className = "pd-tour-chip"; chip.setAttribute("role", "region"); chip.setAttribute("aria-label", "Tour invitation");
      var go1 = document.createElement("button"); go1.type = "button"; go1.textContent = "New here? Take the 2-minute tour"; go1.onclick = function () { removeChip(); start(); };
      var x = document.createElement("button"); x.type = "button"; x.className = "sec pd-tour-x"; x.setAttribute("aria-label", "Dismiss"); x.textContent = "×";
      x.onclick = function () { ls("set", SEEN, "1"); removeChip(); };
      chip.appendChild(go1); chip.appendChild(x); document.body.appendChild(chip);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
