# Collaboration Map: development, staging, and production

Status: September 22, 2026. This records inspected settings and the proposed release workflow. Hosted staging has NOT been provisioned or validated. Nothing was pushed or deployed during this work.

## Current environments

| Environment | Client | API and data | Status |
| --- | --- | --- | --- |
| Local development | localhost:3001 | localhost:3000; local PostgreSQL and Redis | Validated locally |
| Hosted staging | Not configured | No staging API found in inspected Heroku personal account | Required before release |
| Production | Netlify jocular-stardust-058a50 | Heroku alumni-graph-api | Existing live services |

Inspected Netlify project: https://app.netlify.com/projects/jocular-stardust-058a50/deploys
- Repository: NewVisionResearch/alumni_graph_client. Production branch: main.
- Auto publishing is ON: a main deployment publishes automatically. Treat merging to main as a production action.
- Branch deploys: only production branch. PR Deploy Previews: enabled for production/branch-deploy targets.
- Build command: npm run build; publish directory: build; build image: Ubuntu Noble 24.04.
- Dashboard Node setting: 18.x. Local .nvmrc now pins tested Node v22.23.2. Confirm the actual selected version in a preview build before release; do not assume the dashboard and repository agree.
- Published production commit shown: 6e92fbc (June 6, 2024).

Inspected Heroku app: https://dashboard.heroku.com/apps/alumni-graph-api/deploy
- Repository: NewVisionResearch/alumni_graph_api. Manual branch selector: main; automatic deploys disabled.
- No pipeline attached. Web and publicationsworker processes were running.
- Production uses Heroku-20. Dashboard reports end-of-life and that new builds are no longer supported. Stack/runtime compatibility must be handled as a separate maintenance change and proven on staging first.
- Visible personal apps: alumni-graph-api and a Node.js app pure-scrubland-14809. The latter is not an API staging environment.
- Browser login works; CLI authentication was absent on this Mac.

## Commit and branch workflow

1. Inspect git status, staged diff, and unstaged diff in BOTH repositories. Exclude .env, database dumps, credentials, generated builds, node_modules, and .DS_Store.
2. Use focused commits: docs for instructions, chore for runtime/platform maintenance, fix for bugs, feat for features. Review exact staged paths; avoid git add . for mixed work.
3. Finish and review the existing docs/update-setup-instructions branches first. The client fix/graph-name-capitalization branch is based on its setup branch. Review its difference against that branch until setup merges; afterward update its base to main and retest.
4. Once the baseline has merged, start future branches from freshly fetched main. Use short-lived fix/<issue>, chore/<maintenance>, or feat/<feature> branches. Do not combine runtime upgrades with a visual bug fix.
5. Push only the intended feature branch after checking hosting triggers and preview API isolation. Open a PR with problem, behavior, tests, environment URLs, deployment dependencies, and rollback plan. Never push directly to production main as a shortcut.
6. Prefer a PR merge method that preserves the focused commits. Recheck the final diff and commit authors before pushing; do not rewrite shared history without coordination.

The parent NewVisionResearch folder is not a Git repository; make changes and commits in the two repositories independently. Record BOTH SHAs for a coordinated release; a client-only change does not require an API deployment.

## Establish isolated staging (pending)

1. Choose and approve a Heroku staging app name, supported stack/runtime combination, and cost for web/worker, PostgreSQL, and Redis. Use a separate app in a staging-to-production pipeline compatible with the production app generation. Do not change production's stack as an exploratory step.
2. Provision separate staging PostgreSQL and Redis. Never attach production data stores or reuse their connection URLs. Configure staging-only secrets and mail delivery/test recipients privately. Use synthetic or explicitly approved sanitized data, with representative shared publications.
3. Use Rails production mode on the hosted staging app with its own configuration. Do not copy the local DATABASE_URL=localhost convention into Heroku: that convention is only the development database-name configuration.
4. Verify the database and Redis destinations, web process, worker queue, API routes, authentication, CORS, and job-event stream. Check migration requirements and arrange backups before changing a populated database. Workers must consume only staging queues.
5. Enable a Netlify staging branch deploy, plus PR previews, after the isolated API exists. Set REACT_APP_BASE_URL by context: staging/preview -> staging API /api/v1; production -> production API /api/v1. REACT_APP_* values are public build-time configuration, not secret storage. Verify the destination from the actual browser request on each deployed build.
6. Keep a staging branch as the selected release candidate; advance it to reviewed candidate commits without accumulating unrelated changes. For API changes deploy that exact candidate SHA to staging. Record any merge commit and retest when content changes.
7. Validate the Node pin in Netlify, deep-link routing (/graph/1), graph data, login, case-insensitive search, researcher details, and relevant dashboard actions. Exercise writes only with staging test records. Test fetch jobs deliberately: fetch can remove researcher-publication links.

## Release procedure (after staging is ready)

1. Record client/API SHAs, dependency/runtime versions, staging checks, and current production Netlify deploy ID / Heroku release version. Identify the person approving release and the release window.
2. Check the exact final PR diff and deployment trigger. Confirm environment separation and no pending unrelated staging changes. For an API/schema change, record database backup and migration/rollback compatibility.
3. Obtain release approval against these concrete artifacts before publishing. With current Netlify settings, approval must precede the merge into main.
4. For a client-only change, merge the approved client PR to main and monitor Netlify's production build. The bundle must be built with the production API URL: do not publish a staging bundle whose API URL is baked into JavaScript.
5. For API changes, after establishing the pipeline and resolving stack compatibility, promote the tested staging build artifact to the explicit production target. Config and data remain environment-specific; review any release-phase commands. Do not assume promoting code migrates or restores a database.
6. If both change, release a backward-compatible API first, check it, then release the client. Otherwise define an explicit compatibility/maintenance-window plan before release.
7. Verify production graph rendering, name search, researcher details, deep links, and error monitoring. Avoid creating/deleting real records merely for a smoke check. Record URLs, SHAs, deploy/release IDs, date, outcome, and approver in the Developer MOP.

## Rollback

Client: republish the recorded previous production Netlify deploy; ensure automatic publishing cannot immediately supersede the rollback. Then revert the offending source commit through a PR so Git matches the intended deployed state.

API: use the recorded prior Heroku release only after checking schema/config compatibility. A code rollback does not undo database mutations, fetch jobs, or migrations. Data recovery is a separate reviewed procedure. Never restore a local dump into production as a rollback shortcut.

## First change: graph name capitalization

Client branch: fix/graph-name-capitalization. Canvas labels and graph search results use a presentation formatter. For example, joseph m. castellano displays as Joseph M. Castellano. Node IDs, edge construction, stored names, and API contracts stay unchanged. No migration or API deployment is needed for this fix.

The formatter capitalizes lowercase name parts, including initials, hyphens, apostrophes, and accented letters; already-capitalized parts are preserved. It cannot recover a person's preferred internal capitalization from a fully lowercased record (for example mcdonald). Name preservation/editing is a separate potential improvement.

Validation: six focused formatting tests passed; npm run build compiled successfully on Node v22.23.2/npm 10.9.8. Local Chrome showed title-cased graph labels and case-insensitive search returning Joseph M. Castellano. Hosted preview and production checks remain pending.

## References

- Netlify deploy contexts: https://docs.netlify.com/deploy/deploy-overview/
- Netlify environment configuration: https://docs.netlify.com/build/environment-variables/overview/
- Heroku pipelines and promotion: https://devcenter.heroku.com/articles/pipelines
- Heroku releases: https://devcenter.heroku.com/articles/releases

## Pull request previews

See [PREVIEWS.md](PREVIEWS.md) for the verified Netlify preview settings, the temporary public-graph-only review procedure, and Heroku Review App prerequisites and cost proposal.
