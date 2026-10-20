# Edit Fouria through a browser

Repository: https://github.com/evaluasibisnis44/FOURIAAGENCY
Live site: https://fouria-agency-hub.sillyloach5.chatgpt.site/

## Open a coding task

Use Codex on the web with GitHub connected to an account that can access this repository. Select this repository in a cloud environment, prepare its dependencies, and start a coding task. Availability and menu labels depend on the account. Ordinary ChatGPT GitHub search access alone does not publish code changes.

Example request:

> Edit evaluasibisnis44/FOURIAAGENCY. [Describe the desired change.] Preserve the existing Fouria site URL, .openai/hosting.json project ID, D1 database, R2 attachments and private access policy. Run relevant checks. Commit the result to GitHub. If an authorized Sites connection is available, publish it to the existing site; otherwise report the GitHub commit and the remaining publishing step.

## Development and verification

Requires Node.js >=22.13.0. Install with `npm ci` (or `npm run install:ci` for the bundled CI installer). Start the local app with `npm run dev`. Local preview uses local database state; configure local migrations before API tests. See the Sites skill for environment-specific setup and build helpers.

Core checks from the repository root:

```sh
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types tests/math.mjs
node --experimental-strip-types tests/invoice.mjs
node --experimental-strip-types tests/content.mjs
node --experimental-strip-types tests/tasks.mjs
node tests/signature.mjs
npm run build
```

`tests/integration.mjs`, `tests/content-api.mjs` and `tests/tasks-api.mjs` require the local development server on 127.0.0.1:5173 and create/remove disposable local test records. Do not point them at production.

## Publish changes to the current site

A GitHub commit does not automatically deploy the existing Sites-hosted dashboard. Use an owner/editor Sites connection and the Sites skill to import/reconcile the desired GitHub changes with the latest canonical Sites source, build, save and deploy to the existing project. Preserve the existing project_id in .openai/hosting.json and current access audience. Keep D1 binding DB and R2 binding BUCKET. Do not create a replacement site or reset storage to apply UI changes.

The repository contains application source and the initial reference fixtures. Live records and private user uploads are in Sites D1/R2 and are not backed up by this source repository. Do not upload .env files, credentials, .wrangler state, node_modules or build outputs to GitHub.

Official cloud setup guide: https://learn.chatgpt.com/docs/cloud
