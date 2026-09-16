# Collaboration Map client

React front end for the New Vision Research Collaboration Map. It renders alumni, publications, and collaboration relationships supplied by the companion Rails API in `alumni_graph_api`.

## Local architecture

| Service | Local address | Purpose |
| --- | --- | --- |
| React client | `http://localhost:3001` | Browser UI and collaboration graph |
| Rails API | `http://localhost:3000` | Authentication and JSON API |
| PostgreSQL | `localhost:5432` | Data store used by the Rails API |

The client does not connect to PostgreSQL directly. In local development it calls the Rails API under `http://localhost:3000/api/v1`.

## Requirements

- Node.js 18 (use `nvm`)
- npm and the committed `package-lock.json`
- The API repository and its PostgreSQL database when using data-backed pages

This project uses Create React App through `react-scripts` 5.0.1. Use Node 18 for the legacy toolchain. Node 26 has produced this startup failure:

```text
TypeError: SemVer is not a constructor
```

Do not try to solve that mismatch by deleting `package-lock.json`, running `npm audit fix --force`, or upgrading `react-scripts` as part of routine setup.

## Environment

Create or retain a local `.env` file with this variable:

```dotenv
REACT_APP_BASE_URL=http://localhost:3000/api/v1
```

Only the variable name and safe local example are documented here. Do not commit `.env` files or secrets.

## Install and run

```bash
nvm install 18
nvm use 18
node --version
npm ci
PORT=3001 npm start
```

Open `http://localhost:3001`. The development server reloads when source files change.

For a clean dependency rebuild, keep the committed lockfile and rebuild only the installed modules:

```bash
rm -rf node_modules
npm ci
```

## Recommended startup order

1. Start PostgreSQL 17 on port 5432.
2. Start the Rails API on port 3000.
3. Start this client on port 3001.
4. Start Redis and the Sidekiq worker only when background publication work is needed.

See the API repository README for PostgreSQL, database restore, Rails, Redis, and Sidekiq setup.

## Scripts

```bash
npm start       # development server (set PORT=3001 locally)
npm test        # interactive test runner
npm run build   # production build in build/
```

`npm run eject` is irreversible and is not part of normal development.

## Troubleshooting

### `SemVer is not a constructor`

Confirm that the active runtime is Node 18, then reinstall from the lockfile:

```bash
nvm use 18
node --version
rm -rf node_modules
npm ci
```

### The UI loads but API requests fail

- Confirm `REACT_APP_BASE_URL` is `http://localhost:3000/api/v1`.
- Confirm Rails is listening on port 3000.
- Restart the React development server after changing `.env`.
- Inspect the browser Network panel and the Rails terminal together.

### `publications.forEach is not a function`

The graph code expects publications to be an array. During environment recovery this error occurred when the API/database path was unhealthy and the client received a non-array error response. Check Rails and PostgreSQL before changing the graph code.

### Login returns `401 Unauthorized`

That response means the client reached the login endpoint. Confirm that the local database was restored and contains the expected user data; an empty schema will not recognize production-era accounts.

## Security

- Never commit `.env`, credentials, tokens, database dumps, or production data.
- Keep the client pointed at the local API during development.
- Treat browser-visible `REACT_APP_*` values as public configuration; never place secrets in them.
- Do not publish local changes, dependency updates, or database artifacts without an explicit review.
