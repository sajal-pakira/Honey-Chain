# HoneyChain — Consumer QR Verification Web App (`/consumer-web`)

## Overview

The consumer-facing verification web app for **HoneyChain** (SIH 2026 Problem Statement 26021).

When a consumer buys a jar of KVIC honey and scans the printed QR code, they are taken directly to:
```
https://honeychain.org/verify/[batchId]
```
(or `http://localhost:3000/verify/BATCH-2026-KVIC-001` in local development).

---

## Key Features & Structure

1. **Verdict-First Hero**: Instant, proud confirmation of authenticity (certified unadulterated raw honey) rather than a confusing data table.
2. **Origin Story**: Beekeeper portrait, name, rural apiary coordinates, harvest date, and specific floral source.
3. **Quality & Lab Purity**: Moisture %, purity score, HMF freshness score, and C4 corn/cane sugar adulteration test results certified by KVIC Central Laboratories.
4. **Blockchain Proof**: Truncated cryptographic hash and direct tappable link to Polygonscan Amoy testnet.
5. **Royalty Transparency Panel (Core Differentiator)**: Shows the economic breakdown between the farm-gate procurement price (e.g. ₹320/kg) and retail shelf price (₹950/kg), highlighting the 15% royalty returned to the rural beekeeper.
6. **Zero-Failure Standalone Demo**: Automatically queries the FastAPI backend (`GET /batches/{batch_id}`); if offline, it seamlessly falls back to pre-seeded authentic mock batches (`BATCH-2026-KVIC-001`, `BATCH-2026-KVIC-002`, `BATCH-2026-KVIC-003`).

---

## Running Locally

```bash
cd consumer-web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) or directly [http://localhost:3000/verify/BATCH-2026-KVIC-001](http://localhost:3000/verify/BATCH-2026-KVIC-001).
