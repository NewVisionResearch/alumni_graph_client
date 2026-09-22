# Collaboration Map release workflow

Updated September 22, 2026. The API and client are separate repositories. Their parent directory is a local convenience, not a repository.

## Current environments

| Environment | Client | API and data | Status |
| --- | --- | --- | --- |
| Local | localhost:3001 | localhost:3000; local PostgreSQL and Redis | Validated |
| PR preview | Netlify Deploy Preview | Currently the production API | Public, read-only review only |
| Isolated staging | Not provisioned | No staging API/database/Redis | Requires Stefanie's approval for additional spending |
| Production | Netlify jocular-stardust-058a50 | Heroku alumni-graph-api | Existing hosting resources |

### Client

GitHub repository: NewVisionResearch/alumni_graph_client. Netlify builds `npm run build`, publishes `build/`, and automatically publishes successful builds of `main`. Merging main is a production action. PR Deploy Previews are enabled; general branch deploys are not.

The repository pins Node v22.23.2 in `.nvmrc`; npm 10.9.8 and react-scripts 5.0.1 were tested. Netlify preview 6ab2fbcb18f57b0008c2c83a confirmed those Node/npm versions despite an older dashboard Node setting. Verify the actual build log whenever changing runtime settings.

Client PR #13 contains the setup baseline and graph-name capitalization in separate commits. Graph labels and search results use normal capitalization; identifiers, edges and saved names remain unchanged. See the client README for release verification.

### API

GitHub repository: NewVisionResearch/alumni_graph_api. Heroku automatic deploys remain disabled; manually deploy the reviewed `main` revision. Production release **v165**, source **423722a5**, runs on **Heroku-24** with Ruby 3.2.1, Rails 7.0.5 and Bundler 2.4.14. Documentation-only commits after that source revision do not require an API redeploy.

The release removes two PubMed URL log statements containing API keys. Two offline tests with 22 assertions passed. Web and publicationsworker were up; the public graph returned HTTP 200 with 1,103 records and exactly matched the pre-deploy response. No production data edits, mail sends, migrations, or fetch jobs were used for verification. Login and job execution were not retested during this release.

Heroku-20 blocked builds. The Windows-only lockfile needed Linux platform variants; gem versions were preserved. Heroku-26 then failed compiling native dependencies with the existing Ruby headers, so the successful release uses supported Heroku-24. Ruby 3.2.1 is still available but unsupported; runtime modernization is separate work.

The existing Basic web and worker, PostgreSQL Essential-1 and free Redis Cloud 30 remain. No pipeline, staging app, or additional paid service was provisioned. Full API evidence: [deployment record](https://github.com/NewVisionResearch/alumni_graph_api/blob/main/docs/heroku-stack-upgrade.md).

## From change to release

1. Fetch main and inspect staged/unstaged changes in the affected repository. Preserve unrelated work. Exclude credentials, dumps, generated builds, node_modules and Finder metadata.
2. Create a short-lived `fix/`, `chore/`, `feat/` or `docs/` branch from current main. Make focused commits; review exact staged paths and author identity. Avoid rewriting shared history.
3. Run checks appropriate to the change. Client: pinned Node, focused tests, production build and public preview checks. API: frozen dependency check, focused offline tests and local production-mode checks with explicitly local data services. Never run a database-resetting suite against a restored development or production database.
4. Push the branch and open a PR with behavior, tests, deployment dependencies and rollback plan. Preserve focused commits when merging. Verify the final diff and candidate SHA.
5. Check deployment authorization. Existing user authorization applies; do not request the same approval again. Until isolated staging exists, use only the explicitly authorized local/preview/production workflow and record its limitations. Do not create paid resources without Stefanie's approval.
6. Record current production deploy/release IDs and required data backups. Client: merge the approved PR into main, then monitor Netlify's production build. It must use the production API URL. API: merge the approved PR, manually deploy main on the existing Heroku app, and verify the deployed SHA and release. A failed build leaves the old release running.
7. If both change, deploy a backward-compatible API first. Verify graph, name search, details and deep links; inspect web/worker health for API changes. Do not edit real records as a smoke test. Record date, SHAs, release/deploy IDs, results and limitations in the MOP and release record.
8. Sync local main. Delete only task branches already merged, or whose changes are proven preserved; prune remote references. Preserve unrelated branches and local credentials/data.

## Future isolated staging

Provisioning is pending budget approval from Stefanie. Use separate PostgreSQL, Redis, secrets and test mail recipients; synthetic or approved sanitized data; and a compatible Heroku staging/pipeline configuration. Rails can run in production mode with staging-only configuration. The development `DATABASE_URL=localhost` convention must not be copied into hosted configuration.

Point Netlify preview/staging contexts at the isolated API and rebuild. Verify actual request destinations. API and client previews are not paired automatically. Test writes and publication refreshes only with test records: a fetch can remove researcher-publication relationships. See [PREVIEWS.md](PREVIEWS.md).

## Rollback

Client: republish the recorded previous production Netlify deploy and ensure automatic publishing cannot immediately supersede it; revert the offending source change through a PR.

API: use an available prior Heroku release only after checking current database/schema/config compatibility. Do not blindly select a release before the May 2025 database replacement. Historical artifact retention can limit rollback availability. A code rollback does not undo data edits, migrations or fetch jobs; data recovery requires its own reviewed procedure.

## References

- [Netlify deployment contexts](https://docs.netlify.com/deploy/deploy-overview/)
- [Heroku stack upgrades](https://devcenter.heroku.com/articles/upgrading-to-the-latest-stack)
- [Heroku releases](https://devcenter.heroku.com/articles/releases)

Client verification on September 22, 2026: the full current suite passed (2 suites, 10 tests: 6 name-formatting cases and 4 routing checks). The obsolete Learn React placeholder was replaced with routing checks that isolate canvas/network behavior. The production build passed. React Router emitted future-version notices; no runtime migration was made.
