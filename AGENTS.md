# Collaboration Map client: agent instructions

Read [README.md](README.md) for setup commands. This file is self-contained for an independent clone. Cross-repository guidance lives in the Developer (Ivan) MOP page; the API and client are separate repositories. Preserve existing Git changes, including staged work. Do not commit, push, deploy, or change production without explicit authorization; documentation/setup work does not authorize application refactoring.

Technical MOP: [Developer (Ivan)](https://netorgft17892607.sharepoint.com/sites/newvisionresearch.org/Shared%20Documents/New%20Vision%20Research/Manual%20of%20Operations/NVR%20Manual%20of%20Operations?wd=target%28Website.one%7C155e7dce-2a56-4206-8c2e-683e612ee05a%2FDeveloper%20%28Ivan%5C%29%7Cf157c0cc-9510-49cc-84b6-3a365751a7d5%2F%29).

## Runtime and local setup

- Tested: nvm 0.40.8, Node v22.23.2 (.nvmrc), npm 10.9.8; react-scripts is locked to 5.0.1. `.nvmrc` does not independently pin npm.
- Run `nvm use`, verify versions, and use `npm ci` with the lockfile intact. Node 18 is not required by the validation. The earlier SemVer error under Node 26 was observed, not isolated to a proven cause.
- Client environment: REACT_APP_BASE_URL=http://localhost:3000/api/v1. Start with `HOST=localhost PORT=3001 npm start`. Rails occupies 3000.
- REACT_APP_* variables are public browser configuration: never place API credentials, database passwords, tokens, or Redis secrets in them. Restart after environment changes.
- Do not delete package-lock.json, use npm audit fix --force, eject, or upgrade dependencies as a routine recovery shortcut.

## Code navigation

| Concern | Start here |
| --- | --- |
| API calls / job EventSource | src/services/api.js |
| Login state | src/Context/AdminContext/ |
| Dashboard | src/Features/Dashboard/DashboardController.js |
| Researcher query edit / refresh / job events | src/Features/Dashboard/AlumnShow/AlumnShowController.js |
| Researcher detail controls | src/Features/Dashboard/AlumnShow/AlumnShowContainer.js |
| Adding researchers | src/Features/Dashboard/AddAlumns/AddAlumnsController.js |
| Graph data -> nodes/edges | src/Features/Graph/GraphController.js |
| Graph display and explanation | src/Features/Graph/GraphContainer.js; src/Features/Graph/Legend/Legend.js |

## Functional rules

The dashboard lists researchers for the logged-in admin's lab; confirm the intended lab/account before editing. Use the existing signed-in browser when appropriate, without reading token stores. Let the user enter their password directly. Avoid interfering with a tab the user is actively editing; use a separate task tab when needed.

Save and Fetch New Publications are separate operations. Saving only changes the query; fetching runs a server job and can REMOVE researcher-publication relationships that no longer match. Coordinate with the API's local Redis worker, preserve a local backup, and verify the saved query, job completion, publication count, and returned list. Query success is not proof that every returned paper belongs to the researcher.

Graph data comes from displayed shared-publication relationships within a lab, not all PubMed authors or all publications. The API excludes publications associated with fewer than two distinct researchers in that lab. GraphController forms pairs and counts shared papers; node sizing reflects unique collaborators. Display names are currently used as node keys. An empty graph or publications.forEach error requires checking API responses and database state, not just reinstalling frontend packages.

## Verification and documentation

`npm run build` passed September 22, 2026 on the pinned runtime; it builds locally and does not deploy. For UI changes, test the affected interaction and run the production build when relevant. Six graph-name formatting tests passed after recovery. State the tested scope; this is not comprehensive UI coverage.

Also verified: npm ci, fresh-terminal nvm selection, graph loading, lab 1 login, saving Castellano's supplied query, and completed publication refreshes (1/1 and 30/30). The 30-publication refresh reduced Castellano's list from 32 to 30. Creation/deletion, display-checkbox changes, broader browser/error-state coverage, mail and broader workflows remain unvalidated. Deployment evidence is recorded separately below. Keep technical details in README/developer MOP; the parent Collaboration Map MOP is for nontechnical staff.

## Releases and cleanup

Read RELEASE.md and PREVIEWS.md before release work. Netlify main automatically publishes; Heroku main requires a manual deploy. User authorization persists across turns. Do not provision anything that increases spending without Stefanie's approval. Previews currently call the production API and are suitable only for public read-only checks.

API production is Heroku-24, release v165 / 423722a5, with healthy web/worker and verified graph response. Ruby 3.2.1 remains unsupported; keep runtime changes separate from unrelated fixes. The logging regression has 2 tests / 22 assertions; no production fetch job or login was retested during that release. The API deployment record explains the Linux lockfile prerequisite and failed Heroku-26 compilation.

Use fresh main for new branches and focused commits. Remove only merged task branches or proven equivalent branches; preserve unrelated branches and local data. Do not commit credentials, dumps or generated build output.

Graph presentation lives in src/services/formatGraphName.js and its tests; GraphController and SearchBar use it for labels only. Never change node IDs or saved names to implement display capitalization.

Client verification on September 22, 2026: the full current suite passed (2 suites, 10 tests: 6 name-formatting cases and 4 routing checks). The obsolete Learn React placeholder was replaced with routing checks that isolate canvas/network behavior. The production build passed. React Router emitted future-version notices; no runtime migration was made.
