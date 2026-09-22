# Pull request previews

Updated September 22, 2026. A code preview is not automatically an isolated data environment.

## Netlify

Project `jocular-stardust-058a50` builds PRs targeting client `main`. Push a topic branch, open a PR and inspect the actual Netlify preview check. Verify the candidate SHA, runtime, build result, graph, search and details before the authorized merge. Main builds publish automatically.

**All contexts currently use https://alumni-graph-api.herokuapp.com/api/v1.** Preview dashboard edits and fetch jobs would affect production. Use the public graph only until a separately configured test API exists; do not sign in to test writes through previews.

Client PR #13 preview deploy `6ab2fbcb18f57b0008c2c83a` built successfully in 41 seconds with Node v22.23.2 and npm 10.9.8. Public graph routing, capitalized labels, case-insensitive search and researcher details passed in Chrome. This is preview evidence, not a production deployment ID.

[Verified preview](https://deploy-preview-13--jocular-stardust-058a50.netlify.app/graph/1).

## Heroku Review Apps: not configured

The GitHub connection alone does not create Review Apps. The API has no pipeline or app.json. Production now runs Heroku-24; Ruby 3.2.1 is available but unsupported. No isolated staging or Review App has been provisioned.

Future setup requires:

1. Stefanie's approval for any additional spending, then a compatible pipeline and reviewed app.json with stack/buildpack and web/worker formation. Prefer manual creation initially to avoid paid resources for every PR.
2. Separate PostgreSQL and Redis, synthetic or explicitly approved sanitized data, and test admin/mail configuration. Never attach production stores or copy production credentials into files.
3. A tested mapping for the API's REDISCLOUD_URL if the chosen service supplies REDIS_URL. Do not weaken TLS checks. SMTP variables are required at boot; prevent test mail reaching real recipients.
4. Actual API build/runtime verification, then a Netlify preview configured for that API. These separate repositories do not pair their preview URLs automatically. A stable staging API is an alternative.
5. Relevant graph/auth/job tests using test data, recorded candidate SHAs, and cleanup of review resources when finished.

The earlier approximately $22/month estimate was for an additional complete staging environment, not a stack upgrade. It was an estimate, not an approved budget or current quote. Recheck pricing and compatibility before any provisioning. Existing production resources were retained during the stack upgrade.

See [RELEASE.md](RELEASE.md) for release and rollback steps.
