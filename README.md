# Partner Desk

Built as a working proposal. Invented data. Not affiliated with Careem.

Live: https://sravinp2026.github.io/partner-performance-scorer/

The operating layer for an ads platform's agency channel: every holding group, agency and market with its joint business plan, its pipeline, its attainment, its adoption and its agreed actions, with the QBR pack written from the numbers. It extends the Partner Performance Scorer, which remains the landing page.

## Pages

| File | What it does |
|---|---|
| `index.html` | **Scorer.** Scores each agency 0–100 from five signals, explains every score, flags thin or stale data, tracks actions. Editable cells, weights and rules; CSV import/export; narrative prompt. |
| `jbps.html` | **JBPs.** Commitment vs attainment per agency, quarter and market; holding-group and market roll-ups; variance with reason codes picked by the partner manager; "JBP attainment" headline. |
| `pipeline.html` | **Pipeline.** Opportunities with stage filters; coverage = open pipeline next quarter ÷ next-quarter JBP commitment, by agency and market; stale deals flagged; weighted value with editable stage probabilities. |
| `qbrs.html` | **QBRs.** Calendar per agency (held, due, overdue, scheduled); printable QBR pack generated from the record; copy-LLM-prompt; roadshow and enablement log with adoption outcomes. |
| `method.html` | **Method.** The proposal in plain language, the design rules, what it is not, about the author. |
| `styles.css` | One stylesheet for all pages (light and dark, print rules for the QBR pack). |
| `data.js` | One invented dataset and the shared helpers. The scorer's target and actual per agency are the sums of the JBP rows by market, its QBR flag reads the QBR calendar, and its current-quarter pipeline is the sum of the agency's open deals, so the pages cannot disagree. |

## Rules carried across every page

- Never show 0 for an unknown figure: blank plus a flag.
- Stale as-of dates flagged; source (CRM or manual) shown; confidence badge per row.
- Every number explains itself: click a figure to see its inputs.
- Actions have owners and done checkboxes; every change is logged.
- Weights, thresholds and stage probabilities are editable on the page.
- A language model is used only for the narrative, via a prompt built from the facts on the page. Nothing is sent anywhere by the site.

## Running

Static files, no build step, no backend. Open `index.html`, or serve the folder:

    python3 -m http.server 8960 --bind 127.0.0.1

Chart.js is loaded from cdnjs with an integrity hash. Edits are kept in the browser's localStorage (`pps3` for the scorer, `pd1` for the other pages); "Reset sample" restores the invented data.

## Dataset

Invented: 3 markets (UAE, KSA, Egypt), 6 holding groups (Group 1–6), 9 agencies (Agency A–I), quarters 2025-Q4 to 2026-Q3 plus 2026-Q4 commitments, JBP rows per agency, year and market, 44 opportunities, a QBR calendar and 10 roadshow or enablement sessions. Advertisers are "Advertiser A…". No real company's figures appear anywhere.

Ravi Singhal · linkedin.com/in/ravisgl
