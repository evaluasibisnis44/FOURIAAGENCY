# Fouria Agency Hub

Internal Sites dashboard with shared D1 records and private R2 attachments.

## Features

- Clients, monthly budgets/SOW, planned and paid costs, actual payments, content and production progress, follow-up dates.
- Projection: client budget minus planned costs. Positive projection splits 50% company, 25% Sheren, 25% Jessen. Negative profit has zero allocations.
- Cash: payments actually received minus expenses actually paid; kept separate from projection.
- Payment statuses are derived from receipts. Multi-month receipts are allocated to each monthly period.
- Reports and CSV export. Stored quotation/invoice editor, branded print/Save as PDF. Invoice signatures have editable name/title without an approval column; quotations retain their approval column.
- Private PDF/image attachments up to 10 MB per file. Concurrent changes are rejected using record versions.
- All authenticated Site visitors share the same agency dataset. Site access policy restricts membership. Do not publish publicly without adding explicit server-side membership authorization.

## Initial data

Batavia Whisky November 2026–January 2027 at Rp17m/month; Minuman Mureh October 2026 provisionally at Rp5m. Payment receipts are zero until recorded. Batavia November planned costs Rp7.9m are transcribed from the user reference, not actual paid costs. The project period and due dates are editable.

## Development

Use Sites skill helpers for install, build, source packaging and deployment. Apply local generated D1 migrations to `.wrangler/state` before preview. Hosted storage is independent from local test storage.

Checks:
- `node node_modules/typescript/bin/tsc --noEmit`
- `node --experimental-strip-types tests/math.mjs`
- `node tests/integration.mjs` (loopback dev server only, creates and removes local QA records)

Follow-up reminders appear when opening the dashboard; no external notifications or money transfers are performed.

## Invoice update (20 October 2026)

Editable document recipient and multiline address; printed below recipient. Invoice can copy a saved quotation (or the known initial reference quotation) for the selected month, defaulting to the client's first period. Explicitly month-tagged lines are filtered. A single aggregate contract line matching the entire contract uses the selected month's stored budget. Other unallocated quotations are copied without silently inventing allocations, with a review notice.

Reusable agency bank records include bank name, account number, and beneficiary. Selected accounts are copied into document payloads so changes to the bank library cannot alter past invoices. Existing documents remain readable. No database migration is needed because record payloads are JSON.

Validated: TypeScript, invoice logic/schema checks, local API integration including bank snapshots, and UI save/preview with test recipient/address/account. Production publishing uses the existing Sites owner/editor account. The latest implementation is live; preserve the same project identity and deployment audience.

## Content workspace update

Per-client Konten now includes calendar, content plan, and performance report views. Calendar distinguishes Instagram Reels/Feed and TikTok Reels/Feed by color with type and platform labels; posting dates and times use WIB. Each item can store a brief, caption/CTA, pillar, Canva/video/Drive/published links and manual metrics. Existing records default to Instagram; calendar falls back to the legacy due date.

Performance includes views, reach, impressions, likes, comments, shares, saves, attributed followers, measurement date and analysis. Blank metrics remain unknown rather than zero. Monthly account reports track followers start/end, net growth, summary, lessons and next actions per platform. Content reach is summed and explicitly is not monthly unique reach. Engagement rate includes only records with positive reach and all four interaction fields supplied. CSV and printable report outputs use the current client and filters.

Storage remains in existing records JSON; no D1/R2 migration or replacement is required. This release does not fetch platform statistics, auto-publish social posts, or run unattended platform sync.

## Tasks and invoice signature

Invoices omit the approval column and support editable issuer name and title; quotation approval remains unchanged. New invoices start with an empty issuer name. Existing invoices retain their stored name and can be edited to add a role/title.

Per-client to-do records include planned work day, deadline, PIC Sheren/Jessen/both, category, status, notes and attachments. The Home queue combines open to-do records with production deadlines for unapproved content and publication deadlines for unpublished scheduled content. Completed/cancelled tasks and published content leave the open queue. Global and per-client task views support PIC and date filtering; Home includes all budget periods so overdue work cannot be hidden by the finance-month selector.

Checks include task lifecycle API persistence, optimistic conflicts, deadline state and filters, actual rendered invoice/quotation signatures, and local UI confirmation of new task save and content-plan deadlines on Home. No schema migration, storage replacement, or production sample seeding is used.

Invoice tax: select optional `PPh 23 2% · gross-up` per invoice. Line items are the agreed net fee; rounded gross = net / 0.98, withholding = rounded 2% of gross, and the invoice presents subtotal, PPh 23 borne by the client, and a final gross total including PPh 23. Withholding and net transfer rows are not displayed. Legacy documents default to no tax; quotations do not apply invoice tax. No PPN is calculated. Apply only when the transaction is subject to 2% PPh 23. Calculation and schema checks are in `tests/invoice.mjs`. Home reminders now sit directly below the financial metrics and combine open tasks and content deadlines across budget periods, oldest deadline first.

Invoice display: `showSubtotal` defaults to true for existing invoices. Turn off “Tampilkan rincian subtotal & pajak” to show only the final gross amount, without subtotal/tax rows, title or calculation note. The selected tax calculation and quotation presentation remain unchanged.

Urgent reminders: Home and To-do & deadline show one earliest unfinished deadline per client, ordered by deadline across clients (overdue, today, upcoming). Includes client, PIC, work phase and open deadline count; cards open the record editor. Filters apply to the highlights. Global To-do has a client filter. Completed/cancelled tasks and published content do not appear as urgent work. Grouping/ranking/count behavior is covered by `tests/tasks.mjs`.

## Browser editing

See [BROWSER_EDITING.md](BROWSER_EDITING.md) for repository setup, verification and publishing changes to the existing Fouria site. This GitHub copy includes the app changes deployed from Sites source commit `299d17ad4ee1bad41a183a38d400820f5ed7646d` on 20 October 2026. Production database records and uploaded attachments remain in Sites storage; this repository does not contain an export of those records or uploads.
