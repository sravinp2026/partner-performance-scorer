/* Partner Desk shared data module. INVENTED DATA throughout: no figure here describes any real company.
   One dataset feeds every page. The scorer's per-quarter target/actual are derived from the JBP rows below
   (sum over markets), so the two can never disagree. */
window.PD = (function () {
  "use strict";
  const TODAY = "2026-10-03";
  const QUARTERS = ["2025-Q4", "2026-Q1", "2026-Q2", "2026-Q3"];
  const NEXT_Q = "2026-Q4";
  const ALL_Q = QUARTERS.concat([NEXT_Q]);
  const MARKETS = ["UAE", "KSA", "Egypt"];
  const GROUPS = ["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6"];

  // id, name, home market, holding group, partner manager
  const AGENCIES = [
    { id: "A", name: "Agency A", market: "UAE", group: "Group 1", manager: "Sara" },
    { id: "B", name: "Agency B", market: "UAE", group: "Group 2", manager: "Sara" },
    { id: "C", name: "Agency C", market: "KSA", group: "Group 1", manager: "Faisal" },
    { id: "D", name: "Agency D", market: "KSA", group: "Group 3", manager: "Faisal" },
    { id: "E", name: "Agency E", market: "Egypt", group: "Group 2", manager: "Nour" },
    { id: "F", name: "Agency F", market: "Egypt", group: "Group 4", manager: "Nour" },
    { id: "G", name: "Agency G", market: "UAE", group: "Group 4", manager: "Sara" },
    { id: "H", name: "Agency H", market: "KSA", group: "Group 5", manager: "Faisal" },
    { id: "I", name: "Agency I", market: "UAE", group: "Group 6", manager: "Sara" }
  ];

  // JBP rows: one per agency, year and market. q = quarter -> [commitment, attainment] in USD thousands; null = unknown.
  // 2025 JBPs cover 2025-Q4 only in this dataset; 2026 JBPs carry Q1..Q3 attainment and a Q4 commitment with no attainment yet.
  const JBP = [
    { agency: "A", year: 2025, market: "UAE", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [550, 520] } },
    { agency: "A", year: 2025, market: "KSA", formats: ["Banner"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [150, 130] } },
    { agency: "A", year: 2026, market: "UAE", formats: ["Banner", "Sponsored listing", "Ride-screen", "Pay placement"], pilots: ["Beta format 1", "Beta format 2"], terms: "Annual commitment, volume rebate", q: { "2026-Q1": [620, 560], "2026-Q2": [650, 630], "2026-Q3": [680, 770], "2026-Q4": [760, null] } },
    { agency: "A", year: 2026, market: "KSA", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Annual commitment", q: { "2026-Q1": [180, 160], "2026-Q2": [200, 190], "2026-Q3": [220, 240], "2026-Q4": [240, null] } },
    { agency: "B", year: 2025, market: "UAE", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [600, 610] } },
    { agency: "B", year: 2026, market: "UAE", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2026-Q1": [650, 590], "2026-Q2": [700, 640], "2026-Q3": [700, 520], "2026-Q4": [700, null] } },
    { agency: "C", year: 2025, market: "KSA", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [700, 680] } },
    { agency: "C", year: 2025, market: "UAE", formats: ["Banner"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [200, 190] } },
    { agency: "C", year: 2026, market: "KSA", formats: ["Banner", "Sponsored listing", "Ride-screen"], pilots: ["Beta format 1"], terms: "Annual commitment, volume rebate", q: { "2026-Q1": [780, 740], "2026-Q2": [850, 760], "2026-Q3": [930, 880], "2026-Q4": [950, null] } },
    { agency: "C", year: 2026, market: "UAE", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Annual commitment", q: { "2026-Q1": [220, 200], "2026-Q2": [250, 220], "2026-Q3": [270, 250], "2026-Q4": [300, null] } },
    { agency: "D", year: 2025, market: "KSA", formats: ["Banner"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [600, 520] } },
    { agency: "D", year: 2026, market: "KSA", formats: ["Banner"], pilots: [], terms: "Annual commitment", q: { "2026-Q1": [700, 480], "2026-Q2": [800, 450], "2026-Q3": [800, 310], "2026-Q4": [700, null] } },
    { agency: "E", year: 2025, market: "Egypt", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [250, 200] } },
    { agency: "E", year: 2026, market: "Egypt", formats: ["Banner", "Sponsored listing", "Ride-screen"], pilots: ["Beta format 1"], terms: "Annual commitment", q: { "2026-Q1": [300, 260], "2026-Q2": [350, 300], "2026-Q3": [400, 455], "2026-Q4": [450, null] } },
    { agency: "F", year: 2026, market: "Egypt", formats: ["Banner"], pilots: [], terms: "Standard IO (signed Jul 2026)", q: { "2026-Q3": [350, 140], "2026-Q4": [350, null] } },
    { agency: "G", year: 2025, market: "UAE", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [550, 540] } },
    { agency: "G", year: 2026, market: "UAE", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Annual commitment", q: { "2026-Q1": [600, 580], "2026-Q2": [600, 590], "2026-Q3": [600, 610], "2026-Q4": [620, null] } },
    { agency: "H", year: 2025, market: "KSA", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [600, 600] } },
    { agency: "H", year: 2025, market: "Egypt", formats: ["Banner"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [200, 190] } },
    { agency: "H", year: 2026, market: "KSA", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Annual commitment", q: { "2026-Q1": [680, 580], "2026-Q2": [750, 540], "2026-Q3": [750, 370], "2026-Q4": [680, null] } },
    { agency: "H", year: 2026, market: "Egypt", formats: ["Banner"], pilots: [], terms: "Annual commitment", q: { "2026-Q1": [220, 180], "2026-Q2": [250, 160], "2026-Q3": [250, 110], "2026-Q4": [220, null] } },
    { agency: "I", year: 2025, market: "UAE", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [300, 290] } },
    { agency: "I", year: 2025, market: "Egypt", formats: ["Banner"], pilots: [], terms: "Standard IO", q: { "2025-Q4": [100, 90] } },
    { agency: "I", year: 2026, market: "UAE", formats: ["Banner", "Sponsored listing", "Ride-screen"], pilots: ["Beta format 1"], terms: "Annual commitment", q: { "2026-Q1": [330, 320], "2026-Q2": [350, 370], "2026-Q3": [360, 400], "2026-Q4": [400, null] } },
    { agency: "I", year: 2026, market: "Egypt", formats: ["Banner", "Sponsored listing"], pilots: [], terms: "Annual commitment", q: { "2026-Q1": [120, 110], "2026-Q2": [130, 130], "2026-Q3": [140, 140], "2026-Q4": [150, null] } }
  ];

  // Scorer-only inputs per agency per quarter: [active advertisers, formats used, pilots, pipeline for past quarters, as-of, source].
  // The 2026-Q3 pipeline is computed from the open opportunities below (null here), so the scorer and the Pipeline page agree.
  const EXTRAS = {
    A: { "2025-Q4": [9, 2, 0, 900, "2026-01-05", "CRM"], "2026-Q1": [11, 3, 1, 1100, "2026-04-04", "CRM"], "2026-Q2": [11, 3, 1, 1250, "2026-07-03", "CRM"], "2026-Q3": [14, 4, 2, null, "2026-10-02", "CRM"] },
    B: { "2025-Q4": [10, 2, 0, 700, "2026-01-05", "CRM"], "2026-Q1": [9, 2, 0, 680, "2026-04-04", "CRM"], "2026-Q2": [9, 2, 0, 650, "2026-07-03", "CRM"], "2026-Q3": [8, 2, 0, null, "2026-10-02", "CRM"] },
    C: { "2025-Q4": [12, 2, 0, 1100, "2026-01-05", "CRM"], "2026-Q1": [13, 3, 1, 1300, "2026-04-04", "CRM"], "2026-Q2": [14, 3, 1, 1400, "2026-07-03", "CRM"], "2026-Q3": [17, 3, 1, null, "2026-10-02", "CRM"] },
    D: { "2025-Q4": [8, 1, 0, 600, "2026-01-05", "CRM"], "2026-Q1": [8, 1, 0, 500, "2026-04-04", "CRM"], "2026-Q2": [8, 1, 0, 400, "2026-07-03", "CRM"], "2026-Q3": [5, 1, 0, null, "2026-10-02", "CRM"] },
    E: { "2025-Q4": [5, 2, 0, 350, "2026-01-05", "CRM"], "2026-Q1": [6, 2, 0, 450, "2026-04-04", "CRM"], "2026-Q2": [6, 3, 1, 550, "2026-07-03", "CRM"], "2026-Q3": [9, 3, 1, null, "2026-10-02", "CRM"] },
    F: { "2026-Q3": [3, 1, 0, null, "2026-10-01", "Manual"] },
    G: { "2025-Q4": [10, 2, 0, 600, "2026-01-05", "CRM"], "2026-Q1": [10, 2, 0, 620, "2026-04-04", "CRM"], "2026-Q2": [10, 2, 0, 630, "2026-07-03", "CRM"], "2026-Q3": [10, 2, 0, null, "2026-10-02", "CRM"] },
    H: { "2025-Q4": [12, 2, 0, 900, "2026-01-05", "CRM"], "2026-Q1": [12, 2, 0, 850, "2026-04-04", "CRM"], "2026-Q2": [12, 2, 0, 700, "2026-07-03", "CRM"], "2026-Q3": [7, 2, 0, null, "2026-08-12", "Manual"] },
    I: { "2025-Q4": [7, 2, 0, 500, "2026-01-05", "CRM"], "2026-Q1": [8, 3, 0, 560, "2026-04-04", "CRM"], "2026-Q2": [9, 3, 1, 620, "2026-07-03", "CRM"], "2026-Q3": [10, 3, 1, null, "2026-10-02", "CRM"] }
  };

  const STAGES = ["Prospect", "Qualified", "Proposal", "Negotiation", "Closed won", "Closed lost"];
  const OPEN_STAGES = ["Prospect", "Qualified", "Proposal", "Negotiation"];
  const PROB_DEF = { Prospect: 10, Qualified: 25, Proposal: 50, Negotiation: 75, "Closed won": 100, "Closed lost": 0 };

  // Opportunities: agency, advertiser (anonymised), market, stage, value $k, expected quarter, as-of date, source.
  // Agency D has no opportunities recorded in the CRM: its pipeline is unknown, shown blank and flagged, never 0.
  const OPP_RAW = [
    ["A", "Advertiser A", "UAE", "Negotiation", 300, "2026-Q4", "2026-10-01", "CRM"],
    ["A", "Advertiser B", "UAE", "Proposal", 250, "2026-Q4", "2026-09-28", "CRM"],
    ["A", "Advertiser C", "KSA", "Qualified", 150, "2026-Q4", "2026-09-30", "CRM"],
    ["A", "Advertiser D", "UAE", "Prospect", 200, "2027-Q1", "2026-09-15", "CRM"],
    ["A", "Advertiser E", "UAE", "Proposal", 300, "2026-Q4", "2026-10-02", "CRM"],
    ["A", "Advertiser F", "KSA", "Negotiation", 200, "2027-Q1", "2026-09-29", "CRM"],
    ["A", "Advertiser G", "UAE", "Closed won", 180, "2026-Q3", "2026-09-20", "CRM"],
    ["A", "Advertiser H", "UAE", "Closed lost", 120, "2026-Q3", "2026-08-30", "CRM"],
    ["A", "Advertiser AN", "KSA", "Closed won", 130, "2026-Q2", "2026-06-20", "CRM"],
    ["B", "Advertiser I", "UAE", "Proposal", 200, "2026-Q4", "2026-09-25", "CRM"],
    ["B", "Advertiser J", "UAE", "Qualified", 150, "2026-Q4", "2026-08-20", "CRM"],
    ["B", "Advertiser K", "UAE", "Prospect", 100, "2027-Q1", "2026-08-12", "CRM"],
    ["B", "Advertiser L", "UAE", "Negotiation", 150, "2026-Q4", "2026-10-01", "CRM"],
    ["B", "Advertiser M", "UAE", "Closed lost", 200, "2026-Q3", "2026-09-10", "CRM"],
    ["B", "Advertiser AR", "UAE", "Closed won", 100, "2026-Q2", "2026-06-22", "CRM"],
    ["C", "Advertiser N", "KSA", "Negotiation", 400, "2026-Q4", "2026-10-02", "CRM"],
    ["C", "Advertiser O", "KSA", "Proposal", 300, "2026-Q4", "2026-09-30", "CRM"],
    ["C", "Advertiser P", "UAE", "Proposal", 200, "2026-Q4", "2026-09-27", "CRM"],
    ["C", "Advertiser Q", "KSA", "Qualified", 250, "2027-Q1", "2026-09-29", "CRM"],
    ["C", "Advertiser R", "KSA", "Prospect", 150, "2027-Q1", "2026-09-18", "CRM"],
    ["C", "Advertiser S", "UAE", "Negotiation", 200, "2026-Q4", "2026-10-01", "CRM"],
    ["C", "Advertiser T", "KSA", "Closed won", 220, "2026-Q3", "2026-09-22", "CRM"],
    ["C", "Advertiser AO", "UAE", "Closed won", 150, "2026-Q2", "2026-06-18", "CRM"],
    ["E", "Advertiser U", "Egypt", "Negotiation", 250, "2026-Q4", "2026-10-01", "CRM"],
    ["E", "Advertiser V", "Egypt", "Proposal", 150, "2026-Q4", "2026-09-30", "CRM"],
    ["E", "Advertiser W", "Egypt", "Qualified", 120, "2026-Q4", "2026-09-26", "CRM"],
    ["E", "Advertiser X", "Egypt", "Prospect", 180, "2027-Q1", "2026-09-29", "CRM"],
    ["E", "Advertiser Y", "Egypt", "Closed won", 90, "2026-Q3", "2026-09-15", "CRM"],
    ["E", "Advertiser AP", "Egypt", "Closed lost", 60, "2026-Q2", "2026-06-10", "CRM"],
    ["F", "Advertiser Z", "Egypt", "Qualified", 120, "2026-Q4", "2026-10-01", "Manual"],
    ["G", "Advertiser AA", "UAE", "Proposal", 240, "2026-Q4", "2026-09-30", "CRM"],
    ["G", "Advertiser AB", "UAE", "Negotiation", 200, "2026-Q4", "2026-10-02", "CRM"],
    ["G", "Advertiser AC", "UAE", "Qualified", 200, "2027-Q1", "2026-09-24", "CRM"],
    ["G", "Advertiser AD", "UAE", "Closed won", 150, "2026-Q3", "2026-09-19", "CRM"],
    ["G", "Advertiser AQ", "UAE", "Closed won", 120, "2026-Q2", "2026-06-25", "CRM"],
    ["H", "Advertiser AE", "KSA", "Proposal", 200, "2026-Q4", "2026-08-12", "Manual"],
    ["H", "Advertiser AF", "KSA", "Qualified", 150, "2026-Q4", "2026-08-12", "Manual"],
    ["H", "Advertiser AG", "Egypt", "Prospect", 150, "2027-Q1", "2026-08-10", "Manual"],
    ["H", "Advertiser AH", "KSA", "Closed lost", 300, "2026-Q3", "2026-08-01", "CRM"],
    ["I", "Advertiser AI", "UAE", "Negotiation", 250, "2026-Q4", "2026-10-01", "CRM"],
    ["I", "Advertiser AJ", "UAE", "Proposal", 200, "2026-Q4", "2026-09-29", "CRM"],
    ["I", "Advertiser AK", "Egypt", "Qualified", 100, "2026-Q4", "2026-09-30", "CRM"],
    ["I", "Advertiser AL", "UAE", "Prospect", 150, "2027-Q1", "2026-09-22", "CRM"],
    ["I", "Advertiser AM", "Egypt", "Closed won", 80, "2026-Q3", "2026-09-12", "CRM"]
  ];
  const OPPS = OPP_RAW.map((r, i) => ({ id: "o" + (i + 1), agency: r[0], advertiser: r[1], market: r[2], stage: r[3], value: r[4], expectedQ: r[5], asOf: r[6], source: r[7] }));

  // QBR calendar: due date per agency per quarter; held = date it happened, null = not yet. The scorer's "QBR held" flag reads this.
  const QBRS = [
    ["A", "2025-Q4", "2025-12-18", "2025-12-10"], ["A", "2026-Q1", "2026-03-19", "2026-03-12"], ["A", "2026-Q2", "2026-06-18", "2026-06-11"], ["A", "2026-Q3", "2026-09-17", "2026-09-16"], ["A", "2026-Q4", "2026-12-10", null],
    ["B", "2025-Q4", "2025-12-18", "2025-12-15"], ["B", "2026-Q1", "2026-03-19", "2026-03-24"], ["B", "2026-Q2", "2026-06-18", "2026-06-16"], ["B", "2026-Q3", "2026-09-17", "2026-09-22"], ["B", "2026-Q4", "2026-12-11", null],
    ["C", "2025-Q4", "2025-12-17", "2025-12-09"], ["C", "2026-Q1", "2026-03-18", "2026-03-11"], ["C", "2026-Q2", "2026-06-17", "2026-06-10"], ["C", "2026-Q3", "2026-09-16", "2026-09-15"], ["C", "2026-Q4", "2026-12-09", null],
    ["D", "2025-Q4", "2025-12-17", "2025-12-15"], ["D", "2026-Q1", "2026-03-20", null], ["D", "2026-Q2", "2026-06-19", null], ["D", "2026-Q3", "2026-09-18", null], ["D", "2026-Q4", "2026-12-16", null],
    ["E", "2025-Q4", "2025-12-16", "2025-12-11"], ["E", "2026-Q1", "2026-03-17", "2026-03-10"], ["E", "2026-Q2", "2026-06-16", "2026-06-09"], ["E", "2026-Q3", "2026-09-15", "2026-09-14"], ["E", "2026-Q4", "2026-12-08", null],
    ["F", "2026-Q3", "2026-10-15", null], ["F", "2026-Q4", "2026-12-15", null],
    ["G", "2025-Q4", "2025-12-18", "2025-12-12"], ["G", "2026-Q1", "2026-03-19", "2026-03-13"], ["G", "2026-Q2", "2026-06-18", "2026-06-12"], ["G", "2026-Q3", "2026-09-17", "2026-09-18"], ["G", "2026-Q4", "2026-12-10", null],
    ["H", "2025-Q4", "2025-12-17", "2025-12-16"], ["H", "2026-Q1", "2026-03-18", "2026-03-25"], ["H", "2026-Q2", "2026-06-17", "2026-06-24"], ["H", "2026-Q3", "2026-09-16", "2026-09-30"], ["H", "2026-Q4", "2026-12-09", null],
    ["I", "2025-Q4", "2025-12-18", "2025-12-11"], ["I", "2026-Q1", "2026-03-19", "2026-03-12"], ["I", "2026-Q2", "2026-06-18", "2026-06-11"], ["I", "2026-Q3", "2026-09-17", "2026-09-16"], ["I", "2026-Q4", "2026-12-10", null]
  ].map(r => ({ agency: r[0], quarter: r[1], due: r[2], held: r[3] }));

  // Roadshows and enablement sessions. outcome = adoption measured after the session; null = not yet measured (shown blank, flagged).
  const EVENTS = [
    { id: "e1", date: "2026-01-21", type: "Roadshow", market: "UAE", agencies: ["A", "B", "G", "I"], topic: "2026 formats and measurement roadmap", attendees: 38, outcome: { metric: "Formats used, Q4'25 to Q1'26", before: 8, after: 10, note: "A and I added a third format" } },
    { id: "e2", date: "2026-02-04", type: "Roadshow", market: "KSA", agencies: ["C", "D", "H"], topic: "2026 formats and measurement roadmap", attendees: 27, outcome: { metric: "Formats used, Q4'25 to Q1'26", before: 5, after: 6, note: "C added ride-screen; D and H unchanged" } },
    { id: "e3", date: "2026-02-18", type: "Roadshow", market: "Egypt", agencies: ["E"], topic: "2026 formats and measurement roadmap", attendees: 14, outcome: { metric: "Active advertisers, Q4'25 to Q1'26", before: 5, after: 6, note: "one new advertiser" } },
    { id: "e4", date: "2026-04-15", type: "Enablement", market: "UAE", agencies: ["B"], topic: "Sponsored listings: planning and reporting", attendees: 9, outcome: { metric: "Formats used, Q1 to Q2", before: 2, after: 2, note: "no change; follow-up booked" } },
    { id: "e5", date: "2026-05-13", type: "Enablement", market: "KSA", agencies: ["D"], topic: "Ride-screen format walkthrough", attendees: 6, outcome: { metric: "Formats used, Q1 to Q2", before: 1, after: 1, note: "no change; agency lead changed in June" } },
    { id: "e6", date: "2026-05-27", type: "Enablement", market: "Egypt", agencies: ["E"], topic: "Beta format 1 pilot onboarding", attendees: 7, outcome: { metric: "Pilots live, Q1 to Q2", before: 0, after: 1, note: "pilot live in Q2" } },
    { id: "e7", date: "2026-07-08", type: "Roadshow", market: "Egypt", agencies: ["E", "F", "I"], topic: "Mid-year: results so far and H2 inventory", attendees: 21, outcome: { metric: "Agencies with a signed JBP", before: 2, after: 3, note: "F signed in July" } },
    { id: "e8", date: "2026-08-19", type: "Enablement", market: "UAE", agencies: ["A", "I"], topic: "Pay placement format and closed-loop reporting", attendees: 11, outcome: { metric: "Formats used, Q2 to Q3", before: 6, after: 7, note: "A added pay placement" } },
    { id: "e9", date: "2026-09-09", type: "Enablement", market: "KSA", agencies: ["H"], topic: "Pipeline hygiene and CRM entry", attendees: 5, outcome: null },
    { id: "e10", date: "2026-09-23", type: "Roadshow", market: "UAE", agencies: ["A", "B", "G", "I"], topic: "2027 planning and new placements", attendees: 41, outcome: null }
  ];

  const REASONS = ["Budget cut by advertiser", "Campaign slipped to next quarter", "Format not available in market", "Measurement gap blocked sign-off", "Agency staffing change", "Pricing or IO delay", "New advertiser onboarded (over plan)", "Seasonal demand (over plan)"];

  // ---------- state (shared by JBPs, Pipeline, QBRs pages; the scorer keeps its own key) ----------
  const DEF = () => ({ probs: Object.assign({}, PROB_DEF), staleDays: 30, onPlanBand: 5, lowAttain: 80, qbrGraceDays: 14, reasons: {}, attain: {}, opp: {}, qbr: {}, done: {}, log: [], q: "2026-Q3" });
  let S = DEF();
  function load() { try { const s = JSON.parse(localStorage.getItem("pd1") || "null"); if (s && s.probs) S = Object.assign(DEF(), s); } catch (e) { S = DEF(); } return S; }
  function save() { try { localStorage.setItem("pd1", JSON.stringify(S)); } catch (e) { /* storage unavailable: the page still works for this visit */ } }
  function reset() { S = DEF(); logIt("Reset to the invented sample"); save(); }
  function logIt(msg) { S.log.unshift(new Date().toISOString().slice(0, 16).replace("T", " ") + "  " + msg); S.log = S.log.slice(0, 80); }

  // ---------- helpers ----------
  const isNum = v => v !== null && v !== undefined && v !== "" && !isNaN(+v);
  const fmt = n => (+n).toLocaleString("en-US");
  const money = n => isNum(n) ? "$" + fmt(Math.round(+n)) + "k" : "";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
  const ageOf = d => d ? daysBetween(d, TODAY) : null;
  const agency = id => AGENCIES.find(a => a.id === id);
  const prevQ = q => { const i = ALL_Q.indexOf(q); return i > 0 ? ALL_Q[i - 1] : null; };
  const nextQ = q => { const i = ALL_Q.indexOf(q); return i >= 0 && i < ALL_Q.length - 1 ? ALL_Q[i + 1] : null; };
  const pct = (a, b) => isNum(a) && isNum(b) && +b > 0 ? Math.round(+a / +b * 100) : null;

  // JBP rows flattened: one per agency, quarter, market, with overrides applied.
  function jbpRows() {
    const out = [];
    JBP.forEach(j => Object.entries(j.q).forEach(([q, v]) => {
      const key = j.agency + "|" + q + "|" + j.market;
      const ov = S.attain[key];
      const attain = ov === undefined ? v[1] : ov;
      const x = (EXTRAS[j.agency] || {})[q];
      out.push({ key, agency: j.agency, year: j.year, market: j.market, quarter: q, commit: v[0], attain, asOf: x ? x[4] : null, source: x ? x[5] : (q === NEXT_Q ? "JBP" : null), formats: j.formats, pilots: j.pilots, terms: j.terms, reason: S.reasons[key] || "" });
    }));
    return out;
  }
  function jbpFor(agencyId, year) { return JBP.filter(j => j.agency === agencyId && j.year === year); }

  // Confidence for a JBP row: High = CRM and fresh; Medium = manual or new; Low = stale or missing.
  function rowConfidence(r) {
    if (!isNum(r.attain)) return "Low";
    const age = ageOf(r.asOf);
    if (age === null || age > 45) return "Low";
    if (/manual/i.test(r.source || "")) return "Medium";
    return "High";
  }

  function opps() { return OPPS.map(o => Object.assign({}, o, S.opp[o.id] || {})); }
  const isOpen = o => OPEN_STAGES.includes(o.stage);
  function weighted(o) { return o.value * (S.probs[o.stage] || 0) / 100; }

  function qbrs() { return QBRS.map(x => Object.assign({}, x, S.qbr[x.agency + "|" + x.quarter] || {})); }
  function qbrStatus(x) {
    if (x.held) return "held";
    if (daysBetween(x.due, TODAY) > 0) return "overdue";
    if (QUARTERS.includes(x.quarter)) return "due";
    return "scheduled";
  }

  // The scorer's sample, derived: target = sum of commitments, actual = sum of attainments (null if any market is unknown),
  // qbr = held per the QBR calendar, pipeline = open opportunities for the current quarter, else the recorded figure.
  function scorerSample() {
    const rows = jbpRows();
    const open = {};
    OPPS.forEach(o => { if (isOpen(o)) open[o.agency] = (open[o.agency] || 0) + o.value; });
    return AGENCIES.map(a => {
      const hist = {};
      QUARTERS.forEach(q => {
        const rs = rows.filter(r => r.agency === a.id && r.quarter === q);
        if (!rs.length) return;
        const x = EXTRAS[a.id][q];
        const target = rs.reduce((s, r) => s + r.commit, 0);
        const actual = rs.every(r => isNum(r.attain)) ? rs.reduce((s, r) => s + r.attain, 0) : null;
        const qb = QBRS.find(z => z.agency === a.id && z.quarter === q);
        const pipeline = q === "2026-Q3" ? (open[a.id] === undefined ? null : open[a.id]) : x[3];
        hist[q] = [target, actual, x[0], x[1], x[2], !!(qb && qb.held), pipeline, x[4], x[5]];
      });
      return [a.name, a.market, a.group, a.manager, hist];
    });
  }

  // ---------- shared chrome ----------
  const PAGES = [["index.html", "Scorer"], ["jbps.html", "JBPs"], ["pipeline.html", "Pipeline"], ["qbrs.html", "QBRs"], ["method.html", "Method"]];
  function mountChrome(active) {
    const nav = document.getElementById("nav");
    if (nav) {
      nav.className = "top";
      nav.innerHTML = '<a class="brand" href="index.html">Partner Desk</a>' + PAGES.map(([h, t]) => '<a class="tab" href="' + h + '"' + (t === active ? ' aria-current="page"' : "") + ">" + t + "</a>").join("") + '<span class="spacer"></span><span class="tag">Invented data · not affiliated with Careem</span><button class="sec theme" id="themeBtn" type="button" title="Switch light and dark">Theme</button>';
      document.getElementById("themeBtn").onclick = () => {
        const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        const nx = cur === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", nx);
        try { localStorage.setItem("pd-theme", nx); } catch (e) { }
      };
    }
    const f = document.getElementById("foot");
    if (f) f.innerHTML = 'Partner Desk · built as a working proposal · <b>invented data</b> · not affiliated with Careem · Ravi Singhal · <a href="https://www.linkedin.com/in/ravisgl">linkedin.com/in/ravisgl</a>';
    if (!document.getElementById("explain")) { const d = document.createElement("dialog"); d.id = "explain"; d.className = "explain"; document.body.appendChild(d); }
  }
  (function applyTheme() { try { const t = localStorage.getItem("pd-theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) { } })();

  // Every number explains itself: click a .fig and this shows its inputs. rows = [[label, value], ...]
  function explain(title, rows, note) {
    const d = document.getElementById("explain"); if (!d) return;
    d.innerHTML = "<h3>" + esc(title) + "</h3><table>" + rows.map(r => "<tr><td>" + esc(r[0]) + "</td><td class='r'><b>" + esc(r[1]) + "</b></td></tr>").join("") + "</table>" + (note ? "<p class='note'>" + esc(note) + "</p>" : "") + "<div class='btns'><button type='button' class='sec' id='explainClose'>Close</button></div>";
    d.querySelector("#explainClose").onclick = () => d.close();
    d.onclick = e => { if (e.target === d) d.close(); };
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  // figures register their explanation; the page passes a lookup
  function wireFigures(root, lookup) {
    root.addEventListener("click", e => {
      const el = e.target.closest(".fig"); if (!el || !el.dataset.fig) return;
      const x = lookup(el.dataset.fig); if (x) explain(x.title, x.rows, x.note);
    });
  }
  function renderLog(el) { el.innerHTML = S.log.map(esc).join("<br>") || "<span class='note'>no changes yet</span>"; }
  function copyText(btn, text, label) {
    const done = () => { btn.textContent = "Copied"; setTimeout(() => btn.textContent = label, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallback());
    else fallback();
    function fallback() { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e) { } t.remove(); done(); }
  }

  return { TODAY, QUARTERS, NEXT_Q, ALL_Q, MARKETS, GROUPS, AGENCIES, JBP, OPPS, STAGES, OPEN_STAGES, PROB_DEF, QBRS, EVENTS, REASONS, EXTRAS,
    get S() { return S; }, load, save, reset, logIt, isNum, fmt, money, esc, daysBetween, ageOf, agency, prevQ, nextQ, pct,
    jbpRows, jbpFor, rowConfidence, opps, isOpen, weighted, qbrs, qbrStatus, scorerSample, mountChrome, explain, wireFigures, renderLog, copyText };
})();
