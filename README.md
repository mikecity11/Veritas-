# Veritas

Veritas is an evidence-first research assistant MVP for asking a question, reviewing source-backed findings, and preserving a compact verification record. It is intentionally designed with a modular on-chain boundary: the web app works locally today and the included GenLayer Intelligent Contract is ready to deploy through GenLayer Studio when you choose an environment.

## What is included

- React + Vite interface with a distinctive temporary **V** mark (replaceable in `frontend/src/components/BrandMark.jsx`)
- Node + Express API that gathers free-first evidence from Wikipedia and Crossref, ranks it, and clearly exposes source links
- A deterministic local verification identifier (SHA-256) for each research response
- GenLayer Python contract for anchoring a verification record hash and retrieving it
- Unit tests, environment examples, Windows setup, and deployment notes

## Windows quick start

Install [Node.js 20+](https://nodejs.org/) (LTS recommended), then open PowerShell in this project folder:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:8787`.

To make a production frontend bundle:

```powershell
npm run build
```

To run tests:

```powershell
npm test
```

## Environment

The backend reads the root `.env` automatically. `GENLAYER_CONTRACT_ADDRESS` and `GENLAYER_RPC_URL` are deliberately optional until a GenLayer environment is chosen. Do not commit a real private key or secrets.

## GenLayer contract

The contract lives in `contracts/VeritasRegistry.py`. It uses only documented GenLayer contract primitives: `gl.Contract`, typed state, and `@gl.public.view` / `@gl.public.write` methods. It does not require the backend to hold wallet credentials.

1. Open [GenLayer Studio](https://studio.genlayer.com/), or initialize the official CLI environment (`npm install -g genlayer`, then `genlayer init`).
2. Create/import `contracts/VeritasRegistry.py`.
3. Deploy with the constructor's `initial_admin` value set to the address authorized to record hashes.
4. Put the resulting address in `.env` as `GENLAYER_CONTRACT_ADDRESS`.

The MVP currently produces an anchor-ready hash in the API response. The final transaction submission should be added only after selecting network, wallet custody, and the official client/CLI version. This prevents hidden-key storage or fabricated SDK usage.

## Architecture

`frontend` → `backend /api/research` → free public source adapters → ranked evidence + local verification hash

`contracts` is independent: an authorized client can call `record_anchor(hash, claim)` to anchor the generated hash.

SQLite is intentionally a later upgrade. Add it behind a repository interface once you need accounts, saved workspaces, rate-limits, or a durable audit trail.

## Deploy on Vercel (easiest)

1. Create a new GitHub repository and upload this project (do not upload `node_modules`).
2. At [vercel.com/new](https://vercel.com/new), sign in with GitHub, choose that repository, and click **Deploy**.
3. Do not add `VITE_API_URL` in Vercel. The included `api/research.js` function is served at the same address as the frontend.

Vercel will use `vercel.json` to build the Vite frontend and deploy the evidence API. If you later add a database or signing key, put it in Vercel's Environment Variables—not in the repository.

## Deployment notes

- Deploy `frontend/dist` to Vercel, Netlify, or Cloudflare Pages. Set `VITE_API_URL` to the public API URL during build.
- Deploy `backend` to Render, Railway, Fly.io, or a container host. Set `CLIENT_ORIGIN` to the deployed frontend origin.
- Keep GenLayer signing outside the public browser. Prefer an explicit user wallet flow or a narrowly-scoped server signer held in the host secret store.
- Public sources can change or rate-limit. A production version should add source allowlists, caching, source-specific terms review, and a persistence layer.

## Project layout

```
frontend/    React experience
backend/     Express research API and source adapters
contracts/   GenLayer Intelligent Contract
docs/        integration and product decisions
```
