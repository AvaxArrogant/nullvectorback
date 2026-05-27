# PulseShield.io

PulseShield is a PulseChain-native AI DeFi audit intelligence system with a live contract risk scanner for PulseShield.io.

## Run locally

```powershell
npm.cmd run dev
```

Then open `http://localhost:3000`.

## Build

```powershell
npm.cmd run build
```

The app is a Next.js interface with Tailwind CSS, Framer Motion, Recharts, React Flow, and Lucide icons.

## Backend scan API

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/scan -Method Post -ContentType 'application/json' -Body (@{
  address='0xA1077a294dde1B09bb078844df40758a5D0f9a27'
  chain='PulseChain'
  projectType='Token'
} | ConvertTo-Json)
```

The backend performs live JSON-RPC bytecode reads, ERC-1967 proxy slot checks, token metadata calls, owner/getOwner calls, explorer source lookup, deterministic source/bytecode heuristic scanning, severity scoring, evidence-based findings, and disclaimer-safe report generation.

Optional environment overrides:

```powershell
$env:PULSECHAIN_RPC_URL='https://your-rpc.example'
$env:PULSECHAIN_EXPLORER_API='https://scan.pulsechain.com/api'
```

Health check: `http://localhost:3000/api/health`.

Market intelligence:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/market -Method Post -ContentType 'application/json' -Body (@{
  address='0xA1077a294dde1B09bb078844df40758a5D0f9a27'
  chain='PulseChain'
} | ConvertTo-Json)
```

The market endpoint uses DexScreener token-pair data to rank active trading pairs, summarize live price/liquidity/volume/trade-flow, generate chart-ready market data, and attach market-context warnings.

Community trust voting:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/community?target=0xA1077a294dde1B09bb078844df40758a5D0f9a27"

Invoke-RestMethod -Uri http://localhost:3000/api/community/profile -Method Post -ContentType 'application/json' -Body (@{
  address='0x0000000000000000000000000000000000000001'
  displayName='PulseAuditor'
} | ConvertTo-Json)

Invoke-RestMethod -Uri http://localhost:3000/api/community/vote -Method Post -ContentType 'application/json' -Body (@{
  address='0x0000000000000000000000000000000000000001'
  target='0xA1077a294dde1B09bb078844df40758a5D0f9a27'
  vote='Needs Manual Review'
  note='Proxy admin should be reviewed before deposits.'
} | ConvertTo-Json)
```

The community system persists wallet profiles, unique display names, one weighted vote per wallet per contract, admin trust badges, suspicious-account penalties, vote-note moderation, delegated admin/moderator roles, and aggregate trust scores. The frontend uses RainbowKit/Wagmi for wallet login on PulseChain. Set `PULSESHIELD_DATA_DIR` to a persistent path in production, protect `PULSESHIELD_ADMIN_KEY`, set `PULSESHIELD_ROOT_ADMIN` to the owner wallet, and add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` for full WalletConnect support.

Feedback submissions:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/feedback -Method Post -ContentType 'application/json' -Body (@{
  category='Feature idea'
  email='optional@example.com'
  message='Add an exportable PDF audit report.'
} | ConvertTo-Json)
```

`/api/feedback` relays site feedback and feature requests to `contact@pulseshield.io` when SMTP variables are configured. Keep `SMTP_PASS` only in local/VPS environment files, never in git.

## Put it online for browser testing

Recommended: Vercel, because this is a Next.js app with API routes.

1. Create a GitHub repo and push this project.
2. Import the repo at `https://vercel.com/new`.
3. Vercel should detect Next.js automatically.
4. Add environment variables from `.env.example`:
   - `PULSECHAIN_RPC_URL`
   - `PULSECHAIN_EXPLORER_API`
   - `PULSESHIELD_DATA_DIR`
   - `PULSESHIELD_ADMIN_KEY`
   - `PULSESHIELD_ROOT_ADMIN`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `FEEDBACK_TO_EMAIL`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
5. Deploy.

After deploy, test:

- `https://your-app.vercel.app`
- `https://your-app.vercel.app/api/health`

The live scan backend is server-side, so `/api/scan` will work from the hosted app as long as the RPC/explorer endpoints are reachable from Vercel.

## Host on an Ubuntu VPS

This repo also includes a Docker/Nginx deployment path for a Hostinger Ubuntu VPS:

- [Dockerfile](./Dockerfile)
- [docker-compose.yml](./docker-compose.yml)
- [Nginx template](./deploy/nginx-pulseshield.conf)
- [Ubuntu VPS runbook](./deploy/ubuntu-24-vps.md)

The VPS setup runs PulseShield and its backend API routes as one production service on `127.0.0.1:3000`, then exposes it through Nginx with HTTPS at `https://pulseshield.io`.
