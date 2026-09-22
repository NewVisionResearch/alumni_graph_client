# Pull request previews

Verified September 22, 2026. A pull request preview lets a reviewer see proposed code before main is merged. It is not automatically an isolated data environment.

## Netlify: already enabled

Project: jocular-stardust-058a50, connected to NewVisionResearch/alumni_graph_client.

1. Commit and test on a topic branch. Push that branch to GitHub; never push main for a preview.
2. Open a pull request targeting main. Netlify is configured to build PR previews for this target. Keep the PR unmerged while reviewing.
3. Open the actual preview link from the Netlify check/deployment on the PR. Confirm the branch, commit SHA, build status, Node version, and API destination. Do not infer success from a URL pattern.
4. Review the graph labels, case-insensitive search, and researcher details. The capitalization branch depends on the setup commits; review setup separately before the final fix release. If a PR is based on the setup branch instead of main, the existing Netlify target settings may not create a preview.
5. After review and release approval, merging main triggers a separate production build and automatic publication. The preview itself does not replace the production website.

Current REACT_APP_BASE_URL is the SAME in all contexts: https://alumni-graph-api.herokuapp.com/api/v1. Therefore a preview presently reads production data and could write production data if someone signs in and edits through it. For the current visual-only check, use the public graph without signing in or performing dashboard actions. Do not describe this preview as isolated staging or use it to test researcher creation, editing, deletion, or fetch jobs.

Before full workflow testing, point the Deploy Previews context to an isolated test API and rebuild. Production must retain its production endpoint. A Netlify preview alone does not create a Rails API, database, or worker.

## Heroku: Review Apps require configuration

The connected GitHub repository alone does not enable Review Apps. Production alumni-graph-api currently has no pipeline and the repository has no app.json.

Required setup:
1. Create a compatible Heroku pipeline and connect NewVisionResearch/alumni_graph_api. Start with manual Review App creation to avoid provisioning a paid app for every PR.
2. Add and review an app.json on a dedicated infrastructure branch. Define the stack/buildpack, web and worker formation, separate data add-ons, generated app secret, and required non-production environment variables. Do not copy production credentials into this file or pipeline settings.
3. Resolve runtime compatibility independently. Production Heroku-20 cannot rebuild. Current Heroku documentation lists Ruby 3.2.1 as available but deprecated on newer stacks; availability is not support. Choose and test a supported stack/Ruby combination before relying on Review Apps. Keep runtime and preview-infrastructure changes in separate commits.
4. Provide isolated PostgreSQL and Redis, synthetic graph data, and a test administrator with a privately generated password. db/seeds.rb currently has no usable sample dataset. Never seed review apps from the production dump without explicit data review.
5. Ensure mail cannot reach real recipients. Production configuration currently requires SMTP variables at boot. The app reads REDISCLOUD_URL; Heroku Key-Value Store normally supplies REDIS_URL, so plan and test the mapping instead of assuming it works. Verify TLS/client compatibility for the chosen Redis service without disabling certificate verification as a shortcut.
6. Create a review app for the API PR, inspect its actual URL/build, and point the matching Netlify preview to it. These are separate repositories, so their preview URLs are not paired automatically. A stable staging API is an alternative that avoids per-PR URL coordination.
7. Verify graph/auth/job behavior using test data, then record candidate SHAs and test results. Follow RELEASE.md for the approved production release. Remove review resources when finished; do not assume manually created Review Apps automatically disappear when the PR closes.

### Cost proposal — not provisioned or authorized

Current published Cedar pricing suggests a small full API environment with Basic web ($7/month), Basic worker ($7/month), PostgreSQL Essential-0 ($5/month), and Key-Value Store Mini ($3/month): approximately $22/month if kept running, before taxes or extra usage/services. An initial web-only formation would be approximately $15/month but cannot exercise background jobs. Plan availability, compatibility, and review-app add-on overrides must be verified at provisioning; do not treat this estimate as a billing cap.

A new paid staging/review environment needs an approved budget before resources are provisioned. No paid services, pipeline, or review app were created during this inspection.

## Progress

- Client fix/graph-name-capitalization: local commit 6ea7a41, six focused tests passed, production build passed, local Chrome checks passed.
- GitHub push attempted: HTTPS credentials unavailable in this terminal. SSH also lacked a verified host/authentication setup. No host-verification bypass was attempted.
- Pending: authenticate Git and push the topic branch; open the PR; inspect the actual Netlify deployment; update this record with the PR and preview URLs and results.

## Official references

- https://docs.netlify.com/deploy/deploy-types/deploy-previews/
- https://devcenter.heroku.com/articles/github-integration-review-apps
- https://devcenter.heroku.com/articles/ruby-support-reference
- https://www.heroku.com/pricing/
