# Collaboration Map client

React front end for the New Vision Research Collaboration Map. It renders alumni, publications, and collaboration relationships supplied by the companion Rails API in `alumni_graph_api`.

## Local architecture

| Service | Local address | Purpose |
| --- | --- | --- |
| React client | `http://localhost:3001` | Browser UI and collaboration graph |
| Rails API | `http://localhost:3000` | Authentication and JSON API |
| PostgreSQL | `localhost:5432` | Data store used by the Rails API |

The client does not connect to PostgreSQL directly. In local development it calls the Rails API under `http://localhost:3000/api/v1`.

## Tested runtime

- nvm 0.40.8
- Node **v22.23.2**, recorded in `.nvmrc`
- npm **10.9.8**
- Create React App through **react-scripts 5.0.1** (locked in `package-lock.json`)

Node 22 was tested successfully on the fresh Mac: `npm ci` passed and the graph loaded against the restored local API database. A fresh terminal also selected v22.23.2 and npm 10.9.8 through `nvm use`. Node 18 is not required by these results. The production build was subsequently verified on September 22, 2026: `npm run build` compiled successfully with Node v22.23.2 and npm 10.9.8.

## First-time macOS setup

### 1. Install and activate nvm

Check Xcode Command Line Tools with `xcode-select -p`. If missing, run `xcode-select --install` and complete installation before proceeding. Then open a terminal in the client repository:

```bash
cd "$HOME/Projects/NewVisionResearch/alumni_graph_client"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
command -v nvm
```

If nvm is missing, install the version used for this setup from the official `nvm-sh/nvm` repository:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh \
  | PROFILE="$HOME/.zshrc" bash
```

Activate it in the current terminal:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm --version
```

Expect `0.40.8` for this installation. During the validated setup the installer reported writing startup lines to `~/.zprofile`; verify fresh-terminal behavior below instead of assuming nvm is loaded automatically.

### 2. Select the tested Node version

The existing `.nvmrc` contains `v22.23.2`:

```bash
cat .nvmrc
nvm install
nvm use
node -v
npm -v
which node
```

Expect Node `v22.23.2`, npm `10.9.8`, and a Node path under `~/.nvm/versions/node/v22.23.2/bin/`. `.nvmrc` selects Node, not npm independently. Investigate a version mismatch before installing dependencies. For an older checkout without `.nvmrc`, run `nvm install 22.23.2` and `nvm use 22.23.2`; after verification, create the missing pin with `node -v > .nvmrc`. Do not overwrite an existing pin without reviewing it.

### 3. Install locked dependencies and configure the API

```bash
npm ci
```

Keep `package-lock.json`. `npm ci` replaces existing `node_modules` and installs the locked dependencies; no separate deletion is needed. If installation fails, inspect the error before changing dependencies or the lockfile.

Create or retain a local client `.env` with:

```dotenv
REACT_APP_BASE_URL=http://localhost:3000/api/v1
```

`REACT_APP_*` settings are browser-visible. Never copy API credentials into the client environment. Restart the development server after changing `.env`.

### 4. Start the development server

Leave PostgreSQL and the Rails API running, then use a separate client terminal:

```bash
HOST=localhost PORT=3001 npm start
```

Open `http://localhost:3001/graph/1` to check the collaboration graph against the restored database. Rails uses port 3000; the client uses 3001. The development server reloads when source files change.

### 5. Check the production build

Stop the client server with Ctrl+C, then run:

```bash
node -v
npm -v
npm run build
```

This creates the local production bundle in `build/`; it does not deploy. Record the result and any warnings separately from the successful development-server check. If it fails, investigate before updating dependencies. Restart development with `HOST=localhost PORT=3001 npm start` when needed.

### 6. Verify a fresh terminal

Open a new terminal (including a new VS Code terminal) without manually sourcing nvm:

```bash
cd "$HOME/Projects/NewVisionResearch/alumni_graph_client"
command -v nvm
nvm use
node -v
npm -v
```

Expected: `nvm`, Node `v22.23.2`, and npm `10.9.8`. If nvm is absent, ensure these lines appear once in `~/.zshrc`, which interactive zsh terminals read, then reopen the terminal:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

A login shell also reads `~/.zprofile`; loading nvm only there may miss some interactive terminals.

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

### A prerequisite command is not found

- `nvm`: follow the activation and fresh-terminal checks above. Use `command -v nvm` because nvm is a shell function.
- `node` or `npm`: run `nvm install` and `nvm use` from this repository, then check versions and `which node`.
- `git` or compiler tools during setup: finish the Xcode Command Line Tools installation.
- API prerequisites such as `brew`, `rbenv`, `bundle`, or PostgreSQL tools: follow the companion API README's first-time macOS setup.

### `SemVer is not a constructor`

This startup error was previously observed under Node 26. That observation does not prove a single cause or establish a Node 18 requirement. Return to the tested Node version and reinstall the locked dependencies:

```bash
nvm use
node -v
npm -v
npm ci
HOST=localhost PORT=3001 npm start
```

Expect v22.23.2 and npm 10.9.8. If the error persists, preserve the full error and inspect the runtime and dependency installation. Do not delete `package-lock.json`, run `npm audit fix --force`, or upgrade `react-scripts` as a routine setup fix.

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

## Functional validation — September 22, 2026

Login succeeded for the lab 1 (NewVisionResearch) admin account and opened the dashboard. A single **Fetch New Publications** operation for Rebecca A. Melrose (local alumn 111) completed through the browser, Rails, local Redis, Sidekiq, and PubMed. Sidekiq reported completion in approximately 1.9 seconds; job status was `complete`, progress was 1 of 1, and the dashboard returned to the publication list. SQL confirmed that the researcher remained in lab 1 with one publication. This validates the existing-query refresh path, not researcher creation/editing, large batches, mail, automated tests, or deployment.

The test used database `localhost` through `/tmp:5432` and Redis `redis://127.0.0.1:6379/0`. A private local database backup was created before the refresh. The test worker was stopped afterward; the local web application and Redis remained running. No application code was changed or committed.

## Releasing changes

See [RELEASE.md](RELEASE.md) for the inspected hosting configuration, staging prerequisites, focused-commit workflow, release checks, and rollback procedure. Hosted staging is not yet provisioned.
