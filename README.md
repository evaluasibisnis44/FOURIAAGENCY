# Fouria Agency Hub

Internal Sites dashboard with shared D1 records and private R2 attachments.

## Features

- Clients, monthly budgets/SOW, planned and paid costs, actual payments, content and production progress, follow-up dates.
- Projection: client budget minus planned costs. Positive projection splits 50% company, 25% Sheren, 25% Jessen. Negative profit has zero allocations.
- Cash: payments actually received minus expenses actually paid; kept separate from projection.
- Payment statuses are derived from receipts. Multi-month receipts are allocated to each monthly period.
- Reports and CSV export. Stored quotation/invoice editor, branded print/Save as PDF, blank approval field.
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

Validated: TypeScript, invoice logic/schema checks, local API integration including bank snapshots, and UI save/preview with test recipient/address/account. Production deployment requires reconnecting Sites to the original Fouria site's owner/editor account; the currently connected account returns project_not_found for the existing ID. Keep the same project identity and deployment audience.
